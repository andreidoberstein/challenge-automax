import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Package, ShoppingCart, User, Calendar, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Cart } from '@/api/carts';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface CartDetailsModalProps {
  cart: Cart | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

function CartDetailsContent({ cart, isLoading }: { cart: Cart | null; isLoading: boolean }) {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16" />
          ))}
        </div>
        <Skeleton className="h-8" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12" />
          ))}
        </div>
      </div>
    );
  }

  if (!cart) return null;

  return (
    <div className="space-y-6 p-4 md:p-0">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <ShoppingCart className="h-4 w-4" />
            ID do Carrinho
          </div>
          <p className="font-semibold text-lg">#{cart.id}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <User className="h-4 w-4" />
            User ID
          </div>
          <p className="font-semibold text-lg">{cart.userId}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Calendar className="h-4 w-4" />
            Data
          </div>
          <p className="font-semibold">{formatDate(cart.date)}</p>
        </div>
        <div className="bg-muted/50 rounded-lg p-3 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Package className="h-4 w-4" />
            Total de Produtos
          </div>
          <p className="font-semibold text-lg">{cart.totalQuantity}</p>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Itens do Carrinho
        </h3>
        {cart.products && cart.products.length > 0 ? (
          <div className="border rounded-lg divide-y">
            {cart.products.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 text-primary rounded-full p-2">
                    <Package className="h-4 w-4" />
                  </div>
                  <span className="font-medium">Produto #{item.productId}</span>
                </div>
                <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                  Qtd: {item.quantity}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">
            Nenhum item no carrinho
          </p>
        )}
      </div>
    </div>
  );
}

export function CartDetailsModal({ cart, isOpen, onClose, isLoading }: CartDetailsModalProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Detalhes do Carrinho
            </DialogTitle>
          </DialogHeader>
          <CartDetailsContent cart={cart} isLoading={isLoading} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="flex items-center justify-between">
          <DrawerTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Detalhes do Carrinho
          </DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <CartDetailsContent cart={cart} isLoading={isLoading} />
      </DrawerContent>
    </Drawer>
  );
}
