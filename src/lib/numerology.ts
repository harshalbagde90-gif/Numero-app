// Pythagorean Numerology Calculation Engine

// Letter to number mapping (Pythagorean system)
const letterMap: Record<string, number> = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
};

const vowels = ['a', 'e', 'i', 'o', 'u'];

// Reduce to single digit or master number
export function reduceToSingleDigit(num: number): number {
  if (num === 11 || num === 22 || num === 33) return num;
  while (num > 9) {
    num = String(num).split('').reduce((acc, d) => acc + parseInt(d), 0);
    if (num === 11 || num === 22 || num === 33) return num;
  }
  return num;
}

const remediesData: Record<string, { habit: string; color: string; bestDay: string; quickTip: string; details: string[] }> = {
  "1": {
    "habit": "Start your day by writing one main task you often want to complete.",
    "color": "Using shades of red or maroon can support confidence and focus on important days.",
    "bestDay": "Monday",
    "quickTip": "A short 5-minute action may help you use your leadership energy in the right direction.",
    "details": [
      "Writing down one main task may help align your leadership energy.",
      "Taking short breaks instead of pushing continuously can often improve clarity.",
      "Using red or maroon tones may support your natural drive and decision-making."
    ]
  },
  "2": {
    "habit": "Practice sharing your opinion clearly, which may help reduce emotional overload.",
    "color": "Soft blue or white tones around you can often support peace and clarity.",
    "bestDay": "Wednesday",
    "quickTip": "Spending a few minutes daily in a calm environment may help you feel more emotionally balanced.",
    "details": [
      "Sharing your thoughts clearly once a day can support emotional balance.",
      "Quiet time in a calm environment often helps reduce internal stress.",
      "Using light blue shades may help maintain your natural diplomatic peace."
    ]
  },
  "3": {
    "habit": "Spending 10 minutes daily on creative expression can often keep your energy positive.",
    "color": "Yellow accents may help boost your motivation and natural sense of joy.",
    "bestDay": "Friday",
    "quickTip": "Finishing one task before starting another may help improve your daily consistency.",
    "details": [
      "Daily creative time can often support a more positive vibrational flow.",
      "Focusing on completion before starting new projects may help steady your energy.",
      "Adding yellow to your surroundings can often support your expressive nature."
    ]
  },
  "4": {
    "habit": "Creating a simple daily routine can often provide a sense of mental strength.",
    "color": "Earthy tones like brown may help you feel more grounded and focused.",
    "bestDay": "Tuesday",
    "quickTip": "Breaking large tasks into small steps often reduces stress and can improve productivity.",
    "details": [
      "A steady routine may help build a stronger mental foundation.",
      "Dividing big goals into micro-steps can often make progress feel more stable.",
      "Using earthy colors may help align you with your natural building energy."
    ]
  },
  "5": {
    "habit": "Adding planned variety to your day may help keep you energized without losing focus.",
    "color": "Green or teal shades can often support your natural sense of balance and flexibility.",
    "bestDay": "Thursday",
    "quickTip": "A short pause before making quick decisions may help bring better daily clarity.",
    "details": [
      "Small daily changes can often prevent energy stagnation.",
      "Pausing before acting can support better decision-making outcomes.",
      "Green tones in your environment may help stabilize your adventurous spirit."
    ]
  },
  "6": {
    "habit": "Setting healthy boundaries while helping others can often protect your personal energy.",
    "color": "Soft green or pink tones may help you feel more calm and supported.",
    "bestDay": "Saturday",
    "quickTip": "Spending a few minutes daily on self-care can often improve your emotional balance.",
    "details": [
      "Healthy boundaries often support better long-term harmony.",
      "Small acts of self-care may help maintain your nurturing capacity.",
      "Soft pastel tones can often support a more peaceful domestic vibration."
    ]
  },
  "7": {
    "habit": "Spending 10–15 minutes alone for reflection can often strengthen your inner clarity.",
    "color": "Deep blue or indigo may help support your focus and sense of inner peace.",
    "bestDay": "Sunday",
    "quickTip": "Writing down your thoughts instead of keeping them inside often reduces mental overload.",
    "details": [
      "Quiet reflection time may help sharpen your intuitive insights.",
      "Journaling your thoughts can often clear mental fog and support focus.",
      "Indigo or deep blue shades may help align you with deeper wisdom."
    ]
  },
  "8": {
    "habit": "Tracking one important goal weekly can often keep your energy aligned with success.",
    "color": "Dark blue or deep green shades may support your confidence and sense of control.",
    "bestDay": "Monday",
    "quickTip": "Balancing your ambition with regular rest may often help improve long-term success.",
    "details": [
      "Weekly goal tracking can support better material and spiritual alignment.",
      "Planned rest intervals often improve overall efficiency and focus.",
      "Deep, authoritative colors may support your natural leadership presence."
    ]
  },
  "9": {
    "habit": "Practicing the act of letting go of old patterns can often bring emotional freedom.",
    "color": "Purple or magenta tones may help support your sense of emotional balance.",
    "bestDay": "Friday",
    "quickTip": "Expressing emotions creatively may help keep your vibrational energy more positive.",
    "details": [
      "Releasing what no longer serves you can often open paths to new growth.",
      "Creative emotional expression may help maintain a more balanced outlook.",
      "Magenta or purple accents can often support your humanitarian spirit."
    ]
  }
};

