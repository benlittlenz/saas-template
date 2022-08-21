import React, { ErrorInfo } from "react";

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: Error | null; errorInfo: ErrorInfo | null }
> {
  constructor(
    props:
      | { children: React.ReactNode }
      | Readonly<{ children: React.ReactNode }>
  ) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  componentDidCatch?(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
