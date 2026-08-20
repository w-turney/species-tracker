import { ReadMore } from './ReadMore'
import { displayValue } from '../utils/text'

export function ConservationSection({ conservation = {}, open, onToggle }) {
    const actionsInPlace = Array.isArray(conservation.conservationActionsInPlace)
        ? conservation.conservationActionsInPlace
        : []

    return (
        <section id="conservation" className="species-section" aria-labelledby="conservation-title">
            <div className="section-content">
                <h2 id="conservation-title" className="section-heading">Conservation actions</h2>
                {actionsInPlace.length === 0 ? (
                    <div className="empty-state" role="status">
                        <p className="mb-0">No structured conservation actions are available for this assessment.</p>
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
                        {actionsInPlace.map((action, index) => {
                            const actionItems = Array.isArray(action.actions) ? action.actions : []
                            return (
                                <div className="col" key={`${action.name ?? 'action'}-${index}`}>
                                    <article className="card h-100">
                                        <div className="card-body d-flex flex-column">
                                            <h3 className="h5 card-title mb-3">{displayValue(action.name)}</h3>
                                            {actionItems.length > 0 ? (
                                                <ul className="mb-0 list-unstyled">
                                                    {actionItems.map((item, itemIndex) => (
                                                        <li className="mb-2" key={`${item.name ?? 'item'}-${itemIndex}`}>
                                                            <span className="fw-semibold">{displayValue(item.name)}: </span>
                                                            <span className={`badge text-bg-${item.kind === 'yes' ? 'success' : item.kind === 'no' ? 'warning' : 'secondary'}`}>
                                                                {displayValue(item.value)}
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : <p className="text-secondary mb-0">No details available.</p>}
                                        </div>
                                    </article>
                                </div>
                            )
                        })}
                    </div>
                )}
                <ReadMore
                    open={open}
                    onToggle={onToggle}
                    read_more={conservation.read_more}
                    sectionId="conservation"
                    sectionTitle="conservation actions"
                />
            </div>
        </section>
    )
}
