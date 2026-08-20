import { Link } from "react-router-dom"
import { useEffect } from 'react'

const NotFound = () => {
    useEffect(() => {
        document.title = 'Page not found | Species Tracker'
    }, [])

    return (
        <main className="container page-state py-5">
            <section className="card" aria-labelledby="not-found-title">
                <div className="card-body">
                    <h1 id="not-found-title" className="h3">Page not found</h1>
                    <p className="text-secondary">The address may be incorrect or the page is no longer available.</p>
                    <Link to="/" className="btn btn-outline-primary">Return to search</Link>
                </div>
            </section>
        </main>
    )
}

export default NotFound
