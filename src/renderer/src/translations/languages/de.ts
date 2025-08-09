export const de = {
	// common actions and states
	common: {
		cancel: "Abbrechen",
		loading: "Lädt...",
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
				"Vielen Dank, dass Sie uns früh auf dieser Reise begleiten. Melden Sie sich in Ihrem Konto an, um zu beginnen.",
			login: "Anmelden",
			copyLink: "Link kopieren",
			skipLogin: "Ohne Anmeldung fortfahren",
		},
		loggingIn: {
			title: "Anmeldung läuft...",
			authError: "Authentifizierung nicht möglich?",
			goBack: "Zurück",
		},
		languageSelector: {
			title: "Wählen Sie Ihre Sprache",
		},
		ready: {
			title: "Sie sind bereit!",
			subtitle: "Wir freuen uns, Sie hier zu haben",
			finish: "Fertig",
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
		title: "Ein unerwarteter Fehler ist aufgetreten",
		description:
			"Wir haben einen unerwarteten Fehler in der Anwendung erkannt. Wir entschuldigen uns für die Unannehmlichkeiten.",
		return: "Zurück",
		report: {
			toTeam: "An Team melden",
			sending: "Bericht wird gesendet...",
			success: "Bericht gesendet!",
			failed: "Bericht konnte nicht gesendet werden",
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
			reconnecting: "%s wird neu verbunden...",
			retrying: "Versuche %s erneut zu installieren...",
			success: {
				stopped: "%s wurde erfolgreich gestoppt.",
				uninstalled: "%s wurde erfolgreich deinstalliert.",
				logsCopied: "Protokolle erfolgreich in die Zwischenablage kopiert.",
				depsInstalled: "Abhängigkeiten erfolgreich installiert.",
				shared: "Download-Link in die Zwischenablage kopiert!",
			},
			error: {
				download: "Fehler beim Starten des Downloads: %s",
				start: "Fehler beim Starten von %s: %s",
				stop: "Fehler beim Stoppen von %s: %s",
				uninstall: "Fehler beim Deinstallieren von %s: %s",
				serverRunning: "Server läuft bereits.",
				tooManyApps: "Langsamer! Sie haben bereits 6 Apps gleichzeitig laufen.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Anwendungen werden gestoppt...",
			description:
				"Dione wird automatisch geschlossen, nachdem alle geöffneten Anwendungen geschlossen wurden.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Entdecken, Installieren, Innovieren — mit einem Klick.",
		activeApps: "Aktive Apps",
		update: {
			title: "Update verfügbar",
			description:
				"Eine neue Version von Dione ist verfügbar. Bitte starten Sie die App neu, um zu aktualisieren.",
			tooltip:
				"Neues Update verfügbar. Bitte starten Sie Dione neu, um zu aktualisieren.",
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
		featured: "Empfohlen",
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
				label: "Binärverzeichnis",
				description:
					"Wählen Sie, wo die Anwendungsbinärdateien für einfachen Zugriff gespeichert werden",
			},
			cleanUninstall: {
				label: "Saubere Deinstallation",
				description:
					"Entfernen Sie alle zugehörigen Abhängigkeiten beim Deinstallieren von Anwendungen",
			},
			autoOpenAfterInstall: {
				label: "Nach Installation automatisch öffnen",
				description:
					"Öffnen Sie Anwendungen automatisch beim ersten Mal nach der Installation",
			},
			deleteCache: {
				label: "Cache löschen",
				description:
					"Entfernen Sie alle zwischengespeicherten Daten von Anwendungen",
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
				description: "Wählen Sie Ihre bevorzugte Oberflächensprache",
			},
			helpTranslate:
				"🤔 Ihre Sprache nicht gefunden? Helfen Sie uns, mehr hinzuzufügen!",
			compactView: {
				label: "Kompakte Ansicht",
				description:
					"Verwenden Sie ein kompakteres Layout, um mehr Inhalt auf dem Bildschirm anzuzeigen",
			},
		},
		notifications: {
			title: "Benachrichtigungen",
			systemNotifications: {
				label: "Systembenachrichtigungen",
				description:
					"Desktop-Benachrichtigungen für wichtige Ereignisse anzeigen",
			},
			installationAlerts: {
				label: "Installationsbenachrichtigungen",
				description:
					"Benachrichtigung erhalten, wenn Anwendungsinstallationen abgeschlossen sind",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "Zeigen Sie Ihre aktuelle Aktivität im Discord-Status an",
			},
		},
		privacy: {
			title: "Datenschutz",
			errorReporting: {
				label: "Fehlerberichterstattung",
				description:
					"Helfen Sie dabei, Dione zu verbessern, indem Sie anonyme Fehlerberichte senden",
			},
		},
		other: {
			title: "Sonstiges",
			logsDirectory: {
				label: "Protokollverzeichnis",
				description: "Ort, an dem Anwendungsprotokolle gespeichert werden",
			},
			submitFeedback: {
				label: "Feedback senden",
				description:
					"Melden Sie alle Probleme oder Schwierigkeiten, auf die Sie stoßen",
				button: "Bericht senden",
			},
			showOnboarding: {
				label: "Onboarding anzeigen",
				description:
					"Setzen Sie Dione auf seinen ursprünglichen Zustand zurück und zeigen Sie das Onboarding zur Neukonfiguration erneut an",
				button: "Zurücksetzen",
			},
			variables: {
				label: "Variablen",
				description: "Verwalten Sie Anwendungsvariablen und ihre Werte",
				button: "Variablen öffnen",
			},
		},
	},

	// report form
	report: {
		title: "Beschreiben Sie das Problem",
		description:
			"Bitte geben Sie Details darüber an, was passiert ist und was Sie versucht haben zu tun.",
		placeholder:
			"Beispiel: Ich versuchte, eine Anwendung zu installieren, als dieser Fehler auftrat...",
		systemInformationTitle: "Systeminformationen",
		disclaimer:
			"Die folgenden Systeminformationen und eine anonyme ID werden mit Ihrem Bericht gesendet.",
		success: "Bericht erfolgreich gesendet!",
		error:
			"Bericht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
		send: "Bericht senden",
		sending: "Senden...",
		contribute:
			"Helfen Sie uns, dieses Skript mit allen Geräten kompatibel zu machen",
	},

	// quick launch component
	quickLaunch: {
		title: "Schnellstart",
		addApp: "App hinzufügen",
		tooltips: {
			noMoreApps: "Keine Apps verfügbar zum Hinzufügen",
		},
		selectApp: {
			title: "App auswählen",
			description: "{count} Apps verfügbar. Sie können bis zu {max} auswählen.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "Einige Abhängigkeiten fehlen!",
		installing: "Abhängigkeiten werden installiert...",
		install: "Installieren",
		logs: {
			initializing: "Initialisiere Abhängigkeits-Download...",
			loading: "Lädt...",
			connected: "Mit Server verbunden",
			disconnected: "Von Server getrennt",
			error: {
				socket: "Fehler beim Einrichten des Sockets",
				install: "❌ Fehler beim Installieren der Abhängigkeiten: {error}",
			},
			allInstalled: "Alle Abhängigkeiten sind bereits installiert.",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstalling: {
			title: "Deinstallieren",
			deps: "Abhängigkeiten werden deinstalliert",
			wait: "Bitte warten...",
		},
		success: {
			title: "Deinstalliert",
			subtitle: "erfolgreich",
			closing: "Dieses Modal wird in",
			seconds: "Sekunden geschlossen...",
		},
		error: {
			title: "Ein unerwarteter",
			subtitle: "Fehler",
			hasOccurred: "ist aufgetreten",
			deps: "Dione konnte keine Abhängigkeit entfernen. Bitte tun Sie es manuell.",
			general:
				"Bitte versuchen Sie es später erneut oder überprüfen Sie die Protokolle für weitere Informationen.",
		},
		loading: {
			title: "Lädt...",
			wait: "Bitte warten...",
		},
	},

	// logs component
	logs: {
		loading: "Lädt...",
		disclaimer:
			"Die angezeigten Protokolle stammen von der App selbst. Wenn Sie einen Fehler sehen, melden Sie ihn bitte zuerst den Entwicklern der ursprünglichen App.",
		status: {
			success: "Erfolg",
			error: "Fehler",
			pending: "Ausstehend",
		},
	},

	// loading states
	loading: {
		text: "Lädt...",
	},

	// iframe component
	iframe: {
		back: "Zurück",
		openFolder: "Ordner öffnen",
		openInBrowser: "Im Browser öffnen",
		openNewWindow: "In neuem Fenster öffnen",
		fullscreen: "Vollbild",
		stop: "Stopp",
		reload: "Neu laden",
		logs: "Protokolle",
	},

	// actions component
	actions: {
		reconnect: "Neu verbinden",
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
		deleting: "Skript wird gelöscht, bitte warten...",
		uploadModal: {
			title: "Skript hochladen",
			selectFile: "Klicken Sie, um eine Datei auszuwählen",
			selectedFile: "Ausgewählte Datei",
			scriptName: "Skriptname",
			scriptDescription: "Skriptbeschreibung (optional)",
			uploadFile: "Datei hochladen",
			uploading: "Hochladen...",
			errors: {
				uploadFailed:
					"Skript konnte nicht hochgeladen werden. Bitte versuchen Sie es erneut.",
				uploadError: "Beim Hochladen des Skripts ist ein Fehler aufgetreten.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "Keine Skripte gefunden",
		errors: {
			notArray: "Abgerufene Daten sind kein Array",
			fetchFailed: "Skripte konnten nicht abgerufen werden",
			notSupported: "Leider wird %s auf Ihrem %s nicht unterstützt.",
			notSupportedTitle: "Ihr Gerät wird nicht unterstützt",
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
