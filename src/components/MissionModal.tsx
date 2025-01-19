import { MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Coordinate {
  id: string;
  longitude: number;
  latitude: number;
  distance: number;
  type: 'linestring' | 'polygon';
  polygonPoints?: Coordinate[];
}

interface MissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  coordinates: Coordinate[];
  onInsertPolygon: (position: number, type: 'before' | 'after') => void;
}

export const MissionModal: React.FC<MissionModalProps> = ({
  isOpen,
  onClose,
  coordinates,
  onInsertPolygon,
}) => {
  const exportToCSV = () => {
    const csvHeaders = ['Waypoint', 'Longitude', 'Latitude', 'Distance (m)'];
    const csvRows = coordinates.map(
      (coord) =>
        `${coord.id},${coord.longitude.toFixed(8)},${coord.latitude.toFixed(8)},${coord.distance.toFixed(2)}`,
    );

    const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'mission_planner.csv';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='max-w-3xl'>
        <DialogHeader className='flex flex-row items-center justify-between'>
          <DialogTitle>Mission Planner</DialogTitle>
          <DialogClose className='h-6 w-6 text-gray-500 hover:text-gray-700'>
            {/* <X className="w-4 h-4" /> */}
          </DialogClose>
        </DialogHeader>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b'>
                <th className='p-2 text-left'>Waypoint</th>
                <th className='p-2 text-left'>Coordinates</th>
                <th className='p-2 text-left'>Distance (m)</th>
                <th className='p-2 text-left'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coordinates.map((coord, index) => (
                <tr key={coord.id} className='border-b'>
                  <td className='p-2'>{coord.id}</td>
                  <td className='p-2'>
                    {coord.longitude.toFixed(8)}, {coord.latitude.toFixed(8)}
                  </td>
                  <td className='p-2'>{coord.distance.toFixed(2)}</td>
                  <td className='p-2'>
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreHorizontal className='h-4 w-4' />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => onInsertPolygon(index, 'before')}
                        >
                          Insert Polygon Before
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onInsertPolygon(index, 'after')}
                        >
                          Insert Polygon After
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='mt-4 flex justify-end'>
          <Button
            onClick={exportToCSV}
            className='rounded bg-blue-500 px-4 py-2 text-white shadow hover:bg-blue-600'
          >
            Export to CSV
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
