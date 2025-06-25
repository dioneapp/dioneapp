export const fr = {
	// common actions and states
	common: {
		cancel: "Annuler",
		loading: "Chargement...",
		error: "Erreur",
		success: "Succès",
		pending: "En attente",
		back: "Retour",
	},

	// authentication and access related
	noAccess: {
		title: "Rejoignez la liste blanche Dione",
		description:
			"Dione est en construction et seul un nombre limité d'utilisateurs peuvent y accéder, rejoignez notre liste blanche dès maintenant pour accéder aux futures versions de notre application.",
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
		},
		loggingIn: {
			title: "Connexion en cours...",
			authError: "Impossible de s'authentifier ?",
			goBack: "Retourner",
		},
		ready: {
			title: "Vous êtes prêt !",
			subtitle: "Nous sommes ravis de vous avoir ici",
			finish: "Terminer",
		},
		clipboard: {
			success:
				"Copié correctement dans le presse-papiers, collez-le maintenant dans votre navigateur！",
		},
	},

	// error handling
	error: {
		title: "Une erreur inattendue est survenue",
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
				subtitle: "au cours des 7 derniers jours",
			},
			sessions: {
				title: "Sessions",
				subtitle: "au cours des 7 derniers jours",
			},
			shared: {
				title: "Partagés",
				subtitle: "au cours des 7 derniers jours",
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
			reconnecting: "Reconnexion de %s...",
			retrying: "Tentative de réinstallation de %s...",
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
				"Dione se fermera automatiquement après la fermeture de toutes les applications ouvertes.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Explorez, installez, innovez — en 1 clic.",
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
		},
	},

	// home page
	home: {
		featured: "En vedette",
		explore: "Explorer",
	},

	// settings page
	settings: {
		applications: {
			title: "Applications",
			installationDirectory: {
				label: "Répertoire d'installation",
				description:
					"Choisissez où les nouvelles applications seront installées par défaut",
			},
			cleanUninstall: {
				label: "Désinstallation propre",
				description:
					"Supprimer toutes les dépendances liées lors de la désinstallation des applications",
			},
		},
		interface: {
			title: "Interface",
			displayLanguage: {
				label: "Langue d'affichage",
				description: "Choisissez votre langue d'interface préférée",
			},
			helpTranslate: "🤔 Votre langue n'apparaît pas ? Aidez-nous à en ajouter plus !",
			compactView: {
				label: "Vue compacte",
				description:
					"Utiliser une mise en page plus condensée pour afficher plus de contenu à l'écran",
			},
		},
		notifications: {
			title: "Notifications",
			systemNotifications: {
				label: "Notifications système",
				description: "Afficher les notifications de bureau pour les événements importants",
			},
			installationAlerts: {
				label: "Alertes d'installation",
				description: "Recevoir une notification lorsque les installations d'applications sont terminées",
			},
		},
		privacy: {
			title: "Confidentialité",
			errorReporting: {
				label: "Rapports d'erreurs",
				description: "Aidez à améliorer Dione en envoyant des rapports d'erreurs anonymes",
			},
		},
		other: {
			title: "Autre",
			logsDirectory: {
				label: "Répertoire des journaux",
				description: "Emplacement où les journaux d'application sont stockés",
			},
			submitFeedback: {
				label: "Envoyer des commentaires",
				description: "Signalez tout problème ou difficulté que vous rencontrez",
				button: "Envoyer le rapport",
			},
			showOnboarding: {
				label: "Afficher l'intégration",
				description:
					"Réinitialiser Dione à son état initial et afficher à nouveau l'intégration pour la reconfiguration",
				button: "Réinitialiser",
			},
		},
	},

	// report form
	report: {
		title: "Décrire le problème",
		description:
			"Veuillez fournir des détails sur ce qui s'est passé et ce que vous essayiez de faire.",
		placeholder:
			"Exemple : J'essayais d'installer une application lorsque cette erreur est survenue...",
		systemInformationTitle: "Informations système",
		disclaimer:
			"Les informations système suivantes et un identifiant anonyme seront inclus dans votre rapport.",
		success: "Rapport envoyé avec succès !",
		error: "Échec de l'envoi du rapport. Veuillez réessayer.",
		send: "Envoyer le rapport",
		sending: "Envoi en cours...",
	},

	// quick launch component
	quickLaunch: {
		title: "Lancement rapide",
		addApp: "Ajouter une application",
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
				socket: "Erreur lors de la configuration du socket",
				install: "❌ Erreur lors de l'installation des dépendances : {error}",
			},
			allInstalled: "Toutes les dépendances sont déjà installées.",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstalling: {
			title: "Désinstallation en cours",
			deps: "Désinstallation des dépendances",
			wait: "Veuillez patienter...",
		},
		success: {
			title: "Désinstallé",
			subtitle: "avec succès",
			closing: "Fermeture de cette modale dans",
			seconds: "secondes...",
		},
		error: {
			title: "Une erreur inattendue",
			subtitle: "erreur",
			hasOccurred: "est survenue",
			deps: "Dione n'a pas pu supprimer les dépendances, veuillez le faire manuellement.",
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
		disclaimer:
			"Les journaux affichés proviennent de l'application elle-même. Si vous voyez une erreur, veuillez la signaler d'abord aux développeurs de l'application d'origine.",
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
		fullscreen: "Plein écran",
		stop: "Arrêter",
		reload: "Recharger",
		logs: "Journaux",
	},

	// actions component
	actions: {
		reconnect: "Reconnexion",
		start: "Démarrer",
		uninstall: "Désinstaller",
		install: "Installer",
		publishedBy: "Publié par",
	},

	// promo component
	promo: {
		title: "Vous voulez être présenté ici ?",
		description: "Présentez votre outil à notre communauté",
		button: "Obtenir une présentation",
	},

	// installed component
	installed: {
		title: "Votre bibliothèque",
		empty: {
			title: "Vous n'avez aucune application installée",
			action: "Installer un maintenant",
		},
	},

	// feed component
	feed: {
		noScripts: "Aucun script trouvé",
		errors: {
			notArray: "Les données récupérées ne sont pas un tableau",
			fetchFailed: "Échec de la récupération des scripts",
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
} as const;