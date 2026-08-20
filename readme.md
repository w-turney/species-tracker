# Species Tracker

## Overview

A full-stack application for exploring species conservation assessments, distribution ranges, and related ecological information. It combines external biodiversity data with locally queried geospatial ranges and cached species records.

---

## Screenshots

### Home page
![Search page](./screenshots/search-page.png)

### Species page
![Species page](./screenshots/species-page.png)

---

## Features

- English common-name search with ranked, paginated results (24 results per page)
- Dedicated species pages with conservation status, assessment metadata, taxonomy, population, habitat, threats, and conservation actions
- Interactive Leaflet range map backed by PostGIS GeoJSON queries where local range data is available
- Related GlobalGiving conservation projects where matching project data is available
- Deliberate loading, error, empty, and unavailable-data states for incomplete external data
- Responsive, accessible React interface with keyboard-operable search, pagination, section navigation, and expandable content
- MongoDB caching of species-page responses for up to 30 days to reduce repeat external requests

---

## Tech Stack

### Frontend
- React (Vite)
- Leaflet / React Leaflet
- Bootstrap
- React Router

### Backend
- Node.js / Express
- PostgreSQL / PostGIS
- MongoDB / Mongoose

### GIS Tooling
- QGIS
- GDAL / ogr2ogr

### External APIs
- IUCN Red List API
- Global Biodiversity Information Facility (GBIF) API
- Wikipedia REST API
- GlobalGiving API
- OpenStreetMap tiles

---

## Why I built the app

I built the app to strengthen my full-stack development skills while also exploring my passion for wildlife conservation.

The project gave me the opportunity to practise:

- Building a React frontend with reusable components and client-side routing
- Fetching, combining, and normalising data from external APIs
- Working with PostgreSQL, PostGIS, MongoDB, and Mongoose
- Processing geospatial range data using QGIS and GDAL
- Serving and displaying GeoJSON range data in Leaflet

---

## How it works

### Species search
- Users search by English common name.
- The backend queries GBIF for accepted species, ranks matching vernacular names, and returns a 24-result page plus the total number of matches.
- The frontend provides Previous and Next controls when additional result pages are available, then links each result to its species page.

### Displaying species conservation data
The species page combines data from several sources:

- IUCN Red List data for the latest assessment and structured conservation information
- Wikipedia summaries when available
- PostGIS range data for species distribution maps
- GlobalGiving data for related conservation projects

The backend normalises the available data before returning it to the frontend, which presents clear fallbacks when optional fields, projects, images, or range data are unavailable.

### Caching
- Species-page data is cached in MongoDB for 30 days to reduce repeated external API requests and improve repeat-view performance

---

## Architecture

React frontend → Express API → GBIF, IUCN, Wikipedia and GlobalGiving APIs

React frontend → Express API → PostGIS range database and MongoDB cache

---

## API routes

- `GET /api/search?q=<common-name>&page=<number>` — searches accepted GBIF species by English common name. `q` is required; `page` is optional and defaults to 1. The response includes a 24-result page, total count, page metadata, and `hasMore`.
- `GET /api/species/:scientificName` — returns the assembled species-page data, using the MongoDB cache when available

---

## Challenges / what I learned

- **Working with geospatial data**  
  One of the biggest challenges was learning how to work with species range shapefiles. I had to understand the different shapefile components, inspect the data in QGIS, filter the range data to relevant extant ranges, fix invalid geometries, dissolve multiple features per species, and import the cleaned data into PostGIS.

  This helped me understand how geospatial data moves through a full-stack application: from raw shapefiles, to database geometries, to GeoJSON API responses, to interactive map layers in Leaflet.

- **Dealing with external API data**  
  The external API responses were not always complete or consistent. I added defensive backend logic to handle missing fields, unexpected formats, unavailable assessments, and species with no local range data. This allowed the frontend to render useful fallback states instead of crashing.

- **Performance and data size**
  Range geometries can be large, so I used PostGIS indexes and refined range tables to make spatial lookups more efficient. I also added MongoDB caching to reduce repeated external API calls for species that had already been requested.

---

## Future improvements

- Add support for fish range data
- Improve the conservation project matching logic so suggested projects are more species-relevant

---

## Local setup

### Prerequisites

