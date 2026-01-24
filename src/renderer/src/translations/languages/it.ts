export const it = {
	// common actions and states
	common: {
		cancel: "Annulla",
		loading: "Caricamento...",
		error: "Errore",
		success: "Successo",
		pending: "In sospeso",
		back: "Indietro",
		unselectAll: "Deseleziona tutto",
		selectAll: "Seleziona tutto",
	},

	// authentication and access related
	noAccess: {
		title: "Unisciti alla whitelist di Dione",
		description:
			"Dione è in costruzione e solo un numero limitato di utenti può accedervi. Unisciti alla nostra whitelist adesso per ottenere l'accesso alle future versioni della nostra app.",
		join: "Unisciti",
		logout: "Esci",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Benvenuto in",
			subtitle:
				"Grazie per unirti a noi in questo viaggio. Accedi al tuo account per iniziare.",
			login: "Accedi",
			copyLink: "Copia collegamento",
			skipLogin: "Continua senza login",
		},
		loggingIn: {
			title: "Accesso in corso...",
			authError: "Non riesco ad autenticare?",
			goBack: "Indietro",
		},
		languageSelector: {
			title: "Configura Dione",
			description: "Scegli la tua lingua e il percorso di installazione",
			languageSection: "Lingua",
			installationPathSection: "Percorso di installazione",
			pathDescription:
				"Questa cartella conterrà tutti gli script installati, le dipendenze e i file di progetto. Scegli una posizione facilmente accessibile e con spazio di archiviazione sufficiente.",
			selectFolder: "Seleziona cartella",
			changeFolder: "Cambia cartella",
			proceedButton: "Seleziona lingua e percorso",
			error: {
				spaces:
					"Il percorso selezionato non può contenere spazi. Scegli una cartella diversa.",
				updateConfig:
					"Si è verificato un errore durante l'aggiornamento della configurazione. Riprova.",
				samePath:
					"Per evitare errori nei nuovi aggiornamenti, scegli un percorso diverso dall'eseguibile di Dione.",
				general:
					"Si è verificato un errore durante la selezione del percorso. Riprova.",
			},
			success: "Percorso configurato con successo!",
			systemLanguage: "Lingua di sistema",
		},
		ready: {
			title: "Sei pronto!",
			subtitle: "Benvenuto in Dione",
			finish: "Termina",
		},
		clipboard: {
			success:
				"Copiato negli appunti correttamente, ora incollalo nel tuo browser!",
		},
		navigation: {
			back: "Indietro",
		},
	},

	// error handling
	error: {
		title: "Si è verificato un errore imprevisto",
		description:
			"Abbiamo rilevato un errore imprevisto nell'applicazione, ci scusiamo per l'inconveniente.",
		return: "Ritorna",
		report: {
			toTeam: "Segnala al team",
			report: "Segnala",
			submit: "Invia segnalazione",
			sending: "Invio segnalazione...",
			success: "Segnalazione inviata!",
			failed: "Impossibile inviare la segnalazione",
			badContent: "Segnala contenuto inappropriato",
			badContentDescription:
				"Successivamente, aggiungi informazioni sulla tua segnalazione a",
		},
	},

	// account related
	account: {
		title: "Account",
		logout: "Esci",
		stats: {
			timeSpent: {
				title: "Tempo trascorso",
				subtitle: "negli ultimi 7 giorni",
			},
			sessions: {
				title: "Sessioni",
				subtitle: "negli ultimi 7 giorni",
			},
			shared: {
				title: "Condiviso",
				subtitle: "negli ultimi 7 giorni",
			},
			streak: {
				title: "Serie",
				subtitle: "giorni consecutivi",
				days: "giorni",
			},
		},
	},

	// toast notifications
	toast: {
		close: "Chiudi",
		install: {
			downloading: "Download di %s in corso...",
			starting: "Avvio di %s in corso...",
			uninstalling: "Disinstallazione di %s in corso...",
			reconnecting: "Riconnessione di %s in corso...",
			retrying: "Tentativo di installazione di %s di nuovo...",
			success: {
				stopped: "%s interrotto con successo.",
				uninstalled: "%s disinstallato con successo.",
				logsCopied: "Log copiati negli appunti con successo.",
				depsInstalled: "Dipendenze installate con successo.",
				shared: "Collegamento di download copiato negli appunti!",
			},
			error: {
				download: "Errore durante l'avvio del download: %s",
				start: "Errore durante l'avvio di %s: %s",
				stop: "Errore durante l'arresto di %s: %s",
				uninstall: "Errore durante la disinstallazione di %s: %s",
				serverRunning: "Il server è già in esecuzione.",
				tooManyApps:
					"Rallenta! Hai già 6 app in esecuzione contemporaneamente.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Arresto delle applicazioni...",
			description:
				"Dione si chiuderà automaticamente dopo la chiusura di tutte le applicazioni aperte.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Esplora, installa, innova — in 1 clic.",
		activeApps: "App attive",
		app: "app",
		apps: "app",
		running: "in esecuzione",
		update: {
			title: "Aggiornamento disponibile",
			description:
				"Una nuova versione di Dione è disponibile, riavvia l'app per aggiornare.",
			tooltip: "Nuovo aggiornamento disponibile, riavvia Dione per aggiornare.",
		},
		login: {
			title: "Benvenuto di nuovo!",
			description:
				"Accedi al tuo account Dione per accedere a tutte le funzioni, sincronizzare i tuoi progetti e personalizzare la tua esperienza.",
			loginButton: "Accedi con Dione",
			later: "Forse più tardi",
			waitingTitle: "In attesa di accesso...",
			waitingDescription:
				"Completa il processo di accesso nel tuo browser per continuare.",
			cancel: "Annulla",
		},
		tooltips: {
			library: "Libreria",
			settings: "Impostazioni",
			account: "Account",
			logout: "Esci",
			login: "Accedi",
			capture: "Cattura",
		},
	},

	// home page
	home: {
		title: "Home",
		featured: "In primo piano",
		explore: "Esplora",
	},

	// settings page
	settings: {
		applications: {
			title: "Applicazioni",
			installationDirectory: {
				label: "Cartella di installazione",
				description:
					"Scegli dove le nuove applicazioni verranno installate per impostazione predefinita.",
			},
			binDirectory: {
				label: "Cartella Bin",
				description:
					"Scegli dove verranno archiviati i binari dell'applicazione per un facile accesso.",
			},
			cleanUninstall: {
				label: "Disinstallazione pulita",
				description:
					"Rimuovi tutte le dipendenze correlate durante la disinstallazione delle applicazioni.",
			},
			autoOpenAfterInstall: {
				label: "Apertura automatica dopo l'installazione",
				description:
					"Apri automaticamente le applicazioni per la prima volta dopo l'installazione.",
			},
			deleteCache: {
				label: "Elimina cache",
				description:
					"Rimuovi tutti i dati memorizzati nella cache dalle applicazioni.",
				button: "Elimina cache",
				deleting: "Eliminazione in corso...",
				deleted: "Eliminato",
				error: "Errore",
			},
		},
		interface: {
			title: "Interfaccia",
			displayLanguage: {
				label: "Lingua display",
				description: "Scegli la tua lingua di interfaccia preferita.",
			},
			disableFeaturedVideos: {
				label: "Disabilita video in primo piano",
				description:
					"Evita che le app in primo piano riproduco animazioni. Verrà mostrata una sfumatura di colore uniforme invece",
			},
			helpTranslate: "🤔 Non vedi la tua lingua? Aiutaci ad aggiungerne altre!",
			theme: {
				label: "Tema",
				description: "Scegli un tema colore per l'applicazione.",
				themes: {
					default: "Sogno viola",
					midnight: "Blu mezzanotte",
					ocean: "Profondità oceaniche",
					forest: "Notte forestale",
					sunset: "Bagliore del tramonto",
					royal: "Viola reale",
				},
			},
			layoutMode: {
				label: "Layout di navigazione",
				description:
					"Scegli tra la navigazione della barra laterale o della barra superiore. La modalità topbar è migliore per schermi piccoli.",
				sidebar: "Barra laterale",
				topbar: "Barra superiore",
			},
			intenseBackgrounds: {
				label: "Colori di sfondo intensi",
				description: "Usa colori di sfondo più vivaci anziché toni sottili.",
			},
			compactView: {
				label: "Visualizzazione compatta",
				description:
					"Usa un layout più condensato per adattare più contenuto sullo schermo.",
			},
		},
		notifications: {
			title: "Notifiche",
			systemNotifications: {
				label: "Notifiche di sistema",
				description: "Mostra le notifiche desktop per gli eventi importanti.",
			},
			installationAlerts: {
				label: "Avvisi di installazione",
				description:
					"Ricevi notifiche al completamento delle installazioni di applicazioni.",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "Mostra la tua attività corrente nello stato di Discord.",
			},
			successSound: {
				label: "Abilita suono di successo",
				description:
					"Abilita il suono che viene riprodotto quando le applicazioni terminano l'installazione.",
			},
		},
		privacy: {
			title: "Privacy",
			errorReporting: {
				label: "Segnalazione errori",
				description:
					"Aiuta a migliorare Dione inviando report di errori anonimi.",
			},
		},
		other: {
			title: "Altro",
			disableAutoUpdate: {
				label: "Disabilita aggiornamenti automatici",
				description:
					"Disabilita gli aggiornamenti automatici. Attenzione: la tua applicazione potrebbe perdere correzioni importanti o patch di sicurezza. Questa opzione non è consigliata per la maggior parte degli utenti.",
			},
			logsDirectory: {
				label: "Cartella log",
				description:
					"Posizione in cui vengono archiviati i log dell'applicazione.",
			},
			exportLogs: {
				label: "Esporta log di debug",
				description:
					"Esporta tutti i log e le informazioni di sistema in un file zip per il debug.",
				button: "Esporta log",
			},
			submitFeedback: {
				label: "Invia feedback",
				description: "Segnala eventuali problemi riscontrati.",
				button: "Invia segnalazione",
			},
			showOnboarding: {
				label: "Mostra onboarding",
				description:
					"Ripristina Dione al suo stato iniziale e mostra di nuovo l'onboarding per riconfigurare.",
				button: "Ripristina",
			},
			variables: {
				label: "Variabili",
				description: "Gestisci le variabili dell'applicazione e i loro valori.",
				button: "Apri variabili",
			},
			checkUpdates: {
				label: "Controlla aggiornamenti",
				description:
					"Controlla gli aggiornamenti e notificati quando è disponibile una nuova versione.",
				button: "Controlla aggiornamenti",
			},
		},
	},

	// report form
	report: {
		title: "Descrivi il problema",
		description:
			"Per favore fornisci dettagli su cosa è successo e cosa stavi cercando di fare.",
		placeholder:
			"Esempio: Stavo cercando di installare un'applicazione quando si è verificato questo errore...",
		systemInformationTitle: "Informazioni di sistema",
		disclaimer:
			"Le seguenti informazioni di sistema e un ID anonimo verranno inclusi nella tua segnalazione.",
		success: "Segnalazione inviata con successo!",
		error: "Impossibile inviare la segnalazione. Riprova.",
		send: "Invia segnalazione",
		sending: "Invio in corso...",
		contribute:
			"Aiutaci a rendere questo script compatibile con tutti i dispositivi",
	},

	// quick launch component
	quickLaunch: {
		title: "Avvio rapido",
		addApp: "Aggiungi app",
		tooltips: {
			noMoreApps: "Nessuna app disponibile da aggiungere",
		},
		selectApp: {
			title: "Seleziona un'app",
			description:
				"{count} app sono disponibili. Puoi sceglierne fino a {max}.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "Mancano alcune dipendenze!",
		installing: "Installazione delle dipendenze in corso...",
		install: "Installa",
		logs: {
			initializing: "Inizializzazione del download della dipendenza...",
			loading: "Caricamento in corso...",
			connected: "Connesso al server",
			disconnected: "Disconnesso dal server",
			error: {
				socket: "Errore durante la configurazione della socket",
				install: "❌ Errore durante l'installazione delle dipendenze: {error}",
			},
			allInstalled: "Tutte le dipendenze sono già installate.",
		},
	},

	// install AI modal
	installAI: {
		step1: {
			title: "Incontra Dio AI",
			description:
				"Il tuo assistente intelligente integrato direttamente in Dione. Prova un nuovo modo di interagire con le tue applicazioni.",
		},
		step2: {
			title: "Funzionalità",
			description: "Tutto ciò che serve, qui.",
			features: {
				free: {
					title: "Gratuito",
					description: "Nessun abbonamento o costi nascosti.",
				},
				local: {
					title: "Elaborazione locale",
					description: "Viene eseguito interamente sul tuo hardware.",
				},
				private: {
					title: "Privato e sicuro",
					description: "I tuoi dati non lasciano mai il tuo dispositivo.",
				},
			},
		},
		step3: {
			title: "Installa Ollama",
			description:
				"Dio AI utilizza Ollama per funzionare con LLM all'interno del tuo sistema.",
			installing: "Installazione in corso...",
			startingDownload: "Avvio del download...",
			installNow: "Installa ora",
		},
		back: "Indietro",
		next: "Avanti",
	},

	// delete loading modal
	deleteLoading: {
		confirm: {
			title: "Conferma disinstallazione",
			subtitle: "Seleziona cosa rimuovere",
		},
		dependencies: "Dipendenze",
		depsDescription:
			"Seleziona le dipendenze da disinstallare insieme all'applicazione:",
		uninstall: {
			title: "Disinstalla",
			deps: "Disinstalla dipendenze",
			wait: "perfavore attendi...",
		},
		uninstalling: {
			title: "Disinstallazione",
			deps: "Disinstallazione delle dipendenze",
			wait: "Per favore attendi...",
		},
		processing: "Elaborazione in corso...",
		success: {
			title: "Disinstallato",
			subtitle: "con successo",
			closing: "Chiusura di questo modale in",
			seconds: "secondi...",
		},
		autoClosing: "Chiusura automatica in corso...",
		error: {
			title: "Si è verificato un errore",
			subtitle: "inaspettato",
			hasOccurred: "si è verificato",
			deps: "Dione non è stato in grado di rimuovere alcuna dipendenza, per favore fallo manualmente.",
			general:
				"Riprova più tardi o controlla i log per ulteriori informazioni.",
		},
		loading: {
			title: "Caricamento in corso...",
			wait: "Per favore attendi...",
		},
	},

	// logs component
	logs: {
		loading: "Caricamento in corso...",
		openPreview: "Apri anteprima",
		copyLogs: "Copia log",
		stop: "Arresta",
		disclaimer:
			"I log mostrati provengono dall'app stessa. Se vedi un errore, segnalalo prima ai sviluppatori dell'app originale.",
		status: {
			success: "Successo",
			error: "Errore",
			pending: "In sospeso",
		},
	},

	// loading states
	loading: {
		text: "Caricamento in corso...",
	},

	// iframe component
	iframe: {
		back: "Indietro",
		openFolder: "Apri cartella",
		openInBrowser: "Apri nel browser",
		openNewWindow: "Apri nuova finestra",
		fullscreen: "Schermo intero",
		stop: "Arresta",
		reload: "Ricarica",
		logs: "Log",
	},

	// actions component
	actions: {
		reconnect: "Riconnetti",
		start: "Avvia",
		uninstall: "Disinstalla",
		install: "Installa",
		publishedBy: "Pubblicato da",
		installed: "Installato",
		notInstalled: "Non installato",
	},

	// promo component
	promo: {
		title: "Vuoi essere in primo piano qui?",
		description: "Mostra il tuo strumento alla nostra comunità",
		button: "Ottieni visibilità",
	},

	// installed component
	installed: {
		title: "La tua libreria",
		empty: {
			title: "Non hai applicazioni installate",
			action: "Installane una ora",
		},
	},

	// local component
	local: {
		title: "Script locali",
		upload: "Carica script",
		noScripts: "Nessuno script trovato",
		deleting: "Eliminazione dello script in corso, attendi...",
		uploadModal: {
			title: "Carica script",
			selectFile: "Fai clic per selezionare un file",
			selectedFile: "File selezionato",
			scriptName: "Nome dello script",
			scriptDescription: "Descrizione dello script (facoltativo)",
			uploadFile: "Carica file",
			uploading: "Caricamento in corso...",
			errors: {
				uploadFailed: "Impossibile caricare lo script. Riprova.",
				uploadError:
					"Si è verificato un errore durante il caricamento dello script.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "Nessuno script trovato",
		loadingMore: "Caricamento di altri script in corso...",
		reachedEnd: "Hai raggiunto la fine.",
		notEnoughApps: "Se pensi che non ci siano abbastanza app,",
		helpAddMore: "aiutaci ad aggiungerne altre",
		viewingCached:
			"Sei offline. Visualizzazione del contenuto memorizzato nella cache. Le funzioni di installazione sono disabilitate.",
		errors: {
			notArray: "I dati recuperati non sono un array",
			fetchFailed: "Impossibile recuperare gli script",
			notSupported: "Purtroppo %s non è supportato sul tuo %s.",
			notSupportedTitle: "Il tuo dispositivo potrebbe non essere compatibile.",
		},
	},

	// search component
	search: {
		placeholder: "Cerca script...",
		filters: {
			audio: "Audio",
			image: "Immagine",
			video: "Video",
			chat: "Chat",
		},
	},

	// network share modal
	networkShare: {
		title: "Condividi",
		modes: {
			local: "Locale",
			public: "Pubblico",
			connecting: "Connessione in corso...",
		},
		warning: {
			title: "Accesso pubblico",
			description:
				"Crea un URL pubblico accessibile da qualsiasi luogo. Condividi solo con persone di fiducia.",
		},
		local: {
			shareUrl: "URL di condivisione",
			urlDescription:
				"Condividi questo URL con dispositivi sulla tua rete locale",
			localNetwork: "Rete locale:",
			description:
				"Questo URL funziona sui dispositivi connessi alla stessa rete.",
		},
		public: {
			shareUrl: "URL pubblico",
			urlDescription: "Condividi questo URL con chiunque, ovunque nel mondo",
			passwordTitle: "Password primo accesso",
			visitorMessage:
				"I visitatori potrebbero dover inserire questo una volta per dispositivo per accedere al tunnel.",
			stopSharing: "Arresta la condivisione",
		},
		errors: {
			noAddress:
				"Impossibile ottenere l'indirizzo di rete. Controlla la tua connessione.",
			loadFailed: "Impossibile caricare le informazioni di rete.",
			noUrl: "Nessun URL disponibile da copiare.",
			copyFailed: "Impossibile copiare negli appunti.",
			tunnelFailed: "Impossibile avviare il tunnel",
		},
	},

	// login features modal
	loginFeatures: {
		title: "Ti mancano le funzionalità",
		description: "Accedi a Dione in modo da non perdere questi suggerimenti.",
		login: "Accedi",
		skip: "Salta",
		features: {
			customReports: {
				title: "Invia segnalazioni personalizzate",
				description:
					"Invia segnalazioni personalizzate direttamente dall'applicazione, rendendo il supporto più veloce in caso di errori.",
			},
			createProfile: {
				title: "Crea un profilo",
				description:
					"Crea un profilo per la comunità Dione in modo da conoscerti.",
			},
			syncData: {
				title: "Sincronizza i tuoi dati",
				description: "Sincronizza i tuoi dati su tutti i tuoi dispositivi.",
			},
			earlyBirds: {
				title: "Ottieni aggiornamenti early bird",
				description:
					"Ottieni aggiornamenti e nuove funzionalità prima di chiunque altro.",
			},
			giveOutLikes: {
				title: "Dai like",
				description:
					"Dai like alle app che preferisci, in modo che più persone le usino!",
			},
			publishScripts: {
				title: "Pubblica script",
				description: "Pubblica i tuoi script e condividili con il mondo.",
			},
			achieveGoals: {
				title: "Raggiungi gli obiettivi",
				description:
					"Raggiungi obiettivi come usare Dione per 7 giorni per ottenere regali gratuiti",
			},
			getNewswire: {
				title: "Ricevi newswire",
				description:
					"Ricevi aggiornamenti via email in modo da non perdere le nuove funzionalità.",
			},
		},
	},

	// editor component
	editor: {
		selectFile: "Seleziona un file per iniziare a modificare",
		previewNotAvailable: "Anteprima non disponibile per questo file.",
		mediaNotSupported:
			"L'anteprima per questo tipo di media non è ancora supportata.",
		previewOnly: "Solo anteprima",
		unsaved: "Non salvato",
		retry: "Riprova",
		editorLabel: "Editor",
	},

	// sidebar links
	links: {
		discord: "Discord",
		github: "GitHub",
		dione: "Dione",
		builtWith: "costruito con",
	},

	// update notifications
	updates: {
		later: "Più tardi",
		install: "Installa",
	},

	// iframe actions
	iframeActions: {
		shareOnNetwork: "Condividi sulla rete",
	},

	// version info
	versions: {
		node: "Node",
		electron: "Electron",
		chromium: "Chromium",
	},

	// connection messages
	connection: {
		retryLater: "Stiamo avendo problemi di connessione, riprova più tardi.",
	},

	// variables modal
	variables: {
		title: "Variabili d'ambiente",
		addKey: "Aggiungi chiave",
		searchPlaceholder: "Cerca variabili...",
		keyPlaceholder: "Chiave (es. MY_VAR)",
		valuePlaceholder: "Valore",
		copyAll: "Copia tutto negli appunti",
		confirm: "Conferma",
		copyPath: "Copia percorso",
		copyFullValue: "Copia valore completo",
		deleteKey: "Elimina chiave",
	},

	// custom commands modal
	customCommands: {
		title: "Avvia con parametri personalizzati",
		launch: "Avvia",
	},

	// context menu
	contextMenu: {
		copyPath: "Copia percorso",
		open: "Apri",
		reload: "Ricarica",
		rename: "Rinomina",
		delete: "Elimina",
	},

	// file tree
	fileTree: {
		noFiles: "Nessun file trovato in questo workspace.",
		media: "Media",
		binary: "Binario",
	},

	// entry name dialog
	entryDialog: {
		name: "Nome",
		createFile: "Crea file",
		createFolder: "Crea cartella",
		renameFile: "Rinomina file",
		renameFolder: "Rinomina cartella",
		createInRoot: "Questo verrà creato nella root del workspace.",
		createInside: "Questo verrà creato all'interno di {path}.",
		currentLocation: "Posizione attuale: {path}.",
		currentLocationRoot: "Posizione attuale: root del workspace.",
		rename: "Rinomina",
		placeholderFile: "example.ts",
		placeholderFolder: "Nuova cartella",
	},

	// workspace editor
	workspaceEditor: {
		newFile: "Nuovo file",
		newFolder: "Nuova cartella",
		retry: "Riprova",
		back: "Indietro",
		save: "Salva",
		openInExplorer: "Apri in explorer",
		resolvingPath: "Risoluzione del percorso in corso...",
		workspace: "Workspace",
	},

	// header bar
	headerBar: {
		back: "Indietro",
		openInExplorer: "Apri in explorer",
		save: "Salva",
	},

	// settings page footer
	settingsFooter: {
		builtWithLove: "costruito con ♥",
		getDioneWebsite: "getdione.app",
		version: "Versione",
		port: "Porta",
	},

	// notifications
	notifications: {
		enabled: {
			title: "Notifiche abilitate",
			description: "Riceverai notifiche per gli eventi importanti.",
		},
		learnMore: "Scopri di più",
	},

	// language selector
	languageSelector: {
		next: "Avanti",
	},

	// onboarding - select path
	selectPath: {
		chooseLocation: "Scegli posizione di installazione",
		changePath: "Cambia percorso",
	},

	// browser compatibility
	browserCompatibility: {
		audioNotSupported: "Il tuo browser non supporta l'elemento audio.",
		videoNotSupported: "Il tuo browser non supporta l'elemento video.",
	},

	// library card
	library: {
		official: "Ufficiale",
	},

	// sidebar updates
	sidebarUpdate: {
		newUpdateAvailable: "Nuovo aggiornamento disponibile",
		whatsNew: "Ecco le novità",
	},

	// iframe component labels
	iframeLabels: {
		back: "Indietro",
		logs: "Log",
		disk: "Disco",
		editor: "Editor",
	},

	// progress component
	progress: {
		running: "In esecuzione...",
	},

	// toast messages
	toastMessages: {
		copiedToClipboard: "Copiato negli appunti!",
		keyAndValueRequired: "La chiave e il valore sono obbligatori",
		variableAdded: "Variabile aggiunta",
		failedToAddVariable: "Impossibile aggiungere la variabile",
		variableRemoved: "Variabile rimossa",
		failedToRemoveVariable: "Impossibile rimuovere la variabile",
		valueRemoved: "Valore rimosso",
		failedToRemoveValue: "Impossibile rimuovere il valore",
		pathCopiedToClipboard: "Percorso copiato negli appunti",
		failedToCopyPath: "Impossibile copiare il percorso",
		unableToOpenLocation: "Impossibile aprire la posizione",
		cannotDeleteWorkspaceRoot: "Impossibile eliminare la root del workspace",
		deleted: "Eliminato",
		failedToDeleteEntry: "Impossibile eliminare la voce",
		workspaceNotAvailable: "Il workspace non è disponibile",
		selectFileOrFolderToRename:
			"Seleziona un file o una cartella da rinominare",
		cannotRenameWorkspaceRoot: "Impossibile rinominare la root del workspace",
		entryRenamed: "Voce rinominata",
		fileSavedSuccessfully: "File salvato con successo",
		failedToSaveFile: "Impossibile salvare il file",
		mediaFilesCannotBeOpened:
			"I file multimediali non possono essere aperti nell'editor.",
		binaryFilesCannotBeOpened:
			"I file binari ed eseguibili non possono essere aperti nell'editor.",
		thisFileTypeCannotBeEdited:
			"Questo tipo di file non può ancora essere modificato.",
	},

	// error messages
	errorMessages: {
		workspaceNotFound: "Workspace non trovato",
		failedToLoadWorkspace: "Impossibile caricare il workspace",
		failedToLoadDirectory: "Impossibile caricare la directory",
		unableToOpenWorkspace: "Impossibile aprire il workspace",
		failedToLoadFile: "Impossibile caricare il file",
		nameCannotBeEmpty: "Il nome non può essere vuoto",
		nameContainsInvalidCharacters: "Il nome contiene caratteri non validi",
		failedToCreateEntry: "Impossibile creare la voce",
		failedToRenameEntry: "Impossibile rinominare la voce",
	},

	// file operations
	fileOperations: {
		fileCreated: "File creato",
		folderCreated: "Cartella creata",
		untitledFile: "untitled.txt",
		newFolder: "Nuova cartella",
	},

	// confirmation dialogs
	confirmDialogs: {
		removeValue: "Sei sicuro di voler rimuovere",
		thisValue: "questo valore",
		keyAndAllValues: "la chiave e tutti i suoi valori",
		from: "da",
	},

	// network share modal
	networkShareErrors: {
		failedToLoadNetworkInfo: "Impossibile caricare le informazioni di rete.",
		failedToStartTunnel: "Impossibile avviare il tunnel",
		failedToCopyToClipboard: "Impossibile copiare negli appunti.",
	},

	// feed component
	feedErrors: {
		invalidDataFormat: "Formato dati non valido dall'API",
		failedToFetchScripts: "Impossibile recuperare gli script",
		offline:
			"Sei offline e non c'è contenuto memorizzato nella cache disponibile.",
	},

	// upload script modal
	uploadScript: {
		fileLoadedLocally: "File caricato localmente",
	},

	// running apps
	runningApps: {
		running: "In esecuzione",
		thereIsAnAppRunningInBackground:
			"C'è un'applicazione in esecuzione in background.",
		failedToReloadQuickLaunch: "Impossibile ricaricare le app di avvio rapido",
		failedToFetchInstalledApps: "Impossibile recuperare le app installate",
	},
} as const;
