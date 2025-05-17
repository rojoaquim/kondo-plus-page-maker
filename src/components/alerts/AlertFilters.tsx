
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface AlertFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AlertFilters: React.FC<AlertFiltersProps> = ({
  searchQuery,
  setSearchQuery
}) => {
  return (
    <div className="flex items-center relative mb-4">
      <Search size={20} className="absolute left-3 text-gray-400" />
      <Input
        placeholder="Buscar avisos..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};

export default AlertFilters;
