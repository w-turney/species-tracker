import '../css/SpeciesHero.css'
import { conservationStatusClass } from '../utils/status'
import { displayValue } from '../utils/text'

export function SpeciesHero({ speciesHero = {}, headingRef }) {
    const commonName = displayValue(speciesHero.vernacular_name || speciesHero.scientific_name, 'Species record')
    const scientificName = displayValue(speciesHero.scientific_name, '')
    const status = displayValue(speciesHero.status)
    const statusClass = conservationStatusClass(speciesHero.status)

    return (
        <header className="species-hero">
            <div className="species-hero-content">
                <div className="row align-items-center g-4 g-xl-5">
                    <div className="col-md-6">
                        <div className="species-hero-copy">
                            <p className="text-uppercase text-secondary fw-semibold mb-2">Species assessment</p>
                            <h1 className="display-5 mb-2" tabIndex="-1" ref={headingRef}>{commonName}</h1>
                            {scientificName && scientificName !== commonName && (
                                <p className="fs-4 fst-italic text-secondary mb-4">{scientificName}</p>
                            )}
                            <dl className="hero-meta mb-0">
                                <div>
                                    <dt>Conservation status</dt>
                                    <dd><span className={`badge text-bg-${statusClass}`}>{status}</span></dd>
                                </div>
                                <div>
                                    <dt>Last assessed</dt>
                                    <dd>{displayValue(speciesHero.assessment_date)}</dd>
                                </div>
                                <div>
                                    <dt>Assessment scope</dt>
                                    <dd>{displayValue(speciesHero.scope)}</dd>
                                </div>
                            </dl>
                        </div>
                    </div>
                    <div className="col-md-6">
                        {speciesHero.img ? (
                            <img
                                className="species-hero-image"
                                src={speciesHero.img}
                                alt={`Photo of ${commonName}`}
                            />
                        ) : (
                            <div className="species-hero-image species-hero-image--unavailable" role="img" aria-label="Species image unavailable">
                                Image unavailable
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
