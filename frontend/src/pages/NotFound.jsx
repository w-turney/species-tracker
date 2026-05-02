import { Link } from "react-router-dom"

const NotFound = () => {
    return (
        <main className="container py-5">
            <div className="alert alert-danger" role="alert">
                Page not found.
            </div>

            <Link to="/" className="btn btn-outline-primary">
                Take me home
            </Link>
        </main>
    )
}

export default NotFound