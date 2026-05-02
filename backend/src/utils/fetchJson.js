import ExternalAPIError from "../errors/external-api.js"

export const fetchJson = async (url, options = {}, label = 'external API', timeOutMs = 15000) => {
    const controller = new AbortController()
    const timeOutId = setTimeout(() => controller.abort(), timeOutMs)

    try {
        const res = await fetch(url, {
            ...options,
            signal: controller.signal
        })

        let data
        try {
            data = await res.json()
        } catch (err) {
            if (res.ok) throw new ExternalAPIError(`${label} returned invalid json`)
        }

        if (!res.ok) {
            console.error(`${label} failed`, res.status, data)
            throw new ExternalAPIError(`${label} request failed`)
        }
        return data
    } catch (err) {
        if (err.name === 'AbortError') throw new ExternalAPIError(`${label} request timed out`)
        if (err instanceof ExternalAPIError) throw err
        throw new ExternalAPIError(`Could not reach ${label}`)
    } finally {
        clearTimeout(timeOutId)
    }
}