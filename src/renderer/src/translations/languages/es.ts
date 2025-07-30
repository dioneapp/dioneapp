export const es = {
	// common actions and states
	common: {
		cancel: "Cancelar",
		loading: "Cargando...",
		error: "Error",
		success: "Éxito",
		pending: "Pendiente",
		back: "Volver",
		unselectAll: "Deseleccionar todo",
		selectAll: "Seleccionar todo",
	},

	// authentication and access related
	noAccess: {
		title: "Únete a la lista blanca de Dione",
		description:
			"Dione está en construcción y solo un número limitado de usuarios puede acceder. Únete a nuestra lista blanca ahora para obtener acceso a futuras versiones de nuestra aplicación.",
		join: "Unirse",
		logout: "Cerrar sesión",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Bienvenido a",
			subtitle:
				"Gracias por unirte a nosotros al principio de este viaje. Inicia sesión en tu cuenta para empezar.",
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
			finish: "Finalizar",
		},
		clipboard: {
			success:
				"Copiado al portapapeles correctamente, ¡ahora pégalo en tu navegador!",
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
			failed: "Error al enviar el informe",
		},
	},

	// account related
	account: {
		title: "Cuenta",
		logout: "Cerrar sesión",
		stats: {
			timeSpent: {
				title: "Tiempo de uso",
				subtitle: "en los últimos 7 días",
			},
			sessions: {
				title: "Sesiones",
				subtitle: "en los últimos 7 días",
			},
			shared: {
				title: "Compartidos",
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
				stopped: "%s detenido correctamente.",
				uninstalled: "%s desinstalado correctamente.",
				logsCopied: "Registros copiados al portapapeles correctamente.",
				depsInstalled: "Dependencias instaladas correctamente.",
				shared: "Enlace de descarga copiado al portapapeles!",
			},
			error: {
				download: "Error al iniciar la descarga: %s",
				start: "Error al iniciar %s: %s",
				stop: "Error al detener %s: %s",
				uninstall: "Error al desinstalar %s: %s",
				serverRunning: "El servidor ya está en ejecución.",
				tooManyApps:
					"¡Más despacio! Ya tienes 6 aplicaciones funcionando al mismo tiempo.",
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
			title: "Actualización disponible",
			description:
				"Una nueva versión de Dione está disponible, por favor reinicia la aplicación para actualizar.",
			tooltip:
				"Nueva actualización disponible, por favor reinicia Dione para actualizar.",
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
		featured: "Destacado",
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
			cleanUninstall: {
				label: "Desinstalación limpia",
				description:
					"Eliminar todas las dependencias relacionadas al desinstalar aplicaciones",
			},
			deleteCache: {
				label: "Eliminar caché",
				description: "Eliminar todos los datos en caché de las aplicaciones",
				button: "Eliminar caché",
				deleting: "Eliminando...",
				deleted: "Eliminado",
				error: "Error",
			},
		},
		interface: {
			title: "Interfaz",
			displayLanguage: {
				label: "Idioma de visualización",
				description: "Elige tu idioma de interfaz preferido",
			},
			helpTranslate: "🤔 ¿No ves tu idioma? ¡Ayúdanos a añadir más!",
			compactView: {
				label: "Vista compacta",
				description:
					"Usa un diseño más condensado para mostrar más contenido en pantalla",
			},
		},
		notifications: {
			title: "Notificaciones",
			systemNotifications: {
				label: "Notificaciones del sistema",
				description:
					"Mostrar notificaciones de escritorio para eventos importantes",
			},
			installationAlerts: {
				label: "Alertas de instalación",
				description:
					"Recibir notificaciones cuando se completen las instalaciones de aplicaciones",
			},
		},
		privacy: {
			title: "Privacidad",
			errorReporting: {
				label: "Informes de errores",
				description:
					"Ayuda a mejorar Dione enviando informes de errores anónimos",
			},
		},
		other: {
			title: "Otros",
			logsDirectory: {
				label: "Directorio de registros",
				description:
					"Ubicación donde se almacenan los registros de la aplicación",
			},
			submitFeedback: {
				label: "Enviar comentarios",
				description:
					"Reportar cualquier problema o inconveniente que encuentres",
				button: "Enviar informe",
			},
			showOnboarding: {
				label: "Mostrar bienvenida",
				description:
					"Restablece Dione a su estado inicial y muestra de nuevo la bienvenida para la reconfiguración",
				button: "Restablecer",
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
		send: "Enviar informe",
		sending: "Enviando...",
		contribute:
			"Ayudanos a hacer este script compatible con todos los dispositivos",
	},

	// quick launch component
	quickLaunch: {
		title: "Inicio rápido",
		addApp: "Añadir aplicación",
		selectApp: {
			title: "Selecciona una aplicación",
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
			wait: "por favor, espera...",
		},
		success: {
			title: "Desinstalado",
			subtitle: "con éxito",
			closing: "Cerrando este modal en",
			seconds: "segundos...",
		},
		error: {
			title: "Ha ocurrido un",
			subtitle: "error",
			hasOccurred: "inesperado",
			deps: "Dione no ha podido eliminar ninguna dependencia, por favor hazlo manualmente.",
			general:
				"Por favor, inténtalo de nuevo más tarde o revisa los registros para más información.",
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
			"Los registros mostrados son de la propia aplicación. Si ves un error, por favor repórtalo primero a los desarrolladores de la aplicación original.",
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
		back: "Volver",
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
		button: "Obtener destacado",
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
				uploadFailed: "Error al subir el script. Por favor, inténtalo de nuevo.",
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
			notSupported: "Lamentablemente %s no es compatible con tu %s.",
			notSupportedTitle: "Tu dispositivo no es compatible",
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
} as const;
