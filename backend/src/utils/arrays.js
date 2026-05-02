export const dedupeArray = (array, prop) => {
    const deduped = []
    const seen = new Set()
    for (const obj of array) {
        if (seen.has(obj[prop])) continue
        deduped.push(obj)
        seen.add(obj[prop])
    }
    return deduped
}