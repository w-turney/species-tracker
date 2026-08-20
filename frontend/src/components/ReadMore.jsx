import { longTextParagraphs } from '../utils/text'

export function ReadMore({ open, onToggle, read_more, sectionId, sectionTitle }) {
    const paragraphs = longTextParagraphs(read_more)
    if (paragraphs.length === 0) return null

    const contentId = `${sectionId}-detail`

    return (
        <div className="mt-4 long-form-content">
            <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                aria-expanded={open}
                aria-controls={contentId}
                onClick={onToggle}
            >
                {open ? 'Read less' : 'Read more'}<span className="visually-hidden"> about {sectionTitle}</span>
            </button>
            {open && (
                <div id={contentId} className="mt-3" tabIndex="-1">
                    {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                </div>
            )}
        </div>
    )
}
