// src/components/ErrorBoundary.tsx
import ErrorPage from "@renderer/pages/error"; // Assuming ErrorPage will be modified to accept props
import React from "react";

interface ErrorBoundaryProps {
	children: React.ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error: Error | null;
	errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false, error: null, errorInfo: null };
	}

	static getDerivedStateFromError(_: Error): ErrorBoundaryState {
		// _ is the error argument
		// Return a new state object to indicate an error has occurred
		return { hasError: true, error: null, errorInfo: null }; // error and errorInfo are set in componentDidCatch
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		// Log the error and error info
		console.error("ErrorBoundary caught an error:", error, errorInfo);
		// Update state with the error and errorInfo
		this.setState({ error, errorInfo, hasError: true }); // Ensure hasError is also set here
	}

	render() {
		if (this.state.hasError) {
			// Pass the error and errorInfo to ErrorPage
			// @ts-expect-error ErrorPage will be updated later to accept these props
			return (
				<ErrorPage error={this.state.error} errorInfo={this.state.errorInfo} />
			);
		}

		return this.props.children;
	}
}
