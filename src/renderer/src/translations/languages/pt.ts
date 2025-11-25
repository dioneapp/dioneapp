export const pt = {
	// common actions and states
	common: {
		cancel: "Cancelar",
		loading: "Carregando...",
		error: "Erro",
		success: "Sucesso",
		pending: "Pendente",
		back: "Voltar",
		unselectAll: "Desmarcar todos",
		selectAll: "Selecionar todos",
	},

	// authentication and access related
	noAccess: {
		title: "Entrar na lista de permissões da Dione",
		description:
			"A Dione está em construção e apenas um número limitado de usuários pode acessá-la, entre em nossa lista de permissões agora para ter acesso às futuras versões de nosso aplicativo.",
		join: "Entrar",
		logout: "Sair",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Bem-vindo(a) à",
			subtitle:
				"Obrigado por se juntar a nós no início desta jornada. Faça login em sua conta para começar.",
			login: "Entrar",
			copyLink: "Copiar link",
			skipLogin: "Continuar sem fazer login",
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
				"Copiado para a área de transferência corretamente, agora cole em seu navegador!",
		},
		selectPath: {
			title: "Selecionar caminho de instalação",
			button: "Selecionar um caminho",
			success: "Próximo",
		},
	},

	// error handling
	error: {
		title: "Ocorreu um erro inesperado",
		description:
			"Detectamos um erro inesperado no aplicativo, pedimos desculpas pelo inconveniente.",
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
				download: "Erro ao iniciar o download: %s",
				start: "Erro ao iniciar %s: %s",
				stop: "Erro ao parar %s: %s",
				uninstall: "Erro ao desinstalar %s: %s",
				serverRunning: "O servidor já está em execução.",
				tooManyApps:
					"Desacelere! Você já tem 6 aplicativos em execução ao mesmo tempo.",
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
				"Uma nova versão da Dione está disponível, reinicie o aplicativo para atualizar.",
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
		featured: "Destaques",
		explore: "Explorar",
	},

	// settings page
	settings: {
		applications: {
			title: "Aplicativos",
			installationDirectory: {
				label: "Diretório de Instalação",
				description:
					"Escolha onde novos aplicativos serão instalados por padrão",
			},
			binDirectory: {
				label: "Diretório de Binários",
				description:
					"Escolha onde os binários do aplicativo serão armazenados para fácil acesso",
			},
			cleanUninstall: {
				label: "Desinstalação Limpa",
				description:
					"Remova todas as dependências relacionadas ao desinstalar aplicativos",
			},
			autoOpenAfterInstall: {
				label: "Abrir Automaticamente Após Instalar",
				description:
					"Abra aplicativos automaticamente pela primeira vez após a instalação",
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
				description: "Escolha seu idioma de interface preferido",
			},
			helpTranslate: "🤔 Não vê seu idioma? Ajude-nos a adicionar mais!",
			compactView: {
				label: "Visualização Compacta",
				description:
					"Use um layout mais condensado para exibir mais conteúdo na tela",
			},
		},
		notifications: {
			title: "Notificações",
			systemNotifications: {
				label: "Notificações do Sistema",
				description: "Exibir notificações de desktop para eventos importantes",
			},
			installationAlerts: {
				label: "Alertas de Instalação",
				description:
					"Seja notificado quando as instalações de aplicativos forem concluídas",
			},
			discordRPC: {
				label: "Presença Rica do Discord",
				description: "Mostre sua atividade atual no status do Discord",
			},
			successSound: {
				label: "Ativar som de sucesso",
				description:
					"Ativa o som que toca quando os aplicativos terminam de instalar",
			},
		},
		privacy: {
			title: "Privacidade",
			errorReporting: {
				label: "Relatório de Erros",
				description:
					"Ajude a melhorar a Dione enviando relatórios de erros anônimos",
			},
		},
		other: {
			title: "Outros",
			disableAutoUpdate: {
				label: "Desativar atualizações automáticas",
				description:
					"Desativa as atualizações automáticas. Cuidado: seu aplicativo pode perder correções importantes ou patches de segurança. Esta opção não é recomendada para a maioria dos usuários.",
			},
			logsDirectory: {
				label: "Diretório de Logs",
				description: "Local onde os logs do aplicativo são armazenados",
			},
			submitFeedback: {
				label: "Enviar Feedback",
				description: "Relate quaisquer problemas ou dificuldades que encontrar",
				button: "Enviar Relatório",
			},
			showOnboarding: {
				label: "Mostrar onboarding",
				description:
					"Redefina a Dione para seu estado inicial e exiba novamente o onboarding para reconfiguração",
				button: "Redefinir",
			},
			variables: {
				label: "Variáveis",
				description: "Gerencie variáveis de aplicativos e seus valores",
				button: "Abrir Variáveis",
			},
			checkUpdates: {
				label: "Verificar atualizações",
				description:
					"Verificar atualizações e notificar quando uma nova versão estiver disponível",
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
		contribute:
			"Ajude-nos a tornar este script compatível com todos os dispositivos",
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
		uninstall: {
			title: "Desinstalar",
			deps: "Desinstalar dependências",
			wait: "aguarde, por favor...",
		},
		uninstalling: {
			title: "Desinstalando",
			deps: "Desinstalando dependências",
			wait: "aguarde, por favor...",
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
			"Os logs exibidos são do próprio aplicativo. Se você vir um erro, por favor, relate primeiro aos desenvolvedores originais do aplicativo.",
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
		title: "Quer ser destaque aqui?",
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
		title: "Scripts locais",
		upload: "Carregar script",
		noScripts: "Nenhum script encontrado",
		deleting: "Excluindo script, por favor aguarde...",
		uploadModal: {
			title: "Carregar Script",
			selectFile: "Clique para selecionar um arquivo",
			selectedFile: "Arquivo Selecionado",
			scriptName: "Nome do script",
			scriptDescription: "Descrição do script (opcional)",
			uploadFile: "Carregar Arquivo",
			uploading: "Carregando...",
			errors: {
				uploadFailed: "Falha ao carregar script. Por favor, tente novamente.",
				uploadError: "Ocorreu um erro durante o carregamento do script.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "Nenhum script encontrado",
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
} as const;
