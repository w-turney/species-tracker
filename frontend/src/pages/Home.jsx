import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import '../css/Home.css'
import { ResultCard } from '../components/ResultCard'

const readPage = (value) => {
    const page = /^\d+$/.test(value ?? '') ? Number(value) : 1
    return Number.isSafeInteger(page) && page > 0 ? page : 1
}

export function Home() {
    const [searchParams, setSearchParams] = useSearchParams()
    const submittedQuery = searchParams.get('q')?.trim() ?? ''
    const requestedPage = readPage(searchParams.get('page'))
    const [searchQuery, setSearchQuery] = useState(submittedQuery)
    const [results, setResults] = useState(null)
    const [resultMeta, setResultMeta] = useState({ totalResults: 0, page: 1, pageSize: 0 })
    const [loadedPage, setLoadedPage] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [retryCount, setRetryCount] = useState(0)
    const resultsHeadingRef = useRef(null)
    const lastLoadedPageRef = useRef(requestedPage)

    const activePage = resultMeta.page || requestedPage
    const totalPages = resultMeta.pageSize > 0 ? Math.ceil(resultMeta.totalResults / resultMeta.pageSize) : 0
    const firstResult = results?.length > 0 ? (activePage - 1) * resultMeta.pageSize + 1 : 0
    const lastResult = results?.length > 0 ? firstResult + results.length - 1 : 0

    useEffect(() => {
        document.title = 'Species Tracker | Search'
    }, [])

    useEffect(() => {
        setSearchQuery(submittedQuery)

        if (!submittedQuery) {
            setResults(null)
            setError(null)
            setLoading(false)
            setResultMeta({ totalResults: 0, page: 1, pageSize: 0 })
            setLoadedPage(null)
            return undefined
        }

        const controller = new AbortController()
        let cancelled = false
        const timeoutId = window.setTimeout(() => controller.abort(), 10000)

        const search = async () => {
            setError(null)
            setResults(null)
            setLoadedPage(null)
            setLoading(true)

            try {
                const response = await fetch(`/api/search?q=${encodeURIComponent(submittedQuery)}&page=${requestedPage}`, {
                    signal: controller.signal,
                })
                const data = await response.json().catch(() => null)
                if (!response.ok) throw new Error(data?.error?.message ?? `Request failed (${response.status})`)

                if (!cancelled) {
                    setResults(Array.isArray(data?.results) ? data.results : [])
                    setResultMeta({
                        totalResults: Number(data?.totalResults) || 0,
                        page: Number(data?.page) || requestedPage,
                        pageSize: Number(data?.pageSize) || 0,
                    })
                    setLoadedPage(Number(data?.page) || requestedPage)
                }
            } catch (requestError) {
                if (cancelled) return
                if (requestError.name === 'AbortError') {
                    setError('The search took too long. Please try again.')
                } else {
                    setError('Search results could not be loaded. Please try again.')
                }
            } finally {
                if (!cancelled) setLoading(false)
                window.clearTimeout(timeoutId)
            }
        }

        search()
        return () => {
            cancelled = true
            controller.abort()
            window.clearTimeout(timeoutId)
        }
    }, [submittedQuery, requestedPage, retryCount])

    useEffect(() => {
        if (!loading && loadedPage !== null && Array.isArray(results) && results.length > 0) {
            if (lastLoadedPageRef.current !== loadedPage) {
                resultsHeadingRef.current?.focus()
            }
            lastLoadedPageRef.current = loadedPage
        }
    }, [loadedPage, loading, results])

    const setSearchPage = (query, page) => {
        const nextParams = { q: query }
        if (page > 1) nextParams.page = String(page)
        setSearchParams(nextParams)
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const query = searchQuery.trim()
        if (!query) return

        if (query === submittedQuery && requestedPage > 1) {
            setSearchPage(query, 1)
            return
        }

        if (query === submittedQuery) {
            setRetryCount((count) => count + 1)
            return
        }

        setSearchPage(query, 1)
    }

    const retrySearch = () => setRetryCount((count) => count + 1)
    const goToPage = (page) => {
        if (loading || page < 1 || page > totalPages || page === activePage) return
        setSearchPage(submittedQuery, page)
    }

    return (
        <main className="home-page">
            <section className="search-hero" aria-labelledby="search-page-title">
                <div className="home-content">
                    <p className="text-uppercase text-secondary fw-semibold mb-2">Species conservation data</p>
                    <h1 id="search-page-title">Species Conservation Status Tracker</h1>
                    <p id="search-help" className="search-help">
                        Search by an English common name to view the latest available assessment details.
                    </p>
                    <form className="search-form" onSubmit={handleSubmit} role="search">
                        <label htmlFor="search-input" className="visually-hidden">Search species by common name</label>
                        <input
                            id="search-input"
                            className="form-control"
                            type="search"
                            placeholder="For example, ring-tailed lemur"
                            required
                            value={searchQuery}
                            aria-describedby="search-help"
                            aria-busy={loading}
                            onChange={(event) => setSearchQuery(event.target.value)}
                        />
                        <button className="btn btn-primary" type="submit" disabled={loading}>
                            {loading ? 'Searching…' : 'Search'}
                        </button>
                    </form>
                </div>
            </section>

            <section className="search-results" aria-label="Search results">
                <div className="home-content">
                    {loading && (
                        <div className="state-message" role="status" aria-live="polite">
                            <div className="spinner-border spinner-border-sm" aria-hidden="true" />
                            <span>Searching for “{submittedQuery}”…</span>
                        </div>
                    )}

                    {error && (
                        <div className="alert alert-danger d-flex flex-wrap align-items-center justify-content-between gap-3" role="alert">
                            <span>{error}</span>
                            <button className="btn btn-outline-danger btn-sm" type="button" onClick={retrySearch}>
                                Retry search
                            </button>
                        </div>
                    )}

                    {!loading && !error && Array.isArray(results) && results.length === 0 && (
                        <div className="empty-state" role="status" aria-live="polite">
                            <h2 id="search-results-heading" className="h4">No matching species found</h2>
                            <p className="mb-0">Try a different English common name, or make the search more specific.</p>
                        </div>
                    )}

                    {!loading && !error && Array.isArray(results) && results.length > 0 && (
                        <>
                            <div className="search-results-heading">
                                <h2 id="search-results-heading" ref={resultsHeadingRef} tabIndex="-1">Search results</h2>
                                <p className="text-secondary mb-0">
                                    Showing {firstResult}–{lastResult} of {resultMeta.totalResults} result{resultMeta.totalResults === 1 ? '' : 's'} for “{submittedQuery}”.
                                </p>
                            </div>
                            <div className="result-grid">
                                {results.map((result) => (
                                    <ResultCard
                                        key={result.scientific_name}
                                        result={result}
                                        searchQuery={submittedQuery}
                                        searchPage={activePage}
                                    />
                                ))}
                            </div>
                            {totalPages > 1 && (
                                <nav className="search-pagination" aria-label="Search result pages">
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        disabled={loading || activePage === 1}
                                        onClick={() => goToPage(activePage - 1)}
                                    >
                                        Previous
                                    </button>
                                    <p className="mb-0" aria-live="polite">Page {activePage} of {totalPages}</p>
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        disabled={loading || activePage === totalPages}
                                        onClick={() => goToPage(activePage + 1)}
                                    >
                                        Next
                                    </button>
                                </nav>
                            )}
                        </>
                    )}
                </div>
            </section>
        </main>
    )
}
