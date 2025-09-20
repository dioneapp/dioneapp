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
		title: "Tritt der Dione Whitelist bei",
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
				"Vielen Dank, dass Sie uns von Anfang an auf dieser Reise begleiten. Melden Sie sich bei Ihrem Konto an, um loszulegen.",
			login: "Anmelden",
			copyLink: "Link kopieren",
			skipLogin: "Ohne Anmeldung fortfahren",
		},
		loggingIn: {
			title: "Meldet sich an...",
			authError: "Konnte nicht authentifizieren?",
			goBack: "Zurück",
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
			"Wir haben einen unerwarteten Fehler in der Anwendung festgestellt. Wir entschuldigen uns für die Unannehmlichkeiten.",
		return: "Zurückkehren",
		report: {
			toTeam: "An das Team melden",
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
			reconnecting: "%s wird wieder verbunden...",
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
				tooManyApps: "Langsam! Sie haben bereits 6 Apps gleichzeitig laufen.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Anwendungen werden gestoppt...",
			description:
				"Dione wird nach dem Schließen aller offenen Anwendungen automatisch geschlossen.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Entdecken, Installieren, Innovieren — mit 1 Klick.",
		activeApps: "Aktive Apps",
		update: {
			title: "Update verfügbar",
			description:
				"Eine neue Version von Dione ist verfügbar. Bitte starten Sie die App neu, um zu aktualisieren.",
			tooltip:
				"Neues Update verfügbar, bitte starten Sie Dione neu, um zu aktualisieren.",
		},
		tooltips: {
			library: "Bibliothek",
			settings: "Einstellungen",
			account: "Konto",
			logout: "Abmelden",
			login: "Anmelden",
			capture: "Erfassen",
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
					"Wählen Sie, wo neue Anwendungen standardmäßig installiert werden",
			},
			binDirectory: {
				label: "Bin-Verzeichnis",
				description:
					"Wählen Sie, wo die Anwendungsbinärdateien für einfachen Zugriff gespeichert werden sollen",
			},
			cleanUninstall: {
				label: "Saubere Deinstallation",
				description:
					"Entfernen Sie alle zugehörigen Abhängigkeiten bei der Deinstallation von Anwendungen",
			},
			autoOpenAfterInstall: {
				label: "Nach Installation automatisch öffnen",
				description:
					"Öffnen Sie Anwendungen automatisch zum ersten Mal nach der Installation",
			},
			deleteCache: {
				label: "Cache löschen",
				description: "Entfernen Sie alle Cache-Daten von Anwendungen",
				button: "Cache löschen",
				deleting: "Löscht...",
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
				"🤔 Ihre Sprache nicht dabei? Helfen Sie uns, mehr hinzuzufügen!",
			compactView: {
				label: "Kompakte Ansicht",
				description:
					"Verwenden Sie ein dichteres Layout, um mehr Inhalt auf dem Bildschirm unterzubringen",
			},
		},
		notifications: {
			title: "Benachrichtigungen",
			systemNotifications: {
				label: "Systembenachrichtigungen",
				description:
					"Zeigen Sie Desktop-Benachrichtigungen für wichtige Ereignisse an",
			},
			installationAlerts: {
				label: "Installationswarnungen",
				description:
					"Werden Sie benachrichtigt, wenn Anwendungsinstallationen abgeschlossen sind",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "Zeigen Sie Ihre aktuelle Aktivität im Discord-Status an",
			},
			successSound: {
				label: "Erfolgston aktivieren",
				description:
					"Aktiviert den Ton, der abgespielt wird, wenn App-Installationen abgeschlossen sind",
			},
		},
		privacy: {
			title: "Datenschutz",
			errorReporting: {
				label: "Fehlerberichterstattung",
				description:
					"Helfen Sie, Dione zu verbessern, indem Sie anonyme Fehlerberichte senden",
			},
		},
		other: {
			title: "Sonstiges",
			disableAutoUpdate: {
				label: "Automatische Updates deaktivieren",
				description:
					"Deaktiviert automatische Updates. Vorsicht: Ihre Anwendung verpasst möglicherweise wichtige Korrekturen oder Sicherheitspatches. Diese Option wird für die meisten Benutzer nicht empfohlen.",
			},
			logsDirectory: {
				label: "Protokollverzeichnis",
				description: "Speicherort für Anwendungs protokolle",
			},
			submitFeedback: {
				label: "Feedback einreichen",
				description:
					"Melden Sie alle Probleme oder Schwierigkeiten, auf die Sie stoßen",
				button: "Bericht senden",
			},
			showOnboarding: {
				label: "Onboarding anzeigen",
				description:
					"Setzt Dione auf den Anfangszustand zurück und zeigt das Onboarding zur Neukonfiguration erneut an",
				button: "Zurücksetzen",
			},
			variables: {
				label: "Variablen",
				description: "Verwalten Sie Anwendungsvariablen und ihre Werte",
				button: "Variablen öffnen",
			},
			checkUpdates: {
				label: "Auf Updates prüfen",
				description:
					"Auf Updates prüfen und benachrichtigen, wenn eine neue Version verfügbar ist",
				button: "Auf Updates prüfen",
			},
		},
	},

	// report form
	report: {
		title: "Beschreiben Sie das Problem",
		description:
			"Bitte geben Sie Details an, was passiert ist und was Sie versucht haben zu tun.",
		placeholder:
			"Beispiel: Ich habe versucht, eine Anwendung zu installieren, als dieser Fehler auftrat...",
		systemInformationTitle: "Systeminformationen",
		disclaimer:
			"Die folgenden Systeminformationen und eine anonyme ID werden mit Ihrem Bericht übermittelt.",
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
			title: "App auswählen",
			description:
				"{count} Apps sind verfügbar. Sie können bis zu {max} auswählen.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "Einige Abhängigkeiten fehlen!",
		installing: "Installiert Abhängigkeiten...",
		install: "Installieren",
		logs: {
			initializing: "Initialisiere Download der Abhängigkeiten...",
			loading: "Lädt...",
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
		uninstalling: {
			title: "Deinstalliert",
			deps: "Deinstalliert Abhängigkeiten",
			wait: "bitte warten Sie...",
		},
		success: {
			title: "Deinstalliert",
			subtitle: "erfolgreich",
			closing: "Dieses Modal wird geschlossen in",
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
			title: "Lädt...",
			wait: "Bitte warten Sie...",
		},
	},

	// logs component
	logs: {
		loading: "Lädt...",
		disclaimer:
			"Angezeigte Protokolle stammen von der App selbst. Wenn Sie einen Fehler sehen, melden Sie ihn bitte zuerst den ursprünglichen Entwicklern der App.",
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
	},

	// promo component
	promo: {
		title: "Möchten Sie hier vorgestellt werden?",
		description: "Zeigen Sie Ihr Tool unserer Community",
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
			uploading: "Lädt hoch...",
			errors: {
				uploadFailed:
					"Fehler beim Hochladen des Skripts. Bitte versuchen Sie es erneut.",
				uploadError: "Beim Hochladen des Skripts ist ein Fehler aufgetreten.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "Keine Skripte gefunden",
		errors: {
			notArray: "Abgerufene Daten sind kein Array",
			fetchFailed: "Fehler beim Abrufen der Skripte",
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
} as const;
