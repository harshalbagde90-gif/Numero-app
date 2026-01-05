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
  };
}
