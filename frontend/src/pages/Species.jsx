import { useEffect, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { SpeciesHero } from '../components/SpeciesHero'
import { NavBar } from '../components/NavBar'
import { TaxonomySection } from '../components/TaxonomySection'
import { GeographicRange } from '../components/GeographicRange'
import { PopulationSection } from '../components/PopulationSection'
import { HabitatSection } from '../components/HabitatSection'
import { ThreatsSection } from '../components/ThreatsSection'
import { ConservationSection } from '../components/ConservationSection'
import { HelpSection } from '../components/HelpSection'

export function Species() {
    const { scientificName } = useParams()
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('q')?.trim() ?? ''
    const searchPage = Number(searchParams.get('page'))
    const [species, setSpecies] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [requestCount, setRequestCount] = useState(0)
    const speciesHeadingRef = useRef(null)
    const [open, setOpen] = useState({
        population: false,
        range: false,
        habitat: false,
        threats: false,
        conservation: false,
    })

    const homeSearchParams = new URLSearchParams()
    if (searchQuery) homeSearchParams.set('q', searchQuery)
    if (Number.isSafeInteger(searchPage) && searchPage > 1) homeSearchParams.set('page', String(searchPage))
    const homeLocation = homeSearchParams.size > 0 ? `/?${homeSearchParams.toString()}` : '/'

    useEffect(() => {
        if (!species || !window.location.hash) return undefined

        const targetId = decodeURIComponent(window.location.hash.slice(1))
        const frameId = window.requestAnimationFrame(() => {
            document.getElementById(targetId)?.scrollIntoView()
        })

        return () => window.cancelAnimationFrame(frameId)
    }, [species])

    useEffect(() => {
        if (species) speciesHeadingRef.current?.focus()
    }, [species])

    useEffect(() => {
        let cancelled = false
        const controller = new AbortController()
        const timeoutId = window.setTimeout(() => controller.abort(), 15000)

        const speciesFetch = async () => {
            setLoading(true)
            setError(null)
            setSpecies(null)
            document.title = 'Species Tracker | Loading…'

            try {
                const response = await fetch(`/api/species/${encodeURIComponent(scientificName)}`, {
                    signal: controller.signal,
                })
                const data = await response.json().catch(() => null)
                if (!response.ok) {
                    const unavailable = response.status === 404
                    throw new Error(unavailable ? 'not-found' : (data?.error?.message ?? `Request failed (${response.status})`))
                }
                if (!cancelled) {
                    const speciesPageData = data?.speciesPageData ?? null
                    setSpecies(speciesPageData)
                    const title = speciesPageData?.hero?.vernacular_name || speciesPageData?.hero?.scientific_name || scientificName
                    document.title = `${title} | Species Tracker`
                }
            } catch (requestError) {
                if (cancelled) return
                if (requestError.name === 'AbortError') {
                    setError({
                        title: 'Species data is taking too long to load',
                        message: 'Please check your connection and try again.',
                    })
                } else if (requestError.message === 'not-found') {
                    setError({
                        title: 'No species record was found',
                        message: 'This species may not have a published assessment in the available data sources.',
                    })
                } else {
                    setError({
                        title: 'Species data is unavailable',
                        message: 'The record could not be loaded right now. Please try again.',
                    })
                }
                document.title = 'Species Tracker | Unavailable'
            } finally {
                if (!cancelled) setLoading(false)
                window.clearTimeout(timeoutId)
            }
        }

        speciesFetch()
        return () => {
            cancelled = true
            controller.abort()
            window.clearTimeout(timeoutId)
        }
    }, [scientificName, requestCount])

    const toggle = (key) => setOpen((previous) => ({ ...previous, [key]: !previous[key] }))
    const retry = () => setRequestCount((count) => count + 1)

    if (loading) {
        return (
            <main className="container page-state py-5" aria-live="polite">
                <div className="card">
                    <div className="card-body d-flex align-items-center gap-3" role="status">
                        <div className="spinner-border" aria-hidden="true" />
                        <div>
                            <h1 className="h4 mb-1">Loading species data</h1>
                            <p className="mb-0 text-secondary">Preparing the latest available assessment.</p>
                        </div>
                    </div>
                </div>
            </main>
        )
    }

    if (error || !species) {
        const unavailable = error ?? {
            title: 'Species data is unavailable',
            message: 'The record could not be loaded right now. Please try again.',
        }
        return (
            <main className="container page-state py-5">
                <section className="alert alert-danger" role="alert" aria-labelledby="species-error-title">
                    <h1 id="species-error-title" className="h4">{unavailable.title}</h1>
                    <p className="mb-3">{unavailable.message}</p>
                    <div className="d-flex flex-wrap gap-2">
                        <button className="btn btn-outline-danger" type="button" onClick={retry}>Try again</button>
                        <Link className="btn btn-outline-secondary" to={homeLocation}>Back to search</Link>
                    </div>
                </section>
            </main>
        )
    }

    return (
        <main className="species-page">
            <div className="species-back-link">
                <Link to={homeLocation}>← Back to search</Link>
            </div>
            <SpeciesHero speciesHero={species.hero} headingRef={speciesHeadingRef} />
            <NavBar />
            <TaxonomySection taxonomy={species.taxonomy} />
            <GeographicRange range={species.geographic_range} open={open.range} onToggle={() => toggle('range')} />
            <PopulationSection population={species.population} open={open.population} onToggle={() => toggle('population')} />
            <HabitatSection habitat={species.habitat} open={open.habitat} onToggle={() => toggle('habitat')} />
            <ThreatsSection threats={species.threats} open={open.threats} onToggle={() => toggle('threats')} />
            <ConservationSection conservation={species.conservation} open={open.conservation} onToggle={() => toggle('conservation')} />
            <HelpSection projects={species.projects} />
        </main>
    )
}
