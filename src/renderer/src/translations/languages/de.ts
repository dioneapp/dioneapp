export const de = {
	// common actions and states
	common: {
		cancel: "Abbrechen",
		loading: "Laden...",
		error: "Fehler",
		success: "Erfolg",
		pending: "Ausstehend",
		back: "Zurück",
		unselectAll: "Alle abwählen",
		selectAll: "Alle auswählen",
	},

	// authentication and access related
	noAccess: {
		title: "Dione Whitelist beitreten",
		description:
			"Dione befindet sich im Aufbau und nur eine begrenzte Anzahl von Benutzern hat Zugriff. Trete jetzt unserer Whitelist bei, um Zugang zu zukünftigen Versionen unserer App zu erhalten.",
		join: "Beitreten",
		logout: "Abmelden",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Willkommen bei",
			subtitle:
				"Vielen Dank, dass Sie uns früh auf dieser Reise begleiten. Melden Sie sich bei Ihrem Konto an, um loszulegen.",
			login: "Anmelden",
			copyLink: "Link kopieren",
			skipLogin: "Ohne Anmeldung fortfahren",
		},
		loggingIn: {
			title: "Anmeldung läuft...",
			authError: "Konnte nicht authentifiziert werden?",
			goBack: "Zurückgehen",
		},
		languageSelector: {
			title: "Wählen Sie Ihre Sprache",
		},
		ready: {
			title: "Sie sind bereit!",
			subtitle: "Wir freuen uns, Sie hier zu haben",
			finish: "Fertigstellen",
		},
		clipboard: {
			success:
				"Erfolgreich in die Zwischenablage kopiert, fügen Sie es jetzt in Ihren Browser ein!",
		},
		selectPath: {
			title: "Installationspfad auswählen",
			description:
				"Dieser Ordner enthält alle Ihre installierten Skripte, Abhängigkeiten und Projektdateien. Wählen Sie einen Ort, der leicht zugänglich ist und über genügend Speicherplatz verfügt.",
			button: "Pfad auswählen",
			success: "Weiter",
			warning:
				"Wählen Sie nicht denselben Ordner aus, in dem Dione installiert ist. Dies kann bei Updates zu Konflikten und Fehlern führen.",
		},
	},

	// error handling
	error: {
		title: "Unerwarteter Fehler aufgetreten",
		description:
			"Wir haben einen unerwarteten Fehler in der Anwendung festgestellt. Wir entschuldigen uns für die Unannehmlichkeiten.",
		return: "Zurück",
		report: {
			toTeam: "An das Team melden",
			report: "Melden",
			submit: "Meldung absenden",
			sending: "Bericht wird gesendet...",
			success: "Bericht gesendet!",
			failed: "Bericht konnte nicht gesendet werden",
			badContent: "Unangemessenen Inhalt melden",
			badContentDescription:
				"Fügen Sie als Nächstes Informationen zu Ihrer Meldung hinzu",
		},
	},

	// account related
	account: {
		title: "Konto",
		logout: "Abmelden",
		stats: {
			timeSpent: {
				title: "Verbrachte Zeit",
				subtitle: "in den letzten 7 Tagen",
			},
			sessions: {
				title: "Sitzungen",
				subtitle: "in den letzten 7 Tagen",
			},
			shared: {
				title: "Geteilt",
				subtitle: "in den letzten 7 Tagen",
			},
			streak: {
				title: "Serie",
				subtitle: "aufeinanderfolgende Tage",
				days: "Tage",
			},
		},
	},

	// toast notifications
	toast: {
		close: "Schließen",
		install: {
			downloading: "%s wird heruntergeladen...",
			starting: "%s wird gestartet...",
			uninstalling: "%s wird deinstalliert...",
			reconnecting: "%s wird wieder verbunden...",
			retrying: "%s wird erneut versucht zu installieren...",
			success: {
				stopped: "%s erfolgreich gestoppt.",
				uninstalled: "%s erfolgreich deinstalliert.",
				logsCopied: "Protokolle erfolgreich in die Zwischenablage kopiert.",
				depsInstalled: "Abhängigkeiten erfolgreich installiert.",
				shared: "Download-Link in die Zwischenablage kopiert!",
			},
			error: {
				download: "Fehler beim Initiieren des Downloads: %s",
				start: "Fehler beim Starten von %s: %s",
				stop: "Fehler beim Stoppen von %s: %s",
				uninstall: "Fehler bei der Deinstallation von %s: %s",
				serverRunning: "Server läuft bereits.",
				tooManyApps: "Langsam! Sie haben bereits 6 Apps gleichzeitig laufen.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Anwendungen werden gestoppt...",
			description:
				"Dione wird automatisch geschlossen, nachdem alle offenen Anwendungen beendet wurden.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Entdecken, Installieren, Innovieren – mit 1 Klick.",
		activeApps: "Aktive Apps",
		update: {
			title: "Update verfügbar",
			description:
				"Eine neue Version von Dione ist verfügbar. Bitte starten Sie die App neu, um das Update zu installieren.",
			tooltip:
				"Neues Update verfügbar, bitte starten Sie Dione neu, um das Update zu installieren.",
		},
		tooltips: {
			library: "Bibliothek",
			settings: "Einstellungen",
			account: "Konto",
			logout: "Abmelden",
			login: "Anmelden",
			capture: "Aufnehmen",
		},
	},

	// home page
	home: {
		featured: "Vorgestellt",
		explore: "Entdecken",
	},

	// settings page
	settings: {
		applications: {
			title: "Anwendungen",
			installationDirectory: {
				label: "Installationsverzeichnis",
				description:
					"Wählen Sie aus, wo neue Anwendungen standardmäßig installiert werden sollen.",
			},
			binDirectory: {
				label: "Binärverzeichnis",
				description:
					"Wählen Sie, wo die Anwendung-Binärdateien für einfachen Zugriff gespeichert werden sollen.",
			},
			cleanUninstall: {
				label: "Saubere Deinstallation",
				description:
					"Entfernen Sie alle zugehörigen Abhängigkeiten bei der Deinstallation von Anwendungen.",
			},
			autoOpenAfterInstall: {
				label: "Automatisch nach Installation öffnen",
				description:
					"Öffnen Sie Anwendungen nach der Installation automatisch zum ersten Mal.",
			},
			deleteCache: {
				label: "Cache löschen",
				description: "Entfernen Sie alle Caches von Anwendungen.",
				button: "Cache löschen",
				deleting: "Löschen...",
				deleted: "Gelöscht",
				error: "Fehler",
			},
		},
		interface: {
			title: "Oberfläche",
			displayLanguage: {
				label: "Anzeigesprache",
				description: "Wählen Sie Ihre bevorzugte Anzeigesprache.",
			},
			helpTranslate:
				"🤔 Ihre Sprache nicht dabei? Helfen Sie uns, weitere hinzuzufügen!",
			theme: {
				label: "Design",
				description: "Wählen Sie ein Farbschema für die Anwendung.",
				themes: {
					default: "Lila Traum",
					midnight: "Mitternachtsblau",
					ocean: "Ozeantiefen",
					forest: "Waldnacht",
					sunset: "Sonnenuntergangsglühen",
					royal: "Königsflieder",
				},
			},
			intenseBackgrounds: {
				label: "Intensive Hintergrundfarben",
				description:
					"Verwenden Sie lebendigere Hintergrundfarben anstelle von subtilen Tönen.",
			},
			compactView: {
				label: "Kompakte Ansicht",
				description:
					"Verwenden Sie ein komprimierteres Layout, um mehr Inhalt auf dem Bildschirm unterzubringen.",
			},
		},
		notifications: {
			title: "Benachrichtigungen",
			systemNotifications: {
				label: "Systembenachrichtigungen",
				description:
					"Zeigen Sie Desktop-Benachrichtigungen für wichtige Ereignisse an.",
			},
			installationAlerts: {
				label: "Installationswarnungen",
				description:
					"Erhalten Sie Benachrichtigungen, wenn Anwendungsinstallationen abgeschlossen sind.",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "Zeigen Sie Ihre aktuelle Aktivität im Discord-Status an.",
			},
			successSound: {
				label: "Erfolgsonne aktivieren",
				description:
					"Aktiviert den Ton, der abgespielt wird, wenn Anwendungen die Installation abgeschlossen haben.",
			},
		},
		privacy: {
			title: "Datenschutz",
			errorReporting: {
				label: "Fehlerberichterstattung",
				description:
					"Helfen Sie, Dione zu verbessern, indem Sie anonyme Fehlerberichte senden.",
			},
		},
		other: {
			title: "Sonstiges",
			disableAutoUpdate: {
				label: "Auto-Updates deaktivieren",
				description:
					"Deaktiviert automatische Updates. Achtung: Ihre Anwendung verpasst möglicherweise wichtige Fehlerbehebungen oder Sicherheitspatches. Diese Option wird für die meisten Benutzer nicht empfohlen.",
			},
			logsDirectory: {
				label: "Protokollverzeichnis",
				description: "Speicherort der Anwendungsprotokolle.",
			},
			exportLogs: {
				label: "Debug-Protokolle exportieren",
				description:
					"Exportiert alle Protokolle und Systeminformationen in einer Zip-Datei zur Fehlerbehebung.",
				button: "Protokolle exportieren",
			},
			submitFeedback: {
				label: "Feedback einreichen",
				description:
					"Melden Sie Probleme oder Schwierigkeiten, auf die Sie stoßen.",
				button: "Bericht senden",
			},
			showOnboarding: {
				label: "Onboarding anzeigen",
				description:
					"Setzt Dione auf den ursprünglichen Zustand zurück und zeigt das Onboarding zur NeuKonfiguration erneut an.",
				button: "Zurücksetzen",
			},
			variables: {
				label: "Variablen",
				description: "Verwalten Sie Anwendungsvariablen und ihre Werte.",
				button: "Variablen öffnen",
			},
			checkUpdates: {
				label: "Nach Updates suchen",
				description:
					"Prüft auf Updates und benachrichtigt Sie, wenn eine neue Version verfügbar ist.",
				button: "Nach Updates suchen",
			},
		},
	},

	// report form
	report: {
		title: "Problem beschreiben",
		description:
			"Bitte geben Sie Details dazu an, was passiert ist und was Sie versucht haben zu tun.",
		placeholder:
			"Beispiel: Ich habe versucht, eine Anwendung zu installieren, als dieser Fehler auftrat...",
		systemInformationTitle: "Systeminformationen",
		disclaimer:
			"Die folgenden Systeminformationen und eine anonyme ID werden Ihrem Bericht beigefügt.",
		success: "Bericht erfolgreich gesendet!",
		error:
			"Bericht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
		send: "Bericht senden",
		sending: "Wird gesendet...",
		contribute:
			"Helfen Sie uns, dieses Skript mit allen Geräten kompatibel zu machen",
	},

	// quick launch component
	quickLaunch: {
		title: "Schnellstart",
		addApp: "App hinzufügen",
		tooltips: {
			noMoreApps: "Keine verfügbaren Apps zum Hinzufügen",
		},
		selectApp: {
			title: "Eine App auswählen",
			description:
				"{count} Apps sind verfügbar. Sie können bis zu {max} auswählen.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "Einige Abhängigkeiten fehlen!",
		installing: "Abhängigkeiten werden installiert...",
		install: "Installieren",
		logs: {
			initializing: "Initialisiere Download von Abhängigkeiten...",
			loading: "Laden...",
			connected: "Mit Server verbunden",
			disconnected: "Vom Server getrennt",
			error: {
				socket: "Fehler beim Einrichten des Sockets",
				install: "❌ Fehler bei der Installation von Abhängigkeiten: {error}",
			},
			allInstalled: "Alle Abhängigkeiten sind bereits installiert.",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstall: {
			title: "Deinstallieren",
			deps: "Abhängigkeiten deinstallieren",
			wait: "bitte warten...",
		},
		uninstalling: {
			title: "Deinstallieren",
			deps: "Abhängigkeiten deinstallieren",
			wait: "bitte warten...",
		},
		success: {
			title: "Deinstalliert",
			subtitle: "erfolgreich",
			closing: "Dieses Modal wird in geschlossen",
			seconds: "Sekunden...",
		},
		error: {
			title: "Ein unerwarteter",
			subtitle: "Fehler",
			hasOccurred: "ist aufgetreten",
			deps: "Dione konnte keine Abhängigkeit entfernen, bitte tun Sie dies manuell.",
			general:
				"Bitte versuchen Sie es später erneut oder überprüfen Sie die Protokolle für weitere Informationen.",
		},
		loading: {
			title: "Laden...",
			wait: "Bitte warten...",
		},
	},

	// logs component
	logs: {
		loading: "Laden...",
		openPreview: "Vorschau öffnen",
		copyLogs: "Protokolle kopieren",
		stop: "Stoppen",
		disclaimer:
			"Angezeigte Protokolle stammen von der App selbst. Wenn Sie einen Fehler sehen, melden Sie ihn bitte zuerst den Entwicklern der Original-App.",
		status: {
			success: "Erfolg",
			error: "Fehler",
			pending: "Ausstehend",
		},
	},

	// loading states
	loading: {
		text: "Laden...",
	},

	// iframe component
	iframe: {
		back: "Zurück",
		openFolder: "Ordner öffnen",
		openInBrowser: "Im Browser öffnen",
		openNewWindow: "Neues Fenster öffnen",
		fullscreen: "Vollbild",
		stop: "Stoppen",
		reload: "Neu laden",
		logs: "Protokolle",
	},

	// actions component
	actions: {
		reconnect: "Wieder verbinden",
		start: "Starten",
		uninstall: "Deinstallieren",
		install: "Installieren",
		publishedBy: "Veröffentlicht von",
		installed: "Installiert",
		notInstalled: "Nicht installiert",
	},

	// promo component
	promo: {
		title: "Möchten Sie hier vorgestellt werden?",
		description: "Präsentieren Sie Ihr Tool unserer Community",
		button: "Vorgestellt werden",
	},

	// installed component
	installed: {
		title: "Ihre Bibliothek",
		empty: {
			title: "Sie haben keine Anwendungen installiert",
			action: "Jetzt eine installieren",
		},
	},

	// local component
	local: {
		title: "Lokale Skripte",
		upload: "Skript hochladen",
		noScripts: "Keine Skripte gefunden",
		deleting: "Skript wird gelöscht, bitte warten Sie...",
		uploadModal: {
			title: "Skript hochladen",
			selectFile: "Klicken Sie, um eine Datei auszuwählen",
			selectedFile: "Ausgewählte Datei",
			scriptName: "Skriptname",
			scriptDescription: "Skriptbeschreibung (optional)",
			uploadFile: "Datei hochladen",
			uploading: "Wird hochgeladen...",
			errors: {
				uploadFailed:
					"Skript-Upload fehlgeschlagen. Bitte versuchen Sie es erneut.",
				uploadError: "Ein Fehler ist beim Hochladen des Skripts aufgetreten.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "Keine Skripte gefunden",
		loadingMore: "Mehr laden...",
		reachedEnd: "Sie haben das Ende erreicht.",
		notEnoughApps: "Wenn Sie denken, dass es nicht genug Apps gibt,",
		helpAddMore: "helfen Sie uns bitte, mehr hinzuzufügen",
		errors: {
			notArray: "Abgerufene Daten sind kein Array",
			fetchFailed: "Skripte konnten nicht abgerufen werden",
			notSupported: "Leider wird %s auf Ihrem %s nicht unterstützt.",
			notSupportedTitle: "Ihr Gerät ist möglicherweise inkompatibel.",
		},
	},

	// search component
	search: {
		placeholder: "Skripte suchen...",
		filters: {
			audio: "Audio",
			image: "Bild",
			video: "Video",
			chat: "Chat",
		},
	},

	// network share modal
	networkShare: {
		title: "Teilen",
		modes: {
			local: "Lokal",
			public: "Öffentlich",
			connecting: "Verbinden...",
		},
		warning: {
			title: "Öffentlicher Zugriff",
			description:
				"Erstellt eine öffentliche URL, die von überall zugänglich ist. Nur mit vertrauenswürdigen Personen teilen.",
		},
		local: {
			shareUrl: "URL teilen",
			urlDescription:
				"Teilen Sie diese URL mit Geräten in Ihrem lokalen Netzwerk",
			localNetwork: "Lokales Netzwerk:",
			description:
				"Diese URL funktioniert auf Geräten, die mit demselben Netzwerk verbunden sind.",
		},
		public: {
			shareUrl: "Öffentliche URL",
			urlDescription: "Teilen Sie diese URL mit jedem, überall auf der Welt",
			passwordTitle: "Erstmaliges Passwort",
			visitorMessage:
				"Besucher müssen dies möglicherweise einmal pro Gerät eingeben, um auf den Tunnel zuzugreifen.",
			stopSharing: "Teilen stoppen",
		},
		errors: {
			noAddress:
				"Netzwerkadresse konnte nicht abgerufen werden. Bitte überprüfen Sie Ihre Verbindung.",
			loadFailed: "Netzwerkinformationen konnten nicht geladen werden.",
			noUrl: "Keine URL zum Kopieren verfügbar.",
			copyFailed: "Kopieren in die Zwischenablage fehlgeschlagen.",
			tunnelFailed: "Tunnel konnte nicht gestartet werden",
		},
	},

	// login features modal
	loginFeatures: {
		title: "Sie verpassen Funktionen",
		description:
			"Melden Sie sich bei Dione an, damit Sie diese Funktionen nicht verpassen.",
		login: "Anmelden",
		skip: "Überspringen",
		features: {
			customReports: {
				title: "Benutzerdefinierte Berichte senden",
				description:
					"Senden Sie benutzerdefinierte Berichte direkt aus der Anwendung, um die Unterstützung im Fehlerfall zu beschleunigen.",
			},
			createProfile: {
				title: "Profil erstellen",
				description:
					"Erstellen Sie ein Profil für die Dione-Community, damit wir Sie kennenlernen können.",
			},
			syncData: {
				title: "Ihre Daten synchronisieren",
				description: "Synchronisieren Sie Ihre Daten geräteübergreifend.",
			},
			earlyBirds: {
				title: "Early Bird-Updates erhalten",
				description:
					"Erhalten Sie Early Bird-Updates und neue Funktionen vor allen anderen.",
			},
			giveOutLikes: {
				title: "Likes verteilen",
				description:
					"Geben Sie den Apps, die Ihnen am besten gefallen, Likes, damit mehr Leute sie nutzen!",
			},
			publishScripts: {
				title: "Skripte veröffentlichen",
				description:
					"Veröffentlichen Sie Ihre Skripte und teilen Sie sie mit der Welt.",
			},
			achieveGoals: {
				title: "Ziele erreichen",
				description:
					"Erreichen Sie Ziele wie die Nutzung von Dione für 7 Tage, um kostenlose Geschenke zu erhalten",
			},
			getNewswire: {
				title: "Newsletter erhalten",
				description:
					"Erhalten Sie Updates per E-Mail, damit Sie keine neuen Funktionen verpassen.",
			},
		},
	},

	// editor component
	editor: {
		selectFile: "Wählen Sie eine Datei zum Bearbeiten aus",
		previewNotAvailable: "Vorschau für diese Datei nicht verfügbar.",
		mediaNotSupported:
			"Vorschau für diesen Medientyp wird noch nicht unterstützt.",
		previewOnly: "Nur Vorschau",
		unsaved: "Ungespeichert",
		retry: "Erneut versuchen",
		editorLabel: "Editor",
	},

	// sidebar links
	links: {
		discord: "Discord",
		github: "GitHub",
		dione: "Dione",
		builtWith: "erstellt mit",
	},

	// update notifications
	updates: {
		later: "Später",
		install: "Installieren",
	},

	// iframe actions
	iframeActions: {
		shareOnNetwork: "Im Netzwerk teilen",
	},

	// version info
	versions: {
		node: "Node",
		electron: "Electron",
		chromium: "Chromium",
	},

	// connection messages
	connection: {
		retryLater:
			"Wir haben Verbindungsprobleme, versuchen Sie es später erneut.",
	},

	// variables modal
	variables: {
		title: "Umgebungsvariablen",
		addKey: "Schlüssel hinzufügen",
		searchPlaceholder: "Variablen suchen...",
		keyPlaceholder: "Schlüssel (z. B. MEINE_VAR)",
		valuePlaceholder: "Wert",
		copyAll: "Alle in Zwischenablage kopieren",
		confirm: "Bestätigen",
		copyPath: "Pfad kopieren",
		copyFullValue: "Vollständigen Wert kopieren",
		deleteKey: "Schlüssel löschen",
	},

	// custom commands modal
	customCommands: {
		title: "Mit benutzerdefinierten Parametern starten",
		launch: "Starten",
	},

	// context menu
	contextMenu: {
		copyPath: "Pfad kopieren",
		open: "Öffnen",
		reload: "Neu laden",
		rename: "Umbenennen",
		delete: "Löschen",
	},

	// file tree
	fileTree: {
		noFiles: "Keine Dateien in diesem Workspace gefunden.",
		media: "Medien",
		binary: "Binärdatei",
	},

	// entry name dialog
	entryDialog: {
		name: "Name",
		createFile: "Datei erstellen",
		createFolder: "Ordner erstellen",
		renameFile: "Datei umbenennen",
		renameFolder: "Ordner umbenennen",
		createInRoot: "Dies wird im Workspace-Stammverzeichnis erstellt.",
		createInside: "Dies wird innerhalb von {path} erstellt.",
		currentLocation: "Aktueller Speicherort: {path}.",
		currentLocationRoot: "Aktueller Speicherort: Workspace-Stammverzeichnis.",
		rename: "Umbenennen",
		placeholderFile: "beispiel.ts",
		placeholderFolder: "Neuer Ordner",
	},

	// workspace editor
	workspaceEditor: {
		newFile: "Neue Datei",
		newFolder: "Neuer Ordner",
		retry: "Erneut versuchen",
		back: "Zurück",
		save: "Speichern",
		openInExplorer: "Im Explorer öffnen",
		resolvingPath: "Pfad wird aufgelöst...",
		workspace: "Workspace",
	},

	// header bar
	headerBar: {
		back: "Zurück",
		openInExplorer: "Im Explorer öffnen",
		save: "Speichern",
	},

	// settings page footer
	settingsFooter: {
		builtWithLove: "mit ♥ erstellt",
		getDioneWebsite: "getdione.app",
		port: "Port",
		node: "Node:",
		electron: "Electron:",
		chromium: "Chrome:",
	},

	// notifications
	notifications: {
		enabled: {
			title: "Benachrichtigungen aktiviert",
			description: "Sie erhalten Benachrichtigungen für wichtige Ereignisse.",
		},
		learnMore: "Mehr erfahren",
	},

	// language selector
	languageSelector: {
		next: "Weiter",
	},

	// onboarding - select path
	selectPath: {
		chooseLocation: "Installationsort wählen",
		changePath: "Pfad ändern",
	},

	// browser compatibility
	browserCompatibility: {
		audioNotSupported: "Ihr Browser unterstützt das Audio-Element nicht.",
		videoNotSupported: "Ihr Browser unterstützt das Video-Element nicht.",
	},

	// library card
	library: {
		official: "Offiziell",
	},

	// sidebar updates
	sidebarUpdate: {
		newUpdateAvailable: "Neues Update verfügbar",
		whatsNew: "Hier erfahren Sie, was es Neues gibt",
	},

	// iframe component labels
	iframeLabels: {
		back: "Zurück",
		logs: "Protokolle",
		disk: "Festplatte",
		editor: "Editor",
	},

	// progress component
	progress: {
		running: "Läuft...",
	},

	// toast messages
	toastMessages: {
		copiedToClipboard: "In die Zwischenablage kopiert!",
		keyAndValueRequired: "Schlüssel und Wert sind erforderlich",
		variableAdded: "Variable hinzugefügt",
		failedToAddVariable: "Variable konnte nicht hinzugefügt werden",
		variableRemoved: "Variable entfernt",
		failedToRemoveVariable: "Variable konnte nicht entfernt werden",
		valueRemoved: "Wert entfernt",
		failedToRemoveValue: "Wert konnte nicht entfernt werden",
		pathCopiedToClipboard: "Pfad in die Zwischenablage kopiert",
		failedToCopyPath: "Pfad konnte nicht kopiert werden",
		unableToOpenLocation: "Ort konnte nicht geöffnet werden",
		cannotDeleteWorkspaceRoot:
			"Workspace-Stammverzeichnis kann nicht gelöscht werden",
		deleted: "Gelöscht",
		failedToDeleteEntry: "Eintrag konnte nicht gelöscht werden",
		workspaceNotAvailable: "Workspace nicht verfügbar",
		selectFileOrFolderToRename:
			"Wählen Sie eine Datei oder einen Ordner zum Umbenennen aus",
		cannotRenameWorkspaceRoot:
			"Workspace-Stammverzeichnis kann nicht umbenannt werden",
		entryRenamed: "Eintrag umbenannt",
		fileSavedSuccessfully: "Datei erfolgreich gespeichert",
		failedToSaveFile: "Datei konnte nicht gespeichert werden",
		mediaFilesCannotBeOpened:
			"Mediendateien können nicht im Editor geöffnet werden.",
		binaryFilesCannotBeOpened:
			"Binär- und ausführbare Dateien können nicht im Editor geöffnet werden.",
		thisFileTypeCannotBeEdited:
			"Dieser Dateityp kann noch nicht bearbeitet werden.",
	},

	// error messages
	errorMessages: {
		workspaceNotFound: "Workspace nicht gefunden",
		failedToLoadWorkspace: "Workspace konnte nicht geladen werden",
		failedToLoadDirectory: "Verzeichnis konnte nicht geladen werden",
		unableToOpenWorkspace: "Workspace konnte nicht geöffnet werden",
		failedToLoadFile: "Datei konnte nicht geladen werden",
		nameCannotBeEmpty: "Name darf nicht leer sein",
		nameContainsInvalidCharacters: "Name enthält ungültige Zeichen",
		failedToCreateEntry: "Eintrag konnte nicht erstellt werden",
		failedToRenameEntry: "Eintrag konnte nicht umbenannt werden",
	},

	// file operations
	fileOperations: {
		fileCreated: "Datei erstellt",
		folderCreated: "Ordner erstellt",
		untitledFile: "unbenannt.txt",
		newFolder: "Neuer Ordner",
	},

	// confirmation dialogs
	confirmDialogs: {
		removeValue: "Sind Sie sicher, dass Sie entfernen möchten",
		thisValue: "diesen Wert",
		keyAndAllValues: "den Schlüssel und alle seine Werte",
		from: "von",
	},

	// network share modal
	networkShareErrors: {
		failedToLoadNetworkInfo:
			"Netzwerkinformationen konnten nicht geladen werden.",
		failedToStartTunnel: "Tunnel konnte nicht gestartet werden",
		failedToCopyToClipboard: "Kopieren in die Zwischenablage fehlgeschlagen.",
	},

	// feed component
	feedErrors: {
		invalidDataFormat: "Ungültiges Datenformat von der API",
		failedToFetchScripts: "Skripte konnten nicht abgerufen werden",
	},

	// upload script modal
	uploadScript: {
		fileLoadedLocally: "Datei lokal geladen",
	},

	// running apps
	runningApps: {
		running: "Läuft",
		thereIsAnAppRunningInBackground: "Eine Anwendung läuft im Hintergrund.",
		failedToReloadQuickLaunch:
			"Schnellstart-Apps konnten nicht neu geladen werden",
		failedToFetchInstalledApps:
			"Installierte Apps konnten nicht abgerufen werden",
	},
} as const;
