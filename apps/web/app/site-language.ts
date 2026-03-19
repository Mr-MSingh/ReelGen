export type SiteLanguage = "en" | "hi";

export const LANGUAGE_COOKIE = "reelgen-language";
export const LANGUAGE_STORAGE_KEY = "reelgen-language";
export const DEFAULT_LANGUAGE: SiteLanguage = "en";

export const LANGUAGE_OPTIONS = [
  {
    code: "en" as const,
    label: "English",
    nativeLabel: "English",
    description: "View ReelGen in English.",
    actionLabel: "Continue in English",
  },
  {
    code: "hi" as const,
    label: "Hindi",
    nativeLabel: "हिन्दी",
    description: "ReelGen को हिन्दी में देखें।",
    actionLabel: "हिन्दी में आगे बढ़ें",
  },
] as const;

export const LANDING_COPY = {
  en: {
    nav: {
      stack: "Stack",
      release: "Release",
      signIn: "Sign in",
      signUp: "Sign up",
      signInIconLabel: "Open sign-in",
    },
    selector: {
      title: "Choose your language",
      subtitle: "Select how you want to experience ReelGen.",
      continueLabel: "Continue",
    },
    chip: "Faceless video operating system",
    headline: {
      first: "Generate, ",
      firstAccent: "render,",
      second: "and schedule ",
      secondAccent: "vertical videos",
      third: "in one workspace.",
    },
    description:
      "ReelGen behaves like a real production pipeline. Series configuration feeds BullMQ jobs, AI stages checkpoint into MongoDB, assets land in S3-compatible storage, FFmpeg renders the final 1080 x 1920 master, and publishing adapters schedule release instead of masking state.",
    buttons: {
      enterApp: "Enter the app",
      viewPricing: "View pricing",
      startBuilding: "Start building",
      openDashboard: "Open dashboard",
    },
    heroMetrics: [
      "Series -> queue -> render",
      "OAuth + scheduling",
      "Credits + audit logs",
    ],
    cockpit: {
      title: "Realtime reel cockpit",
      syncedSuffix: "synced",
      rows: [
        "Topic shaped from series",
        "Storyboard split into scenes",
        "Voice + subtitle alignment",
        "Render spec queued for worker",
      ],
      outputLabel: "Output",
      outputValue: "1080 x 1920",
      publishLabel: "Publish mode",
      publishValue: "Queue aware",
    },
    pipeline: {
      sectionLabel: "Technical fidelity",
      title: "Motion and UX now map directly to product state transitions.",
      description:
        "Each scroll step advances one concrete architecture stage: request intake, queueing, asset persistence, render assembly, and publish orchestration.",
      surfaceTitle: "Pipeline Surface",
      currentEmphasis: "Current emphasis",
      modulePrefix: "Module",
      steps: [
        {
          id: "draft",
          label: "Draft Intake",
          title: "A video request becomes a typed project state.",
          body: "Workspace ownership, series defaults, language settings, and prompt context are persisted before generation starts.",
          stat: "Typed DTO boundary",
        },
        {
          id: "queue",
          label: "Queue Orchestration",
          title: "BullMQ handles retries and idempotent stage checkpoints.",
          body: "The API returns immediately; workers own long-running work and write state transitions after every step.",
          stat: "Idempotent enqueue",
        },
        {
          id: "assets",
          label: "Asset Graph",
          title: "Script, storyboard, voice, subtitles, and media remain addressable.",
          body: "Generated and uploaded files are mapped to metadata entities so scenes can be regenerated without breaking lineage.",
          stat: "S3 + metadata graph",
        },
        {
          id: "render",
          label: "Render Assembly",
          title: "FFmpeg workers build the 1080 x 1920 master and thumbnail.",
          body: "Render specs normalize scene timing, audio mix, subtitle overlays, and output checks before videos move to publish state.",
          stat: "Vertical master",
        },
        {
          id: "publish",
          label: "Release Queue",
          title: "Schedules and publish attempts are first-class records.",
          body: "Connected accounts are validated, attempts are logged, and post URLs flow back to the dashboard for accountability.",
          stat: "Publish-safe retries",
        },
      ],
      modules: [
        "Series schema",
        "Prompt shaping",
        "Scene pacing",
        "Voice synthesis",
        "Subtitle timing",
        "Render timeline",
        "OAuth channels",
        "Credit ledger",
      ],
    },
    release: {
      sectionLabel: "Release choreography",
      title: "Publish orchestration remains visible from schedule to post URL.",
      description:
        "The final section compresses deployment reality into one view: connected channels, retry-safe scheduling, billing/credit controls, and audit-safe publish attempts.",
      boardTitle: "Workspace release board",
      armedSuffix: "armed",
      stats: [
        { label: "Infra", value: "MongoDB + Redis + MinIO" },
        { label: "Billing", value: "Stripe plans + credit ledger" },
        { label: "Compliance", value: "Audit log + token hygiene" },
      ],
      signals: [
        "Connected account validated",
        "Schedule queued with backoff",
        "Publish attempt audited",
        "Remote post URL captured",
      ],
    },
    auth: {
      title: "Sign in to ReelGen",
      signUpTitle: "Create your ReelGen account",
      subtitleEnabled: "Use your email and password, or continue with Google.",
      subtitleDisabled:
        "Use your email and password to continue. Google auth is not configured in this environment yet.",
      signUpSubtitle:
        "Create an account with your name, email, and password. You will be signed in right after signup.",
      nameLabel: "Full name",
      emailLabel: "Email address",
      passwordLabel: "Password",
      confirmPasswordLabel: "Confirm password",
      signInButton: "Sign in",
      signUpButton: "Create account",
      continueWithGoogle: "Continue with Google",
      configureGoogle:
        "Add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` to enable sign-in.",
      noAccountText: "New to ReelGen?",
      noAccountLink: "Create an account",
      haveAccountText: "Already have an account?",
      haveAccountLink: "Sign in",
      invalidCredentials: "Incorrect email or password.",
      accountExists: "An account with this email already exists.",
      googleAccountExists: "This email is already linked to a Google account.",
      passwordMismatch: "Passwords do not match.",
      passwordHint: "Use at least 8 characters.",
      unexpectedError: "Something went wrong. Please try again.",
    },
  },
  hi: {
    nav: {
      stack: "स्टैक",
      release: "रिलीज़",
      signIn: "साइन इन",
      signUp: "खाता बनाएं",
      signInIconLabel: "साइन-इन खोलें",
    },
    selector: {
      title: "अपनी भाषा चुनें",
      subtitle: "चुनें कि आप ReelGen को किस भाषा में देखना चाहते हैं।",
      continueLabel: "आगे बढ़ें",
    },
    chip: "फेसलेस वीडियो निर्माण प्रणाली",
    headline: {
      first: "बनाएं, ",
      firstAccent: "रेंडर करें,",
      second: "और शेड्यूल करें ",
      secondAccent: "वर्टिकल वीडियो",
      third: "एक ही वर्कस्पेस में।",
    },
    description:
      "ReelGen एक वास्तविक प्रोडक्शन पाइपलाइन की तरह काम करता है। सीरीज़ कॉन्फ़िगरेशन BullMQ जॉब्स को चलाती है, एआई चरण MongoDB में चेकपॉइंट लिखते हैं, एसेट S3-संगत स्टोरेज में सुरक्षित रहते हैं, FFmpeg अंतिम 1080 x 1920 मास्टर रेंडर करता है, और पब्लिशिंग एडेप्टर रिलीज़ को छिपाने के बजाय शेड्यूल के रूप में संभालते हैं।",
    buttons: {
      enterApp: "ऐप में जाएँ",
      viewPricing: "मूल्य देखें",
      startBuilding: "बनाना शुरू करें",
      openDashboard: "डैशबोर्ड खोलें",
    },
    heroMetrics: [
      "सीरीज़ -> कतार -> रेंडर",
      "OAuth + शेड्यूलिंग",
      "क्रेडिट + ऑडिट लॉग",
    ],
    cockpit: {
      title: "रियलटाइम रील कंट्रोल डेक",
      syncedSuffix: "सिंक",
      rows: [
        "सीरीज़ से विषय तय हुआ",
        "स्टोरीबोर्ड दृश्यों में बँट गया",
        "वॉइस और सबटाइटल एकसाथ मिले",
        "रेंडर विनिर्देश वर्कर कतार में गया",
      ],
      outputLabel: "आउटपुट",
      outputValue: "1080 x 1920",
      publishLabel: "प्रकाशन मोड",
      publishValue: "कतार-अनुकूल",
    },
    pipeline: {
      sectionLabel: "तकनीकी आधार",
      title: "अब मोशन और यूएक्स सीधे प्रोडक्ट स्टेट ट्रांज़िशन दिखाते हैं।",
      description:
        "स्क्रोल का हर चरण एक वास्तविक आर्किटेक्चर स्टेज को आगे बढ़ाता है: अनुरोध प्राप्त करना, कतार में डालना, एसेट सुरक्षित रखना, रेंडर असेंबली, और पब्लिश ऑर्केस्ट्रेशन।",
      surfaceTitle: "पाइपलाइन दृश्य",
      currentEmphasis: "वर्तमान फोकस",
      modulePrefix: "मॉड्यूल",
      steps: [
        {
          id: "draft",
          label: "प्रारंभिक ड्राफ्ट",
          title: "हर वीडियो अनुरोध एक टाइप्ड प्रोजेक्ट स्टेट बनता है।",
          body: "जनरेशन शुरू होने से पहले वर्कस्पेस स्वामित्व, सीरीज़ डिफ़ॉल्ट, भाषा सेटिंग और प्रॉम्प्ट संदर्भ सुरक्षित किए जाते हैं।",
          stat: "टाइप्ड DTO सीमा",
        },
        {
          id: "queue",
          label: "कतार समन्वय",
          title: "BullMQ रीट्राई और सुरक्षित चेकपॉइंट संभालता है।",
          body: "API तुरंत प्रतिक्रिया देती है; लंबा चलने वाला काम वर्कर संभालते हैं और हर चरण के बाद स्टेट ट्रांज़िशन लिखते हैं।",
          stat: "सुरक्षित एनक्यू",
        },
        {
          id: "assets",
          label: "एसेट ग्राफ",
          title: "स्क्रिप्ट, स्टोरीबोर्ड, वॉइस, सबटाइटल और मीडिया अलग-अलग पहचाने जा सकते हैं।",
          body: "जनरेट और अपलोड की गई फ़ाइलें मेटाडेटा इकाइयों से जुड़ी रहती हैं ताकि किसी दृश्य को दोबारा बनाया जा सके।",
          stat: "S3 + मेटाडेटा ग्राफ",
        },
        {
          id: "render",
          label: "रेंडर असेंबली",
          title: "FFmpeg वर्कर 1080 x 1920 मास्टर और थंबनेल बनाते हैं।",
          body: "रेंडर स्पेक दृश्य समय, ऑडियो मिक्स, सबटाइटल ओवरले और आउटपुट जाँच को अंतिम पब्लिश स्टेट से पहले सामान्य बनाते हैं।",
          stat: "वर्टिकल मास्टर",
        },
        {
          id: "publish",
          label: "रिलीज़ कतार",
          title: "शेड्यूल और पब्लिश प्रयास अलग दर्ज रिकॉर्ड के रूप में रखे जाते हैं।",
          body: "कनेक्टेड खाते सत्यापित होते हैं, प्रयास लॉग में दर्ज होते हैं, और पोस्ट यूआरएल वापस डैशबोर्ड में आते हैं।",
          stat: "सुरक्षित रीट्राई",
        },
      ],
      modules: [
        "सीरीज़ स्कीमा",
        "प्रॉम्प्ट संरचना",
        "दृश्य गति",
        "वॉइस सिंथेसिस",
        "सबटाइटल टाइमिंग",
        "रेंडर टाइमलाइन",
        "OAuth चैनल",
        "क्रेडिट लेजर",
      ],
    },
    release: {
      sectionLabel: "रिलीज़ समन्वय",
      title: "शेड्यूल से पोस्ट यूआरएल तक पब्लिश ऑर्केस्ट्रेशन साफ़ दिखाई देता है।",
      description:
        "अंतिम भाग डिप्लॉयमेंट की वास्तविकता को एक ही दृश्य में दिखाता है: जुड़े हुए चैनल, सुरक्षित रीट्राई वाली शेड्यूलिंग, बिलिंग और क्रेडिट नियंत्रण, और ऑडिट-सुरक्षित पब्लिश प्रयास।",
      boardTitle: "वर्कस्पेस रिलीज़ बोर्ड",
      armedSuffix: "तैयार",
      stats: [
        { label: "इन्फ्रा", value: "MongoDB + Redis + MinIO" },
        { label: "बिलिंग", value: "Stripe प्लान + क्रेडिट लेजर" },
        { label: "अनुपालन", value: "ऑडिट लॉग + टोकन सुरक्षा" },
      ],
      signals: [
        "कनेक्टेड खाता सत्यापित",
        "बैकऑफ के साथ शेड्यूल कतार में गया",
        "पब्लिश प्रयास ऑडिट में दर्ज",
        "रिमोट पोस्ट यूआरएल सुरक्षित किया गया",
      ],
    },
    auth: {
      title: "ReelGen में साइन इन करें",
      signUpTitle: "अपना ReelGen खाता बनाएं",
      subtitleEnabled:
        "आगे बढ़ने के लिए अपना ईमेल और पासवर्ड उपयोग करें, या Google से जारी रखें।",
      subtitleDisabled:
        "आगे बढ़ने के लिए अपना ईमेल और पासवर्ड उपयोग करें। इस वातावरण में अभी Google ऑथ कॉन्फ़िगर नहीं है।",
      signUpSubtitle:
        "अपने नाम, ईमेल और पासवर्ड से खाता बनाएं। साइन-अप के बाद आप सीधे लॉगिन हो जाएंगे।",
      nameLabel: "पूरा नाम",
      emailLabel: "ईमेल पता",
      passwordLabel: "पासवर्ड",
      confirmPasswordLabel: "पासवर्ड दोबारा लिखें",
      signInButton: "साइन इन करें",
      signUpButton: "खाता बनाएं",
      continueWithGoogle: "Google के साथ आगे बढ़ें",
      configureGoogle:
        "साइन-इन सक्षम करने के लिए `GOOGLE_CLIENT_ID` और `GOOGLE_CLIENT_SECRET` जोड़ें।",
      noAccountText: "क्या आप ReelGen पर नए हैं?",
      noAccountLink: "खाता बनाएं",
      haveAccountText: "क्या आपके पास पहले से खाता है?",
      haveAccountLink: "साइन इन करें",
      invalidCredentials: "ईमेल या पासवर्ड सही नहीं है।",
      accountExists: "इस ईमेल से खाता पहले से मौजूद है।",
      googleAccountExists: "यह ईमेल पहले से Google खाते से जुड़ा है।",
      passwordMismatch: "दोनों पासवर्ड एक जैसे नहीं हैं।",
      passwordHint: "कम से कम 8 अक्षर रखें।",
      unexpectedError: "कुछ गलत हुआ। कृपया फिर से प्रयास करें।",
    },
  },
} as const;

export type LandingCopy = (typeof LANDING_COPY)[SiteLanguage];

export function isSiteLanguage(value: string | undefined | null): value is SiteLanguage {
  return value === "en" || value === "hi";
}

export function resolveSiteLanguage(value: string | undefined | null): SiteLanguage {
  return isSiteLanguage(value) ? value : DEFAULT_LANGUAGE;
}
