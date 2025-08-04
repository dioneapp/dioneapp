export const bn = {
	// common actions and states
	common: {
		cancel: "বাতিল করুন",
		loading: "লোড হচ্ছে...",
		error: "ত্রুটি",
		success: "সফল",
		pending: "মুলতুবি",
		back: "ফিরে যান",
		unselectAll: "সমস্ত অন্তর্ভুক্ত করুন",
		selectAll: "সমস্ত নির্বাচন",
	},

	// authentication and access related
	noAccess: {
		title: "ডায়োন শ্বেততালিকায় যোগ দিন",
		description:
			"ডায়োন নির্মাণাধীন আছে এবং শুধুমাত্র সীমিত সংখ্যক ব্যবহারকারী এটি অ্যাক্সেস করতে পারেন, আমাদের অ্যাপের ভবিষ্যতের সংস্করণগুলিতে অ্যাক্সেস পেতে এখন আমাদের শ্বেততালিকায় যোগ দিন।",
		join: "যোগ দিন",
		logout: "লগ আউট",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "স্বাগতম",
			subtitle:
				"এই যাত্রায় আমাদের সাথে তাড়াতাড়ি যোগ দেওয়ার জন্য আপনাকে ধন্যবাদ। শুরু করতে আপনার অ্যাকাউন্টে লগ ইন করুন।",
			login: "লগ ইন করুন",
			copyLink: "লিঙ্ক কপি করুন",
			skipLogin: "লগ ইন বিনা",
		},
		loggingIn: {
			title: "লগ ইন করা হচ্ছে...",
			authError: "প্রমাণীকরণ করা যায়নি?",
			goBack: "ফিরে যান",
		},
		languageSelector: {
			title: "আপনার ভাষা নির্বাচন",
		},
		ready: {
			title: "আপনি প্রস্তুত!",
			subtitle: "আমরা আপনাকে এখানে পেয়ে আনন্দিত",
			finish: "শেষ করুন",
		},
		clipboard: {
			success: "সঠিকভাবে ক্লিপবোর্ডে কপি করা হয়েছে, এখন আপনার ব্রাউজারে পেস্ট করুন!",
		},
	},

	// error handling
	error: {
		title: "অপ্রত্যাশিত ত্রুটি ঘটেছে",
		description:
			"আমরা অ্যাপ্লিকেশনটিতে একটি অপ্রত্যাশিত ত্রুটি সনাক্ত করেছি, অসুবিধার জন্য আমরা দুঃখিত।",
		return: "ফেরত",
		report: {
			toTeam: "দলকে রিপোর্ট করুন",
			sending: "রিপোর্ট পাঠানো হচ্ছে...",
			success: "রিপোর্ট পাঠানো হয়েছে!",
			failed: "রিপোর্ট পাঠাতে ব্যর্থ হয়েছে",
		},
	},

	// account related
	account: {
		title: "অ্যাকাউন্ট",
		logout: "লগ আউট",
		stats: {
			timeSpent: {
				title: "ব্যয়িত সময়",
				subtitle: "গত 7 দিনে",
			},
			sessions: {
				title: "সেশন",
				subtitle: "গত 7 দিনে",
			},
			shared: {
				title: "শেয়ার করা হয়েছে",
				subtitle: "গত 7 দিনে",
			},
			streak: {
				title: "স্ট্রিক",
				subtitle: "পরপর দিন",
				days: "দিন",
			},
		},
	},

	// toast notifications
	toast: {
		close: "বন্ধ করুন",
		install: {
			downloading: "%s ডাউনলোড হচ্ছে...",
			starting: "%s শুরু হচ্ছে...",
			uninstalling: "%s আনইনস্টল হচ্ছে...",
			reconnecting: "%s পুনরায় সংযোগ করা হচ্ছে...",
			retrying: "％s আবার ইনস্টল করার চেষ্টা করা হচ্ছে...",
			success: {
				stopped: "%s সফলভাবে বন্ধ হয়েছে।",
				uninstalled: "%s সফলভাবে আনইনস্টল হয়েছে।",
				logsCopied: "লগ সফলভাবে ক্লিপবোর্ডে কপি করা হয়েছে।",
				depsInstalled: "নির্ভরতা সফলভাবে ইনস্টল করা হয়েছে।",
				shared: "ডাউনলোড লিঙ্ক ক্লিপবোর্ডে কপি করা হয়েছে!",
			},
			error: {
				download: "ডাউনলোড শুরু করতে ত্রুটি: %s",
				start: "%s শুরু করতে ত্রুটি: %s",
				stop: "%s বন্ধ করতে ত্রুটি: %s",
				uninstall: "%s আনইনস্টল করতে ত্রুটি: %s",
				serverRunning: "সার্ভার ইতিমধ্যেই চলছে।",
				tooManyApps: "ধীরে! আপনি ইতিমধ্যেই একই সময়ে 6টি অ্যাপ চালাচ্ছেন।",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "অ্যাপ্লিকেশন বন্ধ করা হচ্ছে...",
			description:
				"সমস্ত খোলা অ্যাপ্লিকেশন বন্ধ হওয়ার পর ডায়োন স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে।",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "অন্বেষণ করুন, ইনস্টল করুন, উদ্ভাবন করুন — 1 ক্লিকে।",
		activeApps: "সক্রিয় অ্যাপস",
		update: {
			title: "আপডেট উপলব্ধ",
			description:
				"ডায়োনের একটি নতুন সংস্করণ উপলব্ধ, আপডেট করার জন্য অ্যাপটি পুনরায় চালু করুন।",
			tooltip: "নতুন আপডেট উপলব্ধ, আপডেট করতে ডায়োন পুনরায় চালু করুন।",
		},
		tooltips: {
			library: "লাইব্রেরি",
			settings: "সেটিংস",
			account: "অ্যাকাউন্ট",
			logout: "লগ আউট",
			login: "লগ ইন",
		},
	},

	// home page
	home: {
		featured: "বৈশিষ্ট্যযুক্ত",
		explore: "অন্বেষণ করুন",
	},

	// settings page
	settings: {
		applications: {
			title: "অ্যাপ্লিকেশন",
			installationDirectory: {
				label: "ইনস্টলেশন ডিরেক্টরি",
				description: "নতুন অ্যাপ্লিকেশনগুলি ডিফল্টরূপে কোথায় ইনস্টল করা হবে তা চয়ন করুন",
			},
			cleanUninstall: {
				label: "পরিষ্কার আনইনস্টল",
				description: "অ্যাপ্লিকেশন আনইনস্টল করার সময় সমস্ত সম্পর্কিত নির্ভরতা সরান",
			},
			deleteCache: {
				label: "ক্যাশে মুছুন",
				description: "অ্যাপ্লিকেশন থেকে সমস্ত ক্যাশে ডেটা মুছুন",
				button: "ক্যাশে মুছুন",
				deleting: "মুছে ফেলা হচ্ছে...",
				deleted: "মুছে ফেলা হয়েছে",
				error: "ত্রুটি",
			},
		},
		interface: {
			title: "ইন্টারফেস",
			displayLanguage: {
				label: "ডিসপ্লে ভাষা",
				description: "আপনার পছন্দের ইন্টারফেস ভাষা নির্বাচন করুন",
			},
			helpTranslate: "🤔 আপনার ভাষা দেখতে পাচ্ছেন না? আমাদের আরও যোগ করতে সাহায্য করুন!",
			compactView: {
				label: "কমপ্যাক্ট ভিউ",
				description: "স্ক্রিনে আরও বিষয়বস্তু ফিট করার জন্য আরও ঘন বিন্যাস ব্যবহার করুন",
			},
		},
		notifications: {
			title: "বিজ্ঞপ্তি",
			systemNotifications: {
				label: "সিস্টেম বিজ্ঞপ্তি",
				description: "গুরুত্বপূর্ণ ইভেন্টের জন্য ডেস্কটপ বিজ্ঞপ্তি দেখান",
			},
			installationAlerts: {
				label: "ইনস্টলেশন সতর্কতা",
				description: "অ্যাপ্লিকেশন ইনস্টলেশন সম্পূর্ণ হলে বিজ্ঞপ্তি পান",
			},
		},
		privacy: {
			title: "গোপনীয়তা",
			errorReporting: {
				label: "ত্রুটি রিপোর্টিং",
				description: "বেনামী ত্রুটি রিপোর্ট পাঠিয়ে ডায়োন উন্নত করতে সাহায্য করুন",
			},
		},
		other: {
			title: "অন্যান্য",
			logsDirectory: {
				label: "লগ ডিরেক্টরি",
				description: "অ্যাপ্লিকেশন লগ কোথায় সংরক্ষিত হয়",
			},
			submitFeedback: {
				label: "প্রতিক্রিয়া জমা দিন",
				description: "আপনি যে কোনো সমস্যা বা সমস্যার সম্মুখীন হন তা রিপোর্ট করুন",
				button: "রিপোর্ট পাঠান",
			},
			showOnboarding: {
				label: "অনবোর্ডিং দেখান",
				description:
					"ডায়োনকে তার প্রাথমিক অবস্থায় রিসেট করুন এবং পুনঃকনফিগারেশনের জন্য অনবোর্ডিং আবার দেখান",
				button: "রিসেট করুন",
			},
		},
	},

	// report form
	report: {
		title: "সমস্যাটি বর্ণনা করুন",
		description:
			"কী ঘটেছে এবং আপনি কী করার চেষ্টা করছিলেন সে সম্পর্কে বিস্তারিত তথ্য দিন।",
		placeholder:
			"উদাহরণ: আমি একটি অ্যাপ্লিকেশন ইনস্টল করার চেষ্টা করছিলাম যখন এই ত্রুটিটি ঘটেছিল...",
		systemInformationTitle: "সিস্টেম তথ্য",
		disclaimer:
			"নিম্নলিখিত সিস্টেম তথ্য এবং একটি বেনামী আইডি আপনার রিপোর্টে অন্তর্ভুক্ত করা হবে।",
		success: "রিপোর্ট সফলভাবে পাঠানো হয়েছে!",
		error: "রিপোর্ট পাঠাতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।",
		send: "রিপোর্ট পাঠান",
		sending: "পাঠানো হচ্ছে...",
		contribute: "আমাদের সম্প্রদায়ে আপনার টুল প্রদর্শন করুন",
	},

	// quick launch component
	quickLaunch: {
		title: "দ্রুত লঞ্চ",
		addApp: "অ্যাপ যোগ করুন",
		selectApp: {
			title: "একটি অ্যাপ নির্বাচন করুন",
			description:
				"{count}টি অ্যাপ উপলব্ধ। আপনি সর্বোচ্চ {max}টি নির্বাচন করতে পারবেন।",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "কিছু নির্ভরতা অনুপস্থিত!",
		installing: "নির্ভরতা ইনস্টল করা হচ্ছে...",
		install: "ইনস্টল করুন",
		logs: {
			initializing: "নির্ভরতা ডাউনলোড শুরু হচ্ছে...",
			loading: "লোড হচ্ছে...",
			connected: "সার্ভারের সাথে সংযুক্ত",
			disconnected: "সার্ভার থেকে সংযোগ বিচ্ছিন্ন",
			error: {
				socket: "সকেট সেটআপ করতে ত্রুটি",
				install: "❌ নির্ভরতা ইনস্টল করতে ত্রুটি: {error}",
			},
			allInstalled: "সমস্ত নির্ভরতা ইতিমধ্যেই ইনস্টল করা হয়েছে।",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstalling: {
			title: "আনইনস্টল করা হচ্ছে",
			deps: "নির্ভরতা আনইনস্টল করা হচ্ছে",
			wait: "অনুগ্রহ করে অপেক্ষা করুন...",
		},
		success: {
			title: "আনইনস্টল করা হয়েছে",
			subtitle: "সফলভাবে",
			closing: "এই মোডালটি বন্ধ করা হচ্ছে",
			seconds: "সেকেন্ড...",
		},
		error: {
			title: "একটি অপ্রত্যাশিত",
			subtitle: "ত্রুটি",
			hasOccurred: "ঘটেছে",
			deps: "ডায়োন কোনো নির্ভরতা সরাতে পারেনি, অনুগ্রহ করে ম্যানুয়ালি করুন।",
			general: "অনুগ্রহ করে পরে আবার চেষ্টা করুন অথবা আরও তথ্যের জন্য লগ পরীক্ষা করুন।",
		},
		loading: {
			title: "লোড হচ্ছে...",
			wait: "অনুগ্রহ করে অপেক্ষা করুন...",
		},
	},

	// logs component
	logs: {
		loading: "লোড হচ্ছে...",
		disclaimer:
			"দেখানো লগগুলি অ্যাপটি থেকেই। যদি আপনি কোনো ত্রুটি দেখেন, অনুগ্রহ করে প্রথমে মূল অ্যাপের ডেভেলপারদের কাছে রিপোর্ট করুন।",
		status: {
			success: "সফল",
			error: "ত্রুটি",
			pending: "মুলতুবি",
		},
	},

	// loading states
	loading: {
		text: "লোড হচ্ছে...",
	},

	// iframe component
	iframe: {
		back: "ফিরে যান",
		openFolder: "ফোল্ডার খুলুন",
		openInBrowser: "ব্রাউজারে খুলুন",
		openNewWindow: "নতুন উইন্ডোতে খুলুন",
		fullscreen: "ফুলস্ক্রিন",
		stop: "বন্ধ করুন",
		reload: "পুনরায় লোড করুন",
		logs: "লগ",
	},

	// actions component
	actions: {
		reconnect: "পুনরায় সংযোগ করুন",
		start: "শুরু করুন",
		uninstall: "আনইনস্টল করুন",
		install: "ইনস্টল করুন",
		publishedBy: "দ্বারা প্রকাশিত",
	},

	// promo component
	promo: {
		title: "এখানে ফিচারড হতে চান?",
		description: "আমাদের সম্প্রদায়ে আপনার টুল প্রদর্শন করুন",
		button: "ফিচারড হন",
	},

	// installed component
	installed: {
		title: "আপনার লাইব্রেরি",
		empty: {
			title: "আপনি কোনো অ্যাপ্লিকেশন ইনস্টল করেননি",
			action: "এখনই একটি ইনস্টল করুন",
		},
	},

	// local component
	local: {
		title: "লোকাল স্ক্রিপ্ট",
		upload: "স্ক্রিপ্ট আপলোড করুন",
		noScripts: "কোনো স্ক্রিপ্ট পাওয়া যায়নি",
		deleting: "স্ক্রিপ্ট মুছে ফেলা হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...",
	},

	// feed component
	feed: {
		noScripts: "কোনো স্ক্রিপ্ট পাওয়া যায়নি",
		errors: {
			notArray: "প্রাপ্ত ডেটা একটি অ্যারে নয়",
			fetchFailed: "স্ক্রিপ্ট আনতে ব্যর্থ হয়েছে",
			notSupported: "দুঃখিত, %s আপনার %s পরিষ্কার হয়েছে।",
			notSupportedTitle: "আপনার ডিভাইসটি সমর্থিত নয়",
		},
	},

	// search component
	search: {
		placeholder: "স্ক্রিপ্ট অনুসন্ধান করুন...",
		filters: {
			audio: "অডিও",
			image: "ছবি",
			video: "ভিডিও",
			chat: "চ্যাট",
		},
	},
} as const;
