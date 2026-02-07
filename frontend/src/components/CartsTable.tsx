import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Cart } from '@/api/carts';

interface CartsTableProps {
  carts: Cart[];
  onViewDetails: (id: number) => void;
}

export function CartsTable({ carts, onViewDetails }: CartsTableProps) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  return (
    <>
      <div className="hidden md:block rounded-lg border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">ID</TableHead>
              <TableHead className="font-semibold">Data</TableHead>
              <TableHead className="font-semibold">User ID</TableHead>
              <TableHead className="font-semibold text-right">Qtd. Produtos</TableHead>
              <TableHead className="font-semibold text-right">Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {carts.map((cart) => (
              <TableRow key={cart.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">#{cart.id}</TableCell>
                <TableCell>{formatDate(cart.date)}</TableCell>
                <TableCell>{cart.userId}</TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm font-medium">
                    <ShoppingCart className="h-3 w-3" />
                    {cart.totalQuantity}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(cart.id)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Ver detalhes
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="md:hidden space-y-3">
        {carts.map((cart) => (
          <div
            key={cart.id}
            className="bg-card rounded-lg border p-4 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-lg">#{cart.id}</span>
              <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm font-medium">
                <ShoppingCart className="h-3 w-3" />
                {cart.totalQuantity} itens
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Data:</span>
                <p className="font-medium">{formatDate(cart.date)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">User ID:</span>
                <p className="font-medium">{cart.userId}</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(cart.id)}
              className="w-full gap-2"
            >
              <Eye className="h-4 w-4" />
              Ver detalhes
            </Button>
          </div>
        ))}
      </div>
    </>
  );
}
