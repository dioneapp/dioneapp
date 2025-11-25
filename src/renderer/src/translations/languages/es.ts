export const es = {
	// common actions and states
	common: {
		cancel: "Cancelar",
		loading: "Cargando...",
		error: "Error",
		success: "Éxito",
		pending: "Pendiente",
		back: "Atrás",
		unselectAll: "Desmarcar todos",
		selectAll: "Seleccionar todos",
	},

	// authentication and access related
	noAccess: {
		title: "Únete a la lista blanca de Dione",
		description:
			"Dione está en construcción y solo una cantidad limitada de usuarios puede acceder a él. Únete a nuestra lista blanca ahora para obtener acceso a futuras versiones de nuestra aplicación.",
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
				"¡Copiado al portapapeles correctamente, ahora pégalo en tu navegador!",
		},
		selectPath: {
			title: "Selecciona la ruta de instalación",
			button: "Seleccionar una ruta",
			success: "Siguiente",
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
				stopped: "%s detenido correctamente.",
				uninstalled: "%s desinstalado correctamente.",
				logsCopied: "Registros copiados correctamente al portapapeles.",
				depsInstalled: "Dependencias instaladas correctamente.",
				shared: "¡Enlace de descarga copiado al portapapeles!",
			},
			error: {
				download: "Error al iniciar la descarga: %s",
				start: "Error al iniciar %s: %s",
				stop: "Error al detener %s: %s",
				uninstall: "Error al desinstalar %s: %s",
				serverRunning: "El servidor ya se está ejecutando.",
				tooManyApps:
					"¡Más despacio! Ya tienes 6 aplicaciones en ejecución al mismo tiempo.",
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
					"Elige dónde se instalarán las nuevas aplicaciones por defecto",
			},
			binDirectory: {
				label: "Directorio de Binarios",
				description:
					"Elige dónde se almacenarán los binarios de la aplicación para facilitar el acceso",
			},
			cleanUninstall: {
				label: "Desinstalación Limpia",
				description:
					"Elimina todas las dependencias relacionadas al desinstalar aplicaciones",
			},
			autoOpenAfterInstall: {
				label: "Abrir Automáticamente Después de Instalar",
				description:
					"Abre automáticamente las aplicaciones por primera vez después de la instalación",
			},
			deleteCache: {
				label: "Borrar Caché",
				description: "Elimina todos los datos cacheados de las aplicaciones",
				button: "Borrar Caché",
				deleting: "Borrando...",
				deleted: "Borrado",
				error: "Error",
			},
		},
		interface: {
			title: "Interfaz",
			displayLanguage: {
				label: "Idioma de Visualización",
				description: "Elige tu idioma de interfaz preferido",
			},
			helpTranslate: "🤔 ¿No ves tu idioma? ¡Ayúdanos a agregar más!",
			compactView: {
				label: "Vista Compacta",
				description:
					"Utiliza un diseño más condensado para ajustar más contenido en la pantalla",
			},
		},
		notifications: {
			title: "Notificaciones",
			systemNotifications: {
				label: "Notificaciones del Sistema",
				description:
					"Muestra notificaciones de escritorio para eventos importantes",
			},
			installationAlerts: {
				label: "Alertas de Instalación",
				description:
					"Recibe notificaciones cuando las instalaciones de aplicaciones se completen",
			},
			discordRPC: {
				label: "Presencia Rrica de Discord",
				description: "Muestra tu actividad actual en el estado de Discord",
			},
			successSound: {
				label: "Habilitar sonido de éxito",
				description:
					"Activa el sonido que se reproduce cuando las aplicaciones terminan de instalarse",
			},
		},
		privacy: {
			title: "Privacidad",
			errorReporting: {
				label: "Informes de Errores",
				description:
					"Ayuda a mejorar Dione enviando informes de errores anónimos",
			},
		},
		other: {
			title: "Otro",
			disableAutoUpdate: {
				label: "Deshabilitar actualizaciones automáticas",
				description:
					"Deshabilita las actualizaciones automáticas. Precaución: tu aplicación podría perder correcciones importantes o parches de seguridad. Esta opción no se recomienda para la mayoría de los usuarios.",
			},
			logsDirectory: {
				label: "Directorio de Registros",
				description:
					"Ubicación donde se almacenan los registros de la aplicación",
			},
			submitFeedback: {
				label: "Enviar Comentarios",
				description:
					"Informa sobre cualquier problema o dificultad que encuentres",
				button: "Enviar Informe",
			},
			showOnboarding: {
				label: "Mostrar incorporación",
				description:
					"Restaura Dione a su estado inicial y vuelve a mostrar la incorporación para la reconfiguración",
				button: "Restablecer",
			},
			variables: {
				label: "Variables",
				description: "Gestiona las variables de la aplicación y sus valores",
				button: "Abrir Variables",
			},
			checkUpdates: {
				label: "Comprobar actualizaciones",
				description:
					"Comprueba actualizaciones y notifica cuando una nueva versión esté disponible",
				button: "Comprobar actualizaciones",
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
		error: "No se pudo enviar el informe. Por favor, inténtalo de nuevo.",
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
			title: "Seleccionar una Aplicación",
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
			subtitle: "correctamente",
			closing: "Cerrando esta ventana en",
			seconds: "segundos...",
		},
		error: {
			title: "Un inesperado",
			subtitle: "error",
			hasOccurred: "ha ocurrido",
			deps: "Dione no ha podido eliminar ninguna dependencia, por favor hazlo manualmente.",
			general:
				"Por favor, inténtalo de nuevo más tarde o revisa los registros para más información.",
		},
		loading: {
			title: "Cargando...",
			wait: "Por favor espera...",
		},
	},

	// logs component
	logs: {
		loading: "Cargando...",
		disclaimer:
			"Los registros mostrados son de la propia aplicación. Si ves un error, por favor infórmalo primero a los desarrolladores de la aplicación original.",
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
		openInBrowser: "Abrir en el Navegador",
		openNewWindow: "Abrir Nueva Ventana",
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
	},

	// promo component
	promo: {
		title: "¿Quieres aparecer aquí?",
		description: "Muestra tu herramienta a nuestra comunidad",
		button: "Ser Destacado",
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
			scriptName: "Nombre del Script",
			scriptDescription: "Descripción del Script (opcional)",
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
			fetchFailed: "Error al obtener los scripts",
			notSupported: "Desafortunadamente %s no es compatible con tu %s.",
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