- Node.js 
- PostgreSQL with PostGIS extension  
- MongoDB
- IUCN API token  
- GlobalGiving API token
- GDAL / ogr2ogr (only needed to import or update local range shapefiles; e.g. via OSGeo4W on Windows)


### Environment Variables

Create a `.env` file inside the `backend` directory:

```env
# Optional; defaults to 5000 when omitted
PORT=5000
IUCN_TOKEN=<YOUR_IUCN_API_TOKEN>
GLOBALGIVING_TOKEN=<YOUR_GLOBALGIVING_API_TOKEN>
DATABASE_URL=postgres://<USERNAME>:<PASSWORD>@localhost:5432/species_ranges
MONGO_URI=mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER>.mongodb.net/species-tracker-react
```

---

### Clone the repository

```bash
git clone https://github.com/w-turney/species-tracker.git
cd species-tracker
```

### Install dependencies

#### Frontend
```bash
cd frontend
npm install
```

#### Backend
```bash
cd ../backend
npm install
```

### PostGIS database setup

The application looks for a range table based on the IUCN class: `mammals`, `birds`, `reptiles`, or `amphibians`. Import the tables needed for the coverage you want to provide.

Inside your PostgreSQL database:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```

### MongoDB database setup

MongoDB is used as a caching layer for species page data. Create a MongoDB database and add the connection string to `MONGO_URI` in the backend `.env` file.

---

### Optional: importing shapefile data

IUCN and BirdLife range shapefiles must be downloaded manually.  
Some taxa (e.g., mammals) are split into multiple shapefiles — import the first, then append the second.

Import into a `_raw` table first, then create a refined table for the application.

### Example: Mammals (two‑part import)

#### 1) Import part 1 (create/overwrite)
```bash
ogr2ogr -progress -f "PostgreSQL" \
  PG:"host=localhost port=5432 dbname=<db_name> user=<user> password=<password>" \
  "path/to/mammals_part1.shp" \
  -nln mammals_raw \
  -lco GEOMETRY_NAME=geom \
  -nlt PROMOTE_TO_MULTI \
  -overwrite
```

#### 2) Import part 2 (append)
```bash
ogr2ogr -progress -f "PostgreSQL" \
  PG:"host=localhost port=5432 dbname=<db_name> user=<user> password=<password>" \
  "path/to/mammals_part2.shp" \
  -nln mammals_raw \
  -lco GEOMETRY_NAME=geom \
  -nlt PROMOTE_TO_MULTI \
  -update -append
```

---

#### Refining Tables (filter, dissolve, validate)

This example creates the `mammals` table used by the application from `mammals_raw` by:

- Filtering to extant ranges  
- Dissolving geometries by `id_no`  
- Fixing invalid geometries  
- Ensuring multipolygon output  

```sql
DROP TABLE IF EXISTS public.mammals;

CREATE TABLE public.mammals AS
SELECT
  id_no,
  MIN(sci_name) AS sci_name,
  ST_Multi(
    ST_Union(
      CASE
        WHEN ST_IsValid(geom) THEN geom
        ELSE ST_MakeValid(geom)
      END
    )
  ) AS geom
FROM public.mammals_raw
WHERE legend ILIKE '%extant%'
GROUP BY id_no;

ALTER TABLE public.mammals
ADD COLUMN geom_simpl_5km geometry;

UPDATE public.mammals
SET geom_simpl_5km = ST_SimplifyPreserveTopology(geom, 0.05);
```

Recommended Indexes:

```sql
CREATE INDEX IF NOT EXISTS mammals_id_no_idx ON public.mammals (id_no);
CREATE INDEX IF NOT EXISTS mammals_geom_gix ON public.mammals USING GIST (geom);
CREATE INDEX IF NOT EXISTS mammals_geom_simpl_5km_gix ON public.mammals USING GIST (geom_simpl_5km);
```

---

## Running the App

### Backend

From the project root, start the backend:

```bash
cd backend
npm run dev
```

### Frontend

In a separate terminal, from the project root, start the frontend:

```bash
cd frontend
npm run dev
```

Vite proxies `/api` requests to the backend at `http://localhost:5000` during local development.

---

## Credits / data sources

- IUCN Red List API
- IUCN / BirdLife species range shapefiles
- GBIF API
- Wikipedia REST API
- GlobalGiving API
- OpenStreetMap
