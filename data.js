/* =====================================================================
   SITE CONFIG + SERVICES DATA (English / Arabic)
   Edit this file to change your name, contacts, services and documents.
   ===================================================================== */

window.SITE = {
  brand: "Al Marjaa",
  brandAr: "المرجع",
  phone: "+961 76 138 537",
  whatsapp: "96176138537",             // digits only, with country code
  email: "oliviadiaasayah@gmail.com",
  address: "Baabda, Mount Lebanon",
  addressAr: "بعبدا، جبل لبنان",
  hours: "Mon–Fri 8:30–17:00 · Sat 9:00–13:00",
  hoursAr: "الاثنين–الجمعة 8:30–17:00 · السبت 9:00–13:00",

  /* Google backend — accounts, uploads, tracking (see README).
     Paste the Apps Script web-app URL (ends in /exec). Until it is set, the form
     falls back to emailing inquiries. */
  googleScriptUrl: "https://script.google.com/macros/s/AKfycbxByx78mUwoBaOk8TzyXGbxFTDyauhRFBPU4bu7WmjocWKvdbyq0kBK_BRQKQtw8Ojp/exec",

  maxUploadMB: 25                      // total size of all attachments per inquiry
};

/* Each service:
   id, title, ar, color, icon, blurb, blurbAr,
   subs: [{ name, ar, docs: [ ["English", "العربية"], ... ] }]
   Document lists are a general guide — requirements change, always confirm. */

