import { ReadMore } from './ReadMore'
import { displayValue } from '../utils/text'

const DetailList = ({ items }) => (
    items.length > 0 ? (
        <ul className="list-unstyled mb-0 detail-list">
            {items.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
        </ul>
    ) : <p className="text-secondary mb-0">Not available</p>
)

export function HabitatSection({ habitat = {}, open, onToggle }) {
    const systems = Array.isArray(habitat.systems) ? habitat.systems : []
    const types = Array.isArray(habitat.types) ? habitat.types : []

    return (
        <section id="habitat" className="species-section" aria-labelledby="habitat-title">
            <div className="section-content">
                <h2 id="habitat-title" className="section-heading">Habitat</h2>
                <div className="border rounded-3 p-3 p-md-4">
                    <div className="row g-4">
                        <div className="col-12 col-md-6 col-xl-4">
                            <h3 className="h5 mb-3">Systems</h3>
                            <DetailList items={systems} />
                        </div>
                        <div className="col-12 col-md-6 col-xl-4">
                            <h3 className="h5 mb-3">Habitat types</h3>
                            <DetailList items={types} />
                        </div>
                        <div className="col-12 col-xl-4">
                            <h3 className="h5 mb-3">Habitat status</h3>
                            <dl className="mb-0 data-list">
                                <dt>Continuing decline in area, extent or quality</dt>
                                <dd>{displayValue(habitat.continuing_decline)}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <ReadMore
                    open={open}
                    onToggle={onToggle}
                    read_more={habitat.read_more}
                    sectionId="habitat"
                    sectionTitle="habitat"
                />
            </div>
        </section>
    )
}
