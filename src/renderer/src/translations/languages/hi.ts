export const hi = {
	// common actions and states
	common: {
		cancel: "रद्द करें",
		loading: "लोड हो रहा है...",
		error: "त्रुटि",
		success: "सफलता",
		pending: "लंबित",
		back: "वापस",
		unselectAll: "सबको अचयनित करो",
		selectAll: "सबको चयनित करो",
	},

	// authentication and access related
	noAccess: {
		title: "Dione श्वेतसूची में शामिल हों",
		description:
			"Dione निर्माणाधीन है और केवल सीमित संख्या में उपयोगकर्ता ही इसे एक्सेस कर सकते हैं, हमारे ऐप के भविष्य के संस्करणों तक पहुंच प्राप्त करने के लिए अभी हमारी श्वेतसूची में शामिल हों।",
		join: "शामिल हों",
		logout: "लॉग आउट करें",
	},

	// first time user experience
	firstTime: {
		welcome: {
			title: "में आपका स्वागत है",
			subtitle:
				"इस यात्रा में जल्दी शामिल होने के लिए धन्यवाद। शुरू करने के लिए अपने खाते में लॉग इन करें।",
			login: "लॉग इन करें",
			copyLink: "लिंक कॉपी करें",
			skipLogin: "लॉग इन करना बिना",
		},
		loggingIn: {
			title: "लॉग इन कर रहा है...",
			authError: "प्रमाणीकरण नहीं हो सका?",
			goBack: "वापस जाएं",
		},
		languageSelector: {
			title: "आपकी भाषा निर्बाचित करें",
		},
		ready: {
			title: "आप तैयार हैं!",
			subtitle: "हमें आपको यहां देखकर खुशी है",
			finish: "समाप्त करें",
		},
		clipboard: {
			success:
				"सफलतापूर्वक क्लिपबोर्ड पर कॉपी किया गया, अब इसे अपने ब्राउज़र में पेस्ट करें!",
		},
	},

	// error handling
	error: {
		title: "अप्रत्याशित त्रुटि हुई",
		description:
			"हमने एप्लिकेशन में एक अप्रत्याशित त्रुटि का पता लगाया है, असुविधा के लिए हमें खेद है।",
		return: "वापसी",
		report: {
			toTeam: "टीम को रिपोर्ट करें",
			sending: "रिपोर्ट भेज रहा है...",
			success: "रिपोर्ट भेजी गई!",
			failed: "रिपोर्ट भेजने में विफल",
		},
	},

	// account related
	account: {
		title: "खाता",
		logout: "लॉग आउट करें",
		stats: {
			timeSpent: {
				title: "बिताया गया समय",
				subtitle: "पिछले 7 दिनों में",
			},
			sessions: {
				title: "सत्र",
				subtitle: "पिछले 7 दिनों में",
			},
			shared: {
				title: "साझा किया गया",
				subtitle: "पिछले 7 दिनों में",
			},
			streak: {
				title: "स्ट्रीक",
				subtitle: "लगातार दिन",
				days: "दिन",
			},
		},
	},

	// toast notifications
	toast: {
		close: "बंद करें",
		install: {
			downloading: "%s डाउनलोड हो रहा है...",
			starting: "%s शुरू हो रहा है...",
			uninstalling: "%s अनइंस्टॉल हो रहा है...",
			reconnecting: "%s फिर से कनेक्ट हो रहा है...",
			retrying: "%s को फिर से इंस्टॉल करने का प्रयास कर रहा है...",
			success: {
				stopped: "%s सफलतापूर्वक बंद कर दिया गया।",
				uninstalled: "%s सफलतापूर्वक अनइंस्टॉल किया गया।",
				logsCopied: "लॉग्स सफलतापूर्वक क्लिपबोर्ड पर कॉपी किए गए।",
				depsInstalled: "निर्भरताएँ सफलतापूर्वक स्थापित हो गईं।",
				shared: "डाउनलोड लिंक क्लिपबोर्ड पर कॉपी किया गया!",
			},
			error: {
				download: "डाउनलोड शुरू करने में त्रुटि: %s",
				start: "%s शुरू करने में त्रुटि: %s",
				stop: "%s रोकने में त्रुटि: %s",
				uninstall: "%s अनइंस्टॉल करने में त्रुटि: %s",
				serverRunning: "सर्वर पहले से चल रहा है।",
				tooManyApps: "धीमा करें! आपके पास पहले से ही 6 ऐप एक ही समय में चल रहे हैं।",
			},
		},
	},

	// titlebar component
	titlebar: {
		closing: {
			title: "एप्लिकेशन बंद हो रहे हैं...",
			description:
				"सभी खुले एप्लिकेशन बंद होने के बाद Dione स्वचालित रूप से बंद हो जाएगा।",
		},
	},

	// sidebar component
	sidebar: {
		tagline: "खोजें, इंस्टॉल करें, नवाचार करें — 1 क्लिक में।",
		activeApps: "सक्रिय ऐप्स",
		update: {
			title: "अपडेट उपलब्ध है",
			description:
				"Dione का एक नया संस्करण उपलब्ध है, कृपया अपडेट करने के लिए ऐप को पुनः प्रारंभ करें।",
			tooltip: "नया अपडेट उपलब्ध है, अपडेट करने के लिए कृपया Dione को पुनरारंभ करें।",
		},
		tooltips: {
			library: "लाइब्रेरी",
			settings: "सेटिंग्स",
			account: "खाता",
			logout: "लॉग आउट करें",
			login: "लॉग इन करें",
		},
	},

	// home page
	home: {
		featured: "विशेष रुप से प्रदर्शित",
		explore: "अन्वेषण करें",
	},

	// settings page
	settings: {
		applications: {
			title: "एप्लिकेशन",
			installationDirectory: {
				label: "इंस्टॉलेशन डायरेक्टरी",
				description: "चुनें कि नए एप्लिकेशन डिफ़ॉल्ट रूप से कहाँ इंस्टॉल किए जाएंगे",
			},
			cleanUninstall: {
				label: "स्वच्छ अनइंस्टॉल",
				description: "एप्लिकेशन को अनइंस्टॉल करते समय सभी संबंधित निर्भरताओं को हटा दें",
			},
			deleteCache: {
				label: "कैशे हटाएं",
				description: "एप्लिकेशन से सभी कैशे डेटा हटाएं",
				button: "कैशे हटाएं",
				deleting: "हटाया जा रहा है...",
				deleted: "हटाया गया",
				error: "त्रुटि",
			},
		},
		interface: {
			title: "इंटरफ़ेस",
			displayLanguage: {
				label: "प्रदर्शन भाषा",
				description: "अपनी पसंदीदा इंटरफ़ेस भाषा चुनें",
			},
			helpTranslate: "🤔 अपनी भाषा नहीं दिख रही? अधिक जोड़ने में हमारी सहायता करें!",
			compactView: {
				label: "कॉम्पैक्ट दृश्य",
				description:
					"स्क्रीन पर अधिक सामग्री फिट करने के लिए अधिक संघनित लेआउट का उपयोग करें",
			},
		},
		notifications: {
			title: "सूचनाएँ",
			systemNotifications: {
				label: "सिस्टम सूचनाएँ",
				description: "महत्वपूर्ण घटनाओं के लिए डेस्कटॉप सूचनाएँ दिखाएँ",
			},
			installationAlerts: {
				label: "इंस्टॉलेशन अलर्ट",
				description: "एप्लिकेशन इंस्टॉलेशन पूरा होने पर सूचित करें",
			},
		},
		privacy: {
			title: "गोपनीयता",
			errorReporting: {
				label: "त्रुटि रिपोर्टिंग",
				description: "अनाम त्रुटि रिपोर्ट भेजकर Dione को बेहतर बनाने में सहायता करें",
			},
		},
		other: {
			title: "अन्य",
			logsDirectory: {
				label: "लॉग्स डायरेक्टरी",
				description: "एप्लिकेशन लॉग्स कहाँ संग्रहीत हैं",
			},
			submitFeedback: {
				label: "प्रतिक्रिया सबमिट करें",
				description: "आपको मिलने वाली किसी भी समस्या की रिपोर्ट करें",
				button: "रिपोर्ट भेजें",
			},
			showOnboarding: {
				label: "ऑनबोर्डिंग दिखाएँ",
				description:
					"Dione को उसकी प्रारंभिक स्थिति में रीसेट करें और पुनर्गठन के लिए ऑनबोर्डिंग को फिर से दिखाएँ",
				button: "रीसेट करें",
			},
		},
	},

	// report form
	report: {
		title: "समस्या का वर्णन करें",
		description: "कृपया बताएं कि क्या हुआ और आप क्या करने की कोशिश कर रहे थे।",
		placeholder:
			"उदाहरण: जब मैं कोई एप्लिकेशन इंस्टॉल करने की कोशिश कर रहा था तब यह त्रुटि हुई...",
		systemInformationTitle: "सिस्टम जानकारी",
		disclaimer:
			"निम्नलिखित सिस्टम जानकारी और एक अनाम आईडी आपकी रिपोर्ट में शामिल की जाएगी।",
		success: "रिपोर्ट सफलतापूर्वक भेजी गई!",
		error: "रिपोर्ट भेजने में विफल। कृपया पुन: प्रयास करें।",
		send: "रिपोर्ट भेजें",
		sending: "भेज रहा है...",
		contribute: "यह स्क्रिप्ट को सभी डिवाइसों से सही बनाने में मदद करें",
	},

	// quick launch component
	quickLaunch: {
		title: "त्वरित लॉन्च",
		addApp: "ऐप जोड़ें",
		selectApp: {
			title: "एक ऐप चुनें",
			description: "{count} ऐप उपलब्ध हैं। आप अधिकतम {max} चुन सकते हैं।",
		},
	},

	// missing dependencies modal
	missingDeps: {
		title: "कुछ निर्भरताएँ गुम हैं!",
		installing: "निर्भरताएँ स्थापित हो रही हैं...",
		install: "इंस्टॉल करें",
		logs: {
			initializing: "निर्भरता डाउनलोड शुरू हो रहा है...",
			loading: "लोड हो रहा है...",
			connected: "सर्वर से जुड़ा हुआ",
			disconnected: "सर्वर से डिस्कनेक्ट हो गया",
			error: {
				socket: "सॉकेट सेट अप करने में त्रुटि",
				install: "❌ निर्भरता स्थापित करने में त्रुटि: {error}",
			},
			allInstalled: "सभी निर्भरताएँ पहले ही स्थापित हो चुकी हैं।",
		},
	},

	// delete loading modal
	deleteLoading: {
		uninstalling: {
			title: "अनइंस्टॉल हो रहा है",
			deps: "निर्भरताएँ अनइंस्टॉल हो रही हैं",
			wait: "कृपया प्रतीक्षा करें...",
		},
		success: {
			title: "अनइंस्टॉल किया गया",
			subtitle: "सफलतापूर्वक",
			closing: "इस मोडल को बंद कर रहा है",
			seconds: "सेकंड...",
		},
		error: {
			title: "एक अप्रत्याशित",
			subtitle: "त्रुटि",
			hasOccurred: "हुई है",
			deps: "Dione किसी भी निर्भरता को हटाने में सक्षम नहीं रहा है, कृपया इसे मैन्युअल रूप से करें।",
			general: "कृपया बाद में पुन: प्रयास करें या अधिक जानकारी के लिए लॉग देखें।",
		},
		loading: {
			title: "लोड हो रहा है...",
			wait: "कृपया प्रतीक्षा करें...",
		},
	},

	// logs component
	logs: {
		loading: "लोड हो रहा है...",
		disclaimer:
			"दिखाए गए लॉग ऐप से ही हैं। यदि आपको कोई त्रुटि दिखाई देती है, तो कृपया पहले इसे मूल ऐप के डेवलपर्स को रिपोर्ट करें।",
		status: {
			success: "सफलता",
			error: "त्रुटि",
			pending: "लंबित",
		},
	},

	// loading states
	loading: {
		text: "लोड हो रहा है...",
	},

	// iframe component
	iframe: {
		back: "वापस",
		openFolder: "फ़ोल्डर खोलें",
		openInBrowser: "ब्राउज़र में खोलें",
		openNewWindow: "नई विंडो में खोलें",
		fullscreen: "फुलस्क्रीन",
		stop: "रोकें",
		reload: "फिर से लोड करें",
		logs: "लॉग्स",
	},

	// actions component
	actions: {
		reconnect: "फिर से कनेक्ट करें",
		start: "प्रारंभ करें",
		uninstall: "अनइंस्टॉल करें",
		install: "इंस्टॉल करें",
		publishedBy: "द्वारा प्रकाशित",
	},

	// promo component
	promo: {
		title: "यहां प्रदर्शित होना चाहते हैं?",
		description: "अपने उपकरण को हमारे समुदाय को दिखाएँ",
		button: "विशेष रुप से प्रदर्शित हों",
	},

	// installed component
	installed: {
		title: "आपकी लाइब्रेरी",
		empty: {
			title: "आपने कोई एप्लिकेशन इंस्टॉल नहीं किया है",
			action: "अभी एक इंस्टॉल करें",
		},
	},

	// local component
	local: {
		title: "स्क्रिप्ट",
		upload: "स्क्रिप्ट अपलोड",
		noScripts: "कोई स्क्रिप्ट नहीं मिली",
		deleting: "स्क्रिप्ट हटा रहे हैं, कृपया प्रतीक्षा करें...",
		uploadModal: {
			title: "स्क्रिप्ट अपलोड",
			selectFile: "फ़ाइल चुनने के लिए क्लिक करें",
			selectedFile: "चयनित फ़ाइल",
			scriptName: "स्क्रिप्ट का नाम",
			scriptDescription: "स्क्रिप्ट का विवरण (वैकल्पिक)",
			uploadFile: "फ़ाइल अपलोड",
			uploading: "अपलोड हो रहा है...",
			errors: {
				uploadFailed: "स्क्रिप्ट अपलोड करने में विफल। कृपया पुनः प्रयास करें।",
				uploadError: "स्क्रिप्ट अपलोड करते समय त्रुटि हुई।",
			},
		},
	},

	// feed component
	feed: {
		noScripts: "कोई स्क्रिप्ट नहीं मिली",
		errors: {
			notArray: "प्राप्त डेटा एक सरणी नहीं है",
			fetchFailed: "स्क्रिप्ट प्राप्त करने में विफल",
			notSupported: "दुखित, %s %s पर नहीं समर्थित।",
			notSupportedTitle: "आपका डिवाइस समर्थित नहीं है",
		},
	},

	// search component
	search: {
		placeholder: "स्क्रिप्ट खोजें...",
		filters: {
			audio: "ऑडियो",
			image: "छवि",
			video: "वीडियो",
			chat: "चैट",
		},
	},
} as const;
