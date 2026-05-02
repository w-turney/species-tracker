import { ReadMore } from './ReadMore'

export function ConservationSection({ conservation, open, onToggle }) {
    const actionsInPlace = Array.isArray(conservation?.conservationActionsInPlace) ? conservation.conservationActionsInPlace : []
    return (
        <section id="conservation">
            <h2 className="mb-4">Conservation actions</h2>
            <div className="container-fluid">
                <div className="row row-cols-1 row-cols-md-3 g-3">
                    {actionsInPlace.map((action, i) => {
                        const actionItems = Array.isArray(action.actions) ? action.actions : []
                        return (
                            <div className="col" key={i}>
                                <article className="card h-100">
                                    <div className="card-body d-flex flex-column">
                                        <h3 className="h5 card-title mb-2">{action.name}</h3>
                                        <ul className="mb-0 list-unstyled ps-0">
                                            {actionItems.map((item, i) => {
                                                return (
                                                    <li className="mb-1" key={i}>
                                                        <span className="fw-semibold">{item.name}:</span>
                                                        <span className={`badge text-bg-${item.kind === 'yes' ? 'success' :
                                                            item.kind === 'no' ? 'warning' :
                                                                'secondary'
                                                            }`}>{item.value}</span>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </article>
                            </div>
                        )
                    })}
                </div>
                <ReadMore open={open} onToggle={onToggle} read_more={conservation?.read_more} />
            </div>
        </section >
    )
}