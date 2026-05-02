export const HelpSection = ({ projects }) => {
    const safeProjects = Array.isArray(projects) ? projects : []
    if (safeProjects.length === 0) return null
    return (
        <section id='help'>
            <h2 className="mb-4">How You Can Help</h2>
            <div className="container-fluid">
                <div className="row row-cols-1 row-cols-md-3 g-3">
                    {safeProjects.map(project => {
                        return (
                            <div className="col" key={project.id}>
                                <article className="card h-100">
                                    <div className="card-body d-flex flex-column">
                                        <a className="text-decoration-none text-dark"
                                            href={project.projectLink}
                                            target="_blank"
                                            rel="noopener noreferrer" >
                                            <h3 className="h5 card-title mb-2">{project.organization?.name}</h3>
                                            <h4 className="h6 mb-2">{project.title}</h4>
                                        </a>
                                        <img src={project.imageLink}
                                            alt={project.title}
                                            className="img-fluid rounded mt-3" />
                                    </div>
                                </article>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}