// Calculate Life Path Number from DOB
export function calculateLifePathNumber(dob: Date): number {
  const day = dob.getDate();
  const month = dob.getMonth() + 1;
  const year = dob.getFullYear();

  const sum = String(day).split('').reduce((a, d) => a + parseInt(d), 0) +
    String(month).split('').reduce((a, d) => a + parseInt(d), 0) +
    String(year).split('').reduce((a, d) => a + parseInt(d), 0);

  return reduceToSingleDigit(sum);
}

// Calculate Expression Number (full name)
export function calculateExpressionNumber(name: string): number {
  const sum = name.toLowerCase().split('')
    .filter(c => letterMap[c])
    .reduce((acc, c) => acc + letterMap[c], 0);
  return reduceToSingleDigit(sum);
}

// Calculate Soul Urge Number (vowels only)
export function calculateSoulUrgeNumber(name: string): number {
  const sum = name.toLowerCase().split('')
    .filter(c => vowels.includes(c))
    .reduce((acc, c) => acc + letterMap[c], 0);
  return reduceToSingleDigit(sum);
}

// Calculate Personality Number (consonants only)
export function calculatePersonalityNumber(name: string): number {
  const sum = name.toLowerCase().split('')
    .filter(c => letterMap[c] && !vowels.includes(c))
    .reduce((acc, c) => acc + letterMap[c], 0);
  return reduceToSingleDigit(sum);
}

// Get lucky numbers based on Life Path
export function getLuckyNumbers(lifePathNumber: number): number[] {
  const baseNumbers = [lifePathNumber];
  baseNumbers.push(reduceToSingleDigit(lifePathNumber * 2));
  baseNumbers.push(reduceToSingleDigit(lifePathNumber + 3));
  baseNumbers.push(reduceToSingleDigit(lifePathNumber * 3));
  return [...new Set(baseNumbers)].slice(0, 4);
}

// Get lucky color based on Life Path
export function getLuckyColor(lifePathNumber: number): { name: string; hex: string } {
  const colorMap: Record<number, { name: string; hex: string }> = {
    1: { name: 'Red', hex: '#DC2626' },
    2: { name: 'Orange', hex: '#EA580C' },
    3: { name: 'Yellow', hex: '#CA8A04' },
    4: { name: 'Green', hex: '#16A34A' },
    5: { name: 'Blue', hex: '#2563EB' },
    6: { name: 'Indigo', hex: '#4F46E5' },
    7: { name: 'Violet', hex: '#7C3AED' },
    8: { name: 'Pink', hex: '#DB2777' },
    9: { name: 'Gold', hex: '#D97706' },
    11: { name: 'Silver', hex: '#6B7280' },
    22: { name: 'White', hex: '#F3F4F6' },
    33: { name: 'Sky Blue', hex: '#0EA5E9' },
  };
  return colorMap[lifePathNumber] || colorMap[9];
}

