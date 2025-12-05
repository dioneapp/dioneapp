export const pt = {
	// common actions and states
	common: {
		cancel: "Cancelar",
		loading: "Carregando...",
		error: "Erro",
		success: "Sucesso",
		pending: "Pendente",
		back: "Voltar",
		unselectAll: "Desmarcar Todos",
		selectAll: "Selecionar Todos",
	},

	// authentication and access related
	noAccess: {
		title: "Junte-se à lista de permissão da Dione",
		description:
			"A Dione está em construção e apenas uma quantidade limitada de usuários pode acessá-la. Junte-se à nossa lista de permissão agora para ter acesso a versões futuras do nosso aplicativo.",
		join: "Juntar-se",
		logout: "Sair",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Bem-vindo(a) ao",
			subtitle:
				"Obrigado por se juntar a nós no início desta jornada. Faça login na sua conta para começar.",
			login: "Entrar",
			copyLink: "Copiar Link",
			skipLogin: "Continuar sem login",
		},
		loggingIn: {
			title: "Entrando...",
			authError: "Não foi possível autenticar?",
			goBack: "Voltar",
		},
		languageSelector: {
			title: "Selecione seu idioma",
		},
		ready: {
			title: "Você está pronto!",
			subtitle: "Estamos felizes em ter você aqui",
			finish: "Finalizar",
		},
		clipboard: {
			success:
				"Copiado para a área de transferência corretamente, agora cole no seu navegador!",
		},
		selectPath: {
			title: "Selecione o caminho de instalação",
			description:
				"Esta pasta conterá todos os seus scripts instalados, dependências e arquivos de projeto. Escolha um local de fácil acesso e com espaço de armazenamento suficiente.",
			button: "Selecionar um caminho",
			success: "Próximo",
			warning:
				"Não selecione a mesma pasta onde a Dione está instalada. Isso pode causar conflitos e erros durante as atualizações.",
		},
	},

	// error handling
	error: {
		title: "Ocorreu um erro inesperado",
		description:
			"Detectamos um erro inesperado na aplicação, lamentamos pelo inconveniente.",
		return: "Retornar",
		report: {
			toTeam: "Relatar à equipe",
			sending: "Enviando relatório...",
			success: "Relatório enviado!",
			failed: "Falha ao enviar relatório",
		},
	},

	// account related
	account: {
		title: "Conta",
		logout: "Sair",
		stats: {
			timeSpent: {
				title: "Tempo gasto",
				subtitle: "nos últimos 7 dias",
			},
			sessions: {
				title: "Sessões",
				subtitle: "nos últimos 7 dias",
			},
			shared: {
				title: "Compartilhados",
				subtitle: "nos últimos 7 dias",
			},
			streak: {
				title: "Sequência",
				subtitle: "dias consecutivos",
				days: "dias",
			},
		},
	},

	// toast notifications
	toast: {
		close: "Fechar",
		install: {
			downloading: "Baixando %s...",
			starting: "Iniciando %s...",
			uninstalling: "Desinstalando %s...",
			reconnecting: "Reconectando %s...",
			retrying: "Tentando instalar %s novamente...",
			success: {
				stopped: "%s parado com sucesso.",
				uninstalled: "%s desinstalado com sucesso.",
				logsCopied: "Logs copiados com sucesso para a área de transferência.",
				depsInstalled: "Dependências instaladas com sucesso.",
				shared: "Link de download copiado para a área de transferência!",
			},
			error: {
				download: "Erro ao iniciar o download: %s",
				start: "Erro ao iniciar %s: %s",
				stop: "Erro ao parar %s: %s",
				uninstall: "Erro ao desinstalar %s: %s",
				serverRunning: "O servidor já está em execução.",
				tooManyApps:
					"Vá com calma! Você já tem 6 aplicativos rodando ao mesmo tempo.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Parando aplicativos...",
			description:
				"A Dione fechará automaticamente após fechar todos os aplicativos abertos.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Explore, Instale, Inove — em 1 Clique.",
		activeApps: "Aplicativos Ativos",
		update: {
			title: "Atualização Disponível",
			description:
				"Uma nova versão da Dione está disponível, por favor reinicie o aplicativo para atualizar.",
			tooltip: "Nova atualização disponível, reinicie a Dione para atualizar.",
		},
		tooltips: {
			library: "Biblioteca",
			settings: "Configurações",
			account: "Conta",
			logout: "Sair",
			login: "Entrar",
			capture: "Capturar",
		},
	},

	// home page
	home: {
		featured: "Em Destaque",
		explore: "Explorar",
	},

	// settings page
	settings: {
		applications: {
			title: "Aplicativos",
			installationDirectory: {
				label: "Diretório de Instalação",
				description:
					"Escolha onde os novos aplicativos serão instalados por padrão.",
			},
			binDirectory: {
				label: "Diretório de Binários",
				description:
					"Escolha onde os binários dos aplicativos serão armazenados para fácil acesso.",
			},
			cleanUninstall: {
				label: "Desinstalação Limpa",
				description:
					"Remova todas as dependências relacionadas ao desinstalar aplicativos.",
			},
			autoOpenAfterInstall: {
				label: "Abrir Automaticamente Após Instalação",
				description:
					"Abra automaticamente os aplicativos pela primeira vez após a instalação.",
			},
			deleteCache: {
				label: "Excluir Cache",
				description: "Remova todos os dados em cache dos aplicativos.",
				button: "Excluir Cache",
				deleting: "Excluindo...",
				deleted: "Excluído",
				error: "Erro",
			},
		},
		interface: {
			title: "Interface",
			displayLanguage: {
				label: "Idioma de Exibição",
				description: "Escolha o idioma preferido da interface.",
			},
			helpTranslate: "🤔 Não vê seu idioma? Ajude-nos a adicionar mais!",
			theme: {
				label: "Tema",
				description: "Escolha um tema de cores para o aplicativo.",
				themes: {
					default: "Sonho Roxo",
					midnight: "Azul Meia-Noite",
					ocean: "Profundezas do Oceano",
					forest: "Noite na Floresta",
					sunset: "Brilho do Pôr do Sol",
					royal: "Roxo Real",
				},
			},
			intenseBackgrounds: {
				label: "Cores de Fundo Intensas",
				description:
					"Use cores de fundo mais vibrantes em vez de tons sutis.",
			},
			compactView: {
				label: "Visualização Compacta",
				description:
					"Use um layout mais condensado para caber mais conteúdo na tela.",
			},
		},
		notifications: {
			title: "Notificações",
			systemNotifications: {
				label: "Notificações do Sistema",
				description: "Exiba notificações na área de trabalho para eventos importantes.",
			},
			installationAlerts: {
				label: "Alertas de Instalação",
				description: "Seja notificado quando as instalações de aplicativos forem concluídas.",
			},
			discordRPC: {
				label: "Presença Rica do Discord",
				description: "Mostre sua atividade atual no status do Discord.",
			},
			successSound: {
				label: "Ativar Som de Sucesso",
				description:
					"Ative o som que toca quando os aplicativos terminam de instalar.",
			},
		},
		privacy: {
			title: "Privacidade",
			errorReporting: {
				label: "Relatório de Erros",
				description: "Ajude a melhorar a Dione enviando relatórios de erros anônimos.",
			},
		},
		other: {
			title: "Outros",
			disableAutoUpdate: {
				label: "Desativar atualizações automáticas",
				description:
					"Desativa atualizações automáticas. Cuidado: seu aplicativo pode perder correções importantes ou patches de segurança. Esta opção não é recomendada para a maioria dos usuários.",
			},
			logsDirectory: {
				label: "Diretório de Logs",
				description: "Local onde os logs dos aplicativos são armazenados.",
			},
			exportLogs: {
				label: "Exportar Logs de Depuração",
				description:
					"Exporte todos os logs e informações do sistema em um arquivo zip para depuração.",
				button: "Exportar Logs",
			},
			submitFeedback: {
				label: "Enviar Feedback",
				description: "Relate quaisquer problemas ou dificuldades que você encontrar.",
				button: "Enviar Relatório",
			},
			showOnboarding: {
				label: "Mostrar tutorial",
				description:
					"Redefina a Dione para seu estado inicial e mostre novamente o tutorial para reconfiguração.",
				button: "Redefinir",
			},
			variables: {
				label: "Variáveis",
				description: "Gerencie variáveis de aplicativos e seus valores.",
				button: "Abrir Variáveis",
			},
			checkUpdates: {
				label: "Verificar atualizações",
				description:
					"Verifique se há atualizações e notifique você quando uma nova versão estiver disponível.",
				button: "Verificar atualizações",
			},
		},
	},

	// report form
	report: {
		title: "Descreva o Problema",
		description:
			"Por favor, forneça detalhes sobre o que aconteceu e o que você estava tentando fazer.",
		placeholder:
			"Exemplo: Eu estava tentando instalar um aplicativo quando este erro ocorreu...",
		systemInformationTitle: "Informações do Sistema",
		disclaimer:
			"As seguintes informações do sistema e um ID anônimo serão incluídos em seu relatório.",
		success: "Relatório enviado com sucesso!",
		error: "Falha ao enviar relatório. Por favor, tente novamente.",
		send: "Enviar Relatório",
		sending: "Enviando...",
		contribute: "Ajude-nos a tornar este script compatível com todos os dispositivos",
	},

	// quick launch component
	quickLaunch: {
		title: "Lançamento Rápido",
		addApp: "Adicionar Aplicativo",
		tooltips: {
			noMoreApps: "Nenhum aplicativo disponível para adicionar",
		},
		selectApp: {
			title: "Selecionar um Aplicativo",
			description: "{count} aplicativos estão disponíveis. Você pode escolher até {max}.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "Algumas dependências estão faltando!",
		installing: "Instalando dependências...",
		install: "Instalar",
		logs: {
			initializing: "Inicializando download de dependências...",
			loading: "Carregando...",
			connected: "Conectado ao servidor",
			disconnected: "Desconectado do servidor",
			error: {
				socket: "Erro ao configurar socket",
				install: "❌ Erro ao instalar dependências: {error}",
			},
			allInstalled: "Todas as dependências já estão instaladas.",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstall: {
			title: "Desinstalar",
			deps: "Desinstalar dependências",
			wait: "por favor, aguarde...",
		},
		uninstalling: {
			title: "Desinstalando",
			deps: "Desinstalando dependências",
			wait: "por favor, aguarde...",
		},
		success: {
			title: "Desinstalado",
			subtitle: "com sucesso",
			closing: "Fechando esta modal em",
			seconds: "segundos...",
		},
		error: {
			title: "Um inesperado",
			subtitle: "erro",
			hasOccurred: "ocorreu",
			deps: "A Dione não conseguiu remover nenhuma dependência, por favor, faça isso manualmente.",
			general: "Por favor, tente novamente mais tarde ou verifique os logs para mais informações.",
		},
		loading: {
			title: "Carregando...",
			wait: "Por favor, aguarde...",
		},
	},

	// logs component
	logs: {
		loading: "Carregando...",
		openPreview: "Abrir Pré-visualização",
		copyLogs: "Copiar Logs",
		stop: "Parar",
		disclaimer:
			"Os logs mostrados são do próprio aplicativo. Se você vir um erro, por favor, relate primeiro aos desenvolvedores originais do aplicativo.",
		status: {
			success: "Sucesso",
			error: "Erro",
			pending: "Pendente",
		},
	},

	// loading states
	loading: {
		text: "Carregando...",
	},

	// iframe component
	iframe: {
		back: "Voltar",
		openFolder: "Abrir pasta",
		openInBrowser: "Abrir no Navegador",
		openNewWindow: "Abrir nova janela",
		fullscreen: "Tela Cheia",
		stop: "Parar",
		reload: "Recarregar",
		logs: "Logs",
	},

	// actions component
	actions: {
		reconnect: "Reconectar",
		start: "Iniciar",
		uninstall: "Desinstalar",
		install: "Instalar",
		publishedBy: "Publicado por",
		installed: "Instalado",
		notInstalled: "Não instalado",
	},

	// promo component
	promo: {
		title: "Quer aparecer aqui?",
		description: "Mostre sua ferramenta para nossa comunidade",
		button: "Ser Destaque",
	},

	// installed component
	installed: {
		title: "Sua biblioteca",
		empty: {
			title: "Você não tem nenhum aplicativo instalado",
			action: "Instale um agora",
		},
	},

	// local component
	local: {
		title: "Scripts Locais",
		upload: "Enviar Script",
		noScripts: "Nenhum script encontrado",
		deleting: "Excluindo script, por favor aguarde...",
		uploadModal: {
			title: "Enviar Script",
			selectFile: "Clique para selecionar um arquivo",
			selectedFile: "Arquivo Selecionado",
			scriptName: "Nome do Script",
			scriptDescription: "Descrição do Script (opcional)",
			uploadFile: "Enviar Arquivo",
			uploading: "Enviando...",
			errors: {
				uploadFailed: "Falha ao enviar script. Por favor, tente novamente.",
				uploadError: "Ocorreu um erro ao enviar o script.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "Nenhum script encontrado",
		loadingMore: "Carregando mais...",
		reachedEnd: "Você chegou ao fim.",
		notEnoughApps: "Se você acha que não há aplicativos suficientes,",
		helpAddMore: "por favor, ajude-nos a adicionar mais",
		errors: {
			notArray: "Os dados buscados não são um array",
			fetchFailed: "Falha ao buscar scripts",
			notSupported: "Infelizmente %s não é suportado em seu %s.",
			notSupportedTitle: "Seu dispositivo pode ser incompatível.",
		},
	},

	// search component
	search: {
		placeholder: "Pesquisar scripts...",
		filters: {
			audio: "Áudio",
			image: "Imagem",
			video: "Vídeo",
			chat: "Chat",
		},
	},

	// network share modal
	networkShare: {
		title: "Compartilhar",
		modes: {
			local: "Local",
			public: "Público",
			connecting: "Conectando...",
		},
		warning: {
			title: "Acesso Público",
			description:
				"Cria uma URL pública acessível de qualquer lugar. Compartilhe apenas com pessoas confiáveis.",
		},
		local: {
			shareUrl: "URL de Compartilhamento",
			urlDescription: "Compartilhe esta URL com dispositivos na sua rede local",
			localNetwork: "Rede Local:",
			description: "Esta URL funciona em dispositivos conectados à mesma rede.",
		},
		public: {
			shareUrl: "URL Pública",
			urlDescription: "Compartilhe esta URL com qualquer pessoa, em qualquer lugar do mundo",
			passwordTitle: "Senha de Primeira Utilização",
			visitorMessage:
				"Visitantes podem precisar digitar isso uma vez por dispositivo para acessar o túnel.",
			stopSharing: "Parar de Compartilhar",
		},
		errors: {
			noAddress: "Não foi possível obter o endereço de rede. Verifique sua conexão.",
			loadFailed: "Falha ao carregar informações de rede.",
			noUrl: "Nenhuma URL disponível para copiar.",
			copyFailed: "Falha ao copiar para a área de transferência.",
			tunnelFailed: "Falha ao iniciar o túnel",
		},
	},

	// login features modal
	loginFeatures: {
		title: "Você está perdendo recursos",
		description: "Faça login na Dione para não perder esses recursos.",
		login: "Entrar",
		skip: "Pular",
		features: {
			customReports: {
				title: "Enviar relatórios personalizados",
				description:
					"Envie relatórios personalizados de dentro do aplicativo, tornando o suporte mais rápido em caso de erros.",
			},
			createProfile: {
				title: "Criar um perfil",
				description:
					"Crie um perfil para que a comunidade Dione possa conhecê-lo.",
			},
			syncData: {
				title: "Sincronizar seus dados",
				description: "Sincronize seus dados em todos os seus dispositivos.",
			},
			earlyBirds: {
				title: "Obtenha atualizações antecipadas",
				description:
					"Receba atualizações antecipadas e novos recursos antes de qualquer outra pessoa.",
			},
			giveOutLikes: {
				title: "Dar likes",
				description:
					"Deixe likes nos aplicativos que você mais gosta, para que mais pessoas os utilizem!",
			},
			publishScripts: {
				title: "Publicar scripts",
				description: "Publique seus scripts e compartilhe-os com o mundo.",
			},
			achieveGoals: {
				title: "Alcançar metas",
				description:
					"Alcance metas como usar a Dione por 7 dias para ganhar presentes grátis",
			},
			getNewswire: {
				title: "Receber novidades",
				description:
					"Receba atualizações por e-mail para não perder os novos recursos.",
			},
		},
	},

	// editor component
	editor: {
		selectFile: "Selecione um arquivo para começar a editar",
		previewNotAvailable: "Pré-visualização não disponível para este arquivo.",
		mediaNotSupported: "Pré-visualização para este tipo de mídia ainda não é suportada.",
		previewOnly: "Apenas Pré-visualização",
		unsaved: "Não Salvo",
		retry: "Tentar Novamente",
		editorLabel: "Editor",
	},

	// sidebar links
	links: {
		discord: "Discord",
		github: "GitHub",
		dione: "Dione",
		builtWith: "construído com",
	},

	// update notifications
	updates: {
		later: "Depois",
		install: "Instalar",
	},

	// iframe actions
	iframeActions: {
		shareOnNetwork: "Compartilhar na Rede",
	},

	// version info
	versions: {
		node: "Node",
		electron: "Electron",
		chromium: "Chromium",
	},

	// connection messages
	connection: {
		retryLater: "Estamos tendo problemas de conexão, por favor, tente novamente mais tarde.",
	},

	// variables modal
	variables: {
		title: "Variáveis de Ambiente",
		addKey: "Adicionar Chave",
		searchPlaceholder: "Pesquisar variáveis...",
		keyPlaceholder: "Chave (ex: MINHA_VAR)",
		valuePlaceholder: "Valor",
		copyAll: "Copiar tudo para a área de transferência",
		confirm: "Confirmar",
		copyPath: "Copiar caminho",
		copyFullValue: "Copiar valor completo",
		deleteKey: "Excluir chave",
	},

	// custom commands modal
	customCommands: {
		title: "Iniciar com parâmetros personalizados",
		launch: "Iniciar",
	},

	// context menu
	contextMenu: {
		copyPath: "Copiar caminho",
		open: "Abrir",
		reload: "Recarregar",
		rename: "Renomear",
		delete: "Excluir",
	},

	// file tree
	fileTree: {
		noFiles: "Nenhum arquivo encontrado neste workspace.",
		media: "Mídia",
		binary: "Binário",
	},

	// entry name dialog
	entryDialog: {
		name: "Nome",
		createFile: "Criar Arquivo",
		createFolder: "Criar Pasta",
		renameFile: "Renomear Arquivo",
		renameFolder: "Renomear Pasta",
		createInRoot: "Isso será criado na raiz do workspace.",
		createInside: "Isso será criado dentro de {path}.",
		currentLocation: "Localização atual: {path}.",
		currentLocationRoot: "Localização atual: raiz do workspace.",
		rename: "Renomear",
		placeholderFile: "exemplo.ts",
		placeholderFolder: "Nova Pasta",
	},

	// workspace editor
	workspaceEditor: {
		newFile: "Novo arquivo",
		newFolder: "Nova pasta",
		retry: "Tentar Novamente",
		back: "Voltar",
		save: "Salvar",
		openInExplorer: "Abrir no Explorer",
		resolvingPath: "Resolvendo caminho...",
		workspace: "Workspace",
	},

	// header bar
	headerBar: {
		back: "Voltar",
		openInExplorer: "Abrir no explorer",
		save: "Salvar",
	},

	// settings page footer
	settingsFooter: {
		builtWithLove: "construído com ♥",
		getDioneWebsite: "getdione.app",
		port: "Porta",
		node: "Node:",
		electron: "Electron:",
		chromium: "Chrome:",
	},

	// notifications
	notifications: {
		enabled: {
			title: "Notificações ativadas",
			description: "Você receberá notificações para eventos importantes.",
		},
		learnMore: "Saiba mais",
	},

	// language selector
	languageSelector: {
		next: "Próximo",
	},

	// onboarding - select path
	selectPath: {
		chooseLocation: "Escolha o Local de Instalação",
		changePath: "Alterar Caminho",
	},

	// browser compatibility
	browserCompatibility: {
		audioNotSupported: "Seu navegador não suporta o elemento de áudio.",
		videoNotSupported: "Seu navegador não suporta o elemento de vídeo.",
	},

	// library card
	library: {
		official: "Oficial",
	},

	// sidebar updates
	sidebarUpdate: {
		newUpdateAvailable: "Nova atualização disponível",
		whatsNew: "Veja as novidades",
	},

	// iframe component labels
	iframeLabels: {
		back: "Voltar",
		logs: "Logs",
		disk: "Disco",
		editor: "Editor",
	},

	// progress component
	progress: {
		running: "Executando...",
	},

	// toast messages
	toastMessages: {
		copiedToClipboard: "Copiado para a área de transferência!",
		keyAndValueRequired: "Chave e valor são obrigatórios",
		variableAdded: "Variável adicionada",
		failedToAddVariable: "Falha ao adicionar variável",
		variableRemoved: "Variável removida",
		failedToRemoveVariable: "Falha ao remover variável",
		valueRemoved: "Valor removido",
		failedToRemoveValue: "Falha ao remover valor",
		pathCopiedToClipboard: "Caminho copiado para a área de transferência",
		failedToCopyPath: "Falha ao copiar caminho",
		unableToOpenLocation: "Não foi possível abrir o local",
		cannotDeleteWorkspaceRoot: "Não é possível excluir a raiz do workspace",
		deleted: "Excluído",
		failedToDeleteEntry: "Falha ao excluir entrada",
		workspaceNotAvailable: "Workspace não disponível",
		selectFileOrFolderToRename: "Selecione um arquivo ou pasta para renomear",
		cannotRenameWorkspaceRoot: "Não é possível renomear a raiz do workspace",
		entryRenamed: "Entrada renomeada",
		fileSavedSuccessfully: "Arquivo salvo com sucesso",
		failedToSaveFile: "Falha ao salvar arquivo",
		mediaFilesCannotBeOpened: "Arquivos de mídia não podem ser abertos no editor.",
		binaryFilesCannotBeOpened:
			"Arquivos binários e executáveis não podem ser abertos no editor.",
		thisFileTypeCannotBeEdited: "Este tipo de arquivo ainda não pode ser editado.",
	},

	// error messages
	errorMessages: {
		workspaceNotFound: "Workspace não encontrado",
		failedToLoadWorkspace: "Falha ao carregar workspace",
		failedToLoadDirectory: "Falha ao carregar diretório",
		unableToOpenWorkspace: "Não foi possível abrir o workspace",
		failedToLoadFile: "Falha ao carregar arquivo",
		nameCannotBeEmpty: "O nome não pode estar vazio",
		nameContainsInvalidCharacters: "O nome contém caracteres inválidos",
		failedToCreateEntry: "Falha ao criar entrada",
		failedToRenameEntry: "Falha ao renomear entrada",
	},

	// file operations
	fileOperations: {
		fileCreated: "Arquivo criado",
		folderCreated: "Pasta criada",
		untitledFile: "sem título.txt",
		newFolder: "Nova Pasta",
	},

	// confirmation dialogs
	confirmDialogs: {
		removeValue: "Tem certeza que deseja remover",
		thisValue: "este valor",
		keyAndAllValues: "a chave e todos os seus valores",
		from: "de",
	},

	// network share modal
	networkShareErrors: {
		failedToLoadNetworkInfo: "Falha ao carregar informações de rede.",
		failedToStartTunnel: "Falha ao iniciar o túnel",
		failedToCopyToClipboard: "Falha ao copiar para a área de transferência.",
	},

	// feed component
	feedErrors: {
		invalidDataFormat: "Formato de dados inválido da API",
		failedToFetchScripts: "Falha ao buscar scripts",
	},

	// upload script modal
	uploadScript: {
		fileLoadedLocally: "Arquivo carregado localmente",
	},

	// running apps
	runningApps: {
		running: "Executando",
		thereIsAnAppRunningInBackground:
			"Há um aplicativo em execução em segundo plano.",
		failedToReloadQuickLaunch: "Falha ao recarregar aplicativos de lançamento rápido",
		failedToFetchInstalledApps: "Falha ao buscar aplicativos instalados",
	},
} as const;