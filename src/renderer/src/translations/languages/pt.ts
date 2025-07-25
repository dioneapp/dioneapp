export const pt = {
	// common actions and states
	common: {
		cancel: "Cancelar",
		loading: "Carregando...",
		error: "Erro",
		success: "Sucesso",
		pending: "Pendente",
		back: "Voltar",
		deselectAll: "Deselecionar tudo",
		selectAll: "Selecionar tudo",
	},

	// authentication and access related
	noAccess: {
		title: "Junte-se à lista de permissões da Dione",
		description:
			"Dione está em construção e apenas um número limitado de usuários pode acessá-lo, junte-se à nossa lista de permissões agora para obter acesso às futuras versões do nosso aplicativo.",
		join: "Entrar",
		logout: "Sair",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Bem-vindo(a) ao(à)",
			subtitle:
				"Obrigado por se juntar a nós no início desta jornada. Faça login em sua conta para começar.",
			login: "Fazer login",
			copyLink: "Copiar link",
			skipLogin: "Continuar sem login",
		},
		loggingIn: {
			title: "Fazendo login...",
			authError: "Não foi possível autenticar?",
			goBack: "Voltar",
		},
		languageSelector: {
			title: "Selecione seu idioma",
		},
		ready: {
			title: "Você está pronto!",
			subtitle: "Estamos felizes em tê-lo(a) aqui",
			finish: "Finalizar",
		},
		clipboard: {
			success:
				"Copiado para a área de transferência corretamente, agora cole-o no seu navegador!",
		},
	},

	// error handling
	error: {
		title: "Ocorreu um erro inesperado",
		description:
			"Detectamos um erro inesperado no aplicativo, lamentamos o inconveniente.",
		return: "Voltar",
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
				stopped: "%s interrompido(a) com sucesso.",
				uninstalled: "%s desinstalado(a) com sucesso.",
				logsCopied: "Logs copiados com sucesso para a área de transferência.",
				depsInstalled: "Dependências instaladas com sucesso.",
				shared: "Link de download copiado para a área de transferência!",
			},
			error: {
				download: "Erro ao iniciar download: %s",
				start: "Erro ao iniciar %s: %s",
				stop: "Erro ao parar %s: %s",
				uninstall: "Erro ao desinstalar %s: %s",
				serverRunning: "Servidor já em execução.",
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
				"Dione será fechado automaticamente após o fechamento de todos os aplicativos abertos.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Explore, Instale, Inove — em 1 Clique.",
		activeApps: "Aplicativos Ativos",
		update: {
			title: "Atualização disponível",
			description:
				"Uma nova versão do Dione está disponível, por favor, reinicie o aplicativo para atualizar.",
			tooltip:
				"Nova atualização disponível, por favor, reinicie o Dione para atualizar.",
		},
		tooltips: {
			library: "Biblioteca",
			settings: "Configurações",
			account: "Conta",
			logout: "Sair",
			login: "Login",
		},
	},

	// home page
	home: {
		featured: "Em destaque",
		explore: "Explorar",
	},

	// settings page
	settings: {
		applications: {
			title: "Aplicativos",
			installationDirectory: {
				label: "Diretório de instalação",
				description:
					"Escolha onde novos aplicativos serão instalados por padrão",
			},
			cleanUninstall: {
				label: "Desinstalação limpa",
				description:
					"Remover todas as dependências relacionadas ao desinstalar aplicativos",
			},
		},
		interface: {
			title: "Interface",
			displayLanguage: {
				label: "Idioma de exibição",
				description: "Escolha seu idioma de interface preferido",
			},
			helpTranslate: "🤔 Não vê seu idioma? Ajude-nos a adicionar mais!",
			compactView: {
				label: "Visualização compacta",
				description:
					"Use um layout mais condensado para caber mais conteúdo na tela",
			},
		},
		notifications: {
			title: "Notificações",
			systemNotifications: {
				label: "Notificações do sistema",
				description:
					"Mostrar notificações da área de trabalho para eventos importantes",
			},
			installationAlerts: {
				label: "Alertas de instalação",
				description:
					"Seja notificado quando as instalações de aplicativos forem concluídas",
			},
		},
		privacy: {
			title: "Privacidade",
			errorReporting: {
				label: "Relatório de erros",
				description:
					"Ajude a melhorar o Dione enviando relatórios de erros anônimos",
			},
		},
		other: {
			title: "Outros",
			logsDirectory: {
				label: "Diretório de logs",
				description: "Local onde os logs do aplicativo são armazenados",
			},
			submitFeedback: {
				label: "Enviar feedback",
				description:
					"Relate quaisquer problemas ou dificuldades que você encontrar",
				button: "Enviar Relatório",
			},
			showOnboarding: {
				label: "Mostrar integração",
				description:
					"Redefinir Dione para seu estado inicial e mostrar novamente a integração para reconfiguração",
				button: "Redefinir",
			},
		},
	},

	// report form
	report: {
		title: "Descreva o problema",
		description:
			"Por favor, forneça detalhes sobre o que aconteceu e o que você estava tentando fazer.",
		placeholder:
			"Exemplo: Eu estava tentando instalar um aplicativo quando este erro ocorreu...",
		systemInformationTitle: "Informações do sistema",
		disclaimer:
			"As seguintes informações do sistema e um ID anônimo serão incluídos em seu relatório.",
		success: "Relatório enviado com sucesso!",
		error: "Falha ao enviar relatório. Por favor, tente novamente.",
		send: "Enviar Relatório",
		sending: "Enviando...",
		contribute:
			"Ajude-nos a tornar este script compatível com todos os dispositivos",
	},

	// quick launch component
	quickLaunch: {
		title: "Lançamento rápido",
		addApp: "Adicionar aplicativo",
		selectApp: {
			title: "Selecione um aplicativo",
			description:
				"{count} aplicativos estão disponíveis. Você pode escolher até {max}.",
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
				socket: "Erro ao configurar o socket",
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
			wait: "por favor, aguarde...",
		},
		success: {
			title: "Desinstalado",
			subtitle: "com sucesso",
			closing: "Fechando este modal em",
			seconds: "segundos...",
		},
		error: {
			title: "Um erro inesperado",
			subtitle: "erro",
			hasOccurred: "ocorreu",
			deps: "Dione não conseguiu remover nenhuma dependência, por favor, faça isso manualmente.",
			general:
				"Por favor, tente novamente mais tarde ou verifique os logs para mais informações.",
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
			"Os logs exibidos são do próprio aplicativo. Se você vir um erro, por favor, relate-o primeiro aos desenvolvedores do aplicativo original.",
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
		openInBrowser: "Abrir no navegador",
		openNewWindow: "Abrir em nova janela",
		fullscreen: "Tela cheia",
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
		title: "Quer ser destaque aqui?",
		description: "Apresente sua ferramenta à nossa comunidade",
		button: "Ser destaque",
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
	},

	// feed component
	feed: {
		noScripts: "Nenhum script encontrado",
		errors: {
			notArray: "Dados obtidos não são um array",
			fetchFailed: "Falha ao buscar scripts",
			notSupported: "Infelizmente %s não é suportado em seus %s.",
			notSupportedTitle: "Seu dispositivo não é suportado",
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
