export const id = {
	// common actions and states
	common: {
		cancel: "Batal",
		loading: "Memuat...",
		error: "Kesalahan",
		success: "Sukses",
		pending: "Tertunda",
		back: "Kembali",
		unselectAll: "Batalkan Pilihan Semua",
		selectAll: "Pilih Semua",
	},

	// authentication and access related
	noAccess: {
		title: "Bergabunglah dengan daftar putih Dione",
		description:
			"Dione sedang dalam perbaikan dan hanya sejumlah pengguna terbatas yang dapat mengaksesnya, bergabunglah dengan daftar putih kami sekarang untuk mendapatkan akses ke versi aplikasi kami di masa mendatang.",
		join: "Gabung",
		logout: "Keluar",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Selamat datang di",
			subtitle:
				"Terima kasih telah bergabung dengan kami di awal perjalanan ini. Masuk ke akun Anda untuk memulai.",
			login: "Masuk",
			copyLink: "Salin Tautan",
			skipLogin: "Lanjutkan tanpa masuk",
		},
		loggingIn: {
			title: "Masuk...",
			authError: "Gagal otentikasi?",
			goBack: "Kembali",
		},
		languageSelector: {
			title: "Pilih bahasa Anda",
		},
		ready: {
			title: "Anda siap!",
			subtitle: "Kami senang Anda ada di sini",
			finish: "Selesai",
		},
		clipboard: {
			success:
				"Telah berhasil disalin ke clipboard, sekarang tempelkan di browser Anda!",
		},
		selectPath: {
			title: "Pilih jalur instalasi",
			description:
				"Folder ini akan berisi semua skrip, dependensi, dan file proyek yang terinstal. Pilih lokasi yang mudah diakses dan memiliki ruang penyimpanan yang cukup.",
			button: "Pilih jalur",
			success: "Selanjutnya",
			warning:
				"Jangan pilih folder yang sama tempat Dione diinstal. Ini dapat menyebabkan konflik dan kesalahan selama pembaruan.",
		},
	},

	// error handling
	error: {
		title: "Terjadi kesalahan tak terduga",
		description:
			"Kami mendeteksi kesalahan tak terduga dalam aplikasi, kami mohon maaf atas ketidaknyamanannya.",
		return: "Kembali",
		report: {
			toTeam: "Laporkan ke tim",
			sending: "Mengirim laporan...",
			success: "Laporan terkirim!",
			failed: "Gagal mengirim laporan",
		},
	},

	// account related
	account: {
		title: "Akun",
		logout: "Keluar",
		stats: {
			timeSpent: {
				title: "Waktu yang dihabiskan",
				subtitle: "dalam 7 hari terakhir",
			},
			sessions: {
				title: "Sesi",
				subtitle: "dalam 7 hari terakhir",
			},
			shared: {
				title: "Dibagikan",
				subtitle: "dalam 7 hari terakhir",
			},
			streak: {
				title: "Rentetan",
				subtitle: "hari berturut-turut",
				days: "hari",
			},
		},
	},

	// toast notifications
	toast: {
		close: "Tutup",
		install: {
			downloading: "Mengunduh %s...",
			starting: "Memulai %s...",
			uninstalling: "Menghapus instalasi %s...",
			reconnecting: "Menghubungkan kembali %s...",
			retrying: "Mencoba menginstal %s lagi...",
			success: {
				stopped: "%s berhenti dengan sukses.",
				uninstalled: "%s dihapus instalasinya dengan sukses.",
				logsCopied: "Log berhasil disalin ke clipboard.",
				depsInstalled: "Dependensi berhasil diinstal.",
				shared: "Tautan unduhan disalin ke clipboard!",
			},
			error: {
				download: "Kesalahan memulai unduhan: %s",
				start: "Kesalahan memulai %s: %s",
				stop: "Kesalahan menghentikan %s: %s",
				uninstall: "Kesalahan menghapus instalasi %s: %s",
				serverRunning: "Server sudah berjalan.",
				tooManyApps:
					"Pelan-pelan! Anda sudah memiliki 6 aplikasi yang berjalan secara bersamaan.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Menghentikan aplikasi...",
			description:
				"Dione akan ditutup secara otomatis setelah menutup semua aplikasi yang terbuka.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Jelajahi, Instal, Berinovasi — dalam 1 Klik.",
		activeApps: "Aplikasi Aktif",
		update: {
			title: "Pembaruan Tersedia",
			description:
				"Versi baru Dione tersedia, silakan mulai ulang aplikasi untuk memperbarui.",
			tooltip:
				"Pembaruan baru tersedia, silakan mulai ulang Dione untuk memperbarui.",
		},
		tooltips: {
			library: "Perpustakaan",
			settings: "Pengaturan",
			account: "Akun",
			logout: "Keluar",
			login: "Masuk",
			capture: "Tangkap",
		},
	},

	// home page
	home: {
		featured: "Unggulan",
		explore: "Jelajahi",
	},

	// settings page
	settings: {
		applications: {
			title: "Aplikasi",
			installationDirectory: {
				label: "Direktori Instalasi",
				description: "Pilih tempat aplikasi baru akan diinstal secara default.",
			},
			binDirectory: {
				label: "Direktori Bin",
				description:
					"Pilih tempat biner aplikasi akan disimpan agar mudah diakses.",
			},
			cleanUninstall: {
				label: "Hapus Instalasi Bersih",
				description:
					"Hapus semua dependensi terkait saat menghapus instalasi aplikasi.",
			},
			autoOpenAfterInstall: {
				label: "Buka Otomatis Setelah Instalasi",
				description:
					"Buka aplikasi secara otomatis untuk pertama kalinya setelah instalasi.",
			},
			deleteCache: {
				label: "Hapus Cache",
				description: "Hapus semua data cache dari aplikasi.",
				button: "Hapus Cache",
				deleting: "Menghapus...",
				deleted: "Dihapus",
				error: "Kesalahan",
			},
		},
		interface: {
			title: "Antarmuka",
			displayLanguage: {
				label: "Bahasa Tampilan",
				description: "Pilih bahasa antarmuka pilihan Anda.",
			},
			helpTranslate:
				"🤔 Tidak melihat bahasa Anda? Bantu kami menambahkan lebih banyak!",
			theme: {
				label: "Tema",
				description: "Pilih tema warna untuk aplikasi.",
				themes: {
					default: "Mimpi Ungu",
					midnight: "Biru Tengah Malam",
					ocean: "Kedalaman Lautan",
					forest: "Malam Hutan",
					sunset: "Cahaya Senja",
					royal: "Ungu Royal",
				},
			},
			intenseBackgrounds: {
				label: "Warna Latar Belakang Intens",
				description:
					"Gunakan warna latar belakang yang lebih cerah daripada nada yang halus.",
			},
			compactView: {
				label: "Tampilan Ringkas",
				description:
					"Gunakan tata letak yang lebih padat untuk menampilkan lebih banyak konten di layar.",
			},
		},
		notifications: {
			title: "Notifikasi",
			systemNotifications: {
				label: "Notifikasi Sistem",
				description: "Tampilkan notifikasi desktop untuk acara penting.",
			},
			installationAlerts: {
				label: "Peringatan Instalasi",
				description: "Dapatkan notifikasi saat instalasi aplikasi selesai.",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "Tampilkan aktivitas Anda saat ini di status Discord.",
			},
			successSound: {
				label: "Aktifkan Suara Sukses",
				description:
					"Aktifkan suara yang diputar saat aplikasi selesai diinstal.",
			},
		},
		privacy: {
			title: "Privasi",
			errorReporting: {
				label: "Pelaporan Kesalahan",
				description:
					"Bantu tingkatkan Dione dengan mengirimkan laporan kesalahan anonim.",
			},
		},
		other: {
			title: "Lainnya",
			disableAutoUpdate: {
				label: "Nonaktifkan pembaruan otomatis",
				description:
					"Menonaktifkan pembaruan otomatis. Peringatan: aplikasi Anda mungkin melewatkan perbaikan penting atau patch keamanan. Opsi ini tidak disarankan untuk sebagian besar pengguna.",
			},
			logsDirectory: {
				label: "Direktori Log",
				description: "Lokasi tempat log aplikasi disimpan.",
			},
			exportLogs: {
				label: "Ekspor Log Debug",
				description:
					"Ekspor semua log dan informasi sistem dalam file zip untuk debugging.",
				button: "Ekspor Log",
			},
			submitFeedback: {
				label: "Kirim Umpan Balik",
				description: "Laporkan masalah atau kendala yang Anda temui.",
				button: "Kirim Laporan",
			},
			showOnboarding: {
				label: "Tampilkan orientasi",
				description:
					"Atur ulang Dione ke keadaan awal dan tampilkan kembali orientasi untuk konfigurasi ulang.",
				button: "Atur Ulang",
			},
			variables: {
				label: "Variabel",
				description: "Kelola variabel aplikasi dan nilainya.",
				button: "Buka Variabel",
			},
			checkUpdates: {
				label: "Periksa pembaruan",
				description:
					"Periksa pembaruan dan beri tahu Anda saat versi baru tersedia.",
				button: "Periksa pembaruan",
			},
		},
	},

	// report form
	report: {
		title: "Jelaskan Masalahnya",
		description:
			"Harap berikan detail tentang apa yang terjadi dan apa yang Anda coba lakukan.",
		placeholder:
			"Contoh: Saya mencoba menginstal aplikasi ketika kesalahan ini terjadi...",
		systemInformationTitle: "Informasi Sistem",
		disclaimer:
			"Informasi sistem berikut dan ID anonim akan disertakan dalam laporan Anda.",
		success: "Laporan berhasil dikirim!",
		error: "Gagal mengirim laporan. Silakan coba lagi.",
		send: "Kirim Laporan",
		sending: "Mengirim...",
		contribute:
			"Bantu kami membuat skrip ini kompatibel dengan semua perangkat",
	},

	// quick launch component
	quickLaunch: {
		title: "Luncur Cepat",
		addApp: "Tambah Aplikasi",
		tooltips: {
			noMoreApps: "Tidak ada aplikasi yang tersedia untuk ditambahkan",
		},
		selectApp: {
			title: "Pilih Aplikasi",
			description:
				"{count} aplikasi tersedia. Anda dapat memilih hingga {max}.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "Beberapa dependensi hilang!",
		installing: "Menginstal dependensi...",
		install: "Instal",
		logs: {
			initializing: "Menginisialisasi unduhan dependensi...",
			loading: "Memuat...",
			connected: "Terhubung ke server",
			disconnected: "Terputus dari server",
			error: {
				socket: "Kesalahan penyiapan soket",
				install: "❌ Kesalahan menginstal dependensi: {error}",
			},
			allInstalled: "Semua dependensi sudah terinstal.",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstall: {
			title: "Hapus Instalasi",
			deps: "Hapus instalasi dependensi",
			wait: "mohon tunggu...",
		},
		uninstalling: {
			title: "Menghapus Instalasi",
			deps: "Menghapus instalasi dependensi",
			wait: "mohon tunggu...",
		},
		success: {
			title: "Telah Dihapus",
			subtitle: "dengan sukses",
			closing: "Menutup modal ini dalam",
			seconds: "detik...",
		},
		error: {
			title: "Tak terduga",
			subtitle: "kesalahan",
			hasOccurred: "telah terjadi",
			deps: "Dione tidak dapat menghapus dependensi apa pun, silakan lakukan secara manual.",
			general:
				"Silakan coba lagi nanti atau periksa log untuk informasi lebih lanjut.",
		},
		loading: {
			title: "Memuat...",
			wait: "Mohon tunggu...",
		},
	},

	// logs component
	logs: {
		loading: "Memuat...",
		openPreview: "Buka Pratinjau",
		copyLogs: "Salin log",
		stop: "Berhenti",
		disclaimer:
			"Log yang ditampilkan berasal dari aplikasi itu sendiri. Jika Anda melihat kesalahan, laporkan terlebih dahulu ke pengembang aplikasi asli.",
		status: {
			success: "Sukses",
			error: "Kesalahan",
			pending: "Tertunda",
		},
	},

	// loading states
	loading: {
		text: "Memuat...",
	},

	// iframe component
	iframe: {
		back: "Kembali",
		openFolder: "Buka folder",
		openInBrowser: "Buka di Browser",
		openNewWindow: "Buka Jendela Baru",
		fullscreen: "Layar Penuh",
		stop: "Berhenti",
		reload: "Muat Ulang",
		logs: "Log",
	},

	// actions component
	actions: {
		reconnect: "Sambungkan Ulang",
		start: "Mulai",
		uninstall: "Hapus Instalasi",
		install: "Instal",
		publishedBy: "Diterbitkan oleh",
		installed: "Terinstal",
		notInstalled: "Tidak terinstal",
	},

	// promo component
	promo: {
		title: "Ingin ditampilkan di sini?",
		description: "Pamerkan alat Anda kepada komunitas kami",
		button: "Dapatkan Fitur",
	},

	// installed component
	installed: {
		title: "Perpustakaan Anda",
		empty: {
			title: "Anda tidak memiliki aplikasi yang terinstal",
			action: "Instal sekarang",
		},
	},

	// local component
	local: {
		title: "Skrip Lokal",
		upload: "Unggah skrip",
		noScripts: "Tidak ada skrip yang ditemukan",
		deleting: "Menghapus skrip, mohon tunggu...",
		uploadModal: {
			title: "Unggah Skrip",
			selectFile: "Klik untuk memilih file",
			selectedFile: "File yang Dipilih",
			scriptName: "Nama Skrip",
			scriptDescription: "Deskripsi skrip (opsional)",
			uploadFile: "Unggah File",
			uploading: "Mengunggah...",
			errors: {
				uploadFailed: "Gagal mengunggah skrip. Silakan coba lagi.",
				uploadError: "Terjadi kesalahan saat mengunggah skrip.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "Tidak ada skrip yang ditemukan",
		loadingMore: "Memuat lebih banyak...",
		reachedEnd: "Anda telah mencapai akhir.",
		notEnoughApps: "Jika menurut Anda aplikasinya kurang,",
		helpAddMore: "tolong bantu kami menambahkan lebih banyak",
		errors: {
			notArray: "Data yang diambil bukan array",
			fetchFailed: "Gagal mengambil skrip",
			notSupported: "Sayangnya %s tidak didukung di %s Anda.",
			notSupportedTitle: "Perangkat Anda mungkin tidak kompatibel.",
		},
	},

	// search component
	search: {
		placeholder: "Cari skrip...",
		filters: {
			audio: "Audio",
			image: "Gambar",
			video: "Video",
			chat: "Obrolan",
		},
	},

	// network share modal
	networkShare: {
		title: "Bagikan",
		modes: {
			local: "Lokal",
			public: "Publik",
			connecting: "Menghubungkan...",
		},
		warning: {
			title: "Akses Publik",
			description:
				"Membuat URL publik yang dapat diakses dari mana saja. Bagikan hanya dengan orang yang dipercaya.",
		},
		local: {
			shareUrl: "Bagikan URL",
			urlDescription: "Bagikan URL ini dengan perangkat di jaringan lokal Anda",
			localNetwork: "Jaringan Lokal:",
			description:
				"URL ini berfungsi di perangkat yang terhubung ke jaringan yang sama.",
		},
		public: {
			shareUrl: "URL Publik",
			urlDescription:
				"Bagikan URL ini dengan siapa saja, di mana saja di dunia",
			passwordTitle: "Kata Sandi Pertama Kali",
			visitorMessage:
				"Pengunjung mungkin perlu memasukkan ini sekali per perangkat untuk mengakses terowongan.",
			stopSharing: "Berhenti Berbagi",
		},
		errors: {
			noAddress:
				"Tidak dapat memperoleh alamat jaringan. Silakan periksa koneksi Anda.",
			loadFailed: "Gagal memuat informasi jaringan.",
			noUrl: "Tidak ada URL yang tersedia untuk disalin.",
			copyFailed: "Gagal menyalin ke clipboard.",
			tunnelFailed: "Gagal memulai terowongan",
		},
	},

	// login features modal
	loginFeatures: {
		title: "Anda kehilangan fitur",
		description: "Masuk ke Dione agar Anda tidak ketinggalan fitur-fitur ini.",
		login: "Masuk",
		skip: "Lewati",
		features: {
			customReports: {
				title: "Kirim laporan kustom",
				description:
					"Kirim laporan kustom dari dalam aplikasi, membuat dukungan lebih cepat jika terjadi kesalahan.",
			},
			createProfile: {
				title: "Buat profil",
				description: "Buat profil agar komunitas Dione mengenal Anda.",
			},
			syncData: {
				title: "Sinkronkan data Anda",
				description: "Sinkronkan data Anda di semua perangkat Anda.",
			},
			earlyBirds: {
				title: "Dapatkan pembaruan dini",
				description:
					"Dapatkan pembaruan dini dan fitur baru sebelum orang lain.",
			},
			giveOutLikes: {
				title: "Berikan suka",
				description:
					"Berikan suka pada aplikasi yang paling Anda sukai, agar lebih banyak orang menggunakannya!",
			},
			publishScripts: {
				title: "Terbitkan skrip",
				description: "Terbitkan skrip Anda dan bagikan dengan dunia.",
			},
			achieveGoals: {
				title: "Capai tujuan",
				description:
					"Capai tujuan seperti menggunakan Dione selama 7 hari untuk mendapatkan hadiah gratis",
			},
			getNewswire: {
				title: "Dapatkan berita",
				description:
					"Terima pembaruan melalui email agar Anda tidak ketinggalan fitur baru.",
			},
		},
	},

	// editor component
	editor: {
		selectFile: "Pilih file untuk mulai mengedit",
		previewNotAvailable: "Pratinjau tidak tersedia untuk file ini.",
		mediaNotSupported: "Pratinjau untuk jenis media ini belum didukung.",
		previewOnly: "Hanya Pratinjau",
		unsaved: "Belum Disimpan",
		retry: "Coba Lagi",
		editorLabel: "Editor",
	},

	// sidebar links
	links: {
		discord: "Discord",
		github: "GitHub",
		dione: "Dione",
		builtWith: "dibangun dengan",
	},

	// update notifications
	updates: {
		later: "Nanti",
		install: "Instal",
	},

	// iframe actions
	iframeActions: {
		shareOnNetwork: "Bagikan di jaringan",
	},

	// version info
	versions: {
		node: "Node",
		electron: "Electron",
		chromium: "Chromium",
	},

	// connection messages
	connection: {
		retryLater: "Kami mengalami masalah koneksi, silakan coba lagi nanti.",
	},

	// variables modal
	variables: {
		title: "Variabel Lingkungan",
		addKey: "Tambah kunci",
		searchPlaceholder: "Cari variabel...",
		keyPlaceholder: "Kunci (misalnya, MY_VAR)",
		valuePlaceholder: "Nilai",
		copyAll: "Salin semua ke clipboard",
		confirm: "Konfirmasi",
		copyPath: "Salin jalur",
		copyFullValue: "Salin nilai penuh",
		deleteKey: "Hapus kunci",
	},

	// custom commands modal
	customCommands: {
		title: "Luncurkan dengan parameter kustom",
		launch: "Luncurkan",
	},

	// context menu
	contextMenu: {
		copyPath: "Salin jalur",
		open: "Buka",
		reload: "Muat Ulang",
		rename: "Ubah Nama",
		delete: "Hapus",
	},

	// file tree
	fileTree: {
		noFiles: "Tidak ada file yang ditemukan di ruang kerja ini.",
		media: "Media",
		binary: "Biner",
	},

	// entry name dialog
	entryDialog: {
		name: "Nama",
		createFile: "Buat file",
		createFolder: "Buat folder",
		renameFile: "Ubah Nama File",
		renameFolder: "Ubah Nama Folder",
		createInRoot: "Ini akan dibuat di akar ruang kerja.",
		createInside: "Ini akan dibuat di dalam {path}.",
		currentLocation: "Lokasi saat ini: {path}.",
		currentLocationRoot: "Lokasi saat ini: akar ruang kerja.",
		rename: "Ubah Nama",
		placeholderFile: "contoh.ts",
		placeholderFolder: "Folder Baru",
	},

	// workspace editor
	workspaceEditor: {
		newFile: "File baru",
		newFolder: "Folder baru",
		retry: "Coba Lagi",
		back: "Kembali",
		save: "Simpan",
		openInExplorer: "Buka di penjelajah",
		resolvingPath: "Menyelesaikan jalur...",
		workspace: "Ruang Kerja",
	},

	// header bar
	headerBar: {
		back: "Kembali",
		openInExplorer: "Buka di penjelajah",
		save: "Simpan",
	},

	// settings page footer
	settingsFooter: {
		builtWithLove: "dibangun dengan ♥",
		getDioneWebsite: "getdione.app",
		port: "Port",
		node: "Node:",
		electron: "Electron:",
		chromium: "Chrome:",
	},

	// notifications
	notifications: {
		enabled: {
			title: "Notifikasi diaktifkan",
			description: "Anda akan menerima notifikasi untuk acara penting.",
		},
		learnMore: "Pelajari selengkapnya",
	},

	// language selector
	languageSelector: {
		next: "Selanjutnya",
	},

	// onboarding - select path
	selectPath: {
		chooseLocation: "Pilih Lokasi Instalasi",
		changePath: "Ubah Jalur",
	},

	// browser compatibility
	browserCompatibility: {
		audioNotSupported: "Peramban Anda tidak mendukung elemen audio.",
		videoNotSupported: "Peramban Anda tidak mendukung elemen video.",
	},

	// library card
	library: {
		official: "Resmi",
	},

	// sidebar updates
	sidebarUpdate: {
		newUpdateAvailable: "Pembaruan baru tersedia",
		whatsNew: "Inilah yang baru",
	},

	// iframe component labels
	iframeLabels: {
		back: "Kembali",
		logs: "Log",
		disk: "Disk",
		editor: "Editor",
	},

	// progress component
	progress: {
		running: "Berjalan...",
	},

	// toast messages
	toastMessages: {
		copiedToClipboard: "Telah disalin ke clipboard!",
		keyAndValueRequired: "Kunci dan nilai diperlukan",
		variableAdded: "Variabel ditambahkan",
		failedToAddVariable: "Gagal menambahkan variabel",
		variableRemoved: "Variabel dihapus",
		failedToRemoveVariable: "Gagal menghapus variabel",
		valueRemoved: "Nilai dihapus",
		failedToRemoveValue: "Gagal menghapus nilai",
		pathCopiedToClipboard: "Jalur disalin ke clipboard",
		failedToCopyPath: "Gagal menyalin jalur",
		unableToOpenLocation: "Tidak dapat membuka lokasi",
		cannotDeleteWorkspaceRoot: "Tidak dapat menghapus akar ruang kerja",
		deleted: "Dihapus",
		failedToDeleteEntry: "Gagal menghapus entri",
		workspaceNotAvailable: "Ruang kerja tidak tersedia",
		selectFileOrFolderToRename: "Pilih file atau folder untuk diubah namanya",
		cannotRenameWorkspaceRoot: "Tidak dapat mengubah nama akar ruang kerja",
		entryRenamed: "Entri diubah namanya",
		fileSavedSuccessfully: "File berhasil disimpan",
		failedToSaveFile: "Gagal menyimpan file",
		mediaFilesCannotBeOpened: "File media tidak dapat dibuka di editor.",
		binaryFilesCannotBeOpened:
			"File biner dan eksekusi tidak dapat dibuka di editor.",
		thisFileTypeCannotBeEdited: "Jenis file ini belum dapat diedit.",
	},

	// error messages
	errorMessages: {
		workspaceNotFound: "Ruang kerja tidak ditemukan",
		failedToLoadWorkspace: "Gagal memuat ruang kerja",
		failedToLoadDirectory: "Gagal memuat direktori",
		unableToOpenWorkspace: "Tidak dapat membuka ruang kerja",
		failedToLoadFile: "Gagal memuat file",
		nameCannotBeEmpty: "Nama tidak boleh kosong",
		nameContainsInvalidCharacters: "Nama berisi karakter tidak valid",
		failedToCreateEntry: "Gagal membuat entri",
		failedToRenameEntry: "Gagal mengubah nama entri",
	},

	// file operations
	fileOperations: {
		fileCreated: "File dibuat",
		folderCreated: "Folder dibuat",
		untitledFile: "untitled.txt",
		newFolder: "Folder Baru",
	},

	// confirmation dialogs
	confirmDialogs: {
		removeValue: "Apakah Anda yakin ingin menghapus",
		thisValue: "nilai ini",
		keyAndAllValues: "kunci dan semua nilainya",
		from: "dari",
	},

	// network share modal
	networkShareErrors: {
		failedToLoadNetworkInfo: "Gagal memuat informasi jaringan.",
		failedToStartTunnel: "Gagal memulai terowongan",
		failedToCopyToClipboard: "Gagal menyalin ke clipboard.",
	},

	// feed component
	feedErrors: {
		invalidDataFormat: "Format data tidak valid dari API",
		failedToFetchScripts: "Gagal mengambil skrip",
	},

	// upload script modal
	uploadScript: {
		fileLoadedLocally: "File dimuat secara lokal",
	},

	// running apps
	runningApps: {
		running: "Berjalan",
		thereIsAnAppRunningInBackground:
			"Ada aplikasi yang berjalan di latar belakang.",
		failedToReloadQuickLaunch: "Gagal memuat ulang aplikasi luncur cepat",
		failedToFetchInstalledApps: "Gagal mengambil aplikasi yang terinstal",
	},
} as const;
