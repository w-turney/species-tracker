import '../css/TaxonomySection.css'
import { displayValue } from '../utils/text'

const taxonomyFields = [
    ['Kingdom', 'kingdom_name'],
    ['Phylum', 'phylum_name'],
    ['Class', 'class_name'],
    ['Order', 'order_name'],
    ['Family', 'family_name'],
    ['Genus', 'genus_name'],
    ['Species', 'species_name'],
]

export function TaxonomySection({ taxonomy = {} }) {
    return (
        <section id="taxonomy" className="species-section" aria-labelledby="taxonomy-title">
            <div className="section-content">
                <h2 id="taxonomy-title" className="section-heading">Taxonomy</h2>
                <dl className="taxonomy-grid">
                    {taxonomyFields.map(([label, key]) => (
                        <div className="taxonomy-item" key={key}>
                            <dt>{label}</dt>
                            <dd className="tax-value">
                                {key === 'species_name' ? <em>{displayValue(taxonomy[key])}</em> : displayValue(taxonomy[key])}
                            </dd>
                        </div>
                    ))}
                </dl>
            </div>
        </section>
    )
}
