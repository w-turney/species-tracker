const namedEntities = {
    amp: '&',
    apos: "'",
    gt: '>',
    lt: '<',
    nbsp: ' ',
    quot: '"',
}

const decodeCodePoint = (match, value, radix) => {
    const codePoint = Number.parseInt(value, radix)
    return Number.isInteger(codePoint) && codePoint <= 0x10FFFF ? String.fromCodePoint(codePoint) : match
}

const decodeHtmlEntities = (value) => String(value)
    .replace(/&#x([\da-f]+);?/gi, (match, hex) => decodeCodePoint(match, hex, 16))
    .replace(/&#(\d+);?/g, (match, decimal) => decodeCodePoint(match, decimal, 10))
    .replace(/&([a-z]+);/gi, (match, name) => namedEntities[name.toLowerCase()] ?? match)

export const displayValue = (value, fallback = 'Not available') => {
    const text = String(value ?? '').trim()
    return text || fallback
}

export const longTextParagraphs = (value) => {
    const text = decodeHtmlEntities(value ?? '')
        .replace(/\r\n?/g, '\n')
        .replace(/[ \t]+\n/g, '\n')
        .replace(/\n[ \t]+/g, '\n')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/[ \t]{2,}/g, ' ')
        .replace(/([.!?])([A-Z])/g, '$1 $2')
        .trim()

    if (!text) return []

    return text.split(/\n{2,}/).map((paragraph) => paragraph.trim()).filter(Boolean)
}
