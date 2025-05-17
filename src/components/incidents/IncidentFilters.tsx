
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface IncidentFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

const IncidentFilters: React.FC<IncidentFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter
}) => {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center relative flex-1">
        <Search size={20} className="absolute left-3 text-gray-400" />
        <Input
          placeholder="Buscar incidentes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            {statusFilter || "Filtrar"}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[200px]">
          <DropdownMenuRadioGroup value={statusFilter} onValueChange={setStatusFilter}>
            <DropdownMenuRadioItem value="">Todos</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Aberto">Aberto</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Respondido">Respondido</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Resolvido">Resolvido</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default IncidentFilters;
