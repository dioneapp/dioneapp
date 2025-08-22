export const es = {
	// common actions and states
	common: {
		cancel: "Cancelar",
		loading: "Cargando...",
		error: "Error",
		success: "Éxito",
		pending: "Pendiente",
		back: "Atrás",
		unselectAll: "Desseleccionar todo",
		selectAll: "Seleccionar todo",
	},

	// authentication and access related
	noAccess: {
		title: "Únete a la lista anticipada de Dione",
		description:
			"Dione está en construcción y solo una cantidad limitada de usuarios puede acceder a ella. Únete a nuestra lista blanca ahora para obtener acceso a futuras versiones de nuestra aplicación.",
		join: "Unirse",
		logout: "Cerrar sesión",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Bienvenido a",
			subtitle:
				"Gracias por unirte temprano en este viaje. Inicia sesión en tu cuenta para empezar.",
			login: "Iniciar sesión",
			copyLink: "Copiar enlace",
			skipLogin: "Continuar sin iniciar sesión",
		},
		loggingIn: {
			title: "Iniciando sesión...",
			authError: "¿Error de autenticación?",
			goBack: "Volver",
		},
		languageSelector: {
			title: "Selecciona tu idioma",
		},
		ready: {
			title: "¡Estás listo!",
			subtitle: "Nos alegra tenerte aquí",
			finish: "Finalizar",
		},
		clipboard: {
			success:
				"¡Copiado al portapapeles correctamente, ahora pégalo en tu navegador!",
		},
		selectPath: {
			title: "Seleccionar ruta de instalación",
			button: "Seleccionar una ruta",
			success: "Siguiente",
		},
	},

	// error handling
	error: {
		title: "Ocurrió un error inesperado",
		description:
			"Hemos detectado un error inesperado en la aplicación, lamentamos las molestias.",
		return: "Volver",
		report: {
			toTeam: "Informar al equipo",
			sending: "Enviando informe...",
			success: "¡Informe enviado!",
			failed: "No se pudo enviar el informe",
		},
	},

	// account related
	account: {
		title: "Cuenta",
		logout: "Cerrar sesión",
		stats: {
			timeSpent: {
				title: "Tiempo dedicado",
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
				stopped: "%s detenido exitosamente.",
				uninstalled: "%s desinstalado exitosamente.",
				logsCopied: "Registros copiados al portapapeles con éxito.",
				depsInstalled: "Dependencias instaladas con éxito.",
				shared: "¡Enlace de descarga copiado al portapapeles!",
			},
			error: {
				download: "Error al iniciar la descarga: %s",
				start: "Error al iniciar %s: %s",
				stop: "Error al detener %s: %s",
				uninstall: "Error al desinstalar %s: %s",
				serverRunning: "El servidor ya está en ejecución.",
				tooManyApps:
					"¡Baja el ritmo! Ya tienes 6 aplicaciones ejecutándose al mismo tiempo.",
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
		activeApps: "Aplicaciones activas",
		update: {
			title: "Actualización disponible",
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
				label: "Directorio de instalación",
				description:
					"Elige dónde se instalarán las nuevas aplicaciones por defecto",
			},
			binDirectory: {
				label: "Directorio de binarios",
				description:
					"Elige dónde se almacenarán los binarios de la aplicación para un fácil acceso",
			},
			cleanUninstall: {
				label: "Desinstalación limpia",
				description:
					"Elimina todas las dependencias relacionadas al desinstalar aplicaciones",
			},
			autoOpenAfterInstall: {
				label: "Abrir automáticamente después de instalar",
				description:
					"Abre automáticamente las aplicaciones por primera vez después de la instalación",
			},
			deleteCache: {
				label: "Borrar caché",
				description: "Elimina todos los datos cacheados de las aplicaciones",
				button: "Borrar caché",
				deleting: "Borrando...",
				deleted: "Borrado",
				error: "Error",
			},
		},
		interface: {
			title: "Interfaz",
			displayLanguage: {
				label: "Idioma de visualización",
				description: "Elige tu idioma de interfaz preferido",
			},
			helpTranslate: "🤔 ¿No ves tu idioma? ¡Ayúdanos a agregar más!",
			compactView: {
				label: "Vista compacta",
				description:
					"Usa un diseño más condensado para ajustar más contenido en la pantalla",
			},
		},
		notifications: {
			title: "Notificaciones",
			systemNotifications: {
				label: "Notificaciones del sistema",
				description:
					"Muestra notificaciones de escritorio para eventos importantes",
			},
			installationAlerts: {
				label: "Alertas de instalación",
				description:
					"Recibe notificaciones cuando las instalaciones de aplicaciones se completen",
			},
			discordRPC: {
				label: "Presencia enriquecida de Discord",
				description: "Muestra tu actividad actual en el estado de Discord",
			},
		},
		privacy: {
			title: "Privacidad",
			errorReporting: {
				label: "Informe de errores",
				description:
					"Ayuda a mejorar Dione enviando informes de errores anónimos",
			},
		},
		other: {
			title: "Otro",
			logsDirectory: {
				label: "Directorio de registros",
				description:
					"Ubicación donde se almacenan los registros de la aplicación",
			},
			submitFeedback: {
				label: "Enviar comentarios",
				description: "Reporta cualquier problema o dificultad que encuentres",
				button: "Enviar informe",
			},
			showOnboarding: {
				label: "Mostrar tutorial",
				description:
					"Restablece Dione a su estado inicial y vuelve a mostrar el tutorial para reconfigurarlo",
				button: "Restablecer",
			},
			variables: {
				label: "Variables",
				description: "Gestiona las variables de la aplicación y sus valores",
				button: "Abrir Variables",
			},
		},
	},

	// report form
	report: {
		title: "Describe el problema",
		description:
			"Por favor, proporciona detalles sobre lo que sucedió y lo que estabas intentando hacer.",
		placeholder:
			"Ejemplo: Estaba intentando instalar una aplicación cuando ocurrió este error...",
		systemInformationTitle: "Información del sistema",
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
		title: "Lanzamiento rápido",
		addApp: "Añadir aplicación",
		tooltips: {
			noMoreApps: "No hay aplicaciones disponibles para añadir",
		},
		selectApp: {
			title: "Seleccionar una aplicación",
			description:
				"{count} aplicaciones disponibles. Puedes elegir hasta {max}.",
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
			title: "Un error inesperado",
			subtitle: "error",
			hasOccurred: "ha ocurrido",
			deps: "Dione no ha podido eliminar ninguna dependencia, por favor hazlo manualmente.",
			general:
				"Por favor, inténtalo más tarde o revisa los registros para más información.",
		},
		loading: {
			title: "Cargando...",
			wait: "Por favor, espera...",
		},
	},

	// logs component
	logs: {
		loading: "Cargando...",
		disclaimer:
			"Los registros mostrados son de la aplicación en sí. Si ves un error, por favor repórtalo primero a los desarrolladores de la aplicación original.",
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
		openInBrowser: "Abrir en el navegador",
		openNewWindow: "Abrir nueva ventana",
		fullscreen: "Pantalla completa",
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
	},

	// promo component
	promo: {
		title: "¿Quieres aparecer aquí?",
		description: "Muestra tu herramienta a nuestra comunidad",
		button: "Ser destacado",
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
			selectedFile: "Archivo seleccionado",
			scriptName: "Nombre del script",
			scriptDescription: "Descripción del script (opcional)",
			uploadFile: "Subir Archivo",
			uploading: "Subiendo...",
			errors: {
				uploadFailed:
					"Error al subir el script. Por favor, inténtalo de nuevo.",
				uploadError: "Ocurrió un error al subir el script.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "No se encontraron scripts",
		errors: {
			notArray: "Los datos obtenidos no son un array",
			fetchFailed: "Error al obtener scripts",
			notSupported: "Desafortunadamente, %s no es compatible con tu %s.",
			notSupportedTitle: "Tu dispositivo puede ser incompatible.",
		},
	},

	// search component
	search: {
		placeholder: "Busca scripts...",
		filters: {
			audio: "Audio",
			image: "Imagen",
			video: "Video",
			chat: "Chat",
		},
	},
} as const;
