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
			"Dione 正在建设中，只有有限数量的用户可以访问，立即加入我们的白名单，以便访问我们应用的未来版本。",
		join: "加入",
		logout: "登出",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "欢迎来到",
			subtitle: "感谢您早期加入我们的旅程。登录您的帐户即可开始。",
			login: "登录",
			copyLink: "复制链接",
			skipLogin: "跳过登录",
		},
		loggingIn: {
			title: "正在登录...",
			authError: "无法进行身份验证？",
			goBack: "返回",
		},
		languageSelector: {
			title: "选择您的语言",
		},
		ready: {
			title: "您已准备就绪！",
			subtitle: "很高兴您来到这里",
			finish: "完成",
		},
		clipboard: {
			success: "已成功复制到剪贴板，现在将其粘贴到您的浏览器中！",
		},
		selectPath: {
			title: "选择安装路径",
			button: "选择路径",
			success: "下一步",
		},
	},

	// error handling
	error: {
		title: "发生意外错误",
		description: "我们在应用程序中检测到意外错误，很抱歉给您带来不便。",
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
		title: "帐户",
		logout: "登出",
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
				title: "共享",
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
				download: "初始化下载时出错： %s",
				start: "启动 %s 时出错： %s",
				stop: "停止 %s 时出错： %s",
				uninstall: "卸载 %s 时出错： %s",
				serverRunning: "服务器已在运行。",
				tooManyApps: "放慢速度！您同时已有 6 个应用程序在运行。",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "正在停止应用程序...",
			description: "Dione 将在关闭所有打开的应用程序后自动关闭。",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "探索、安装、创新 — 一键完成。",
		activeApps: "活动应用程序",
		update: {
			title: "有可用更新",
			description: "Dione 有新版本可用，请重启应用程序进行更新。",
			tooltip: "有新更新可用，请重启 Dione 进行更新。",
		},
		tooltips: {
			library: "库",
			settings: "设置",
			account: "帐户",
			logout: "登出",
			login: "登录",
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
				description: "选择新应用程序的默认安装位置",
			},
			binDirectory: {
				label: "Bin 目录",
				description: "选择应用程序二进制文件存储的位置以便于访问",
			},
			cleanUninstall: {
				label: "干净卸载",
				description: "卸载应用程序时删除所有相关的依赖项",
			},
			autoOpenAfterInstall: {
				label: "安装后自动打开",
				description: "安装后首次自动打开应用程序",
			},
			deleteCache: {
				label: "删除缓存",
				description: "删除应用程序的所有缓存数据",
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
				description: "选择您偏好的界面语言",
			},
			helpTranslate: "🤔 没看到您的语言？帮助我们添加更多！",
			compactView: {
				label: "紧凑视图",
				description: "使用更紧凑的布局，以便在屏幕上显示更多内容",
			},
		},
		notifications: {
			title: "通知",
			systemNotifications: {
				label: "系统通知",
				description: "显示重要事件的桌面通知",
			},
			installationAlerts: {
				label: "安装警报",
				description: "在应用程序安装完成后收到通知",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "在 Discord 状态中显示您当前的活动",
			},
		},
		privacy: {
			title: "隐私",
			errorReporting: {
				label: "错误报告",
				description: "通过发送匿名错误报告来帮助改进 Dione",
			},
		},
		other: {
			title: "其他",
			disableAutoUpdate: {
				label: "禁用自动更新",
				description:
					"禁用自动更新。注意：您的应用可能会错过重要修复或安全补丁。对于大多数用户，不推荐启用此选项。",
			},
			logsDirectory: {
				label: "日志目录",
				description: "存储应用程序日志的位置",
			},
			submitFeedback: {
				label: "提交反馈",
				description: "报告您遇到的任何问题或困难",
				button: "发送报告",
			},
			showOnboarding: {
				label: "显示入门指南",
				description: "将 Dione 重置为其初始状态并再次显示入门指南以重新配置",
				button: "重置",
			},
			variables: {
				label: "变量",
				description: "管理应用程序变量及其值",
				button: "打开变量",
			},
		},
	},

	// report form
	report: {
		title: "描述问题",
		description: "请提供有关发生情况以及您正在尝试执行的操作的详细信息。",
		placeholder: "例如：我尝试安装一个应用程序时遇到了此错误...",
		systemInformationTitle: "系统信息",
		disclaimer: "以下系统信息和匿名 ID 将包含在您的报告中。",
		success: "报告已成功发送！",
		error: "发送报告失败。请重试。",
		send: "发送报告",
		sending: "正在发送...",
		contribute: "帮助我们使此脚本兼容所有设备",
	},

	// quick launch component
	quickLaunch: {
		title: "快速启动",
		addApp: "添加应用程序",
		tooltips: {
			noMoreApps: "没有可添加的应用程序",
		},
		selectApp: {
			title: "选择应用程序",
			description: "{count} 个应用程序可用。您最多可以选择 {max} 个。",
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
			disconnected: "已从服务器断开连接",
			error: {
				socket: "设置套接字时出错",
				install: "❌ 安装依赖项时出错： {error}",
			},
			allInstalled: "所有依赖项都已安装。",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstalling: {
			title: "正在卸载",
			deps: "正在卸载依赖项",
			wait: "请稍候...",
		},
		success: {
			title: "已卸载",
			subtitle: "成功",
			closing: "正在关闭此模态框，剩余",
			seconds: "秒...",
		},
		error: {
			title: "发生意外",
			subtitle: "错误",
			hasOccurred: "已发生",
			deps: "Dione 未能移除任何依赖项，请手动移除。",
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
		openNewWindow: "在新窗口中打开",
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
	},

	// promo component
	promo: {
		title: "想在这里展示吗？",
		description: "向我们的社区展示您的工具",
		button: "获得展示",
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
			selectedFile: "已选择文件",
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
			image: "图像",
			video: "视频",
			chat: "聊天",
		},
	},
} as const;
