// src/components/ErrorBoundary.tsx
import ErrorPage from "@renderer/pages/error";
import React from "react";
import { useScriptsContext } from "../contexts/ScriptsContext";

interface ErrorBoundaryProps {
	children: React.ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends React.Component<
	ErrorBoundaryProps,
	ErrorBoundaryState
> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	async stopApps() {
		const { activeApps, handleStopApp } = useScriptsContext();
		for (const app of activeApps) {
			handleStopApp(app.id, app.name);
		}
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
		this.setState({ error });
	}

	render() {
		if (this.state.hasError) {
			this.stopApps();
			return <ErrorPage error={this.state.error} />;
		}

		return this.props.children;
	}
}
