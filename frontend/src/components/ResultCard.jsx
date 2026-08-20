import { Link } from 'react-router-dom'
import '../css/ResultCard.css'

export function ResultCard({ result, searchQuery, searchPage = 1 }) {
    const searchParams = new URLSearchParams()
    if (searchQuery) searchParams.set('q', searchQuery)
    if (searchPage > 1) searchParams.set('page', String(searchPage))
    const search = searchParams.size > 0 ? `?${searchParams.toString()}` : ''

    return (
        <article className='result-card'>
            <Link to={`/species/${encodeURIComponent(result.scientific_name)}${search}`} className='result-link'>
                <h3>{result.vernacular_name}</h3>
                <p className='mb-0'><em>{result.scientific_name}</em></p>
            </Link>
        </article>
    )
}
