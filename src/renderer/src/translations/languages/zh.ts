export const zh = {
	// common actions and states
	common: {
		cancel: "取消",
		loading: "正在加载...",
		error: "错误",
		success: "成功",
		pending: "待定",
		back: "返回",
		deselectAll: "取消选择所有",
		selectAll: "选择所有",
	},

	// authentication and access related
	noAccess: {
		title: "加入Dione白名单",
		description:
			"Dione正在建设中，只有有限数量的用户可以访问，立即加入我们的白名单以获取我们应用程序未来版本的访问权限。",
		join: "加入",
		logout: "登出",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "欢迎来到",
			subtitle: "感谢您早日加入我们的旅程。登录您的账户即可开始使用。",
			login: "登录",
			copyLink: "复制链接",
			skipLogin: "继续",
		},
		loggingIn: {
			title: "正在登录...",
			authError: "无法验证？",
			goBack: "返回",
		},
		languageSelector: {
			title: "选择语言",
		},
		ready: {
			title: "您已准备就绪！",
			subtitle: "我们很高兴您在这里",
			finish: "完成",
		},
		clipboard: {
			success: "已正确复制到剪贴板，现在将其粘贴到您的浏览器中！",
		},
	},

	// error handling
	error: {
		title: "发生意外错误",
		description:
			"我们在应用程序中检测到一个意外错误，对此造成的不便我们深表歉意。",
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
		logout: "登出",
		stats: {
			timeSpent: {
				title: "花费时间",
				subtitle: "过去7天内",
			},
			sessions: {
				title: "会话",
				subtitle: "过去7天内",
			},
			shared: {
				title: "已分享",
				subtitle: "过去7天内",
			},
			streak: {
				title: "连续记录",
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
			retrying: "正在尝试再次安装 %s...",
			success: {
				stopped: "%s 已成功停止。",
				uninstalled: "%s 已成功卸载。",
				logsCopied: "日志已成功复制到剪贴板。",
				depsInstalled: "依赖项已成功安装。",
				shared: "下载链接已复制到剪贴板！",
			},
			error: {
				download: "启动下载时出错：%s",
				start: "启动 %s 时出错：%s",
				stop: "停止 %s 时出错：%s",
				uninstall: "卸载 %s 时出错：%s",
				serverRunning: "服务器已在运行。",
				tooManyApps: "慢点！您已经同时运行了6个应用程序。",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "正在停止应用程序...",
			description: "Dione将在关闭所有打开的应用程序后自动关闭。",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "探索、安装、创新 — 一键完成。",
		activeApps: "活跃应用",
		update: {
			title: "有可用更新",
			description: "Dione 的新版本可用，请重新启动应用程序以进行更新。",
			tooltip: "有新更新可用，请重新启动 Dione 以进行更新。",
		},
		tooltips: {
			library: "库",
			settings: "设置",
			account: "账户",
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
				description: "选择新应用程序默认安装的位置",
			},
			cleanUninstall: {
				label: "清理卸载",
				description: "卸载应用程序时移除所有相关依赖项",
			},
		},
		interface: {
			title: "界面",
			displayLanguage: {
				label: "显示语言",
				description: "选择您首选的界面语言",
			},
			helpTranslate: "🤔 找不到您的语言？帮助我们添加更多！",
			compactView: {
				label: "紧凑视图",
				description: "使用更紧凑的布局以在屏幕上显示更多内容",
			},
		},
		notifications: {
			title: "通知",
			systemNotifications: {
				label: "系统通知",
				description: "重要事件显示桌面通知",
			},
			installationAlerts: {
				label: "安装警报",
				description: "应用程序安装完成时收到通知",
			},
		},
		privacy: {
			title: "隐私",
			errorReporting: {
				label: "错误报告",
				description: "通过发送匿名错误报告帮助改进Dione",
			},
		},
		other: {
			title: "其他",
			logsDirectory: {
				label: "日志目录",
				description: "应用程序日志存储位置",
			},
			submitFeedback: {
				label: "提交反馈",
				description: "报告您遇到的任何问题",
				button: "发送报告",
			},
			showOnboarding: {
				label: "显示新手指引",
				description: "将Dione重置为初始状态并再次显示新手指引以重新配置",
				button: "重置",
			},
		},
	},

	// report form
	report: {
		title: "描述问题",
		description: "请提供发生的情况以及您尝试执行的操作的详细信息。",
		placeholder: "示例：我尝试安装应用程序时出现此错误...",
		systemInformationTitle: "系统信息",
		disclaimer: "以下系统信息和匿名ID将包含在您的报告中。",
		success: "报告发送成功！",
		error: "发送报告失败。请重试。",
		send: "发送报告",
		sending: "正在发送...",
	},

	// quick launch component
	quickLaunch: {
		title: "快速启动",
		addApp: "添加应用",
		selectApp: {
			title: "选择一个应用程序",
			description: "{count}个应用程序可用。您最多可以选择{max}个。",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "缺少一些依赖项！",
		installing: "正在安装依赖项...",
		install: "安装",
		logs: {
			initializing: "正在初始化依赖项下载...",
			loading: "正在加载...",
			connected: "已连接到服务器",
			disconnected: "已从服务器断开连接",
			error: {
				socket: "设置socket时出错",
				install: "❌ 安装依赖项时出错：{error}",
			},
			allInstalled: "所有依赖项均已安装。",
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
			closing: "正在关闭此模态窗口，还剩",
			seconds: "秒...",
		},
		error: {
			title: "发生意外",
			subtitle: "错误",
			hasOccurred: "发生",
			deps: "Dione未能移除任何依赖项，请手动移除。",
			general: "请稍后重试或查看日志以获取更多信息。",
		},
		loading: {
			title: "正在加载...",
			wait: "请稍候...",
		},
	},

	// logs component
	logs: {
		loading: "正在加载...",
		disclaimer:
			"显示的日志来自应用程序本身。如果您看到错误，请首先将其报告给原始应用程序的开发者。",
		status: {
			success: "成功",
			error: "错误",
			pending: "待定",
		},
	},

	// loading states
	loading: {
		text: "正在加载...",
	},

	// iframe component
	iframe: {
		back: "返回",
		openFolder: "打开文件夹",
		openInBrowser: "在浏览器中打开",
		fullscreen: "全屏",
		stop: "停止",
		reload: "重新加载",
		logs: "日志",
	},

	// actions component
	actions: {
		reconnect: "重新连接",
		start: "开始",
		uninstall: "卸载",
		install: "安装",
		publishedBy: "发布者",
	},

	// promo component
	promo: {
		title: "想在这里展示您的内容吗？",
		description: "向我们的社区展示您的工具",
		button: "获取推荐",
	},

	// installed component
	installed: {
		title: "您的库",
		empty: {
			title: "您尚未安装任何应用程序",
			action: "立即安装一个",
		},
	},

	// local component
	local: {
		title: "本地脚本",
		upload: "上传脚本",
	},

	// feed component
	feed: {
		noScripts: "未找到脚本",
		errors: {
			notArray: "获取的数据不是数组",
			fetchFailed: "获取脚本失败",
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
