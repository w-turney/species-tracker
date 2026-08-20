import { ReadMore } from './ReadMore'
import { conservationStatusClass } from '../utils/status'
import { displayValue } from '../utils/text'

export function PopulationSection({ population = {}, open, onToggle }) {
    const status = displayValue(population.status)

    return (
        <section id="population" className="species-section" aria-labelledby="population-title">
            <div className="section-content">
                <h2 id="population-title" className="section-heading">Population</h2>
                <div className="border rounded-3 p-3 p-md-4">
                    <div className="row g-4">
                        <div className="col-12 col-md-6">
                            <h3 className="h5 mb-3">Assessment overview</h3>
                            <dl className="row mb-0 data-list">
                                <dt className="col-6">Red List status</dt>
                                <dd className="col-6"><span className={`badge text-bg-${conservationStatusClass(population.status)}`}>{status}</span></dd>
                                <dt className="col-6">Assessment scope</dt>
                                <dd className="col-6">{displayValue(population.scope)}</dd>
                                <dt className="col-6">Population size</dt>
                                <dd className="col-6">{displayValue(population.population_size)}</dd>
                                <dt className="col-6">Last assessed</dt>
                                <dd className="col-6">{displayValue(population.assessment_date)}</dd>
                            </dl>
                        </div>
                        <div className="col-12 col-md-6">
                            <h3 className="h5 mb-3">Population condition</h3>
                            <dl className="row mb-0 data-list">
                                <dt className="col-7">Trend</dt>
                                <dd className="col-5">{displayValue(population.trend)}</dd>
                                <dt className="col-7">Continuing decline</dt>
                                <dd className="col-5">{displayValue(population.continuing_decline)}</dd>
                                <dt className="col-7">Severely fragmented</dt>
                                <dd className="col-5">{displayValue(population.severely_fragmented)}</dd>
                            </dl>
                        </div>
                    </div>
                </div>
                <ReadMore
                    open={open}
                    onToggle={onToggle}
                    read_more={population.read_more}
                    sectionId="population"
                    sectionTitle="population"
                />
            </div>
        </section>
    )
}
