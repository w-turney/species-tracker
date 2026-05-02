import { Link } from 'react-router-dom'
import '../css/ResultCard.css'

export function ResultCard({ result }) {
    return (
        <Link to={`/species/${encodeURIComponent(result.scientific_name)}`} className='result-link'>
            <div className='result-card'>
                <h2>{result.vernacular_name}</h2>
                <p>{result.scientific_name}</p>
            </div>
        </Link>
    )
}