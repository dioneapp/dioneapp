export const sv = {
	// common actions and states
	common: {
		cancel: "Avbryt",
		loading: "Laddar...",
		error: "Fel",
		success: "Framgång",
		pending: "Väntar",
		back: "Tillbaka",
		unselectAll: "Avmarkera allt",
		selectAll: "Markera allt",
	},

	// authentication and access related
	noAccess: {
		title: "Anslut till Dione vitlista",
		description:
			"Dione är under utveckling och endast ett begränsat antal användare kan komma åt det. Anslut till vår vitlista nu för att få åtkomst till framtida versioner av vår app.",
		join: "Anslut",
		logout: "Logga ut",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Välkommen till",
			subtitle:
				"Tack för att du anslöt till oss tidigt på denna resa. Logga in på ditt konto för att komma igång.",
			login: "Logga in",
			copyLink: "Kopiera länk",
			skipLogin: "Fortsätt utan inloggning",
		},
		loggingIn: {
			title: "Loggar in...",
			authError: "Kan inte autentisera?",
			goBack: "Gå tillbaka",
		},
		languageSelector: {
			title: "Konfigurera Dione",
			description: "Välj ditt språk och installationssökväg",
			languageSection: "Språk",
			installationPathSection: "Installationssökväg",
			pathDescription:
				"Den här mappen kommer att innehålla alla dina installerade skript, beroenden och projektfiler. Välj en plats som är lätt att nå och har tillräckligt lagringsutrymme.",
			selectFolder: "Välj mapp",
			changeFolder: "Ändra mapp",
			proceedButton: "Välj språk och sökväg",
			error: {
				spaces:
					"Den valda sökvägen kan inte innehålla mellanslag. Välj en annan mapp.",
				updateConfig:
					"Ett fel uppstod vid uppdatering av konfigurationen. Försök igen.",
				samePath:
					"För att undvika fel vid uppdateringar väljer du en annan sökväg än Dione-körbara filen.",
				general:
					"Ett fel uppstod när sökvägen valdes. Försök igen.",
			},
			success: "Sökvägen konfigurerades framgångsrikt!",
			systemLanguage: "Systemspråk",
		},
		ready: {
			title: "Du är redo!",
			subtitle: "Välkommen till Dione",
			finish: "Avsluta",
		},
		clipboard: {
			success:
				"Kopierad till urklipp korrekt, klistra in det i din webbläsare nu!",
		},
		navigation: {
			back: "Tillbaka",
		},
	},

	// error handling
	error: {
		title: "Ett oväntat fel inträffade",
		description:
			"Vi har upptäckt ett oväntat fel i programmet. Vi ber om ursäkt för besväret.",
		return: "Återgå",
		report: {
			toTeam: "Rapportera till teamet",
			report: "Rapportera",
			submit: "Skicka rapport",
			sending: "Skickar rapport...",
			success: "Rapport skickad!",
			failed: "Misslyckades att skicka rapport",
			badContent: "Rapportera olämpligt innehål",
			badContentDescription: "Lägg sedan till information om din rapport till",
		},
	},

	// account related
	account: {
		title: "Konto",
		logout: "Logga ut",
		stats: {
			timeSpent: {
				title: "Tid tillbringa",
				subtitle: "de senaste 7 dagarna",
			},
			sessions: {
				title: "Sessioner",
				subtitle: "de senaste 7 dagarna",
			},
			shared: {
				title: "Delat",
				subtitle: "de senaste 7 dagarna",
			},
			streak: {
				title: "Rad",
				subtitle: "på rad dagar",
				days: "dagar",
			},
		},
	},

	// toast notifications
	toast: {
		close: "Stäng",
		install: {
			downloading: "Laddar ned %s...",
			starting: "Startar %s...",
			uninstalling: "Avinstallerar %s...",
			reconnecting: "Återansluter %s...",
			retrying: "Försöker installera %s igen...",
			success: {
				stopped: "%s stoppades framgångsrikt.",
				uninstalled: "%s avinstallerades framgångsrikt.",
				logsCopied: "Loggar kopierades framgångsrikt till urklipp.",
				depsInstalled: "Beroenden installerades framgångsrikt.",
				shared: "Nedladdningslänk kopierad till urklipp!",
			},
			error: {
				download: "Fel vid start av nedladdning: %s",
				start: "Fel vid start av %s: %s",
				stop: "Fel vid stopp av %s: %s",
				uninstall: "Fel vid avinstallation av %s: %s",
				serverRunning: "Servern körs redan.",
				tooManyApps:
					"Sakta ned! Du har redan 6 appar som körs samtidigt.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Stoppar program...",
			description:
				"Dione stängs automatiskt efter stängning av alla öppna program.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Utforska, Installera, Innovera — på 1 klick.",
		activeApps: "Aktiva appar",
		app: "app",
		apps: "appar",
		running: "kör",
		update: {
			title: "Uppdatering tillgänglig",
			description:
				"En ny version av Dione är tillgänglig. Starta om appen för att uppdatera.",
			tooltip: "Ny uppdatering tillgänglig. Starta om Dione för att uppdatera.",
		},
		login: {
			title: "Välkommen tillbaka!",
			description:
				"Logga in på ditt Dione-konto för att komma åt alla funktioner, synkronisera dina projekt och anpassa din upplevelse.",
			loginButton: "Logga in med Dione",
			later: "Kanske senare",
			waitingTitle: "Väntar på inloggning...",
			waitingDescription:
				"Slutför inloggningsprocessen i din webbläsare för att fortsätta.",
			cancel: "Avbryt",
		},
		tooltips: {
			library: "Bibliotek",
			settings: "Inställningar",
			account: "Konto",
			logout: "Logga ut",
			login: "Logga in",
			capture: "Fånga",
		},
	},

	// home page
	home: {
		title: "Hem",
		featured: "Utvalda",
		explore: "Utforska",
	},

	// settings page
	settings: {
		applications: {
			title: "Program",
			installationDirectory: {
				label: "Installationskatalog",
				description:
					"Välj var nya program ska installeras som standard.",
			},
			binDirectory: {
				label: "Bin-katalog",
				description:
					"Välj var programbinärfilerna ska lagras för enkel åtkomst.",
			},
			cleanUninstall: {
				label: "Ren avinstallation",
				description:
					"Ta bort alla relaterade beroenden vid avinstallation av program.",
			},
			autoOpenAfterInstall: {
				label: "Öppna automatiskt efter installation",
				description:
					"Öppna program automatiskt för första gången efter installation.",
			},
			deleteCache: {
				label: "Radera cache",
				description: "Ta bort alla cachelagrade data från program.",
				button: "Radera cache",
				deleting: "Raderar...",
				deleted: "Raderad",
				error: "Fel",
			},
		},
		interface: {
			title: "Gränssnitt",
			displayLanguage: {
				label: "Visningsspråk",
				description: "Välj ditt önskade gränssnittsspråk.",
			},
			disableFeaturedVideos: {
				label: "Inaktivera utvalda videor",
				description:
					"Stoppa utvalda appar från att spela animationer. En slät färggradient visas istället.",
			},
			helpTranslate: "🤔 Ser du inte ditt språk? Hjälp oss lägga till fler!",
			theme: {
				label: "Tema",
				description: "Välj en färgtema för programmet.",
				themes: {
					default: "Purple Dream",
					midnight: "Midnight Blue",
					ocean: "Ocean Depths",
					forest: "Forest Night",
					sunset: "Sunset Glow",
					royal: "Royal Purple",
				},
			},
			layoutMode: {
				label: "Navigationslayout",
				description:
					"Välj mellan sidofält eller toppfältsnavigation. Toppfältsläge är bättre för små skärmar.",
				sidebar: "Sidofält",
				topbar: "Toppfält",
			},
			intenseBackgrounds: {
				label: "Intensiva bakgrundsfärger",
				description:
					"Använd mer vibrerande bakgrundsfärger istället för subtila toner.",
			},
			compactView: {
				label: "Kompakt vy",
				description:
					"Använd en mer kondenserad layout för att passa mer innehål på skärmen.",
			},
		},
		notifications: {
			title: "Aviseringar",
			systemNotifications: {
				label: "Systemaviseringar",
				description: "Visa skrivbordsaviseringar för viktiga händelser.",
			},
			installationAlerts: {
				label: "Installationsvarningar",
				description: "Få aviseringar när programinstallationer slutförs.",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "Visa din nuvarande aktivitet i Discord-status.",
			},
			successSound: {
				label: "Aktivera framgångslyd",
				description:
					"Aktivera ljud som spelas när programinstallationen är klar.",
			},
		},
		privacy: {
			title: "Sekretess",
			errorReporting: {
				label: "Felrapportering",
				description: "Hjälp till att förbättra Dione genom att skicka anonyma felrapporter.",
			},
		},
		other: {
			title: "Övrigt",
			disableAutoUpdate: {
				label: "Inaktivera automatiska uppdateringar",
				description:
					"Inaktiverar automatiska uppdateringar. Varning: programmet kan missa viktiga korrigeringar eller säkerhetspatchningar. Det rekommenderas inte för de flesta användare.",
			},
			logsDirectory: {
				label: "Loggkatalog",
				description: "Plats där programloggar lagras.",
			},
			exportLogs: {
				label: "Exportera felsökningsloggar",
				description:
					"Exportera alla loggar och systeminformation i en zip-fil för felsökning.",
				button: "Exportera loggar",
			},
			submitFeedback: {
				label: "Skicka feedback",
				description: "Rapportera eventuella problem du stöter på.",
				button: "Skicka rapport",
			},
			showOnboarding: {
				label: "Visa introduktion",
				description:
					"Återställ Dione till sitt ursprungliga tillstånd och visa introduktionen igen för omkonfigurering.",
				button: "Återställ",
			},
			variables: {
				label: "Variabler",
				description: "Hantera programvariabler och deras värden.",
				button: "Öppna variabler",
			},
			checkUpdates: {
				label: "Sök efter uppdateringar",
				description:
					"Sök efter uppdateringar och meddela när en ny version är tillgänglig.",
				button: "Sök efter uppdateringar",
			},
		},
	},

	// report form
	report: {
		title: "Beskriv problemet",
		description:
			"Ange detaljer om vad som hände och vad du försökte göra.",
		placeholder:
			"Exempel: Jag försökte installera ett program när det här felet uppstod...",
		systemInformationTitle: "Systeminformation",
		disclaimer:
			"Följande systeminformation och ett anonymt ID kommer att inkluderas i din rapport.",
		success: "Rapport skickad!",
		error: "Misslyckades att skicka rapport. Försök igen.",
		send: "Skicka rapport",
		sending: "Skickar...",
		contribute: "Hjälp oss göra det här skriptet kompatibelt med alla enheter",
	},

	// quick launch component
	quickLaunch: {
		title: "Snabbstart",
		addApp: "Lägg till app",
		tooltips: {
			noMoreApps: "Ingen tillgänglig app att lägga till",
		},
		selectApp: {
			title: "Välj en app",
			description: "{count} appar är tillgängliga. Du kan välja upp till {max}.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "Några beroenden saknas!",
		installing: "Installerar beroenden...",
		install: "Installera",
		logs: {
			initializing: "Initialiserar beroendenedladdning...",
			loading: "Laddar...",
			connected: "Ansluten till server",
			disconnected: "Frånkopplad från server",
			error: {
				socket: "Fel vid inställning av socket",
				install: "❌ Fel vid installation av beroenden: {error}",
			},
			allInstalled: "Alla beroenden är redan installerade.",
		},
	},

	// install AI modal
	installAI: {
		step1: {
			title: "Möt Dio AI",
			description:
				"Din intelligenta assistent integrerad direkt i Dione. Uppleva ett nytt sätt att interagera med dina program.",
		},
		step2: {
			title: "Egenskaper",
			description: "Allt du behöver, här.",
			features: {
				free: {
					title: "Gratis att använda",
					description: "Inga prenumerationer eller dolda avgifter.",
				},
				local: {
					title: "Lokal bearbetning",
					description: "Körs helt på din hårdvara.",
				},
				private: {
					title: "Privat och säker",
					description: "Dina data lämnar aldrig din enhet.",
				},
			},
		},
		step3: {
			title: "Installera Ollama",
			description: "Dio AI använder Ollama för att arbeta med LLM:er i ditt system.",
			installing: "Installerar...",
			startingDownload: "Startar nedladdning...",
			installNow: "Installera nu",
		},
		back: "Tillbaka",
		next: "Nästa",
	},

	// delete loading modal
	deleteLoading: {
		confirm: {
			title: "Bekräfta avinstallation",
			subtitle: "Välj vad som ska tas bort",
		},
		dependencies: "Beroenden",
		depsDescription:
			"Välj beroenden som ska avinstalleras tillsammans med programmet:",
		uninstall: {
			title: "Avinstallera",
			deps: "Avinstallera beroenden",
			wait: "vänligen vänta...",
		},
		uninstalling: {
			title: "Avinstallerar",
			deps: "Avinstallerar beroenden",
			wait: "Vänligen vänta...",
		},
		processing: "Bearbetar...",
		success: {
			title: "Avinstallerad",
			subtitle: "framgångsrikt",
			closing: "Stänger denna modal om",
			seconds: "sekunder...",
		},
		autoClosing: "Stängs automatiskt...",
		error: {
			title: "Ett oväntat",
			subtitle: "fel",
			hasOccurred: "inträffade",
			deps: "Dione kunde inte ta bort några beroenden. Gör det manuellt.",
			general: "Försök igen senare eller kontrollera loggarna för mer information.",
		},
		loading: {
			title: "Laddar...",
			wait: "Vänligen vänta...",
		},
	},

	// logs component
	logs: {
		loading: "Laddar...",
		openPreview: "Öppna förhandsgranskning",
		copyLogs: "Kopiera loggar",
		stop: "Stoppa",
		disclaimer:
			"Loggarna som visas är från själva appen. Om du ser ett fel rapporterar du det först till de ursprungliga app-utvecklarna.",
		status: {
			success: "Framgång",
			error: "Fel",
			pending: "Väntar",
		},
	},

	// loading states
	loading: {
		text: "Laddar...",
	},

	// iframe component
	iframe: {
		back: "Tillbaka",
		openFolder: "Öppna mapp",
		openInBrowser: "Öppna i webbläsare",
		openNewWindow: "Öppna nytt fönster",
		fullscreen: "Helskärm",
		stop: "Stoppa",
		reload: "Ladda om",
		logs: "Loggar",
	},

	// actions component
	actions: {
		reconnect: "Återanslut",
		start: "Starta",
		uninstall: "Avinstallera",
		install: "Installera",
		publishedBy: "Publicerad av",
		installed: "Installerad",
		notInstalled: "Inte installerad",
	},

	// promo component
	promo: {
		title: "Vill du vara framhävd här?",
		description: "Visa ditt verktyg för vår gemenskap",
		button: "Bli framhävd",
	},

	// installed component
	installed: {
		title: "Ditt bibliotek",
		empty: {
			title: "Du har inga installerade program",
			action: "Installera en nu",
		},
	},

	// local component
	local: {
		title: "Lokala skript",
		upload: "Ladda upp skript",
		noScripts: "Inga skript hittades",
		deleting: "Raderar skript, vänligen vänta...",
		uploadModal: {
			title: "Ladda upp skript",
			selectFile: "Klicka för att välja en fil",
			selectedFile: "Vald fil",
			scriptName: "Skriptnamn",
			scriptDescription: "Skriptbeskrivning (valfritt)",
			uploadFile: "Ladda upp fil",
			uploading: "Laddar upp...",
			errors: {
				uploadFailed: "Misslyckades att ladda upp skript. Försök igen.",
				uploadError: "Ett fel uppstod vid uppladdning av skript.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "Inga skript hittades",
		loadingMore: "Laddar mer...",
		reachedEnd: "Du nådde slutet.",
		notEnoughApps: "Om du tycker att det inte finns tillräckligt många appar,",
		helpAddMore: "hjälp oss lägga till fler",
		viewingCached:
			"Du är offline. Visar cachad innehål. Installationsfunktioner är inaktiverade.",
		errors: {
			notArray: "Hämtade data är inte en matris",
			fetchFailed: "Misslyckades att hämta skript",
			notSupported: "Tyvärr stöds %s inte på din %s.",
			notSupportedTitle: "Din enhet kan vara inkompatibel.",
		},
	},

	// search component
	search: {
		placeholder: "Sök skript...",
		filters: {
			audio: "Ljud",
			image: "Bild",
			video: "Video",
			chat: "Chatt",
		},
	},

	// network share modal
	networkShare: {
		title: "Dela",
		modes: {
			local: "Lokal",
			public: "Offentlig",
			connecting: "Ansluter...",
		},
		warning: {
			title: "Offentlig åtkomst",
			description:
				"Skapar en offentlig URL som är tillgänglig från var som helst. Dela bara med betrodda personer.",
		},
		local: {
			shareUrl: "Dela URL",
			urlDescription: "Dela denna URL med enheter på ditt lokala nätverk",
			localNetwork: "Lokalt nätverk:",
			description: "Denna URL fungerar på enheter anslutna till samma nätverk.",
		},
		public: {
			shareUrl: "Offentlig URL",
			urlDescription: "Dela denna URL med vem som helst, var som helst i världen",
			passwordTitle: "Lösenord första gången",
			visitorMessage:
				"Besökare kan behöva ange detta lösenord en gång per enhet för att komma åt tunneln.",
			stopSharing: "Sluta dela",
		},
		errors: {
			noAddress: "Kunde inte hämta nätverksadress. Kontrollera din anslutning.",
			loadFailed: "Misslyckades att ladda nätverksinformation.",
			noUrl: "Ingen URL tillgänglig att kopiera.",
			copyFailed: "Misslyckades att kopiera till urklipp.",
			tunnelFailed: "Misslyckades att starta tunnel",
		},
	},

	// login features modal
	loginFeatures: {
		title: "Du saknar funktioner",
		description: "Logga in på Dione så att du inte missar dessa funktioner.",
		login: "Logga in",
		skip: "Hoppa över",
		features: {
			customReports: {
				title: "Skicka anpassade rapporter",
				description:
					"Skicka anpassade rapporter från inom programmet, vilket gör supporten snabbare vid fel.",
			},
			createProfile: {
				title: "Skapa en profil",
				description:
					"Skapa en profil för Dione-gemenskapen för att de ska lära känna dig.",
			},
			syncData: {
				title: "Synkronisera dina data",
				description: "Synkronisera dina data på alla dina enheter.",
			},
			earlyBirds: {
				title: "Få tidiga uppdateringar",
				description:
					"Få nya funktioner och uppdateringar innan någon annan.",
			},
			giveOutLikes: {
				title: "Ge ut gilla-markeringar",
				description:
					"Lägg till gilla-markeringar för de appar du gillar mest, så fler kommer att använda dem!",
			},
			publishScripts: {
				title: "Publicera skript",
				description: "Publicera dina skript och dela dem med världen.",
			},
			achieveGoals: {
				title: "Uppnå mål",
				description:
					"Uppnå mål som att använda Dione i 7 dagar för att få gratisföreningar",
			},
			getNewswire: {
				title: "Få nyhetstråd",
				description:
					"Få uppdateringar via e-post så att du inte missar nya funktioner.",
			},
		},
	},

	// editor component
	editor: {
		selectFile: "Välj en fil för att börja redigera",
		previewNotAvailable: "Förhandsgranskning är inte tillgänglig för denna fil.",
		mediaNotSupported: "Förhandsgranskning för denna mediatyp stöds ännu inte.",
		previewOnly: "Endast förhandsgranskning",
		unsaved: "Ej sparad",
		retry: "Försök igen",
		editorLabel: "Redigerare",
	},

	// sidebar links
	links: {
		discord: "Discord",
		github: "GitHub",
		dione: "Dione",
		builtWith: "byggt med",
	},

	// update notifications
	updates: {
		later: "Senare",
		install: "Installera",
	},

	// iframe actions
	iframeActions: {
		shareOnNetwork: "Dela i nätverk",
	},

	// version info
	versions: {
		node: "Node",
		electron: "Electron",
		chromium: "Chromium",
	},

	// connection messages
	connection: {
		retryLater: "Vi har anslutningsproblem. Försök igen senare.",
	},

	// variables modal
	variables: {
		title: "Miljövariabler",
		addKey: "Lägg till nyckel",
		searchPlaceholder: "Sök variabler...",
		keyPlaceholder: "Nyckel (t.ex. MY_VAR)",
		valuePlaceholder: "Värde",
		copyAll: "Kopiera allt till urklipp",
		confirm: "Bekräfta",
		copyPath: "Kopiera sökväg",
		copyFullValue: "Kopiera fullt värde",
		deleteKey: "Radera nyckel",
	},

	// custom commands modal
	customCommands: {
		title: "Starta med anpassade parametrar",
		launch: "Starta",
	},

	// context menu
	contextMenu: {
		copyPath: "Kopiera sökväg",
		open: "Öppna",
		reload: "Ladda om",
		rename: "Byt namn",
		delete: "Radera",
	},

	// file tree
	fileTree: {
		noFiles: "Inga filer hittades på denna arbetsyta.",
		media: "Media",
		binary: "Binär",
	},

	// entry name dialog
	entryDialog: {
		name: "Namn",
		createFile: "Skapa fil",
		createFolder: "Skapa mapp",
		renameFile: "Byt namn på fil",
		renameFolder: "Byt namn på mapp",
		createInRoot: "Detta kommer att skapas i arbetsutrymmet.",
		createInside: "Detta kommer att skapas inuti {path}.",
		currentLocation: "Aktuell plats: {path}.",
		currentLocationRoot: "Aktuell plats: arbetsutrymmet.",
		rename: "Byt namn",
		placeholderFile: "example.ts",
		placeholderFolder: "Ny mapp",
	},

	// workspace editor
	workspaceEditor: {
		newFile: "Ny fil",
		newFolder: "Ny mapp",
		retry: "Försök igen",
		back: "Tillbaka",
		save: "Spara",
		openInExplorer: "Öppna i Utforskaren",
		resolvingPath: "Löser sökväg...",
		workspace: "Arbetsyta",
	},

	// header bar
	headerBar: {
		back: "Tillbaka",
		openInExplorer: "Öppna i Utforskaren",
		save: "Spara",
	},

	// settings page footer
	settingsFooter: {
		builtWithLove: "byggt med ♥",
		getDioneWebsite: "getdione.app",
		version: "Version",
		port: "Port",
	},

	// notifications
	notifications: {
		enabled: {
			title: "Aviseringar aktiverade",
			description: "Du kommer att få aviseringar för viktiga händelser.",
		},
		learnMore: "Läs mer",
	},

	// language selector
	languageSelector: {
		next: "Nästa",
	},

	// onboarding - select path
	selectPath: {
		chooseLocation: "Välj installationsplats",
		changePath: "Ändra sökväg",
	},

	// browser compatibility
	browserCompatibility: {
		audioNotSupported: "Din webbläsare stöder inte audio-elementet.",
		videoNotSupported: "Din webbläsare stöder inte video-elementet.",
	},

	// library card
	library: {
		official: "Officiell",
	},

	// sidebar updates
	sidebarUpdate: {
		newUpdateAvailable: "Ny uppdatering tillgänglig",
		whatsNew: "Här är vad som är nytt",
	},

	// iframe component labels
	iframeLabels: {
		back: "Tillbaka",
		logs: "Loggar",
		disk: "Disk",
		editor: "Redigerare",
	},

	// progress component
	progress: {
		running: "Körs...",
	},

	// toast messages
	toastMessages: {
		copiedToClipboard: "Kopierad till urklipp!",
		keyAndValueRequired: "Nyckel och värde är obligatoriska",
		variableAdded: "Variabel tillagd",
		failedToAddVariable: "Misslyckades att lägga till variabel",
		variableRemoved: "Variabel borttagen",
		failedToRemoveVariable: "Misslyckades att ta bort variabel",
		valueRemoved: "Värde borttaget",
		failedToRemoveValue: "Misslyckades att ta bort värde",
		pathCopiedToClipboard: "Sökväg kopierad till urklipp",
		failedToCopyPath: "Misslyckades att kopiera sökväg",
		unableToOpenLocation: "Kunde inte öppna plats",
		cannotDeleteWorkspaceRoot: "Kan inte radera arbetsutrymmet",
		deleted: "Raderad",
		failedToDeleteEntry: "Misslyckades att ta bort post",
		workspaceNotAvailable: "Arbetsyta är inte tillgänglig",
		selectFileOrFolderToRename: "Välj en fil eller mapp för att byta namn",
		cannotRenameWorkspaceRoot: "Kan inte byta namn på arbetsutrymmet",
		entryRenamed: "Post döpt om",
		fileSavedSuccessfully: "Fil sparad framgångsrikt",
		failedToSaveFile: "Misslyckades att spara fil",
		mediaFilesCannotBeOpened: "Mediafiler kan inte öppnas i redigeraren.",
		binaryFilesCannotBeOpened:
			"Binära och körbara filer kan inte öppnas i redigeraren.",
		thisFileTypeCannotBeEdited: "Den här filtypen kan ännu inte redigeras.",
	},

	// error messages
	errorMessages: {
		workspaceNotFound: "Arbetsyta hittades inte",
		failedToLoadWorkspace: "Misslyckades att ladda arbetsyta",
		failedToLoadDirectory: "Misslyckades att ladda katalog",
		unableToOpenWorkspace: "Kunde inte öppna arbetsyta",
		failedToLoadFile: "Misslyckades att ladda fil",
		nameCannotBeEmpty: "Namn kan inte vara tomt",
		nameContainsInvalidCharacters: "Namn innehåller ogiltiga tecken",
		failedToCreateEntry: "Misslyckades att skapa post",
		failedToRenameEntry: "Misslyckades att byta namn på post",
	},

	// file operations
	fileOperations: {
		fileCreated: "Fil skapad",
		folderCreated: "Mapp skapad",
		untitledFile: "untitled.txt",
		newFolder: "Ny mapp",
	},

	// confirmation dialogs
	confirmDialogs: {
		removeValue: "Är du säker på att du vill ta bort",
		thisValue: "det här värdet",
		keyAndAllValues: "nyckeln och alla dess värden",
		from: "från",
	},

	// network share modal
	networkShareErrors: {
		failedToLoadNetworkInfo: "Misslyckades att ladda nätverksinformation.",
		failedToStartTunnel: "Misslyckades att starta tunnel",
		failedToCopyToClipboard: "Misslyckades att kopiera till urklipp.",
	},

	// feed component
	feedErrors: {
		invalidDataFormat: "Ogiltigt dataformat från API",
		failedToFetchScripts: "Misslyckades att hämta skript",
		offline: "Du är offline och det finns inget cachad innehål tillgängligt.",
	},

	// upload script modal
	uploadScript: {
		fileLoadedLocally: "Fil laddad lokalt",
	},

	// running apps
	runningApps: {
		running: "Körs",
		thereIsAnAppRunningInBackground:
			"Det finns ett program som körs i bakgrunden.",
		failedToReloadQuickLaunch: "Misslyckades att ladda om snabbstartsappar",
		failedToFetchInstalledApps: "Misslyckades att hämta installerade appar",
	},
} as const;
