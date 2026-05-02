import { fetchJson } from "../utils/fetchJson.js"

export const fetchLatestAssessment = async (assessmentId) => {
    const url = `https://api.iucnredlist.org/api/v4/assessment/${encodeURIComponent(assessmentId)}`
    const iucnAssessmentData = await fetchJson(url, { headers: {'Authorization': `Bearer ${process.env.IUCN_TOKEN}`} }, 'iucn api')
    return iucnAssessmentData
}