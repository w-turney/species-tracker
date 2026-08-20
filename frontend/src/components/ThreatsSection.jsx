import { ReadMore } from './ReadMore'
import { displayValue } from '../utils/text'

const ThreatTitle = ({ parts = [] }) => (
    <>
        {parts.map((part, index) => (
            <span key={`${index}-${part}`} className={index === 0 ? 'd-block fw-semibold' : 'd-block'}>{part}</span>
        ))}
    </>
)

export function ThreatsSection({ threats = {}, open, onToggle }) {
    const rows = Array.isArray(threats.rows) ? threats.rows : []

    return (
        <section id="threats" className="species-section" aria-labelledby="threats-title">
            <div className="section-content">
                <h2 id="threats-title" className="section-heading">Threats</h2>
                {rows.length === 0 ? (
                    <div className="empty-state" role="status">
                        <p className="mb-0">No structured threat data is available for this assessment.</p>
                    </div>
                ) : (
                    <>
                        <div className="table-responsive d-none d-md-block">
                            <table className="table table-sm align-middle mb-0">
                                <caption className="visually-hidden">Known threats and their timing, scope, and severity.</caption>
                                <thead>
                                    <tr>
                                        <th scope="col">Threat</th>
                                        <th scope="col">Timing</th>
                                        <th scope="col">Scope</th>
                                        <th scope="col">Severity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((threat, index) => (
                                        <tr key={`${threat.code ?? 'threat'}-${index}`}>
                                            <td><ThreatTitle parts={threat.parts} /></td>
                                            <td>{displayValue(threat.timing)}</td>
                                            <td>{displayValue(threat.scope)}</td>
                                            <td>{displayValue(threat.severity)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="d-grid gap-3 d-md-none">
                            {rows.map((threat, index) => (
                                <article className="border rounded-3 p-3" key={`${threat.code ?? 'threat'}-${index}`}>
                                    <h3 className="h6 mb-3"><ThreatTitle parts={threat.parts} /></h3>
                                    <dl className="row mb-0 data-list">
                                        <dt className="col-5">Timing</dt>
                                        <dd className="col-7">{displayValue(threat.timing)}</dd>
                                        <dt className="col-5">Scope</dt>
                                        <dd className="col-7">{displayValue(threat.scope)}</dd>
                                        <dt className="col-5">Severity</dt>
                                        <dd className="col-7">{displayValue(threat.severity)}</dd>
                                    </dl>
                                </article>
                            ))}
                        </div>
                    </>
                )}
                <ReadMore
                    open={open}
                    onToggle={onToggle}
                    read_more={threats.read_more}
                    sectionId="threats"
                    sectionTitle="threats"
                />
            </div>
        </section>
    )
}
