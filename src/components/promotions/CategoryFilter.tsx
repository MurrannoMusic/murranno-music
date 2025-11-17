import { Button } from '@/components/ui/button';
import { PromotionCategory } from '@/types/promotion';
import { Badge } from '@/components/ui/badge';

interface CategoryFilterProps {
  categories: PromotionCategory[];
  selectedCategory: PromotionCategory | 'all';
  onCategoryChange: (category: PromotionCategory | 'all') => void;
  serviceCounts?: Record<string, number>;
}

export const CategoryFilter = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  serviceCounts = {}
}: CategoryFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === 'all' ? 'default' : 'outline'}
        onClick={() => onCategoryChange('all')}
        className="rounded-full"
      >
        All Services
        {serviceCounts['all'] > 0 && (
          <Badge variant="secondary" className="ml-2">
            {serviceCounts['all']}
          </Badge>
        )}
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? 'default' : 'outline'}
          onClick={() => onCategoryChange(category)}
          className="rounded-full"
        >
          {category}
          {serviceCounts[category] > 0 && (
            <Badge variant="secondary" className="ml-2">
              {serviceCounts[category]}
            </Badge>
          )}
        </Button>
      ))}
    </div>
  );
};
