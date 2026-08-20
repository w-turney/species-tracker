import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { ReadMore } from './ReadMore'
import FitRangeBounds from './FitRangeBounds'
import '../css/Map.css'

export function GeographicRange({ range, open, onToggle }) {
    const mapData = range?.map_data ?? null
    const readMore = range?.read_more ?? null
    const geometryType = mapData?.type === 'Feature' ? mapData.geometry?.type : mapData?.type
    const hasRangeData = mapData?.type === 'FeatureCollection'
        ? mapData.features?.some((feature) => !['Point', 'MultiPoint'].includes(feature?.geometry?.type))
        : Boolean(geometryType && !['Point', 'MultiPoint'].includes(geometryType))

    return (
        <section id='geographic-range' className="species-section" aria-labelledby="geographic-range-title">
            <div className="section-content">
                <h2 id="geographic-range-title" className="section-heading">Geographic range</h2>
                {hasRangeData ? (
                    <>
                        <p id="map-description" className="map-description">
                            The shaded area shows the species’ recorded distribution. Use the map controls to zoom; page scrolling is not captured by the map.
                        </p>
                        <div className="map-region" role="region" aria-label="Species geographic range map" aria-describedby="map-description">
                            <MapContainer
                                id='map'
                                className="species-range-map"
                                zoom={2}
                                minZoom={2}
                                center={[0, 0]}
                                worldCopyJump
                                scrollWheelZoom={false}
                            >
                                <TileLayer
                                    attribution={'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap contributors</a>'}
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <GeoJSON
                                    data={mapData}
                                    filter={feature =>
                                        feature?.geometry?.type !== 'Point' && feature?.geometry?.type !== 'MultiPoint'
                                    }
                                    style={() => ({
                                        weight: 1.2,
                                        opacity: 0.9,
                                        fillOpacity: 0.25,
                                    })}
                                />
                                <FitRangeBounds rangeGeojson={mapData} />
                            </MapContainer>
                        </div>
                    </>
                ) : (
                    <div className="map-unavailable empty-state" role="status">
                        <h3 className="h5">Range data unavailable</h3>
                        <p className="mb-0">A distribution map has not been published for this assessment.</p>
                    </div>
                )}
                <ReadMore
                    open={open}
                    onToggle={onToggle}
                    read_more={readMore}
                    sectionId="geographic-range"
                    sectionTitle="geographic range"
                />
            </div>
        </section>
    )
}