// Personality traits by Life Path Number
export function getLifePathTraits(num: number): {
  title: string;
  description: string;
  strengths: string[];
  tendencies: string[];
} {
  const traits: Record<number, { title: string; description: string; strengths: string[]; tendencies: string[] }> = {
    1: {
      title: 'The Leader',
      description: 'You are a natural-born leader with strong ambition and determination. You possess original ideas and the drive to make them happen. Your independent spirit and self-reliance make you a pioneer in whatever field you choose.',
      strengths: ['Natural leadership', 'Creative thinking', 'Self-motivated', 'Courageous'],
      tendencies: ['Prefers to work independently', 'Sets high standards', 'Takes initiative in situations', 'Values personal freedom']
    },
    2: {
      title: 'The Diplomat',
      description: 'You have a gift for bringing people together and creating harmony. Your sensitivity and intuition help you understand others deeply. You excel in partnerships and cooperative efforts.',
      strengths: ['Excellent mediator', 'Empathetic nature', 'Patient listener', 'Team player'],
      tendencies: ['Seeks peaceful solutions', 'Values relationships deeply', 'Notices subtle details', 'Prefers collaboration']
    },
    3: {
      title: 'The Communicator',
      description: 'You are creative, expressive, and have a natural talent for communication. Your optimistic outlook and social nature draw people to you. You inspire others with your artistic abilities and enthusiasm.',
      strengths: ['Creative expression', 'Charismatic personality', 'Optimistic outlook', 'Artistic talents'],
      tendencies: ['Loves to socialize', 'Expresses through art/words', 'Brings joy to others', 'Sees possibilities everywhere']
    },
    4: {
      title: 'The Builder',
      description: 'You are practical, organized, and have a strong work ethic. Your methodical approach helps you build solid foundations in life. You value stability and are known for your reliability.',
      strengths: ['Highly organized', 'Dependable nature', 'Detail-oriented', 'Strong discipline'],
      tendencies: ['Plans carefully', 'Values security', 'Works systematically', 'Creates lasting structures']
    },
    5: {
      title: 'The Adventurer',
      description: 'You crave freedom and variety in life. Your adaptable nature helps you thrive in changing circumstances. You are curious about the world and love new experiences.',
      strengths: ['Adaptable nature', 'Quick thinking', 'Adventurous spirit', 'Versatile abilities'],
      tendencies: ['Seeks new experiences', 'Embraces change', 'Values personal freedom', 'Loves to travel and explore']
    },
    6: {
      title: 'The Nurturer',
      description: 'You have a deep sense of responsibility toward family and community. Your caring nature makes you a natural healer and advisor. You find fulfillment in helping others.',
      strengths: ['Deeply caring', 'Responsible nature', 'Excellent advisor', 'Strong sense of duty'],
      tendencies: ['Prioritizes family', 'Creates harmonious home', 'Helps those in need', 'Values domestic happiness']
    },
    7: {
      title: 'The Seeker',
      description: 'You have a deep inner wisdom and love of knowledge. Your analytical mind seeks to understand life\'s mysteries. You value solitude for reflection and spiritual growth.',
      strengths: ['Analytical mind', 'Intuitive insights', 'Deep thinker', 'Spiritual awareness'],
      tendencies: ['Seeks deeper meaning', 'Values quiet time', 'Researches thoroughly', 'Trusts inner guidance']
    },
    8: {
      title: 'The Achiever',
      description: 'You have natural executive abilities and a talent for managing large projects. Your ambition and business sense help you achieve material success. You understand the balance of giving and receiving.',
      strengths: ['Business acumen', 'Strong willpower', 'Goal-oriented', 'Natural authority'],
      tendencies: ['Aims for success', 'Manages resources well', 'Takes charge naturally', 'Values achievement']
    },
    9: {
      title: 'The Humanitarian',
      description: 'You have a broad vision and genuine concern for humanity. Your compassionate nature and wisdom make you a natural teacher. You find fulfillment in serving the greater good.',
      strengths: ['Compassionate heart', 'Broad perspective', 'Artistic talents', 'Wise counsel'],
      tendencies: ['Thinks globally', 'Helps selflessly', 'Inspires others', 'Values universal love']
    },
    11: {
      title: 'The Intuitive (Master Number)',
      description: 'You possess heightened intuition and spiritual insight. Your sensitivity allows you to channel inspiration to others. You are here to illuminate and inspire.',
      strengths: ['Powerful intuition', 'Inspirational presence', 'Visionary thinking', 'Spiritual gifts'],
      tendencies: ['Receives insights', 'Inspires masses', 'Bridges spiritual/material', 'Highly sensitive']
    },
    22: {
      title: 'The Master Builder (Master Number)',
      description: 'You have the ability to turn dreams into reality on a grand scale. Your practical idealism combines vision with the ability to manifest. You are here to build something lasting for humanity.',
      strengths: ['Manifests big dreams', 'Practical visionary', 'Tremendous willpower', 'Large-scale thinking'],
      tendencies: ['Thinks in terms of legacy', 'Combines vision with action', 'Builds for future generations', 'Achieves the impossible']
    },
    33: {
      title: 'The Master Teacher (Master Number)',
      description: 'You embody unconditional love and have the potential to be a great spiritual teacher. Your selfless devotion to others\' growth makes you a blessing to all you meet.',
      strengths: ['Unconditional love', 'Master healer', 'Selfless service', 'Spiritual wisdom'],
      tendencies: ['Teaches through example', 'Heals with love', 'Serves humanity', 'Radiates compassion']
    }
  };
  return traits[num] || traits[9];
}

