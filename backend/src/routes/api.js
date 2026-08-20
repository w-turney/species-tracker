import express from 'express'
import ExternalAPIError from '../errors/external-api.js'
import BadRequestError from '../errors/bad-request.js'
import { fetchJson } from '../utils/fetchJson.js'
import { parseScientificName, formatScientificName } from '../utils/strings.js'
import { getCachedSpecies } from '../services/getCachedSpecies.js'
import { fetchSpeciesSources } from '../services/fetchSpeciesSources.js'
import { getLatestAssessmentId, vernacularName } from '../utils/iucn.js'
import { fetchLatestAssessment } from '../services/fetchLatestAssessment.js'
import { fetchProjects } from '../services/fetchProjects.js'
import { getMapData } from '../services/getMapData.js'
import { buildSpeciesObject } from '../utils/buildSpeciesObj.js'
import { Species } from '../models/Species.js'

const router = express.Router()
const SEARCH_RESULT_LIMIT = 24
const GBIF_SEARCH_LIMIT = 100

const normaliseForMatch = (value = '') => String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const getEnglishVernacularNames = (result) => {
    const englishNames = Array.isArray(result.vernacularNames)
        ? result.vernacularNames
            .filter((name) => String(name?.language || '').toLowerCase().startsWith('en'))
            .map((name) => name.vernacularName)
        : []

    return [...new Set(englishNames.filter(Boolean).map((name) => String(name).trim()))]
}

const isBinomialName = (name) => {
    const words = String(name || '').trim().split(/\s+/)
    return words.length === 2 && words.every(Boolean)
}

const searchScore = (name, query, result) => {
    const normalisedName = normaliseForMatch(name)
    return (
        (normalisedName === query ? 400 : 0) +
        (normalisedName.startsWith(query) ? 200 : 0) +
        (normalisedName.split(' ').includes(query) ? 75 : 0) +
        (result.taxonomicStatus === 'ACCEPTED' ? 20 : 0) -
        normalisedName.length
    )
}

router.get('/search', async (req, res, next) => {
    try {
        const q = String(req.query.q || '').trim()
        if (!q) throw new BadRequestError('Query parameter "q" is required')
        if (q.length > 100) throw new BadRequestError('Search query is too long')

        const pageParam = String(req.query.page ?? '1')
        const requestedPage = /^\d+$/.test(pageParam) ? Number(pageParam) : 1
        const page = Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1

        const url =
            `https://api.gbif.org/v1/species/search` +
            `?q=${encodeURIComponent(q)}` +
            `&qField=VERNACULAR` +
            `&rank=SPECIES` +
            `&higherTaxonKey=1` +
            `&status=ACCEPTED` +
            `&limit=${GBIF_SEARCH_LIMIT}`
        const gbifData = await fetchJson(url, {}, 'GBIF')
        if (!Array.isArray(gbifData?.results)) {
            throw new ExternalAPIError('GBIF returned an unexpected search result format')
        }
        const normalisedQuery = normaliseForMatch(q)
        const rankedResults = gbifData.results
            .filter((result) => result.rank === 'SPECIES')
            .filter((result) => !result.taxonomicStatus || result.taxonomicStatus === 'ACCEPTED')
            .map(r => {
            const scientificName = r.canonicalName || r.scientificName || r.species || ''
            if (!r.key || !isBinomialName(scientificName)) return null

            const matchingName = getEnglishVernacularNames(r)
                .filter((name) => normaliseForMatch(name).includes(normalisedQuery))
                .sort((a, b) => searchScore(b, normalisedQuery, r) - searchScore(a, normalisedQuery, r))[0]

            if (!matchingName) return null

            return {
                key: r.key,
                vernacular_name: matchingName,
                scientific_name: formatScientificName(scientificName),
                score: searchScore(matchingName, normalisedQuery, r),
            }
        })
            .filter(Boolean)
            .sort((a, b) => b.score - a.score || a.vernacular_name.localeCompare(b.vernacular_name))

        const dedupedResults = [...new Map(
            rankedResults.map((species) => [species.scientific_name.toLowerCase(), species])
        ).values()]

        const totalResults = dedupedResults.length
        const totalPages = Math.ceil(totalResults / SEARCH_RESULT_LIMIT)
        const currentPage = totalPages === 0 ? 1 : Math.min(page, totalPages)
        const offset = (currentPage - 1) * SEARCH_RESULT_LIMIT

        return res.json({
            ok: true,
            results: dedupedResults
                .slice(offset, offset + SEARCH_RESULT_LIMIT)
                .map(({ score, ...species }) => species),
            totalResults,
            page: currentPage,
            pageSize: SEARCH_RESULT_LIMIT,
            hasMore: currentPage < totalPages,
        })
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
