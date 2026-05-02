import DataIntegrityError from '../errors/data-integrity.js'
import { pool } from '../config/postgres.js'
import format from 'pg-format'
import ExternalAPIError from '../errors/external-api.js'

const RANGE_TABLES_BY_CLASS = {
    mammalia: 'mammals',
    aves: 'birds',
    reptilia: 'reptiles',
    amphibia: 'amphibians'
}

export const getMapData = async (iucnAssessmentData, scientificName) => {
    const className = String(iucnAssessmentData?.taxon?.class_name ?? '').trim().toLowerCase()
    if (!className) throw new ExternalAPIError('IUCN assessment is missing class name')
    const tableName = RANGE_TABLES_BY_CLASS[className]
    if (!tableName) return null
    const sql = format(`
            SELECT jsonb_build_object(
                'type','Feature',
                'properties', jsonb_build_object('id_no', id_no, 'sci_name', sci_name),
                'geometry', ST_AsGeoJSON(geom_simpl_5km, 5)::jsonb
            ) AS feature
            FROM public.%I
            WHERE sci_name ILIKE $1
            AND geom_simpl_5km IS NOT NULL
            AND NOT ST_IsEmpty(geom_simpl_5km)
            LIMIT 1;
            `, tableName);
    
    const { rows, rowCount } = await pool.query(sql, [scientificName])
    if (!rowCount) return null
    const mapData = rows[0]?.feature
    if (!mapData) throw new DataIntegrityError('PostGIS returned a row without map feature data')
    return mapData
}