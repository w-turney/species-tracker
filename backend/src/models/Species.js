import mongoose from 'mongoose'

const speciesSchema = new mongoose.Schema({
    slug: {
        type: String,
        required: true,
        unique: true,
        index: true,
        trim: true
    },
    iucnSisId : {
        type: Number,
        index: true
    },
    speciesPageData: {
        type: Object,
        required: true
    },
    lastFetched: {
        type: Date,
        default: Date.now
    }
})

export const Species = mongoose.model('Species', speciesSchema)