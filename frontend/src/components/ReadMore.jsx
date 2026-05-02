export function ReadMore( {open, onToggle, read_more} ) {
    if (!read_more) return null
    return (
        <div className="row mt-3">
            <div className="col-12 col-lg-8">
                <button className="btn btn-sm btn-outline-secondary" type="button" aria-expanded={open} onClick={onToggle}>
                    {open ? "Read Less" : "Read More"}
                </button>
                {open && (
                    <div className="mt-2">
                        <p className="mb-0">{read_more}</p>
                    </div>
                )}
            </div>
        </div>
    )
}