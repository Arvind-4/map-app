import { Minus, Plus, RotateCcw } from 'lucide-react';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { useEffect, useRef } from 'react';

interface MapComponentProps {
  map: Map | null;
  onKeyPress: (event: KeyboardEvent) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  map,
  onKeyPress,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (map && mapRef.current) {
      map.setTarget(mapRef.current);
    }
  }, [map]);

  useEffect(() => {
    document.addEventListener('keypress', onKeyPress);
    return () => {
      document.removeEventListener('keypress', onKeyPress);
    };
  }, [onKeyPress]);

  const handleZoomIn = () => {
    if (map) {
      const view = map.getView();
      const currentZoom = view.getZoom();
      if (currentZoom !== undefined) {
        view.setZoom(currentZoom + 1);
      }
    }
  };

  const handleZoomOut = () => {
    if (map) {
      const view = map.getView();
      const currentZoom = view.getZoom();
      if (currentZoom !== undefined) {
        view.setZoom(currentZoom - 1);
      }
    }
  };

  const handleResetMap = () => {
    if (map) {
      const view = map.getView();
      view.setCenter([0, 0]);
      view.setZoom(2);
      const tileLayer = new TileLayer({
        source: new OSM(),
      });
      map.addLayer(tileLayer);
    }
  };

  return (
    <div className='relative h-full w-full'>
      <div ref={mapRef} className='h-full w-full' />
      <div className='absolute left-4 top-4 z-10 flex flex-col gap-2'>
        <button
          onClick={handleZoomIn}
          className='rounded-full border border-gray-300 bg-white p-2 text-black shadow-md'
        >
          <Plus />
        </button>
        <button
          onClick={handleZoomOut}
          className='rounded-full border border-gray-300 bg-white p-2 text-black shadow-md'
        >
          <Minus />
        </button>
        <button
          onClick={handleResetMap}
          className='rounded-full border border-gray-300 bg-white p-2 text-black shadow-md'
        >
          <RotateCcw />
        </button>
      </div>
    </div>
  );
};
