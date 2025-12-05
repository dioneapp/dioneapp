export const zh = {
	// common actions and states
	common: {
		cancel: "取消",
		loading: "加载中...",
		error: "错误",
		success: "成功",
		pending: "待定",
		back: "返回",
		unselectAll: "取消全选",
		selectAll: "全选",
	},

	// authentication and access related
	noAccess: {
		title: "加入 Dione 白名单",
		description:
			"Dione 尚在开发中，只有少量用户可以访问。立即加入我们的白名单，即可在未来版本中获得应用访问权限。",
		join: "加入",
		logout: "退出登录",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "欢迎来到",
			subtitle:
				"感谢您早期加入我们的旅程。请登录您的账户开始。",
			login: "登录",
			copyLink: "复制链接",
			skipLogin: "无登录继续",
		},
		loggingIn: {
			title: "正在登录...",
			authError: "无法验证身份？",
			goBack: "返回",
		},
		languageSelector: {
			title: "选择您的语言",
		},
		ready: {
			title: "您已准备就绪！",
			subtitle: "很高兴有您加入",
			finish: "完成",
		},
		clipboard: {
			success:
				"已成功复制到剪贴板，现在粘贴到您的浏览器中！",
		},
		selectPath: {
			title: "选择安装路径",
			description:
				"此文件夹将包含您所有已安装的脚本、依赖项和项目文件。请选择一个易于访问且有足够存储空间的位置。",
			button: "选择路径",
			success: "下一步",
			warning:
				"请勿选择 Dione 本身安装的同一个文件夹。这可能导致更新期间出现冲突和错误。",
		},
	},

	// error handling
	error: {
		title: "发生意外错误",
		description:
			"我们检测到应用程序中发生意外错误，对于给您带来的不便，我们深表歉意。",
		return: "返回",
		report: {
			toTeam: "报告给团队",
			sending: "正在发送报告...",
			success: "报告已发送！",
			failed: "发送报告失败",
		},
	},

	// account related
	account: {
		title: "账户",
		logout: "退出登录",
		stats: {
			timeSpent: {
				title: "花费时间",
				subtitle: "过去 7 天",
			},
			sessions: {
				title: "会话",
				subtitle: "过去 7 天",
			},
			shared: {
				title: "分享",
				subtitle: "过去 7 天",
			},
			streak: {
				title: "连胜",
				subtitle: "连续天数",
				days: "天",
			},
		},
	},

	// toast notifications
	toast: {
		close: "关闭",
		install: {
			downloading: "正在下载 %s...",
			starting: "正在启动 %s...",
			uninstalling: "正在卸载 %s...",
			reconnecting: "正在重新连接 %s...",
			retrying: "正在重试安装 %s...",
			success: {
				stopped: "%s 已成功停止。",
				uninstalled: "%s 已成功卸载。",
				logsCopied: "日志已成功复制到剪贴板。",
				depsInstalled: "依赖项已成功安装。",
				shared: "下载链接已复制到剪贴板！",
			},
			error: {
				download: "初始化下载错误： %s",
				start: "启动 %s 错误： %s",
				stop: "停止 %s 错误： %s",
				uninstall: "卸载 %s 错误： %s",
				serverRunning: "服务器已在运行。",
				tooManyApps:
					"慢点！您同时运行的应用已达 6 个。",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "正在停止应用程序...",
			description:
				"Dione 将在关闭所有打开的应用程序后自动关闭。",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "探索、安装、创新 — 一键完成。",
		activeApps: "活动应用",
		update: {
			title: "有可用更新",
			description:
				"Dione 新版本已发布，请重启应用以进行更新。",
			tooltip: "新更新可用，请重启 Dione 进行更新。",
		},
		tooltips: {
			library: "库",
			settings: "设置",
			account: "账户",
			logout: "退出登录",
			login: "登录",
			capture: "捕获",
		},
	},

	// home page
	home: {
		featured: "精选",
		explore: "探索",
	},

	// settings page
	settings: {
		applications: {
			title: "应用程序",
			installationDirectory: {
				label: "安装目录",
				description:
					"选择新应用程序的默认安装位置。",
			},
			binDirectory: {
				label: "二进制目录",
				description:
					"选择应用程序二进制文件的存储位置，方便访问。",
			},
			cleanUninstall: {
				label: "干净卸载",
				description:
					"卸载应用程序时删除所有相关依赖项。",
			},
			autoOpenAfterInstall: {
				label: "安装后自动打开",
				description:
					"安装后首次自动打开应用程序。",
			},
			deleteCache: {
				label: "删除缓存",
				description: "删除应用程序的所有缓存数据。",
				button: "删除缓存",
				deleting: "正在删除...",
				deleted: "已删除",
				error: "错误",
			},
		},
		interface: {
			title: "界面",
			displayLanguage: {
				label: "显示语言",
				description: "选择您偏好的界面语言。",
			},
			helpTranslate: "🤔 找不到您的语言？帮助我们添加更多！",
			theme: {
				label: "主题",
				description: "为应用程序选择一个颜色主题。",
				themes: {
					default: "紫色梦境",
					midnight: "午夜蓝",
					ocean: "海洋深处",
					forest: "森林之夜",
					sunset: "日落余晖",
					royal: "皇家紫",
				},
			},
			intenseBackgrounds: {
				label: "鲜艳的背景颜色",
				description:
					"使用更鲜艳的背景颜色，而不是柔和的色调。",
			},
			compactView: {
				label: "紧凑视图",
				description:
					"使用更紧凑的布局，以便在屏幕上显示更多内容。",
			},
		},
		notifications: {
			title: "通知",
			systemNotifications: {
				label: "系统通知",
				description: "显示重要事件的桌面通知。",
			},
			installationAlerts: {
				label: "安装提醒",
				description: "应用安装完成时收到通知。",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "在 Discord 状态中显示您当前的活动。",
			},
			successSound: {
				label: "启用成功音效",
				description:
					"启用应用程序安装完成时播放的声音。",
			},
		},
		privacy: {
			title: "隐私",
			errorReporting: {
				label: "错误报告",
				description: "通过发送匿名的错误报告来帮助改进 Dione。",
			},
		},
		other: {
			title: "其他",
			disableAutoUpdate: {
				label: "禁用自动更新",
				description:
					"禁用自动更新。注意：您的应用程序可能会错过重要的修复或安全补丁。不建议大多数用户使用此选项。",
			},
			logsDirectory: {
				label: "日志目录",
				description: "应用程序日志存储的位置。",
			},
			exportLogs: {
				label: "导出调试日志",
				description:
					"以 zip 文件形式导出所有日志和系统信息以进行调试。",
				button: "导出日志",
			},
			submitFeedback: {
				label: "提交反馈",
				description: "报告您遇到的任何问题。",
				button: "发送报告",
			},
			showOnboarding: {
				label: "显示入门指南",
				description:
					"将 Dione 重置为初始状态并重新显示入门指南以进行重新配置。",
				button: "重置",
			},
			variables: {
				label: "变量",
				description: "管理应用程序变量及其值。",
				button: "打开变量",
			},
			checkUpdates: {
				label: "检查更新",
				description:
					"检查更新并在新版本可用时通知您。",
				button: "检查更新",
			},
		},
	},

	// report form
	report: {
		title: "描述问题",
		description:
			"请提供有关发生情况以及您尝试执行的操作的详细信息。",
		placeholder:
			"例如：我尝试安装一个应用程序时发生此错误...",
		systemInformationTitle: "系统信息",
		disclaimer:
			"以下系统信息和匿名 ID 将包含在您的报告中。",
		success: "报告已成功发送！",
		error: "发送报告失败。请重试。",
		send: "发送报告",
		sending: "正在发送...",
		contribute: "帮助我们让此脚本兼容所有设备",
	},

	// quick launch component
	quickLaunch: {
		title: "快速启动",
		addApp: "添加应用",
		tooltips: {
			noMoreApps: "没有可添加的应用",
		},
		selectApp: {
			title: "选择一个应用",
			description: "有 {count} 个可用应用。您最多可以选择 {max} 个。",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "缺少一些依赖项！",
		installing: "正在安装依赖项...",
		install: "安装",
		logs: {
			initializing: "正在初始化依赖项下载...",
			loading: "加载中...",
			connected: "已连接到服务器",
			disconnected: "已与服务器断开连接",
			error: {
				socket: "设置套接字错误",
				install: "❌ 安装依赖项错误： {error}",
			},
			allInstalled: "所有依赖项已安装。",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstall: {
			title: "卸载",
			deps: "卸载依赖项",
			wait: "请稍候...",
		},
		uninstalling: {
			title: "正在卸载",
			deps: "正在卸载依赖项",
			wait: "请稍候...",
		},
		success: {
			title: "已卸载",
			subtitle: "成功",
			closing: "此模态将在",
			seconds: "秒后关闭...",
		},
		error: {
			title: "发生了一个",
			subtitle: "意外",
			hasOccurred: "错误",
			deps: "Dione 未能删除任何依赖项，请手动删除。",
			general: "请稍后重试或检查日志以获取更多信息。",
		},
		loading: {
			title: "加载中...",
			wait: "请稍候...",
		},
	},

	// logs component
	logs: {
		loading: "加载中...",
		openPreview: "打开预览",
		copyLogs: "复制日志",
		stop: "停止",
		disclaimer:
			"显示的日志来自应用程序本身。如果您看到错误，请首先报告给原始应用程序的开发者。",
		status: {
			success: "成功",
			error: "错误",
			pending: "待定",
		},
	},

	// loading states
	loading: {
		text: "加载中...",
	},

	// iframe component
	iframe: {
		back: "返回",
		openFolder: "打开文件夹",
		openInBrowser: "在浏览器中打开",
		openNewWindow: "打开新窗口",
		fullscreen: "全屏",
		stop: "停止",
		reload: "重新加载",
		logs: "日志",
	},

	// actions component
	actions: {
		reconnect: "重新连接",
		start: "启动",
		uninstall: "卸载",
		install: "安装",
		publishedBy: "发布者",
		installed: "已安装",
		notInstalled: "未安装",
	},

	// promo component
	promo: {
		title: "想在这里展示？",
		description: "向我们的社区展示您的工具",
		button: "获取展示",
	},

	// installed component
	installed: {
		title: "您的库",
		empty: {
			title: "您没有安装任何应用程序",
			action: "立即安装一个",
		},
	},

	// local component
	local: {
		title: "本地脚本",
		upload: "上传脚本",
		noScripts: "未找到脚本",
		deleting: "正在删除脚本，请稍候...",
		uploadModal: {
			title: "上传脚本",
			selectFile: "点击选择文件",
			selectedFile: "已选文件",
			scriptName: "脚本名称",
			scriptDescription: "脚本描述（可选）",
			uploadFile: "上传文件",
			uploading: "正在上传...",
			errors: {
				uploadFailed: "上传脚本失败。请重试。",
				uploadError: "上传脚本时发生错误。",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "未找到脚本",
		loadingMore: "加载更多...",
		reachedEnd: "您已到达末尾。",
		notEnoughApps: "如果您认为应用不够多，",
		helpAddMore: "请帮助我们添加更多",
		errors: {
			notArray: "获取的数据不是数组",
			fetchFailed: "获取脚本失败",
			notSupported: "很抱歉，您的 %s 不支持 %s。",
			notSupportedTitle: "您的设备可能不兼容。",
		},
	},

	// search component
	search: {
		placeholder: "搜索脚本...",
		filters: {
			audio: "音频",
			image: "图片",
			video: "视频",
			chat: "聊天",
		},
	},

	// network share modal
	networkShare: {
		title: "分享",
		modes: {
			local: "本地",
			public: "公共",
			connecting: "正在连接...",
		},
		warning: {
			title: "公共访问",
			description:
				"创建一个可从任何地方访问的公共 URL。仅与信任的人共享。",
		},
		local: {
			shareUrl: "分享 URL",
			urlDescription: "与本地网络上的设备共享此 URL",
			localNetwork: "本地网络：",
			description: "此 URL 在连接到同一网络的设备上有效。",
		},
		public: {
			shareUrl: "公共 URL",
			urlDescription: "与世界各地的任何人共享此 URL",
			passwordTitle: "首次密码",
			visitorMessage:
				"访客可能需要每个设备输入一次此密码才能访问隧道。",
			stopSharing: "停止分享",
		},
		errors: {
			noAddress: "无法获取网络地址。请检查您的连接。",
			loadFailed: "加载网络信息失败。",
			noUrl: "没有可复制的 URL。",
			copyFailed: "复制到剪贴板失败。",
			tunnelFailed: "启动隧道失败",
		},
	},

	// login features modal
	loginFeatures: {
		title: "您错过了部分功能",
		description: "登录 Dione，以免错过这些功能。",
		login: "登录",
		skip: "跳过",
		features: {
			customReports: {
				title: "发送自定义报告",
				description:
					"从应用程序内部发送自定义报告，在出现错误时加快支持速度。",
			},
			createProfile: {
				title: "创建个人资料",
				description:
					"为 Dione 社区创建个人资料，以便大家了解您。",
			},
			syncData: {
				title: "同步您的数据",
				description: "在所有设备上同步您的数据。",
			},
			earlyBirds: {
				title: "获取早期体验更新",
				description:
					"比其他人更早获得早期体验更新和新功能。",
			},
			giveOutLikes: {
				title: "点赞",
				description:
					"给您最喜欢的应用点赞，这样更多人会使用它们！",
			},
			publishScripts: {
				title: "发布脚本",
				description: "发布您的脚本并与世界分享。",
			},
			achieveGoals: {
				title: "达成目标",
				description:
					"例如，使用 Dione 7 天即可获得免费礼物",
			},
			getNewswire: {
				title: "获取新闻",
				description:
					"通过电子邮件接收更新，以免错过新功能。",
			},
		},
	},

	// editor component
	editor: {
		selectFile: "选择文件开始编辑",
		previewNotAvailable: "此文件没有预览。",
		mediaNotSupported: "此媒体类型暂不支持预览。",
		previewOnly: "仅预览",
		unsaved: "未保存",
		retry: "重试",
		editorLabel: "编辑器",
	},

	// sidebar links
	links: {
		discord: "Discord",
		github: "GitHub",
		dione: "Dione",
		builtWith: "使用...构建",
	},

	// update notifications
	updates: {
		later: "稍后",
		install: "安装",
	},

	// iframe actions
	iframeActions: {
		shareOnNetwork: "在网络上分享",
	},

	// version info
	versions: {
		node: "Node",
		electron: "Electron",
		chromium: "Chromium",
	},

	// connection messages
	connection: {
		retryLater: "我们遇到连接问题，请稍后重试。",
	},

	// variables modal
	variables: {
		title: "环境变量",
		addKey: "添加键",
		searchPlaceholder: "搜索变量...",
		keyPlaceholder: "键（例如 MY_VAR）",
		valuePlaceholder: "值",
		copyAll: "全部复制到剪贴板",
		confirm: "确认",
		copyPath: "复制路径",
		copyFullValue: "复制完整值",
		deleteKey: "删除键",
	},

	// custom commands modal
	customCommands: {
		title: "使用自定义参数启动",
		launch: "启动",
	},

	// context menu
	contextMenu: {
		copyPath: "复制路径",
		open: "打开",
		reload: "重新加载",
		rename: "重命名",
		delete: "删除",
	},

	// file tree
	fileTree: {
		noFiles: "在此工作区中未找到文件。",
		media: "媒体",
		binary: "二进制",
	},

	// entry name dialog
	entryDialog: {
		name: "名称",
		createFile: "创建文件",
		createFolder: "创建文件夹",
		renameFile: "重命名文件",
		renameFolder: "重命名文件夹",
		createInRoot: "这将在工作区根目录创建。",
		createInside: "这将在 {path} 内部创建。",
		currentLocation: "当前位置： {path}。",
		currentLocationRoot: "当前位置：工作区根目录。",
		rename: "重命名",
		placeholderFile: "example.ts",
		placeholderFolder: "新建文件夹",
	},

	// workspace editor
	workspaceEditor: {
		newFile: "新建文件",
		newFolder: "新建文件夹",
		retry: "重试",
		back: "返回",
		save: "保存",
		openInExplorer: "在浏览器中打开",
		resolvingPath: "正在解析路径...",
		workspace: "工作区",
	},

	// header bar
	headerBar: {
		back: "返回",
		openInExplorer: "在浏览器中打开",
		save: "保存",
	},

	// settings page footer
	settingsFooter: {
		builtWithLove: "用心构建",
		getDioneWebsite: "getdione.app",
		port: "端口",
		node: "Node:",
		electron: "Electron:",
		chromium: "Chrome:",
	},

	// notifications
	notifications: {
		enabled: {
			title: "通知已启用",
			description: "您将收到重要事件的通知。",
		},
		learnMore: "了解更多",
	},

	// language selector
	languageSelector: {
		next: "下一步",
	},

	// onboarding - select path
	selectPath: {
		chooseLocation: "选择安装位置",
		changePath: "更改路径",
	},

	// browser compatibility
	browserCompatibility: {
		audioNotSupported: "您的浏览器不支持音频元素。",
		videoNotSupported: "您的浏览器不支持视频元素。",
	},

	// library card
	library: {
		official: "官方",
	},

	// sidebar updates
	sidebarUpdate: {
		newUpdateAvailable: "新更新可用",
		whatsNew: "新内容",
	},

	// iframe component labels
	iframeLabels: {
		back: "返回",
		logs: "日志",
		disk: "磁盘",
		editor: "编辑器",
	},

	// progress component
	progress: {
		running: "运行中...",
	},

	// toast messages
	toastMessages: {
		copiedToClipboard: "已复制到剪贴板！",
		keyAndValueRequired: "键和值是必需的",
		variableAdded: "变量已添加",
		failedToAddVariable: "添加变量失败",
		variableRemoved: "变量已删除",
		failedToRemoveVariable: "删除变量失败",
		valueRemoved: "值已删除",
		failedToRemoveValue: "删除值失败",
		pathCopiedToClipboard: "路径已复制到剪贴板",
		failedToCopyPath: "复制路径失败",
		unableToOpenLocation: "无法打开位置",
		cannotDeleteWorkspaceRoot: "无法删除工作区根目录",
		deleted: "已删除",
		failedToDeleteEntry: "删除条目失败",
		workspaceNotAvailable: "工作区不可用",
		selectFileOrFolderToRename: "选择要重命名的文件或文件夹",
		cannotRenameWorkspaceRoot: "无法重命名工作区根目录",
		entryRenamed: "条目已重命名",
		fileSavedSuccessfully: "文件已成功保存",
		failedToSaveFile: "保存文件失败",
		mediaFilesCannotBeOpened: "媒体文件无法在编辑器中打开。",
		binaryFilesCannotBeOpened:
			"二进制和可执行文件无法在编辑器中打开。",
		thisFileTypeCannotBeEdited: "此文件类型尚无法编辑。",
	},

	// error messages
	errorMessages: {
		workspaceNotFound: "未找到工作区",
		failedToLoadWorkspace: "加载工作区失败",
		failedToLoadDirectory: "加载目录失败",
		unableToOpenWorkspace: "无法打开工作区",
		failedToLoadFile: "加载文件失败",
		nameCannotBeEmpty: "名称不能为空",
		nameContainsInvalidCharacters: "名称包含无效字符",
		failedToCreateEntry: "创建条目失败",
		failedToRenameEntry: "重命名条目失败",
	},

	// file operations
	fileOperations: {
		fileCreated: "文件已创建",
		folderCreated: "文件夹已创建",
		untitledFile: "untitled.txt",
		newFolder: "新建文件夹",
	},

	// confirmation dialogs
	confirmDialogs: {
		removeValue: "您确定要删除",
		thisValue: "此值",
		keyAndAllValues: "键及其所有值",
		from: "来自",
	},

	// network share modal
	networkShareErrors: {
		failedToLoadNetworkInfo: "加载网络信息失败。",
		failedToStartTunnel: "启动隧道失败",
		failedToCopyToClipboard: "复制到剪贴板失败。",
	},

	// feed component
	feedErrors: {
		invalidDataFormat: "API 数据格式无效",
		failedToFetchScripts: "获取脚本失败",
	},

	// upload script modal
	uploadScript: {
		fileLoadedLocally: "文件已本地加载",
	},

	// running apps
	runningApps: {
		running: "运行中",
		thereIsAnAppRunningInBackground:
			"有一个应用程序正在后台运行。",
		failedToReloadQuickLaunch: "重新加载快速启动应用失败",
		failedToFetchInstalledApps: "获取已安装应用失败",
	},
} as const;