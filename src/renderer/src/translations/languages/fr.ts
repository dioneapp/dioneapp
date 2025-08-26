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
		title: "Rejoignez la liste blanche Dione",
		description:
			"Dione est en cours de développement et seul un nombre limité d'utilisateurs peut y accéder. Rejoignez notre liste blanche dès maintenant pour accéder aux futures versions de notre application.",
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
			title: "Connexion...",
			authError: "Impossible de s'authentifier ?",
			goBack: "Retour",
		},
		languageSelector: {
			title: "Sélectionnez votre langue",
		},
		ready: {
			title: "Vous êtes prêt !",
			subtitle: "Nous sommes ravis de vous avoir ici",
			finish: "Terminer",
		},
		clipboard: {
			success:
				"Copié dans le presse-papiers correctement, collez-le maintenant dans votre navigateur !",
		},
		selectPath: {
			title: "Sélectionnez le chemin d'installation",
			button: "Sélectionner un chemin",
			success: "Suivant",
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
				subtitle: "les 7 derniers jours",
			},
			sessions: {
				title: "Sessions",
				subtitle: "les 7 derniers jours",
			},
			shared: {
				title: "Partagés",
				subtitle: "les 7 derniers jours",
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
			starting: "Lancement de %s...",
			uninstalling: "Désinstallation de %s...",
			reconnecting: "Reconnexion à %s...",
			retrying: "Tentative de réinstallation de %s...",
			success: {
				stopped: "%s arrêté avec succès.",
				uninstalled: "%s désinstallé avec succès.",
				logsCopied: "Logs copiés avec succès dans le presse-papiers.",
				depsInstalled: "Dépendances installées avec succès.",
				shared: "Lien de téléchargement copié dans le presse-papiers !",
			},
			error: {
				download: "Erreur lors de l'initiation du téléchargement : %s",
				start: "Erreur lors du lancement de %s : %s",
				stop: "Erreur lors de l'arrêt de %s : %s",
				uninstall: "Erreur lors de la désinstallation de %s : %s",
				serverRunning: "Le serveur est déjà en cours d'exécution.",
				tooManyApps:
					"Ralentissez ! Vous avez déjà 6 applications en cours d'exécution simultanément.",
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
		tagline: "Explorez, Installez, Innovez — en 1 Clic.",
		activeApps: "Applications actives",
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
			binDirectory: {
				label: "Répertoire des binaires",
				description:
					"Choisissez où les binaires de l'application seront stockés pour un accès facile",
			},
			cleanUninstall: {
				label: "Désinstallation propre",
				description:
					"Supprimez toutes les dépendances associées lors de la désinstallation des applications",
			},
			autoOpenAfterInstall: {
				label: "Ouvrir automatiquement après l'installation",
				description:
					"Ouvre automatiquement les applications pour la première fois après l'installation",
			},
			deleteCache: {
				label: "Supprimer le cache",
				description: "Supprime toutes les données mises en cache des applications",
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
				description: "Choisissez votre langue d'interface préférée",
			},
			helpTranslate: "🤔 Vous ne voyez pas votre langue ? Aidez-nous à en ajouter plus !",
			compactView: {
				label: "Vue compacte",
				description:
					"Utilisez une mise en page plus condensée pour afficher plus de contenu à l'écran",
			},
		},
		notifications: {
			title: "Notifications",
			systemNotifications: {
				label: "Notifications système",
				description: "Affiche des notifications de bureau pour les événements importants",
			},
			installationAlerts: {
				label: "Alertes d'installation",
				description: "Soyez informé lorsque les installations d'applications sont terminées",
			},
			discordRPC: {
				label: "Présence riche Discord",
				description: "Affiche votre activité actuelle dans votre statut Discord",
			},
		},
		privacy: {
			title: "Confidentialité",
			errorReporting: {
				label: "Rapport d'erreurs",
				description: "Aidez à améliorer Dione en envoyant des rapports d'erreurs anonymes",
			},
		},
		other: {
			title: "Autre",
			disableAutoUpdate: {
				label: "Désactiver les mises à jour automatiques",
				description:
					"Désactive les mises à jour automatiques. Attention : votre application peut manquer des corrections importantes ou des correctifs de sécurité. Cette option n'est pas recommandée pour la plupart des utilisateurs.",
			},
			logsDirectory: {
				label: "Répertoire des logs",
				description: "Emplacement où sont stockés les logs de l'application",
			},
			submitFeedback: {
				label: "Soumettre des commentaires",
				description: "Signalez tout problème ou difficulté que vous rencontrez",
				button: "Envoyer le rapport",
			},
			showOnboarding: {
				label: "Afficher l'accueil",
				description:
					"Réinitialise Dione à son état initial et affiche à nouveau l'accueil pour une reconfiguration",
				button: "Réinitialiser",
			},
			variables: {
				label: "Variables",
				description: "Gérer les variables de l'application et leurs valeurs",
				button: "Ouvrir les Variables",
			},
		},
	},

	// report form
	report: {
		title: "Décrivez le problème",
		description:
			"Veuillez fournir des détails sur ce qui s'est passé et ce que vous essayiez de faire.",
		placeholder:
			"Exemple : J'essayais d'installer une application quand cette erreur s'est produite...",
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
			title: "Sélectionnez une application",
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
		uninstalling: {
			title: "Désinstallation",
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
			title: "Une erreur",
			subtitle: "inattendue",
			hasOccurred: "s'est produite",
			deps: "Dione n'a pas pu supprimer de dépendance, veuillez le faire manuellement.",
			general: "Veuillez réessayer plus tard ou consulter les logs pour plus d'informations.",
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
			"Les logs affichés proviennent de l'application elle-même. Si vous voyez une erreur, veuillez d'abord la signaler aux développeurs de l'application d'origine.",
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
		openNewWindow: "Ouvrir une nouvelle fenêtre",
		fullscreen: "Plein écran",
		stop: "Arrêter",
		reload: "Recharger",
		logs: "Logs",
	},

	// actions component
	actions: {
		reconnect: "Reconnecter",
		start: "Démarrer",
		uninstall: "Désinstaller",
		install: "Installer",
		publishedBy: "Publié par",
	},

	// promo component
	promo: {
		title: "Vous voulez être présenté ici ?",
		description: "Présentez votre outil à notre communauté",
		button: "Être mis en avant",
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
		upload: "Télécharger un script",
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
		errors: {
			notArray: "Les données récupérées ne sont pas un tableau",
			fetchFailed: "Échec de la récupération des scripts",
			notSupported: "Malheureusement %s n'est pas pris en charge sur votre %s.",
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
} as const;