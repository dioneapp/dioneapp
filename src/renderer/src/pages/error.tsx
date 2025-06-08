import Icon from "@renderer/components/icons/icon";
import { openLink } from "@renderer/utils/openLink";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react"; // Added useState

interface ErrorPageProps {
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
}

export default function ErrorPage({ error, errorInfo }: ErrorPageProps) {
  const navigate = useNavigate();
  const [userDescription, setUserDescription] = useState('');

  // const restart = () => {
  //  window.electron.ipcRenderer.send("restart");
  // };

  const goHome = () => {
    navigate("/");
    // Optionally, reload the window to ensure a fresh state if returning home after an error
    window.location.reload();
  };

  const handleReportError = async () => {
    if (!error && !userDescription) {
      alert("Please describe the issue or ensure an error was detected.");
      return;
    }

    let reportPayload;

    if (!error) {
      // User is reporting an issue manually without a preceding crash
      const genericError = new Error("User-initiated report without a caught component error.");
      reportPayload = {
        name: genericError.name,
        message: userDescription || "User-initiated report.", // Use description as message if no error
        stack: genericError.stack,
        componentStack: errorInfo?.componentStack,
        userDescription: userDescription || "No additional user description provided.",
      };
      console.log("Sending generic user report:", reportPayload);
    } else {
      // Reporting a crash caught by ErrorBoundary
      reportPayload = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo?.componentStack,
        userDescription: userDescription,
      };
      console.log("Sending error report:", reportPayload);
    }

    try {
      await window.electron.ipcRenderer.invoke('manual-report-error', reportPayload);
      alert("Report sent successfully! Our team will look into it.");
    } catch (ipcError) {
      console.error("Failed to send report via IPC:", ipcError);
      alert("Failed to send report. Please check your connection or try again later.");
    }
  };

  return (
    <div className="min-h-screen pt-4 overflow-hidden bg-neutral-900 text-neutral-100 flex flex-col items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <main className="flex flex-col items-center pb-12">
          <Icon name="DioDead" className="h-36 w-36 sm:h-44 sm:w-44 mb-8 sm:mb-12 text-red-500" />
          <h1 className="text-2xl sm:text-3xl font-semibold mb-4 text-neutral-50">
            Oops! Something went wrong.
          </h1>
          <p className="text-neutral-400 text-sm sm:text-base max-w-md text-center text-pretty mb-6">
            We've encountered an unexpected issue. You can try returning home, or help us by describing what happened and sending a report.
          </p>

          {error && (
            <div className="mb-6 p-3 bg-neutral-800 border border-neutral-700 rounded-md text-left w-full max-w-md">
              <h3 className="text-md font-semibold text-red-400 mb-1">Error Details:</h3>
              <p className="text-xs text-neutral-300 whitespace-pre-wrap">
                <strong>Name:</strong> {error.name}
                <br />
                <strong>Message:</strong> {error.message}
              </p>
              {errorInfo?.componentStack && (
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer text-neutral-400 hover:text-neutral-200">
                    Component Stack
                  </summary>
                  <pre className="mt-1 p-2 bg-neutral-700/50 rounded-sm overflow-auto text-neutral-300">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
               {error.stack && (
                <details className="mt-2 text-xs">
                  <summary className="cursor-pointer text-neutral-400 hover:text-neutral-200">
                    Error Stack
                  </summary>
                  <pre className="mt-1 p-2 bg-neutral-700/50 rounded-sm overflow-auto text-neutral-300">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          )}

          <textarea
            className="mt-2 w-full max-w-md p-2 border border-neutral-600 bg-neutral-800 rounded-md text-neutral-300 placeholder-neutral-500 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            rows={4}
            placeholder="Optional: Add more details about what happened or what you were doing..."
            value={userDescription}
            onChange={(e) => setUserDescription(e.target.value)}
          />

          <div className="flex flex-col sm:flex-row gap-3 mt-6 w-full max-w-md">
            <button
              onClick={goHome}
              type="button"
              className="w-full sm:w-auto flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 transition-colors duration-300 rounded-md text-white font-semibold text-center cursor-pointer"
            >
              Return to Home
            </button>
            <button
              onClick={handleReportError}
              type="button"
              className="w-full sm:w-auto flex-1 px-4 py-2 border border-neutral-600 bg-neutral-700 hover:bg-neutral-600 transition-colors duration-300 rounded-md text-neutral-200 font-medium text-center cursor-pointer"
            >
              Report to Team
            </button>
          </div>
          <button
            onClick={() => openLink("https://github.com/dioneapp/dioneapp/issues/new?template=BUG.yml")}
            type="button"
            className="mt-4 text-xs text-neutral-500 hover:text-blue-400 transition-colors"
          >
            Or, submit an issue on GitHub
          </button>
        </main>
      </div>
    </div>
  );
}
