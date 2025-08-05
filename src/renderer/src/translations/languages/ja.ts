export const ja = {
	// common actions and states
	common: {
		cancel: "キャンセル",
		loading: "読み込み中...",
		error: "エラー",
		success: "成功",
		pending: "保留中",
		back: "戻る",
		unselectAll: "すべての選択を解除",
		selectAll: "すべて選択",
	},

	// authentication and access related
	noAccess: {
		title: "Dioneホワイトリストに参加",
		description:
			"Dioneは現在開発中で、限られた数のユーザーのみがアクセスできます。アプリの将来のバージョンにアクセスするために、今すぐホワイトリストに参加してください。",
		join: "参加",
		logout: "ログアウト",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "ようこそ",
			subtitle:
				"この旅の早い段階で私たちに参加していただき、ありがとうございます。開始するにはアカウントにログインしてください。",
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
			title: "言語を選択",
		},
		ready: {
			title: "準備完了です！",
			subtitle: "ここにいていただき、嬉しく思います",
			finish: "完了",
		},
		clipboard: {
			success:
				"クリップボードに正しくコピーされました。今度はブラウザに貼り付けてください！",
		},
	},

	// error handling
	error: {
		title: "予期しないエラーが発生しました",
		description:
			"アプリケーションで予期しないエラーが検出されました。ご不便をおかけして申し訳ございません。",
		return: "戻る",
		report: {
			toTeam: "チームに報告",
			sending: "レポートを送信中...",
			success: "レポートが送信されました！",
			failed: "レポートの送信に失敗しました",
		},
	},

	// account related
	account: {
		title: "アカウント",
		logout: "ログアウト",
		stats: {
			timeSpent: {
				title: "使用時間",
				subtitle: "過去7日間",
			},
			sessions: {
				title: "セッション",
				subtitle: "過去7日間",
			},
			shared: {
				title: "共有",
				subtitle: "過去7日間",
			},
			streak: {
				title: "連続",
				subtitle: "連続日数",
				days: "日",
			},
		},
	},

	// toast notifications
	toast: {
		close: "閉じる",
		install: {
			downloading: "%sをダウンロード中...",
			starting: "%sを開始中...",
			uninstalling: "%sをアンインストール中...",
			reconnecting: "%sを再接続中...",
			retrying: "%sを再インストールしようとしています...",
			success: {
				stopped: "%sが正常に停止されました。",
				uninstalled: "%sが正常にアンインストールされました。",
				logsCopied: "ログがクリップボードに正常にコピーされました。",
				depsInstalled: "依存関係が正常にインストールされました。",
				shared: "ダウンロードリンクがクリップボードにコピーされました！",
			},
			error: {
				download: "ダウンロードの開始エラー: %s",
				start: "%sの開始エラー: %s",
				stop: "%sの停止エラー: %s",
				uninstall: "%sのアンインストールエラー: %s",
				serverRunning: "サーバーは既に実行中です。",
				tooManyApps:
					"速度を落としてください！既に6つのアプリが同時に実行されています。",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "アプリケーションを停止中...",
			description:
				"すべての開いているアプリケーションを閉じた後、Dioneは自動的に閉じます。",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "探索、インストール、革新 — ワンクリックで。",
		activeApps: "アクティブなアプリ",
		update: {
			title: "アップデートが利用可能",
			description:
				"Dioneの新しいバージョンが利用可能です。更新するにはアプリを再起動してください。",
			tooltip:
				"新しいアップデートが利用可能です。更新するにはDioneを再起動してください。",
		},
		tooltips: {
			library: "ライブラリ",
			settings: "設定",
			account: "アカウント",
			logout: "ログアウト",
			login: "ログイン",
		},
	},

	// home page
	home: {
		featured: "注目",
		explore: "探索",
	},

	// settings page
	settings: {
		applications: {
			title: "アプリケーション",
			installationDirectory: {
				label: "インストールディレクトリ",
				description:
					"新しいアプリケーションがデフォルトでインストールされる場所を選択",
			},
			binDirectory: {
				label: "バイナリディレクトリ",
				description:
					"アプリケーションのバイナリが簡単にアクセスできるように保存される場所を選択",
			},
			cleanUninstall: {
				label: "クリーンアンインストール",
				description:
					"アプリケーションをアンインストールする際に関連する依存関係をすべて削除",
			},
			autoOpenAfterInstall: {
				label: "インストール後に自動で開く",
				description: "インストール後に初回起動時にアプリケーションを自動で開く",
			},
			deleteCache: {
				label: "キャッシュを削除",
				description: "アプリケーションのキャッシュされたデータをすべて削除",
				button: "キャッシュを削除",
				deleting: "削除中...",
				deleted: "削除されました",
				error: "エラー",
			},
		},
		interface: {
			title: "インターフェース",
			displayLanguage: {
				label: "表示言語",
				description: "お好みのインターフェース言語を選択",
			},
			helpTranslate:
				"🤔 お使いの言語が見つかりませんか？追加をお手伝いください！",
			compactView: {
				label: "コンパクトビュー",
				description:
					"より多くのコンテンツを画面に表示するために、より凝縮されたレイアウトを使用",
			},
		},
		notifications: {
			title: "通知",
			systemNotifications: {
				label: "システム通知",
				description: "重要なイベントのデスクトップ通知を表示",
			},
			installationAlerts: {
				label: "インストールアラート",
				description: "アプリケーションのインストールが完了したときに通知",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "Discordステータスで現在のアクティビティを表示",
			},
		},
		privacy: {
			title: "プライバシー",
			errorReporting: {
				label: "エラーレポート",
				description: "匿名のエラーレポートを送信してDioneの改善に協力",
			},
		},
		other: {
			title: "その他",
			logsDirectory: {
				label: "ログディレクトリ",
				description: "アプリケーションログが保存される場所",
			},
			submitFeedback: {
				label: "フィードバックを送信",
				description: "発生した問題や問題を報告",
				button: "レポートを送信",
			},
			showOnboarding: {
				label: "オンボーディングを表示",
				description:
					"Dioneを初期状態にリセットし、再設定のためにオンボーディングを再表示",
				button: "リセット",
			},
			variables: {
				label: "変数",
				description: "アプリケーション変数とその値を管理",
				button: "変数を開く",
			},
		},
	},

	// report form
	report: {
		title: "問題を説明",
		description:
			"何が起こったか、何をしようとしていたかの詳細を教えてください。",
		placeholder:
			"例：アプリケーションをインストールしようとしていたときにこのエラーが発生しました...",
		systemInformationTitle: "システム情報",
		disclaimer: "以下のシステム情報と匿名IDがレポートに含まれます。",
		success: "レポートが正常に送信されました！",
		error: "レポートの送信に失敗しました。もう一度お試しください。",
		send: "レポートを送信",
		sending: "送信中...",
		contribute:
			"このスクリプトをすべてのデバイスと互換性を持たせるのを手伝ってください",
	},

	// quick launch component
	quickLaunch: {
		title: "クイック起動",
		addApp: "アプリを追加",
		selectApp: {
			title: "アプリを選択",
			description:
				"{count}個のアプリが利用可能です。最大{max}個まで選択できます。",
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
			connected: "サーバーに接続されました",
			disconnected: "サーバーから切断されました",
			error: {
				socket: "ソケットの設定エラー",
				install: "❌ 依存関係のインストールエラー: {error}",
			},
			allInstalled: "すべての依存関係が既にインストールされています。",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstalling: {
			title: "アンインストール中",
			deps: "依存関係をアンインストール中",
			wait: "お待ちください...",
		},
		success: {
			title: "アンインストール",
			subtitle: "完了",
			closing: "このモーダルを",
			seconds: "秒後に閉じます...",
		},
		error: {
			title: "予期しない",
			subtitle: "エラー",
			hasOccurred: "が発生しました",
			deps: "Dioneは依存関係を削除できませんでした。手動で削除してください。",
			general:
				"後でもう一度お試しください。または詳細についてはログを確認してください。",
		},
		loading: {
			title: "読み込み中...",
			wait: "お待ちください...",
		},
	},

	// logs component
	logs: {
		loading: "読み込み中...",
		disclaimer:
			"表示されているログはアプリ自体からのものです。エラーが表示された場合は、まず元のアプリの開発者に報告してください。",
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
		reload: "再読み込み",
		logs: "ログ",
	},

	// actions component
	actions: {
		reconnect: "再接続",
		start: "開始",
		uninstall: "アンインストール",
		install: "インストール",
		publishedBy: "公開者",
	},

	// promo component
	promo: {
		title: "ここで紹介されたいですか？",
		description: "コミュニティにツールを紹介",
		button: "紹介される",
	},

	// installed component
	installed: {
		title: "あなたのライブラリ",
		empty: {
			title: "インストールされているアプリケーションがありません",
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
				uploadFailed:
					"スクリプトのアップロードに失敗しました。もう一度お試しください。",
				uploadError: "スクリプトのアップロード中にエラーが発生しました。",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "スクリプトが見つかりません",
		errors: {
			notArray: "取得されたデータが配列ではありません",
			fetchFailed: "スクリプトの取得に失敗しました",
			notSupported: "残念ながら%sはあなたの%sではサポートされていません。",
			notSupportedTitle: "お使いのデバイスはサポートされていません",
		},
	},

	// search component
	search: {
		placeholder: "スクリプトを検索...",
		filters: {
			audio: "音声",
			image: "画像",
			video: "動画",
			chat: "チャット",
		},
	},
} as const;
