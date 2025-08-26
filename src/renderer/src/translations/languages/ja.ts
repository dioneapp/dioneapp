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
		title: "Dioneホワイトリストに参加する",
		description:
			"Dioneは現在開発中であり、アクセスできるユーザーは限られています。将来のバージョンのアプリにアクセスするために、今すぐホワイトリストに参加してください。",
		join: "参加する",
		logout: "ログアウト",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "ようこそ",
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
			title: "言語を選択",
		},
		ready: {
			title: "準備完了です！",
			subtitle: "ようこそお越しくださいました",
			finish: "完了",
		},
		clipboard: {
			success:
				"クリップボードに正しくコピーされました。ブラウザに貼り付けてください！",
		},
		selectPath: {
			title: "インストールパスを選択",
			button: "パスを選択",
			success: "次へ",
		},
	},

	// error handling
	error: {
		title: "予期せぬエラーが発生しました",
		description:
			"アプリケーションで予期せぬエラーが検出されました。ご不便をおかけして申し訳ございません。",
		return: "戻る",
		report: {
			toTeam: "チームに報告",
			sending: "レポートを送信中...",
			success: "レポートを送信しました！",
			failed: "レポートの送信に失敗しました",
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
				title: "共有",
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
			starting: "%s を開始中...",
			uninstalling: "%s をアンインストール中...",
			reconnecting: "%s を再接続中...",
			retrying: "%s を再試行中...",
			success: {
				stopped: "%s は正常に停止しました。",
				uninstalled: "%s は正常にアンインストールされました。",
				logsCopied: "ログは正常にクリップボードにコピーされました。",
				depsInstalled: "依存関係は正常にインストールされました。",
				shared: "ダウンロードリンクがクリップボードにコピーされました！",
			},
			error: {
				download: "ダウンロードの開始エラー: %s",
				start: "%s の開始エラー: %s",
				stop: "%s の停止エラー: %s",
				uninstall: "%s のアンインストールエラー: %s",
				serverRunning: "サーバーは既に実行中です。",
				tooManyApps:
					"スローダウンしてください！一度に6つ以上のアプリが実行されています。",
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
		tagline: "探求、インストール、革新 — 1クリックで。",
		activeApps: "アクティブなアプリ",
		update: {
			title: "アップデートが利用可能です",
			description:
				"Dioneの新しいバージョンが利用可能です。アップデートするにはアプリを再起動してください。",
			tooltip: "新しいアップデートが利用可能です。アップデートするにはDioneを再起動してください。",
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
		featured: "注目の",
		explore: "探す",
	},

	// settings page
	settings: {
		applications: {
			title: "アプリケーション",
			installationDirectory: {
				label: "インストールディレクトリ",
				description:
					"新しいアプリケーションがデフォルトでインストールされる場所を選択してください",
			},
			binDirectory: {
				label: "Binディレクトリ",
				description:
					"アプリケーションのバイナリが保存される場所を選択して、簡単にアクセスできるようにしてください",
			},
			cleanUninstall: {
				label: "クリーンアンインストール",
				description:
					"アプリケーションのアンインストール時に、関連するすべての依存関係を削除します",
			},
			autoOpenAfterInstall: {
				label: "インストール後に自動オープン",
				description:
					"インストール後に初めてアプリケーションを自動的に開きます",
			},
			deleteCache: {
				label: "キャッシュを削除",
				description: "アプリケーションのすべてのキャッシュデータを削除します",
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
				description: "希望するインターフェース言語を選択してください",
			},
			helpTranslate: "🤔 あなたの言語が表示されませんか？追加にご協力ください！",
			compactView: {
				label: "コンパクトビュー",
				description:
					"より凝縮されたレイアウトを使用して、画面により多くのコンテンツを表示します",
			},
		},
		notifications: {
			title: "通知",
			systemNotifications: {
				label: "システム通知",
				description: "重要なイベントのデスクトップ通知を表示します",
			},
			installationAlerts: {
				label: "インストールアラート",
				description: "アプリケーションのインストールが完了したときに通知を受け取ります",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "Discordのステータスに現在の活動を表示します",
			},
		},
		privacy: {
			title: "プライバシー",
			errorReporting: {
				label: "エラー報告",
				description: "匿名のエラーレポートを送信してDioneの改善にご協力ください",
			},
		},
		other: {
			title: "その他",
			disableAutoUpdate: {
				label: "自動アップデートを無効にする",
				description:
					"自動アップデートを無効にします。注意：アプリケーションが重要な修正やセキュリティパッチを見逃す可能性があります。ほとんどのユーザーにはこのオプションはお勧めしません。",
			},
			logsDirectory: {
				label: "ログディレクトリ",
				description: "アプリケーションログが保存される場所",
			},
			submitFeedback: {
				label: "フィードバックを送信",
				description: "発生した問題や不具合を報告してください",
				button: "レポートを送信",
			},
			showOnboarding: {
				label: "オンボーディングを表示",
				description:
					"Dioneを初期状態にリセットし、再構成のためにオンボーディングを再度表示します",
				button: "リセット",
			},
			variables: {
				label: "変数",
				description: "アプリケーション変数とその値を管理します",
				button: "変数を開く",
			},
		},
	},

	// report form
	report: {
		title: "問題を説明する",
		description:
			"何が起こったのか、何をしようとしていたのか、詳細を教えてください。",
		placeholder:
			"例：アプリケーションをインストールしようとしたときに、このエラーが発生しました...",
		systemInformationTitle: "システム情報",
		disclaimer:
			"以下のシステム情報と匿名IDがレポートに含まれます。",
		success: "レポートは正常に送信されました！",
		error: "レポートの送信に失敗しました。もう一度お試しください。",
		send: "レポートを送信",
		sending: "送信中...",
		contribute: "すべてのデバイスでこのスクリプトを互換性のあるものにするために貢献してください",
	},

	// quick launch component
	quickLaunch: {
		title: "クイック起動",
		addApp: "アプリを追加",
		tooltips: {
			noMoreApps: "追加できるアプリはありません",
		},
		selectApp: {
			title: "アプリを選択",
			description: "{count} 個のアプリが利用可能です。最大 {max} 個まで選択できます。",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "依存関係がいくつか不足しています！",
		installing: "依存関係をインストール中...",
		install: "インストール",
		logs: {
			initializing: "依存関係のダウンロードを初期化中...",
			loading: "読み込み中...",
			connected: "サーバーに接続しました",
			disconnected: "サーバーから切断されました",
			error: {
				socket: "ソケットの設定エラー",
				install: "❌ 依存関係のインストールエラー: {error}",
			},
			allInstalled: "すべての依存関係は既にインストールされています。",
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
			title: "アンインストール済み",
			subtitle: "正常に",
			closing: "このモーダルを閉じています",
			seconds: "秒...",
		},
		error: {
			title: "予期せぬ",
			subtitle: "エラー",
			hasOccurred: "が発生しました",
			deps: "Dioneは依存関係を削除できませんでした。手動で削除してください。",
			general: "後でもう一度お試しいただくか、ログを確認して詳細を確認してください。",
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
			"表示されているログはアプリ自体のものです。エラーが表示された場合は、まず元のアプリの開発者に報告してください。",
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
		publishedBy: "公開者",
	},

	// promo component
	promo: {
		title: "ここに掲載されたいですか？",
		description: "コミュニティにあなたのツールを紹介してください",
		button: "掲載してもらう",
	},

	// installed component
	installed: {
		title: "あなたのライブラリ",
		empty: {
			title: "インストールされているアプリケーションはありません",
			action: "今すぐインストールする",
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
			selectedFile: "選択したファイル",
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
		errors: {
			notArray: "取得したデータは配列ではありません",
			fetchFailed: "スクリプトの取得に失敗しました",
			notSupported: "残念ながら %s はあなたの %s ではサポートされていません。",
			notSupportedTitle: "お使いのデバイスは互換性がない可能性があります。",
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
} as const;