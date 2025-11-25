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
		uninstall: {
			title: "Uninstall",
			deps: "Uninstall dependencies",
			wait: "please wait...",
		},
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
		installed: "Installed",
		notInstalled: "Not installed",
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
		loadingMore: "Loading more...",
		reachedEnd: "You have reached the end.",
		notEnoughApps: "If you think there are not enough apps,",
		helpAddMore: "please help us to add more",
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

	// network share modal
	networkShare: {
		title: "Share",
		modes: {
			local: "Local",
			public: "Public",
			connecting: "Connecting...",
		},
		warning: {
			title: "Public Access",
			description:
				"Creates a public URL accessible from anywhere. Share only with trusted people.",
		},
		local: {
			shareUrl: "Share URL",
			urlDescription: "Share this URL with devices on your local network",
			localNetwork: "Local Network:",
			description: "This URL works on devices connected to the same network.",
		},
		public: {
			shareUrl: "Public URL",
			urlDescription: "Share this URL with anyone, anywhere in the world",
			passwordTitle: "First-Time Password",
			visitorMessage:
				"Visitors may need to enter this once per device to access the tunnel.",
			stopSharing: "Stop Sharing",
		},
		errors: {
			noAddress: "Unable to get network address. Please check your connection.",
			loadFailed: "Failed to load network information.",
			noUrl: "No URL available to copy.",
			copyFailed: "Failed to copy to clipboard.",
			tunnelFailed: "Failed to start tunnel",
		},
	},

	// login features modal
	loginFeatures: {
		title: "You are missing features",
		description: "Log in to Dione so you don't miss out on these features.",
		login: "Log in",
		skip: "Skip",
		features: {
			customReports: {
				title: "Send custom reports",
				description:
					"Send custom reports from within the application, making support faster in case of errors.",
			},
			createProfile: {
				title: "Create a profile",
				description:
					"Create a profile for the Dione community to get to know you.",
			},
			syncData: {
				title: "Sync your data",
				description: "Sync your data across all your devices.",
			},
			earlyBirds: {
				title: "Get early birds updates",
				description:
					"Get early birds updates and new features before anyone else.",
			},
			giveOutLikes: {
				title: "Give out likes",
				description:
					"Leave likes to the apps you like the most, so more people will use them!",
			},
			publishScripts: {
				title: "Publish scripts",
				description: "Publish your scripts and share them with the world.",
			},
			achieveGoals: {
				title: "Achieve goals",
				description:
					"Achieve goals like using Dione for 7 days to get free gifts",
			},
			getNewswire: {
				title: "Get newswire",
				description:
					"Receive updates via email so you don't miss out on new features.",
			},
		},
	},

	// editor component
	editor: {
		selectFile: "Select a file to start editing",
		previewNotAvailable: "Preview not available for this file.",
		mediaNotSupported: "Preview for this media type is not supported yet.",
		previewOnly: "Preview only",
		unsaved: "Unsaved",
		retry: "Retry",
		editorLabel: "Editor",
	},

	// sidebar links
	links: {
		discord: "Discord",
		github: "GitHub",
		dione: "Dione",
		builtWith: "built with",
	},

	// update notifications
	updates: {
		later: "Later",
		install: "Install",
	},

	// iframe actions
	iframeActions: {
		shareOnNetwork: "Share on network",
	},

	// version info
	versions: {
		node: "Node",
		electron: "Electron",
		chromium: "Chromium",
	},

	// connection messages
	connection: {
		retryLater: "We are having connection problems, please try again later.",
	},

	// variables modal
	variables: {
		title: "Environment Variables",
		addKey: "Add key",
		searchPlaceholder: "Search variables...",
		keyPlaceholder: "Key (e.g. MY_VAR)",
		valuePlaceholder: "Value",
		copyAll: "Copy all to clipboard",
		confirm: "Confirm",
		copyPath: "Copy path",
		copyFullValue: "Copy full value",
		deleteKey: "Delete key",
	},

	// custom commands modal
	customCommands: {
		title: "Launch with custom parameters",
		launch: "Launch",
	},

	// context menu
	contextMenu: {
		copyPath: "Copy path",
		open: "Open",
		reload: "Reload",
		rename: "Rename",
		delete: "Delete",
	},

	// file tree
	fileTree: {
		noFiles: "No files found in this workspace.",
		media: "Media",
		binary: "Binary",
	},

	// entry name dialog
	entryDialog: {
		name: "Name",
		createFile: "Create file",
		createFolder: "Create folder",
		renameFile: "Rename file",
		renameFolder: "Rename folder",
		createInRoot: "This will be created in the workspace root.",
		createInside: "This will be created inside {path}.",
		currentLocation: "Current location: {path}.",
		currentLocationRoot: "Current location: workspace root.",
		rename: "Rename",
		placeholderFile: "example.ts",
		placeholderFolder: "New Folder",
	},

	// workspace editor
	workspaceEditor: {
		newFile: "New file",
		newFolder: "New folder",
		retry: "Retry",
		back: "Back",
		save: "Save",
		openInExplorer: "Open in explorer",
		resolvingPath: "Resolving path...",
		workspace: "Workspace",
	},

	// header bar
	headerBar: {
		back: "Back",
		openInExplorer: "Open in explorer",
		save: "Save",
	},

	// settings page footer
	settingsFooter: {
		builtWithLove: "built with ♥",
		getDioneWebsite: "getdione.app",
		port: "Port",
		node: "Node:",
		electron: "Electron:",
		chromium: "Chrome:",
	},

	// notifications
	notifications: {
		enabled: {
			title: "Notifications enabled",
			description: "You will receive notifications for important events.",
		},
		learnMore: "Learn more",
	},

	// language selector
	languageSelector: {
		next: "Next",
	},

	// onboarding - select path
	selectPath: {
		chooseLocation: "Choose Installation Location",
		changePath: "Change Path",
	},

	// browser compatibility
	browserCompatibility: {
		audioNotSupported: "Your browser does not support the audio element.",
		videoNotSupported: "Your browser does not support the video element.",
	},

	// library card
	library: {
		official: "Official",
	},

	// sidebar updates
	sidebarUpdate: {
		newUpdateAvailable: "New update available",
		whatsNew: "Here's what's new",
	},

	// iframe component labels
	iframeLabels: {
		back: "Back",
		logs: "Logs",
		disk: "Disk",
		editor: "Editor",
	},

	// progress component
	progress: {
		running: "Running...",
	},

	// toast messages
	toastMessages: {
		copiedToClipboard: "Copied to clipboard!",
		keyAndValueRequired: "Key and value are required",
		variableAdded: "Variable added",
		failedToAddVariable: "Failed to add variable",
		variableRemoved: "Variable removed",
		failedToRemoveVariable: "Failed to remove variable",
		valueRemoved: "Value removed",
		failedToRemoveValue: "Failed to remove value",
		pathCopiedToClipboard: "Path copied to clipboard",
		failedToCopyPath: "Failed to copy path",
		unableToOpenLocation: "Unable to open location",
		cannotDeleteWorkspaceRoot: "Cannot delete workspace root",
		deleted: "Deleted",
		failedToDeleteEntry: "Failed to delete entry",
		workspaceNotAvailable: "Workspace is not available",
		selectFileOrFolderToRename: "Select a file or folder to rename",
		cannotRenameWorkspaceRoot: "Cannot rename the workspace root",
		entryRenamed: "Entry renamed",
		fileSavedSuccessfully: "File saved successfully",
		failedToSaveFile: "Failed to save file",
		mediaFilesCannotBeOpened: "Media files cannot be opened in the editor.",
		binaryFilesCannotBeOpened:
			"Binary and executable files cannot be opened in the editor.",
		thisFileTypeCannotBeEdited: "This file type cannot be edited yet.",
	},

	// error messages
	errorMessages: {
		workspaceNotFound: "Workspace not found",
		failedToLoadWorkspace: "Failed to load workspace",
		failedToLoadDirectory: "Failed to load directory",
		unableToOpenWorkspace: "Unable to open workspace",
		failedToLoadFile: "Failed to load file",
		nameCannotBeEmpty: "Name cannot be empty",
		nameContainsInvalidCharacters: "Name contains invalid characters",
		failedToCreateEntry: "Failed to create entry",
		failedToRenameEntry: "Failed to rename entry",
	},

	// file operations
	fileOperations: {
		fileCreated: "File created",
		folderCreated: "Folder created",
		untitledFile: "untitled.txt",
		newFolder: "New Folder",
	},

	// confirmation dialogs
	confirmDialogs: {
		removeValue: "Are you sure you want to remove",
		thisValue: "this value",
		keyAndAllValues: "the key and all its values",
		from: "from",
	},

	// network share modal
	networkShareErrors: {
		failedToLoadNetworkInfo: "Failed to load network information.",
		failedToStartTunnel: "Failed to start tunnel",
		failedToCopyToClipboard: "Failed to copy to clipboard.",
	},

	// feed component
	feedErrors: {
		invalidDataFormat: "Invalid data format from API",
		failedToFetchScripts: "Failed to fetch scripts",
	},

	// upload script modal
	uploadScript: {
		fileLoadedLocally: "File loaded locally",
	},

	// running apps
	runningApps: {
		running: "Running",
		thereIsAnAppRunningInBackground:
			"There is an application running in the background.",
		failedToReloadQuickLaunch: "Failed to reload quick launch apps",
		failedToFetchInstalledApps: "Failed to fetch installed apps",
	},
} as const;
