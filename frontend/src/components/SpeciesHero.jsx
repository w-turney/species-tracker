
export function SpeciesHero({ speciesHero }) {
  return (
    <header className="container-fluid min-vh-100 d-flex align-items-stretch">
      <div className="container my-4 flex-grow-1">
        <div className="row h-100 align-items-center g-4">
          <div className="col-lg-6 d-flex flex-column">
            <div>
              <h1 className="display-5 mb-2">{speciesHero.vernacular_name}</h1>
              <p className="fs-4 fst-italic text-secondary mb-0">
                {speciesHero.scientific_name}
              </p>
            </div>
            <div className="mt-auto">
              <span className="badge text-bg-success me-2">
                {speciesHero.status}
              </span>
              <small className="text-secondary">
                Assessed: {speciesHero.assessment_date}
              </small>
            </div>
          </div>
          <div className="col-lg-6">
            <img
              className="img-fluid rounded shadow-sm w-100"
              src={speciesHero.img}
              alt={speciesHero.scientific_name}
              style={{ maxHeight: "70vh", objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
