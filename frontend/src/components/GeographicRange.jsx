import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { ReadMore } from './ReadMore'
import FitRangeBounds from './FitRangeBounds'

export function GeographicRange({ range, open, onToggle }) {
    const mapData = range?.map_data ?? null
    const readMore = range?.read_more ?? null

    return (
        <section id='geographic-range'>
            <h2 className="mb-4">Geographic Range</h2>
            <MapContainer
                id='map'
                style={{ height: 400, width: '100%' }}
                zoom={2}
                minZoom={2}
                center={[0, 0]}
                worldCopyJump
            >
                <TileLayer
                    attribution="© OSM"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {mapData && (
                    <GeoJSON
                        key={JSON.stringify(mapData).slice(0, 100)}
                        data={mapData}
                        filter={f =>
                            f?.geometry?.type !== "Point" && f?.geometry?.type !== "MultiPoint"
                        }
                        style={() => ({
                            weight: 1.2,
                            opacity: 0.9,
                            fillOpacity: 0.25
                        })}
                    />
                )}
                <FitRangeBounds rangeGeojson={mapData} />
            </MapContainer>
            <ReadMore open={open} onToggle={onToggle} read_more={readMore} />
        </section>
    )
}