// Expression number traits
export function getExpressionTraits(num: number): string {
  const traits: Record<number, string> = {
    1: 'Your name reveals a destiny of leadership and innovation. You are meant to pioneer new paths.',
    2: 'Your name carries the energy of cooperation and diplomacy. Partnership is key to your success.',
    3: 'Your name vibrates with creative energy. Self-expression and joy are your gifts to share.',
    4: 'Your name indicates a path of building and stability. You create lasting foundations.',
    5: 'Your name resonates with freedom and change. You are here to experience life fully.',
    6: 'Your name holds the vibration of love and responsibility. Home and family are central to you.',
    7: 'Your name carries spiritual depth. You are a seeker of truth and wisdom.',
    8: 'Your name vibrates with power and abundance. Material and spiritual success await you.',
    9: 'Your name holds humanitarian energy. You are here to serve and inspire humanity.',
    11: 'Your name carries master vibration of illumination. You inspire and enlighten others.',
    22: 'Your name holds the master builder energy. You can manifest great visions into reality.',
    33: 'Your name resonates with master teacher energy. Unconditional love is your path.'
  };
  return traits[num] || traits[9];
}

// Soul Urge traits
export function getSoulUrgeTraits(num: number): string {
  const traits: Record<number, string> = {
    1: 'Deep down, you desire independence and to make your own mark on the world.',
    2: 'Your soul craves harmony, love, and meaningful connections with others.',
    3: 'At your core, you yearn for creative expression and bringing joy to others.',
    4: 'Your inner self seeks security, order, and the satisfaction of building something solid.',
    5: 'Your soul desires freedom, adventure, and to experience all life has to offer.',
    6: 'Deep within, you long to nurture, protect, and create a loving home.',
    7: 'Your soul seeks understanding, solitude for reflection, and spiritual truth.',
    8: 'At your core, you desire achievement, recognition, and material success.',
    9: 'Your soul yearns to make a difference and contribute to the greater good.',
    11: 'Deep down, you desire spiritual illumination and to inspire others.',
    22: 'Your soul seeks to manifest great dreams that benefit humanity.',
    33: 'At your core, you desire to heal and uplift through unconditional love.'
  };
  return traits[num] || traits[9];
}

// Personality number traits
export function getPersonalityTraits(num: number): string {
  const traits: Record<number, string> = {
    1: 'Others see you as confident, capable, and ready to lead.',
    2: 'You appear gentle, diplomatic, and easy to approach.',
    3: 'People perceive you as charming, creative, and full of life.',
    4: 'You come across as reliable, practical, and grounded.',
    5: 'Others see you as dynamic, adventurous, and magnetic.',
    6: 'You appear nurturing, responsible, and family-oriented.',
    7: 'People perceive you as thoughtful, wise, and somewhat mysterious.',
    8: 'You come across as powerful, successful, and authoritative.',
    9: 'Others see you as compassionate, wise, and worldly.',
    11: 'You appear intuitive, inspiring, and spiritually aware.',
    22: 'People perceive you as capable of great achievements.',
    33: 'You come across as loving, healing, and deeply caring.'
  };
  return traits[num] || traits[9];
}

