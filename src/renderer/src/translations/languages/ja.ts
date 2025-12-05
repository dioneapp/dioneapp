export const ja = {
	// common actions and states
	common: {
		cancel: "キャンセル",
		loading: "読み込み中...",
		error: "エラー",
		success: "成功",
		pending: "保留中",
		back: "戻る",
		unselectAll: "すべて選択解除",
		selectAll: "すべて選択",
	},

	// authentication and access related
	noAccess: {
		title: "Dioneホワイトリストに参加",
		description:
			"Dioneは開発中であり、アクセスできるユーザーは限られています。当社のアプリの将来のバージョンにアクセスするには、今すぐホワイトリストに参加してください。",
		join: "参加",
		logout: "ログアウト",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "へようこそ",
			subtitle:
				"この旅に早期からご参加いただきありがとうございます。アカウントにログインして開始してください。",
			login: "ログイン",
			copyLink: "リンクをコピー",
			skipLogin: "ログインせずに続行",
		},
		loggingIn: {
			title: "ログイン中...",
			authError: "認証できませんでしたか？",
			goBack: "戻る",
		},
		languageSelector: {
			title: "言語を選択してください",
		},
		ready: {
			title: "準備完了です！",
			subtitle: "ようこそお越しくださいました。",
			finish: "完了",
		},
		clipboard: {
			success:
				"クリップボードに正しくコピーされました。ブラウザに貼り付けてください！",
		},
		selectPath: {
			title: "インストールパスを選択",
			description:
				"このフォルダには、インストールされているすべてのスクリプト、依存関係、プロジェクトファイルが含まれます。アクセスしやすく、十分なストレージ容量のある場所を選択してください。",
			button: "パスを選択",
			success: "次へ",
			warning:
				"Dioneがインストールされているフォルダと同じフォルダを選択しないでください。これにより、アップデート中に競合やエラーが発生する可能性があります。",
		},
	},

	// error handling
	error: {
		title: "予期せぬエラーが発生しました",
		description:
			"アプリケーションで予期せぬエラーが検出されました。ご迷惑をおかけして申し訳ございません。",
		return: "戻る",
		report: {
			toTeam: "チームに報告",
			sending: "レポートを送信中...",
			success: "レポートを送信しました！",
			failed: "レポートの送信に失敗しました。",
		},
	},

	// account related
	account: {
		title: "アカウント",
		logout: "ログアウト",
		stats: {
			timeSpent: {
				title: "経過時間",
				subtitle: "過去7日間",
			},
			sessions: {
				title: "セッション",
				subtitle: "過去7日間",
			},
			shared: {
				title: "共有済み",
				subtitle: "過去7日間",
			},
			streak: {
				title: "連続日数",
				subtitle: "連続日数",
				days: "日",
			},
		},
	},

	// toast notifications
	toast: {
		close: "閉じる",
		install: {
			downloading: "%s をダウンロード中...",
			starting: "%s を起動中...",
			uninstalling: "%s をアンインストール中...",
			reconnecting: "%s を再接続中...",
			retrying: "%s を再試行中...",
			success: {
				stopped: "%s は正常に停止しました。",
				uninstalled: "%s は正常にアンインストールされました。",
				logsCopied: "ログがクリップボードに正常にコピーされました。",
				depsInstalled: "依存関係が正常にインストールされました。",
				shared: "ダウンロードリンクがクリップボードにコピーされました！",
			},
			error: {
				download: "ダウンロードの開始エラー: %s",
				start: "%s の開始エラー: %s",
				stop: "%s の停止エラー: %s",
				uninstall: "%s のアンインストールエラー: %s",
				serverRunning: "サーバーはすでに実行中です。",
				tooManyApps:
					"落ち着いてください！同時に6つ以上のアプリが実行されています。",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "アプリケーションを停止中...",
			description:
				"Dioneは、開いているすべてのアプリケーションを閉じた後に自動的に閉じます。",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "探索、インストール、革新 — 1クリックで。",
		activeApps: "アクティブなアプリ",
		update: {
			title: "アップデートあり",
			description:
				"Dioneの新しいバージョンが利用可能です。アップデートするにはアプリを再起動してください。",
			tooltip: "新しいアップデートがあります。アップデートするにはDioneを再起動してください。",
		},
		tooltips: {
			library: "ライブラリ",
			settings: "設定",
			account: "アカウント",
			logout: "ログアウト",
			login: "ログイン",
			capture: "キャプチャ",
		},
	},

	// home page
	home: {
		featured: "注目の",
		explore: "探す",
	},

	// settings page
	settings: {
		applications: {
			title: "アプリケーション",
			installationDirectory: {
				label: "インストールディレクトリ",
				description: "新しいアプリケーションがデフォルトでインストールされる場所を選択してください。",
			},
			binDirectory: {
				label: "Binディレクトリ",
				description: "アプリケーションバイナリが保存され、簡単にアクセスできるようにする場所を選択してください。",
			},
			cleanUninstall: {
				label: "クリーンアンインストール",
				description: "アプリケーションをアンインストールする際に、関連するすべての依存関係を削除します。",
			},
			autoOpenAfterInstall: {
				label: "インストール後に自動オープン",
				description: "インストール後に初めてアプリケーションを自動的に開きます。",
			},
			deleteCache: {
				label: "キャッシュを削除",
				description: "アプリケーションのキャッシュデータをすべて削除します。",
				button: "キャッシュを削除",
				deleting: "削除中...",
				deleted: "削除済み",
				error: "エラー",
			},
		},
		interface: {
			title: "インターフェース",
			displayLanguage: {
				label: "表示言語",
				description: "好みのインターフェース言語を選択してください。",
			},
			helpTranslate: "🤔 あなたの言語が見つかりませんか？追加にご協力ください！",
			theme: {
				label: "テーマ",
				description: "アプリケーションのカラーテーマを選択してください。",
				themes: {
					default: "パープルドリーム",
					midnight: "ミッドナイトブルー",
					ocean: "オーシャンデプス",
					forest: "フォレストナイト",
					sunset: "サンセットグロウ",
					royal: "ロイヤルパープル",
				},
			},
			intenseBackgrounds: {
				label: "鮮やかな背景色",
				description: "控えめなトーンの代わりに、より鮮やかな背景色を使用します。",
			},
			compactView: {
				label: "コンパクト表示",
				description: "よりコンパクトなレイアウトを使用して、画面により多くのコンテンツを表示します。",
			},
		},
		notifications: {
			title: "通知",
			systemNotifications: {
				label: "システム通知",
				description: "重要なイベントのデスクトップ通知を表示します。",
			},
			installationAlerts: {
				label: "インストールアラート",
				description: "アプリケーションのインストールが完了したときに通知を受け取ります。",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "Discordのステータスに現在の活動を表示します。",
			},
			successSound: {
				label: "成功サウンドを有効にする",
				description: "アプリケーションのインストールが完了したときに再生されるサウンドを有効にします。",
			},
		},
		privacy: {
			title: "プライバシー",
			errorReporting: {
				label: "エラーレポート",
				description: "匿名のエラーレポートを送信して、Dioneの改善に役立ててください。",
			},
		},
		other: {
			title: "その他",
			disableAutoUpdate: {
				label: "自動アップデートを無効にする",
				description:
					"自動アップデートを無効にします。注意：アプリケーションが重要な修正やセキュリティパッチを見逃す可能性があります。このオプションはほとんどのユーザーには推奨されません。",
			},
			logsDirectory: {
				label: "ログディレクトリ",
				description: "アプリケーションログが保存される場所。",
			},
			exportLogs: {
				label: "デバッグログをエクスポート",
				description: "デバッグのために、すべてのログとシステム情報をzipファイルにエクスポートします。",
				button: "ログをエクスポート",
			},
			submitFeedback: {
				label: "フィードバックを送信",
				description: "発生した問題や不具合を報告してください。",
				button: "レポートを送信",
			},
			showOnboarding: {
				label: "オンボーディングを表示",
				description: "Dioneを初期状態にリセットし、再設定のためにオンボーディングを再度表示します。",
				button: "リセット",
			},
			variables: {
				label: "変数",
				description: "アプリケーション変数とその値を管理します。",
				button: "変数を開く",
			},
			checkUpdates: {
				label: "アップデートを確認",
				description: "アップデートを確認し、新しいバージョンが利用可能になったときに通知します。",
				button: "アップデートを確認",
			},
		},
	},

	// report form
	report: {
		title: "問題点を説明してください",
		description:
			"発生したことと、何をしようとしていたかの詳細を提供してください。",
		placeholder:
			"例: アプリケーションをインストールしようとしたときに、このエラーが発生しました...",
		systemInformationTitle: "システム情報",
		disclaimer:
			"以下のシステム情報と匿名IDがレポートに含まれます。",
		success: "レポートは正常に送信されました！",
		error: "レポートの送信に失敗しました。もう一度お試しください。",
		send: "レポートを送信",
		sending: "送信中...",
		contribute: "すべてのデバイスと互換性のあるスクリプトにするために貢献してください",
	},

	// quick launch component
	quickLaunch: {
		title: "クイック起動",
		addApp: "アプリを追加",
		tooltips: {
			noMoreApps: "追加できるアプリがありません",
		},
		selectApp: {
			title: "アプリを選択",
			description: "{count}個のアプリが利用可能です。最大{max}個まで選択できます。",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "一部の依存関係が不足しています！",
		installing: "依存関係をインストール中...",
		install: "インストール",
		logs: {
			initializing: "依存関係のダウンロードを初期化中...",
			loading: "読み込み中...",
			connected: "サーバーに接続しました",
			disconnected: "サーバーから切断しました",
			error: {
				socket: "ソケットの設定エラー",
				install: "❌ 依存関係のインストールエラー: {error}",
			},
			allInstalled: "すべての依存関係はすでにインストールされています。",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstall: {
			title: "アンインストール",
			deps: "依存関係をアンインストール",
			wait: "お待ちください...",
		},
		uninstalling: {
			title: "アンインストール中",
			deps: "依存関係をアンインストール中",
			wait: "お待ちください...",
		},
		success: {
			title: "アンインストール完了",
			subtitle: "正常に",
			closing: "このモーダルは",
			seconds: "秒後に閉じます...",
		},
		error: {
			title: "予期せぬ",
			subtitle: "エラー",
			hasOccurred: "が発生しました",
			deps: "Dioneはいかなる依存関係も削除できませんでした。手動で削除してください。",
			general: "後でもう一度お試しいただくか、ログを確認してください。",
		},
		loading: {
			title: "読み込み中...",
			wait: "お待ちください...",
		},
	},

	// logs component
	logs: {
		loading: "読み込み中...",
		openPreview: "プレビューを開く",
		copyLogs: "ログをコピー",
		stop: "停止",
		disclaimer:
			"表示されるログはアプリ自体のものです。エラーが表示された場合は、まず元のアプリの開発者に報告してください。",
		status: {
			success: "成功",
			error: "エラー",
			pending: "保留中",
		},
	},

	// loading states
	loading: {
		text: "読み込み中...",
	},

	// iframe component
	iframe: {
		back: "戻る",
		openFolder: "フォルダを開く",
		openInBrowser: "ブラウザで開く",
		openNewWindow: "新しいウィンドウで開く",
		fullscreen: "フルスクリーン",
		stop: "停止",
		reload: "リロード",
		logs: "ログ",
	},

	// actions component
	actions: {
		reconnect: "再接続",
		start: "開始",
		uninstall: "アンインストール",
		install: "インストール",
		publishedBy: "公開元:",
		installed: "インストール済み",
		notInstalled: "未インストール",
	},

	// promo component
	promo: {
		title: "ここに掲載されたいですか？",
		description: "あなたのツールをコミュニティに紹介しましょう",
		button: "特集される",
	},

	// installed component
	installed: {
		title: "あなたのライブラリ",
		empty: {
			title: "アプリケーションはインストールされていません",
			action: "今すぐインストール",
		},
	},

	// local component
	local: {
		title: "ローカルスクリプト",
		upload: "スクリプトをアップロード",
		noScripts: "スクリプトが見つかりません",
		deleting: "スクリプトを削除中、お待ちください...",
		uploadModal: {
			title: "スクリプトをアップロード",
			selectFile: "ファイルを選択するにはクリック",
			selectedFile: "選択されたファイル",
			scriptName: "スクリプト名",
			scriptDescription: "スクリプトの説明（オプション）",
			uploadFile: "ファイルをアップロード",
			uploading: "アップロード中...",
			errors: {
				uploadFailed: "スクリプトのアップロードに失敗しました。もう一度お試しください。",
				uploadError: "スクリプトのアップロード中にエラーが発生しました。",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "スクリプトが見つかりません",
		loadingMore: "さらに読み込み中...",
		reachedEnd: "最後まで到達しました。",
		notEnoughApps: "アプリが十分にないと思われる場合は、",
		helpAddMore: "追加にご協力ください",
		errors: {
			notArray: "取得したデータは配列ではありません",
			fetchFailed: "スクリプトの取得に失敗しました",
			notSupported: "残念ながら%sはあなたの%sではサポートされていません。",
			notSupportedTitle: "お使いのデバイスが互換性がない可能性があります。",
		},
	},

	// search component
	search: {
		placeholder: "スクリプトを検索...",
		filters: {
			audio: "オーディオ",
			image: "画像",
			video: "ビデオ",
			chat: "チャット",
		},
	},

	// network share modal
	networkShare: {
		title: "共有",
		modes: {
			local: "ローカル",
			public: "パブリック",
			connecting: "接続中...",
		},
		warning: {
			title: "パブリックアクセス",
			description:
				"どこからでもアクセス可能なパブリックURLを作成します。信頼できる人にのみ共有してください。",
		},
		local: {
			shareUrl: "共有URL",
			urlDescription: "ローカルネットワークに接続されたデバイスとこのURLを共有します",
			localNetwork: "ローカルネットワーク:",
			description: "このURLは同じネットワークに接続されているデバイスで機能します。",
		},
		public: {
			shareUrl: "パブリックURL",
			urlDescription: "世界中の誰とでもこのURLを共有できます",
			passwordTitle: "初回パスワード",
			visitorMessage:
				"訪問者は、トンネルにアクセスするためにデバイスごとにこのパスワードを一度入力する必要がある場合があります。",
			stopSharing: "共有を停止",
		},
		errors: {
			noAddress: "ネットワークアドレスを取得できません。接続を確認してください。",
			loadFailed: "ネットワーク情報の読み込みに失敗しました。",
			noUrl: "コピーできるURLがありません。",
			copyFailed: "クリップボードへのコピーに失敗しました。",
			tunnelFailed: "トンネルの起動に失敗しました",
		},
	},

	// login features modal
	loginFeatures: {
		title: "機能が不足しています",
		description: "これらの機能をお見逃しなく。Dioneにログインしてください。",
		login: "ログイン",
		skip: "スキップ",
		features: {
			customReports: {
				title: "カスタムレポートを送信",
				description:
					"アプリケーション内からカスタムレポートを送信し、エラー発生時のサポートを迅速化します。",
			},
			createProfile: {
				title: "プロフィールを作成",
				description: "Dioneコミュニティのためにプロフィールを作成して、あなたを知ってもらいましょう。",
			},
			syncData: {
				title: "データを同期",
				description: "すべてのデバイス間でデータを同期します。",
			},
			earlyBirds: {
				title: "早期アップデートを入手",
				description: "誰よりも早く早期アップデートと新機能を入手しましょう。",
			},
			giveOutLikes: {
				title: "いいねを付ける",
				description: "最も気に入ったアプリにいいねを付けて、より多くの人に使ってもらいましょう！",
			},
			publishScripts: {
				title: "スクリプトを公開",
				description: "あなたのスクリプトを公開し、世界と共有しましょう。",
			},
			achieveGoals: {
				title: "目標を達成する",
				description: "7日間Dioneを使用するなど、目標を達成して無料ギフトを獲得しましょう。",
			},
			getNewswire: {
				title: "ニューズワイヤーを入手",
				description: "メールでアップデートを受け取り、新機能を見逃さないようにしましょう。",
			},
		},
	},

	// editor component
	editor: {
		selectFile: "編集を開始するためにファイルを選択",
		previewNotAvailable: "このファイルではプレビューは利用できません。",
		mediaNotSupported: "このメディアタイプはまだプレビューをサポートしていません。",
		previewOnly: "プレビューのみ",
		unsaved: "未保存",
		retry: "再試行",
		editorLabel: "エディター",
	},

	// sidebar links
	links: {
		discord: "Discord",
		github: "GitHub",
		dione: "Dione",
		builtWith: "で構築",
	},

	// update notifications
	updates: {
		later: "後で",
		install: "インストール",
	},

	// iframe actions
	iframeActions: {
		shareOnNetwork: "ネットワークで共有",
	},

	// version info
	versions: {
		node: "Node",
		electron: "Electron",
		chromium: "Chromium",
	},

	// connection messages
	connection: {
		retryLater: "接続に問題があります。後でもう一度お試しください。",
	},

	// variables modal
	variables: {
		title: "環境変数",
		addKey: "キーを追加",
		searchPlaceholder: "変数を検索...",
		keyPlaceholder: "キー（例: MY_VAR）",
		valuePlaceholder: "値",
		copyAll: "すべてクリップボードにコピー",
		confirm: "確認",
		copyPath: "パスをコピー",
		copyFullValue: "完全な値をコピー",
		deleteKey: "キーを削除",
	},

	// custom commands modal
	customCommands: {
		title: "カスタムパラメータで起動",
		launch: "起動",
	},

	// context menu
	contextMenu: {
		copyPath: "パスをコピー",
		open: "開く",
		reload: "リロード",
		rename: "名前変更",
		delete: "削除",
	},

	// file tree
	fileTree: {
		noFiles: "このワークスペースにファイルが見つかりません。",
		media: "メディア",
		binary: "バイナリ",
	},

	// entry name dialog
	entryDialog: {
		name: "名前",
		createFile: "ファイルを作成",
		createFolder: "フォルダを作成",
		renameFile: "ファイル名を変更",
		renameFolder: "フォルダ名を変更",
		createInRoot: "これはワークスペースのルートに作成されます。",
		createInside: "これは{path}の中に作成されます。",
		currentLocation: "現在の場所: {path}。",
		currentLocationRoot: "現在の場所: ワークスペースのルート。",
		rename: "名前変更",
		placeholderFile: "example.ts",
		placeholderFolder: "新しいフォルダ",
	},

	// workspace editor
	workspaceEditor: {
		newFile: "新しいファイル",
		newFolder: "新しいフォルダ",
		retry: "再試行",
		back: "戻る",
		save: "保存",
		openInExplorer: "エクスプローラーで開く",
		resolvingPath: "パスを解決中...",
		workspace: "ワークスペース",
	},

	// header bar
	headerBar: {
		back: "戻る",
		openInExplorer: "エクスプローラーで開く",
		save: "保存",
	},

	// settings page footer
	settingsFooter: {
		builtWithLove: "愛を込めて構築",
		getDioneWebsite: "getdione.app",
		port: "ポート",
		node: "Node:",
		electron: "Electron:",
		chromium: "Chrome:",
	},

	// notifications
	notifications: {
		enabled: {
			title: "通知が有効になりました",
			description: "重要なイベントの通知を受け取ります。",
		},
		learnMore: "詳細はこちら",
	},

	// language selector
	languageSelector: {
		next: "次へ",
	},

	// onboarding - select path
	selectPath: {
		chooseLocation: "インストール場所を選択",
		changePath: "パスを変更",
	},

	// browser compatibility
	browserCompatibility: {
		audioNotSupported: "お使いのブラウザはオーディオ要素をサポートしていません。",
		videoNotSupported: "お使いのブラウザはビデオ要素をサポートしていません。",
	},

	// library card
	library: {
		official: "公式",
	},

	// sidebar updates
	sidebarUpdate: {
		newUpdateAvailable: "新しいアップデートがあります",
		whatsNew: "新着情報",
	},

	// iframe component labels
	iframeLabels: {
		back: "戻る",
		logs: "ログ",
		disk: "ディスク",
		editor: "エディター",
	},

	// progress component
	progress: {
		running: "実行中...",
	},

	// toast messages
	toastMessages: {
		copiedToClipboard: "クリップボードにコピーされました！",
		keyAndValueRequired: "キーと値が必要です",
		variableAdded: "変数が追加されました",
		failedToAddVariable: "変数の追加に失敗しました",
		variableRemoved: "変数が削除されました",
		failedToRemoveVariable: "変数の削除に失敗しました",
		valueRemoved: "値が削除されました",
		failedToRemoveValue: "値の削除に失敗しました",
		pathCopiedToClipboard: "パスがクリップボードにコピーされました",
		failedToCopyPath: "パスのコピーに失敗しました",
		unableToOpenLocation: "場所を開けません",
		cannotDeleteWorkspaceRoot: "ワークスペースのルートは削除できません",
		deleted: "削除済み",
		failedToDeleteEntry: "エントリの削除に失敗しました",
		workspaceNotAvailable: "ワークスペースが利用できません",
		selectFileOrFolderToRename: "名前を変更するファイルまたはフォルダを選択してください",
		cannotRenameWorkspaceRoot: "ワークスペースのルートの名前は変更できません",
		entryRenamed: "エントリの名前が変更されました",
		fileSavedSuccessfully: "ファイルが正常に保存されました",
		failedToSaveFile: "ファイルの保存に失敗しました",
		mediaFilesCannotBeOpened: "メディアファイルはエディターで開けません。",
		binaryFilesCannotBeOpened:
			"バイナリファイルおよび実行可能ファイルはエディターで開けません。",
		thisFileTypeCannotBeEdited: "このファイルタイプはまだ編集できません。",
	},

	// error messages
	errorMessages: {
		workspaceNotFound: "ワークスペースが見つかりません",
		failedToLoadWorkspace: "ワークスペースの読み込みに失敗しました",
		failedToLoadDirectory: "ディレクトリの読み込みに失敗しました",
		unableToOpenWorkspace: "ワークスペースを開けません",
		failedToLoadFile: "ファイルの読み込みに失敗しました",
		nameCannotBeEmpty: "名前は空にできません",
		nameContainsInvalidCharacters: "名前に無効な文字が含まれています",
		failedToCreateEntry: "エントリの作成に失敗しました",
		failedToRenameEntry: "エントリの名前変更に失敗しました",
	},

	// file operations
	fileOperations: {
		fileCreated: "ファイルが作成されました",
		folderCreated: "フォルダが作成されました",
		untitledFile: "無題.txt",
		newFolder: "新しいフォルダ",
	},

	// confirmation dialogs
	confirmDialogs: {
		removeValue: "削除してもよろしいですか",
		thisValue: "この値",
		keyAndAllValues: "キーとすべての値",
		from: "から",
	},

	// network share modal
	networkShareErrors: {
		failedToLoadNetworkInfo: "ネットワーク情報の読み込みに失敗しました。",
		failedToStartTunnel: "トンネルの起動に失敗しました",
		failedToCopyToClipboard: "クリップボードへのコピーに失敗しました。",
	},

	// feed component
	feedErrors: {
		invalidDataFormat: "APIからのデータ形式が無効です",
		failedToFetchScripts: "スクリプトの取得に失敗しました",
	},

	// upload script modal
	uploadScript: {
		fileLoadedLocally: "ファイルがローカルにロードされました",
	},

	// running apps
	runningApps: {
		running: "実行中",
		thereIsAnAppRunningInBackground:
			"アプリケーションがバックグラウンドで実行されています。",
		failedToReloadQuickLaunch: "クイック起動アプリの再読み込みに失敗しました",
		failedToFetchInstalledApps: "インストール済みアプリの取得に失敗しました",
	},
} as const;