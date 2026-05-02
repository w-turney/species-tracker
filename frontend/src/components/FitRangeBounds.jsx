import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'

const FitRangeBounds = ({ rangeGeojson }) => {
    const map = useMap()
    useEffect(() => {
        if (!rangeGeojson) return
        const bounds = L.geoJSON(rangeGeojson).getBounds()
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [20, 20] })
    }, [rangeGeojson, map])
    return null
}

export default FitRangeBounds