import { Component, type ReactNode } from "react";

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error): void {
    // eslint-disable-next-line no-console
    console.error(error);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return <div className="p-6 text-error">Something went wrong.</div>;
    }

    return this.props.children;
  }
}
