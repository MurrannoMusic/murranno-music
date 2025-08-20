import { Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export const FloatingActionButton = () => {
  return (
    <Link to="/upload">
      <Button 
        size="icon" 
        className="fab gradient-primary music-button shadow-glow hover:shadow-primary"
      >
        <Plus className="h-6 w-6" />
      </Button>
    </Link>
  );
};