// Pre-translated CPR voice-over phrases for the top 10 major spoken languages.
// Used with ElevenLabs eleven_multilingual_v2 on the Live CPR Guide page.

export type CprLangCode = "en"|"zh"|"hi"|"es"|"fr"|"ar"|"bn"|"pt"|"ru"|"ja";

export interface CprLangInfo {
  code: CprLangCode;
  label: string;
  englishName: string;
  bcp47: string;
}

export const CPR_LANGUAGES: CprLangInfo[] = [
  { code: "en", label: "English",   englishName: "English",          bcp47: "en-US" },
  { code: "zh", label: "中文",       englishName: "Mandarin Chinese", bcp47: "zh-CN" },
  { code: "hi", label: "हिन्दी",     englishName: "Hindi",            bcp47: "hi-IN" },
  { code: "es", label: "Español",   englishName: "Spanish",          bcp47: "es-ES" },
  { code: "fr", label: "Français",  englishName: "French",           bcp47: "fr-FR" },
  { code: "ar", label: "العربية",   englishName: "Arabic",           bcp47: "ar-SA" },
  { code: "bn", label: "বাংলা",      englishName: "Bengali",          bcp47: "bn-BD" },
  { code: "pt", label: "Português", englishName: "Portuguese",       bcp47: "pt-BR" },
  { code: "ru", label: "Русский",   englishName: "Russian",          bcp47: "ru-RU" },
  { code: "ja", label: "日本語",     englishName: "Japanese",         bcp47: "ja-JP" },
];

export type CprPhraseKey = "D"|"R"|"S"|"A"|"B"|"C"|"AED"|"breath"|"startCpr";

