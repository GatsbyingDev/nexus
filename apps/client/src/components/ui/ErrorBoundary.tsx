import { Component, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    // eslint-disable-next-line no-console
    console.error("UI ErrorBoundary caught an error", error);
  }

  private reload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="grid h-full place-items-center bg-background p-6 text-center">
          <div className="max-w-md rounded-xl border border-outline-variant bg-surface-container p-6">
            <h2 className="font-headline text-2xl text-on-surface">Something went wrong</h2>
            <p className="mt-2 text-sm text-on-surface-variant">
              An unexpected UI error occurred. Reload to try again.
            </p>
            <button
              onClick={this.reload}
              className="mt-4 rounded bg-primary-container px-4 py-2 text-sm font-semibold text-white"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
