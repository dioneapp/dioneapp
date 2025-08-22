export const pt = {
	// common actions and states
	common: {
		cancel: "Cancelar",
		loading: "Carregando...",
		error: "Erro",
		success: "Sucesso",
		pending: "Pendente",
		back: "Voltar",
		unselectAll: "Desmarcar tudo",
		selectAll: "Selecionar tudo",
	},

	// authentication and access related
	noAccess: {
		title: "Junte-se à lista de permissões do Dione",
		description:
			"O Dione está em construção e apenas uma quantidade limitada de usuários pode acessá-lo. Junte-se à nossa lista de permissões agora para ter acesso às futuras versões do nosso aplicativo.",
		join: "Entrar",
		logout: "Sair",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Bem-vindo ao",
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
			finish: "Concluir",
		},
		clipboard: {
			success:
				"Copiado para a área de transferência corretamente, agora cole no seu navegador!",
		},
		selectPath: {
			title: "Selecione o caminho de instalação",
			button: "Selecionar um caminho",
			success: "Próximo",
		},
	},

	// error handling
	error: {
		title: "Ocorreu um erro inesperado",
		description:
			"Detectamos um erro inesperado na aplicação, lamentamos o inconveniente.",
		return: "Retornar",
		report: {
			toTeam: "Reportar à equipe",
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
				title: "Compartilhado",
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
				download: "Erro ao iniciar download: %s",
				start: "Erro ao iniciar %s: %s",
				stop: "Erro ao parar %s: %s",
				uninstall: "Erro ao desinstalar %s: %s",
				serverRunning: "O servidor já está em execução.",
				tooManyApps:
					"Devagar! Você já tem 6 aplicativos em execução ao mesmo tempo.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Parando aplicativos...",
			description:
				"O Dione fechará automaticamente após o fechamento de todos os aplicativos abertos.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Explore, Instale, Inove — em 1 Clique.",
		activeApps: "Aplicativos Ativos",
		update: {
			title: "Atualização Disponível",
			description:
				"Uma nova versão do Dione está disponível, reinicie o aplicativo para atualizar.",
			tooltip: "Nova atualização disponível, reinicie o Dione para atualizar.",
		},
		tooltips: {
			library: "Biblioteca",
			settings: "Configurações",
			account: "Conta",
			logout: "Sair",
			login: "Entrar",
		},
	},

	// home page
	home: {
		featured: "Destaque",
		explore: "Explorar",
	},

	// settings page
	settings: {
		applications: {
			title: "Aplicações",
			installationDirectory: {
				label: "Diretório de Instalação",
				description:
					"Escolha onde os novos aplicativos serão instalados por padrão",
			},
			binDirectory: {
				label: "Diretório Bin",
				description:
					"Escolha onde os binários do aplicativo serão armazenados para fácil acesso",
			},
			cleanUninstall: {
				label: "Desinstalação Limpa",
				description:
					"Remova todas as dependências relacionadas ao desinstalar aplicativos",
			},
			autoOpenAfterInstall: {
				label: "Abrir Automaticamente Após Instalação",
				description:
					"Abra automaticamente os aplicativos pela primeira vez após a instalação",
			},
			deleteCache: {
				label: "Excluir Cache",
				description: "Remova todos os dados em cache dos aplicativos",
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
				description: "Escolha o idioma da interface de sua preferência",
			},
			helpTranslate: "🤔 Não está vendo seu idioma? Ajude-nos a adicionar mais!",
			compactView: {
				label: "Visão Compacta",
				description:
					"Use um layout mais condensado para caber mais conteúdo na tela",
			},
		},
		notifications: {
			title: "Notificações",
			systemNotifications: {
				label: "Notificações do Sistema",
				description: "Mostre notificações na área de trabalho para eventos importantes",
			},
			installationAlerts: {
				label: "Alertas de Instalação",
				description: "Seja notificado quando as instalações de aplicativos forem concluídas",
			},
			discordRPC: {
				label: "Presença Rica no Discord",
				description: "Mostre sua atividade atual no status do Discord",
			},
		},
		privacy: {
			title: "Privacidade",
			errorReporting: {
				label: "Relatório de Erros",
				description: "Ajude a melhorar o Dione enviando relatórios de erros anônimos",
			},
		},
		other: {
			title: "Outros",
			logsDirectory: {
				label: "Diretório de Logs",
				description: "Local onde os logs do aplicativo são armazenados",
			},
			submitFeedback: {
				label: "Enviar Feedback",
				description: "Relate quaisquer problemas ou dificuldades que você encontrar",
				button: "Enviar Relatório",
			},
			showOnboarding: {
				label: "Mostrar Onboarding",
				description:
					"Redefina o Dione para seu estado inicial e mostre novamente o onboarding para reconfiguração",
				button: "Redefinir",
			},
			variables: {
				label: "Variáveis",
				description: "Gerencie variáveis de aplicativos e seus valores",
				button: "Abrir Variáveis",
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
		addApp: "Adicionar App",
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
		uninstalling: {
			title: "Desinstalando",
			deps: "Desinstalando dependências",
			wait: "por favor aguarde...",
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
			deps: "O Dione não conseguiu remover nenhuma dependência, por favor, faça isso manualmente.",
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
		disclaimer:
			"Os logs exibidos são do próprio aplicativo. Se você vir um erro, por favor, relate-o primeiro aos desenvolvedores originais do aplicativo.",
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
	},

	// promo component
	promo: {
		title: "Quer ser apresentado aqui?",
		description: "Apresente sua ferramenta para nossa comunidade",
		button: "Ser Apresentado",
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
		title: "Scripts locais",
		upload: "Carregar script",
		noScripts: "Nenhum script encontrado",
		deleting: "Excluindo script, por favor aguarde...",
		uploadModal: {
			title: "Carregar Script",
			selectFile: "Clique para selecionar um arquivo",
			selectedFile: "Arquivo Selecionado",
			scriptName: "Nome do Script",
			scriptDescription: "Descrição do script (opcional)",
			uploadFile: "Carregar Arquivo",
			uploading: "Carregando...",
			errors: {
				uploadFailed: "Falha ao carregar script. Por favor, tente novamente.",
				uploadError: "Ocorreu um erro ao carregar o script.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "Nenhum script encontrado",
		errors: {
			notArray: "Os dados obtidos não são um array",
			fetchFailed: "Falha ao obter scripts",
			notSupported: "Infelizmente %s não é suportado no seu %s.",
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
} as const;