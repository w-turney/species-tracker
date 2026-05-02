import { Species } from '../models/Species.js'

export const getCachedSpecies = async (slug) => {
    const doc = await Species.findOne({ slug })
    if (!doc) return null

    const newDate = new Date()
    const docAge = ((newDate - doc.lastFetched) / 86400000)

    if (docAge > 30) {
        console.log('cached data is 30+ days old')
        return null
    }
    return doc
}
