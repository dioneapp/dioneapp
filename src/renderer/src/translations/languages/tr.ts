export const tr = {
	// common actions and states
	common: {
		cancel: "İptal",
		loading: "Yükleniyor...",
		error: "Hata",
		success: "Başarı",
		pending: "Beklemede",
		back: "Geri",
		unselectAll: "Tümünü Seç Kaldır",
		selectAll: "Tümünü Seç",
	},

	// authentication and access related
	noAccess: {
		title: "Dione beyaz listesine katılın",
		description:
			"Dione inşaat aşamasında ve sınırlı sayıda kullanıcı erişebilir. Uygulamamızın gelecek sürümlerine erişim sağlamak için şimdi beyaz listemize katılın.",
		join: "Katıl",
		logout: "Çıkış Yap",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "Hoş Geldiniz",
			subtitle:
				"Bu yolculuğun başında bizimle olmaktan bahsedilmemiş. Başlamak için hesabınızda oturum açın.",
			login: "Oturum Aç",
			copyLink: "Bağlantıyı Kopyala",
			skipLogin: "Oturum açmadan devam et",
		},
		loggingIn: {
			title: "Oturum açılıyor...",
			authError: "Kimlik doğrulama yapılamıyor mu?",
			goBack: "Geri",
		},
		languageSelector: {
			title: "Dione'u Kurun",
			description: "Dilinizi ve kurulum yolunu seçin",
			languageSection: "Dil",
			installationPathSection: "Kurulum Yolu",
			pathDescription:
				"Bu klasör, yüklü tüm komut dosyalarını, bağımlılıkları ve proje dosyalarını içerecektir. Kolayca erişilebilir ve yeterli depolama alanı olan bir konum seçin.",
			selectFolder: "Klasörü seç",
			changeFolder: "Klasörü değiştir",
			proceedButton: "Dili ve yolu seçin",
			error: {
				spaces: "Seçilen yol boşluk içeremez. Lütfen farklı bir klasör seçin.",
				updateConfig:
					"Yapılandırma güncellenirken bir hata oluştu. Lütfen tekrar deneyin.",
				samePath:
					"Yeni güncellemelerde hataları önlemek için Dione yürütülebilirinden farklı bir yol seçin.",
				general: "Yol seçilirken bir hata oluştu. Lütfen tekrar deneyin.",
			},
			success: "Yol başarıyla yapılandırıldı!",
			systemLanguage: "Sistem dili",
		},
		ready: {
			title: "Hazırsınız!",
			subtitle: "Dione'e hoş geldiniz",
			finish: "Bitir",
		},
		clipboard: {
			success: "Panoya doğru kopyalandı, şimdi tarayıcınıza yapıştırın!",
		},
		navigation: {
			back: "Geri",
		},
	},

	// error handling
	error: {
		title: "Beklenmeyen bir hata oluştu",
		description:
			"Uygulamada beklenmeyen bir hata tespit ettik, rahatsızlık için özür dileriz.",
		return: "Geri Dön",
		report: {
			toTeam: "Takıma Bildir",
			report: "Bildir",
			submit: "Raporu Gönder",
			sending: "Rapor gönderiliyor...",
			success: "Rapor gönderildi!",
			failed: "Rapor gönderilmesi başarısız",
			badContent: "Uygunsuz içeriği bildir",
			badContentDescription: "Ardından, raporunuz hakkında bilgi ekleyin",
		},
	},

	// account related
	account: {
		title: "Hesap",
		logout: "Çıkış Yap",
		stats: {
			timeSpent: {
				title: "Harcanan zaman",
				subtitle: "son 7 gün",
			},
			sessions: {
				title: "Oturumlar",
				subtitle: "son 7 gün",
			},
			shared: {
				title: "Paylaşılmış",
				subtitle: "son 7 gün",
			},
			streak: {
				title: "Seri",
				subtitle: "ardışık gün sayısı",
				days: "gün",
			},
		},
	},

	// toast notifications
	toast: {
		close: "Kapat",
		install: {
			downloading: "%s indiriliyor...",
			starting: "%s başlatılıyor...",
			uninstalling: "%s kaldırılıyor...",
			reconnecting: "%s yeniden bağlanılıyor...",
			retrying: "%s yükleme tekrar deneniyor...",
			success: {
				stopped: "%s başarıyla durduruldu.",
				uninstalled: "%s başarıyla kaldırıldı.",
				logsCopied: "Günlükler başarıyla panoya kopyalandı.",
				depsInstalled: "Bağımlılıklar başarıyla yüklendi.",
				shared: "İndirme bağlantısı panoya kopyalandı!",
			},
			error: {
				download: "İndirme başlatma hatası: %s",
				start: "%s başlatma hatası: %s",
				stop: "%s durdurma hatası: %s",
				uninstall: "%s kaldırma hatası: %s",
				serverRunning: "Sunucu zaten çalışıyor.",
				tooManyApps: "Yavaşla! Zaten 6 uygulamanız aynı anda çalışıyor.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "Uygulamalar durduruluyor...",
			description:
				"Tüm açık uygulamalar kapatıldıktan sonra Dione otomatik olarak kapanacaktır.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "Keşfet, Kur, Yenilik Yap — 1 Tıkta.",
		activeApps: "Aktif Uygulamalar",
		app: "uygulama",
		apps: "uygulamalar",
		running: "çalışıyor",
		update: {
			title: "Güncelleme Kullanılabilir",
			description:
				"Dione'nin yeni bir sürümü kullanılabilir, lütfen güncellemek için uygulamayı yeniden başlatın.",
			tooltip:
				"Yeni güncelleme kullanılabilir, lütfen güncellemek için Dione'yi yeniden başlatın.",
		},
		login: {
			title: "Tekrar hoş geldiniz!",
			description:
				"Tüm özelliklere erişmek, projelerinizi senkronize etmek ve deneyiminizi kişiselleştirmek için Dione hesabınızda oturum açın.",
			loginButton: "Dione ile oturum aç",
			later: "Belki sonra",
			waitingTitle: "Oturum açılması bekleniyor...",
			waitingDescription:
				"Devam etmek için tarayıcınızda oturum açma işlemini tamamlayın.",
			cancel: "İptal",
		},
		tooltips: {
			library: "Kütüphane",
			settings: "Ayarlar",
			account: "Hesap",
			logout: "Çıkış Yap",
			login: "Oturum Aç",
			capture: "Yakala",
		},
	},

	// home page
	home: {
		title: "Anasayfa",
		featured: "Öne Çıkan",
		explore: "Keşfet",
	},

	// settings page
	settings: {
		applications: {
			title: "Uygulamalar",
			installationDirectory: {
				label: "Kurulum Dizini",
				description:
					"Yeni uygulamaların varsayılan olarak nereye yükleneceğini seçin.",
			},
			binDirectory: {
				label: "Bin Dizini",
				description:
					"Uygulama ikililerinin kolay erişim için nereye depolanacağını seçin.",
			},
			cleanUninstall: {
				label: "Temiz Kaldırma",
				description:
					"Uygulamaları kaldırırken tüm ilgili bağımlılıkları kaldırın.",
			},
			autoOpenAfterInstall: {
				label: "Kurulumdan Sonra Otomatik Aç",
				description:
					"Kurulumdan sonra uygulamaları ilk kez otomatik olarak açın.",
			},
			deleteCache: {
				label: "Önbelleği Sil",
				description: "Uygulamalardan tüm önbelleğe alınmış verileri kaldırın.",
				button: "Önbelleği Sil",
				deleting: "Siliniyor...",
				deleted: "Silindi",
				error: "Hata",
			},
		},
		interface: {
			title: "Arayüz",
			displayLanguage: {
				label: "Görüntü Dili",
				description: "Tercih ettiğiniz arayüz dilini seçin.",
			},
			disableFeaturedVideos: {
				label: "Öne Çıkan Videoları Devre Dışı Bırak",
				description:
					"Öne çıkan uygulamaların animasyon oynatmasını önleyin. Bunun yerine düz bir renk gradyanı gösterilecektir.",
			},
			helpTranslate:
				"🤔 Dilinizi görmüyor musunuz? Daha fazla eklememize yardım edin!",
			theme: {
				label: "Tema",
				description: "Uygulama için bir renk teması seçin.",
				themes: {
					default: "Mor Rüya",
					midnight: "Gece Yarısı Mavisi",
					ocean: "Okyanus Derinlikleri",
					forest: "Orman Gecesi",
					sunset: "Gün Batımı Işığı",
					royal: "Kraliyet Morası",
				},
			},
			layoutMode: {
				label: "Navigasyon Düzeni",
				description:
					"Kenar çubuğu veya üst çubuk navigasyonu arasında seçim yapın. Üst çubuk modu küçük ekranlar için daha iyidir.",
				sidebar: "Kenar Çubuğu",
				topbar: "Üst Çubuk",
			},
			intenseBackgrounds: {
				label: "Yoğun Arka Plan Renkleri",
				description:
					"İnce tonlar yerine daha canlı arka plan renkleri kullanın.",
			},
			compactView: {
				label: "Kompakt Görünüm",
				description:
					"Ekranda daha fazla içerik göstermek için daha sıkı bir düzen kullanın.",
			},
		},
		notifications: {
			title: "Bildirimler",
			systemNotifications: {
				label: "Sistem Bildirimleri",
				description: "Önemli olaylar için masaüstü bildirimlerini gösterin.",
			},
			installationAlerts: {
				label: "Kurulum Uyarıları",
				description: "Uygulama kurulumları tamamlandığında bildirimler alın.",
			},
			discordRPC: {
				label: "Discord Rich Presence",
				description: "Discord durumunuzda geçerli aktivitenizi gösterin.",
			},
			successSound: {
				label: "Başarı Sesini Etkinleştir",
				description:
					"Uygulamalar kurulumu bitirdiğinde çalınan sesi etkinleştirin.",
			},
		},
		privacy: {
			title: "Gizlilik",
			errorReporting: {
				label: "Hata Raporlaması",
				description:
					"Anonim hata raporları göndererek Dione'yi geliştirmeye yardım edin.",
			},
		},
		other: {
			title: "Diğer",
			disableAutoUpdate: {
				label: "Otomatik Güncellemeleri Devre Dışı Bırak",
				description:
					"Otomatik güncellemeleri devre dışı bırakır. Dikkat: uygulamanız önemli düzeltmeleri veya güvenlik yamaları kaçırabilir. Bu seçenek çoğu kullanıcı için önerilmez.",
			},
			logsDirectory: {
				label: "Günlükler Dizini",
				description: "Uygulama günlüklerinin depolandığı konum.",
			},
			exportLogs: {
				label: "Hata Ayıklama Günlüklerini Dışa Aktar",
				description:
					"Tüm günlükleri ve sistem bilgilerini hata ayıklama için zip dosyasına aktarın.",
				button: "Günlükleri Dışa Aktar",
			},
			submitFeedback: {
				label: "Geri Bildirim Gönder",
				description: "Karşılaştığınız sorunları bildirin.",
				button: "Raporu Gönder",
			},
			showOnboarding: {
				label: "Katılım süreci göster",
				description:
					"Dione'yi ilk durumuna döndürün ve yeniden yapılandırma için katılım sürecini gösterin.",
				button: "Sıfırla",
			},
			variables: {
				label: "Değişkenler",
				description: "Uygulama değişkenlerini ve bunların değerlerini yönetin.",
				button: "Değişkenleri Aç",
			},
			checkUpdates: {
				label: "Güncellemeleri kontrol et",
				description:
					"Güncellemeleri kontrol edin ve yeni sürüm kullanılabilir olduğunda bildir.",
				button: "Güncellemeleri Kontrol Et",
			},
		},
	},

	// report form
	report: {
		title: "Sorunu Açıkla",
		description:
			"Lütfen ne olduğunu ve ne yapmaya çalıştığınızı ayrıntılı olarak belirtin.",
		placeholder: "Örnek: Bir uygulama kurmaya çalışırken bu hata oluştu...",
		systemInformationTitle: "Sistem Bilgileri",
		disclaimer:
			"Aşağıdaki sistem bilgileri ve anonim bir kimlik raporunuza dahil edilecektir.",
		success: "Rapor başarıyla gönderildi!",
		error: "Rapor gönderilmesi başarısız oldu. Lütfen tekrar deneyin.",
		send: "Raporu Gönder",
		sending: "Gönderiliyor...",
		contribute:
			"Bu komut dosyasını tüm cihazlarla uyumlu hale getirmeye yardım edin",
	},

	// quick launch component
	quickLaunch: {
		title: "Hızlı Başlatma",
		addApp: "Uygulama Ekle",
		tooltips: {
			noMoreApps: "Eklenecek uygulama yok",
		},
		selectApp: {
			title: "Uygulama Seçin",
			description:
				"{count} uygulama kullanılabilir. {max} adedine kadar seçebilirsiniz.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "Bazı bağımlılıklar eksik!",
		installing: "Bağımlılıklar yükleniyor...",
		install: "Kur",
		logs: {
			initializing: "Bağımlılık indirmesi başlatılıyor...",
			loading: "Yükleniyor...",
			connected: "Sunucuya bağlandı",
			disconnected: "Sunucudan bağlantı kesildi",
			error: {
				socket: "Soket kurulum hatası",
				install: "❌ Bağımlılık kurulum hatası: {error}",
			},
			allInstalled: "Tüm bağımlılıklar zaten yüklü.",
		},
	},

	// install AI modal
	installAI: {
		step1: {
			title: "Dio AI ile tanışın",
			description:
				"Doğrudan Dione'ye entegre edilen zeka asistanınız. Uygulamalarınızla etkileşim kurmanın yeni bir yolunu deneyimleyin.",
		},
		step2: {
			title: "Özellikler",
			description: "İhtiyacınız olan her şey, burada.",
			features: {
				free: {
					title: "Ücretsiz Kullanım",
					description: "Abonelik veya gizli ücret yok.",
				},
				local: {
					title: "Yerel İşleme",
					description: "Tamamen donanımınızda çalışır.",
				},
				private: {
					title: "Özel ve Güvenli",
					description: "Verileriniz hiçbir zaman cihazınızı terk etmez.",
				},
			},
		},
		step3: {
			title: "Ollama'yı Yükle",
			description:
				"Dio AI, sisteminiz içinde LLM'lerle çalışmak için Ollama kullanır.",
			installing: "Yükleniyor...",
			startingDownload: "İndirme başlatılıyor...",
			installNow: "Şimdi Kur",
		},
		back: "Geri",
		next: "İleri",
	},

	// delete loading modal
	deleteLoading: {
		confirm: {
			title: "Kaldırmayı Onayla",
			subtitle: "Kaldırılacak öğeleri seçin",
		},
		dependencies: "Bağımlılıklar",
		depsDescription: "Uygulama ile birlikte kaldırılacak bağımlılıkları seçin:",
		uninstall: {
			title: "Kaldır",
			deps: "Bağımlılıkları kaldır",
			wait: "lütfen bekleyin...",
		},
		uninstalling: {
			title: "Kaldırılıyor",
			deps: "Bağımlılıklar kaldırılıyor",
			wait: "Lütfen bekleyin...",
		},
		processing: "İşleniyor...",
		success: {
			title: "Kaldırılmış",
			subtitle: "başarıyla",
			closing: "Bu modal kapatılıyor",
			seconds: "saniye...",
		},
		autoClosing: "Otomatik olarak kapatılıyor...",
		error: {
			title: "Beklenmeyen",
			subtitle: "bir hata",
			hasOccurred: "oluştu",
			deps: "Dione hiçbir bağımlılığı kaldıramadı, lütfen manuel olarak yapın.",
			general:
				"Daha sonra tekrar deneyin veya daha fazla bilgi için günlükleri kontrol edin.",
		},
		loading: {
			title: "Yükleniyor...",
			wait: "Lütfen bekleyin...",
		},
	},

	// logs component
	logs: {
		loading: "Yükleniyor...",
		openPreview: "Önizlemeyi Aç",
		copyLogs: "Günlükleri Kopyala",
		stop: "Durdur",
		disclaimer:
			"Gösterilen günlükler uygulamanın kendisinden alınmıştır. Bir hata görürseniz, lütfen önce orijinal uygulamanın geliştiricilerine bildirin.",
		status: {
			success: "Başarı",
			error: "Hata",
			pending: "Beklemede",
		},
	},

	// loading states
	loading: {
		text: "Yükleniyor...",
	},

	// iframe component
	iframe: {
		back: "Geri",
		openFolder: "Klasörü Aç",
		openInBrowser: "Tarayıcıda Aç",
		openNewWindow: "Yeni pencerede aç",
		fullscreen: "Tam Ekran",
		stop: "Durdur",
		reload: "Yenile",
		logs: "Günlükler",
	},

	// actions component
	actions: {
		reconnect: "Yeniden Bağlan",
		start: "Başlat",
		uninstall: "Kaldır",
		install: "Kur",
		publishedBy: "Yayınlayan",
		installed: "Yüklü",
		notInstalled: "Yüklü değil",
	},

	// promo component
	promo: {
		title: "Burada öne çıkmak ister misiniz?",
		description: "Aracınızı topluluğumuza gösterin",
		button: "Öne Çık",
	},

	// installed component
	installed: {
		title: "Kütüphaneniz",
		empty: {
			title: "Yüklü uygulamanız yok",
			action: "Şimdi birini yükleyin",
		},
	},

	// local component
	local: {
		title: "Yerel komut dosyaları",
		upload: "Komut dosyasını yükle",
		noScripts: "Komut dosyası bulunamadı",
		deleting: "Komut dosyası siliniyor, lütfen bekleyin...",
		uploadModal: {
			title: "Komut Dosyasını Yükle",
			selectFile: "Dosya seçmek için tıklayın",
			selectedFile: "Seçilen Dosya",
			scriptName: "Komut dosyası adı",
			scriptDescription: "Komut dosyası açıklaması (isteğe bağlı)",
			uploadFile: "Dosyayı Yükle",
			uploading: "Yükleniyor...",
			errors: {
				uploadFailed: "Komut dosyasını yüklenemedi. Lütfen tekrar deneyin.",
				uploadError: "Komut dosyasını yüklerken bir hata oluştu.",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "Komut dosyası bulunamadı",
		loadingMore: "Daha fazla yükleniyor...",
		reachedEnd: "Sona ulaştınız.",
		notEnoughApps: "Yeterli uygulama olmadığını düşünüyorsanız,",
		helpAddMore: "lütfen daha fazla eklememize yardım edin",
		viewingCached:
			"Çevrimdışısınız. Önbelleğe alınan içeriği görüntülüyorsunuz. Kurulum özellikleri devre dışıdır.",
		errors: {
			notArray: "Getirilen veriler dizi değil",
			fetchFailed: "Komut dosyaları getirilemiyor",
			notSupported: "Ne yazık ki %s, %s üzerinde desteklenmiyor.",
			notSupportedTitle: "Cihazınız uyumlu olmayabilir.",
		},
	},

	// search component
	search: {
		placeholder: "Komut dosyalarını ara...",
		filters: {
			audio: "Ses",
			image: "Görüntü",
			video: "Video",
			chat: "Sohbet",
		},
	},

	// network share modal
	networkShare: {
		title: "Paylaş",
		modes: {
			local: "Yerel",
			public: "Herkese Açık",
			connecting: "Bağlanılıyor...",
		},
		warning: {
			title: "Herkese Açık Erişim",
			description:
				"Herhangi bir yerden erişilebilen herkese açık bir URL oluşturur. Yalnızca güvenilir kişilerle paylaşın.",
		},
		local: {
			shareUrl: "Paylaş URL",
			urlDescription: "Bu URL'yi yerel ağınızdaki cihazlarla paylaşın",
			localNetwork: "Yerel Ağ:",
			description: "Bu URL, aynı ağa bağlı cihazlarda çalışır.",
		},
		public: {
			shareUrl: "Herkese Açık URL",
			urlDescription: "Bu URL'yi dünyadaki herkesle paylaşın",
			passwordTitle: "İlk Parola",
			visitorMessage:
				"Ziyaretçilerin tünele erişmek için cihaz başına bir kez bunu girmesi gerekebilir.",
			stopSharing: "Paylaşmayı Durdur",
		},
		errors: {
			noAddress: "Ağ adresi alınamıyor. Lütfen bağlantınızı kontrol edin.",
			loadFailed: "Ağ bilgileri yüklenemedi.",
			noUrl: "Kopyalanacak URL yok.",
			copyFailed: "Panoya kopyalanamadı.",
			tunnelFailed: "Tünel başlatılamadı",
		},
	},

	// login features modal
	loginFeatures: {
		title: "Özellikleri kaçırıyorsunuz",
		description: "Bu özellikleri kaçırmamak için Dione'ye oturum açın.",
		login: "Oturum Aç",
		skip: "Atla",
		features: {
			customReports: {
				title: "Özel raporlar gönderin",
				description:
					"Uygulamadan özel raporlar gönderin, hata durumunda desteği daha hızlı hale getirin.",
			},
			createProfile: {
				title: "Profil oluştur",
				description:
					"Dione topluluğu için bir profil oluşturun, böylece sizi tanıyabiliriz.",
			},
			syncData: {
				title: "Verilerinizi Senkronize Edin",
				description: "Verilerinizi tüm cihazlarınızda senkronize edin.",
			},
			earlyBirds: {
				title: "Erken kuş güncellemeleri alın",
				description:
					"Başka herkesin önünde erken kuş güncellemeleri ve yeni özellikler alın.",
			},
			giveOutLikes: {
				title: "Beğeni dağıtın",
				description:
					"En çok sevdiğiniz uygulamalara beğeni verin, böylece daha fazla kişi kullanır!",
			},
			publishScripts: {
				title: "Komut dosyaları yayınlayın",
				description: "Komut dosyalarınızı yayınlayın ve dünya ile paylaşın.",
			},
			achieveGoals: {
				title: "Hedeflere ulaşın",
				description:
					"Dione'yi 7 gün boyunca kullanmak gibi hedeflere ulaşarak ücretsiz hediyeler alın",
			},
			getNewswire: {
				title: "Newswire alın",
				description:
					"Yeni özelliklerden haberdar olmamak için e-posta ile güncellemeler alın.",
			},
		},
	},

	// editor component
	editor: {
		selectFile: "Düzenlemeye başlamak için bir dosya seçin",
		previewNotAvailable: "Bu dosya için önizleme kullanılamıyor.",
		mediaNotSupported: "Bu medya türü için önizleme henüz desteklenmiyor.",
		previewOnly: "Yalnızca önizleme",
		unsaved: "Kaydedilmemiş",
		retry: "Yeniden Dene",
		editorLabel: "Düzenleyici",
	},

	// sidebar links
	links: {
		discord: "Discord",
		github: "GitHub",
		dione: "Dione",
		builtWith: "ile yapılmış",
	},

	// update notifications
	updates: {
		later: "Sonra",
		install: "Kur",
	},

	// iframe actions
	iframeActions: {
		shareOnNetwork: "Ağda paylaş",
	},

	// version info
	versions: {
		node: "Node",
		electron: "Electron",
		chromium: "Chromium",
	},

	// connection messages
	connection: {
		retryLater: "Bağlantı sorunu yaşıyoruz, lütfen daha sonra tekrar deneyin.",
	},

	// variables modal
	variables: {
		title: "Ortam Değişkenleri",
		addKey: "Anahtar Ekle",
		searchPlaceholder: "Değişkenleri ara...",
		keyPlaceholder: "Anahtar (ör: MY_VAR)",
		valuePlaceholder: "Değer",
		copyAll: "Tümünü panoya kopyala",
		confirm: "Onayla",
		copyPath: "Yolu Kopyala",
		copyFullValue: "Tam değeri kopyala",
		deleteKey: "Anahtarı Sil",
	},

	// custom commands modal
	customCommands: {
		title: "Özel parametrelerle başlat",
		launch: "Başlat",
	},

	// context menu
	contextMenu: {
		copyPath: "Yolu Kopyala",
		open: "Aç",
		reload: "Yenile",
		rename: "Yeniden Adlandır",
		delete: "Sil",
	},

	// file tree
	fileTree: {
		noFiles: "Bu çalışma alanında dosya bulunamadı.",
		media: "Medya",
		binary: "İkili",
	},

	// entry name dialog
	entryDialog: {
		name: "Ad",
		createFile: "Dosya oluştur",
		createFolder: "Klasör oluştur",
		renameFile: "Dosyayı yeniden adlandır",
		renameFolder: "Klasörü yeniden adlandır",
		createInRoot: "Bu, çalışma alanı köküne oluşturulacaktır.",
		createInside: "Bu, {path} içinde oluşturulacaktır.",
		currentLocation: "Geçerli konum: {path}.",
		currentLocationRoot: "Geçerli konum: çalışma alanı köküdür.",
		rename: "Yeniden Adlandır",
		placeholderFile: "example.ts",
		placeholderFolder: "Yeni Klasör",
	},

	// workspace editor
	workspaceEditor: {
		newFile: "Yeni dosya",
		newFolder: "Yeni klasör",
		retry: "Yeniden Dene",
		back: "Geri",
		save: "Kaydet",
		openInExplorer: "Gezginde aç",
		resolvingPath: "Yol çözümleniyor...",
		workspace: "Çalışma Alanı",
	},

	// header bar
	headerBar: {
		back: "Geri",
		openInExplorer: "Gezginde aç",
		save: "Kaydet",
	},

	// settings page footer
	settingsFooter: {
		builtWithLove: "♥ ile yapılmış",
		getDioneWebsite: "getdione.app",
		version: "Sürüm",
		port: "Bağlantı Noktası",
	},

	// notifications
	notifications: {
		enabled: {
			title: "Bildirimler etkinleştirildi",
			description: "Önemli olaylar için bildirimler alacaksınız.",
		},
		learnMore: "Daha Fazlasını Öğren",
	},

	// language selector
	languageSelector: {
		next: "İleri",
	},

	// onboarding - select path
	selectPath: {
		chooseLocation: "Kurulum Konumunu Seçin",
		changePath: "Yolu Değiştir",
	},

	// browser compatibility
	browserCompatibility: {
		audioNotSupported: "Tarayıcınız ses öğesini desteklemiyor.",
		videoNotSupported: "Tarayıcınız video öğesini desteklemiyor.",
	},

	// library card
	library: {
		official: "Resmi",
	},

	// sidebar updates
	sidebarUpdate: {
		newUpdateAvailable: "Yeni güncelleme kullanılabilir",
		whatsNew: "İşte yenilikler",
	},

	// iframe component labels
	iframeLabels: {
		back: "Geri",
		logs: "Günlükler",
		disk: "Disk",
		editor: "Düzenleyici",
	},

	// progress component
	progress: {
		running: "Çalışıyor...",
	},

	// toast messages
	toastMessages: {
		copiedToClipboard: "Panoya kopyalandı!",
		keyAndValueRequired: "Anahtar ve değer gereklidir",
		variableAdded: "Değişken eklendi",
		failedToAddVariable: "Değişken eklenemedi",
		variableRemoved: "Değişken kaldırıldı",
		failedToRemoveVariable: "Değişken kaldırılamadı",
		valueRemoved: "Değer kaldırıldı",
		failedToRemoveValue: "Değer kaldırılamadı",
		pathCopiedToClipboard: "Yol panoya kopyalandı",
		failedToCopyPath: "Yol kopyalanamadı",
		unableToOpenLocation: "Konum açılamıyor",
		cannotDeleteWorkspaceRoot: "Çalışma alanı kökü silinemez",
		deleted: "Silindi",
		failedToDeleteEntry: "Girdi silinemedi",
		workspaceNotAvailable: "Çalışma alanı kullanılamıyor",
		selectFileOrFolderToRename:
			"Yeniden adlandırılacak bir dosya veya klasör seçin",
		cannotRenameWorkspaceRoot: "Çalışma alanı kökünün adı değiştirilemez",
		entryRenamed: "Girdi yeniden adlandırıldı",
		fileSavedSuccessfully: "Dosya başarıyla kaydedildi",
		failedToSaveFile: "Dosya kaydedilemedi",
		mediaFilesCannotBeOpened: "Medya dosyaları düzenleyicide açılamaz.",
		binaryFilesCannotBeOpened:
			"İkili ve yürütülebilir dosyalar düzenleyicide açılamaz.",
		thisFileTypeCannotBeEdited: "Bu dosya türü henüz düzenlenemez.",
	},

	// error messages
	errorMessages: {
		workspaceNotFound: "Çalışma alanı bulunamadı",
		failedToLoadWorkspace: "Çalışma alanı yüklenemedi",
		failedToLoadDirectory: "Dizin yüklenemedi",
		unableToOpenWorkspace: "Çalışma alanı açılamıyor",
		failedToLoadFile: "Dosya yüklenemedi",
		nameCannotBeEmpty: "Ad boş olamaz",
		nameContainsInvalidCharacters: "Ad geçersiz karakterler içeriyor",
		failedToCreateEntry: "Girdi oluşturulamadı",
		failedToRenameEntry: "Girdi yeniden adlandırılamadı",
	},

	// file operations
	fileOperations: {
		fileCreated: "Dosya oluşturuldu",
		folderCreated: "Klasör oluşturuldu",
		untitledFile: "untitled.txt",
		newFolder: "Yeni Klasör",
	},

	// confirmation dialogs
	confirmDialogs: {
		removeValue: "Kaldırmak istediğinizden emin misiniz",
		thisValue: "bu değeri",
		keyAndAllValues: "anahtarı ve tüm değerlerini",
		from: "şuradan",
	},

	// network share modal
	networkShareErrors: {
		failedToLoadNetworkInfo: "Ağ bilgileri yüklenemedi.",
		failedToStartTunnel: "Tünel başlatılamadı",
		failedToCopyToClipboard: "Panoya kopyalanamadı.",
	},

	// feed component
	feedErrors: {
		invalidDataFormat: "API'den geçersiz veri formatı",
		failedToFetchScripts: "Komut dosyaları getirilemedi",
		offline:
			"Çevrimdışısınız ve kullanılabilir önbelleğe alınan içerik yoktur.",
	},

	// upload script modal
	uploadScript: {
		fileLoadedLocally: "Dosya yerel olarak yüklendi",
	},

	// running apps
	runningApps: {
		running: "Çalışıyor",
		thereIsAnAppRunningInBackground: "Arka planda çalışan bir uygulama var.",
		failedToReloadQuickLaunch:
			"Hızlı başlatma uygulamaları yeniden yüklenemedi",
		failedToFetchInstalledApps: "Yüklü uygulamalar getirilemedi",
	},
} as const;
