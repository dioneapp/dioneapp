export const es = {
	// common actions and states
	common: {
		cancel: "Cancelar",
		loading: "Cargando...",
		error: "Error",
		success: "Éxito",
		pending: "Pendiente",
		back: "Atrás",
		unselectAll: "Deseleccionar todo",
		selectAll: "Seleccionar todo",
	},

	// authentication and access related
	noAccess: {
		title: "Únete a la lista blanca de Dione",
		description:
			"Dione está en construcción y solo una cantidad limitada de usuarios puede acceder. Únete a nuestra lista blanca ahora para obtener acceso a futuras versiones de nuestra aplicación.",
		join: "Unirse",
		logout: "Cerrar sesión",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Bienvenido a",
			subtitle:
				"Gracias por acompañarnos desde el principio en este viaje. Inicia sesión en tu cuenta para comenzar.",
			login: "Iniciar sesión",
			copyLink: "Copiar enlace",
			skipLogin: "Continuar sin iniciar sesión",
		},
		loggingIn: {
			title: "Iniciando sesión...",
			authError: "¿No se pudo autenticar?",
			goBack: "Volver",
		},
		languageSelector: {
			title: "Selecciona tu idioma",
		},
		ready: {
			title: "¡Estás listo!",
			subtitle: "Nos alegra tenerte aquí",
			finish: "Terminar",
		},
		clipboard: {
			success:
				"¡Copiado correctamente al portapapeles, ahora pégalo en tu navegador!",
		},
		selectPath: {
			title: "Selecciona la ruta de instalación",
			description:
				"Esta carpeta contendrá todos tus scripts instalados, dependencias y archivos de proyecto. Elige una ubicación de fácil acceso y con suficiente espacio de almacenamiento.",
			button: "Seleccionar una ruta",
			success: "Siguiente",
			warning:
				"No selecciones la misma carpeta donde está instalado Dione. Esto puede causar conflictos y errores durante las actualizaciones.",
		},
	},

	// error handling
	error: {
		title: "Ocurrió un error inesperado",
		description:
			"Hemos detectado un error inesperado en la aplicación, lamentamos las molestias.",
		return: "Regresar",
		report: {
			toTeam: "Informar al equipo",
			report: "Informe",
			submit: "Enviar informe",
			sending: "Enviando informe...",
			success: "¡Informe enviado!",
			failed: "No se pudo enviar el informe",
			badContent: "Informar contenido inapropiado",
			badContentDescription: "A continuación, agregue información sobre su informe a",
		},
	},

	// account related
	account: {
		title: "Cuenta",
		logout: "Cerrar sesión",
		stats: {
			timeSpent: {
				title: "Tiempo invertido",
				subtitle: "en los últimos 7 días",
			},
			sessions: {
				title: "Sesiones",
				subtitle: "en los últimos 7 días",
			},
			shared: {
				title: "Compartido",
				subtitle: "en los últimos 7 días",
			},
			streak: {
				title: "Racha",
				subtitle: "días consecutivos",
				days: "días",
			},
		},
	},

	// toast notifications
	toast: {
		close: "Cerrar",
		install: {
			downloading: "Descargando %s...",
			starting: "Iniciando %s...",
			uninstalling: "Desinstalando %s...",
			reconnecting: "Reconectando %s...",
			retrying: "Intentando instalar %s de nuevo...",
			success: {
				stopped: "%s detenido con éxito.",
				uninstalled: "%s desinstalado con éxito.",
				logsCopied: "Registros copiados correctamente al portapapeles.",
				depsInstalled: "Dependencias instaladas con éxito.",
				shared: "¡Enlace de descarga copiado al portapapeles!",
			},
			error: {
				download: "Error al iniciar la descarga: %s",
				start: "Error al iniciar %s: %s",
				stop: "Error al detener %s: %s",
				uninstall: "Error al desinstalar %s: %s",
				serverRunning: "El servidor ya se está ejecutando.",
				tooManyApps:
					"¡Ralentízate! Ya tienes 6 aplicaciones ejecutándose al mismo tiempo.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Deteniendo aplicaciones...",
			description:
				"Dione se cerrará automáticamente después de cerrar todas las aplicaciones abiertas.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Explora, Instala, Innova — en 1 Clic.",
		activeApps: "Aplicaciones Activas",
		update: {
			title: "Actualización Disponible",
			description:
				"Hay una nueva versión de Dione disponible, reinicia la aplicación para actualizar.",
			tooltip:
				"Nueva actualización disponible, reinicia Dione para actualizar.",
		},
		tooltips: {
			library: "Biblioteca",
			settings: "Configuración",
			account: "Cuenta",
			logout: "Cerrar sesión",
			login: "Iniciar sesión",
			capture: "Capturar",
		},
	},

	// home page
	home: {
		featured: "Destacados",
		explore: "Explorar",
	},

	// settings page
	settings: {
		applications: {
			title: "Aplicaciones",
			installationDirectory: {
				label: "Directorio de Instalación",
				description:
					"Elige dónde se instalarán las nuevas aplicaciones por defecto.",
			},
			binDirectory: {
				label: "Directorio Bin",
				description:
					"Elige dónde se almacenarán los binarios de la aplicación para un fácil acceso.",
			},
			cleanUninstall: {
				label: "Desinstalación Limpia",
				description:
					"Elimina todas las dependencias relacionadas al desinstalar aplicaciones.",
			},
			autoOpenAfterInstall: {
				label: "Abrir Automáticamente Después de Instalar",
				description:
					"Abre automáticamente las aplicaciones por primera vez después de la instalación.",
			},
			deleteCache: {
				label: "Eliminar Caché",
				description: "Elimina todos los datos en caché de las aplicaciones.",
				button: "Eliminar Caché",
				deleting: "Eliminando...",
				deleted: "Eliminado",
				error: "Error",
			},
		},
		interface: {
			title: "Interfaz",
			displayLanguage: {
				label: "Idioma de Pantalla",
				description: "Elige tu idioma de interfaz preferido.",
			},
			helpTranslate: "🤔 ¿No ves tu idioma? ¡Ayúdanos a añadir más!",
			theme: {
				label: "Tema",
				description: "Elige un tema de color para la aplicación.",
				themes: {
					default: "Sueño Morado",
					midnight: "Azul Medianoche",
					ocean: "Profundidades Oceánicas",
					forest: "Noche Forestal",
					sunset: "Brillo del Atardecer",
					royal: "Morado Real",
				},
			},
			intenseBackgrounds: {
				label: "Colores de Fondo Intensos",
				description:
					"Utiliza colores de fondo más vibrantes en lugar de tonos sutiles.",
			},
			compactView: {
				label: "Vista Compacta",
				description:
					"Utiliza un diseño más condensado para mostrar más contenido en pantalla.",
			},
		},
		notifications: {
			title: "Notificaciones",
			systemNotifications: {
				label: "Notificaciones del Sistema",
				description:
					"Muestra notificaciones de escritorio para eventos importantes.",
			},
			installationAlerts: {
				label: "Alertas de Instalación",
				description:
					"Recibe notificaciones cuando las instalaciones de aplicaciones se completen.",
			},
			discordRPC: {
				label: "Presencia Rica de Discord",
				description: "Muestra tu actividad actual en el estado de Discord.",
			},
			successSound: {
				label: "Activar Sonido de Éxito",
				description:
					"Activa el sonido que suena cuando las aplicaciones terminan de instalarse.",
			},
		},
		privacy: {
			title: "Privacidad",
			errorReporting: {
				label: "Reporte de Errores",
				description:
					"Ayuda a mejorar Dione enviando informes de errores anónimos.",
			},
		},
		other: {
			title: "Otro",
			disableAutoUpdate: {
				label: "Desactivar actualizaciones automáticas",
				description:
					"Desactiva las actualizaciones automáticas. Precaución: tu aplicación puede perder correcciones importantes o parches de seguridad. Esta opción no es recomendada para la mayoría de los usuarios.",
			},
			logsDirectory: {
				label: "Directorio de Registros",
				description:
					"Ubicación donde se almacenan los registros de la aplicación.",
			},
			exportLogs: {
				label: "Exportar Registros de Depuración",
				description:
					"Exporta todos los registros e información del sistema en un archivo zip para depuración.",
				button: "Exportar Registros",
			},
			submitFeedback: {
				label: "Enviar Comentarios",
				description:
					"Reporta cualquier problema o inconveniente que encuentres.",
				button: "Enviar Informe",
			},
			showOnboarding: {
				label: "Mostrar Onboarding",
				description:
					"Restaura Dione a su estado inicial y vuelve a mostrar el onboarding para reconfigurarlo.",
				button: "Restaurar",
			},
			variables: {
				label: "Variables",
				description: "Gestiona las variables de la aplicación y sus valores.",
				button: "Abrir Variables",
			},
			checkUpdates: {
				label: "Buscar actualizaciones",
				description:
					"Busca actualizaciones y te notificará cuando haya una nueva versión disponible.",
				button: "Buscar actualizaciones",
			},
		},
	},

	// report form
	report: {
		title: "Describe el Problema",
		description:
			"Por favor, proporciona detalles sobre lo que sucedió y lo que estabas intentando hacer.",
		placeholder:
			"Ejemplo: Estaba intentando instalar una aplicación cuando ocurrió este error...",
		systemInformationTitle: "Información del Sistema",
		disclaimer:
			"La siguiente información del sistema y un ID anónimo se incluirán con tu informe.",
		success: "¡Informe enviado con éxito!",
		error: "Error al enviar el informe. Por favor, inténtalo de nuevo.",
		send: "Enviar Informe",
		sending: "Enviando...",
		contribute:
			"Ayúdanos a hacer que este script sea compatible con todos los dispositivos",
	},

	// quick launch component
	quickLaunch: {
		title: "Lanzamiento Rápido",
		addApp: "Añadir App",
		tooltips: {
			noMoreApps: "No hay aplicaciones disponibles para añadir",
		},
		selectApp: {
			title: "Selecciona una App",
			description:
				"{count} aplicaciones están disponibles. Puedes elegir hasta {max}.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "¡Faltan algunas dependencias!",
		installing: "Instalando dependencias...",
		install: "Instalar",
		logs: {
			initializing: "Inicializando descarga de dependencias...",
			loading: "Cargando...",
			connected: "Conectado al servidor",
			disconnected: "Desconectado del servidor",
			error: {
				socket: "Error al configurar el socket",
				install: "❌ Error al instalar dependencias: {error}",
			},
			allInstalled: "Todas las dependencias ya están instaladas.",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstall: {
			title: "Desinstalar",
			deps: "Desinstalar dependencias",
			wait: "por favor espera...",
		},
		uninstalling: {
			title: "Desinstalando",
			deps: "Desinstalando dependencias",
			wait: "por favor espera...",
		},
		success: {
			title: "Desinstalado",
			subtitle: "con éxito",
			closing: "Cerrando este modal en",
			seconds: "segundos...",
		},
		error: {
			title: "Un inesperado",
			subtitle: "error",
			hasOccurred: "ha ocurrido",
			deps: "Dione no ha podido eliminar ninguna dependencia, por favor hazlo manualmente.",
			general:
				"Por favor, inténtalo de nuevo más tarde o consulta los registros para obtener más información.",
		},
		loading: {
			title: "Cargando...",
			wait: "Por favor espera...",
		},
	},

	// logs component
	logs: {
		loading: "Cargando...",
		openPreview: "Abrir Vista Previa",
		copyLogs: "Copiar registros",
		stop: "Detener",
		disclaimer:
			"Los registros que se muestran son de la propia aplicación. Si ves un error, por favor repórtalo primero a los desarrolladores de la aplicación original.",
		status: {
			success: "Éxito",
			error: "Error",
			pending: "Pendiente",
		},
	},

	// loading states
	loading: {
		text: "Cargando...",
	},

	// iframe component
	iframe: {
		back: "Atrás",
		openFolder: "Abrir carpeta",
		openInBrowser: "Abrir en Navegador",
		openNewWindow: "Abrir nueva ventana",
		fullscreen: "Pantalla Completa",
		stop: "Detener",
		reload: "Recargar",
		logs: "Registros",
	},

	// actions component
	actions: {
		reconnect: "Reconectar",
		start: "Iniciar",
		uninstall: "Desinstalar",
		install: "Instalar",
		publishedBy: "Publicado por",
		installed: "Instalado",
		notInstalled: "No instalado",
	},

	// promo component
	promo: {
		title: "¿Quieres aparecer aquí?",
		description: "Muestra tu herramienta a nuestra comunidad",
		button: "Destacar",
	},

	// installed component
	installed: {
		title: "Tu biblioteca",
		empty: {
			title: "No tienes ninguna aplicación instalada",
			action: "Instala una ahora",
		},
	},

	// local component
	local: {
		title: "Scripts locales",
		upload: "Subir script",
		noScripts: "No se encontraron scripts",
		deleting: "Eliminando script, por favor espera...",
		uploadModal: {
			title: "Subir Script",
			selectFile: "Haz clic para seleccionar un archivo",
			selectedFile: "Archivo Seleccionado",
			scriptName: "Nombre del script",
			scriptDescription: "Descripción del script (opcional)",
			uploadFile: "Subir Archivo",
			uploading: "Subiendo...",
			errors: {
				uploadFailed:
					"Fallo al subir el script. Por favor, inténtalo de nuevo.",
				uploadError: "Ocurrió un error al subir el script.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "No se encontraron scripts",
		loadingMore: "Cargando más...",
		reachedEnd: "Has llegado al final.",
		notEnoughApps: "Si crees que no hay suficientes aplicaciones,",
		helpAddMore: "por favor ayúdanos a añadir más",
		errors: {
			notArray: "Los datos obtenidos no son un array",
			fetchFailed: "Fallo al obtener los scripts",
			notSupported: "Desafortunadamente %s no es compatible con tu %s.",
			notSupportedTitle: "Tu dispositivo puede ser incompatible.",
		},
	},

	// search component
	search: {
		placeholder: "Buscar scripts...",
		filters: {
			audio: "Audio",
			image: "Imagen",
			video: "Video",
			chat: "Chat",
		},
	},

	// network share modal
	networkShare: {
		title: "Compartir",
		modes: {
			local: "Local",
			public: "Público",
			connecting: "Conectando...",
		},
		warning: {
			title: "Acceso Público",
			description:
				"Crea una URL pública accesible desde cualquier lugar. Comparte solo con personas de confianza.",
		},
		local: {
			shareUrl: "URL para Compartir",
			urlDescription: "Comparte esta URL con dispositivos en tu red local",
			localNetwork: "Red Local:",
			description:
				"Esta URL funciona en dispositivos conectados a la misma red.",
		},
		public: {
			shareUrl: "URL Pública",
			urlDescription:
				"Comparte esta URL con cualquier persona, en cualquier parte del mundo",
			passwordTitle: "Contraseña de Primera Vez",
			visitorMessage:
				"Es posible que los visitantes necesiten introducir esto una vez por dispositivo para acceder al túnel.",
			stopSharing: "Dejar de Compartir",
		},
		errors: {
			noAddress:
				"No se pudo obtener la dirección de red. Por favor, comprueba tu conexión.",
			loadFailed: "Fallo al cargar la información de red.",
			noUrl: "No hay URL disponible para copiar.",
			copyFailed: "Fallo al copiar al portapapeles.",
			tunnelFailed: "Fallo al iniciar el túnel",
		},
	},

	// login features modal
	loginFeatures: {
		title: "Te estás perdiendo funciones",
		description: "Inicia sesión en Dione para no perderte estas funciones.",
		login: "Iniciar sesión",
		skip: "Omitir",
		features: {
			customReports: {
				title: "Enviar informes personalizados",
				description:
					"Envía informes personalizados desde la aplicación, agilizando el soporte en caso de errores.",
			},
			createProfile: {
				title: "Crear un perfil",
				description:
					"Crea un perfil para que la comunidad de Dione te conozca.",
			},
			syncData: {
				title: "Sincroniza tus datos",
				description: "Sincroniza tus datos en todos tus dispositivos.",
			},
			earlyBirds: {
				title: "Obtén actualizaciones anticipadas",
				description:
					"Recibe actualizaciones anticipadas y nuevas funciones antes que nadie.",
			},
			giveOutLikes: {
				title: "Da 'Me gusta'",
				description:
					"Deja 'Me gusta' a las aplicaciones que más te gustan, ¡así más gente las usará!",
			},
			publishScripts: {
				title: "Publicar scripts",
				description: "Publica tus scripts y compártelos con el mundo.",
			},
			achieveGoals: {
				title: "Logra metas",
				description:
					"Alcanza metas como usar Dione durante 7 días para obtener regalos",
			},
			getNewswire: {
				title: "Recibe noticias",
				description:
					"Recibe actualizaciones por correo electrónico para no perderte las nuevas funciones.",
			},
		},
	},

	// editor component
	editor: {
		selectFile: "Selecciona un archivo para empezar a editar",
		previewNotAvailable: "Vista previa no disponible para este archivo.",
		mediaNotSupported:
			"Vista previa para este tipo de medio aún no es compatible.",
		previewOnly: "Solo vista previa",
		unsaved: "Sin guardar",
		retry: "Reintentar",
		editorLabel: "Editor",
	},

	// sidebar links
	links: {
		discord: "Discord",
		github: "GitHub",
		dione: "Dione",
		builtWith: "construido con",
	},

	// update notifications
	updates: {
		later: "Más tarde",
		install: "Instalar",
	},

	// iframe actions
	iframeActions: {
		shareOnNetwork: "Compartir en red",
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
			"Tenemos problemas de conexión, por favor inténtalo de nuevo más tarde.",
	},

	// variables modal
	variables: {
		title: "Variables de Entorno",
		addKey: "Añadir clave",
		searchPlaceholder: "Buscar variables...",
		keyPlaceholder: "Clave (ej. MI_VAR)",
		valuePlaceholder: "Valor",
		copyAll: "Copiar todo al portapapeles",
		confirm: "Confirmar",
		copyPath: "Copiar ruta",
		copyFullValue: "Copiar valor completo",
		deleteKey: "Eliminar clave",
	},

	// custom commands modal
	customCommands: {
		title: "Lanzar con parámetros personalizados",
		launch: "Lanzar",
	},

	// context menu
	contextMenu: {
		copyPath: "Copiar ruta",
		open: "Abrir",
		reload: "Recargar",
		rename: "Renombrar",
		delete: "Eliminar",
	},

	// file tree
	fileTree: {
		noFiles: "No se encontraron archivos en este espacio de trabajo.",
		media: "Multimedia",
		binary: "Binario",
	},

	// entry name dialog
	entryDialog: {
		name: "Nombre",
		createFile: "Crear archivo",
		createFolder: "Crear carpeta",
		renameFile: "Renombrar archivo",
		renameFolder: "Renombrar carpeta",
		createInRoot: "Esto se creará en la raíz del espacio de trabajo.",
		createInside: "Esto se creará dentro de {path}.",
		currentLocation: "Ubicación actual: {path}.",
		currentLocationRoot: "Ubicación actual: raíz del espacio de trabajo.",
		rename: "Renombrar",
		placeholderFile: "ejemplo.ts",
		placeholderFolder: "Nueva Carpeta",
	},

	// workspace editor
	workspaceEditor: {
		newFile: "Nuevo archivo",
		newFolder: "Nueva carpeta",
		retry: "Reintentar",
		back: "Atrás",
		save: "Guardar",
		openInExplorer: "Abrir en explorador",
		resolvingPath: "Resolviendo ruta...",
		workspace: "Espacio de trabajo",
	},

	// header bar
	headerBar: {
		back: "Atrás",
		openInExplorer: "Abrir en explorador",
		save: "Guardar",
	},

	// settings page footer
	settingsFooter: {
		builtWithLove: "construido con ♥",
		getDioneWebsite: "getdione.app",
		port: "Puerto",
		node: "Node:",
		electron: "Electron:",
		chromium: "Chrome:",
	},

	// notifications
	notifications: {
		enabled: {
			title: "Notificaciones habilitadas",
			description: "Recibirás notificaciones de eventos importantes.",
		},
		learnMore: "Aprende más",
	},

	// language selector
	languageSelector: {
		next: "Siguiente",
	},

	// onboarding - select path
	selectPath: {
		chooseLocation: "Elegir Ubicación de Instalación",
		changePath: "Cambiar Ruta",
	},

	// browser compatibility
	browserCompatibility: {
		audioNotSupported: "Tu navegador no soporta el elemento de audio.",
		videoNotSupported: "Tu navegador no soporta el elemento de video.",
	},

	// library card
	library: {
		official: "Oficial",
	},

	// sidebar updates
	sidebarUpdate: {
		newUpdateAvailable: "Nueva actualización disponible",
		whatsNew: "Esto es lo nuevo",
	},

	// iframe component labels
	iframeLabels: {
		back: "Atrás",
		logs: "Registros",
		disk: "Disco",
		editor: "Editor",
	},

	// progress component
	progress: {
		running: "Ejecutando...",
	},

	// toast messages
	toastMessages: {
		copiedToClipboard: "¡Copiado al portapapeles!",
		keyAndValueRequired: "Se requiere clave y valor",
		variableAdded: "Variable añadida",
		failedToAddVariable: "Fallo al añadir variable",
		variableRemoved: "Variable eliminada",
		failedToRemoveVariable: "Fallo al eliminar variable",
		valueRemoved: "Valor eliminado",
		failedToRemoveValue: "Fallo al eliminar valor",
		pathCopiedToClipboard: "Ruta copiada al portapapeles",
		failedToCopyPath: "Fallo al copiar ruta",
		unableToOpenLocation: "No se puede abrir la ubicación",
		cannotDeleteWorkspaceRoot:
			"No se puede eliminar la raíz del espacio de trabajo",
		deleted: "Eliminado",
		failedToDeleteEntry: "Fallo al eliminar entrada",
		workspaceNotAvailable: "Espacio de trabajo no disponible",
		selectFileOrFolderToRename:
			"Selecciona un archivo o carpeta para renombrar",
		cannotRenameWorkspaceRoot:
			"No se puede renombrar la raíz del espacio de trabajo",
		entryRenamed: "Entrada renombrada",
		fileSavedSuccessfully: "Archivo guardado con éxito",
		failedToSaveFile: "Fallo al guardar archivo",
		mediaFilesCannotBeOpened:
			"Los archivos multimedia no se pueden abrir en el editor.",
		binaryFilesCannotBeOpened:
			"Los archivos binarios y ejecutables no se pueden abrir en el editor.",
		thisFileTypeCannotBeEdited: "Este tipo de archivo aún no se puede editar.",
	},

	// error messages
	errorMessages: {
		workspaceNotFound: "Espacio de trabajo no encontrado",
		failedToLoadWorkspace: "Fallo al cargar el espacio de trabajo",
		failedToLoadDirectory: "Fallo al cargar el directorio",
		unableToOpenWorkspace: "No se puede abrir el espacio de trabajo",
		failedToLoadFile: "Fallo al cargar el archivo",
		nameCannotBeEmpty: "El nombre no puede estar vacío",
		nameContainsInvalidCharacters: "El nombre contiene caracteres inválidos",
		failedToCreateEntry: "Fallo al crear entrada",
		failedToRenameEntry: "Fallo al renombrar entrada",
	},

	// file operations
	fileOperations: {
		fileCreated: "Archivo creado",
		folderCreated: "Carpeta creada",
		untitledFile: "sin_título.txt",
		newFolder: "Nueva Carpeta",
	},

	// confirmation dialogs
	confirmDialogs: {
		removeValue: "¿Estás seguro de que quieres eliminar",
		thisValue: "este valor",
		keyAndAllValues: "la clave y todos sus valores",
		from: "de",
	},

	// network share modal
	networkShareErrors: {
		failedToLoadNetworkInfo: "Fallo al cargar la información de red.",
		failedToStartTunnel: "Fallo al iniciar el túnel",
		failedToCopyToClipboard: "Fallo al copiar al portapapeles.",
	},

	// feed component
	feedErrors: {
		invalidDataFormat: "Formato de datos no válido desde la API",
		failedToFetchScripts: "Fallo al obtener los scripts",
	},

	// upload script modal
	uploadScript: {
		fileLoadedLocally: "Archivo cargado localmente",
	},

	// running apps
	runningApps: {
		running: "En ejecución",
		thereIsAnAppRunningInBackground:
			"Hay una aplicación ejecutándose en segundo plano.",
		failedToReloadQuickLaunch:
			"Fallo al recargar las aplicaciones de lanzamiento rápido",
		failedToFetchInstalledApps: "Fallo al obtener las aplicaciones instaladas",
	},
} as const;
