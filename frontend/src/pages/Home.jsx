import { useState } from "react"
import '../css/Home.css'
import { ResultCard } from "../components/ResultCard"

export function Home() {
    const [searchQuery, setSearchQuery] = useState('')
    const [results, setResults] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (loading) return
        setError(null)
        setLoading(true)
        const controller = new AbortController()
        const timeoutMs = 10000
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
        try {
            const q = searchQuery.trim()
            if (!q) return
            const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
                signal: controller.signal
            })
            const data = await res.json().catch(() => null)
            if (!res.ok) throw new Error(data?.error?.message ?? `Request failed (${res.status})`)
            setResults(Array.isArray(data.results) ? data.results : [])
            setSearchQuery('')
        } catch (err) {
            console.log(err.message)
            setResults([])
            if (err.name === 'AbortError') {
                setError('Request timed out')
            } else {
                setError('Failed to load search results...')
            }
        } finally {
            setLoading(false)
            clearTimeout(timeoutId)
        }
    }
    return (
        <>
            <div className="form-container">
                <h1>Species Conservation Status Tracker</h1>
                <form className="form" onSubmit={handleSubmit}>
                    <label htmlFor="search-input" className="visually-hidden">
                        Search species by common name
                    </label>
                    <input
                        id='search-input'
                        type='text'
                        placeholder='Search a species by common name...'
                        required={true}
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)} />
                    <button type='submit' disabled={loading}>
                        {loading ? 'Searching...' : 'Search'}
                    </button>
                </form>
            </div>
            <div className="status-container">
                {error && (
                    <div className="alert alert-danger" role="alert">
                        {error}
                    </div>
                )}
                {loading && (
                    <div className="d-flex align-items-center gap-2" role="status">
                        <div className="spinner-border spinner-border-sm" aria-hidden="true"></div>
                        <span>Loading...</span>
                    </div>
                )}
                {!error && !loading && Array.isArray(results) && results.length === 0 && (
                    <p>No results found...</p>
                )}
            </div>
            {!error && !loading && Array.isArray(results) && results.length > 0 && (
                <div className="result-container">
                    {results.map(result => <ResultCard key={result.key} result={result} />)}
                </div>
            )}
        </>
    )
}