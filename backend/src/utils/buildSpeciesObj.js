import striptags from "striptags"
import { kindOf, normaliseYN } from "./strings.js"
import { getParts, getInfo, vernacularName } from "./iucn.js"

const namedEntities = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
}

const decodeHtmlEntities = (value) => String(value)
    .replace(/&#x([\da-f]+);?/gi, (match, hex) => {
        const codePoint = Number.parseInt(hex, 16)
        return Number.isInteger(codePoint) && codePoint <= 0x10FFFF ? String.fromCodePoint(codePoint) : match
    })
    .replace(/&#(\d+);?/g, (match, decimal) => {
        const codePoint = Number.parseInt(decimal, 10)
        return Number.isInteger(codePoint) && codePoint <= 0x10FFFF ? String.fromCodePoint(codePoint) : match
    })
    .replace(/&([a-z]+);/gi, (match, name) => namedEntities[name.toLowerCase()] ?? match)

const normaliseDocumentation = (value) => {
    const withParagraphBreaks = decodeHtmlEntities(value ?? '')
        .replace(/<\/(?:p|div|li|h[1-6])\s*>/gi, '\n\n')
        .replace(/<br\s*\/?\s*>/gi, '\n')

    return striptags(withParagraphBreaks, [], ' ')
        .replace(/\u00a0/g, ' ')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n[ \t]+/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]{2,}/g, ' ')
        .trim()
}

function threatsFrom(iucnAssessmentData = {}) {
     const threats = Array.isArray(iucnAssessmentData?.threats) ? iucnAssessmentData.threats : []
     const seenCodes = new Set()
     const rows = threats.map(threat => {
        const code = String(threat?.code ?? '')
        const name = String(threat?.ias || threat?.virus || threat?.text || '').trim().toLowerCase()
        const key = code.startsWith('8') ? `${code}::${name}` : code
        if (!code || seenCodes.has(key)) return null
        seenCodes.add(key)
        const parts = getParts(code)
        if (parts.includes('Named species') || parts.includes("Named \"species\" (disease)")) {
            const idx = parts.indexOf('Named species') > -1  ? parts.indexOf('Named species') : parts.indexOf("Named \"species\" (disease)")
            const name = threat?.ias || threat?.virus || threat?.text || threat?.description?.en || 'Named species'
            parts[idx] = name
        }
        const info = getInfo(threat)
        return {
            code,
            parts,
            ...info,
        }
     }).filter(Boolean)
    return {
        rows,
        read_more: normaliseDocumentation(iucnAssessmentData?.documentation?.threats)
    }
}

function conservationFrom(iucnAssessmentData = {}) {
    const groups = Array.isArray(iucnAssessmentData?.supplementary_info?.conservation_actions_in_place) ? iucnAssessmentData?.supplementary_info?.conservation_actions_in_place : []
    const conservationActionsInPlace = groups.map(g => ({
        name: g.name,
        actions: (Array.isArray(g.actions) ? g.actions : [])
            .map(action => ({ name: action.name, value: action.value, kind: kindOf(action.value) }))
        }))
    return {
        conservationActionsInPlace,
        read_more: normaliseDocumentation(iucnAssessmentData?.documentation?.measures)
    }
}

export const buildSpeciesObject = (assessment = {}, mapData = null, wikiData = {}, projects = []) => {
    const taxon = assessment.taxon ?? {}
    const status = assessment.red_list_category?.description?.en ?? ''
    const assessment_date = assessment.assessment_date?.split('T')[0] ?? ''
    const scope = Array.isArray(assessment.scopes) ? assessment.scopes[0]?.description?.en ?? '' : ''
    const {kingdom_name, phylum_name, class_name, order_name, family_name, genus_name, species_name} = taxon
    return {
        hero: {
            vernacular_name: vernacularName(assessment.taxon?.common_names) ?? '',
            scientific_name: assessment.taxon?.scientific_name ?? '',
            status,
            assessment_date,
            scope,
            img: wikiData.originalimage?.source || ''
        },
        taxonomy: {
            kingdom_name,
            phylum_name,
            class_name,
            order_name,
            family_name,
            genus_name,
            species_name
        },
        geographic_range: {
            map_data: mapData,
            read_more: normaliseDocumentation(assessment.documentation?.range)
        },
        population: {
            status,
            scope,
            assessment_date,
            population_size: assessment.supplementary_info?.population_size || '—',
            trend: assessment.population_trend?.description?.en || '',
            continuing_decline: assessment.supplementary_info?.population_continuing_decline || '—',
            severely_fragmented: assessment.supplementary_info?.population_severely_fragmented || '—',
            read_more: normaliseDocumentation(assessment.documentation?.trend_justification || assessment?.documentation?.population)
        },
        habitat: {
            systems: Array.isArray(assessment.systems) ? [... new Set(assessment.systems.map(system => system?.description?.en).filter(Boolean))] : [],
            types: Array.isArray(assessment.habitats) ? [... new Set(assessment.habitats.map(habitatObj => (String(habitatObj?.description?.en) || '')).map(habitat => habitat.split(/\s-\s/)[0]).filter(Boolean))] : [],
            continuing_decline: normaliseYN(assessment.supplementary_info?.continuing_decline_in_area),            
            read_more: normaliseDocumentation(assessment.documentation?.habitats)
        },
        threats: threatsFrom(assessment),
        conservation: conservationFrom(assessment),
        projects
    }
}