// Friendly numbers based on compatibility
export function getFriendlyNumbers(num: number): number[] {
  const map: Record<number, number[]> = {
    1: [1, 3, 5, 7, 9], 2: [2, 4, 6, 8], 3: [1, 3, 5, 6, 9],
    4: [2, 4, 6, 8], 5: [1, 3, 5, 9], 6: [2, 3, 6, 9],
    7: [1, 4, 5, 7], 8: [2, 4, 6, 8], 9: [1, 3, 5, 6, 9]
  };
  const k = num > 9 ? reduceToSingleDigit(num) : num;
  return map[k] || [1, 5, 9];
}

// Enemy/Challenge numbers
export function getEnemyNumbers(num: number): number[] {
  const map: Record<number, number[]> = {
    1: [2, 4, 6], 2: [1, 5, 7], 3: [4, 7, 8],
    4: [1, 3, 5, 9], 5: [2, 4, 6], 6: [1, 5, 7],
    7: [2, 3, 6, 8], 8: [1, 3, 5, 7, 9], 9: [4, 8]
  };
  const k = num > 9 ? reduceToSingleDigit(num) : num;
  return map[k] || [2, 8];
}

// Karmic Lesson/Law based on Life Path
export function getKarmicLaw(num: number): { title: string; desc: string } {
  const map: Record<number, { title: string; desc: string }> = {
    1: { title: "Law of Independence", desc: "You must learn to stand on your own feet without dominating others." },
    2: { title: "Law of Harmony", desc: "You must learn to cooperate without losing your own identity." },
    3: { title: "Law of Expression", desc: "You must learn to speak your truth without exaggeration or fear." },
    4: { title: "Law of Stability", desc: "You must learn to build slowly and value the process over the shortcut." },
    5: { title: "Law of Freedom", desc: "You must learn that true freedom comes from within, not just from changing locations." },
    6: { title: "Law of Responsibility", desc: "You must learn to help others without carrying their burdens for them." },
    7: { title: "Law of Wisdom", desc: "You must learn to trust your own mind and intuition over outside opinions." },
    8: { title: "Law of Abundance", desc: "You must learn to balance material wealth with spiritual integrity." },
    9: { title: "Law of Compassion", desc: "You must learn to love unconditionally and let go of the past." }
  };
  const k = num > 9 ? reduceToSingleDigit(num) : num;
  return map[k] || { title: "Law of Progression", desc: "You are learning to move forward with grace." };
}

// Complete numerology reading
export interface NumerologyReading {
  name: string;
  dob: Date;
  lifePathNumber: number;
  lifePathTraits: ReturnType<typeof getLifePathTraits>;
  expressionNumber: number;
  expressionTraits: string;
  soulUrgeNumber: number;
  soulUrgeTraits: string;
  personalityNumber: number;
  personalityTraits: string;
  luckyNumbers: number[];
  luckyColor: { name: string; hex: string };
  friendlyNumbers: number[];
  enemyNumbers: number[];
  karmicLaw: { title: string; desc: string };
  remedies: {
    habit: string;
    color: string;
    bestDay: string;
    quickTip: string;
    details: string[];
  };
}

export function generateReading(name: string, dob: Date): NumerologyReading {
  const lifePathNumber = calculateLifePathNumber(dob);
  const expressionNumber = calculateExpressionNumber(name);
  const soulUrgeNumber = calculateSoulUrgeNumber(name);
  const personalityNumber = calculatePersonalityNumber(name);

  return {
    name,
    dob,
    lifePathNumber,
    lifePathTraits: getLifePathTraits(lifePathNumber),
    expressionNumber,
    expressionTraits: getExpressionTraits(expressionNumber),
    soulUrgeNumber,
    soulUrgeTraits: getSoulUrgeTraits(soulUrgeNumber),
    personalityNumber,
    personalityTraits: getPersonalityTraits(personalityNumber),
    luckyNumbers: getLuckyNumbers(lifePathNumber),
    luckyColor: getLuckyColor(lifePathNumber),
    friendlyNumbers: getFriendlyNumbers(lifePathNumber),
    enemyNumbers: getEnemyNumbers(lifePathNumber),
    karmicLaw: getKarmicLaw(lifePathNumber),
    remedies: (function () {
      const key = lifePathNumber > 9 ? String(reduceToSingleDigit(lifePathNumber)) : String(lifePathNumber);
      return remediesData[key] || remediesData["1"];
    })()
  };
}

