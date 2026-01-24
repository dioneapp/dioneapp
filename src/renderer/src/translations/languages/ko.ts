export const ko = {
	// common actions and states
	common: {
		cancel: "취소",
		loading: "로드 중...",
		error: "오류",
		success: "성공",
		pending: "대기 중",
		back: "뒤로",
		unselectAll: "모두 선택 해제",
		selectAll: "모두 선택",
	},

	// authentication and access related
	noAccess: {
		title: "Dione 화이트리스트 참여",
		description:
			"Dione은 현재 개발 중이며 제한된 수의 사용자만 접근할 수 있습니다. 지금 화이트리스트에 가입하여 앱의 향후 버전에 접근하세요.",
		join: "참여",
		logout: "로그아웃",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "환영합니다",
			subtitle:
				"이 여정의 초반에 우리와 함께해주셔서 감사합니다. 계정에 로그인하여 시작하세요.",
			login: "로그인",
			copyLink: "링크 복사",
			skipLogin: "로그인 없이 계속",
		},
		loggingIn: {
			title: "로그인 중...",
			authError: "인증할 수 없습니까?",
			goBack: "뒤로",
		},
		languageSelector: {
			title: "Dione 설정",
			description: "언어와 설치 경로를 선택하세요",
			languageSection: "언어",
			installationPathSection: "설치 경로",
			pathDescription:
				"이 폴더에는 설치된 모든 스크립트, 의존성 및 프로젝트 파일이 포함됩니다. 쉽게 접근할 수 있고 저장 공간이 충분한 위치를 선택하세요.",
			selectFolder: "폴더 선택",
			changeFolder: "폴더 변경",
			proceedButton: "언어 및 경로 선택",
			error: {
				spaces:
					"선택한 경로에는 공백이 포함될 수 없습니다. 다른 폴더를 선택하세요.",
				updateConfig:
					"설정을 업데이트하는 중에 오류가 발생했습니다. 다시 시도하세요.",
				samePath:
					"새 업데이트에서 오류를 피하려면 Dione 실행 파일과 다른 경로를 선택하세요.",
				general: "경로 선택 중 오류가 발생했습니다. 다시 시도하세요.",
			},
			success: "경로가 성공적으로 구성되었습니다!",
			systemLanguage: "시스템 언어",
		},
		ready: {
			title: "준비되었습니다!",
			subtitle: "Dione에 환영합니다",
			finish: "완료",
		},
		clipboard: {
			success:
				"클립보드에 올바르게 복사되었습니다. 이제 브라우저에 붙여넣으세요!",
		},
		navigation: {
			back: "뒤로",
		},
	},

	// error handling
	error: {
		title: "예기치 않은 오류가 발생했습니다",
		description:
			"애플리케이션에서 예기치 않은 오류를 감지했습니다. 불편을 드려 죄송합니다.",
		return: "돌아가기",
		report: {
			toTeam: "팀에 보고",
			report: "보고",
			submit: "보고서 제출",
			sending: "보고서 전송 중...",
			success: "보고서가 전송되었습니다!",
			failed: "보고서를 전송하지 못했습니다",
			badContent: "부적절한 콘텐츠 보고",
			badContentDescription: "다음으로, 보고에 대한 정보를 추가하세요",
		},
	},

	// account related
	account: {
		title: "계정",
		logout: "로그아웃",
		stats: {
			timeSpent: {
				title: "소요 시간",
				subtitle: "지난 7일",
			},
			sessions: {
				title: "세션",
				subtitle: "지난 7일",
			},
			shared: {
				title: "공유됨",
				subtitle: "지난 7일",
			},
			streak: {
				title: "연속",
				subtitle: "연속 일수",
				days: "일",
			},
		},
	},

	// toast notifications
	toast: {
		close: "닫기",
		install: {
			downloading: "%s 다운로드 중...",
			starting: "%s 시작 중...",
			uninstalling: "%s 제거 중...",
			reconnecting: "%s 재연결 중...",
			retrying: "%s 설치 재시도 중...",
			success: {
				stopped: "%s이(가) 성공적으로 중지되었습니다.",
				uninstalled: "%s이(가) 성공적으로 제거되었습니다.",
				logsCopied: "로그가 클립보드에 성공적으로 복사되었습니다.",
				depsInstalled: "의존성이 성공적으로 설치되었습니다.",
				shared: "다운로드 링크가 클립보드에 복사되었습니다!",
			},
			error: {
				download: "다운로드 시작 오류: %s",
				start: "%s 시작 오류: %s",
				stop: "%s 중지 오류: %s",
				uninstall: "%s 제거 오류: %s",
				serverRunning: "서버가 이미 실행 중입니다.",
				tooManyApps: "속도를 낮추세요! 이미 6개의 앱이 동시에 실행 중입니다.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "애플리케이션 중지 중...",
			description:
				"모든 열려 있는 애플리케이션을 닫은 후 Dione이 자동으로 닫힙니다.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "탐색, 설치, 혁신 — 1번의 클릭으로.",
		activeApps: "활성 앱",
		app: "앱",
		apps: "앱",
		running: "실행 중",
		update: {
			title: "업데이트 사용 가능",
			description:
				"새로운 버전의 Dione이 사용 가능합니다. 업데이트하려면 앱을 다시 시작하세요.",
			tooltip:
				"새 업데이트가 사용 가능합니다. Dione을 다시 시작하여 업데이트하세요.",
		},
		login: {
			title: "다시 환영합니다!",
			description:
				"Dione 계정에 로그인하여 모든 기능에 접근하고, 프로젝트를 동기화하고, 환경을 개인화하세요.",
			loginButton: "Dione으로 로그인",
			later: "나중에",
			waitingTitle: "로그인 대기 중...",
			waitingDescription: "브라우저에서 로그인 프로세스를 완료하여 계속하세요.",
			cancel: "취소",
		},
		tooltips: {
			library: "라이브러리",
			settings: "설정",
			account: "계정",
			logout: "로그아웃",
			login: "로그인",
			capture: "캡처",
		},
	},

	// home page
	home: {
		title: "홈",
		featured: "추천",
		explore: "탐색",
	},

	// settings page
	settings: {
		applications: {
			title: "애플리케이션",
			installationDirectory: {
				label: "설치 디렉토리",
				description: "새 애플리케이션이 기본적으로 설치될 위치를 선택하세요.",
			},
			binDirectory: {
				label: "Bin 디렉토리",
				description: "애플리케이션 이진 파일이 저장될 위치를 선택하세요.",
			},
			cleanUninstall: {
				label: "완전 제거",
				description:
					"애플리케이션을 제거할 때 관련된 모든 의존성을 제거합니다.",
			},
			autoOpenAfterInstall: {
				label: "설치 후 자동 열기",
				description: "설치 후 처음으로 애플리케이션을 자동으로 엽니다.",
			},
			deleteCache: {
				label: "캐시 삭제",
				description: "애플리케이션의 모든 캐시된 데이터를 제거합니다.",
				button: "캐시 삭제",
				deleting: "삭제 중...",
				deleted: "삭제됨",
				error: "오류",
			},
		},
		interface: {
			title: "인터페이스",
			displayLanguage: {
				label: "표시 언어",
				description: "선호하는 인터페이스 언어를 선택하세요.",
			},
			disableFeaturedVideos: {
				label: "추천 비디오 비활성화",
				description:
					"추천 앱이 애니메이션을 재생하지 않도록 합니다. 대신 부드러운 색상 그래디언트가 표시됩니다.",
			},
			helpTranslate:
				"🤔 당신의 언어가 보이지 않습니까? 더 많이 추가하는 데 도움을 주세요!",
			theme: {
				label: "테마",
				description: "애플리케이션의 색상 테마를 선택하세요.",
				themes: {
					default: "보라색 꿈",
					midnight: "자정 파란색",
					ocean: "해양 깊이",
					forest: "숲의 밤",
					sunset: "일몰 빛",
					royal: "로얄 보라색",
				},
			},
			layoutMode: {
				label: "네비게이션 레이아웃",
				description:
					"사이드바 또는 상단바 네비게이션 중에서 선택하세요. 상단바 모드는 작은 화면에 더 좋습니다.",
				sidebar: "사이드바",
				topbar: "상단바",
			},
			intenseBackgrounds: {
				label: "강렬한 배경색",
				description: "미묘한 톤 대신 더 생생한 배경색을 사용합니다.",
			},
			compactView: {
				label: "콤팩트 뷰",
				description:
					"더 압축된 레이아웃을 사용하여 화면에 더 많은 콘텐츠를 맞춥니다.",
			},
		},
		notifications: {
			title: "알림",
			systemNotifications: {
				label: "시스템 알림",
				description: "중요한 이벤트에 대한 데스크톱 알림을 표시합니다.",
			},
			installationAlerts: {
				label: "설치 경고",
				description: "애플리케이션 설치가 완료될 때 알림을 받습니다.",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "Discord 상태에 현재 활동을 표시합니다.",
			},
			successSound: {
				label: "성공 소리 활성화",
				description:
					"애플리케이션 설치가 완료될 때 재생되는 소리를 활성화합니다.",
			},
		},
		privacy: {
			title: "개인정보",
			errorReporting: {
				label: "오류 보고",
				description:
					"익명의 오류 보고서를 전송하여 Dione을 개선하는 데 도움을 주세요.",
			},
		},
		other: {
			title: "기타",
			disableAutoUpdate: {
				label: "자동 업데이트 비활성화",
				description:
					"자동 업데이트를 비활성화합니다. 주의: 애플리케이션이 중요한 수정 사항이나 보안 패치를 놓칠 수 있습니다. 대부분의 사용자에게는 이 옵션을 권장하지 않습니다.",
			},
			logsDirectory: {
				label: "로그 디렉토리",
				description: "애플리케이션 로그가 저장되는 위치입니다.",
			},
			exportLogs: {
				label: "디버그 로그 내보내기",
				description: "모든 로그 및 시스템 정보를 zip 파일로 내보냅니다.",
				button: "로그 내보내기",
			},
			submitFeedback: {
				label: "피드백 제출",
				description: "발견한 문제를 보고하세요.",
				button: "보고서 전송",
			},
			showOnboarding: {
				label: "온보딩 표시",
				description:
					"Dione을 초기 상태로 복원하고 온보딩을 다시 표시하여 재구성하세요.",
				button: "재설정",
			},
			variables: {
				label: "변수",
				description: "애플리케이션 변수 및 값을 관리합니다.",
				button: "변수 열기",
			},
			checkUpdates: {
				label: "업데이트 확인",
				description:
					"업데이트를 확인하고 새 버전이 사용 가능할 때 알림을 받습니다.",
				button: "업데이트 확인",
			},
		},
	},

	// report form
	report: {
		title: "문제 설명",
		description: "발생한 상황과 시도하던 작업에 대해 자세히 설명해주세요.",
		placeholder:
			"예: 애플리케이션을 설치하려고 할 때 이 오류가 발생했습니다...",
		systemInformationTitle: "시스템 정보",
		disclaimer: "다음 시스템 정보와 익명의 ID가 보고서에 포함됩니다.",
		success: "보고서가 성공적으로 전송되었습니다!",
		error: "보고서를 전송하지 못했습니다. 다시 시도하세요.",
		send: "보고서 전송",
		sending: "전송 중...",
		contribute: "이 스크립트를 모든 장치와 호환되도록 하는 데 도움을 주세요",
	},

	// quick launch component
	quickLaunch: {
		title: "빠른 실행",
		addApp: "앱 추가",
		tooltips: {
			noMoreApps: "추가할 수 있는 앱이 없습니다",
		},
		selectApp: {
			title: "앱 선택",
			description:
				"{count}개의 앱을 사용할 수 있습니다. {max}개까지 선택할 수 있습니다.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "일부 의존성이 누락되었습니다!",
		installing: "의존성 설치 중...",
		install: "설치",
		logs: {
			initializing: "의존성 다운로드 초기화 중...",
			loading: "로드 중...",
			connected: "서버에 연결됨",
			disconnected: "서버에서 연결 끊김",
			error: {
				socket: "소켓 설정 오류",
				install: "❌ 의존성 설치 오류: {error}",
			},
			allInstalled: "모든 의존성이 이미 설치되어 있습니다.",
		},
	},

	// install AI modal
	installAI: {
		step1: {
			title: "디오 AI를 만나세요",
			description:
				"Dione에 직접 통합된 지능형 어시스턴트입니다. 애플리케이션과 상호작용하는 새로운 방법을 경험하세요.",
		},
		step2: {
			title: "기능",
			description: "필요한 모든 것이 여기 있습니다.",
			features: {
				free: {
					title: "무료 사용",
					description: "구독이나 숨겨진 요금이 없습니다.",
				},
				local: {
					title: "로컬 처리",
					description: "하드웨어에서 완전히 실행됩니다.",
				},
				private: {
					title: "비공개 및 안전",
					description: "데이터가 장치를 떠나지 않습니다.",
				},
			},
		},
		step3: {
			title: "Ollama 설치",
			description: "디오 AI는 Ollama를 사용하여 시스템 내 LLM과 작동합니다.",
			installing: "설치 중...",
			startingDownload: "다운로드 시작 중...",
			installNow: "지금 설치",
		},
		back: "뒤로",
		next: "다음",
	},

	// delete loading modal
	deleteLoading: {
		confirm: {
			title: "제거 확인",
			subtitle: "제거할 항목 선택",
		},
		dependencies: "의존성",
		depsDescription: "애플리케이션과 함께 제거할 의존성을 선택하세요:",
		uninstall: {
			title: "제거",
			deps: "의존성 제거",
			wait: "잠시 기다려주세요...",
		},
		uninstalling: {
			title: "제거 중",
			deps: "의존성 제거 중",
			wait: "잠시 기다려주세요...",
		},
		processing: "처리 중...",
		success: {
			title: "제거됨",
			subtitle: "성공",
			closing: "이 모달 닫기",
			seconds: "초...",
		},
		autoClosing: "자동으로 닫는 중...",
		error: {
			title: "예기치 않은",
			subtitle: "오류",
			hasOccurred: "가 발생했습니다",
			deps: "Dione이 의존성을 제거하지 못했습니다. 수동으로 제거해주세요.",
			general: "나중에 다시 시도하거나 로그에서 더 많은 정보를 확인하세요.",
		},
		loading: {
			title: "로드 중...",
			wait: "잠시 기다려주세요...",
		},
	},

	// logs component
	logs: {
		loading: "로드 중...",
		openPreview: "미리보기 열기",
		copyLogs: "로그 복사",
		stop: "중지",
		disclaimer:
			"표시된 로그는 앱 자체에서 나온 것입니다. 오류가 보이면 먼저 원본 앱의 개발자에게 보고하세요.",
		status: {
			success: "성공",
			error: "오류",
			pending: "대기 중",
		},
	},

	// loading states
	loading: {
		text: "로드 중...",
	},

	// iframe component
	iframe: {
		back: "뒤로",
		openFolder: "폴더 열기",
		openInBrowser: "브라우저에서 열기",
		openNewWindow: "새 창으로 열기",
		fullscreen: "전체 화면",
		stop: "중지",
		reload: "새로고침",
		logs: "로그",
	},

	// actions component
	actions: {
		reconnect: "재연결",
		start: "시작",
		uninstall: "제거",
		install: "설치",
		publishedBy: "게시자",
		installed: "설치됨",
		notInstalled: "설치되지 않음",
	},

	// promo component
	promo: {
		title: "여기서 주목받고 싶으십니까?",
		description: "커뮤니티에 도구를 소개하세요",
		button: "주목받기",
	},

	// installed component
	installed: {
		title: "내 라이브러리",
		empty: {
			title: "설치된 애플리케이션이 없습니다",
			action: "지금 설치하세요",
		},
	},

	// local component
	local: {
		title: "로컬 스크립트",
		upload: "스크립트 업로드",
		noScripts: "스크립트를 찾을 수 없습니다",
		deleting: "스크립트 삭제 중, 잠시 기다려주세요...",
		uploadModal: {
			title: "스크립트 업로드",
			selectFile: "파일을 선택하려면 클릭하세요",
			selectedFile: "선택된 파일",
			scriptName: "스크립트 이름",
			scriptDescription: "스크립트 설명 (선택 사항)",
			uploadFile: "파일 업로드",
			uploading: "업로드 중...",
			errors: {
				uploadFailed: "스크립트를 업로드하지 못했습니다. 다시 시도하세요.",
				uploadError: "스크립트 업로드 중 오류가 발생했습니다.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "스크립트를 찾을 수 없습니다",
		loadingMore: "더 로드 중...",
		reachedEnd: "끝에 도달했습니다.",
		notEnoughApps: "앱이 충분하지 않다고 생각하면,",
		helpAddMore: "더 많이 추가하는 데 도움을 주세요",
		viewingCached:
			"오프라인입니다. 캐시된 콘텐츠를 보고 있습니다. 설치 기능이 비활성화되어 있습니다.",
		errors: {
			notArray: "가져온 데이터가 배열이 아닙니다",
			fetchFailed: "스크립트를 가져올 수 없습니다",
			notSupported: "안타깝게도 %s은(는) 당신의 %s에서 지원되지 않습니다.",
			notSupportedTitle: "당신의 장치가 호환되지 않을 수 있습니다.",
		},
	},

	// search component
	search: {
		placeholder: "스크립트 검색...",
		filters: {
			audio: "오디오",
			image: "이미지",
			video: "비디오",
			chat: "채팅",
		},
	},

	// network share modal
	networkShare: {
		title: "공유",
		modes: {
			local: "로컬",
			public: "공개",
			connecting: "연결 중...",
		},
		warning: {
			title: "공개 액세스",
			description:
				"어디서나 접근할 수 있는 공개 URL을 만듭니다. 신뢰할 수 있는 사람과만 공유하세요.",
		},
		local: {
			shareUrl: "공유 URL",
			urlDescription: "로컬 네트워크의 장치와 이 URL을 공유하세요",
			localNetwork: "로컬 네트워크:",
			description: "이 URL은 동일한 네트워크에 연결된 장치에서 작동합니다.",
		},
		public: {
			shareUrl: "공개 URL",
			urlDescription: "이 URL을 전 세계 누구와나 공유하세요",
			passwordTitle: "첫 비밀번호",
			visitorMessage:
				"방문자는 터널에 접근하기 위해 장치당 한 번 이를 입력해야 할 수 있습니다.",
			stopSharing: "공유 중지",
		},
		errors: {
			noAddress: "네트워크 주소를 가져올 수 없습니다. 연결을 확인하세요.",
			loadFailed: "네트워크 정보를 로드하지 못했습니다.",
			noUrl: "복사할 수 있는 URL이 없습니다.",
			copyFailed: "클립보드에 복사하지 못했습니다.",
			tunnelFailed: "터널을 시작하지 못했습니다",
		},
	},

	// login features modal
	loginFeatures: {
		title: "기능을 놓치고 있습니다",
		description: "Dione에 로그인하여 이 기능을 놓치지 마세요.",
		login: "로그인",
		skip: "건너뛰기",
		features: {
			customReports: {
				title: "맞춤 보고서 전송",
				description:
					"애플리케이션 내에서 맞춤 보고서를 전송하여 오류 발생 시 지원을 더 빠르게 합니다.",
			},
			createProfile: {
				title: "프로필 만들기",
				description:
					"Dione 커뮤니티용 프로필을 만들어 우리가 당신을 알도록 하세요.",
			},
			syncData: {
				title: "데이터 동기화",
				description: "모든 장치에서 데이터를 동기화합니다.",
			},
			earlyBirds: {
				title: "Early bird 업데이트 받기",
				description:
					"다른 누구보다 먼저 Early bird 업데이트 및 새 기능을 받으세요.",
			},
			giveOutLikes: {
				title: "좋아요 주기",
				description:
					"가장 좋아하는 앱에 좋아요를 주어 더 많은 사람들이 사용하도록 하세요!",
			},
			publishScripts: {
				title: "스크립트 게시",
				description: "스크립트를 게시하고 전 세계와 공유합니다.",
			},
			achieveGoals: {
				title: "목표 달성",
				description:
					"Dione을 7일 동안 사용하는 등의 목표를 달성하여 무료 선물을 받으세요",
			},
			getNewswire: {
				title: "뉴스와이어 받기",
				description:
					"새로운 기능을 놓치지 않도록 이메일을 통해 업데이트를 받으세요.",
			},
		},
	},

	// editor component
	editor: {
		selectFile: "편집을 시작할 파일을 선택하세요",
		previewNotAvailable: "이 파일에 대해 미리보기를 사용할 수 없습니다.",
		mediaNotSupported:
			"이 미디어 유형에 대한 미리보기는 아직 지원되지 않습니다.",
		previewOnly: "미리보기만",
		unsaved: "저장되지 않음",
		retry: "재시도",
		editorLabel: "편집기",
	},

	// sidebar links
	links: {
		discord: "Discord",
		github: "GitHub",
		dione: "Dione",
		builtWith: "만든이",
	},

	// update notifications
	updates: {
		later: "나중에",
		install: "설치",
	},

	// iframe actions
	iframeActions: {
		shareOnNetwork: "네트워크에서 공유",
	},

	// version info
	versions: {
		node: "Node",
		electron: "Electron",
		chromium: "Chromium",
	},

	// connection messages
	connection: {
		retryLater: "연결 문제가 발생하고 있습니다. 나중에 다시 시도해주세요.",
	},

	// variables modal
	variables: {
		title: "환경 변수",
		addKey: "키 추가",
		searchPlaceholder: "변수 검색...",
		keyPlaceholder: "키 (예: MY_VAR)",
		valuePlaceholder: "값",
		copyAll: "모두 클립보드에 복사",
		confirm: "확인",
		copyPath: "경로 복사",
		copyFullValue: "전체 값 복사",
		deleteKey: "키 삭제",
	},

	// custom commands modal
	customCommands: {
		title: "맞춤 매개변수로 실행",
		launch: "실행",
	},

	// context menu
	contextMenu: {
		copyPath: "경로 복사",
		open: "열기",
		reload: "새로고침",
		rename: "이름 바꾸기",
		delete: "삭제",
	},

	// file tree
	fileTree: {
		noFiles: "이 워크스페이스에서 파일을 찾을 수 없습니다.",
		media: "미디어",
		binary: "이진",
	},

	// entry name dialog
	entryDialog: {
		name: "이름",
		createFile: "파일 만들기",
		createFolder: "폴더 만들기",
		renameFile: "파일 이름 바꾸기",
		renameFolder: "폴더 이름 바꾸기",
		createInRoot: "이것은 워크스페이스 루트에 생성됩니다.",
		createInside: "이것은 {path} 내에 생성됩니다.",
		currentLocation: "현재 위치: {path}.",
		currentLocationRoot: "현재 위치: 워크스페이스 루트.",
		rename: "이름 바꾸기",
		placeholderFile: "example.ts",
		placeholderFolder: "새 폴더",
	},

	// workspace editor
	workspaceEditor: {
		newFile: "새 파일",
		newFolder: "새 폴더",
		retry: "재시도",
		back: "뒤로",
		save: "저장",
		openInExplorer: "탐색기에서 열기",
		resolvingPath: "경로 확인 중...",
		workspace: "워크스페이스",
	},

	// header bar
	headerBar: {
		back: "뒤로",
		openInExplorer: "탐색기에서 열기",
		save: "저장",
	},

	// settings page footer
	settingsFooter: {
		builtWithLove: "♥로 만들어졌습니다",
		getDioneWebsite: "getdione.app",
		version: "버전",
		port: "포트",
	},

	// notifications
	notifications: {
		enabled: {
			title: "알림 활성화됨",
			description: "중요한 이벤트에 대한 알림을 받게 됩니다.",
		},
		learnMore: "자세히 알아보기",
	},

	// language selector
	languageSelector: {
		next: "다음",
	},

	// onboarding - select path
	selectPath: {
		chooseLocation: "설치 위치 선택",
		changePath: "경로 변경",
	},

	// browser compatibility
	browserCompatibility: {
		audioNotSupported: "브라우저에서 오디오 요소를 지원하지 않습니다.",
		videoNotSupported: "브라우저에서 비디오 요소를 지원하지 않습니다.",
	},

	// library card
	library: {
		official: "공식",
	},

	// sidebar updates
	sidebarUpdate: {
		newUpdateAvailable: "새 업데이트 사용 가능",
		whatsNew: "새로운 기능",
	},

	// iframe component labels
	iframeLabels: {
		back: "뒤로",
		logs: "로그",
		disk: "디스크",
		editor: "편집기",
	},

	// progress component
	progress: {
		running: "실행 중...",
	},

	// toast messages
	toastMessages: {
		copiedToClipboard: "클립보드에 복사됨!",
		keyAndValueRequired: "키와 값이 필요합니다",
		variableAdded: "변수가 추가됨",
		failedToAddVariable: "변수를 추가하지 못했습니다",
		variableRemoved: "변수가 제거됨",
		failedToRemoveVariable: "변수를 제거하지 못했습니다",
		valueRemoved: "값이 제거됨",
		failedToRemoveValue: "값을 제거하지 못했습니다",
		pathCopiedToClipboard: "경로가 클립보드에 복사됨",
		failedToCopyPath: "경로를 복사하지 못했습니다",
		unableToOpenLocation: "위치를 열 수 없습니다",
		cannotDeleteWorkspaceRoot: "워크스페이스 루트를 삭제할 수 없습니다",
		deleted: "삭제됨",
		failedToDeleteEntry: "항목을 삭제하지 못했습니다",
		workspaceNotAvailable: "워크스페이스를 사용할 수 없습니다",
		selectFileOrFolderToRename: "이름을 바꿀 파일 또는 폴더를 선택하세요",
		cannotRenameWorkspaceRoot: "워크스페이스 루트의 이름을 바꿀 수 없습니다",
		entryRenamed: "항목의 이름이 바뀜",
		fileSavedSuccessfully: "파일이 성공적으로 저장됨",
		failedToSaveFile: "파일을 저장하지 못했습니다",
		mediaFilesCannotBeOpened: "미디어 파일은 편집기에서 열 수 없습니다.",
		binaryFilesCannotBeOpened:
			"이진 및 실행 가능 파일은 편집기에서 열 수 없습니다.",
		thisFileTypeCannotBeEdited: "이 파일 유형은 아직 편집할 수 없습니다.",
	},

	// error messages
	errorMessages: {
		workspaceNotFound: "워크스페이스를 찾을 수 없습니다",
		failedToLoadWorkspace: "워크스페이스를 로드하지 못했습니다",
		failedToLoadDirectory: "디렉토리를 로드하지 못했습니다",
		unableToOpenWorkspace: "워크스페이스를 열 수 없습니다",
		failedToLoadFile: "파일을 로드하지 못했습니다",
		nameCannotBeEmpty: "이름은 비어있을 수 없습니다",
		nameContainsInvalidCharacters:
			"이름에 유효하지 않은 문자가 포함되어 있습니다",
		failedToCreateEntry: "항목을 만들지 못했습니다",
		failedToRenameEntry: "항목의 이름을 바꾸지 못했습니다",
	},

	// file operations
	fileOperations: {
		fileCreated: "파일이 만들어짐",
		folderCreated: "폴더가 만들어짐",
		untitledFile: "untitled.txt",
		newFolder: "새 폴더",
	},

	// confirmation dialogs
	confirmDialogs: {
		removeValue: "제거하시겠습니까",
		thisValue: "이 값",
		keyAndAllValues: "키 및 모든 값",
		from: "에서",
	},

	// network share modal
	networkShareErrors: {
		failedToLoadNetworkInfo: "네트워크 정보를 로드하지 못했습니다.",
		failedToStartTunnel: "터널을 시작하지 못했습니다",
		failedToCopyToClipboard: "클립보드에 복사하지 못했습니다.",
	},

	// feed component
	feedErrors: {
		invalidDataFormat: "API에서 잘못된 데이터 형식",
		failedToFetchScripts: "스크립트를 가져올 수 없습니다",
		offline: "오프라인이며 사용 가능한 캐시된 콘텐츠가 없습니다.",
	},

	// upload script modal
	uploadScript: {
		fileLoadedLocally: "파일이 로컬로 로드됨",
	},

	// running apps
	runningApps: {
		running: "실행 중",
		thereIsAnAppRunningInBackground:
			"백그라운드에서 실행 중인 애플리케이션이 있습니다.",
		failedToReloadQuickLaunch: "빠른 실행 앱을 다시 로드하지 못했습니다",
		failedToFetchInstalledApps: "설치된 앱을 가져올 수 없습니다",
	},
} as const;
