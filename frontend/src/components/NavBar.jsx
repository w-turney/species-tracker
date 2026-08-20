import { useEffect, useState } from 'react'
import '../css/NavBar.css'

const navigationItems = [
    { id: 'taxonomy', label: 'Taxonomy' },
    { id: 'geographic-range', label: 'Geographic range' },
    { id: 'population', label: 'Population' },
    { id: 'habitat', label: 'Habitat' },
    { id: 'threats', label: 'Threats' },
    { id: 'conservation', label: 'Conservation' },
    { id: 'help', label: 'How to help' },
]

export function NavBar() {
    const [activeSection, setActiveSection] = useState(navigationItems[0].id)

    useEffect(() => {
        const updateActiveSection = () => {
            const offset = 120
            let current = navigationItems[0].id

            navigationItems.forEach((item) => {
                const section = document.getElementById(item.id)
                if (section && section.getBoundingClientRect().top <= offset) current = item.id
            })

            setActiveSection(current)
        }

        updateActiveSection()
        window.addEventListener('scroll', updateActiveSection, { passive: true })
        window.addEventListener('resize', updateActiveSection)
        return () => {
            window.removeEventListener('scroll', updateActiveSection)
            window.removeEventListener('resize', updateActiveSection)
        }
    }, [])

    return (
        <nav className="sticky-navbar sticky-top" aria-label="Species sections">
            <div className="sticky-navbar-content">
                <ul className="navbar-nav flex-row flex-nowrap justify-content-start justify-content-md-around overflow-x-auto">
                    {navigationItems.map((item) => (
                        <li className="nav-item" key={item.id}>
                            <a
                                className="nav-link text-nowrap"
                                href={`#${item.id}`}
                                aria-current={activeSection === item.id ? 'location' : undefined}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </nav>
    )
}
