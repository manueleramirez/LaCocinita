import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
          <div className="text-[var(--color-error)] text-6xl mb-4">!</div>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-2">Algo salió mal</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mb-4 max-w-md">
            Ocurrió un error inesperado. Intenta recargar la página.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm hover:brightness-110 transition-all"
          >
            Recargar página
          </button>
          {this.state.error && (
            <details className="mt-4 text-left max-w-md">
              <summary className="text-xs text-[var(--color-text-secondary)] cursor-pointer">Detalles técnicos</summary>
              <pre className="mt-2 text-xs text-[var(--color-error)] bg-[var(--color-bg-secondary)] p-3 rounded-lg overflow-auto max-h-40">
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
