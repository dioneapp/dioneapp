export const fr = {
	// common actions and states
	common: {
		cancel: "Annuler",
		loading: "Chargement...",
		error: "Erreur",
		success: "Succès",
		pending: "En attente",
		back: "Retour",
		unselectAll: "Tout désélectionner",
		selectAll: "Tout sélectionner",
	},

	// authentication and access related
	noAccess: {
		title: "Rejoindre la liste blanche Dione",
		description:
			"Dione est en cours de construction et seule une quantité limitée d'utilisateurs peut y accéder. Rejoignez notre liste blanche dès maintenant pour accéder aux futures versions de notre application.",
		join: "Rejoindre",
		logout: "Déconnexion",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Bienvenue sur",
			subtitle:
				"Merci de nous rejoindre tôt dans ce voyage. Connectez-vous à votre compte pour commencer.",
			login: "Se connecter",
			copyLink: "Copier le lien",
			skipLogin: "Continuer sans connexion",
		},
		loggingIn: {
			title: "Connexion en cours...",
			authError: "Impossible de s'authentifier ?",
			goBack: "Retour",
		},
		languageSelector: {
			title: "Sélectionnez votre langue",
		},
		ready: {
			title: "Vous êtes prêt !",
			subtitle: "Nous sommes heureux de vous avoir ici",
			finish: "Terminer",
		},
		clipboard: {
			success:
				"Copié dans le presse-papiers, collez-le maintenant dans votre navigateur !",
		},
		selectPath: {
			title: "Sélectionner le chemin d'installation",
			description:
				"Ce dossier contiendra tous vos scripts installés, dépendances et fichiers de projet. Choisissez un emplacement facilement accessible et disposant de suffisamment d'espace de stockage.",
			button: "Sélectionner un chemin",
			success: "Suivant",
			warning:
				"Ne sélectionnez pas le même dossier où Dione est installé. Cela peut entraîner des conflits et des erreurs lors des mises à jour.",
		},
	},

	// error handling
	error: {
		title: "Une erreur inattendue s'est produite",
		description:
			"Nous avons détecté une erreur inattendue dans l'application, nous sommes désolés pour le désagrément.",
		return: "Retour",
		report: {
			toTeam: "Signaler à l'équipe",
			sending: "Envoi du rapport...",
			success: "Rapport envoyé !",
			failed: "Échec de l'envoi du rapport",
		},
	},

	// account related
	account: {
		title: "Compte",
		logout: "Déconnexion",
		stats: {
			timeSpent: {
				title: "Temps passé",
				subtitle: "sur les 7 derniers jours",
			},
			sessions: {
				title: "Sessions",
				subtitle: "sur les 7 derniers jours",
			},
			shared: {
				title: "Partagé",
				subtitle: "sur les 7 derniers jours",
			},
			streak: {
				title: "Série",
				subtitle: "jours consécutifs",
				days: "jours",
			},
		},
	},

	// toast notifications
	toast: {
		close: "Fermer",
		install: {
			downloading: "Téléchargement de %s...",
			starting: "Démarrage de %s...",
			uninstalling: "Désinstallation de %s...",
			reconnecting: "Reconnexion à %s...",
			retrying: "Tentative d'installation de %s à nouveau...",
			success: {
				stopped: "%s arrêté avec succès.",
				uninstalled: "%s désinstallé avec succès.",
				logsCopied: "Journaux copiés avec succès dans le presse-papiers.",
				depsInstalled: "Dépendances installées avec succès.",
				shared: "Lien de téléchargement copié dans le presse-papiers !",
			},
			error: {
				download: "Erreur lors de l'initialisation du téléchargement : %s",
				start: "Erreur lors du démarrage de %s : %s",
				stop: "Erreur lors de l'arrêt de %s : %s",
				uninstall: "Erreur lors de la désinstallation de %s : %s",
				serverRunning: "Le serveur est déjà en cours d'exécution.",
				tooManyApps:
					"Ralentissez ! Vous avez déjà 6 applications en cours d'exécution en même temps.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Arrêt des applications...",
			description:
				"Dione se fermera automatiquement après avoir fermé toutes les applications ouvertes.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Explorez, Installez, Innovez — en 1 Clic.",
		activeApps: "Applications Actives",
		update: {
			title: "Mise à jour disponible",
			description:
				"Une nouvelle version de Dione est disponible, veuillez redémarrer l'application pour mettre à jour.",
			tooltip: "Nouvelle mise à jour disponible, veuillez redémarrer Dione pour mettre à jour.",
		},
		tooltips: {
			library: "Bibliothèque",
			settings: "Paramètres",
			account: "Compte",
			logout: "Déconnexion",
			login: "Connexion",
			capture: "Capture",
		},
	},

	// home page
	home: {
		featured: "En Vedette",
		explore: "Explorer",
	},

	// settings page
	settings: {
		applications: {
			title: "Applications",
			installationDirectory: {
				label: "Répertoire d'installation",
				description:
					"Choisissez l'emplacement où les nouvelles applications seront installées par défaut.",
			},
			binDirectory: {
				label: "Répertoire des binaires",
				description:
					"Choisissez l'emplacement où les binaires des applications seront stockés pour un accès facile.",
			},
			cleanUninstall: {
				label: "Désinstallation propre",
				description:
					"Supprimez toutes les dépendances associées lors de la désinstallation des applications.",
			},
			autoOpenAfterInstall: {
				label: "Ouvrir automatiquement après installation",
				description:
					"Ouvre automatiquement les applications pour la première fois après l'installation.",
			},
			deleteCache: {
				label: "Supprimer le cache",
				description: "Supprime toutes les données mises en cache des applications.",
				button: "Supprimer le cache",
				deleting: "Suppression...",
				deleted: "Supprimé",
				error: "Erreur",
			},
		},
		interface: {
			title: "Interface",
			displayLanguage: {
				label: "Langue d'affichage",
				description: "Choisissez votre langue d'interface préférée.",
			},
			helpTranslate: "🤔 Vous ne voyez pas votre langue ? Aidez-nous à en ajouter d'autres !",
			theme: {
				label: "Thème",
				description: "Choisissez un thème de couleur pour l'application.",
				themes: {
					default: "Rêve Pourpre",
					midnight: "Bleu Nuit",
					ocean: "Profondeurs Océaniques",
					forest: "Nuit Forestière",
					sunset: "Coucher de Soleil",
					royal: "Pourpre Royal",
				},
			},
			intenseBackgrounds: {
				label: "Couleurs d'arrière-plan intenses",
				description:
					"Utilisez des couleurs d'arrière-plan plus vives au lieu de tons subtils.",
			},
			compactView: {
				label: "Vue Compacte",
				description:
					"Utilisez une disposition plus condensée pour afficher plus de contenu à l'écran.",
			},
		},
		notifications: {
			title: "Notifications",
			systemNotifications: {
				label: "Notifications système",
				description: "Affiche des notifications de bureau pour les événements importants.",
			},
			installationAlerts: {
				label: "Alertes d'installation",
				description: "Soyez averti lorsque les installations d'applications sont terminées.",
			},
			discordRPC: {
				label: "Présence riche Discord",
				description: "Affiche votre activité actuelle dans votre statut Discord.",
			},
			successSound: {
				label: "Activer le son de succès",
				description:
					"Active le son qui joue lorsque les applications ont fini de s'installer.",
			},
		},
		privacy: {
			title: "Confidentialité",
			errorReporting: {
				label: "Rapport d'erreurs",
				description: "Aidez à améliorer Dione en envoyant des rapports d'erreurs anonymes.",
			},
		},
		other: {
			title: "Autre",
			disableAutoUpdate: {
				label: "Désactiver les mises à jour automatiques",
				description:
					"Désactive les mises à jour automatiques. Attention : votre application pourrait manquer des corrections importantes ou des correctifs de sécurité. Cette option n'est pas recommandée pour la plupart des utilisateurs.",
			},
			logsDirectory: {
				label: "Répertoire des journaux",
				description: "Emplacement où sont stockés les journaux de l'application.",
			},
			exportLogs: {
				label: "Exporter les journaux de débogage",
				description:
					"Exporte tous les journaux et informations système dans un fichier zip pour le débogage.",
				button: "Exporter les journaux",
			},
			submitFeedback: {
				label: "Soumettre un commentaire",
				description: "Signalez tout problème ou difficulté que vous rencontrez.",
				button: "Envoyer le rapport",
			},
			showOnboarding: {
				label: "Afficher l'intégration",
				description:
					"Réinitialise Dione à son état initial et réaffiche l'intégration pour une reconfiguration.",
				button: "Réinitialiser",
			},
			variables: {
				label: "Variables",
				description: "Gérer les variables de l'application et leurs valeurs.",
				button: "Ouvrir les variables",
			},
			checkUpdates: {
				label: "Vérifier les mises à jour",
				description:
					"Vérifie les mises à jour et vous informe lorsqu'une nouvelle version est disponible.",
				button: "Vérifier les mises à jour",
			},
		},
	},

	// report form
	report: {
		title: "Décrire le problème",
		description:
			"Veuillez fournir des détails sur ce qui s'est passé et ce que vous essayiez de faire.",
		placeholder:
			"Exemple : J'essayais d'installer une application lorsque cette erreur s'est produite...",
		systemInformationTitle: "Informations système",
		disclaimer:
			"Les informations système suivantes et un identifiant anonyme seront inclus dans votre rapport.",
		success: "Rapport envoyé avec succès !",
		error: "Échec de l'envoi du rapport. Veuillez réessayer.",
		send: "Envoyer le rapport",
		sending: "Envoi...",
		contribute: "Aidez-nous à rendre ce script compatible avec tous les appareils",
	},

	// quick launch component
	quickLaunch: {
		title: "Lancement rapide",
		addApp: "Ajouter une application",
		tooltips: {
			noMoreApps: "Aucune application disponible à ajouter",
		},
		selectApp: {
			title: "Sélectionner une application",
			description: "{count} applications sont disponibles. Vous pouvez en choisir jusqu'à {max}.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "Certaines dépendances sont manquantes !",
		installing: "Installation des dépendances...",
		install: "Installer",
		logs: {
			initializing: "Initialisation du téléchargement des dépendances...",
			loading: "Chargement...",
			connected: "Connecté au serveur",
			disconnected: "Déconnecté du serveur",
			error: {
				socket: "Erreur lors de la configuration de la socket",
				install: "❌ Erreur lors de l'installation des dépendances : {error}",
			},
			allInstalled: "Toutes les dépendances sont déjà installées.",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstall: {
			title: "Désinstallation",
			deps: "Désinstaller les dépendances",
			wait: "veuillez patienter...",
		},
		uninstalling: {
			title: "Désinstallation en cours",
			deps: "Désinstallation des dépendances",
			wait: "veuillez patienter...",
		},
		success: {
			title: "Désinstallé",
			subtitle: "avec succès",
			closing: "Fermeture de cette fenêtre dans",
			seconds: "secondes...",
		},
		error: {
			title: "Une inattendue",
			subtitle: "erreur",
			hasOccurred: "s'est produite",
			deps: "Dione n'a pas pu supprimer de dépendance, veuillez le faire manuellement.",
			general: "Veuillez réessayer plus tard ou consulter les journaux pour plus d'informations.",
		},
		loading: {
			title: "Chargement...",
			wait: "Veuillez patienter...",
		},
	},

	// logs component
	logs: {
		loading: "Chargement...",
		openPreview: "Ouvrir l'aperçu",
		copyLogs: "Copier les journaux",
		stop: "Arrêter",
		disclaimer:
			"Les journaux affichés proviennent de l'application elle-même. Si vous voyez une erreur, veuillez d'abord la signaler aux développeurs de l'application d'origine.",
		status: {
			success: "Succès",
			error: "Erreur",
			pending: "En attente",
		},
	},

	// loading states
	loading: {
		text: "Chargement...",
	},

	// iframe component
	iframe: {
		back: "Retour",
		openFolder: "Ouvrir le dossier",
		openInBrowser: "Ouvrir dans le navigateur",
		openNewWindow: "Ouvrir dans une nouvelle fenêtre",
		fullscreen: "Plein écran",
		stop: "Arrêter",
		reload: "Recharger",
		logs: "Journaux",
	},

	// actions component
	actions: {
		reconnect: "Reconnecter",
		start: "Démarrer",
		uninstall: "Désinstaller",
		install: "Installer",
		publishedBy: "Publié par",
		installed: "Installé",
		notInstalled: "Non installé",
	},

	// promo component
	promo: {
		title: "Envie d'être présenté ici ?",
		description: "Présentez votre outil à notre communauté",
		button: "Être présenté",
	},

	// installed component
	installed: {
		title: "Votre bibliothèque",
		empty: {
			title: "Vous n'avez aucune application installée",
			action: "Installez-en une maintenant",
		},
	},

	// local component
	local: {
		title: "Scripts locaux",
		upload: "Télécharger le script",
		noScripts: "Aucun script trouvé",
		deleting: "Suppression du script, veuillez patienter...",
		uploadModal: {
			title: "Télécharger un script",
			selectFile: "Cliquez pour sélectionner un fichier",
			selectedFile: "Fichier sélectionné",
			scriptName: "Nom du script",
			scriptDescription: "Description du script (facultatif)",
			uploadFile: "Télécharger le fichier",
			uploading: "Téléchargement...",
			errors: {
				uploadFailed: "Échec du téléchargement du script. Veuillez réessayer.",
				uploadError: "Une erreur s'est produite lors du téléchargement du script.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "Aucun script trouvé",
		loadingMore: "Chargement de plus...",
		reachedEnd: "Vous avez atteint la fin.",
		notEnoughApps: "Si vous pensez qu'il n'y a pas assez d'applications,",
		helpAddMore: "aidez-nous à en ajouter plus",
		errors: {
			notArray: "Les données récupérées ne sont pas un tableau",
			fetchFailed: "Échec de la récupération des scripts",
			notSupported: "Malheureusement, %s n'est pas pris en charge sur votre %s.",
			notSupportedTitle: "Votre appareil peut être incompatible.",
		},
	},

	// search component
	search: {
		placeholder: "Rechercher des scripts...",
		filters: {
			audio: "Audio",
			image: "Image",
			video: "Vidéo",
			chat: "Chat",
		},
	},

	// network share modal
	networkShare: {
		title: "Partager",
		modes: {
			local: "Local",
			public: "Public",
			connecting: "Connexion...",
		},
		warning: {
			title: "Accès Public",
			description:
				"Crée une URL publique accessible de n'importe où. Partagez uniquement avec des personnes de confiance.",
		},
		local: {
			shareUrl: "URL de partage",
			urlDescription: "Partagez cette URL avec les appareils de votre réseau local",
			localNetwork: "Réseau Local :",
			description: "Cette URL fonctionne sur les appareils connectés au même réseau.",
		},
		public: {
			shareUrl: "URL Publique",
			urlDescription: "Partagez cette URL avec n'importe qui, n'importe où dans le monde",
			passwordTitle: "Mot de passe unique",
			visitorMessage:
				"Les visiteurs devront peut-être saisir ceci une fois par appareil pour accéder au tunnel.",
			stopSharing: "Arrêter le partage",
		},
		errors: {
			noAddress: "Impossible d'obtenir l'adresse réseau. Veuillez vérifier votre connexion.",
			loadFailed: "Échec du chargement des informations réseau.",
			noUrl: "Aucune URL disponible à copier.",
			copyFailed: "Échec de la copie dans le presse-papiers.",
			tunnelFailed: "Échec du démarrage du tunnel",
		},
	},

	// login features modal
	loginFeatures: {
		title: "Il vous manque des fonctionnalités",
		description: "Connectez-vous à Dione pour ne pas manquer ces fonctionnalités.",
		login: "Se connecter",
		skip: "Ignorer",
		features: {
			customReports: {
				title: "Envoyer des rapports personnalisés",
				description:
					"Envoyez des rapports personnalisés depuis l'application, ce qui accélère le support en cas d'erreurs.",
			},
			createProfile: {
				title: "Créer un profil",
				description:
					"Créez un profil pour que la communauté Dione vous connaisse.",
			},
			syncData: {
				title: "Synchroniser vos données",
				description: "Synchronisez vos données sur tous vos appareils.",
			},
			earlyBirds: {
				title: "Obtenir les mises à jour exclusives",
				description:
					"Obtenez des mises à jour exclusives et de nouvelles fonctionnalités avant tout le monde.",
			},
			giveOutLikes: {
				title: "Laisser des likes",
				description:
					"Laissez des likes aux applications que vous préférez, pour que plus de gens les utilisent !",
			},
			publishScripts: {
				title: "Publier des scripts",
				description: "Publiez vos scripts et partagez-les avec le monde.",
			},
			achieveGoals: {
				title: "Atteindre des objectifs",
				description:
					"Atteignez des objectifs comme utiliser Dione pendant 7 jours pour obtenir des cadeaux",
			},
			getNewswire: {
				title: "Recevoir la newswire",
				description:
					"Recevez des mises à jour par e-mail pour ne pas manquer les nouvelles fonctionnalités.",
			},
		},
	},

	// editor component
	editor: {
		selectFile: "Sélectionnez un fichier pour commencer à éditer",
		previewNotAvailable: "Aperçu non disponible pour ce fichier.",
		mediaNotSupported: "L'aperçu pour ce type de média n'est pas encore pris en charge.",
		previewOnly: "Aperçu uniquement",
		unsaved: "Non sauvegardé",
		retry: "Réessayer",
		editorLabel: "Éditeur",
	},

	// sidebar links
	links: {
		discord: "Discord",
		github: "GitHub",
		dione: "Dione",
		builtWith: "construit avec",
	},

	// update notifications
	updates: {
		later: "Plus tard",
		install: "Installer",
	},

	// iframe actions
	iframeActions: {
		shareOnNetwork: "Partager sur le réseau",
	},

	// version info
	versions: {
		node: "Node",
		electron: "Electron",
		chromium: "Chromium",
	},

	// connection messages
	connection: {
		retryLater: "Nous avons des problèmes de connexion, veuillez réessayer plus tard.",
	},

	// variables modal
	variables: {
		title: "Variables d'environnement",
		addKey: "Ajouter une clé",
		searchPlaceholder: "Rechercher des variables...",
		keyPlaceholder: "Clé (ex: MON_VAR)",
		valuePlaceholder: "Valeur",
		copyAll: "Tout copier dans le presse-papiers",
		confirm: "Confirmer",
		copyPath: "Copier le chemin",
		copyFullValue: "Copier la valeur complète",
		deleteKey: "Supprimer la clé",
	},

	// custom commands modal
	customCommands: {
		title: "Lancer avec des paramètres personnalisés",
		launch: "Lancer",
	},

	// context menu
	contextMenu: {
		copyPath: "Copier le chemin",
		open: "Ouvrir",
		reload: "Recharger",
		rename: "Renommer",
		delete: "Supprimer",
	},

	// file tree
	fileTree: {
		noFiles: "Aucun fichier trouvé dans cet espace de travail.",
		media: "Média",
		binary: "Binaire",
	},

	// entry name dialog
	entryDialog: {
		name: "Nom",
		createFile: "Créer un fichier",
		createFolder: "Créer un dossier",
		renameFile: "Renommer le fichier",
		renameFolder: "Renommer le dossier",
		createInRoot: "Ceci sera créé à la racine de l'espace de travail.",
		createInside: "Ceci sera créé à l'intérieur de {path}.",
		currentLocation: "Emplacement actuel : {path}.",
		currentLocationRoot: "Emplacement actuel : racine de l'espace de travail.",
		rename: "Renommer",
		placeholderFile: "exemple.ts",
		placeholderFolder: "Nouveau Dossier",
	},

	// workspace editor
	workspaceEditor: {
		newFile: "Nouveau fichier",
		newFolder: "Nouveau dossier",
		retry: "Réessayer",
		back: "Retour",
		save: "Sauvegarder",
		openInExplorer: "Ouvrir dans l'explorateur",
		resolvingPath: "Résolution du chemin...",
		workspace: "Espace de travail",
	},

	// header bar
	headerBar: {
		back: "Retour",
		openInExplorer: "Ouvrir dans l'explorateur",
		save: "Sauvegarder",
	},

	// settings page footer
	settingsFooter: {
		builtWithLove: "construit avec ♥",
		getDioneWebsite: "getdione.app",
		port: "Port",
		node: "Node:",
		electron: "Electron:",
		chromium: "Chrome:",
	},

	// notifications
	notifications: {
		enabled: {
			title: "Notifications activées",
			description: "Vous recevrez des notifications pour les événements importants.",
		},
		learnMore: "En savoir plus",
	},

	// language selector
	languageSelector: {
		next: "Suivant",
	},

	// onboarding - select path
	selectPath: {
		chooseLocation: "Choisir l'emplacement d'installation",
		changePath: "Changer de chemin",
	},

	// browser compatibility
	browserCompatibility: {
		audioNotSupported: "Votre navigateur ne prend pas en charge l'élément audio.",
		videoNotSupported: "Votre navigateur ne prend pas en charge l'élément vidéo.",
	},

	// library card
	library: {
		official: "Officiel",
	},

	// sidebar updates
	sidebarUpdate: {
		newUpdateAvailable: "Nouvelle mise à jour disponible",
		whatsNew: "Voici les nouveautés",
	},

	// iframe component labels
	iframeLabels: {
		back: "Retour",
		logs: "Journaux",
		disk: "Disque",
		editor: "Éditeur",
	},

	// progress component
	progress: {
		running: "En cours...",
	},

	// toast messages
	toastMessages: {
		copiedToClipboard: "Copié dans le presse-papiers !",
		keyAndValueRequired: "La clé et la valeur sont requises",
		variableAdded: "Variable ajoutée",
		failedToAddVariable: "Échec de l'ajout de la variable",
		variableRemoved: "Variable supprimée",
		failedToRemoveVariable: "Échec de la suppression de la variable",
		valueRemoved: "Valeur supprimée",
		failedToRemoveValue: "Échec de la suppression de la valeur",
		pathCopiedToClipboard: "Chemin copié dans le presse-papiers",
		failedToCopyPath: "Échec de la copie du chemin",
		unableToOpenLocation: "Impossible d'ouvrir l'emplacement",
		cannotDeleteWorkspaceRoot: "Impossible de supprimer la racine de l'espace de travail",
		deleted: "Supprimé",
		failedToDeleteEntry: "Échec de la suppression de l'entrée",
		workspaceNotAvailable: "L'espace de travail n'est pas disponible",
		selectFileOrFolderToRename: "Sélectionnez un fichier ou un dossier à renommer",
		cannotRenameWorkspaceRoot: "Impossible de renommer la racine de l'espace de travail",
		entryRenamed: "Entrée renommée",
		fileSavedSuccessfully: "Fichier enregistré avec succès",
		failedToSaveFile: "Échec de l'enregistrement du fichier",
		mediaFilesCannotBeOpened: "Les fichiers multimédias ne peuvent pas être ouverts dans l'éditeur.",
		binaryFilesCannotBeOpened:
			"Les fichiers binaires et exécutables ne peuvent pas être ouverts dans l'éditeur.",
		thisFileTypeCannotBeEdited: "Ce type de fichier ne peut pas encore être édité.",
	},

	// error messages
	errorMessages: {
		workspaceNotFound: "Espace de travail introuvable",
		failedToLoadWorkspace: "Échec du chargement de l'espace de travail",
		failedToLoadDirectory: "Échec du chargement du répertoire",
		unableToOpenWorkspace: "Impossible d'ouvrir l'espace de travail",
		failedToLoadFile: "Échec du chargement du fichier",
		nameCannotBeEmpty: "Le nom ne peut pas être vide",
		nameContainsInvalidCharacters: "Le nom contient des caractères invalides",
		failedToCreateEntry: "Échec de la création de l'entrée",
		failedToRenameEntry: "Échec du renommage de l'entrée",
	},

	// file operations
	fileOperations: {
		fileCreated: "Fichier créé",
		folderCreated: "Dossier créé",
		untitledFile: "sans_titre.txt",
		newFolder: "Nouveau Dossier",
	},

	// confirmation dialogs
	confirmDialogs: {
		removeValue: "Êtes-vous sûr de vouloir supprimer",
		thisValue: "cette valeur",
		keyAndAllValues: "la clé et toutes ses valeurs",
		from: "de",
	},

	// network share modal
	networkShareErrors: {
		failedToLoadNetworkInfo: "Échec du chargement des informations réseau.",
		failedToStartTunnel: "Échec du démarrage du tunnel",
		failedToCopyToClipboard: "Échec de la copie dans le presse-papiers.",
	},

	// feed component
	feedErrors: {
		invalidDataFormat: "Format de données invalide depuis l'API",
		failedToFetchScripts: "Échec de la récupération des scripts",
	},

	// upload script modal
	uploadScript: {
		fileLoadedLocally: "Fichier chargé localement",
	},

	// running apps
	runningApps: {
		running: "En cours",
		thereIsAnAppRunningInBackground:
			"Une application s'exécute en arrière-plan.",
		failedToReloadQuickLaunch: "Échec du rechargement des applications de lancement rapide",
		failedToFetchInstalledApps: "Échec de la récupération des applications installées",
	},
} as const;