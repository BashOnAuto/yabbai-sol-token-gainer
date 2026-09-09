import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  declare state: State;
  declare props: Readonly<Props>;
  declare setState: (state: Partial<State> | ((prevState: State) => Partial<State>)) => void;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught component error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="rounded-2xl border border-rose-500/40 bg-slate-900 p-6 text-slate-200 shadow-xl space-y-4 my-6">
          <div className="flex items-center gap-3 text-rose-400">
            <AlertCircle className="h-6 w-6 shrink-0" />
            <h3 className="text-lg font-bold">
              {this.props.fallbackTitle || "Something went wrong loading this view."}
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <div className="pt-2">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-500 px-4 py-2 text-xs font-bold text-white transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
