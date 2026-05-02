import { ReadMore } from './ReadMore'

export function ThreatsSection({ threats, open, onToggle }) {
    const rows = Array.isArray(threats?.rows) ? threats.rows : []
    return (
        <section id="threats">
            <h2 className="mb-4">Threats</h2>
            {rows.length === 0 ? (
                <p className="text-muted">No threat data available</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-sm align-middle">
                        <thead>
                            <tr>
                                <th>Threat</th>
                                <th>Timing</th>
                                <th>Scope</th>
                                <th>Severity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((threat, i) => {
                                return (
                                    <tr key={i}>
                                        <td>
                                            {(threat.parts || []).map((part, i) => (
                                                <div key={i} className={i === 0 ? 'fw-semibold' : undefined}>
                                                    {part}
                                                </div>
                                            ))}
                                        </td>
                                        <td>{threat.timing}</td>
                                        <td>{threat.scope}</td>
                                        <td>{threat.severity}</td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            <ReadMore open={open} onToggle={onToggle} read_more={threats?.read_more} />
        </section>
    )
}