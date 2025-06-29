// src/components/ErrorBoundary.tsx
import ErrorPage from "@renderer/pages/error";
import { Component, ReactNode, ErrorInfo } from "react";

interface ErrorBoundaryProps {
	children: ReactNode;
}

interface ErrorBoundaryState {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
	constructor(props: ErrorBoundaryProps) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError(error: Error): ErrorBoundaryState {
		// Update state so the next render will show the fallback UI
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
		
		// Update state with the error
		this.setState({ error });
		
		// Stop apps when an error occurs - using IPC to avoid hooks in class component
		this.stopAppsOnError();
	}

	private stopAppsOnError = () => {
		try {
			// Use IPC to communicate with main process to stop apps
			// This avoids using hooks in a class component
			if (window.electron?.ipcRenderer) {
				window.electron.ipcRenderer.send("stop-all-apps-on-error");
			}
		} catch (err) {
			console.error("Failed to stop apps on error:", err);
		}
	};

	render() {
		if (this.state.hasError) {
			return <ErrorPage error={this.state.error} />;
		}

		return this.props.children;
	}
}
