export const vi = {
	// common actions and states
	common: {
		cancel: "Hủy",
		loading: "Đang tải...",
		error: "Lỗi",
		success: "Thành công",
		pending: "Đang chờ",
		back: "Quay lại",
		unselectAll: "Bỏ chọn tất cả",
		selectAll: "Chọn tất cả",
	},

	// authentication and access related
	noAccess: {
		title: "Tham gia danh sách trắng Dione",
		description:
			"Dione đang được phát triển và chỉ một số lượng hạn chế người dùng có thể truy cập, hãy tham gia danh sách trắng của chúng tôi ngay bây giờ để có quyền truy cập vào các phiên bản tương lai của ứng dụng.",
		join: "Tham gia",
		logout: "Đăng xuất",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Chào mừng đến",
			subtitle:
				"Cảm ơn bạn đã tham gia sớm hành trình này. Đăng nhập vào tài khoản của bạn để bắt đầu.",
			login: "Đăng nhập",
			copyLink: "Sao chép liên kết",
			skipLogin: "Tiếp tục mà không đăng nhập",
		},
		loggingIn: {
			title: "Đang đăng nhập...",
			authError: "Không thể xác thực?",
			goBack: "Quay lại",
		},
		languageSelector: {
			title: "Thiết lập Dione",
			description: "Chọn ngôn ngữ và đường dẫn cài đặt của bạn",
			languageSection: "Ngôn ngữ",
			installationPathSection: "Đường dẫn cài đặt",
			pathDescription:
				"Thư mục này sẽ chứa tất cả các tập lệnh đã cài đặt, phụ thuộc và tệp dự án của bạn. Chọn một vị trí dễ tiếp cận và có đủ dung lượng lưu trữ.",
			selectFolder: "Chọn thư mục",
			changeFolder: "Thay đổi thư mục",
			proceedButton: "Chọn ngôn ngữ & đường dẫn",
			error: {
				spaces:
					"Đường dẫn đã chọn không thể chứa khoảng trắng. Vui lòng chọn thư mục khác.",
				updateConfig:
					"Đã xảy ra lỗi khi cập nhật cấu hình. Vui lòng thử lại.",
				samePath:
					"Để tránh lỗi khi cập nhật, hãy chọn đường dẫn khác với tệp thực thi Dione.",
				general:
					"Đã xảy ra lỗi khi chọn đường dẫn. Vui lòng thử lại.",
			},
			success: "Đường dẫn được cấu hình thành công!",
			systemLanguage: "Ngôn ngữ hệ thống",
		},
		ready: {
			title: "Bạn đã sẵn sàng!",
			subtitle: "Chào mừng đến Dione",
			finish: "Hoàn thành",
		},
		clipboard: {
			success:
				"Sao chép vào clipboard thành công, giờ hãy dán nó trong trình duyệt của bạn!",
		},
		navigation: {
			back: "Quay lại",
		},
	},

	// error handling
	error: {
		title: "Đã xảy ra lỗi bất ngờ",
		description:
			"Chúng tôi đã phát hiện lỗi bất ngờ trong ứng dụng, chúng tôi xin lỗi vì sự bất tiện này.",
		return: "Quay lại",
		report: {
			toTeam: "Báo cáo cho nhóm",
			report: "Báo cáo",
			submit: "Gửi báo cáo",
			sending: "Đang gửi báo cáo...",
			success: "Báo cáo đã gửi!",
			failed: "Không thể gửi báo cáo",
			badContent: "Báo cáo nội dung không phù hợp",
			badContentDescription: "Tiếp theo, thêm thông tin về báo cáo của bạn vào",
		},
	},

	// account related
	account: {
		title: "Tài khoản",
		logout: "Đăng xuất",
		stats: {
			timeSpent: {
				title: "Thời gian sử dụng",
				subtitle: "trong 7 ngày qua",
			},
			sessions: {
				title: "Phiên",
				subtitle: "trong 7 ngày qua",
			},
			shared: {
				title: "Chia sẻ",
				subtitle: "trong 7 ngày qua",
			},
			streak: {
				title: "Chuỗi",
				subtitle: "ngày liên tiếp",
				days: "ngày",
			},
		},
	},

	// toast notifications
	toast: {
		close: "Đóng",
		install: {
			downloading: "Đang tải %s...",
			starting: "Đang khởi động %s...",
			uninstalling: "Đang gỡ cài đặt %s...",
			reconnecting: "Đang kết nối lại %s...",
			retrying: "Đang cố gắng cài đặt %s...",
			success: {
				stopped: "%s đã dừng thành công.",
				uninstalled: "%s đã gỡ cài đặt thành công.",
				logsCopied: "Nhật ký đã sao chép vào clipboard thành công.",
				depsInstalled: "Phụ thuộc đã cài đặt thành công.",
				shared: "Liên kết tải xuống đã sao chép vào clipboard!",
			},
			error: {
				download: "Lỗi bắt đầu tải: %s",
				start: "Lỗi bắt đầu %s: %s",
				stop: "Lỗi dừng %s: %s",
				uninstall: "Lỗi gỡ cài đặt %s: %s",
				serverRunning: "Máy chủ đang chạy.",
				tooManyApps:
					"Chậm lại! Bạn đã có 6 ứng dụng chạy cùng lúc.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Đang dừng ứng dụng...",
			description:
				"Dione sẽ đóng tự động sau khi đóng tất cả các ứng dụng mở.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Khám phá, Cài đặt, Đổi mới — trong 1 Click.",
		activeApps: "Ứng dụng hoạt động",
		app: "ứng dụng",
		apps: "ứng dụng",
		running: "đang chạy",
		update: {
			title: "Có bản cập nhật",
			description:
				"Phiên bản mới của Dione có sẵn, vui lòng khởi động lại ứng dụng để cập nhật.",
			tooltip: "Có bản cập nhật mới, vui lòng khởi động lại Dione để cập nhật.",
		},
		login: {
			title: "Chào mừng trở lại!",
			description:
				"Đăng nhập vào tài khoản Dione của bạn để truy cập tất cả các tính năng, đồng bộ hóa dự án và cá nhân hóa trải nghiệm của bạn.",
			loginButton: "Đăng nhập bằng Dione",
			later: "Có thể sau",
			waitingTitle: "Đang chờ đăng nhập...",
			waitingDescription:
				"Hoàn thành quá trình đăng nhập trong trình duyệt của bạn để tiếp tục.",
			cancel: "Hủy",
		},
		tooltips: {
			library: "Thư viện",
			settings: "Cài đặt",
			account: "Tài khoản",
			logout: "Đăng xuất",
			login: "Đăng nhập",
			capture: "Chụp",
		},
	},

	// home page
	home: {
		title: "Trang chủ",
		featured: "Nổi bật",
		explore: "Khám phá",
	},

	// settings page
	settings: {
		applications: {
			title: "Ứng dụng",
			installationDirectory: {
				label: "Thư mục cài đặt",
				description:
					"Chọn nơi các ứng dụng mới sẽ được cài đặt theo mặc định.",
			},
			binDirectory: {
				label: "Thư mục Bin",
				description:
					"Chọn nơi các tệp nhị phân ứng dụng sẽ được lưu trữ để dễ dàng truy cập.",
			},
			cleanUninstall: {
				label: "Gỡ cài đặt sạch",
				description:
					"Loại bỏ tất cả các phụ thuộc liên quan khi gỡ cài đặt ứng dụng.",
			},
			autoOpenAfterInstall: {
				label: "Tự động mở sau khi cài đặt",
				description:
					"Tự động mở ứng dụng lần đầu tiên sau khi cài đặt.",
			},
			deleteCache: {
				label: "Xóa bộ nhớ đệm",
				description: "Xóa tất cả dữ liệu được lưu trong bộ nhớ đệm từ các ứng dụng.",
				button: "Xóa bộ nhớ đệm",
				deleting: "Đang xóa...",
				deleted: "Đã xóa",
				error: "Lỗi",
			},
		},
		interface: {
			title: "Giao diện",
			displayLanguage: {
				label: "Ngôn ngữ hiển thị",
				description: "Chọn ngôn ngữ giao diện ưa thích của bạn.",
			},
			disableFeaturedVideos: {
				label: "Tắt video nổi bật",
				description:
					"Dừng các ứng dụng nổi bật phát hoạt ảnh. Sẽ hiển thị gradient màu mịn thay thế",
			},
			helpTranslate: "🤔 Không thấy ngôn ngữ của bạn? Giúp chúng tôi thêm nữa!",
			theme: {
				label: "Chủ đề",
				description: "Chọn chủ đề màu cho ứng dụng.",
				themes: {
					default: "Purple Dream",
					midnight: "Midnight Blue",
					ocean: "Ocean Depths",
					forest: "Forest Night",
					sunset: "Sunset Glow",
					royal: "Royal Purple",
				},
			},
			layoutMode: {
				label: "Bố cục điều hướng",
				description:
					"Chọn giữa điều hướng thanh bên hoặc thanh trên cùng. Chế độ thanh trên cùng tốt hơn cho các màn hình nhỏ.",
				sidebar: "Thanh bên",
				topbar: "Thanh trên cùng",
			},
			intenseBackgrounds: {
				label: "Màu nền rực rỡ",
				description:
					"Sử dụng màu nền rực rỡ hơn thay vì các tones tinh tế.",
			},
			compactView: {
				label: "Chế độ xem nén",
				description:
					"Sử dụng bố cục nén hơn để phù hợp với nhiều nội dung hơn trên màn hình.",
			},
		},
		notifications: {
			title: "Thông báo",
			systemNotifications: {
				label: "Thông báo hệ thống",
				description: "Hiển thị thông báo màn hình nền cho các sự kiện quan trọng.",
			},
			installationAlerts: {
				label: "Cảnh báo cài đặt",
				description: "Nhận thông báo khi cài đặt ứng dụng hoàn tất.",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "Hiển thị hoạt động hiện tại của bạn trong trạng thái Discord.",
			},
			successSound: {
				label: "Bật âm thanh thành công",
				description:
					"Bật âm thanh phát khi ứng dụng hoàn tất cài đặt.",
			},
		},
		privacy: {
			title: "Quyền riêng tư",
			errorReporting: {
				label: "Báo cáo lỗi",
				description: "Giúp cải thiện Dione bằng cách gửi báo cáo lỗi ẩn danh.",
			},
		},
		other: {
			title: "Khác",
			disableAutoUpdate: {
				label: "Tắt tự động cập nhật",
				description:
					"Tắt cập nhật tự động. Cảnh báo: ứng dụng của bạn có thể bỏ lỡ các bản sửa lỗi quan trọng hoặc các bản vá bảo mật. Tùy chọn này không được khuyên dùng cho hầu hết người dùng.",
			},
			logsDirectory: {
				label: "Thư mục nhật ký",
				description: "Vị trí nơi các nhật ký ứng dụng được lưu trữ.",
			},
			exportLogs: {
				label: "Xuất nhật ký gỡ lỗi",
				description:
					"Xuất tất cả nhật ký và thông tin hệ thống trong tệp zip để gỡ lỗi.",
				button: "Xuất nhật ký",
			},
			submitFeedback: {
				label: "Gửi phản hồi",
				description: "Báo cáo bất kỳ vấn đề nào bạn gặp phải.",
				button: "Gửi báo cáo",
			},
			showOnboarding: {
				label: "Hiển thị hướng dẫn",
				description:
					"Đặt lại Dione về trạng thái ban đầu và hiển thị lại hướng dẫn để cấu hình lại.",
				button: "Đặt lại",
			},
			variables: {
				label: "Biến",
				description: "Quản lý các biến ứng dụng và giá trị của chúng.",
				button: "Mở biến",
			},
			checkUpdates: {
				label: "Kiểm tra cập nhật",
				description:
					"Kiểm tra cập nhật và thông báo cho bạn khi có phiên bản mới.",
				button: "Kiểm tra cập nhật",
			},
		},
	},

	// report form
	report: {
		title: "Mô tả sự cố",
		description:
			"Vui lòng cung cấp chi tiết về những gì đã xảy ra và những gì bạn đang cố gắng làm.",
		placeholder:
			"Ví dụ: Tôi đang cố gắng cài đặt một ứng dụng khi lỗi này xảy ra...",
		systemInformationTitle: "Thông tin hệ thống",
		disclaimer:
			"Thông tin hệ thống sau đây và ID ẩn danh sẽ được bao gồm trong báo cáo của bạn.",
		success: "Báo cáo đã gửi thành công!",
		error: "Không thể gửi báo cáo. Vui lòng thử lại.",
		send: "Gửi báo cáo",
		sending: "Đang gửi...",
		contribute: "Giúp chúng tôi làm cho tập lệnh này tương thích với tất cả các thiết bị",
	},

	// quick launch component
	quickLaunch: {
		title: "Khởi động nhanh",
		addApp: "Thêm ứng dụng",
		tooltips: {
			noMoreApps: "Không có ứng dụng khác để thêm",
		},
		selectApp: {
			title: "Chọn ứng dụng",
			description: "{count} ứng dụng có sẵn. Bạn có thể chọn tối đa {max}.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "Một số phụ thuộc bị thiếu!",
		installing: "Đang cài đặt phụ thuộc...",
		install: "Cài đặt",
		logs: {
			initializing: "Đang khởi tạo tải xuống phụ thuộc...",
			loading: "Đang tải...",
			connected: "Đã kết nối với máy chủ",
			disconnected: "Ngắt kết nối với máy chủ",
			error: {
				socket: "Lỗi thiết lập socket",
				install: "❌ Lỗi cài đặt phụ thuộc: {error}",
			},
			allInstalled: "Tất cả phụ thuộc đã được cài đặt.",
		},
	},

	// install AI modal
	installAI: {
		step1: {
			title: "Gặp Dio AI",
			description:
				"Trợ lý thông minh của bạn được tích hợp trực tiếp vào Dione. Trải nghiệm một cách mới để tương tác với ứng dụng của bạn.",
		},
		step2: {
			title: "Tính năng",
			description: "Mọi thứ bạn cần, ngay tại đây.",
			features: {
				free: {
					title: "Miễn phí sử dụng",
					description: "Không có đăng ký hoặc phí ẩn.",
				},
				local: {
					title: "Xử lý cục bộ",
					description: "Chạy hoàn toàn trên phần cứng của bạn.",
				},
				private: {
					title: "Riêng tư & Bảo mật",
					description: "Dữ liệu của bạn không bao giờ rời khỏi thiết bị của bạn.",
				},
			},
		},
		step3: {
			title: "Cài đặt Ollama",
			description: "Dio AI sử dụng Ollama để làm việc với LLMs trong hệ thống của bạn.",
			installing: "Đang cài đặt...",
			startingDownload: "Bắt đầu tải xuống...",
			installNow: "Cài đặt ngay",
		},
		back: "Quay lại",
		next: "Tiếp theo",
	},

	// delete loading modal
	deleteLoading: {
		confirm: {
			title: "Xác nhận gỡ cài đặt",
			subtitle: "Chọn những gì cần xóa",
		},
		dependencies: "Phụ thuộc",
		depsDescription:
			"Chọn phụ thuộc để gỡ cài đặt cùng với ứng dụng:",
		uninstall: {
			title: "Gỡ cài đặt",
			deps: "Gỡ cài đặt phụ thuộc",
			wait: "vui lòng chờ...",
		},
		uninstalling: {
			title: "Đang gỡ cài đặt",
			deps: "Đang gỡ cài đặt phụ thuộc",
			wait: "Vui lòng chờ...",
		},
		processing: "Đang xử lý...",
		success: {
			title: "Đã gỡ cài đặt",
			subtitle: "thành công",
			closing: "Đóng modal này trong",
			seconds: "giây...",
		},
		autoClosing: "Đang đóng tự động...",
		error: {
			title: "Một lỗi bất ngờ",
			subtitle: "lỗi",
			hasOccurred: "đã xảy ra",
			deps: "Dione không thể loại bỏ bất kỳ phụ thuộc nào, vui lòng thực hiện thủ công.",
			general: "Vui lòng thử lại sau hoặc kiểm tra nhật ký để biết thêm thông tin.",
		},
		loading: {
			title: "Đang tải...",
			wait: "Vui lòng chờ...",
		},
	},

	// logs component
	logs: {
		loading: "Đang tải...",
		openPreview: "Mở xem trước",
		copyLogs: "Sao chép nhật ký",
		stop: "Dừng",
		disclaimer:
			"Nhật ký hiển thị là từ ứng dụng chính nó. Nếu bạn thấy lỗi, vui lòng báo cáo cho các nhà phát triển ứng dụng gốc trước.",
		status: {
			success: "Thành công",
			error: "Lỗi",
			pending: "Đang chờ",
		},
	},

	// loading states
	loading: {
		text: "Đang tải...",
	},

	// iframe component
	iframe: {
		back: "Quay lại",
		openFolder: "Mở thư mục",
		openInBrowser: "Mở trong trình duyệt",
		openNewWindow: "Mở cửa sổ mới",
		fullscreen: "Toàn màn hình",
		stop: "Dừng",
		reload: "Tải lại",
		logs: "Nhật ký",
	},

	// actions component
	actions: {
		reconnect: "Kết nối lại",
		start: "Bắt đầu",
		uninstall: "Gỡ cài đặt",
		install: "Cài đặt",
		publishedBy: "Được xuất bản bởi",
		installed: "Đã cài đặt",
		notInstalled: "Chưa cài đặt",
	},

	// promo component
	promo: {
		title: "Muốn được nổi bật ở đây?",
		description: "Giới thiệu công cụ của bạn cho cộng đồng của chúng tôi",
		button: "Được nổi bật",
	},

	// installed component
	installed: {
		title: "Thư viện của bạn",
		empty: {
			title: "Bạn không có ứng dụng nào được cài đặt",
			action: "Cài đặt ứng dụng ngay",
		},
	},

	// local component
	local: {
		title: "Tập lệnh cục bộ",
		upload: "Tải lên tập lệnh",
		noScripts: "Không tìm thấy tập lệnh",
		deleting: "Đang xóa tập lệnh, vui lòng chờ...",
		uploadModal: {
			title: "Tải lên tập lệnh",
			selectFile: "Nhấp để chọn tệp",
			selectedFile: "Tệp được chọn",
			scriptName: "Tên tập lệnh",
			scriptDescription: "Mô tả tập lệnh (không bắt buộc)",
			uploadFile: "Tải lên tệp",
			uploading: "Đang tải lên...",
			errors: {
				uploadFailed: "Không thể tải lên tập lệnh. Vui lòng thử lại.",
				uploadError: "Đã xảy ra lỗi khi tải lên tập lệnh.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "Không tìm thấy tập lệnh",
		loadingMore: "Đang tải thêm...",
		reachedEnd: "Bạn đã đến cuối.",
		notEnoughApps: "Nếu bạn nghĩ rằng không có đủ ứng dụng,",
		helpAddMore: "vui lòng giúp chúng tôi thêm nữa",
		viewingCached:
			"Bạn đang ngoại tuyến. Xem nội dung được lưu trong bộ nhớ cache. Các tính năng cài đặt bị vô hiệu hóa.",
		errors: {
			notArray: "Dữ liệu được tải không phải là mảng",
			fetchFailed: "Không thể tải tập lệnh",
			notSupported: "Thật không may %s không được hỗ trợ trên %s của bạn.",
			notSupportedTitle: "Thiết bị của bạn có thể không tương thích.",
		},
	},

	// search component
	search: {
		placeholder: "Tìm kiếm tập lệnh...",
		filters: {
			audio: "Âm thanh",
			image: "Hình ảnh",
			video: "Video",
			chat: "Trò chuyện",
		},
	},

	// network share modal
	networkShare: {
		title: "Chia sẻ",
		modes: {
			local: "Cục bộ",
			public: "Công khai",
			connecting: "Đang kết nối...",
		},
		warning: {
			title: "Truy cập công khai",
			description:
				"Tạo URL công khai có thể truy cập từ bất kỳ đâu. Chỉ chia sẻ với những người bạn tin tưởng.",
		},
		local: {
			shareUrl: "Chia sẻ URL",
			urlDescription: "Chia sẻ URL này với các thiết bị trên mạng cục bộ của bạn",
			localNetwork: "Mạng cục bộ:",
			description: "URL này hoạt động trên các thiết bị được kết nối với cùng một mạng.",
		},
		public: {
			shareUrl: "URL công khai",
			urlDescription: "Chia sẻ URL này với bất kỳ ai, bất kỳ nơi đâu trên thế giới",
			passwordTitle: "Mật khẩu lần đầu tiên",
			visitorMessage:
				"Khách truy cập có thể cần nhập mật khẩu này một lần trên mỗi thiết bị để truy cập đường hầm.",
			stopSharing: "Dừng chia sẻ",
		},
		errors: {
			noAddress: "Không thể lấy địa chỉ mạng. Vui lòng kiểm tra kết nối của bạn.",
			loadFailed: "Không thể tải thông tin mạng.",
			noUrl: "Không có URL khả dụng để sao chép.",
			copyFailed: "Không thể sao chép vào clipboard.",
			tunnelFailed: "Không thể bắt đầu đường hầm",
		},
	},

	// login features modal
	loginFeatures: {
		title: "Bạn đang thiếu tính năng",
		description: "Đăng nhập vào Dione để bạn không bỏ lỡ các tính năng này.",
		login: "Đăng nhập",
		skip: "Bỏ qua",
		features: {
			customReports: {
				title: "Gửi báo cáo tùy chỉnh",
				description:
					"Gửi báo cáo tùy chỉnh từ trong ứng dụng, làm cho hỗ trợ nhanh hơn trong trường hợp lỗi.",
			},
			createProfile: {
				title: "Tạo hồ sơ",
				description:
					"Tạo hồ sơ cho cộng đồng Dione để họ hiểu biết về bạn.",
			},
			syncData: {
				title: "Đồng bộ hóa dữ liệu của bạn",
				description: "Đồng bộ hóa dữ liệu của bạn trên tất cả các thiết bị của bạn.",
			},
			earlyBirds: {
				title: "Nhận các bản cập nhật sớm",
				description:
					"Nhận các bản cập nhật và tính năng mới trước khi có người khác.",
			},
			giveOutLikes: {
				title: "Cho lượt thích",
				description:
					"Để lại lượt thích cho các ứng dụng bạn thích nhất, vì vậy nhiều người sẽ sử dụng chúng!",
			},
			publishScripts: {
				title: "Xuất bản tập lệnh",
				description: "Xuất bản tập lệnh của bạn và chia sẻ với thế giới.",
			},
			achieveGoals: {
				title: "Đạt mục tiêu",
				description:
					"Đạt mục tiêu như sử dụng Dione trong 7 ngày để nhận được quà tặng miễn phí",
			},
			getNewswire: {
				title: "Nhận thông tin tức thời",
				description:
					"Nhận bản cập nhật qua email để bạn không bỏ lỡ các tính năng mới.",
			},
		},
	},

	// editor component
	editor: {
		selectFile: "Chọn tệp để bắt đầu chỉnh sửa",
		previewNotAvailable: "Xem trước không có sẵn cho tệp này.",
		mediaNotSupported: "Xem trước cho loại phương tiện này chưa được hỗ trợ.",
		previewOnly: "Chỉ xem trước",
		unsaved: "Chưa lưu",
		retry: "Thử lại",
		editorLabel: "Biên tập viên",
	},

	// sidebar links
	links: {
		discord: "Discord",
		github: "GitHub",
		dione: "Dione",
		builtWith: "được xây dựng với",
	},

	// update notifications
	updates: {
		later: "Sau",
		install: "Cài đặt",
	},

	// iframe actions
	iframeActions: {
		shareOnNetwork: "Chia sẻ trên mạng",
	},

	// version info
	versions: {
		node: "Node",
		electron: "Electron",
		chromium: "Chromium",
	},

	// connection messages
	connection: {
		retryLater: "Chúng tôi đang gặp các vấn đề kết nối, vui lòng thử lại sau.",
	},

	// variables modal
	variables: {
		title: "Biến môi trường",
		addKey: "Thêm khóa",
		searchPlaceholder: "Tìm kiếm biến...",
		keyPlaceholder: "Khóa (ví dụ: MY_VAR)",
		valuePlaceholder: "Giá trị",
		copyAll: "Sao chép tất cả vào clipboard",
		confirm: "Xác nhận",
		copyPath: "Sao chép đường dẫn",
		copyFullValue: "Sao chép giá trị đầy đủ",
		deleteKey: "Xóa khóa",
	},

	// custom commands modal
	customCommands: {
		title: "Khởi động với các tham số tùy chỉnh",
		launch: "Khởi động",
	},

	// context menu
	contextMenu: {
		copyPath: "Sao chép đường dẫn",
		open: "Mở",
		reload: "Tải lại",
		rename: "Đổi tên",
		delete: "Xóa",
	},

	// file tree
	fileTree: {
		noFiles: "Không tìm thấy tệp nào trong không gian làm việc này.",
		media: "Phương tiện",
		binary: "Nhị phân",
	},

	// entry name dialog
	entryDialog: {
		name: "Tên",
		createFile: "Tạo tệp",
		createFolder: "Tạo thư mục",
		renameFile: "Đổi tên tệp",
		renameFolder: "Đổi tên thư mục",
		createInRoot: "Cái này sẽ được tạo ở gốc không gian làm việc.",
		createInside: "Cái này sẽ được tạo bên trong {path}.",
		currentLocation: "Vị trí hiện tại: {path}.",
		currentLocationRoot: "Vị trí hiện tại: gốc không gian làm việc.",
		rename: "Đổi tên",
		placeholderFile: "example.ts",
		placeholderFolder: "Thư mục mới",
	},

	// workspace editor
	workspaceEditor: {
		newFile: "Tệp mới",
		newFolder: "Thư mục mới",
		retry: "Thử lại",
		back: "Quay lại",
		save: "Lưu",
		openInExplorer: "Mở trong trình khám phá",
		resolvingPath: "Đang phân giải đường dẫn...",
		workspace: "Không gian làm việc",
	},

	// header bar
	headerBar: {
		back: "Quay lại",
		openInExplorer: "Mở trong trình khám phá",
		save: "Lưu",
	},

	// settings page footer
	settingsFooter: {
		builtWithLove: "được xây dựng với ♥",
		getDioneWebsite: "getdione.app",
		version: "Phiên bản",
		port: "Cổng",
	},

	// notifications
	notifications: {
		enabled: {
			title: "Thông báo đã bật",
			description: "Bạn sẽ nhận được thông báo cho các sự kiện quan trọng.",
		},
		learnMore: "Tìm hiểu thêm",
	},

	// language selector
	languageSelector: {
		next: "Tiếp theo",
	},

	// onboarding - select path
	selectPath: {
		chooseLocation: "Chọn vị trí cài đặt",
		changePath: "Thay đổi đường dẫn",
	},

	// browser compatibility
	browserCompatibility: {
		audioNotSupported: "Trình duyệt của bạn không hỗ trợ phần tử âm thanh.",
		videoNotSupported: "Trình duyệt của bạn không hỗ trợ phần tử video.",
	},

	// library card
	library: {
		official: "Chính thức",
	},

	// sidebar updates
	sidebarUpdate: {
		newUpdateAvailable: "Có bản cập nhật mới",
		whatsNew: "Đây là những gì mới",
	},

	// iframe component labels
	iframeLabels: {
		back: "Quay lại",
		logs: "Nhật ký",
		disk: "Đĩa",
		editor: "Biên tập viên",
	},

	// progress component
	progress: {
		running: "Đang chạy...",
	},

	// toast messages
	toastMessages: {
		copiedToClipboard: "Đã sao chép vào clipboard!",
		keyAndValueRequired: "Khóa và giá trị là bắt buộc",
		variableAdded: "Biến được thêm",
		failedToAddVariable: "Không thể thêm biến",
		variableRemoved: "Biến đã bị xóa",
		failedToRemoveVariable: "Không thể xóa biến",
		valueRemoved: "Giá trị đã bị xóa",
		failedToRemoveValue: "Không thể xóa giá trị",
		pathCopiedToClipboard: "Đường dẫn được sao chép vào clipboard",
		failedToCopyPath: "Không thể sao chép đường dẫn",
		unableToOpenLocation: "Không thể mở vị trí",
		cannotDeleteWorkspaceRoot: "Không thể xóa gốc không gian làm việc",
		deleted: "Đã xóa",
		failedToDeleteEntry: "Không thể xóa mục",
		workspaceNotAvailable: "Không gian làm việc không khả dụng",
		selectFileOrFolderToRename: "Chọn tệp hoặc thư mục để đổi tên",
		cannotRenameWorkspaceRoot: "Không thể đổi tên gốc không gian làm việc",
		entryRenamed: "Mục được đổi tên",
		fileSavedSuccessfully: "Tệp được lưu thành công",
		failedToSaveFile: "Không thể lưu tệp",
		mediaFilesCannotBeOpened: "Không thể mở tệp phương tiện trong trình biên tập.",
		binaryFilesCannotBeOpened:
			"Không thể mở tệp nhị phân và có thể thực thi được trong trình biên tập.",
		thisFileTypeCannotBeEdited: "Loại tệp này chưa có thể chỉnh sửa được.",
	},

	// error messages
	errorMessages: {
		workspaceNotFound: "Không tìm thấy không gian làm việc",
		failedToLoadWorkspace: "Không thể tải không gian làm việc",
		failedToLoadDirectory: "Không thể tải thư mục",
		unableToOpenWorkspace: "Không thể mở không gian làm việc",
		failedToLoadFile: "Không thể tải tệp",
		nameCannotBeEmpty: "Tên không được để trống",
		nameContainsInvalidCharacters: "Tên chứa các ký tự không hợp lệ",
		failedToCreateEntry: "Không thể tạo mục",
		failedToRenameEntry: "Không thể đổi tên mục",
	},

	// file operations
	fileOperations: {
		fileCreated: "Tệp được tạo",
		folderCreated: "Thư mục được tạo",
		untitledFile: "untitled.txt",
		newFolder: "Thư mục mới",
	},

	// confirmation dialogs
	confirmDialogs: {
		removeValue: "Bạn có chắc chắn muốn xóa",
		thisValue: "giá trị này",
		keyAndAllValues: "khóa và tất cả giá trị của nó",
		from: "từ",
	},

	// network share modal
	networkShareErrors: {
		failedToLoadNetworkInfo: "Không thể tải thông tin mạng.",
		failedToStartTunnel: "Không thể bắt đầu đường hầm",
		failedToCopyToClipboard: "Không thể sao chép vào clipboard.",
	},

	// feed component
	feedErrors: {
		invalidDataFormat: "Định dạng dữ liệu không hợp lệ từ API",
		failedToFetchScripts: "Không thể tải tập lệnh",
		offline: "Bạn đang ngoại tuyến và không có nội dung được lưu trong bộ nhớ cache.",
	},

	// upload script modal
	uploadScript: {
		fileLoadedLocally: "Tệp được tải cục bộ",
	},

	// running apps
	runningApps: {
		running: "Đang chạy",
		thereIsAnAppRunningInBackground:
			"Có một ứng dụng đang chạy ở nền.",
		failedToReloadQuickLaunch: "Không thể tải lại ứng dụng khởi động nhanh",
		failedToFetchInstalledApps: "Không thể tải các ứng dụng đã cài đặt",
	},
} as const;
