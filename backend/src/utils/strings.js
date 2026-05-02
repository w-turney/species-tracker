const toSlug = (s = '') => {
    return s.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-');
}

export const parseScientificName = param => {
    const words = String(param ?? '')
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
    if (words.length !== 2) return null
    const [genus, species] = words
    const scientificName = `${genus} ${species}`
    return {
        scientificName,
        slug: toSlug(scientificName),
        genus: encodeURIComponent(genus),
        species: encodeURIComponent(species)
    }
}

export const formatScientificName = (input = '') => {
    const words = String(input)
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
    return words
            .map((word, index) =>
                index === 0
                    ? word.charAt(0).toUpperCase() + word.slice(1)
                    : word
            )
            .join(' ')
}

export const normaliseYN = v => {
    const s = String(v || '').trim().toLowerCase()
    if (['yes', 'y', '1', 'true', 't'].includes(s)) return 'Yes'
    if (['no', 'n', '0', 'false', 'f'].includes(s)) return 'No'
    return '—'
}

export const kindOf = v => {
    const s = String(v || '').toLowerCase()
    if (s.startsWith('yes')) return 'yes'
    if (s.startsWith('no')) return 'no'
    if (s.includes('unknown')) return 'unknown'
    return 'other'
}