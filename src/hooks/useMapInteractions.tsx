import { Feature } from 'ol';
import Map from 'ol/Map';
import View from 'ol/View';
import { defaults as defaultControls } from 'ol/control';
import { LineString, Polygon } from 'ol/geom';
import Draw from 'ol/interaction/Draw';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { transform } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { Stroke, Style } from 'ol/style';
import { useCallback, useEffect, useState } from 'react';

type DrawModeType = 'LineString' | 'Polygon' | null;

interface Coordinate {
  id: string;
  longitude: number;
  latitude: number;
  distance: number;
  type: 'linestring' | 'polygon';
  polygonPoints?: Coordinate[];
}

export const useMapInteractions = () => {
  const [map, setMap] = useState<Map | null>(null);
  const [drawMode, setDrawMode] = useState<DrawModeType>(null);
  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [currentFeature, setCurrentFeature] = useState<Feature | null>(null);
  const [vectorSource] = useState(new VectorSource());
  const [drawInteraction, setDrawInteraction] = useState<Draw | null>(null);
  const [insertPosition, setInsertPosition] = useState<{
    index: number;
    type: 'before' | 'after';
  } | null>(null);

  useEffect(() => {
    const initialMap = new Map({
      view: new View({
        center: [0, 0],
        zoom: 2,
      }),
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: vectorSource,
        }),
      ],
      controls: defaultControls({
        zoom: false,
        attribution: false,
        rotate: false,
      }),
    });

    setMap(initialMap);

    return () => {
      initialMap.setTarget(undefined);
    };
  }, [vectorSource]);

  const calculateDistance = (coord1: number[], coord2: number[]): number => {
    const R = 6371e3;
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const delta = ((lat2 - lat1) * Math.PI) / 180;
    const lambda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(delta / 2) * Math.sin(delta / 2) +
      Math.cos(phi1) *
        Math.cos(phi2) *
        Math.sin(lambda / 2) *
        Math.sin(lambda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const startDrawing = useCallback(() => {
    if (!map) return;

    setDrawMode('LineString');
    const draw = new Draw({
      source: vectorSource,
      type: 'LineString',
      style: new Style({
        stroke: new Stroke({
          color: '#ff0000',
          width: 2,
        }),
      }),
    });

    draw.on('drawend', (event) => {
      const feature = event.feature;
      setCurrentFeature(feature);

      const geometry = feature.getGeometry() as LineString;
      const coords = geometry
        .getCoordinates()
        .map((coord) => transform(coord, 'EPSG:3857', 'EPSG:4326'));

      const newCoordinates = coords.map((coord, index) => ({
        id: `WP${String(index).padStart(2, '0')}`,
        longitude: coord[0],
        latitude: coord[1],
        distance: index > 0 ? calculateDistance(coords[index - 1], coord) : 0,
        type: 'linestring',
      }));

      setCoordinates(newCoordinates as Coordinate[]);
    });

    map.addInteraction(draw);
    setDrawInteraction(draw);
  }, [map, vectorSource]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter' && drawInteraction) {
        drawInteraction.finishDrawing();
        map?.removeInteraction(drawInteraction);
        setDrawInteraction(null);
        setDrawMode(null);
      }
    },
    [drawInteraction, map],
  );

  const insertPolygon = useCallback(
    (position: number, type: 'before' | 'after') => {
      if (!map) return;

      setInsertPosition({ index: position, type });
      setDrawMode('Polygon');

      const draw = new Draw({
        source: vectorSource,
        type: 'Polygon',
        style: new Style({
          stroke: new Stroke({
            color: '#0000ff',
            width: 2,
          }),
        }),
      });

      draw.on('drawend', (event) => {
        const feature = event.feature;
        const geometry = feature.getGeometry() as Polygon;
        const coords = geometry
          .getCoordinates()[0]
          .map((coord) => transform(coord, 'EPSG:3857', 'EPSG:4326'));

        const uniqueCoords = coords.slice(0, -1);

        if (insertPosition) {
          const polygonPoints = uniqueCoords.map((coord, index) => ({
            id: `P${String(index).padStart(2, '0')}`,
            longitude: coord[0],
            latitude: coord[1],
            distance:
              index > 0 ? calculateDistance(uniqueCoords[index - 1], coord) : 0,
            type: 'polygon' as const,
          }));

          const connectionPoint = coordinates[position];
          const insertIndex = type === 'before' ? position : position + 1;

          const polygonEntry: Coordinate = {
            id: `WP${String(insertIndex).padStart(2, '0')}_P`,
            longitude: connectionPoint.longitude,
            latitude: connectionPoint.latitude,
            distance: 0,
            type: 'polygon',
            polygonPoints: polygonPoints,
          };

          const newCoordinates = [...coordinates];
          newCoordinates.splice(insertIndex, 0, polygonEntry);

          const updatedCoordinates = newCoordinates.map((coord, index) => ({
            ...coord,
            id:
              coord.type === 'linestring'
                ? `WP${String(index).padStart(2, '0')}`
                : coord.id,
            distance:
              index > 0
                ? calculateDistance(
                    [
                      newCoordinates[index - 1].longitude,
                      newCoordinates[index - 1].latitude,
                    ],
                    [coord.longitude, coord.latitude],
                  )
                : 0,
          }));

          setCoordinates(updatedCoordinates);
        }

        map.removeInteraction(draw);
        setDrawInteraction(null);
        setDrawMode(null);
        setInsertPosition(null);
      });

      map.addInteraction(draw);
      setDrawInteraction(draw);
    },
    [map, vectorSource, coordinates, insertPosition],
  );

  return {
    map,
    drawMode,
    coordinates,
    currentFeature,
    setDrawMode,
    startDrawing,
    handleKeyPress,
    insertPolygon,
  };
};
