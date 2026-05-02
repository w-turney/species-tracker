import '../css/NavBar.css'

export function NavBar() {
    return (
        <nav className="sticky-navbar sticky-top">
            <div className="container-fluid">
                <ul className="navbar-nav flex-row flex-nowrap justify-content-start justify-content-md-around w-100 overflow-x-auto">
                    <li className="nav-item">
                        <a className="nav-link text-nowrap" href="#taxonomy">Taxonomy</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-nowrap" href="#geographic-range">Geographic Range</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-nowrap" href="#population">Population</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-nowrap" href="#habitat">Habitat</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-nowrap" href="#threats">Threats</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-nowrap" href="#conservation">Conservation</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link text-nowrap" href="#help">How You Can Help</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}