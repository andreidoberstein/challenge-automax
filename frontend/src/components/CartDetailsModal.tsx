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
import { deleteCart, updateCart, type Cart } from '@/api/carts';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

interface CartDetailsModalProps {
  cart: Cart | null;
  isOpen: boolean;
  onClose: () => void;
  isLoading: boolean;
}

function CartDetailsContent({ cart, isLoading, onClose }: { cart: Cart | null; isLoading: boolean; onClose: () => void; }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [userIdText, setUserIdText] = useState(() => (cart ? String(cart.userId) : ""));
  const [dateText, setDateText] = useState(() => (cart ? cart.date : ""));

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!cart) throw new Error("Carrinho não carregado");

      const userId = Number(userIdText);
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new Error("User ID deve ser um inteiro positivo.");
      }

      const d = new Date(dateText)
      
      return updateCart(cart.id, {
        userId,
        date: d.toISOString()
        // items:
      });
    },
    onSuccess: (updated) => {
      toast({ title: "Atualizado", description: "Carrinho atualizado com sucesso." });

      queryClient.invalidateQueries({ queryKey: ["carts"] });
      queryClient.invalidateQueries({ queryKey: ["cart", updated.id] });
    },
    onError: (err) => {
      console.log(err)
      toast({
        title: "Erro ao atualizar",
        description: err?.message ?? "Não foi possível atualizar o carrinho.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!cart) throw new Error("Carrinho não carregado");
      return deleteCart(cart.id);
    },
    onSuccess: () => {
      toast({ title: "Removido", description: "Carrinho removido com sucesso." });

      queryClient.invalidateQueries({ queryKey: ["carts"] });
      if (cart) queryClient.removeQueries({ queryKey: ["cart", cart.id] });

      onClose();
    },
    onError: () => {
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover o carrinho.",
        variant: "destructive",
      });
    },
  });

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
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

      <div className="border rounded-lg p-4 space-y-3">
        <h3 className="font-semibold">Ações (banco local)</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">User ID</label>
            <input
              className="w-full border rounded-md px-3 py-2 bg-background"
              value={userIdText}
              onChange={(e) => setUserIdText(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-muted-foreground">Date</label>
            <input
              className="w-full border rounded-md px-3 py-2 bg-background"
              value={formatDate(dateText)}
              onChange={(e) => setDateText(e.target.value)}
              placeholder="2020-03-02"
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end">
          <Button
            onClick={() => updateMutation.mutate()}
            disabled={updateMutation.isPending || deleteMutation.isPending}
          >
            { updateMutation.isPending ? "Salvando..." : "Atualizar" }
          </Button>

          <Button
            variant="destructive"
            onClick={() => {
              const ok = confirm(`Remover carrinho #${cart.id}?`);
              if (ok) deleteMutation.mutate();
            }}
            disabled={updateMutation.isPending || deleteMutation.isPending}
          >
            { deleteMutation.isPending ? "Removendo..." : "Remover" }
          </Button>
        </div>
      </div>

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
        {cart.items && cart.items.length > 0 ? (
          <div className="border rounded-lg divide-y">
            {cart.items.map((item, index) => (
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
      <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Detalhes do Carrinho
            </DialogTitle>
          </DialogHeader>
          <CartDetailsContent 
            key={cart?.id ?? (isLoading ? "loading" : "empty")}
            cart={cart} 
            isLoading={isLoading} 
            onClose={onClose} 
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
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
        <CartDetailsContent 
          key={cart?.id ?? (isLoading ? "loading" : "empty")}
          cart={cart} 
          isLoading={isLoading} 
          onClose={onClose}/>
      </DrawerContent>
    </Drawer>
  );
}
