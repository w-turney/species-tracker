import { scoreProject } from "../utils/globalGiving.js"
import { fetchJson } from "../utils/fetchJson.js"
import { dedupeArray } from "../utils/arrays.js"

const THEMES = [
    'wildlife', 'env', 'edu', 'animals', 'climate', 'agriculture'
]

const fetchProjectsByTheme = async (q, theme) => {
    const globalGivingToken = process.env.GLOBALGIVING_TOKEN
    const url =
        `https://api.globalgiving.org/api/public/services/search/projects?api_key=${globalGivingToken}&q=${encodeURIComponent(q)}&filter=theme:${theme}`
    const data = await fetchJson(url, { headers: { "Accept": "application/json" } }, 'global giving api')
    const projects = data?.search?.response?.projects?.project ?? []
    return projects.filter(p => p?.active === true)
}

export const fetchProjects = async (searchQuery, themes = THEMES) => {
    let q = String(searchQuery || '').toLowerCase().trim()
    if (!q) return []
    const words = q.split(/\s+/)
    q = words.length > 1 ? words[words.length - 1] : words[0]

    const results = await Promise.allSettled(
        themes.map(theme => fetchProjectsByTheme(q, theme)) 
    )
    
    const fulfilledResults = results
        .filter(result => result.status === 'fulfilled')
        .map(result => result.value)
    
    const failedResults = results
        .filter(result => result.status === 'rejected')
    if (failedResults.length > 0) {
        console.error(
            `${failedResults.length} GlobalGiving request(s) failed`,
            failedResults.map(result => result.reason?.message)
        )
    }

    const flattened = fulfilledResults.flat()
    const deduped = dedupeArray(flattened, 'id')

    return deduped
        .map(p => ({ p, score: scoreProject(p, q) }))
        .filter(obj => obj.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(({ p }) => p)
        .slice(0, 3)
}