window.SERVICES = [
  {
    id: "commercial",
    title: "Commercial Register",
    ar: "السجل التجاري",
    color: "#2ee6a8",
    icon: "register",
    category: "business",
    goal: "Start or register a business",
    goalAr: "تأسيس أو تسجيل عمل تجاري",
    authority: "Commercial Register — Ministry of Justice (regional registries)",
    authorityAr: "السجل التجاري — وزارة العدل (أمانات السجل في المناطق)",
    overview: "Every trader and company doing business in Lebanon must be registered with the Commercial Register, kept by the registries of the courts under the Ministry of Justice. We prepare your file, arrange signatures and notarisation where needed, submit it and follow it up until your registration certificate is issued.",
    overviewAr: "يجب على كل تاجر وشركة تعمل في لبنان التسجيل في السجل التجاري لدى أمانات السجل في المحاكم التابعة لوزارة العدل. نحضّر ملفك، ونرتّب التواقيع والتصديق عند الحاجة، ونقدّمه ونتابعه حتى صدور إفادة التسجيل.",
    blurb: "Register a trader, an establishment or a company (SARL, SAL, Holding, Offshore) and handle amendments.",
    blurbAr: "تسجيل تاجر أو مؤسسة أو شركة (ش.م.م، ش.م.ل، هولدنغ، أوفشور) وإجراء التعديلات.",
    subs: [
      {
        name: "Trader registration",
        ar: "تسجيل تاجر",
        docs: [
          ["Lebanese ID card or individual civil extract (less than 3 months old)", "بطاقة هوية لبنانية أو إخراج قيد فردي لا يتجاوز تاريخه 3 أشهر"],
          ["Recent judicial record", "سجل عدلي حديث"],
          ["Lease contract registered at the municipality, or title deed of the premises", "عقد إيجار مسجّل في البلدية أو سند ملكية المحل"],
          ["Signed registration request (Commercial Register form)", "طلب تسجيل موقّع (نموذج السجل التجاري)"],
          ["Signature specimen", "نموذج عن التوقيع"],
          ["Financial (tax) number certificate, if already issued", "إفادة الرقم المالي إن وُجدت"],
          ["2 passport-size photos", "صورتان شمسيتان"]
        ]
      },
      {
        name: "Establishment registration",
        ar: "تسجيل مؤسسة",
        docs: [
          ["Owner's ID card or individual civil extract (< 3 months)", "بطاقة هوية المالك أو إخراج قيد فردي (أقل من 3 أشهر)"],
          ["Owner's judicial record", "السجل العدلي للمالك"],
          ["Domiciliation document: registered lease, title deed or occupancy permit", "مستند المركز: عقد إيجار مسجّل أو سند ملكية أو إفادة إشغال"],
          ["Proposed trade name + description of the activity", "الاسم التجاري المقترح ووصف النشاط"],
          ["Signed registration request", "طلب تسجيل موقّع"],
          ["Financial (tax) number certificate, if available", "إفادة الرقم المالي إن وُجدت"],
          ["Any sector licence the activity requires (e.g. Health, Tourism)", "أي ترخيص قطاعي يتطلبه النشاط (مثل الصحة أو السياحة)"]
        ]
      },
      {
        name: "Company registration (SARL / SAL / Holding / Offshore)",
        ar: "تسجيل شركة (ش.م.م / ش.م.ل / هولدنغ / أوفشور)",
        docs: [
          ["Articles of association, signed and notarised", "النظام الأساسي موقّعاً ومصدّقاً لدى الكاتب العدل"],
          ["Bank certificate confirming deposit of the share capital", "إفادة مصرفية بإيداع رأس المال"],
          ["IDs or passports of all partners / shareholders", "هويات أو جوازات سفر جميع الشركاء / المساهمين"],
          ["IDs and judicial records of managers / board members", "هويات وسجلات عدلية للمدراء / أعضاء مجلس الإدارة"],
          ["Domiciliation documents: title deed, lease or occupancy permit", "مستندات المركز: سند ملكية أو عقد إيجار أو إفادة إشغال"],
          ["Registration request (Commercial Register form)", "طلب تسجيل (نموذج السجل التجاري)"],
          ["Commercial circular with authorised signatories", "التعميم التجاري مع نماذج تواقيع المفوّضين بالتوقيع"],
          ["SAL / Holding / Offshore: subscription deed + minutes of the first board meeting", "للـ ش.م.ل / هولدنغ / أوفشور: صك الاكتتاب ومحضر أول اجتماع لمجلس الإدارة"],
          ["Foreign shareholders: documents legalised and translated into Arabic", "للمساهمين الأجانب: مستندات مصدّقة ومترجمة إلى العربية"]
        ]
      },
      {
        name: "Amendments & certificates",
        ar: "تعديلات وإفادات",
        docs: [
          ["Commercial Register number of the trader / company", "رقم السجل التجاري للتاجر / الشركة"],
          ["Board or partners' resolution describing the change", "قرار مجلس الإدارة أو الشركاء بالتعديل"],
          ["ID of the authorised signatory", "هوية المفوّض بالتوقيع"],
          ["Supporting documents (new lease, share transfer deed, etc.)", "المستندات الداعمة (عقد إيجار جديد، عقد تفرّغ عن حصص، إلخ)"]
        ]
      }
    ]
  },
  {
    id: "nssf",
    title: "Social Security (NSSF)",
    ar: "الضمان الاجتماعي",
    color: "#5aa9ff",
    icon: "shield",
    category: "business",
    goal: "Register employees with social security",
    goalAr: "تسجيل الموظفين في الضمان الاجتماعي",
    authority: "National Social Security Fund (NSSF)",
    authorityAr: "الصندوق الوطني للضمان الاجتماعي",
    overview: "Employers in Lebanon register with the National Social Security Fund and enrol their employees. We handle employer registration, new employees, clearance certificates and end-of-service files, so your company stays in order.",
    overviewAr: "يسجّل أصحاب العمل في لبنان لدى الصندوق الوطني للضمان الاجتماعي ويسجّلون أجراءهم. نتولّى تسجيل صاحب العمل، والأجراء الجدد، وبراءات الذمة، وملفات نهاية الخدمة، لتبقى مؤسستك نظامية.",
    blurb: "Employer and employee registration, declarations, clearance certificates and end-of-service files.",
    blurbAr: "تسجيل أصحاب العمل والأجراء، التصاريح، براءات الذمة وملفات نهاية الخدمة.",
    subs: [
      {
        name: "Employer registration",
        ar: "تسجيل صاحب عمل",
        docs: [
          ["Commercial Register certificate", "إفادة تسجيل في السجل التجاري"],
          ["Financial (tax) number certificate", "إفادة الرقم المالي"],
          ["ID of the owner / authorised signatory", "هوية المالك / المفوّض بالتوقيع"],
          ["Lease contract or title deed of the workplace", "عقد إيجار أو سند ملكية مكان العمل"],
          ["List of employees with start dates and salaries", "لائحة بالأجراء مع تواريخ المباشرة والرواتب"],
          ["Signed NSSF employer registration form", "استمارة تسجيل صاحب عمل موقّعة"]
        ]
      },
      {
        name: "Employee enrolment",
        ar: "تسجيل أجير",
        docs: [
          ["Employee's individual civil extract (< 3 months)", "إخراج قيد فردي للأجير (أقل من 3 أشهر)"],
          ["Copy of the employee's ID card", "صورة عن بطاقة هوية الأجير"],
          ["Family civil extract — to add spouse / children", "إخراج قيد عائلي لإضافة الزوج/ة والأولاد"],
          ["Employment start declaration signed by the employer", "تصريح مباشرة عمل موقّع من صاحب العمل"],
          ["2 passport-size photos", "صورتان شمسيتان"],
          ["Foreign employees: valid work permit and residence permit", "للأجراء الأجانب: إجازة عمل وإقامة ساريتا المفعول"]
        ]
      },
      {
        name: "Clearance certificate",
        ar: "براءة ذمة",
        docs: [
          ["Employer NSSF number", "رقم صاحب العمل في الضمان"],
          ["Latest salary declarations", "آخر تصاريح الرواتب"],
          ["Proof of payment of contributions", "إثبات دفع الاشتراكات"],
          ["ID of the authorised signatory", "هوية المفوّض بالتوقيع"]
        ]
      },
      {
        name: "End-of-service indemnity",
        ar: "تعويض نهاية الخدمة",
        docs: [
          ["NSSF card / number", "بطاقة / رقم الضمان"],
          ["ID card or individual civil extract", "بطاقة الهوية أو إخراج قيد فردي"],
          ["Resignation or termination letter", "كتاب الاستقالة أو الصرف"],
          ["Employer's leaving declaration", "تصريح ترك العمل من صاحب العمل"],
          ["Bank account details (IBAN)", "معلومات الحساب المصرفي (IBAN)"]
        ]
      }
    ]
  },
  {
    id: "realestate",
    title: "Real Estate Registration",
    ar: "تسجيل العقارات",
    color: "#f5c46b",
    icon: "building",
    category: "property",
    goal: "Buy, sell or inherit a property",
    goalAr: "شراء أو بيع أو إرث عقار",
    authority: "General Directorate of Land Registry and Cadastre — Ministry of Finance",
    authorityAr: "المديرية العامة للشؤون العقارية — وزارة المالية",
    overview: "A property transaction only takes full effect once it is registered at the competent land registry office. We prepare and follow up sales and transfers, inheritance transfers, real-estate certificates and mortgage files.",
    overviewAr: "لا تكتمل المعاملة العقارية إلا بتسجيلها في أمانة السجل العقاري المختصة. نحضّر ونتابع معاملات البيع ونقل الملكية، وانتقال الإرث، والإفادات العقارية، وملفات الرهن.",
    blurb: "Property sales, transfers, inheritance, mortgages and land-registry certificates.",
    blurbAr: "بيع ونقل ملكية، انتقال إرث، رهون وإفادات من الدوائر العقارية.",
    subs: [
      {
        name: "Sale / transfer of ownership",
        ar: "بيع ونقل ملكية",
        docs: [
          ["Title deed or recent real-estate certificate", "سند التمليك أو إفادة عقارية حديثة"],
          ["IDs or individual civil extracts of seller and buyer", "هويات أو إخراجات قيد البائع والشاري"],
          ["Sale contract notarised by a notary public", "عقد بيع منظّم لدى الكاتب العدل"],
          ["Cadastral / survey map of the plot", "خريطة مساحة للعقار"],
          ["Municipality clearance", "براءة ذمة من البلدية"],
          ["Built-property tax clearance (Ministry of Finance)", "براءة ذمة من ضريبة الأملاك المبنية (وزارة المالية)"],
          ["Power of attorney, if a party is represented", "وكالة إذا كان أحد الأطراف ممثَّلاً"],
          ["Foreign buyers: proof of eligibility / required approvals", "للشارين الأجانب: إثبات الأهلية / الموافقات المطلوبة"]
        ]
      },
      {
        name: "Inheritance transfer",
        ar: "انتقال إرث",
        docs: [
          ["Death certificate", "وثيقة وفاة"],
          ["Inheritance decree from the competent court", "حصر إرث من المحكمة المختصة"],
          ["Inheritance tax clearance (Ministry of Finance)", "براءة ذمة من ضريبة الانتقال (وزارة المالية)"],
          ["IDs / civil extracts of all heirs", "هويات / إخراجات قيد جميع الورثة"],
          ["Real-estate certificates of the properties", "إفادات عقارية للعقارات"]
        ]
      },
      {
        name: "Real-estate certificate / search",
        ar: "إفادة عقارية",
        docs: [
          ["Property number and cadastral area", "رقم العقار والمنطقة العقارية"],
          ["ID of the requester", "هوية مقدّم الطلب"],
          ["Power of attorney if requested for someone else", "وكالة إذا كان الطلب لشخص آخر"]
        ]
      },
      {
        name: "Mortgage registration / release",
        ar: "تسجيل أو فك رهن",
        docs: [
          ["Real-estate certificate", "إفادة عقارية"],
          ["Mortgage contract or bank release letter", "عقد الرهن أو كتاب فك الرهن من المصرف"],
          ["IDs of the owner and creditor representative", "هويات المالك وممثل الدائن"]
        ]
      }
    ]
  },
  {
    id: "vehicles",
    title: "Vehicle Registration",
    ar: "تسجيل السيارات",
    color: "#ff7a59",
    icon: "car",
    category: "property",
    goal: "Transfer, register or renew a car",
    goalAr: "نقل ملكية سيارة أو تسجيلها أو تجديدها",
    authority: "Traffic, Vehicles and Mechanics Management Authority (Nafaa)",
    authorityAr: "هيئة إدارة السير والآليات والمركبات (النافعة)",
    overview: "Car ownership transfers, first registrations, annual mechanic fees and plates are handled by the Traffic Management Organisation, known as the Nafaa. We prepare the papers, book the steps and follow up for you.",
    overviewAr: "تتولّى هيئة إدارة السير (النافعة) معاملات نقل ملكية السيارات، والتسجيل الأول، ورسوم الميكانيك السنوية، واللوحات. نحضّر الأوراق، ونحجز المواعيد، ونتابع عنك.",
    blurb: "Ownership transfers, new car registration, mechanic fees and plates at the Traffic Management Organisation (Nafaa).",
    blurbAr: "نقل ملكية، تسجيل سيارات جديدة، رسوم الميكانيك واللوحات لدى هيئة إدارة السير (النافعة).",
    subs: [
      {
        name: "Ownership transfer (used car)",
        ar: "نقل ملكية",
        docs: [
          ["Vehicle registration booklet", "رخصة السير (دفتر السيارة)"],
          ["Certified copy of ID or individual civil extract — seller", "صورة مصدّقة عن هوية أو إخراج قيد البائع"],
          ["Certified copy of ID or individual civil extract — buyer", "صورة مصدّقة عن هوية أو إخراج قيد الشاري"],
          ["Compulsory insurance (bodily injury) in the buyer's name", "تأمين إلزامي (أضرار جسدية) باسم الشاري"],
          ["Mechanical inspection report", "تقرير المعاينة الميكانيكية"],
          ["Power of attorney if a party cannot attend", "وكالة إذا تعذّر حضور أحد الأطراف"],
          ["Company-owned: Commercial Register certificate + signatory authorisation", "سيارة باسم شركة: إفادة سجل تجاري وتفويض بالتوقيع"]
        ]
      },
      {
        name: "New vehicle — first registration",
        ar: "تسجيل سيارة جديدة",
        docs: [
          ["Dealer invoice, or customs declaration for imported vehicles", "فاتورة الوكيل أو البيان الجمركي للسيارات المستوردة"],
          ["Certificate of origin / manufacturer documents", "شهادة المنشأ / مستندات الصانع"],
          ["Owner's ID or individual civil extract", "هوية المالك أو إخراج قيد فردي"],
          ["Compulsory insurance contract", "عقد التأمين الإلزامي"],
          ["Technical inspection certificate", "شهادة الكشف الفني"]
        ]
      },
      {
        name: "Mechanic fees (annual)",
        ar: "رسوم الميكانيك",
        docs: [
          ["Vehicle booklet (both sides)", "دفتر السيارة (الوجهان)"],
          ["Original compulsory insurance contract", "عقد التأمين الإلزامي الأصلي"],
          ["Compulsory insurance receipt", "إيصال التأمين الإلزامي"],
          ["Mechanical inspection certificate (when due)", "إفادة المعاينة الميكانيكية (عند استحقاقها)"]
        ]
      },
      {
        name: "Plates replacement / lost booklet",
        ar: "لوحات / بدل ضائع",
        docs: [
          ["Vehicle booklet (or police report if lost)", "دفتر السيارة (أو محضر من الدرك في حال الضياع)"],
          ["Valid ID, passport or individual civil extract (< 3 months)", "هوية أو جواز سفر أو إخراج قيد فردي (أقل من 3 أشهر)"]
        ]
      }
    ]
  },
  {
    id: "mofa",
    title: "Ministry of Foreign Affairs",
    ar: "وزارة الخارجية",
    color: "#b78bff",
    icon: "globe",
    category: "abroad",
    goal: "Use a document abroad",
    goalAr: "استعمال مستند في الخارج",
    authority: "Ministry of Foreign Affairs and Emigrants",
    authorityAr: "وزارة الخارجية والمغتربين",
    overview: "Lebanese documents used abroad usually go through a chain: the issuing authority, then the Ministry of Foreign Affairs, then the embassy of the destination country. Foreign documents follow the reverse path to be used in Lebanon. We manage each step and the sworn translations.",
    overviewAr: "تمرّ المستندات اللبنانية المعدّة للاستعمال في الخارج عادةً بسلسلة: الجهة المُصدِرة، ثم وزارة الخارجية، ثم سفارة البلد المعني. وتسلك المستندات الأجنبية المسار المعاكس لاستعمالها في لبنان. نتولّى كل خطوة والترجمات المحلّفة.",
    blurb: "Legalisation of Lebanese documents for use abroad, and foreign documents for use in Lebanon.",
    blurbAr: "تصديق المستندات اللبنانية لاستعمالها في الخارج والمستندات الأجنبية لاستعمالها في لبنان.",
    subs: [
      {
        name: "Legalise a Lebanese document for abroad",
        ar: "تصديق مستند للخارج",
        docs: [
          ["Original document, first stamped by the issuing Lebanese authority", "المستند الأصلي مصدّقاً أولاً من الجهة اللبنانية المُصدِرة"],
          ["Sworn translation, if the destination requires one", "ترجمة محلّفة إذا طلبتها الجهة المعنية"],
          ["Copy of your ID or passport", "صورة عن الهوية أو جواز السفر"],
          ["Power of attorney if we submit on your behalf", "وكالة إذا قدّمنا الطلب عنك"]
        ]
      },
      {
        name: "Legalise a sworn translation",
        ar: "تصديق ترجمة محلّفة",
        docs: [
          ["Original document", "المستند الأصلي"],
          ["Translation by a sworn translator", "ترجمة من مترجم محلّف"],
          ["Translator's signature certified by a notary, then the Ministry of Justice", "تصديق توقيع المترجم لدى الكاتب العدل ثم وزارة العدل"]
        ]
      },
      {
        name: "Foreign document for use in Lebanon",
        ar: "مستند أجنبي لاستعماله في لبنان",
        docs: [
          ["Original document legalised in its country of issue", "المستند الأصلي مصدّقاً في بلد الإصدار"],
          ["Legalisation by the Lebanese embassy / consulate there", "تصديق السفارة / القنصلية اللبنانية في ذلك البلد"],
          ["Arabic translation by a sworn translator, if required", "ترجمة محلّفة إلى العربية عند الحاجة"]
        ]
      }
    ]
  },
  {
    id: "insurance",
    title: "Insurance",
    ar: "التأمين",
    color: "#ff5c8a",
    icon: "umbrella",
    category: "personal",
    goal: "Insure my car, health or business",
    goalAr: "تأمين سيارتي أو صحتي أو عملي",
    authority: "Licensed insurance companies",
    authorityAr: "شركات التأمين المرخّصة",
    overview: "Compulsory insurance for bodily injury to third parties is required for every car on Lebanese roads. Beyond that, we help you arrange all-risk car cover, health, travel and business insurance with licensed insurers.",
    overviewAr: "التأمين الإلزامي ضد الأضرار الجسدية للغير مطلوب لكل سيارة تسير على الطرقات اللبنانية. وإلى جانبه، نساعدك في ترتيب التأمين الشامل للسيارة، والتأمين الصحي، وتأمين السفر والمؤسسات لدى شركات مرخّصة.",
    blurb: "Compulsory and all-risk car insurance, health, travel, life, property and workers' compensation.",
    blurbAr: "تأمين السيارات الإلزامي والشامل، الصحي، السفر، الحياة، الممتلكات وطوارئ العمل.",
    subs: [
      {
        name: "Car — compulsory / third party / all risk",
        ar: "تأمين سيارة — إلزامي / ضد الغير / شامل",
        docs: [
          ["Vehicle registration booklet", "دفتر السيارة"],
          ["Driver's licence", "رخصة القيادة"],
          ["Owner's ID", "هوية المالك"],
          ["Photos of the vehicle (all-risk only)", "صور السيارة (للتأمين الشامل فقط)"]
        ]
      },
      {
        name: "Health / medical",
        ar: "تأمين صحي",
        docs: [
          ["ID or passport of each insured person", "هوية أو جواز سفر كل شخص مؤمَّن"],
          ["Signed medical questionnaire", "استمارة طبية موقّعة"],
          ["NSSF number, if covered (complementary plans)", "رقم الضمان إن وُجد (للخطط المكمّلة)"]
        ]
      },
      {
        name: "Travel",
        ar: "تأمين سفر",
        docs: [
          ["Passport copy", "صورة جواز السفر"],
          ["Travel dates and destination", "تواريخ السفر والوجهة"],
          ["Visa requirement letter, if applicable", "كتاب متطلبات التأشيرة عند الحاجة"]
        ]
      },
      {
        name: "Business — fire, property, workers' compensation",
        ar: "تأمين مؤسسات — حريق، ممتلكات، طوارئ عمل",
        docs: [
          ["Commercial Register certificate", "إفادة سجل تجاري"],
          ["List of insured assets and values", "لائحة بالموجودات المؤمّنة وقيمها"],
          ["Number of employees and payroll", "عدد الأجراء والرواتب"],
          ["Photos / address of the premises", "صور وعنوان المؤسسة"]
        ]
      }
    ]
  },

  /* ---------- Additional services ---------- */
  {
    id: "tax",
    title: "Ministry of Finance & VAT",
    ar: "وزارة المالية والضريبة على القيمة المضافة",
    color: "#43d9e8",
    icon: "calc",
    category: "business",
    goal: "Get a tax number or register for VAT",
    goalAr: "الحصول على رقم مالي أو التسجيل في الـ TVA",
    authority: "Ministry of Finance",
    authorityAr: "وزارة المالية",
    overview: "Most businesses need a financial (tax) number, and some must register for VAT. We prepare the registrations, the periodic declarations and the tax clearance certificates other offices often ask for.",
    overviewAr: "تحتاج معظم المؤسسات إلى رقم مالي، ويتوجّب على بعضها التسجيل في الضريبة على القيمة المضافة. نحضّر طلبات التسجيل والتصاريح الدورية وبراءات الذمة الضريبية التي تطلبها دوائر أخرى غالباً.",
    blurb: "Financial number, VAT registration, tax declarations and tax clearance certificates.",
    blurbAr: "رقم مالي، تسجيل في الضريبة على القيمة المضافة، تصاريح ضريبية وبراءات ذمة.",
    subs: [
      {
        name: "Financial (tax) number",
        ar: "رقم مالي",
        docs: [
          ["ID or individual civil extract", "هوية أو إخراج قيد فردي"],
          ["Commercial Register certificate (if registered)", "إفادة سجل تجاري (إن وُجدت)"],
          ["Lease contract of the business address", "عقد إيجار مكان العمل"],
          ["Signed registration form", "استمارة تسجيل موقّعة"]
        ]
      },
      {
        name: "VAT registration",
        ar: "تسجيل في الـ TVA",
        docs: [
          ["Financial number certificate", "إفادة الرقم المالي"],
          ["Commercial Register certificate", "إفادة سجل تجاري"],
          ["Turnover / sales records", "سجلات رقم الأعمال / المبيعات"],
          ["ID of the authorised signatory", "هوية المفوّض بالتوقيع"]
        ]
      },
      {
        name: "Declarations & tax clearance",
        ar: "تصاريح وبراءة ذمة",
        docs: [
          ["Financial number", "الرقم المالي"],
          ["Financial statements / income records for the period", "البيانات المالية / سجلات المداخيل للفترة"],
          ["Payroll records (salary tax)", "سجلات الرواتب (ضريبة الرواتب والأجور)"]
        ]
      }
    ]
  },
  {
    id: "work",
    title: "Work Permits & Residency",
    ar: "إجازات العمل والإقامات",
    color: "#9be15d",
    icon: "badge",
    category: "business",
    goal: "Hire a foreign employee",
    goalAr: "توظيف عامل أجنبي",
    authority: "Ministry of Labour & General Security",
    authorityAr: "وزارة العمل والمديرية العامة للأمن العام",
    overview: "Hiring a foreign employee involves a work permit from the Ministry of Labour and a residence permit from General Security. We prepare both files, including domestic worker files, and keep track of renewals.",
    overviewAr: "يتطلّب توظيف عامل أجنبي إجازة عمل من وزارة العمل وإقامة من الأمن العام. نحضّر الملفين، بما فيها ملفات العاملين في الخدمة المنزلية، ونتابع مواعيد التجديد.",
    blurb: "Ministry of Labour work permits and General Security residency for employees and domestic workers.",
    blurbAr: "إجازات عمل من وزارة العمل وإقامات من الأمن العام للموظفين والعاملين في الخدمة المنزلية.",
    subs: [
      {
        name: "Work permit (company employee)",
        ar: "إجازة عمل",
        docs: [
          ["Company Commercial Register certificate", "إفادة سجل تجاري للشركة"],
          ["Signed employment contract", "عقد عمل موقّع"],
          ["Valid passport copy", "صورة جواز سفر ساري"],
          ["CV and certified qualifications", "سيرة ذاتية وشهادات مصدّقة"],
          ["Police clearance", "شهادة حسن سلوك / سجل عدلي"],
          ["Medical certificate", "شهادة طبية"],
          ["Passport-size photos", "صور شمسية"]
        ]
      },
      {
        name: "Residence permit",
        ar: "إقامة",
        docs: [
          ["Approved work permit", "إجازة عمل موافَق عليها"],
          ["Valid passport", "جواز سفر ساري"],
          ["Employment contract", "عقد العمل"],
          ["Medical certificate", "شهادة طبية"],
          ["Proof of accommodation", "إثبات سكن"]
        ]
      },
      {
        name: "Domestic worker file",
        ar: "معاملة عاملة في الخدمة المنزلية",
        docs: [
          ["Employer's ID", "هوية صاحب العمل"],
          ["Worker's passport copy", "صورة جواز سفر العاملة"],
          ["Insurance policy for the worker", "بوليصة تأمين للعاملة"],
          ["Signed standard contract", "العقد الموحّد موقّعاً"]
        ]
      }
    ]
  },
  {
    id: "civil",
    title: "Civil Status",
    ar: "الأحوال الشخصية",
    color: "#ffd166",
    icon: "family",
    category: "personal",
    goal: "Family records & civil extracts",
    goalAr: "قيود العائلة وإخراجات القيد",
    authority: "Directorate General of Personal Status — Ministry of Interior",
    authorityAr: "المديرية العامة للأحوال الشخصية — وزارة الداخلية",
    overview: "Civil extracts are asked for in almost every transaction. We obtain individual and family extracts and register marriages and births, including events that took place abroad.",
    overviewAr: "تُطلب إخراجات القيد في معظم المعاملات تقريباً. نستخرج إخراجات القيد الفردية والعائلية، ونسجّل الزيجات والولادات، بما فيها الحاصلة في الخارج.",
    blurb: "Civil extracts, birth and marriage registration, ID cards and passports.",
    blurbAr: "إخراجات قيد، تسجيل ولادات وزيجات، بطاقات هوية وجوازات سفر.",
    subs: [
      {
        name: "Individual / family civil extract",
        ar: "إخراج قيد فردي / عائلي",
        docs: [
          ["Full name, father's name, register number and place", "الاسم الكامل، اسم الأب، رقم السجل ومحلّه"],
          ["Copy of ID (if available)", "صورة عن الهوية (إن وُجدت)"]
        ]
      },
      {
        name: "Marriage registration",
        ar: "تسجيل زواج",
        docs: [
          ["Marriage contract from the religious or civil authority", "عقد الزواج من المرجع الديني أو المدني"],
          ["Individual civil extracts of both spouses", "إخراجات قيد فردية للزوجين"],
          ["Foreign marriage: contract legalised by the embassy and MoFA", "زواج في الخارج: عقد مصدّق من السفارة ووزارة الخارجية"]
        ]
      },
      {
        name: "Birth registration",
        ar: "تسجيل ولادة",
        docs: [
          ["Birth certificate from the hospital / doctor", "وثيقة ولادة من المستشفى / الطبيب"],
          ["Family civil extract of the parents", "إخراج قيد عائلي للوالدين"],
          ["Mukhtar certificate", "إفادة مختار"]
        ]
      }
    ]
  },
  {
    id: "trademark",
    title: "Trademark Registration",
    ar: "تسجيل العلامات التجارية",
    color: "#ff9f43",
    icon: "spark",
    category: "business",
    goal: "Protect my brand",
    goalAr: "حماية علامتي التجارية",
    authority: "Intellectual Property Protection Office — Ministry of Economy and Trade",
    authorityAr: "مصلحة حماية الملكية الفكرية — وزارة الاقتصاد والتجارة",
    overview: "Registering your name and logo protects them in Lebanon. We prepare new trademark applications, renewals and transfers of ownership.",
    overviewAr: "يحمي تسجيل اسمك وشعارك حقوقك في لبنان. نحضّر طلبات تسجيل العلامات الجديدة وتجديدها ونقل ملكيتها.",
    blurb: "Protect your brand name and logo at the Ministry of Economy's Intellectual Property Office.",
    blurbAr: "حماية اسمك التجاري وشعارك لدى مصلحة حماية الملكية الفكرية في وزارة الاقتصاد.",
    subs: [
      {
        name: "New trademark",
        ar: "علامة جديدة",
        docs: [
          ["Logo / mark in high resolution", "الشعار / العلامة بدقة عالية"],
          ["Owner's ID or company Commercial Register certificate", "هوية المالك أو إفادة السجل التجاري للشركة"],
          ["List of goods / services (classes)", "لائحة السلع / الخدمات (الفئات)"],
          ["Notarised power of attorney", "وكالة مصدّقة لدى الكاتب العدل"]
        ]
      },
      {
        name: "Renewal / transfer",
        ar: "تجديد / نقل ملكية",
        docs: [
          ["Existing registration certificate", "شهادة التسجيل الحالية"],
          ["Owner's ID or company documents", "هوية المالك أو مستندات الشركة"],
          ["Assignment deed (for transfers)", "عقد التنازل (لنقل الملكية)"]
        ]
      }
    ]
  },
  {
    id: "municipal",
    title: "Municipal Permits",
    ar: "معاملات البلدية",
    color: "#7ce0c3",
    icon: "permit",
    category: "property",
    goal: "Lease or building permit",
    goalAr: "عقد إيجار أو رخصة بناء",
    authority: "Your local municipality",
    authorityAr: "البلدية المختصة",
    overview: "Many transactions start at the municipality: registering a lease, or obtaining building and occupancy permits. We prepare and follow up these files with the municipality concerned.",
    overviewAr: "تبدأ معاملات كثيرة من البلدية: تسجيل عقد إيجار، أو الاستحصال على رخص البناء والإسكان. نحضّر هذه الملفات ونتابعها مع البلدية المعنية.",
    blurb: "Lease registration, signboard permits, occupancy and building permits.",
    blurbAr: "تسجيل عقود الإيجار، رخص اللافتات، رخص البناء والإسكان.",
    subs: [
      {
        name: "Lease registration",
        ar: "تسجيل عقد إيجار",
        docs: [
          ["Signed lease contract", "عقد الإيجار موقّعاً"],
          ["IDs of landlord and tenant", "هويات المؤجر والمستأجر"],
          ["Real-estate certificate or title deed", "إفادة عقارية أو سند ملكية"]
        ]
      },
      {
        name: "Building / occupancy permit",
        ar: "رخصة بناء / إسكان",
        docs: [
          ["Title deed / real-estate certificate", "سند التمليك / إفادة عقارية"],
          ["Architectural plans signed by an engineer", "خرائط هندسية موقّعة من مهندس"],
          ["Cadastral map", "خريطة مساحة"],
          ["Order of Engineers approval", "موافقة نقابة المهندسين"]
        ]
      }
    ]
  },
  {
    id: "notary",
    title: "Notary & Translation",
    ar: "الكاتب العدل والترجمة",
    color: "#c3a6ff",
    icon: "pen",
    category: "personal",
    goal: "Power of attorney or translation",
    goalAr: "وكالة أو ترجمة",
    authority: "Notaries public & sworn translators",
    authorityAr: "الكتّاب العدل والمترجمون المحلّفون",
    overview: "Powers of attorney, sworn translations and certified copies are the building blocks of many other files. We arrange them so your main transaction is not held up.",
    overviewAr: "الوكالات والترجمات المحلّفة والنسخ المصدّقة هي أساس معاملات كثيرة. نرتّبها لك كي لا تتأخّر معاملتك الأساسية.",
    blurb: "Powers of attorney, sworn translations and certified copies.",
    blurbAr: "وكالات، ترجمات محلّفة ونسخ مصدّقة.",
    subs: [
      {
        name: "Power of attorney",
        ar: "وكالة",
        docs: [
          ["IDs of the grantor and the attorney", "هويات الموكِّل والوكيل"],
          ["Scope of the power (what it should cover)", "مضمون الوكالة (ما يجب أن تشمله)"],
          ["Related documents (car booklet, title deed, etc.)", "المستندات المتعلقة (دفتر سيارة، سند ملكية، إلخ)"]
        ]
      },
      {
        name: "Sworn translation",
        ar: "ترجمة محلّفة",
        docs: [
          ["Clear scan of the original document", "نسخة واضحة عن المستند الأصلي"],
          ["Target language", "اللغة المطلوبة"]
        ]
      }
    ]
  }
];
