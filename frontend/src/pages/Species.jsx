import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Link } from 'react-router-dom'
import { SpeciesHero } from "../components/SpeciesHero"
import { NavBar } from "../components/NavBar"
import { TaxonomySection } from "../components/TaxonomySection"
import { GeographicRange } from '../components/GeographicRange'
import { PopulationSection } from "../components/PopulationSection"
import { HabitatSection } from "../components/HabitatSection"
import { ThreatsSection } from "../components/ThreatsSection"
import { ConservationSection } from "../components/ConservationSection"
import { HelpSection } from "../components/HelpSection"
import '../css/section.css'

export function Species() {

    const { scientificName } = useParams()
    const [species, setSpecies] = useState(null)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(true)
    const [open, setOpen] = useState({
        population: false,
        range: false,
        habitat: false,
        threats: false,
        conservation: false
    })

    useEffect(() => {
        let cancelled = false
        const controller = new AbortController()
        const timeoutMs = 15000
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs)

        const speciesFetch = async () => {
            setLoading(true)
            setError(null)
            setSpecies(null)
            try {
                const res = await fetch(`/api/species/${encodeURIComponent(scientificName)}`, {
                    signal: controller.signal
                })
                const data = await res.json().catch(() => null)
                if (!res.ok) {
                    throw new Error(data?.error?.message ?? `Request failed (${res.status})`)
                }
                if (!cancelled) {
                    setSpecies(data?.speciesPageData ?? null)
                }
            } catch (err) {
                if (cancelled) return
                if (err.name === 'AbortError') {
                    setError('Request timed out')
                } else {
                    setError('Species fetch failed')
                }
            } finally {
                if (!cancelled) {
                    setLoading(false)
                }
                clearTimeout(timeoutId)
            }
        }
        speciesFetch()
        return () => {
            cancelled = true
            controller.abort()
            clearTimeout(timeoutId)
        }
    }, [scientificName])

    const toggle = key => {
        setOpen(prev => ({ ...prev, [key]: !prev[key] }))
    }
    if (loading) return (
        <div className="d-flex align-items-center gap-2" role="status">
            <div className="spinner-border spinner-border-sm" aria-hidden="true"></div>
            <span>Loading...</span>
        </div>
    )
    if (error) return (
        <div className="alert alert-danger" role="alert">
            {error}
        </div>
    )
    if (!species) return <p>Whoops, something went wrong!</p>
    return (
        <>
            <Link to='/' className='result-link'>
                <div>Home🏠</div>
            </Link>
            <SpeciesHero speciesHero={species.hero} />
            <NavBar />
            <TaxonomySection taxonomy={species.taxonomy} />
            <GeographicRange range={species.geographic_range} open={open.range} onToggle={() => toggle('range')} />
            <PopulationSection population={species.population} open={open.population} onToggle={() => toggle('population')} />
            <HabitatSection habitat={species.habitat} open={open.habitat} onToggle={() => toggle('habitat')} />
            <ThreatsSection threats={species.threats} open={open.threats} onToggle={() => toggle('threats')} />
            <ConservationSection conservation={species.conservation} open={open.conservation} onToggle={() => toggle('conservation')} />
            <HelpSection projects={species.projects} />
        </>
    )
}