import { ReadMore } from './ReadMore'

export function HabitatSection({ habitat, open, onToggle }) {
    const systems = Array.isArray(habitat?.systems) ? habitat.systems : []
    const types = Array.isArray(habitat?.types) ? habitat.types : []
    return (
        <section id="habitat">
            <h2 className="mb-4">Habitat</h2>
            <div className="container-fluid px-4">
                <div className="p-3 border rounded-3 h-100">
                    <div className="row g-3 align-items-stretch">
                        <div className="col-12 col-lg-4">
                            <h5 className="mb-3">System</h5>
                            <ul className="list-unstyled ps-0 mb-0">
                                {systems.map((system, index) => {
                                    return <li key={`${index}-${system}`}>{system}</li>
                                })}
                            </ul>
                        </div>
                        <div className="col-12 col-lg-4">
                            <h5 className="mb-3">Habitat type</h5>
                            <ul className="list-unstyled ps-0 mb-0">
                                {types.map((type, index) => {
                                    return <li key={`${index}-${type}`}>{type}</li>
                                })}
                            </ul>
                        </div>

                        <div className="col-12 col-lg-4">
                            <h5 className="mb-3">Habitat status:</h5>
                            <p className="mb-2">Continuing decline in area, extent or quality:</p>
                            <span>
                                {habitat?.continuing_decline ?? 'Unknown'}
                            </span>
                        </div>
                    </div>
                </div>
                <ReadMore open={open} onToggle={onToggle} read_more={habitat?.read_more} />
            </div>
        </section>
    )
}