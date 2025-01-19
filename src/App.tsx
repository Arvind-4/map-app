import React, { useState } from 'react';

import { DrawControls } from '@/components/DrawControls';
import { MapComponent } from '@/components/MapComponent';
import { MissionModal } from '@/components/MissionModal';
import { Button } from '@/components/ui/button';
import { useMapInteractions } from '@/hooks/useMapInteractions';

const App = () => {
  const {
    map,
    drawMode,
    coordinates,
    setDrawMode,
    startDrawing,
    handleKeyPress,
    insertPolygon,
  } = useMapInteractions();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  React.useEffect(() => {
    if (coordinates.length > 0) {
      setIsModalOpen(true);
    }
  }, [coordinates]);

  return (
    <div className='flex h-screen w-full flex-col'>
      <div className='border-b p-4'>
        <Button onClick={startDrawing} variant='default' className='mr-2'>
          Draw
        </Button>
      </div>

      <div className='relative flex-1'>
        <MapComponent map={map} onKeyPress={handleKeyPress} />

        {drawMode && (
          <div className='absolute right-4 top-4 rounded-lg bg-white p-4 shadow-lg'>
            <DrawControls mode={drawMode} onModeChange={setDrawMode} />
          </div>
        )}
      </div>

      <MissionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        coordinates={coordinates}
        onInsertPolygon={insertPolygon}
      />
    </div>
  );
};

export default App;
