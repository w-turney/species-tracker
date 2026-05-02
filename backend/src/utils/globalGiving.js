
const text = value => String(value ?? '').toLowerCase()

export const scoreProject = (p = {}, q = '') => {
    const query = text(q)
    const mission = text(p.organization?.mission)
    const title = text(p.title)
    const summary = text(p.summary)
    const activities = text(p.activities)

    return (
        (mission.includes(query) ? 2 : 0) +
        (title.includes(query) ? 2 : 0) +
        (summary.includes(query) ? 1 : 0) +
        (activities.includes(query) ? 1 : 0)
    )
}