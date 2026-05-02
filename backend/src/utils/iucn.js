import { threatCodes } from "../data/threats.v3_3.js"
import NotFoundError from "../errors/not-found.js"
import ExternalAPIError from "../errors/external-api.js"

const isGlobalAssessment = assessment => {
    const scopesArray = Array.isArray(assessment?.scopes) ? assessment.scopes : []
    return scopesArray.some(scope => (scope?.description?.en || '').trim().toLowerCase() === 'global')
}

export const getLatestAssessmentId = assessments => {
    if (!Array.isArray(assessments)) throw new ExternalAPIError('IUCN returned an unexpected assessment format')
    if (assessments.length === 0) throw new NotFoundError('No IUCN assessment data available for this species')
    const sortedAssessments = [...assessments].sort(
        (a, b) => Number(b?.year_published) - Number(a?.year_published)
    )
    const latestAssessment = sortedAssessments.find(isGlobalAssessment)
        || sortedAssessments.find(assessment => assessment?.latest === true)
        || sortedAssessments[0]
    const assessment_id = latestAssessment?.assessment_id
    if (!assessment_id) throw new ExternalAPIError('IUCN assessment data is missing an assessment id')
    return assessment_id
}

export const vernacularName = array => {
    if (!Array.isArray(array)) return null
    const mainVernacularName = array.find(nameObj => nameObj?.language == 'eng' && nameObj?.main === true)?.name
    return mainVernacularName ?? array.find(nameObj => nameObj?.language == 'eng')?.name ?? null
}

export const getParts = code => {
    const codeArray = code.split('_')
    const parts = codeArray.map((_, i) => codeArray.slice(0, i + 1).join('_'))
    const labels = parts.map(part => threatCodes[part]).filter(Boolean)
    return labels
}

export const getInfo = threat => {
    return {
        scope: threat?.scope || '-',
        timing: threat?.timing || '-',
        severity: threat?.severity || '-'
    }
}