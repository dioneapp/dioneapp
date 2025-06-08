// src/components/ErrorBoundary.tsx
import React from "react";

interface ErrorBoundaryProps {
	children: React.ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("Error caught by boundary:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="flex flex-col items-center justify-center h-full w-full">
					<h1 className="text-2xl font-semibold mb-4">Something went wrong</h1>
					<p className="text-neutral-400 mb-4">{this.state.error?.message}</p>
					<button
						className="bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
						onClick={() => window.location.reload()}
					>
						Reload page
					</button>
				</div>
			);
		}

		return this.props.children;
	}
}