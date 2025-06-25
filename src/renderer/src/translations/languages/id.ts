export const id = {
	// common actions and states
	common: {
		cancel: "Batalkan",
		loading: "Memuat...",
		error: "Kesalahan",
		success: "Berhasil",
		pending: "Tertunda",
		back: "Kembali",
	},

	// authentication and access related
	noAccess: {
		title: "Gabung daftar putih Dione",
		description:
			"Dione sedang dalam pembangunan dan hanya sejumlah terbatas pengguna yang dapat mengaksesnya, gabung daftar putih kami sekarang untuk mendapatkan akses ke versi aplikasi kami di masa mendatang.",
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
		},
		loggingIn: {
			title: "Sedang masuk...",
			authError: "Tidak dapat mengautentikasi?",
			goBack: "Kembali",
		},
		ready: {
			title: "Anda siap!",
			subtitle: "Kami senang Anda ada di sini",
			finish: "Selesai",
		},
		clipboard: {
			success:
				"Berhasil disalin ke papan klip, sekarang tempelkan di browser Anda!",
		},
	},

	// error handling
	error: {
		title: "Terjadi kesalahan tak terduga",
		description:
			"Kami telah mendeteksi kesalahan tak terduga di aplikasi, kami mohon maaf atas ketidaknyamanan ini.",
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
				title: "Waktu dihabiskan",
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
			uninstalling: "Mencopot pemasangan %s...",
			reconnecting: "Menghubungkan ulang %s...",
			retrying: "Mencoba menginstal %s lagi...",
			success: {
				stopped: "%s berhasil dihentikan.",
				uninstalled: "%s berhasil dicopot pemasangannya.",
				logsCopied: "Log berhasil disalin ke papan klip.",
				depsInstalled: "Dependensi berhasil diinstal.",
				shared: "Tautan unduhan disalin ke papan klip!",
			},
			error: {
				download: "Kesalahan memulai unduhan: %s",
				start: "Kesalahan memulai %s: %s",
				stop: "Kesalahan menghentikan %s: %s",
				uninstall: "Kesalahan mencopot pemasangan %s: %s",
				serverRunning: "Server sudah berjalan.",
				tooManyApps:
					"Pelan-pelan! Anda sudah menjalankan 6 aplikasi sekaligus.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Menghentikan aplikasi...",
			description:
				"Dione akan tertutup secara otomatis setelah menutup semua aplikasi yang terbuka.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Jelajahi, Instal, Berinovasi — dalam 1 Klik.",
		update: {
			title: "Pembaruan Tersedia",
			description:
				"Versi baru Dione tersedia, harap mulai ulang aplikasi untuk memperbarui.",
			tooltip:
				"Pembaruan baru tersedia, harap mulai ulang Dione untuk memperbarui.",
		},
		tooltips: {
			library: "Perpustakaan",
			settings: "Pengaturan",
			account: "Akun",
			logout: "Keluar",
			login: "Masuk",
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
				description: "Pilih di mana aplikasi baru akan diinstal secara default",
			},
			cleanUninstall: {
				label: "Copot Pemasangan Bersih",
				description:
					"Hapus semua dependensi terkait saat mencopot pemasangan aplikasi",
			},
		},
		interface: {
			title: "Antarmuka",
			displayLanguage: {
				label: "Bahasa Tampilan",
				description: "Pilih bahasa antarmuka pilihan Anda",
			},
			helpTranslate:
				"🤔 Tidak melihat bahasa Anda? Bantu kami menambahkan lebih banyak!",
			compactView: {
				label: "Tampilan Ringkas",
				description:
					"Gunakan tata letak yang lebih ringkas untuk menampung lebih banyak konten di layar",
			},
		},
		notifications: {
			title: "Pemberitahuan",
			systemNotifications: {
				label: "Pemberitahuan Sistem",
				description: "Tampilkan pemberitahuan desktop untuk acara penting",
			},
			installationAlerts: {
				label: "Peringatan Instalasi",
				description: "Dapatkan pemberitahuan saat instalasi aplikasi selesai",
			},
		},
		privacy: {
			title: "Privasi",
			errorReporting: {
				label: "Pelaporan Kesalahan",
				description:
					"Bantu tingkatkan Dione dengan mengirimkan laporan kesalahan anonim",
			},
		},
		other: {
			title: "Lain-lain",
			logsDirectory: {
				label: "Direktori Log",
				description: "Lokasi penyimpanan log aplikasi",
			},
			submitFeedback: {
				label: "Kirim Umpan Balik",
				description: "Laporkan setiap masalah atau kendala yang Anda temui",
				button: "Kirim Laporan",
			},
			showOnboarding: {
				label: "Tampilkan onboarding",
				description:
					"Reset Dione ke keadaan awal dan tampilkan kembali onboarding untuk rekonfigurasi",
				button: "Atur Ulang",
			},
		},
	},

	// report form
	report: {
		title: "Jelaskan Masalahnya",
		description:
			"Mohon berikan detail tentang apa yang terjadi dan apa yang Anda coba lakukan.",
		placeholder:
			"Contoh: Saya mencoba menginstal aplikasi ketika kesalahan ini terjadi...",
		systemInformationTitle: "Informasi Sistem",
		disclaimer:
			"Informasi sistem berikut dan ID anonim akan disertakan dalam laporan Anda.",
		success: "Laporan berhasil dikirim!",
		error: "Gagal mengirim laporan. Silakan coba lagi.",
		send: "Kirim Laporan",
		sending: "Mengirim...",
	},

	// quick launch component
	quickLaunch: {
		title: "Peluncuran Cepat",
		addApp: "Tambah Aplikasi",
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
				socket: "Kesalahan menyiapkan soket",
				install: "❌ Kesalahan menginstal dependensi: {error}",
			},
			allInstalled: "Semua dependensi sudah terinstal.",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstalling: {
			title: "Mencopot Pemasangan",
			deps: "Mencopot pemasangan dependensi",
			wait: "mohon tunggu...",
		},
		success: {
			title: "Dicopot Pemasangan",
			subtitle: "berhasil",
			closing: "Menutup modal ini dalam",
			seconds: "detik...",
		},
		error: {
			title: "Tak terduga",
			subtitle: "kesalahan",
			hasOccurred: "telah terjadi",
			deps: "Dione belum bisa menghapus dependensi apa pun, harap lakukan secara manual.",
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
		disclaimer:
			"Log yang ditampilkan berasal dari aplikasi itu sendiri. Jika Anda melihat kesalahan, harap laporkan terlebih dahulu kepada pengembang aplikasi aslinya.",
		status: {
			success: "Berhasil",
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
		openInBrowser: "Buka di Peramban",
		fullscreen: "Layar Penuh",
		stop: "Hentikan",
		reload: "Muat Ulang",
		logs: "Log",
	},

	// actions component
	actions: {
		reconnect: "Hubungkan Ulang",
		start: "Mulai",
		uninstall: "Copot Pemasangan",
		install: "Instal",
		publishedBy: "Dipublikasikan oleh",
	},

	// promo component
	promo: {
		title: "Ingin ditampilkan di sini?",
		description: "Pamerkan alat Anda kepada komunitas kami",
		button: "Dapatkan Unggulan",
	},

	// installed component
	installed: {
		title: "Perpustakaan Anda",
		empty: {
			title: "Anda belum menginstal aplikasi apa pun",
			action: "Instal satu sekarang",
		},
	},

	// feed component
	feed: {
		noScripts: "Tidak ada skrip ditemukan",
		errors: {
			notArray: "Data yang diambil bukan array",
			fetchFailed: "Gagal mengambil skrip",
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
} as const;