export interface FreeNumerologyReport {
  title: "Your Quick Numerology Snapshot";
  dob: string;
  lifePath: number;
  whatThisMeans: string;
  luckyColor: {
    name: string;
    hex: string;
    line: string;
  };
  quickInsight: string;
  cta: string;
  disclaimer: string;
  text: string;
  premiumTeasers: {
    title: string;
    content: string;
  }[];
  premiumModules: {
    title: string;
    description: string;
    icon: string;
  }[];
  remedies: {
    habit: string;
    color: string;
    bestDay: string;
    quickTip: string;
    details: string[];
  };
}

function formatDobDDMMYYYY(dob: Date): string {
  const dd = String(dob.getDate()).padStart(2, "0");
  const mm = String(dob.getMonth() + 1).padStart(2, "0");
  const yyyy = String(dob.getFullYear());
  return `${dd}-${mm}-${yyyy}`;
}

function countWords(s: string): number {
  return s
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function generateFreeReportFromDob(dob: Date): FreeNumerologyReport {
  const lifePath = calculateLifePathNumber(dob);
  const color = getLuckyColor(lifePath);

  const whatThisMeansMap: Record<number, string> = {
    1: "You tend to be independent and action-oriented. You may do best when you lead with clear goals.",
    2: "You tend to be supportive and intuitive. You may do best in calm teamwork and steady routines.",
    3: "You tend to be expressive and creative. You may do best when you share ideas consistently.",
    4: "You tend to be practical and disciplined. You may do best with structure and step-by-step progress.",
    5: "You tend to be adaptable and curious. You may do best when you balance freedom with focus.",
    6: "You tend to be caring and responsible. You may do best when you create harmony and healthy boundaries.",
    7: "You tend to be thoughtful and analytical. You may do best with quiet time and learning.",
    8: "You tend to be ambitious and results-driven. You may do best with long-term planning and consistency.",
    9: "You tend to be compassionate and broad-minded. You may do best when you channel purpose into service.",
    11: "You tend to be intuitive and inspiring. You may do best when you ground big ideas into simple steps.",
    22: "You tend to be practical and visionary. You may do best when you build systems with patience.",
    33: "You tend to be nurturing and uplifting. You may do best when you guide others gently and clearly.",
  };

  const whatThisMeans = whatThisMeansMap[lifePath] ?? whatThisMeansMap[9];

  const luckyColorLine = "This color may help you feel more aligned in daily decisions.";

  const quickInsightMap: Record<number, string> = {
    1: "Quick Insight: Start with one small decision today and follow through.",
    2: "Quick Insight: If unsure, pause and choose the calmer option.",
    3: "Quick Insight: Share one idea clearly instead of keeping it in your head.",
    4: "Quick Insight: Break one task into steps and finish the first step.",
    5: "Quick Insight: Add variety, but keep one priority fixed for the day.",
    6: "Quick Insight: Support others, but also protect your personal time.",
    7: "Quick Insight: Write down one insight after reading or reflecting.",
    8: "Quick Insight: Focus on one measurable goal and track it.",
    9: "Quick Insight: Do one helpful act without overextending yourself.",
    11: "Quick Insight: Trust your intuition, then confirm with a simple plan.",
    22: "Quick Insight: Choose one system to improve and refine it steadily.",
    33: "Quick Insight: Teach or guide through a small, kind action today.",
  };

  const quickInsight = (quickInsightMap[lifePath] ?? quickInsightMap[9]).replace(/^Quick Insight:\s*/i, "");

  const cta = "Unlock your complete personalized numerology report for ₹49. Full name-based analysis included.";
  const disclaimer = "Numerology offers guidance for self-understanding.";

  const dobText = formatDobDDMMYYYY(dob);
  const reportText = [
    "Title: Your Quick Numerology Snapshot",
    "",
    `Date of Birth: ${dobText}`,
    "",
    `Your Life Path Number: ${lifePath}`,
    "",
    "What this means:",
    whatThisMeans,
    "",
    "Lucky Color:",
    `${color.name} — ${luckyColorLine}`,
    "",
    "Quick Insight:",
    quickInsight,
    "",
    "CTA:",
    cta,
    "",
    "DISCLAIMER:",
    disclaimer,
  ].join("\n");

  const clippedWhatThisMeans = (() => {
    if (countWords(reportText) <= 120) return whatThisMeans;
    const parts = whatThisMeans.split(".").map((p) => p.trim()).filter(Boolean);
    if (parts.length >= 1) {
      const shorter = `${parts[0]}.`;
      const shorterText = reportText.replace(whatThisMeans, shorter);
      if (countWords(shorterText) <= 120) return shorter;
    }
    return "You tend to have a clear life direction. Small consistent steps may help you feel aligned.";
  })();

  const finalText = reportText.replace(whatThisMeans, clippedWhatThisMeans);

  return {
    title: "Your Quick Numerology Snapshot",
    dob: dobText,
    lifePath,
    whatThisMeans: clippedWhatThisMeans,
    luckyColor: {
      name: color.name,
      hex: color.hex,
      line: luckyColorLine,
    },
    quickInsight,
    cta,
    disclaimer,
    text: finalText,
    premiumTeasers: [
      {
        title: "🔒 One habit blocking your growth",
        content: "A subtle subconscious pattern might be keeping you from reaching your full potential. This ritual often feels comforting but ultimately limits your expansion into new opportunities."
      },
      {
        title: "🔒 Inner conflict you may face quietly",
        content: "There is a silent tug-of-war between your deep-seated needs and the image you present to the world. Balancing these internal forces is key to your peace of mind."
      },
      {
        title: "🔒 Why you feel misunderstood at times",
        content: "Your unique vibrational frequency can sometimes be tuned to a different channel than those around you. Understanding this gap helps bridge the communication barrier."
      },
      {
        title: "🔒 Decision-making pattern to be aware of",
        content: "You have a natural tendency to process choices in a specific way that can lead to cycles of hesitation or over-analysis. Awareness of this flow helps you act with more certainty."
      },
      {
        title: "🔒 What drains your energy faster",
        content: "Certain environments and social interactions impact your life path more intensely than others. Identifying these energetic leaks is vital for maintaining your vitality."
      },
      {
        title: "🔒 Practical remedies to balance this number",
        content: "Simple daily shifts in your physical surroundings and morning habits can dramatically improve your alignment. These remedies help stabilize your core cosmic frequency."
      }
    ],
    premiumModules: [
      {
        title: "Your Personal Growth Blueprint",
        description: "A comprehensive map of where you naturally thrive and where your energy requires more focus. This blueprint shifts your mindset from analysis to actionable direction.",
        icon: "description"
      },
      {
        title: "Do This, Avoid This (Guidance)",
        description: "Clear, number-based boundaries. Discover the 3 specific habits to embrace and the 3 subtle pitfalls to sidestep for your life path.",
        icon: "spellcheck"
      },
      {
        title: "Work Style & Career Environment",
        description: "Avoid the wrong environment. We decode whether you thrive in solo flexibility or team structures, and the specific career settings that match your number.",
        icon: "work"
      },
      {
        title: "Emotional Pattern Decoder",
        description: "Understand your hidden stress triggers. This module explains how you process emotions and what specific expectations might be draining your energy.",
        icon: "psychology"
      },
      {
        title: "Decision-Making Guide",
        description: "Stop the hesitation. Learn your natural decision style and when it is astronomically better to wait versus when to take immediate action.",
        icon: "gavel"
      },
      {
        title: "Relationship Communication Style",
        description: "Improve your connection with others. We analyze how you express yourself and why you might be misinterpreted by different numbers.",
        icon: "forum"
      },
      {
        title: "7-Day Balance Practice (Mini Plan)",
        description: "A step-by-step 7-day plan to reset your energy. Each day features a specific habit, color, and reflection to bring you back to clarity.",
        icon: "event_repeat"
      }
    ],
    remedies: (function () {
      // For master numbers 11 -> 2, 22 -> 4, 33 -> 6
      const key = lifePath > 9 ? String(reduceToSingleDigit(lifePath)) : String(lifePath);
      return remediesData[key] || remediesData["1"];
    })()
  };
}
