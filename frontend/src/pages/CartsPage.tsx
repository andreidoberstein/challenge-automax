import { useState, useCallback } from "react";
import { format } from "date-fns";
import { ShoppingCart } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listCarts, getCartById, syncCarts } from "@/api/carts";
import { Filters } from "@/components/Filters";
import { CartsTable } from "@/components/CartsTable";
import { CartDetailsModal } from "@/components/CartDetailsModal";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { EmptyState } from "@/components/EmptyState";
import { ErrorState } from "@/components/ErrorState";
import type { CartFilters } from "@/types/filters";
import { useToast } from "@/hooks/use-toast";

export function CartsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<CartFilters>({
    userId: "",
    dateFrom: undefined,
    dateTo: undefined,
  });

  const [selectedCartId, setSelectedCartId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buildQueryParams = useCallback(
    () => ({
      userId: filters.userId ? Number(filters.userId) : undefined,
      dateFrom: filters.dateFrom
        ? format(filters.dateFrom, "yyyy-MM-dd")
        : undefined,
      dateTo: filters.dateTo ? format(filters.dateTo, "yyyy-MM-dd") : undefined,
    }),
    [filters],
  );

  const {
    data: carts = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["carts", buildQueryParams()],
    queryFn: () => listCarts(buildQueryParams()),
  });

  const { data: selectedCart, isLoading: isLoadingDetails } = useQuery({
    queryKey: ["cart", selectedCartId],
    queryFn: () => getCartById(selectedCartId!),
    enabled: selectedCartId !== null,
  });

  const syncMutation = useMutation({
    mutationFn: syncCarts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      toast({
        title: "Sincronização concluída",
        description: "Os carrinhos foram sincronizados com sucesso.",
      });
    },
    onError: () => {
      toast({
        title: "Erro na sincronização",
        description: "Não foi possível sincronizar os carrinhos.",
        variant: "destructive",
      });
    },
  });

  const handleApplyFilters = (newFilters: CartFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      userId: "",
      dateFrom: undefined,
      dateTo: undefined,
    });
  };

  const handleViewDetails = (id: number) => {
    setSelectedCartId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCartId(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 md:py-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 text-primary rounded-lg p-2">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">
              Painel de Carrinhos
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        <Filters
          onApply={handleApplyFilters}
          onClear={handleClearFilters}
          onSync={() => syncMutation.mutate()}
          isSyncing={syncMutation.isPending}
        />

        {isLoading && <LoadingSkeleton />}

        {isError && (
          <ErrorState
            message={error instanceof Error ? error.message : undefined}
            onRetry={() => refetch()}
          />
        )}

        {!isLoading && !isError && carts.length === 0 && <EmptyState />}

        {!isLoading && !isError && carts.length > 0 && (
          <CartsTable carts={carts} onViewDetails={handleViewDetails} />
        )}
      </main>

      <CartDetailsModal
        cart={selectedCart || null}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        isLoading={isLoadingDetails}
      />
    </div>
  );
}
