export const en = {
	// common actions and states
	common: {
		cancel: "Cancel",
		loading: "Loading...",
		error: "Error",
		success: "Success",
		pending: "Pending",
		back: "Back",
		unselectAll: "Unselect All",
		selectAll: "Select All",
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
			skipLogin: "Continue without login",
		},
		loggingIn: {
			title: "Logging in...",
			authError: "Could not authenticate?",
			goBack: "Go back",
		},
		languageSelector: {
			title: "Select your language",
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
		selectPath: {
			title: "Select installation path",
			description:
				"This folder will contain all your installed scripts, dependencies, and project files. Choose a location that's easily accessible and has enough storage space.",
			button: "Select a path",
			success: "Next",
			warning:
				"Do not select the same folder where Dione is installed. This can cause conflicts and errors during updates.",
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
		logout: "Logout",
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
				tooManyApps:
					"Slow down! You already have 6 apps running at the same time.",
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
		activeApps: "Active Apps",
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
			capture: "Capture",
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
			binDirectory: {
				label: "Bin Directory",
				description:
					"Choose where the application binaries will be stored for easy access",
			},
			cleanUninstall: {
				label: "Clean Uninstall",
				description:
					"Remove all related dependencies when uninstalling applications",
			},
			autoOpenAfterInstall: {
				label: "Auto-Open After Install",
				description:
					"Automatically open applications for the first time after installation",
			},
			deleteCache: {
				label: "Delete Cache",
				description: "Remove all cached data from applications",
				button: "Delete Cache",
				deleting: "Deleting...",
				deleted: "Deleted",
				error: "Error",
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
			discordRPC: {
				label: "Discord Rich Presence",
				description: "Show your current activity in Discord status",
			},
			successSound: {
				label: "Enable Success Sound",
				description:
					"Enable the sound that plays when applications finish installing",
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
			disableAutoUpdate: {
				label: "Disable auto-updates",
				description:
					"Disables automatic updates. Caution: your application may miss important fixes or security patches. This option is not recommended for most users.",
			},
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
			variables: {
				label: "Variables",
				description: "Manage application variables and their values",
				button: "Open Variables",
			},
			checkUpdates: {
				label: "Check for updates",
				description:
					"Check for updates and notify you when a new version is available",
				button: "Check for updates",
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
		contribute: "Help us make this script compatible with all devices",
	},

	// quick launch component
	quickLaunch: {
		title: "Quick Launch",
		addApp: "Add App",
		tooltips: {
			noMoreApps: "No available apps to add",
		},
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
		openNewWindow: "Open new window",
		fullscreen: "Fullscreen",
		stop: "Stop",
		reload: "Reload",
		logs: "Logs",
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

	// local component
	local: {
		title: "Local scripts",
		upload: "Upload script",
		noScripts: "No scripts found",
		deleting: "Deleting script, please wait...",
		uploadModal: {
			title: "Upload Script",
			selectFile: "Click to select a file",
			selectedFile: "Selected File",
			scriptName: "Script name",
			scriptDescription: "Script description (optional)",
			uploadFile: "Upload File",
			uploading: "Uploading...",
			errors: {
				uploadFailed: "Failed to upload script. Please try again.",
				uploadError: "An error occurred while uploading the script.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "No scripts found",
		errors: {
			notArray: "Fetched data is not an array",
			fetchFailed: "Failed to fetch scripts",
			notSupported: "Unfortunately %s is not supported on your %s.",
			notSupportedTitle: "Your device may be incompatible.",
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
