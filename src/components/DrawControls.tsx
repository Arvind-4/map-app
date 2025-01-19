import { LinkIcon, Square } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type DrawModeType = 'LineString' | 'Polygon' | null;

interface DrawControlsProps {
  mode: DrawModeType;
  onModeChange: (mode: DrawModeType) => void;
}

export const DrawControls: React.FC<DrawControlsProps> = ({
  mode,
  onModeChange,
}) => {
  return (
    <Card className='w-64'>
      <CardHeader className='pb-3'>
        <CardTitle>Drawing Controls</CardTitle>
      </CardHeader>
      <CardContent className='grid grid-cols-2 gap-2'>
        <Button
          variant={mode === 'LineString' ? 'default' : 'outline'}
          className='flex w-full items-center gap-2'
          onClick={() => onModeChange('LineString')}
        >
          <LinkIcon className='h-4 w-4' />
          Line
        </Button>
        <Button
          variant={mode === 'Polygon' ? 'default' : 'outline'}
          className='flex w-full items-center gap-2'
          onClick={() => onModeChange('Polygon')}
        >
          <Square className='h-4 w-4' />
          Polygon
        </Button>
        <div className='col-span-2 mt-2 text-sm text-muted-foreground'>
          Press Enter to finish drawing
        </div>
      </CardContent>
    </Card>
  );
};
