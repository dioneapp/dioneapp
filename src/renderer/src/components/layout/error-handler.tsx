// src/components/ErrorBoundary.tsx
import { useScriptsContext } from "@/components/contexts/ScriptsContext";
import ErrorPage from "@/pages/error";
import * as React from "react";

interface ErrorBoundaryProps {
	children: React.ReactNode;
}

interface ErrorBoundaryInnerProps extends ErrorBoundaryProps {
	stopApps: () => void;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

class ErrorBoundaryInner extends React.Component<
	ErrorBoundaryInnerProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryInnerProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
		this.setState({ error });

		// Stop apps when an error is caught
		this.props.stopApps();
	}

	render() {
		if (this.state.hasError) {
			return <ErrorPage error={this.state.error} />;
		}

		return this.props.children;
	}
}

export const ErrorBoundary = (props: ErrorBoundaryProps) => {
	const { activeApps, handleStopApp } = useScriptsContext();

	const stopApps = () => {
		for (const app of activeApps) {
			handleStopApp(app.id, app.name);
		}
	};

	return <ErrorBoundaryInner {...props} stopApps={stopApps} />;
};
