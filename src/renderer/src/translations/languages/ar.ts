export const ar = {
	// common actions and states
	common: {
		cancel: "إلغاء",
		loading: "جار التحميل...",
		error: "خطأ",
		success: "نجاح",
		pending: "قيد الانتظار",
		back: "رجوع",
		unselectAll: "إلغاء اختيار الكل",
		selectAll: "اختيار الكل",
	},

	// authentication and access related
	noAccess: {
		title: "انضم إلى قائمة Dione البيضاء",
		description:
			"Dione قيد الإنشاء ولا يمكن الوصول إليها إلا لعدد محدود من المستخدمين، انضم إلى قائمتنا البيضاء الآن للوصول إلى الإصدارات المستقبلية من تطبيقنا.",
		join: "انضم",
		logout: "تسجيل الخروج",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "مرحباً بك في",
			subtitle:
				"شكرًا لانضمامك إلينا مبكرًا في هذه الرحلة. قم بتسجيل الدخول إلى حسابك للبدء.",
			login: "تسجيل الدخول",
			copyLink: "نسخ الرابط",
			skipLogin: "الدخول بدون تسجيل الدخول",
		},
		loggingIn: {
			title: "جار تسجيل الدخول...",
			authError: "تعذر المصادقة؟",
			goBack: "عودة",
		},
		languageSelector: {
			title: "اختر لغتك",
		},
		ready: {
			title: "أنت جاهز!",
			subtitle: "يسعدنا وجودك هنا",
			finish: "إنهاء",
		},
		clipboard: {
			success: "تم النسخ إلى الحافظة بشكل صحيح، الصقه الآن في متصفحك!",
		},
	},

	// error handling
	error: {
		title: "حدث خطأ غير متوقع",
		description: "لقد اكتشفنا خطأ غير متوقع في التطبيق، نأسف للإزعاج.",
		return: "عودة",
		report: {
			toTeam: "إبلاغ الفريق",
			sending: "جار إرسال التقرير...",
			success: "تم إرسال التقرير!",
			failed: "فشل إرسال التقرير",
		},
	},

	// account related
	account: {
		title: "الحساب",
		logout: "تسجيل الخروج",
		stats: {
			timeSpent: {
				title: "الوقت المستغرق",
				subtitle: "في آخر 7 أيام",
			},
			sessions: {
				title: "الجلسات",
				subtitle: "في آخر 7 أيام",
			},
			shared: {
				title: "تمت المشاركة",
				subtitle: "في آخر 7 أيام",
			},
			streak: {
				title: "السلسلة",
				subtitle: "أيام متتالية",
				days: "أيام",
			},
		},
	},

	// toast notifications
	toast: {
		close: "إغلاق",
		install: {
			downloading: "جارٍ تنزيل %s...",
			starting: "جارٍ بدء %s...",
			uninstalling: "جارٍ إلغاء تثبيت %s...",
			reconnecting: "جارٍ إعادة الاتصال بـ %s...",
			retrying: "جارٍ محاولة تثبيت %s مرة أخرى...",
			success: {
				stopped: "تم إيقاف %s بنجاح.",
				uninstalled: "تم إلغاء تثبيت %s بنجاح.",
				logsCopied: "تم نسخ السجلات بنجاح إلى الحافظة.",
				depsInstalled: "تم تثبيت التبعيات بنجاح.",
				shared: "تم نسخ رابط التنزيل إلى الحافظة!",
			},
			error: {
				download: "خطأ في بدء التنزيل: %s",
				start: "خطأ في بدء %s: %s",
				stop: "خطأ في إيقاف %s: %s",
				uninstall: "خطأ في إلغاء تثبيت %s: %s",
				serverRunning: "الخادم يعمل بالفعل.",
				tooManyApps: "ابطئ! لديك بالفعل 6 تطبيقات تعمل في نفس الوقت.",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "جارٍ إيقاف التطبيقات...",
			description:
				"سيتم إغلاق Dione تلقائيًا بعد إغلاق جميع التطبيقات المفتوحة.",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "استكشف، ثبت، ابتكر — بنقرة واحدة.",
		activeApps: "التطبيقات النشطة",
		update: {
			title: "تحديث متاح",
			description:
				"يتوفر إصدار جديد من Dione، يرجى إعادة تشغيل التطبيق للتحديث.",
			tooltip: "يتوفر تحديث جديد، يرجى إعادة تشغيل Dione للتحديث.",
		},
		tooltips: {
			library: "المكتبة",
			settings: "الإعدادات",
			account: "الحساب",
			logout: "تسجيل الخروج",
			login: "تسجيل الدخول",
		},
	},

	// home page
	home: {
		featured: "مميز",
		explore: "استكشف",
	},

	// settings page
	settings: {
		applications: {
			title: "التطبيقات",
			installationDirectory: {
				label: "دليل التثبيت",
				description: "اختر مكان تثبيت التطبيقات الجديدة افتراضيًا",
			},
			cleanUninstall: {
				label: "إلغاء تثبيت نظيف",
				description: "إزالة جميع التبعيات ذات الصلة عند إلغاء تثبيت التطبيقات",
			},
			deleteCache: {
				label: "حذف ذاكرة التخزين المؤقت",
				description: "إزالة جميع البيانات المخزنة مؤقتًا من التطبيقات",
				button: "حذف ذاكرة التخزين المؤقت",
				deleting: "جارٍ الحذف...",
				deleted: "تم الحذف",
				error: "خطأ",
			},
		},
		interface: {
			title: "الواجهة",
			displayLanguage: {
				label: "لغة العرض",
				description: "اختر لغة الواجهة المفضلة لديك",
			},
			helpTranslate: "🤔 لا ترى لغتك؟ ساعدنا في إضافة المزيد!",
			compactView: {
				label: "عرض مضغوط",
				description:
					"استخدم تخطيطًا أكثر تكثيفًا لتناسب المزيد من المحتوى على الشاشة",
			},
		},
		notifications: {
			title: "الإشعارات",
			systemNotifications: {
				label: "إشعارات النظام",
				description: "إظهار إشعارات سطح المكتب للأحداث الهامة",
			},
			installationAlerts: {
				label: "تنبيهات التثبيت",
				description: "الحصول على إشعار عند اكتمال تثبيت التطبيقات",
			},
		},
		privacy: {
			title: "الخصوصية",
			errorReporting: {
				label: "الإبلاغ عن الأخطاء",
				description:
					"ساعد في تحسين Dione عن طريق إرسال تقارير أخطاء مجهولة الهوية",
			},
		},
		other: {
			title: "أخرى",
			logsDirectory: {
				label: "دليل السجلات",
				description: "الموقع الذي يتم فيه تخزين سجلات التطبيق",
			},
			submitFeedback: {
				label: "إرسال ملاحظات",
				description: "أبلغ عن أي مشكلات أو مشاكل تواجهها",
				button: "إرسال تقرير",
			},
			showOnboarding: {
				label: "إظهار الإعداد الأولي",
				description:
					"إعادة تعيين Dione إلى حالته الأولية وإظهار الإعداد الأولي مرة أخرى لإعادة التكوين",
				button: "إعادة تعيين",
			},
		},
	},

	// report form
	report: {
		title: "وصف المشكلة",
		description: "يرجى تقديم تفاصيل حول ما حدث وما كنت تحاول القيام به.",
		placeholder: "مثال: كنت أحاول تثبيت تطبيق عندما حدث هذا الخطأ...",
		systemInformationTitle: "معلومات النظام",
		disclaimer: "سيتم تضمين معلومات النظام التالية ومعرف مجهول في تقريرك.",
		success: "تم إرسال التقرير بنجاح!",
		error: "فشل إرسال التقرير. يرجى المحاولة مرة أخرى.",
		send: "إرسال تقرير",
		sending: "جارٍ الإرسال...",
		contribute: "به ما کمک کنید تا این اسکریپت را با همه دستگاه ها سازگار کنیم",
	},

	// quick launch component
	quickLaunch: {
		title: "تشغيل سريع",
		addApp: "إضافة تطبيق",
		selectApp: {
			title: "حدد تطبيقًا",
			description: "{count} تطبيقات متاحة. يمكنك اختيار ما يصل إلى {max}.",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "بعض التبعيات مفقودة!",
		installing: "جارٍ تثبيت التبعيات...",
		install: "تثبيت",
		logs: {
			initializing: "جارٍ تهيئة تنزيل التبعيات...",
			loading: "جار التحميل...",
			connected: "متصل بالخادم",
			disconnected: "قطع الاتصال بالخادم",
			error: {
				socket: "خطأ في إعداد المقبس",
				install: "❌ خطأ في تثبيت التبعيات: {error}",
			},
			allInstalled: "تم تثبيت جميع التبعيات بالفعل.",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstalling: {
			title: "جارٍ إلغاء التثبيت",
			deps: "جارٍ إلغاء تثبيت التبعيات",
			wait: "يرجى الانتظار...",
		},
		success: {
			title: "تم إلغاء التثبيت",
			subtitle: "بنجاح",
			closing: "جارٍ إغلاق هذه النافذة المنبثقة في",
			seconds: "ثوانٍ...",
		},
		error: {
			title: "حدث خطأ غير متوقع",
			subtitle: "خطأ",
			hasOccurred: "حدثت",
			deps: "لم تتمكن Dione من إزالة أي تبعيات، يرجى القيام بذلك يدويًا.",
			general:
				"يرجى المحاولة مرة أخرى لاحقًا أو التحقق من السجلات لمزيد من المعلومات.",
		},
		loading: {
			title: "جار التحميل...",
			wait: "يرجى الانتظار...",
		},
	},

	// logs component
	logs: {
		loading: "جار التحميل...",
		disclaimer:
			"السجلات المعروضة هي من التطبيق نفسه. إذا رأيت خطأ، يرجى الإبلاغ عنه لمطوري التطبيق الأصلي أولاً.",
		status: {
			success: "نجاح",
			error: "خطأ",
			pending: "قيد الانتظار",
		},
	},

	// loading states
	loading: {
		text: "جار التحميل...",
	},

	// iframe component
	iframe: {
		back: "رجوع",
		openFolder: "فتح المجلد",
		openInBrowser: "فتح في المتصفح",
		openNewWindow: "فتح في نافذة جديدة",
		fullscreen: "ملء الشاشة",
		stop: "إيقاف",
		reload: "إعادة تحميل",
		logs: "السجلات",
	},

	// actions component
	actions: {
		reconnect: "إعادة الاتصال",
		start: "بدء",
		uninstall: "إلغاء التثبيت",
		install: "تثبيت",
		publishedBy: "نشر بواسطة",
	},

	// promo component
	promo: {
		title: "هل تريد أن تكون مميزًا هنا؟",
		description: "اعرض أداتك لمجتمعنا",
		button: "احصل على ميزة",
	},

	// installed component
	installed: {
		title: "مكتبتك",
		empty: {
			title: "لم تقم بتثبيت أي تطبيقات",
			action: "تثبيت واحد الآن",
		},
	},

	// local component
	local: {
		title: "السلاسل المحلية",
		upload: "تحميل السكربت",
		noScripts: "لم يتم العثور على برامج نصية",
	},

	// feed component
	feed: {
		noScripts: "لم يتم العثور على برامج نصية",
		errors: {
			notArray: "البيانات التي تم جلبها ليست مصفوفة",
			fetchFailed: "فشل جلب البرامج النصية",
			notSupported: "لقد تم رفض %s على %s.",
			notSupportedTitle: "جهازك غير مدعوم",
		},
	},

	// search component
	search: {
		placeholder: "ابحث عن البرامج النصية...",
		filters: {
			audio: "صوت",
			image: "صورة",
			video: "فيديو",
			chat: "دردشة",
		},
	},
} as const;
