import { fetchJson } from '../utils/fetchJson.js'

export const fetchSpeciesSources = async (genus, species) => {
    const iucnSpeciesUrl =
        `https://api.iucnredlist.org/api/v4/taxa/scientific_name?genus_name=${genus}&species_name=${species}`
    const wikiUrl =
        `https://en.wikipedia.org/api/rest_v1/page/summary/${genus}_${species}`
    const iucnToken = process.env.IUCN_TOKEN
    const iucnSpeciesData = await fetchJson(iucnSpeciesUrl, { headers: { 'Authorization': `Bearer ${iucnToken}` } }, 'IUCN API')
    
    let wikiData = {}
    try {
        wikiData = await fetchJson(wikiUrl, {}, 'Wikipedia API')
    } catch (err) {
        console.error('Wikipedia fetch failed', err.message)
    }

    return { wikiData, iucnSpeciesData }
}