import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarIcon, Filter, X, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { CartFilters, FilterErrors } from '@/types/filters';

interface FiltersProps {
  onApply: (filters: CartFilters) => void;
  onClear: () => void;
  onSync: () => void;
  isSyncing: boolean;
}

export function Filters({ onApply, onClear, onSync, isSyncing }: FiltersProps) {
  const [userId, setUserId] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [errors, setErrors] = useState<FilterErrors>({});

  const validateFilters = (): boolean => {
    const newErrors: FilterErrors = {};

    if (userId && (isNaN(Number(userId)) || Number(userId) <= 0)) {
      newErrors.userId = 'User ID deve ser um número positivo';
    }

    if (dateFrom && dateTo && dateFrom > dateTo) {
      newErrors.dateRange = 'Data inicial deve ser menor ou igual à data final';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApply = () => {
    if (validateFilters()) {
      onApply({ userId, dateFrom, dateTo });
    }
  };

  const handleClear = () => {
    setUserId('');
    setDateFrom(undefined);
    setDateTo(undefined);
    setErrors({});
    onClear();
  };

  return (
    <div className="bg-card rounded-lg border p-4 md:p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-foreground">
          <Filter className="h-5 w-5" />
          <h2 className="font-semibold">Filtros</h2>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onSync}
          disabled={isSyncing}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isSyncing && "animate-spin")} />
          Sincronizar
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label htmlFor="userId">User ID</Label>
          <Input
            id="userId"
            type="number"
            placeholder="Ex: 1"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            min={1}
          />
          {errors.userId && (
            <p className="text-sm text-destructive">{errors.userId}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>De</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={setDateFrom}
                locale={ptBR}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <Label>Até</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "dd/MM/yyyy", { locale: ptBR }) : "Selecione"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={setDateTo}
                locale={ptBR}
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-end gap-2">
          <Button onClick={handleApply} className="flex-1" >
            Aplicar
          </Button>
          <Button variant="ghost" onClick={handleClear} size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {errors.dateRange && (
        <p className="text-sm text-destructive">{errors.dateRange}</p>
      )}
    </div>
  );
}
