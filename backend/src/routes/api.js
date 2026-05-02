import express from 'express'
import ExternalAPIError from '../errors/external-api.js'
import BadRequestError from '../errors/bad-request.js'
import { fetchJson } from '../utils/fetchJson.js'
import { parseScientificName, formatScientificName } from '../utils/strings.js'
import { dedupeArray } from '../utils/arrays.js'
import { getCachedSpecies } from '../services/getCachedSpecies.js'
import { fetchSpeciesSources } from '../services/fetchSpeciesSources.js'
import { getLatestAssessmentId, vernacularName } from '../utils/iucn.js'
import { fetchLatestAssessment } from '../services/fetchLatestAssessment.js'
import { fetchProjects } from '../services/fetchProjects.js'
import { getMapData } from '../services/getMapData.js'
import { buildSpeciesObject } from '../utils/buildSpeciesObj.js'
import { Species } from '../models/Species.js'

const router = express.Router()

router.get('/search', async (req, res, next) => {
    try {
        const q = String(req.query.q || '').trim().toLowerCase()
        if (!q) throw new BadRequestError('Query parameter "q" is required')
        if (q.length > 100) throw new BadRequestError('Search query is too long')
        const url =
            `https://api.gbif.org/v1/species/search` +
            `?q=${encodeURIComponent(q)}` +
            `&qField=VERNACULAR` +
            `&rank=SPECIES` +
            `&higherTaxonKey=1` +
            `&limit=1000`
        const gbifData = await fetchJson(url, {}, 'GBIF')
        if (!Array.isArray(gbifData?.results)) {
            throw new ExternalAPIError('GBIF returned an unexpected search result format')
        }
        const results = gbifData.results
        const filteredResults = results.map(r => {
            const scientificName = r.canonicalName || r.scientificName || r.species || ''
            if (!r.key || !scientificName) return null
            const englishVernacular =
                Array.isArray(r.vernacularNames)
                    ? r.vernacularNames.find(v =>
                        String(v?.language || '').toLowerCase().startsWith('en')
                    )?.vernacularName
                    : null
            return {
                key: r.key,
                vernacular_name: englishVernacular ?? '',
                scientific_name: formatScientificName(scientificName),
            }
        }).filter(Boolean)
        const dedupedResults = dedupeArray(filteredResults, 'scientific_name')
        return res.json({ ok: true, results: dedupedResults })
    } catch (err) {
        return next(err)
    }
})

router.get('/species/:scientificName', async (req, res, next) => {
    try {
        const parsed = parseScientificName(req.params.scientificName)
        if (!parsed) throw new BadRequestError('Invalid scientific name')
        const { scientificName, slug, genus, species } = parsed

        const doc = await getCachedSpecies(slug)
        if (doc) return res.json({ ok: true, speciesPageData: doc.speciesPageData })

        const { iucnSpeciesData, wikiData } = await fetchSpeciesSources(genus, species)

        const assessmentId = getLatestAssessmentId(iucnSpeciesData?.assessments)

        const iucnAssessmentData = await fetchLatestAssessment(assessmentId)

        const commonName = vernacularName(iucnAssessmentData.taxon?.common_names) ?? ''
        const projects = await fetchProjects(commonName)

        const mapData = await getMapData(iucnAssessmentData, scientificName)

        const speciesPageData = buildSpeciesObject(iucnAssessmentData, mapData, wikiData, projects)

        try {
            await Species.updateOne(
                { slug },
                {
                    $set: {
                        slug,
                        iucnSisId: iucnAssessmentData?.sis_taxon_id,
                        lastFetched: new Date(),
                        speciesPageData
                    }
                },
                { upsert: true }
            )
        } catch (err) {
            console.error('Failed to update species cache:', err.message)
        }
        return res.json({
            ok: true,
            speciesPageData,
        })
    } catch (err) {
        return next(err)
    }
})

export default router