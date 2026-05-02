import { ReadMore } from './ReadMore'

export function PopulationSection({ population, open, onToggle }) {
    return (
        <section id="population">
            <h2 className="mb-4">Population</h2>
            <div className="container-fluid px-4">
                <div className="row g-3 align-items-stretch">
                    <div className="col-12 col-lg-8">
                        <div className="p-3 border rounded-3 h-100">
                            <div className="row g-4">
                                <div className="col-12 col-lg-6">
                                    <h5 className="mb-3">Headline stats</h5>
                                    <dl className="row mb-0">
                                        <dt className="col-6">Red List</dt>
                                        <dd className="col-6">
                                            {population.status}
                                        </dd>
                                        <dt className="col-6">Assessment scope</dt>
                                        <dd className="col-6">
                                            {population.scope}
                                        </dd>
                                        <dt className="col-6">Population size</dt>
                                        <dd className="col-6">
                                            {population.population_size}
                                        </dd>
                                        <dt className="col-6">Assessed</dt>
                                        <dd className="col-6">
                                            {population.assessment_date}
                                        </dd>
                                    </dl>
                                </div>
                                <div className="col-12 col-lg-6">
                                    <h5 className="mb-3 invisible" aria-hidden="true">Spacer</h5>
                                    <dl className="row mb-0">
                                        <dt className="col-7">Trend</dt>
                                        <dd className="col-5">
                                            {population.trend}
                                        </dd>
                                        <dt className="col-7">Continuing decline</dt>
                                        <dd className="col-5">
                                            {population.continuing_decline}
                                        </dd>
                                        <dt className="col-7">Severely fragmented</dt>
                                        <dd className="col-5">
                                            {population.severely_fragmented}
                                        </dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <ReadMore open={open} onToggle={onToggle} read_more={population.read_more} />
            </div>
        </section>
    )
}