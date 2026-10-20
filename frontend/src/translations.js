export const LANGS = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी" },
  { code: "kn", name: "ಕನ್ನಡ" },
  { code: "ta", name: "தமிழ்" },
  { code: "te", name: "తెలుగు" },
  { code: "ml", name: "മലയാളം" },
  { code: "gu", name: "ગુજરાતી" },
];

export function reasonKey(r) {
  if (r.startsWith("Action triggered")) return "untrusted";
  if (r.startsWith("Amount")) return "amount";
  if (r.startsWith("Action does not match")) return "mismatch";
  if (r.startsWith("Email contains")) return "sensitive";
  if (r.startsWith("Unknown tool")) return "unknown";
  if (r.startsWith("Daily spending")) return "cap";
  return "none";
}

export const T = {
  en: {
    title: "GuardExa alert",
    wants: "Your AI agent wants to:",
    tools: { send_money: "Send money", send_email: "Send an email", delete_records: "Delete records", read_file: "Read a file", other: "Use an unknown tool" },
    why: "Why it was held:",
    ask: "Do you approve?",
    approve: "Approve", reject: "Reject",
    approved: "Approved. Action done.", rejected: "Rejected. Nothing was done.",
    reasons: {
      untrusted: "This instruction came from an untrusted source (email, PDF or website)",
      amount: "The amount is above the limit",
      mismatch: "This action does not match the user's original request",
      sensitive: "The email contains sensitive information",
      unknown: "Unknown tool, so higher risk",
      cap: "The daily spending limit was exceeded",
      none: "No risk signals found",
    },
  },
  hi: {
    title: "GuardExa चेतावनी",
    wants: "आपका AI एजेंट यह करना चाहता है:",
    tools: { send_money: "पैसे भेजना", send_email: "ईमेल भेजना", delete_records: "रिकॉर्ड हटाना", read_file: "फ़ाइल पढ़ना", other: "अज्ञात टूल इस्तेमाल करना" },
    why: "इसे क्यों रोका गया:",
    ask: "क्या आप मंज़ूरी देते हैं?",
    approve: "मंज़ूर करें", reject: "अस्वीकार करें",
    approved: "मंज़ूर किया गया। कार्य पूरा हुआ।", rejected: "अस्वीकार किया गया। कुछ नहीं हुआ।",
    reasons: {
      untrusted: "यह निर्देश अविश्वसनीय स्रोत (ईमेल, PDF या वेबसाइट) से आया",
      amount: "राशि सीमा से अधिक है",
      mismatch: "यह कार्य उपयोगकर्ता के मूल अनुरोध से मेल नहीं खाता",
      sensitive: "ईमेल में संवेदनशील जानकारी है",
      unknown: "अज्ञात टूल, इसलिए जोखिम अधिक",
      cap: "दैनिक खर्च सीमा पार हो गई",
      none: "कोई जोखिम संकेत नहीं मिला",
    },
  },
  kn: {
    title: "GuardExa ಎಚ್ಚರಿಕೆ",
    wants: "ನಿಮ್ಮ AI ಏಜೆಂಟ್ ಇದನ್ನು ಮಾಡಲು ಬಯಸುತ್ತದೆ:",
    tools: { send_money: "ಹಣ ಕಳುಹಿಸುವುದು", send_email: "ಇಮೇಲ್ ಕಳುಹಿಸುವುದು", delete_records: "ರೆಕಾರ್ಡ್‌ಗಳನ್ನು ಅಳಿಸುವುದು", read_file: "ಫೈಲ್ ಓದುವುದು", other: "ಅಪರಿಚಿತ ಟೂಲ್ ಬಳಸುವುದು" },
    why: "ಇದನ್ನು ಏಕೆ ತಡೆಹಿಡಿಯಲಾಯಿತು:",
    ask: "ನೀವು ಅನುಮೋದಿಸುತ್ತೀರಾ?",
    approve: "ಅನುಮೋದಿಸಿ", reject: "ತಿರಸ್ಕರಿಸಿ",
    approved: "ಅನುಮೋದಿಸಲಾಗಿದೆ. ಕ್ರಮ ಪೂರ್ಣಗೊಂಡಿದೆ.", rejected: "ತಿರಸ್ಕರಿಸಲಾಗಿದೆ. ಏನೂ ಮಾಡಲಾಗಿಲ್ಲ.",
    reasons: {
      untrusted: "ಈ ಸೂಚನೆ ವಿಶ್ವಾಸಾರ್ಹವಲ್ಲದ ಮೂಲದಿಂದ (ಇಮೇಲ್, PDF ಅಥವಾ ವೆಬ್‌ಸೈಟ್) ಬಂದಿದೆ",
      amount: "ಮೊತ್ತ ಮಿತಿಗಿಂತ ಹೆಚ್ಚಿದೆ",
      mismatch: "ಈ ಕ್ರಮ ಬಳಕೆದಾರರ ಮೂಲ ವಿನಂತಿಗೆ ಹೊಂದಿಕೆಯಾಗುತ್ತಿಲ್ಲ",
      sensitive: "ಇಮೇಲ್‌ನಲ್ಲಿ ಸೂಕ್ಷ್ಮ ಮಾಹಿತಿ ಇದೆ",
      unknown: "ಅಪರಿಚಿತ ಟೂಲ್, ಆದ್ದರಿಂದ ಹೆಚ್ಚಿನ ಅಪಾಯ",
      cap: "ದೈನಂದಿನ ಖರ್ಚು ಮಿತಿ ಮೀರಿದೆ",
      none: "ಯಾವುದೇ ಅಪಾಯದ ಸೂಚನೆ ಕಂಡುಬಂದಿಲ್ಲ",
    },
  },
  ta: {
    title: "GuardExa எச்சரிக்கை",
    wants: "உங்கள் AI ஏஜென்ட் இதைச் செய்ய விரும்புகிறது:",
    tools: { send_money: "பணம் அனுப்புதல்", send_email: "மின்னஞ்சல் அனுப்புதல்", delete_records: "பதிவுகளை நீக்குதல்", read_file: "கோப்பைப் படித்தல்", other: "தெரியாத கருவியைப் பயன்படுத்துதல்" },
    why: "இது ஏன் நிறுத்தப்பட்டது:",
    ask: "நீங்கள் ஒப்புதல் அளிக்கிறீர்களா?",
    approve: "ஒப்புதல்", reject: "நிராகரி",
    approved: "ஒப்புதல் அளிக்கப்பட்டது. செயல் முடிந்தது.", rejected: "நிராகரிக்கப்பட்டது. எதுவும் செய்யப்படவில்லை.",
    reasons: {
      untrusted: "இந்த அறிவுறுத்தல் நம்பகமற்ற மூலத்திலிருந்து (மின்னஞ்சல், PDF அல்லது இணையதளம்) வந்தது",
      amount: "தொகை வரம்பை மீறுகிறது",
      mismatch: "இந்தச் செயல் பயனரின் அசல் கோரிக்கையுடன் பொருந்தவில்லை",
      sensitive: "மின்னஞ்சலில் முக்கியமான தகவல் உள்ளது",
      unknown: "தெரியாத கருவி, எனவே அதிக ஆபத்து",
      cap: "தினசரி செலவு வரம்பு மீறப்பட்டது",
      none: "ஆபத்து அறிகுறி எதுவும் இல்லை",
    },
  },
  te: {
    title: "GuardExa హెచ్చరిక",
    wants: "మీ AI ఏజెంట్ ఇది చేయాలనుకుంటోంది:",
    tools: { send_money: "డబ్బు పంపడం", send_email: "ఇమెయిల్ పంపడం", delete_records: "రికార్డులను తొలగించడం", read_file: "ఫైల్ చదవడం", other: "తెలియని టూల్ ఉపయోగించడం" },
    why: "దీన్ని ఎందుకు ఆపారు:",
    ask: "మీరు ఆమోదిస్తారా?",
    approve: "ఆమోదించండి", reject: "తిరస్కరించండి",
    approved: "ఆమోదించబడింది. చర్య పూర్తయింది.", rejected: "తిరస్కరించబడింది. ఏమీ చేయలేదు.",
    reasons: {
      untrusted: "ఈ సూచన నమ్మదగని మూలం (ఇమెయిల్, PDF లేదా వెబ్‌సైట్) నుండి వచ్చింది",
      amount: "మొత్తం పరిమితిని మించింది",
      mismatch: "ఈ చర్య వినియోగదారు అసలు అభ్యర్థనకు సరిపోలడం లేదు",
      sensitive: "ఇమెయిల్‌లో సున్నితమైన సమాచారం ఉంది",
      unknown: "తెలియని టూల్, కాబట్టి ఎక్కువ ప్రమాదం",
      cap: "రోజువారీ ఖర్చు పరిమితి దాటింది",
      none: "ఎలాంటి ప్రమాద సంకేతాలు కనబడలేదు",
    },
  },
  ml: {
    title: "GuardExa മുന്നറിയിപ്പ്",
    wants: "നിങ്ങളുടെ AI ഏജന്റ് ഇത് ചെയ്യാൻ ആഗ്രഹിക്കുന്നു:",
    tools: { send_money: "പണം അയയ്ക്കൽ", send_email: "ഇമെയിൽ അയയ്ക്കൽ", delete_records: "റെക്കോർഡുകൾ ഇല്ലാതാക്കൽ", read_file: "ഫയൽ വായിക്കൽ", other: "അജ്ഞാത ടൂൾ ഉപയോഗിക്കൽ" },
    why: "ഇത് എന്തുകൊണ്ട് തടഞ്ഞു:",
    ask: "നിങ്ങൾ അംഗീകരിക്കുന്നുണ്ടോ?",
    approve: "അംഗീകരിക്കുക", reject: "നിരസിക്കുക",
    approved: "അംഗീകരിച്ചു. പ്രവൃത്തി പൂർത്തിയായി.", rejected: "നിരസിച്ചു. ഒന്നും ചെയ്തിട്ടില്ല.",
    reasons: {
      untrusted: "ഈ നിർദ്ദേശം വിശ്വസനീയമല്ലാത്ത ഉറവിടത്തിൽ (ഇമെയിൽ, PDF അല്ലെങ്കിൽ വെബ്സൈറ്റ്) നിന്നാണ് വന്നത്",
      amount: "തുക പരിധിക്കു മുകളിലാണ്",
      mismatch: "ഈ പ്രവൃത്തി ഉപയോക്താവിന്റെ യഥാർത്ഥ അഭ്യർത്ഥനയുമായി പൊരുത്തപ്പെടുന്നില്ല",
      sensitive: "ഇമെയിലിൽ സെൻസിറ്റീവ് വിവരങ്ങൾ ഉണ്ട്",
      unknown: "അജ്ഞാത ടൂൾ, അതിനാൽ ഉയർന്ന അപകടസാധ്യത",
      cap: "ദൈനംദിന ചെലവ് പരിധി കവിഞ്ഞു",
      none: "അപകട സൂചനകളൊന്നും കണ്ടെത്തിയില്ല",
    },
  },
  gu: {
    title: "GuardExa ચેતવણી",
    wants: "તમારો AI એજન્ટ આ કરવા માંગે છે:",
    tools: { send_money: "પૈસા મોકલવા", send_email: "ઇમેઇલ મોકલવો", delete_records: "રેકોર્ડ ડિલીટ કરવા", read_file: "ફાઇલ વાંચવી", other: "અજાણ્યું ટૂલ વાપરવું" },
    why: "આને કેમ રોકવામાં આવ્યું:",
    ask: "શું તમે મંજૂરી આપો છો?",
    approve: "મંજૂર કરો", reject: "નામંજૂર કરો",
    approved: "મંજૂર કર્યું. કાર્ય પૂર્ણ થયું.", rejected: "નામંજૂર કર્યું. કંઈ કરવામાં આવ્યું નથી.",
    reasons: {
      untrusted: "આ સૂચના અવિશ્વસનીય સ્ત્રોત (ઇમેઇલ, PDF અથવા વેબસાઇટ) માંથી આવી છે",
      amount: "રકમ મર્યાદા કરતાં વધારે છે",
      mismatch: "આ કાર્ય વપરાશકર્તાની મૂળ વિનંતી સાથે મેળ ખાતું નથી",
      sensitive: "ઇમેઇલમાં સંવેદનશીલ માહિતી છે",
      unknown: "અજાણ્યું ટૂલ, તેથી વધારે જોખમ",
      cap: "દૈનિક ખર્ચ મર્યાદા વટાવાઈ ગઈ",
      none: "કોઈ જોખમના સંકેત મળ્યા નથી",
    },
  },
};