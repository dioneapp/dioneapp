export const de = {
	// common actions and states
	common: {
		cancel: "Abbrechen",
		loading: "Lade...",
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
			"Dione befindet sich im Aufbau und nur eine begrenzte Anzahl von Benutzern kann darauf zugreifen. Treten Sie jetzt unserer Whitelist bei, um Zugang zu zukünftigen Versionen unserer App zu erhalten.",
		join: "Beitreten",
		logout: "Abmelden",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Willkommen bei",
			subtitle:
				"Vielen Dank, dass Sie uns zu Beginn dieser Reise begleiten. Melden Sie sich bei Ihrem Konto an, um loszulegen.",
			login: "Anmelden",
			copyLink: "Link kopieren",
			skipLogin: "Ohne Anmeldung fortfahren",
		},
		loggingIn: {
			title: "Melde mich an...",
			authError: "Konnte nicht authentifizieren?",
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
			button: "Pfad auswählen",
			success: "Weiter",
		},
	},

	// error handling
	error: {
		title: "Unerwarteter Fehler aufgetreten",
		description:
			"Wir haben einen unerwarteten Fehler in der Anwendung festgestellt, wir entschuldigen uns für die Unannehmlichkeiten.",
		return: "Zurückkehren",
		report: {
			toTeam: "An das Team melden",
			sending: "Bericht wird gesendet...",
			success: "Bericht gesendet!",
			failed: "Fehler beim Senden des Berichts",
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
			downloading: "Lade %s herunter...",
			starting: "Starte %s...",
			uninstalling: "Deinstalliere %s...",
			reconnecting: "Verbinde %s erneut...",
			retrying: "Versuche %s erneut zu installieren...",
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
				uninstall: "Fehler beim Deinstallieren von %s: %s",
				serverRunning: "Server läuft bereits.",
				tooManyApps:
					"Langsam! Sie haben bereits 6 Apps gleichzeitig laufen.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Anwendungen werden gestoppt...",
			description:
				"Dione wird nach dem Schließen aller offenen Anwendungen automatisch beendet.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Entdecken, Installieren, Innovieren — mit 1 Klick.",
		activeApps: "Aktive Apps",
		update: {
			title: "Update verfügbar",
			description:
				"Eine neue Version von Dione ist verfügbar, starten Sie die App neu, um das Update zu installieren.",
			tooltip: "Neues Update verfügbar, starten Sie Dione neu, um zu aktualisieren.",
		},
		tooltips: {
			library: "Bibliothek",
			settings: "Einstellungen",
			account: "Konto",
			logout: "Abmelden",
			login: "Anmelden",
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
					"Wählen Sie, wo neue Anwendungen standardmäßig installiert werden sollen",
			},
			binDirectory: {
				label: "Bin-Verzeichnis",
				description:
					"Wählen Sie, wo die Anwendungsbinaries für einfachen Zugriff gespeichert werden sollen",
			},
			cleanUninstall: {
				label: "Saubere Deinstallation",
				description:
					"Entfernen Sie alle zugehörigen Abhängigkeiten beim Deinstallieren von Anwendungen",
			},
			autoOpenAfterInstall: {
				label: "Automatisch nach der Installation öffnen",
				description:
					"Öffnen Sie Anwendungen nach der Installation automatisch zum ersten Mal",
			},
			deleteCache: {
				label: "Cache löschen",
				description: "Alle zwischengespeicherten Daten von Anwendungen entfernen",
				button: "Cache löschen",
				deleting: "Lösche...",
				deleted: "Gelöscht",
				error: "Fehler",
			},
		},
		interface: {
			title: "Oberfläche",
			displayLanguage: {
				label: "Anzeigesprache",
				description: "Wählen Sie Ihre bevorzugte Oberflächensprache",
			},
			helpTranslate: "🤔 Ihre Sprache nicht gefunden? Helfen Sie uns, mehr hinzuzufügen!",
			compactView: {
				label: "Kompakte Ansicht",
				description:
					"Verwenden Sie ein kompakteres Layout, um mehr Inhalte auf dem Bildschirm unterzubringen",
			},
		},
		notifications: {
			title: "Benachrichtigungen",
			systemNotifications: {
				label: "Systembenachrichtigungen",
				description: "Zeigen Sie Desktop-Benachrichtigungen für wichtige Ereignisse an",
			},
			installationAlerts: {
				label: "Installationsalarme",
				description: "Werden Sie benachrichtigt, wenn die Installation von Anwendungen abgeschlossen ist",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "Zeigen Sie Ihre aktuelle Aktivität in Ihrem Discord-Status an",
			},
		},
		privacy: {
			title: "Datenschutz",
			errorReporting: {
				label: "Fehlerberichterstattung",
				description: "Helfen Sie, Dione zu verbessern, indem Sie anonyme Fehlerberichte senden",
			},
		},
		other: {
			title: "Andere",
			logsDirectory: {
				label: "Protokollverzeichnis",
				description: "Speicherort, an dem Anwendungsprotokolle gespeichert werden",
			},
			submitFeedback: {
				label: "Feedback senden",
				description: "Melden Sie alle Probleme oder Schwierigkeiten, auf die Sie stoßen",
				button: "Bericht senden",
			},
			showOnboarding: {
				label: "Onboarding anzeigen",
				description:
					"Setzen Sie Dione auf den Anfangszustand zurück und zeigen Sie das Onboarding zur Neukonfiguration erneut an",
				button: "Zurücksetzen",
			},
			variables: {
				label: "Variablen",
				description: "Verwalten Sie Anwendungsvariablen und deren Werte",
				button: "Variablen öffnen",
			},
		},
	},

	// report form
	report: {
		title: "Beschreiben Sie das Problem",
		description:
			"Bitte geben Sie Details dazu an, was passiert ist und was Sie zu tun versucht haben.",
		placeholder:
			"Beispiel: Ich habe versucht, eine Anwendung zu installieren, als dieser Fehler auftrat...",
		systemInformationTitle: "Systeminformationen",
		disclaimer:
			"Die folgenden Systeminformationen und eine anonyme ID werden Ihrem Bericht beigefügt.",
		success: "Bericht erfolgreich gesendet!",
		error: "Fehler beim Senden des Berichts. Bitte versuchen Sie es erneut.",
		send: "Bericht senden",
		sending: "Sendet...",
		contribute: "Helfen Sie uns, dieses Skript mit allen Geräten kompatibel zu machen",
	},

	// quick launch component
	quickLaunch: {
		title: "Schnellstart",
		addApp: "App hinzufügen",
		tooltips: {
			noMoreApps: "Keine verfügbaren Apps zum Hinzufügen",
		},
		selectApp: {
			title: "App auswählen",
			description: "{count} Apps sind verfügbar. Sie können bis zu {max} auswählen.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "Einige Abhängigkeiten fehlen!",
		installing: "Installiere Abhängigkeiten...",
		install: "Installieren",
		logs: {
			initializing: "Initialisiere Download der Abhängigkeiten...",
			loading: "Lade...",
			connected: "Mit Server verbunden",
			disconnected: "Vom Server getrennt",
			error: {
				socket: "Fehler beim Einrichten des Sockets",
				install: "❌ Fehler beim Installieren von Abhängigkeiten: {error}",
			},
			allInstalled: "Alle Abhängigkeiten sind bereits installiert.",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstalling: {
			title: "Deinstalliere",
			deps: "Deinstalliere Abhängigkeiten",
			wait: "bitte warten Sie...",
		},
		success: {
			title: "Deinstalliert",
			subtitle: "erfolgreich",
			closing: "Schließe dieses Modal in",
			seconds: "Sekunden...",
		},
		error: {
			title: "Ein unerwarteter",
			subtitle: "Fehler",
			hasOccurred: "ist aufgetreten",
			deps: "Dione konnte keine Abhängigkeit entfernen, bitte tun Sie dies manuell.",
			general: "Bitte versuchen Sie es später erneut oder überprüfen Sie die Protokolle auf weitere Informationen.",
		},
		loading: {
			title: "Lade...",
			wait: "Bitte warten Sie...",
		},
	},

	// logs component
	logs: {
		loading: "Lade...",
		disclaimer:
			"Angezeigte Protokolle stammen von der App selbst. Wenn Sie einen Fehler sehen, melden Sie ihn bitte zuerst den ursprünglichen App-Entwicklern.",
		status: {
			success: "Erfolg",
			error: "Fehler",
			pending: "Ausstehend",
		},
	},

	// loading states
	loading: {
		text: "Lade...",
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
		reconnect: "Erneut verbinden",
		start: "Starten",
		uninstall: "Deinstallieren",
		install: "Installieren",
		publishedBy: "Veröffentlicht von",
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
			action: "Installieren Sie jetzt eine",
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
			uploading: "Lade hoch...",
			errors: {
				uploadFailed: "Fehler beim Hochladen des Skripts. Bitte versuchen Sie es erneut.",
				uploadError: "Beim Hochladen des Skripts ist ein Fehler aufgetreten.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "Keine Skripte gefunden",
		errors: {
			notArray: "Abgerufene Daten sind kein Array",
			fetchFailed: "Fehler beim Abrufen von Skripten",
			notSupported: "Leider wird %s auf Ihrem %s nicht unterstützt.",
			notSupportedTitle: "Ihr Gerät ist möglicherweise nicht kompatibel.",
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
} as const;