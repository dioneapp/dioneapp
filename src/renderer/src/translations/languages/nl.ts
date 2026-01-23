export const nl = {
	common: {
		cancel: "Annuleren",
		loading: "Bezig met laden...",
		error: "Fout",
		success: "Succes",
		pending: "In behandeling",
		back: "Terug",
		unselectAll: "Alles deselecteren",
		selectAll: "Alles selecteren",
	},
	noAccess: {
		title: "Sluit je aan bij de Dione-witte lijst",
		description:
			"Dione is in aanbouw en slechts een beperkt aantal gebruikers kan het gebruiken. Sluit je nu aan bij onze witte lijst om toegang te krijgen tot toekomstige versies van onze app.",
		join: "Deelnemen",
		logout: "Afmelden",
	},
	firstTime: {
		welcome: {
			title: "Welkom",
			subtitle:
				"Bedankt dat je van het begin af aan bij ons bent. Log in op je account om aan de slag te gaan.",
			login: "Inloggen",
			copyLink: "Link kopiëren",
			skipLogin: "Doorgaan zonder in te loggen",
		},
		loggingIn: {
			title: "Bezig met inloggen...",
			authError: "Kan niet verifiëren?",
			goBack: "Terug",
		},
		languageSelector: {
			title: "Stel Dione in",
			description: "Kies je taal en installatiepad",
			languageSection: "Taal",
			installationPathSection: "Installatiepad",
			pathDescription:
				"Deze map bevat al je geïnstalleerde scripts, afhankelijkheden en projectbestanden. Kies een locatie die gemakkelijk toegankelijk is en voldoende opslagruimte heeft.",
			selectFolder: "Map selecteren",
			changeFolder: "Map wijzigen",
			proceedButton: "Selecteer taal en pad",
			error: {
				spaces:
					"Het geselecteerde pad mag geen spaties bevatten. Kies een andere map.",
				updateConfig:
					"Er is een fout opgetreden bij het bijwerken van de configuratie. Probeer het opnieuw.",
				samePath:
					"Om fouten bij nieuwe updates te voorkomen, kies je een ander pad dan het Dione-uitvoerbestand.",
				general:
					"Er is een fout opgetreden bij het selecteren van het pad. Probeer het opnieuw.",
			},
			success: "Pad succesvol geconfigureerd!",
			systemLanguage: "Systeemtaal",
		},
		ready: {
			title: "Je bent klaar!",
			subtitle: "Welkom bij Dione",
			finish: "Voltooien",
		},
		clipboard: {
			success:
				"Correct naar klembord gekopieerd, plak het nu in je browser!",
		},
		navigation: {
			back: "Terug",
		},
	},
	error: {
		title: "Er is een onverwachte fout opgetreden",
		description:
			"We hebben een onverwachte fout in de applicatie ontdekt. We bieden onze excuses aan voor het ongemak.",
		return: "Teruggaan",
		report: {
			toTeam: "Rapporteer aan team",
			report: "Rapporteer",
			submit: "Rapport indienen",
			sending: "Rapport verzenden...",
			success: "Rapport verzonden!",
			failed: "Rapport kan niet worden verzonden",
			badContent: "Meld ongepaste inhoud",
			badContentDescription: "Voeg vervolgens informatie over je rapport toe aan",
		},
	},
	account: {
		title: "Account",
		logout: "Afmelden",
		stats: {
			timeSpent: {
				title: "Bestede tijd",
				subtitle: "in de afgelopen 7 dagen",
			},
			sessions: {
				title: "Sessies",
				subtitle: "in de afgelopen 7 dagen",
			},
			shared: {
				title: "Gedeeld",
				subtitle: "in de afgelopen 7 dagen",
			},
			streak: {
				title: "Reeks",
				subtitle: "opeenvolgende dagen",
				days: "dagen",
			},
		},
	},
	toast: {
		close: "Sluiten",
		install: {
			downloading: "%s downloaden...",
			starting: "%s starten...",
			uninstalling: "%s verwijderen...",
			reconnecting: "%s opnieuw verbinden...",
			retrying: "%s opnieuw installeren...",
			success: {
				stopped: "%s succesvol gestopt.",
				uninstalled: "%s succesvol verwijderd.",
				logsCopied: "Logbestanden succesvol naar klembord gekopieerd.",
				depsInstalled: "Afhankelijkheden succesvol geïnstalleerd.",
				shared: "Downloadlink naar klembord gekopieerd!",
			},
			error: {
				download: "Fout bij het starten van download: %s",
				start: "Fout bij het starten van %s: %s",
				stop: "Fout bij het stoppen van %s: %s",
				uninstall: "Fout bij het verwijderen van %s: %s",
				serverRunning: "Server is al aan het draaien.",
				tooManyApps:
					"Rustig aan! Je hebt al 6 apps tegelijk actief.",
			},
		},
	},
	titlebar: {
		closing: {
			title: "Toepassingen stoppen...",
			description:
				"Dione wordt automatisch gesloten nadat alle geopende toepassingen zijn gesloten.",
		},
	},
	sidebar: {
		tagline: "Verken, installeer, innover — in 1 klik.",
		activeApps: "Actieve apps",
		app: "app",
		apps: "apps",
		running: "actief",
		update: {
			title: "Update beschikbaar",
			description:
				"Een nieuwe versie van Dione is beschikbaar, start de app opnieuw op om bij te werken.",
			tooltip: "Nieuwe update beschikbaar, start Dione opnieuw op om bij te werken.",
		},
		login: {
			title: "Welkom terug!",
			description:
				"Log in op je Dione-account voor toegang tot alle functies, synchroniseer je projecten en personaliseer je ervaring.",
			loginButton: "Inloggen met Dione",
			later: "Misschien later",
			waitingTitle: "Wacht op inloggen...",
			waitingDescription:
				"Voltooi het inlogproces in je browser om door te gaan.",
			cancel: "Annuleren",
		},
		tooltips: {
			library: "Bibliotheek",
			settings: "Instellingen",
			account: "Account",
			logout: "Afmelden",
			login: "Inloggen",
			capture: "Capture",
		},
	},
	home: {
		title: "Start",
		featured: "Aanbevolen",
		explore: "Verkennen",
	},
	settings: {
		applications: {
			title: "Toepassingen",
			installationDirectory: {
				label: "Installatiemap",
				description:
					"Kies waar nieuwe toepassingen standaard worden geïnstalleerd.",
			},
			binDirectory: {
				label: "Binaire map",
				description:
					"Kies waar de toepassingsbinaries voor gemakkelijke toegang worden opgeslagen.",
			},
			cleanUninstall: {
				label: "Schoon verwijderen",
				description:
					"Verwijder alle gerelateerde afhankelijkheden bij het verwijderen van toepassingen.",
			},
			autoOpenAfterInstall: {
				label: "Automatisch openen na installatie",
				description:
					"Open toepassingen automatisch de eerste keer na installatie.",
			},
			deleteCache: {
				label: "Cache verwijderen",
				description: "Verwijder alle gecachete gegevens van toepassingen.",
				button: "Cache verwijderen",
				deleting: "Bezig met verwijderen...",
				deleted: "Verwijderd",
				error: "Fout",
			},
		},
		interface: {
			title: "Interface",
			displayLanguage: {
				label: "Weergavetaal",
				description: "Kies je voorkeurstaal voor de interface.",
			},
			disableFeaturedVideos: {
				label: "Aanbevolen video's uitschakelen",
				description:
					"Voorkom dat aanbevolen apps animaties afspelen. In plaats daarvan wordt een vloeiende kleurgradiënt weergegeven.",
			},
			helpTranslate: "🤔 Zie je je taal niet? Help ons meer toe te voegen!",
			theme: {
				label: "Thema",
				description: "Kies een kleurthema voor de applicatie.",
				themes: {
					default: "Paarse Droom",
					midnight: "Middernachtblauw",
					ocean: "Oceaandiepten",
					forest: "Bossenacht",
					sunset: "Zonsonderganglicht",
					royal: "Koninklijk Paars",
				},
			},
			layoutMode: {
				label: "Navigatielay-out",
				description:
					"Kies tussen zijbalk of topbalk-navigatie. Topbalk-modus is beter voor kleine schermen.",
				sidebar: "Zijbalk",
				topbar: "Topbalk",
			},
			intenseBackgrounds: {
				label: "Intense achtergrondkleuren",
				description:
					"Gebruik levendige achtergrondkleuren in plaats van subtiele tinten.",
			},
			compactView: {
				label: "Compacte weergave",
				description:
					"Gebruik een meer gecomprimeerde lay-out om meer inhoud op het scherm te passen.",
			},
		},
		notifications: {
			title: "Meldingen",
			systemNotifications: {
				label: "Systeemmeldingen",
				description: "Toon bureaubladmeldingen voor belangrijke gebeurtenissen.",
			},
			installationAlerts: {
				label: "Installatiemeldingen",
				description: "Ontvang meldingen wanneer toepassingsinstallaties voltooid zijn.",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "Toon je huidige activiteit in Discord-status.",
			},
			successSound: {
				label: "Succesvol geluid inschakelen",
				description:
					"Schakel het geluid in dat wordt afgespeeld wanneer toepassingen klaar zijn met installeren.",
			},
		},
		privacy: {
			title: "Privacy",
			errorReporting: {
				label: "Foutrapporten",
				description: "Help Dione verbeteren door anonieme foutrapporten in te dienen.",
			},
		},
		other: {
			title: "Overige",
			disableAutoUpdate: {
				label: "Automatische updates uitschakelen",
				description:
					"Schakelt automatische updates uit. Voorzichtig: je applicatie kan belangrijke reparaties of beveiligingspatches missen. Deze optie wordt niet aanbevolen voor de meeste gebruikers.",
			},
			logsDirectory: {
				label: "Logmap",
				description: "Locatie waar toepassingslogbestanden worden opgeslagen.",
			},
			exportLogs: {
				label: "Foutopsporingslogbestanden exporteren",
				description:
					"Exporteer alle logs en systeeminformatie in een zip-bestand voor foutopsporing.",
				button: "Logbestanden exporteren",
			},
			submitFeedback: {
				label: "Feedback indienen",
				description: "Meld eventuele problemen die je tegenkomt.",
				button: "Rapport verzenden",
			},
			showOnboarding: {
				label: "Onboarding tonen",
				description:
					"Stel Dione in op de originele staat en toon de onboarding opnieuw voor herconfiguratie.",
				button: "Opnieuw instellen",
			},
			variables: {
				label: "Variabelen",
				description: "Beheer toepassingsvariabelen en hun waarden.",
				button: "Open variabelen",
			},
			checkUpdates: {
				label: "Updates controleren",
				description:
					"Controleer op updates en ontvang een melding wanneer een nieuwe versie beschikbaar is.",
				button: "Updates controleren",
			},
		},
	},
	report: {
		title: "Beschrijf het probleem",
		description:
			"Geef alstublieft details over wat is gebeurd en wat je probeerde te doen.",
		placeholder:
			"Voorbeeld: Ik probeerde een applicatie te installeren toen deze fout optrad...",
		systemInformationTitle: "Systeeminformatie",
		disclaimer:
			"De volgende systeeminformatie en een anonieme ID worden in je rapport opgenomen.",
		success: "Rapport succesvol verzonden!",
		error: "Kon rapport niet verzenden. Probeer het opnieuw.",
		send: "Rapport verzenden",
		sending: "Bezig met verzenden...",
		contribute: "Help ons dit script compatibel te maken met alle apparaten",
	},
	quickLaunch: {
		title: "Snel starten",
		addApp: "App toevoegen",
		tooltips: {
			noMoreApps: "Geen beschikbare apps om toe te voegen",
		},
		selectApp: {
			title: "Selecteer een app",
			description: "{count} apps zijn beschikbaar. Je kunt er maximaal {max} selecteren.",
		},
	},
	missingDeps: {
		title: "Sommige afhankelijkheden ontbreken!",
		installing: "Afhankelijkheden installeren...",
		install: "Installeer",
		logs: {
			initializing: "Afhankelijkheidsdownload initialiseren...",
			loading: "Bezig met laden...",
			connected: "Verbonden met server",
			disconnected: "Verbroken van server",
			error: {
				socket: "Fout bij het instellen van socket",
				install: "❌ Fout bij het installeren van afhankelijkheden: {error}",
			},
			allInstalled: "Alle afhankelijkheden zijn al geïnstalleerd.",
		},
	},
	installAI: {
		step1: {
			title: "Ontmoet Dio AI",
			description:
				"Je intelligente assistent rechtstreeks in Dione geïntegreerd. Ervaar een nieuwe manier om met je toepassingen om te gaan.",
		},
		step2: {
			title: "Functies",
			description: "Alles wat je nodig hebt, hier.",
			features: {
				free: {
					title: "Gratis te gebruiken",
					description: "Geen abonnementen of verborgen kosten.",
				},
				local: {
					title: "Lokale verwerking",
					description: "Draait volledig op je hardware.",
				},
				private: {
					title: "Privé en veilig",
					description: "Je gegevens verlaten nooit je apparaat.",
				},
			},
		},
		step3: {
			title: "Installeer Ollama",
			description: "Dio AI gebruikt Ollama om met LLM's binnen je systeem te werken.",
			installing: "Bezig met installeren...",
			startingDownload: "Download starten...",
			installNow: "Nu installeren",
		},
		back: "Terug",
		next: "Volgende",
	},
	deleteLoading: {
		confirm: {
			title: "Verwijderen bevestigen",
			subtitle: "Selecteer wat je wilt verwijderen",
		},
		dependencies: "Afhankelijkheden",
		depsDescription:
			"Selecteer afhankelijkheden om samen met de applicatie te verwijderen:",
		uninstall: {
			title: "Verwijderen",
			deps: "Afhankelijkheden verwijderen",
			wait: "alstublieft wachten...",
		},
		uninstalling: {
			title: "Bezig met verwijderen",
			deps: "Afhankelijkheden verwijderen",
			wait: "Alstublieft wachten...",
		},
		processing: "Bezig met verwerken...",
		success: {
			title: "Verwijderd",
			subtitle: "succesvol",
			closing: "Dit modaal sluiten over",
			seconds: "seconden...",
		},
		autoClosing: "Automatisch sluiten...",
		error: {
			title: "Onverwachte",
			subtitle: "fout",
			hasOccurred: "opgetreden",
			deps: "Dione kon geen afhankelijkheid verwijderen, doe het alstublieft handmatig.",
			general: "Probeer het later opnieuw of controleer de logbestanden voor meer informatie.",
		},
		loading: {
			title: "Bezig met laden...",
			wait: "Alstublieft wachten...",
		},
	},
	logs: {
		loading: "Bezig met laden...",
		openPreview: "Voorbeeld openen",
		copyLogs: "Logs kopiëren",
		stop: "Stoppen",
		disclaimer:
			"De weergegeven logs zijn afkomstig van de app zelf. Als je een fout ziet, meld deze alstublieft eerst aan de ontwikkelaars van de oorspronkelijke app.",
		status: {
			success: "Succes",
			error: "Fout",
			pending: "In behandeling",
		},
	},
	loading: {
		text: "Bezig met laden...",
	},
	iframe: {
		back: "Terug",
		openFolder: "Map openen",
		openInBrowser: "In browser openen",
		openNewWindow: "Nieuw venster openen",
		fullscreen: "Volledig scherm",
		stop: "Stoppen",
		reload: "Verversen",
		logs: "Logs",
	},
	actions: {
		reconnect: "Opnieuw verbinden",
		start: "Start",
		uninstall: "Verwijderen",
		install: "Installeer",
		publishedBy: "Gepubliceerd door",
		installed: "Geïnstalleerd",
		notInstalled: "Niet geïnstalleerd",
	},
	promo: {
		title: "Wil je hier opvallen?",
		description: "Presenteer je tool aan onze gemeenschap",
		button: "Krijg aandacht",
	},
	installed: {
		title: "Je bibliotheek",
		empty: {
			title: "Je hebt geen toepassingen geïnstalleerd",
			action: "Installeer er nu een",
		},
	},
	local: {
		title: "Lokale scripts",
		upload: "Script uploaden",
		noScripts: "Geen scripts gevonden",
		deleting: "Script verwijderen, wacht alstublieft...",
		uploadModal: {
			title: "Script uploaden",
			selectFile: "Klik om een bestand te selecteren",
			selectedFile: "Geselecteerd bestand",
			scriptName: "Scriptnaam",
			scriptDescription: "Scriptbeschrijving (optioneel)",
			uploadFile: "Bestand uploaden",
			uploading: "Bezig met uploaden...",
			errors: {
				uploadFailed: "Script kon niet worden geüpload. Probeer het opnieuw.",
				uploadError: "Er is een fout opgetreden bij het uploaden van het script.",
			},
		},
	},
	feed: {
		noScripts: "Geen scripts gevonden",
		loadingMore: "Meer laden...",
		reachedEnd: "Je hebt het einde bereikt.",
		notEnoughApps: "Als je denkt dat er niet genoeg apps zijn,",
		helpAddMore: "help ons dan meer toe te voegen",
		viewingCached:
			"Je bent offline. Je bekijkt gecachete inhoud. Installatiesfuncties zijn uitgeschakeld.",
		errors: {
			notArray: "Opgehaalde gegevens zijn geen array",
			fetchFailed: "Scripts kunnen niet worden opgehaald",
			notSupported: "Helaas wordt %s niet ondersteund op je %s.",
			notSupportedTitle: "Je apparaat is mogelijk niet compatibel.",
		},
	},
	search: {
		placeholder: "Scripts zoeken...",
		filters: {
			audio: "Audio",
			image: "Afbeelding",
			video: "Video",
			chat: "Chat",
		},
	},
	networkShare: {
		title: "Delen",
		modes: {
			local: "Lokaal",
			public: "Openbaar",
			connecting: "Bezig met verbinden...",
		},
		warning: {
			title: "Openbare toegang",
			description:
				"Maakt een openbare URL die van overal toegankelijk is. Deel alleen met vertrouwde personen.",
		},
		local: {
			shareUrl: "Deel-URL",
			urlDescription: "Deel deze URL met apparaten op je lokale netwerk",
			localNetwork: "Lokaal netwerk:",
			description: "Deze URL werkt op apparaten die zijn verbonden met hetzelfde netwerk.",
		},
		public: {
			shareUrl: "Openbare URL",
			urlDescription: "Deel deze URL met iedereen, overal ter wereld",
			passwordTitle: "Wachtwoord eerste keer",
			visitorMessage:
				"Bezoekers moeten dit mogelijk eenmaal per apparaat invoeren om toegang te krijgen tot de tunnel.",
			stopSharing: "Stop delen",
		},
		errors: {
			noAddress: "Kan geen netwerkadres krijgen. Controleer alstublieft je verbinding.",
			loadFailed: "Netwerkgegevens kunnen niet worden geladen.",
			noUrl: "Geen URL beschikbaar om te kopiëren.",
			copyFailed: "Kan niet naar klembord kopiëren.",
			tunnelFailed: "Kan tunnel niet starten",
		},
	},
	loginFeatures: {
		title: "Je mist functies",
		description: "Log in op Dione zodat je deze functies niet mist.",
		login: "Inloggen",
		skip: "Overslaan",
		features: {
			customReports: {
				title: "Aangepaste rapporten verzenden",
				description:
					"Verzend aangepaste rapporten rechtstreeks vanuit de applicatie, waardoor ondersteuning sneller gaat in geval van fouten.",
			},
			createProfile: {
				title: "Profiel maken",
				description:
					"Maak een profiel voor de Dione-gemeenschap zodat we je kunnen leren kennen.",
			},
			syncData: {
				title: "Synchroniseer je gegevens",
				description: "Synchroniseer je gegevens op al je apparaten.",
			},
			earlyBirds: {
				title: "Ontvang early bird-updates",
				description:
					"Ontvang early bird-updates en nieuwe functies voor iedereen anders.",
			},
			giveOutLikes: {
				title: "Geef likes",
				description:
					"Geef likes aan de apps die je het leukst vindt, zodat meer mensen ze gebruiken!",
			},
			publishScripts: {
				title: "Publiceer scripts",
				description: "Publiceer je scripts en deel ze met de wereld.",
			},
			achieveGoals: {
				title: "Bereik doelen",
				description:
					"Bereik doelen zoals Dione 7 dagen gebruiken om gratis cadeaus te krijgen",
			},
			getNewswire: {
				title: "Ontvang nieuwsberichten",
				description:
					"Ontvang updates via e-mail zodat je geen nieuwe functies mist.",
			},
		},
	},
	editor: {
		selectFile: "Selecteer een bestand om te bewerken",
		previewNotAvailable: "Voorbeeld niet beschikbaar voor dit bestand.",
		mediaNotSupported: "Voorbeeld voor dit mediatype wordt nog niet ondersteund.",
		previewOnly: "Alleen voorbeeld",
		unsaved: "Niet opgeslagen",
		retry: "Opnieuw proberen",
		editorLabel: "Editor",
	},
	links: {
		discord: "Discord",
		github: "GitHub",
		dione: "Dione",
		builtWith: "gemaakt met",
	},
	updates: {
		later: "Later",
		install: "Installeer",
	},
	iframeActions: {
		shareOnNetwork: "Deel op netwerk",
	},
	versions: {
		node: "Node",
		electron: "Electron",
		chromium: "Chromium",
	},
	connection: {
		retryLater: "We hebben verbindingsproblemen, probeer het later opnieuw.",
	},
	variables: {
		title: "Omgevingsvariabelen",
		addKey: "Sleutel toevoegen",
		searchPlaceholder: "Variabelen zoeken...",
		keyPlaceholder: "Sleutel (bijv. MY_VAR)",
		valuePlaceholder: "Waarde",
		copyAll: "Alles naar klembord kopiëren",
		confirm: "Bevestigen",
		copyPath: "Pad kopiëren",
		copyFullValue: "Volledige waarde kopiëren",
		deleteKey: "Sleutel verwijderen",
	},
	customCommands: {
		title: "Starten met aangepaste parameters",
		launch: "Starten",
	},
	contextMenu: {
		copyPath: "Pad kopiëren",
		open: "Openen",
		reload: "Verversen",
		rename: "Hernoemen",
		delete: "Verwijderen",
	},
	fileTree: {
		noFiles: "Geen bestanden gevonden in deze workspace.",
		media: "Media",
		binary: "Binair",
	},
	entryDialog: {
		name: "Naam",
		createFile: "Bestand maken",
		createFolder: "Map maken",
		renameFile: "Bestand hernoemen",
		renameFolder: "Map hernoemen",
		createInRoot: "Dit wordt gemaakt in de werkruimtebasis.",
		createInside: "Dit wordt gemaakt in {path}.",
		currentLocation: "Huidige locatie: {path}.",
		currentLocationRoot: "Huidige locatie: werkruimtebasis.",
		rename: "Hernoemen",
		placeholderFile: "example.ts",
		placeholderFolder: "Nieuwe map",
	},
	workspaceEditor: {
		newFile: "Nieuw bestand",
		newFolder: "Nieuwe map",
		retry: "Opnieuw proberen",
		back: "Terug",
		save: "Opslaan",
		openInExplorer: "In verkenner openen",
		resolvingPath: "Pad wordt opgelost...",
		workspace: "Werkruimte",
	},
	headerBar: {
		back: "Terug",
		openInExplorer: "In verkenner openen",
		save: "Opslaan",
	},
	settingsFooter: {
		builtWithLove: "gemaakt met ♥",
		getDioneWebsite: "getdione.app",
		version: "Versie",
		port: "Poort",
	},
	notifications: {
		enabled: {
			title: "Meldingen ingeschakeld",
			description: "Je ontvangt meldingen voor belangrijke gebeurtenissen.",
		},
		learnMore: "Meer informatie",
	},
	languageSelector: {
		next: "Volgende",
	},
	selectPath: {
		chooseLocation: "Kies installatielocatie",
		changePath: "Pad wijzigen",
	},
	browserCompatibility: {
		audioNotSupported: "Je browser ondersteunt het audioelement niet.",
		videoNotSupported: "Je browser ondersteunt het videoelement niet.",
	},
	library: {
		official: "Officieel",
	},
	sidebarUpdate: {
		newUpdateAvailable: "Nieuwe update beschikbaar",
		whatsNew: "Dit is nieuw",
	},
	iframeLabels: {
		back: "Terug",
		logs: "Logs",
		disk: "Schijf",
		editor: "Editor",
	},
	progress: {
		running: "Actief...",
	},
	toastMessages: {
		copiedToClipboard: "Naar klembord gekopieerd!",
		keyAndValueRequired: "Sleutel en waarde zijn vereist",
		variableAdded: "Variabele toegevoegd",
		failedToAddVariable: "Variabele kon niet worden toegevoegd",
		variableRemoved: "Variabele verwijderd",
		failedToRemoveVariable: "Variabele kon niet worden verwijderd",
		valueRemoved: "Waarde verwijderd",
		failedToRemoveValue: "Waarde kon niet worden verwijderd",
		pathCopiedToClipboard: "Pad naar klembord gekopieerd",
		failedToCopyPath: "Pad kan niet worden gekopieerd",
		unableToOpenLocation: "Kan locatie niet openen",
		cannotDeleteWorkspaceRoot: "Kan werkruimtebasis niet verwijderen",
		deleted: "Verwijderd",
		failedToDeleteEntry: "Invoer kon niet worden verwijderd",
		workspaceNotAvailable: "Werkruimte niet beschikbaar",
		selectFileOrFolderToRename: "Selecteer een bestand of map om te hernoemen",
		cannotRenameWorkspaceRoot: "Kan werkruimtebasis niet hernoemen",
		entryRenamed: "Invoer hernoemd",
		fileSavedSuccessfully: "Bestand succesvol opgeslagen",
		failedToSaveFile: "Bestand kan niet worden opgeslagen",
		mediaFilesCannotBeOpened: "Mediabestanden kunnen niet in de editor worden geopend.",
		binaryFilesCannotBeOpened:
			"Binaire en uitvoerbare bestanden kunnen niet in de editor worden geopend.",
		thisFileTypeCannotBeEdited: "Dit bestandstype kan nog niet worden bewerkt.",
	},
	errorMessages: {
		workspaceNotFound: "Werkruimte niet gevonden",
		failedToLoadWorkspace: "Werkruimte kan niet worden geladen",
		failedToLoadDirectory: "Map kan niet worden geladen",
		unableToOpenWorkspace: "Kan werkruimte niet openen",
		failedToLoadFile: "Bestand kan niet worden geladen",
		nameCannotBeEmpty: "Naam kan niet leeg zijn",
		nameContainsInvalidCharacters: "Naam bevat ongeldige tekens",
		failedToCreateEntry: "Invoer kon niet worden gemaakt",
		failedToRenameEntry: "Invoer kon niet worden hernoemd",
	},
	fileOperations: {
		fileCreated: "Bestand gemaakt",
		folderCreated: "Map gemaakt",
		untitledFile: "untitled.txt",
		newFolder: "Nieuwe map",
	},
	confirmDialogs: {
		removeValue: "Weet je zeker dat je wilt verwijderen",
		thisValue: "deze waarde",
		keyAndAllValues: "de sleutel en alle waarden ervan",
		from: "van",
	},
	networkShareErrors: {
		failedToLoadNetworkInfo: "Netwerkgegevens kunnen niet worden geladen.",
		failedToStartTunnel: "Kan tunnel niet starten",
		failedToCopyToClipboard: "Kan niet naar klembord kopiëren.",
	},
	feedErrors: {
		invalidDataFormat: "Ongeldig gegevensformaat van API",
		failedToFetchScripts: "Scripts kunnen niet worden opgehaald",
		offline: "Je bent offline en er is geen gecachete inhoud beschikbaar.",
	},
	uploadScript: {
		fileLoadedLocally: "Bestand lokaal geladen",
	},
	runningApps: {
		running: "Actief",
		thereIsAnAppRunningInBackground:
			"Er is een applicatie op de achtergrond actief.",
		failedToReloadQuickLaunch: "Snelstartapps kunnen niet opnieuw worden geladen",
		failedToFetchInstalledApps: "Geïnstalleerde apps kunnen niet worden opgehaald",
	},
} as const;