export const CPR_PHRASES: Record<CprLangCode, Record<CprPhraseKey, string>> = {
  en: {
    D: "Check for danger. Make sure the scene is safe for you, bystanders, and the casualty before approaching.",
    R: "Check for response. Squeeze the shoulders firmly and ask loudly: Can you hear me? Open your eyes!",
    S: "Send for help. Call emergency services immediately. Put your phone on speaker.",
    A: "Open the airway. Tilt the head back gently and lift the chin. Clear any visible obstruction.",
    B: "Check for normal breathing. Look, listen and feel for up to ten seconds. Gasping is not normal breathing.",
    C: "Start CPR now. Push hard and fast in the centre of the chest. I will keep the rhythm. Thirty compressions, then two breaths.",
    AED: "Attach the defibrillator as soon as it arrives. Turn it on and follow the voice prompts. Do not stop CPR until it tells you to stand clear.",
    breath: "Two breaths. Then continue compressions.",
    startCpr: "Push hard and fast. Follow the beat.",
  },
  zh: {
    D: "检查危险。在靠近之前，确保现场对你、旁观者和伤者都是安全的。",
    R: "检查反应。用力按压肩膀并大声问：你能听到我吗？请睁开眼睛！",
    S: "呼叫求助。立即拨打急救电话。把手机调成免提。",
    A: "打开气道。轻轻地将头向后仰，抬起下巴。清除任何可见的阻塞物。",
    B: "检查正常呼吸。看、听、感觉最多十秒。喘息不是正常呼吸。",
    C: "立即开始心肺复苏。在胸部中央用力快速按压。我会保持节奏。三十次按压，然后两次人工呼吸。",
    AED: "除颤器一到就立即接上。打开电源并按照语音提示操作。在它要求你离开之前，不要停止心肺复苏。",
    breath: "两次人工呼吸。然后继续按压。",
    startCpr: "用力快速按压。跟随节拍。",
  },
  hi: {
    D: "खतरे की जाँच करें। पास जाने से पहले सुनिश्चित करें कि दृश्य आपके, आसपास के लोगों और घायल व्यक्ति के लिए सुरक्षित है।",
    R: "प्रतिक्रिया की जाँच करें। कंधों को मज़बूती से दबाएँ और ज़ोर से पूछें: क्या आप मुझे सुन सकते हैं? अपनी आँखें खोलें!",
    S: "मदद के लिए बुलाएँ। तुरंत आपातकालीन सेवाओं को कॉल करें। अपने फोन को स्पीकर पर रखें।",
    A: "वायुमार्ग खोलें। सिर को धीरे से पीछे झुकाएँ और ठोड़ी उठाएँ। किसी भी दिखाई देने वाली रुकावट को हटाएँ।",
    B: "सामान्य साँस की जाँच करें। दस सेकंड तक देखें, सुनें और महसूस करें। हाँफना सामान्य साँस नहीं है।",
    C: "अभी सी पी आर शुरू करें। छाती के बीच में ज़ोर से और तेज़ी से दबाएँ। मैं ताल बनाए रखूँगा। तीस बार दबाव, फिर दो साँसें।",
    AED: "डिफिब्रिलेटर पहुँचते ही उसे लगाएँ। उसे चालू करें और आवाज़ के निर्देशों का पालन करें। जब तक वह आपको हटने के लिए न कहे, सी पी आर बंद न करें।",
    breath: "दो साँसें। फिर दबाव जारी रखें।",
    startCpr: "ज़ोर से और तेज़ी से दबाएँ। ताल का पालन करें।",
  },
  es: {
    D: "Comprueba si hay peligro. Asegúrate de que la escena sea segura para ti, los transeúntes y la víctima antes de acercarte.",
    R: "Comprueba la respuesta. Aprieta los hombros con firmeza y pregunta en voz alta: ¿Me oyes? ¡Abre los ojos!",
    S: "Pide ayuda. Llama inmediatamente a los servicios de emergencia. Pon el teléfono en altavoz.",
    A: "Abre la vía aérea. Inclina la cabeza hacia atrás suavemente y levanta el mentón. Retira cualquier obstrucción visible.",
    B: "Comprueba la respiración normal. Mira, escucha y siente durante hasta diez segundos. Jadear no es respirar normalmente.",
    C: "Comienza la reanimación ahora. Empuja fuerte y rápido en el centro del pecho. Yo marcaré el ritmo. Treinta compresiones, luego dos ventilaciones.",
    AED: "Conecta el desfibrilador en cuanto llegue. Enciéndelo y sigue las indicaciones de voz. No detengas la reanimación hasta que te indique apartarte.",
    breath: "Dos ventilaciones. Luego continúa con las compresiones.",
    startCpr: "Empuja fuerte y rápido. Sigue el ritmo.",
  },
  fr: {
    D: "Vérifiez les dangers. Assurez-vous que la scène est sûre pour vous, les témoins et la victime avant d'approcher.",
    R: "Vérifiez la réponse. Serrez fermement les épaules et demandez à voix haute : M'entendez-vous ? Ouvrez les yeux !",
    S: "Appelez à l'aide. Appelez immédiatement les services d'urgence. Mettez votre téléphone sur haut-parleur.",
    A: "Ouvrez les voies respiratoires. Inclinez doucement la tête en arrière et soulevez le menton. Retirez toute obstruction visible.",
    B: "Vérifiez la respiration normale. Regardez, écoutez et sentez pendant jusqu'à dix secondes. Le halètement n'est pas une respiration normale.",
    C: "Commencez la réanimation maintenant. Poussez fort et vite au centre de la poitrine. Je garderai le rythme. Trente compressions, puis deux insufflations.",
    AED: "Branchez le défibrillateur dès son arrivée. Allumez-le et suivez les instructions vocales. N'arrêtez pas la réanimation tant qu'il ne vous dit pas de vous écarter.",
    breath: "Deux insufflations. Puis continuez les compressions.",
    startCpr: "Poussez fort et vite. Suivez le rythme.",
  },
  ar: {
    D: "تحقق من الخطر. تأكد من أن المكان آمن لك وللمارة وللمصاب قبل الاقتراب.",
    R: "تحقق من الاستجابة. اضغط على الكتفين بقوة واسأل بصوت عالٍ: هل تسمعني؟ افتح عينيك!",
    S: "اطلب المساعدة. اتصل بخدمات الطوارئ فورًا. ضع هاتفك على مكبر الصوت.",
    A: "افتح مجرى الهواء. أمل الرأس برفق إلى الخلف وارفع الذقن. أزل أي عائق مرئي.",
    B: "تحقق من التنفس الطبيعي. انظر واستمع واشعر لمدة تصل إلى عشر ثوانٍ. اللهاث ليس تنفسًا طبيعيًا.",
    C: "ابدأ الإنعاش القلبي الرئوي الآن. اضغط بقوة وبسرعة في وسط الصدر. سأحافظ على الإيقاع. ثلاثون ضغطة ثم نفسان.",
    AED: "قم بتركيب جهاز إزالة الرجفان فور وصوله. شغله واتبع التعليمات الصوتية. لا توقف الإنعاش حتى يطلب منك الابتعاد.",
    breath: "نفسان. ثم تابع الضغطات.",
    startCpr: "اضغط بقوة وبسرعة. اتبع الإيقاع.",
  },
  bn: {
    D: "বিপদ পরীক্ষা করুন। কাছে যাওয়ার আগে নিশ্চিত করুন যে স্থানটি আপনার, দর্শকদের এবং আহত ব্যক্তির জন্য নিরাপদ।",
    R: "প্রতিক্রিয়া পরীক্ষা করুন। কাঁধ শক্তভাবে চেপে ধরুন এবং জোরে জিজ্ঞাসা করুন: আপনি কি আমাকে শুনতে পাচ্ছেন? আপনার চোখ খুলুন!",
    S: "সাহায্যের জন্য ডাকুন। অবিলম্বে জরুরী পরিষেবাগুলিতে কল করুন। আপনার ফোন স্পিকারে রাখুন।",
    A: "শ্বাসনালী খুলুন। মাথা আলতো করে পিছনে কাত করুন এবং চিবুক তুলুন। যেকোনো দৃশ্যমান বাধা পরিষ্কার করুন।",
    B: "স্বাভাবিক শ্বাস পরীক্ষা করুন। দশ সেকেন্ড পর্যন্ত দেখুন, শুনুন এবং অনুভব করুন। হাঁপানো স্বাভাবিক শ্বাস নয়।",
    C: "এখনই সিপিআর শুরু করুন। বুকের মাঝখানে জোরে এবং দ্রুত চাপ দিন। আমি ছন্দ বজায় রাখব। ত্রিশটি চাপ, তারপর দুটি শ্বাস।",
    AED: "ডিফিব্রিলেটর পৌঁছানোর সাথে সাথে এটি সংযুক্ত করুন। এটি চালু করুন এবং ভয়েস প্রম্পট অনুসরণ করুন। যতক্ষণ না এটি আপনাকে দূরে সরে যেতে বলে ততক্ষণ সিপিআর বন্ধ করবেন না।",
    breath: "দুটি শ্বাস। তারপর চাপ চালিয়ে যান।",
    startCpr: "জোরে এবং দ্রুত চাপ দিন। ছন্দ অনুসরণ করুন।",
  },
  pt: {
    D: "Verifique se há perigo. Certifique-se de que o local é seguro para você, transeuntes e a vítima antes de se aproximar.",
    R: "Verifique a resposta. Aperte os ombros firmemente e pergunte em voz alta: Você pode me ouvir? Abra os olhos!",
    S: "Peça ajuda. Ligue imediatamente para os serviços de emergência. Coloque o telefone no viva-voz.",
    A: "Abra as vias aéreas. Incline a cabeça suavemente para trás e levante o queixo. Remova qualquer obstrução visível.",
    B: "Verifique a respiração normal. Olhe, ouça e sinta por até dez segundos. Ofegar não é respiração normal.",
    C: "Inicie a reanimação agora. Empurre forte e rápido no centro do peito. Eu manterei o ritmo. Trinta compressões, depois duas ventilações.",
    AED: "Conecte o desfibrilador assim que chegar. Ligue-o e siga as instruções de voz. Não pare a reanimação até que ele lhe diga para se afastar.",
    breath: "Duas ventilações. Depois continue as compressões.",
    startCpr: "Empurre forte e rápido. Siga o ritmo.",
  },
  ru: {
    D: "Проверьте наличие опасности. Убедитесь, что место безопасно для вас, окружающих и пострадавшего, прежде чем приближаться.",
    R: "Проверьте реакцию. Крепко сожмите плечи и громко спросите: Вы меня слышите? Откройте глаза!",
    S: "Позовите на помощь. Немедленно вызовите экстренные службы. Включите громкую связь на телефоне.",
    A: "Откройте дыхательные пути. Аккуратно запрокиньте голову назад и приподнимите подбородок. Удалите любое видимое препятствие.",
    B: "Проверьте нормальное дыхание. Смотрите, слушайте и чувствуйте до десяти секунд. Хрипы — это не нормальное дыхание.",
    C: "Начните реанимацию сейчас. Толкайте сильно и быстро в центр груди. Я буду держать ритм. Тридцать нажатий, затем два вдоха.",
    AED: "Подключите дефибриллятор, как только он прибудет. Включите его и следуйте голосовым подсказкам. Не прекращайте реанимацию, пока он не скажет отойти.",
    breath: "Два вдоха. Затем продолжайте нажатия.",
    startCpr: "Толкайте сильно и быстро. Следуйте за ритмом.",
  },
  ja: {
    D: "危険を確認してください。近づく前に、現場があなた、周囲の人、そして負傷者にとって安全であることを確認してください。",
    R: "反応を確認してください。肩をしっかりと握り、大きな声で尋ねてください：聞こえますか？目を開けてください！",
    S: "助けを呼んでください。すぐに救急サービスに電話してください。電話をスピーカーモードにしてください。",
    A: "気道を開いてください。頭をゆっくりと後ろに傾け、あごを持ち上げてください。目に見える障害物を取り除いてください。",
    B: "正常な呼吸を確認してください。最大10秒間、見て、聞いて、感じてください。あえぎは正常な呼吸ではありません。",
    C: "今すぐ心肺蘇生を始めてください。胸の中央を強く速く押してください。私がリズムを保ちます。三十回の圧迫、その後二回の人工呼吸。",
    AED: "除細動器が到着したらすぐに装着してください。電源を入れ、音声の指示に従ってください。離れるように指示されるまで心肺蘇生を止めないでください。",
    breath: "二回の人工呼吸。その後、圧迫を続けてください。",
    startCpr: "強く速く押してください。リズムに従ってください。",
  },
};
