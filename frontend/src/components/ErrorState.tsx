import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
}

export function ErrorState({ message = 'Ocorreu um erro ao carregar os dados.', onRetry }: ErrorStateProps) {
  return (
    <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-8 text-center">
      <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="font-semibold text-lg mb-2 text-destructive">Erro ao carregar</h3>
      <p className="text-muted-foreground mb-4">{message}</p>
      <Button onClick={onRetry} variant="outline" className="gap-2">
        <RefreshCw className="h-4 w-4" />
        Tentar novamente
      </Button>
    </div>
  );
}
