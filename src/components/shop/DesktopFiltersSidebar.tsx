import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FilterState {
  priceRange: [number, number];
  prescription: string;
  inStock: boolean | null;
  featured: boolean;
  sortBy: string;
  order: 'asc' | 'desc';
}

interface DesktopFiltersSidebarProps {
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filters: FilterState;
  handleFilterChange: (key: keyof FilterState, value: any) => void;
  clearFilters: () => void;
}

export default function DesktopFiltersSidebar({
  showFilters,
  setShowFilters,
  filters,
  handleFilterChange,
  clearFilters,
}: DesktopFiltersSidebarProps) {
  return (
    <div className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
      <Card className='bg-transparent shadow-medical'>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Filters</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(false)}
              className="lg:hidden"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
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
                <SelectValue placeholder="Select sorting option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="name-asc">Name A-Z</SelectItem>
                <SelectItem value="name-desc">Name Z-A</SelectItem>
                <SelectItem value="price-asc">Price Low to High</SelectItem>
                <SelectItem value="price-desc">Price High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

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
                className="w-full slider bg-gray-900"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>रु{filters.priceRange[0]}</span>
                <span>रु{filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Prescription Required */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prescription
            </label>
            <Select
              value={filters.prescription}
              onValueChange={(value) => handleFilterChange('prescription', value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select prescription type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                <SelectItem value="yes">Prescription Required</SelectItem>
                <SelectItem value="no">No Prescription</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

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
                <SelectValue placeholder="Select stock status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="true">In Stock</SelectItem>
                <SelectItem value="false">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

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

          <Separator />

          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full bg-medical-green-400 shadow-medical rounded-full text-gray-700 hover:text-gray-900 hover:bg-medical-green-400"
          >
            Clear All Filters
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
