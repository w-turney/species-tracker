import '../css/TaxonomySection.css'

export function TaxonomySection( {taxonomy} ) {
    return (
        <section id="taxonomy">
            <h2 className="mb-4">Taxonomy</h2>
            <div className="container-fluid px-4">
                <div className="row text-center justify-content-center mb-3">
                    <div className="col-6 col-md-3">
                        <small className="text-uppercase">Kingdom</small>
                        <div className="tax-value">
                            {taxonomy.kingdom_name}
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <small className="text-uppercase">Phylum</small>
                        <div className="tax-value">
                            {taxonomy.phylum_name}
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <small className="text-uppercase">Class</small>
                        <div className="tax-value">
                            {taxonomy.class_name}
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <small className="text-uppercase">Order</small>
                        <div className="tax-value">
                            {taxonomy.order_name}
                        </div>
                    </div>
                </div>
                <div className="row text-center justify-content-center">
                    <div className="col-6 col-md-3">
                        <small className="text-uppercase">Family</small>
                        <div className="tax-value">
                            {taxonomy.family_name}
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <small className="text-uppercase">Genus</small>
                        <div className="tax-value">
                            {taxonomy.genus_name}
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <small className="text-uppercase">Species</small>
                        <div className="tax-value"><em>
                            {taxonomy.species_name}
                        </em></div>
                    </div>
                </div>
            </div>
        </section>
    )
}