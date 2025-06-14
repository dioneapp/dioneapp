export const en = {
	// common actions and states
	common: {
		cancel: "Cancel",
		loading: "Loading...",
		error: "Error",
		success: "Success",
		pending: "Pending",
		back: "Back",
	},

	// authentication and access related
	noAccess: {
		title: "Join Dione whitelist",
		description:
			"Dione is under construction and only a limited amount of users can access it, join our whitelist now to get access to future versions of our app.",
		join: "Join",
		logout: "Logout",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Welcome to",
			subtitle:
				"Thank you for joining us early on this journey. Log into your account to get started.",
			login: "Log in",
			copyLink: "Copy Link",
		},
		loggingIn: {
			title: "Logging in...",
			authError: "Could not authenticate?",
			goBack: "Go back",
		},
		ready: {
			title: "You are ready!",
			subtitle: "We are glad to have you here",
			finish: "Finish",
		},
		clipboard: {
			success:
				"Copied to the clipboard correctly, now paste it in your browser!",
		},
	},

	// error handling
	error: {
		title: "Unexpected error occurred",
		description:
			"We have detected an unexpected error in the application, we are sorry for the inconvenience.",
		return: "Return",
		report: {
			toTeam: "Report to team",
			sending: "Sending report...",
			success: "Report sent!",
			failed: "Failed to send report",
		},
	},

	// account related
	account: {
		title: "Account",
		wip: "WIP",
		stats: {
			timeSpent: {
				title: "Time spent",
				subtitle: "in last 7 days",
			},
			sessions: {
				title: "Sessions",
				subtitle: "in last 7 days",
			},
			shared: {
				title: "Shared",
				subtitle: "in last 7 days",
			},
			streak: {
				title: "Streak",
				subtitle: "consecutive days",
				days: "days",
			},
		},
	},

	// toast notifications
	toast: {
		close: "Close",
		install: {
			downloading: "Downloading %s...",
			starting: "Starting %s...",
			uninstalling: "Uninstalling %s...",
			reconnecting: "Reconnecting %s...",
			retrying: "Trying to install %s again...",
			success: {
				stopped: "%s stopped successfully.",
				uninstalled: "%s uninstalled successfully.",
				logsCopied: "Logs successfully copied to clipboard.",
				depsInstalled: "Dependencies installed successfully.",
				shared: "Download link copied to clipboard!",
			},
			error: {
				download: "Error initiating download: %s",
				start: "Error initiating %s: %s",
				stop: "Error stopping %s: %s",
				uninstall: "Error uninstalling %s: %s",
				serverRunning: "Server is already running.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Stopping applications...",
			description:
				"Dione will close automatically after closing all open applications.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Explore, Install, Innovate — in 1 Click.",
		update: {
			title: "Update Available",
			description:
				"A new version of Dione is available, please restart the app to update.",
			tooltip: "New update available, please restart Dione to update.",
		},
		tooltips: {
			library: "Library",
			settings: "Settings",
			account: "Account",
			logout: "Logout",
			login: "Login",
		},
	},

	// home page
	home: {
		featured: "Featured",
		explore: "Explore",
	},

	// settings page
	settings: {
		applications: {
			title: "Applications",
			installationDirectory: {
				label: "Installation Directory",
				description:
					"Choose where new applications will be installed by default",
			},
			cleanUninstall: {
				label: "Clean Uninstall",
				description:
					"Remove all related dependencies when uninstalling applications",
			},
		},
		interface: {
			title: "Interface",
			displayLanguage: {
				label: "Display Language",
				description: "Choose your preferred interface language",
			},
			helpTranslate: "🤔 Not seeing your language? Help us add more!",
			compactView: {
				label: "Compact View",
				description:
					"Use a more condensed layout to fit more content on screen",
			},
		},
		notifications: {
			title: "Notifications",
			systemNotifications: {
				label: "System Notifications",
				description: "Show desktop notifications for important events",
			},
			installationAlerts: {
				label: "Installation Alerts",
				description: "Get notified when application installations complete",
			},
		},
		privacy: {
			title: "Privacy",
			errorReporting: {
				label: "Error Reporting",
				description: "Help improve Dione by sending anonymous error reports",
			},
		},
		other: {
			title: "Other",
			logsDirectory: {
				label: "Logs Directory",
				description: "Location where application logs are stored",
			},
			submitFeedback: {
				label: "Submit Feedback",
				description: "Report any issues or problems you encounter",
				button: "Send Report",
			},
			showOnboarding: {
				label: "Show onboarding",
				description:
					"Reset Dione to its initial state and show again the onboarding for reconfiguration",
				button: "Reset",
			},
		},
	},

	// report form
	report: {
		title: "Describe the Issue",
		description:
			"Please provide details about what happened and what you were trying to do.",
		placeholder:
			"Example: I was trying to install an application when this error occurred...",
		systemInformationTitle: "System Information",
		disclaimer:
			"The following system information and an anonymous ID will be included with your report.",
		success: "Report sent successfully!",
		error: "Failed to send report. Please try again.",
		send: "Send Report",
		sending: "Sending...",
	},

	// quick launch component
	quickLaunch: {
		title: "Quick Launch",
		addApp: "Add App",
		selectApp: {
			title: "Select an App",
			description: "{count} apps are available. You can choose up to {max}.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "Some dependencies are missing!",
		installing: "Installing dependencies...",
		install: "Install",
		logs: {
			initializing: "Initializing dependency download...",
			loading: "Loading...",
			connected: "Connected to server",
			disconnected: "Disconnected from server",
			error: {
				socket: "Error setting up socket",
				install: "❌ Error installing dependencies: {error}",
			},
			allInstalled: "All dependencies are already installed.",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstalling: {
			title: "Uninstalling",
			deps: "Uninstalling dependencies",
			wait: "please wait...",
		},
		success: {
			title: "Uninstalled",
			subtitle: "successfully",
			closing: "Closing this modal in",
			seconds: "seconds...",
		},
		error: {
			title: "An unexpected",
			subtitle: "error",
			hasOccurred: "has occurred",
			deps: "Dione has not been able to remove any dependency, please do it manually.",
			general: "Please try again later or check the logs for more information.",
		},
		loading: {
			title: "Loading...",
			wait: "Please wait...",
		},
	},

	// logs component
	logs: {
		loading: "Loading...",
		disclaimer:
			"Logs shown are from the app itself. If you see an error, please report it to the original app's developers first.",
		status: {
			success: "Success",
			error: "Error",
			pending: "Pending",
		},
	},

	// loading states
	loading: {
		text: "Loading...",
	},

	// iframe component
	iframe: {
		back: "Back",
		openFolder: "Open folder",
		openInBrowser: "Open in Browser",
		fullscreen: "Fullscreen",
		stop: "Stop",
		reload: "Reload",
	},

	// actions component
	actions: {
		reconnect: "Reconnect",
		start: "Start",
		uninstall: "Uninstall",
		install: "Install",
		publishedBy: "Published by",
	},

	// promo component
	promo: {
		title: "Want to be featured here?",
		description: "Showcase your tool to our community",
		button: "Get Featured",
	},

	// installed component
	installed: {
		title: "Your library",
		empty: {
			title: "You do not have any applications installed",
			action: "Install one now",
		},
	},

	// feed component
	feed: {
		noScripts: "No scripts found",
		errors: {
			notArray: "Fetched data is not an array",
			fetchFailed: "Failed to fetch scripts",
		},
	},

	// search component
	search: {
		placeholder: "Search scripts...",
		filters: {
			audio: "Audio",
			image: "Image",
			video: "Video",
			chat: "Chat",
		},
	},
} as const;
