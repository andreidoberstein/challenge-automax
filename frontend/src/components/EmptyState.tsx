import { ShoppingCart } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="bg-card rounded-lg border p-12 text-center">
      <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <ShoppingCart className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-lg mb-2">Nenhum carrinho encontrado</h3>
      <p className="text-muted-foreground">
        Tente ajustar os filtros ou sincronizar os dados.
      </p>
    </div>
  );
}
