import { displayValue } from '../utils/text'

export const HelpSection = ({ projects }) => {
    const safeProjects = Array.isArray(projects) ? projects : []

    return (
        <section id="help" className="species-section" aria-labelledby="help-title">
            <div className="section-content">
                <h2 id="help-title" className="section-heading">How you can help</h2>
                {safeProjects.length === 0 ? (
                    <div className="empty-state" role="status">
                        <p className="mb-0">Related conservation projects are not available for this species.</p>
                    </div>
                ) : (
                    <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-3">
                        {safeProjects.map((project, index) => (
                            <div className="col" key={project.id ?? `${project.title}-${index}`}>
                                <article className="card h-100">
                                    <a
                                        className="project-card-link"
                                        href={project.projectLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <div className="card-body d-flex h-100 flex-column">
                                            <p className="text-secondary mb-2">{displayValue(project.organization?.name, 'Conservation project')}</p>
                                            <h3 className="h5 card-title mb-0">{displayValue(project.title)}</h3>
                                            {project.imageLink && (
                                                <img
                                                    src={project.imageLink}
                                                    alt=""
                                                    className="img-fluid rounded mt-3 project-card-image"
                                                />
                                            )}
                                            <span className="mt-3 text-decoration-underline">Visit project <span className="visually-hidden">(opens in a new tab)</span></span>
                                        </div>
                                    </a>
                                </article>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
