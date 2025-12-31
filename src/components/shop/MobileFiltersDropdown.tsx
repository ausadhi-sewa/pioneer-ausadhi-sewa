import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface FilterState {
  priceRange: [number, number];
  prescription: string;
  inStock: boolean | null;
  featured: boolean;
  sortBy: string;
  order: 'asc' | 'desc';
}

interface MobileFiltersDropdownProps {
  filters: FilterState;
  handleFilterChange: (key: keyof FilterState, value: any) => void;
  clearFilters: () => void;
}

export default function MobileFiltersDropdown({
  filters,
  handleFilterChange,
  clearFilters,
}: MobileFiltersDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="lg:hidden"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4 bg-white/90 shadow-medical" align="end">
        <DropdownMenuLabel>Filters</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <div className="space-y-4">
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <Select
              value={`${filters.sortBy}-${filters.order}`}
              onValueChange={(value) => {
                const [sortBy, order] = value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('order', order as 'asc' | 'desc');
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="price-asc">Price Low to High</SelectItem>
                <SelectItem value="price-desc">Price High to Low</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Prescription */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prescription
            </label>
            <Select
              value={filters.prescription}
              onValueChange={(value) => handleFilterChange('prescription', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Prescription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="yes">Prescription Required</SelectItem>
                <SelectItem value="no">No Prescription</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Stock Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Status
            </label>
            <Select
              value={filters.inStock === null ? 'all' : filters.inStock ? 'true' : 'false'}
              onValueChange={(value) => handleFilterChange('inStock', value === 'all' ? null : value === 'true')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">In Stock</SelectItem>
                <SelectItem value="false">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {/* Featured Products */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filters.featured}
                onChange={(e) => handleFilterChange('featured', e.target.checked)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm font-medium text-gray-700">Featured Products Only</span>
            </label>
          </div>
          
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <div className="px-1 py-2">
              <Slider
                value={[filters.priceRange[0]]}
                onValueChange={(val) => handleFilterChange('priceRange', [val[0], val[1]])}
                min={0}
                max={10000}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>रु{filters.priceRange[0]}</span>
                <span>रु{filters.priceRange[1]}</span>
              </div>
            </div>
          </div>
        </div>
        
        <DropdownMenuSeparator />
        
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full rounded-full bg-accent shadow-medical"
        >
          Clear All Filters
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
