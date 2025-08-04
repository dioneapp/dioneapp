export const ru = {
	// common actions and states
	common: {
		cancel: "Отмена",
		loading: "Загрузка...",
		error: "Ошибка",
		success: "Успешно",
		pending: "В ожидании",
		back: "Назад",
		unselectAll: "Отменить выбор всех",
		selectAll: "Выбрать все",
	},

	// authentication and access related
	noAccess: {
		title: "Присоединиться к белому списку Dione",
		description:
			"Dione находится в разработке, и доступ к ней имеет ограниченное количество пользователей. Присоединяйтесь к нашему белому списку сейчас, чтобы получить доступ к будущим версиям нашего приложения.",
		join: "Присоединиться",
		logout: "Выйти",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Добро пожаловать в",
			subtitle:
				"Спасибо, что присоединились к нам в начале этого пути. Войдите в свою учетную запись, чтобы начать.",
			login: "Войти",
			copyLink: "Скопировать ссылку",
			skipLogin: "Продолжить без входа",
		},
		loggingIn: {
			title: "Вход в систему...",
			authError: "Не удалось аутентифицировать?",
			goBack: "Вернуться",
		},
		languageSelector: {
			title: "Выберите язык",
		},
		ready: {
			title: "Вы готовы!",
			subtitle: "Мы рады видеть вас здесь",
			finish: "Завершить",
		},
		clipboard: {
			success:
				"Скопировано в буфер обмена успешно, теперь вставьте это в свой браузер!",
		},
	},

	// error handling
	error: {
		title: "Произошла непредвиденная ошибка",
		description:
			"Мы обнаружили непредвиденную ошибку в приложении, приносим извинения за неудобства.",
		return: "Вернуться",
		report: {
			toTeam: "Сообщить команде",
			sending: "Отправка отчета...",
			success: "Отчет отправлен!",
			failed: "Не удалось отправить отчет",
		},
	},

	// account related
	account: {
		title: "Аккаунт",
		logout: "Выйти",
		stats: {
			timeSpent: {
				title: "Потраченное время",
				subtitle: "за последние 7 дней",
			},
			sessions: {
				title: "Сессии",
				subtitle: "за последние 7 дней",
			},
			shared: {
				title: "Поделились",
				subtitle: "за последние 7 дней",
			},
			streak: {
				title: "Серия",
				subtitle: "дней подряд",
				days: "дней",
			},
		},
	},

	// toast notifications
	toast: {
		close: "Закрыть",
		install: {
			downloading: "Загрузка %s...",
			starting: "Запуск %s...",
			uninstalling: "Удаление %s...",
			reconnecting: "Переподключение %s...",
			retrying: "Повторная попытка установки %s...",
			success: {
				stopped: "%s успешно остановлен.",
				uninstalled: "%s успешно удален.",
				logsCopied: "Журналы успешно скопированы в буфер обмена.",
				depsInstalled: "Зависимости успешно установлены.",
				shared: "Ссылка на скачивание скопирована в буфер обмена!",
			},
			error: {
				download: "Ошибка инициализации загрузки: %s",
				start: "Ошибка запуска %s: %s",
				stop: "Ошибка остановки %s: %s",
				uninstall: "Ошибка удаления %s: %s",
				serverRunning: "Сервер уже запущен.",
				tooManyApps:
					"Помедленнее! У вас уже запущено 6 приложений одновременно.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Остановка приложений...",
			description:
				"Dione закроется автоматически после закрытия всех открытых приложений.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Исследуйте, Устанавливайте, Инновации — в 1 Клик.",
		activeApps: "Активные Приложения",
		update: {
			title: "Доступно обновление",
			description:
				"Доступна новая версия Dione, пожалуйста, перезапустите приложение для обновления.",
			tooltip:
				"Доступно новое обновление, пожалуйста, перезапустите Dione для обновления.",
		},
		tooltips: {
			library: "Библиотека",
			settings: "Настройки",
			account: "Аккаунт",
			logout: "Выйти",
			login: "Войти",
		},
	},

	// home page
	home: {
		featured: "Избранное",
		explore: "Исследовать",
	},

	// settings page
	settings: {
		applications: {
			title: "Приложения",
			installationDirectory: {
				label: "Каталог установки",
				description:
					"Выберите, куда по умолчанию будут устанавливаться новые приложения",
			},
			cleanUninstall: {
				label: "Чистая деинсталляция",
				description:
					"Удалять все связанные зависимости при удалении приложений",
			},
			deleteCache: {
				label: "Удалить кэш",
				description: "Удалить все данные кэша из приложений",
				button: "Удалить кэш",
				deleting: "Удаление...",
				deleted: "Удалено",
				error: "Ошибка",
			},
		},
		interface: {
			title: "Интерфейс",
			displayLanguage: {
				label: "Язык отображения",
				description: "Выберите предпочитаемый язык интерфейса",
			},
			helpTranslate: "🤔 Не видите свой язык? Помогите нам добавить больше!",
			compactView: {
				label: "Компактный вид",
				description:
					"Использовать более компактный макет для размещения большего количества содержимого на экране",
			},
		},
		notifications: {
			title: "Уведомления",
			systemNotifications: {
				label: "Системные уведомления",
				description:
					"Показывать уведомления на рабочем столе для важных событий",
			},
			installationAlerts: {
				label: "Оповещения об установке",
				description: "Получать уведомления о завершении установки приложений",
			},
		},
		privacy: {
			title: "Конфиденциальность",
			errorReporting: {
				label: "Отчеты об ошибках",
				description:
					"Помогите улучшить Dione, отправляя анонимные отчеты об ошибках",
			},
		},
		other: {
			title: "Другое",
			logsDirectory: {
				label: "Каталог журналов",
				description: "Место хранения логов приложения",
			},
			submitFeedback: {
				label: "Отправить отзыв",
				description:
					"Сообщайте о любых проблемах или ошибках, с которыми вы сталкиваетесь",
				button: "Отправить отчет",
			},
			showOnboarding: {
				label: "Показать вводное обучение",
				description:
					"Сбросить Dione в исходное состояние и снова показать вводное обучение для перенастройки",
				button: "Сброс",
			},
		},
	},

	// report form
	report: {
		title: "Опишите проблему",
		description:
			"Пожалуйста, предоставьте подробную информацию о том, что произошло и что вы пытались сделать.",
		placeholder:
			"Пример: Я пытался установить приложение, когда произошла эта ошибка...",
		systemInformationTitle: "Системная информация",
		disclaimer:
			"Следующая системная информация и анонимный ID будут включены в ваш отчет.",
		success: "Отчет успешно отправлен!",
		error: "Не удалось отправить отчет. Пожалуйста, попробуйте еще раз.",
		send: "Отправить отчет",
		sending: "Отправка...",
		contribute:
			"Помогите нам сделать этот скрипт совместимым с всеми устройствами",
	},

	// quick launch component
	quickLaunch: {
		title: "Быстрый запуск",
		addApp: "Добавить приложение",
		selectApp: {
			title: "Выберите приложение",
			description: "Доступно {count} приложений. Вы можете выбрать до {max}.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "Некоторые зависимости отсутствуют!",
		installing: "Установка зависимостей...",
		install: "Установить",
		logs: {
			initializing: "Инициализация загрузки зависимостей...",
			loading: "Загрузка...",
			connected: "Подключено к серверу",
			disconnected: "Отключено от сервера",
			error: {
				socket: "Ошибка настройки сокета",
				install: "❌ Ошибка установки зависимостей: {error}",
			},
			allInstalled: "Все зависимости уже установлены.",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstalling: {
			title: "Удаление",
			deps: "Удаление зависимостей",
			wait: "пожалуйста, подождите...",
		},
		success: {
			title: "Удалено",
			subtitle: "успешно",
			closing: "Закрытие этого модального окна через",
			seconds: "секунд...",
		},
		error: {
			title: "Неожиданная",
			subtitle: "ошибка",
			hasOccurred: "произошла",
			deps: "Dione не смогла удалить зависимости, пожалуйста, сделайте это вручную.",
			general:
				"Пожалуйста, попробуйте еще раз позже или проверьте журналы для получения дополнительной информации.",
		},
		loading: {
			title: "Загрузка...",
			wait: "Пожалуйста, подождите...",
		},
	},

	// logs component
	logs: {
		loading: "Загрузка...",
		disclaimer:
			"Показанные журналы относятся к самому приложению. Если вы видите ошибку, пожалуйста, сообщите о ней сначала разработчикам исходного приложения.",
		status: {
			success: "Успешно",
			error: "Ошибка",
			pending: "В ожидании",
		},
	},

	// loading states
	loading: {
		text: "Загрузка...",
	},

	// iframe component
	iframe: {
		back: "Назад",
		openFolder: "Открыть папку",
		openInBrowser: "Открыть в браузере",
		openNewWindow: "Открыть в новом окне",
		fullscreen: "Полноэкранный режим",
		stop: "Стоп",
		reload: "Перезагрузить",
		logs: "Журналы",
	},

	// actions component
	actions: {
		reconnect: "Переподключиться",
		start: "Запустить",
		uninstall: "Удалить",
		install: "Установить",
		publishedBy: "Опубликовано",
	},

	// promo component
	promo: {
		title: "Хотите быть здесь представлены?",
		description: "Представьте свой инструмент нашему сообществу",
		button: "Получить место",
	},

	// installed component
	installed: {
		title: "Ваша библиотека",
		empty: {
			title: "У вас нет установленных приложений",
			action: "Установите сейчас",
		},
	},

	// local component
	local: {
		title: "Скрипты локально",
		upload: "Загрузить скрипт",
		noScripts: "Скрипты не найдены",
	},

	// feed component
	feed: {
		noScripts: "Скрипты не найдены",
		errors: {
			notArray: "Полученные данные не являются массивом",
			fetchFailed: "Не удалось получить скрипты",
			notSupported: "К сожалению %s не поддерживается на вашем %s.",
			notSupportedTitle: "Ваше устройство не поддерживается",
		},
	},

	// search component
	search: {
		placeholder: "Искать скрипты...",
		filters: {
			audio: "Аудио",
			image: "Изображение",
			video: "Видео",
			chat: "Чат",
		},
	},
} as const;
