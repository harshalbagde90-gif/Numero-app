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

// --- CORE CALCULATION FUNCTIONS ---

export function calculateDriverNumber(dob: Date): number {
  return reduceToSingleDigit(dob.getDate());
}

export function calculateLifePathNumber(dob: Date): number {
  const day = dob.getDate();
  const month = dob.getMonth() + 1;
  const year = dob.getFullYear();
  const sum = String(day).split('').reduce((a, d) => a + parseInt(d), 0) +
    String(month).split('').reduce((a, d) => a + parseInt(d), 0) +
    String(year).split('').reduce((a, d) => a + parseInt(d), 0);
  return reduceToSingleDigit(sum);
}

export function calculateExpressionNumber(name: string): number {
  const sum = name.toLowerCase().split('')
    .filter(c => letterMap[c])
    .reduce((acc, c) => acc + letterMap[c], 0);
  return reduceToSingleDigit(sum);
}

export function calculateSoulUrgeNumber(name: string): number {
  const sum = name.toLowerCase().split('')
    .filter(c => vowels.includes(c))
    .reduce((acc, c) => acc + letterMap[c], 0);
  return reduceToSingleDigit(sum);
}

export function calculatePersonalityNumber(name: string): number {
  const sum = name.toLowerCase().split('')
    .filter(c => letterMap[c] && !vowels.includes(c))
    .reduce((acc, c) => acc + letterMap[c], 0);
  return reduceToSingleDigit(sum);
}

// --- DATA ACCESSORS ---

export function getLuckyNumbers(lp: number, driver: number, exp: number, soul: number, seed: number): number[] {
  // 1. Collect all core personalized numbers
  const coreNumbers = [lp, driver, exp, soul];

  // 2. Get numbers historically friendly to the Life Path
  const friendlyPool = getFriendlyNumbers(lp);

  // 3. Combine both sets for a rich matrix pool
  const combinedPool = [...new Set([...coreNumbers, ...friendlyPool])];

  // 4. Advanced Shuffle Logic using User-Specific Seed
  // This ensures that even with the same DOB, a different Name will change the Matrix
  const randomizedMatrix = [...combinedPool].sort((a, b) => {
    const valA = (a * seed + 7) % 50;
    const valB = (b * seed + 11) % 50;
    return valA - valB;
  });

  // 5. Ensure we return exactly 4 unique numbers between 1-9
  const numericMatrix = randomizedMatrix
    .map(n => (n > 9 ? reduceToSingleDigit(n) : n))
    .filter(n => n > 0);

  const finalMatrix = [...new Set(numericMatrix)];

  // If we somehow have fewer than 4 (unlikely), fill with common lucky numerology seeds
  while (finalMatrix.length < 4) {
    const backup = [1, 3, 5, 7, 9].find(n => !finalMatrix.includes(n));
    if (backup) finalMatrix.push(backup);
    else finalMatrix.push(8); // Absolute fallback
  }

  return finalMatrix.slice(0, 4);
}

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

export function getLifePathTraits(num: number): { title: string; description: string; strengths: string[]; tendencies: string[] } {
  const traits: Record<number, { title: string; description: string; strengths: string[]; tendencies: string[] }> = {
    1: { title: 'The Leader', description: 'You are a natural-born leader...', strengths: ['Leadership', 'Creative'], tendencies: ['Independent'] },
    2: { title: 'The Diplomat', description: 'You have a gift for harmony...', strengths: ['Empathetic', 'Patient'], tendencies: ['Cooperative'] },
    // Simplified for brevity, in real file we would have full descriptions
    3: { title: 'The Communicator', description: 'Creative and expressive...', strengths: ['Optimistic'], tendencies: ['Social'] },
    4: { title: 'The Builder', description: 'Practical and organized...', strengths: ['Disciplined'], tendencies: ['Methodical'] },
    5: { title: 'The Adventurer', description: 'Crave freedom and variety...', strengths: ['Adaptable'], tendencies: ['Curious'] },
    6: { title: 'The Nurturer', description: 'Responsible and caring...', strengths: ['Healer'], tendencies: ['Family-oriented'] },
    7: { title: 'The Seeker', description: 'Inner wisdom and depth...', strengths: ['Analytical'], tendencies: ['Reflective'] },
    8: { title: 'The Achiever', description: 'Executive abilities...', strengths: ['Ambitious'], tendencies: ['Authoritative'] },
    9: { title: 'The Humanitarian', description: 'Broad vision and concern...', strengths: ['Compassionate'], tendencies: ['Wise'] },
    11: { title: 'The Intuitive', description: 'Heightened intuition...', strengths: ['Inspirational'], tendencies: ['Sensitive'] },
    22: { title: 'The Master Builder', description: 'Large scale builder...', strengths: ['Visionary'], tendencies: ['Practical'] },
    33: { title: 'The Master Teacher', description: 'Unconditional love...', strengths: ['Healer'], tendencies: ['Selfless'] }
  };
  return traits[num] || traits[9];
}

export function getExpressionTraits(num: number): string {
  const traits: Record<number, string> = {
    1: 'Your name reveals a destiny of leadership and innovation.',
    2: 'Your name carries the energy of cooperation and diplomacy.',
    3: 'Your name vibrates with creative energy.',
    4: 'Your name indicates a path of building and stability.',
    5: 'Your name resonates with freedom and change.',
    6: 'Your name holds the vibration of love and responsibility.',
    7: 'Your name carries spiritual depth.',
    8: 'Your name vibrates with power and abundance.',
    9: 'Your name holds humanitarian energy.'
  };
  return traits[num] || traits[9];
}

export function getSoulUrgeTraits(num: number): string {
  const traits: Record<number, string> = {
    1: 'Deep down, you desire independence.',
    2: 'Your soul craves harmony and love.',
    3: 'At your core, you yearn for creative expression.',
    4: 'Your inner self seeks security and order.',
    5: 'Your soul desires freedom and adventure.',
    6: 'Deep within, you long to nurture and protect.',
    7: 'Your soul seeks understanding and truth.',
    8: 'At your core, you desire achievement and recognition.',
    9: 'Your soul yearns to make a difference.'
  };
  return traits[num] || traits[9];
}

export function getPersonalityTraits(num: number): string {
  const traits: Record<number, string> = {
    1: 'Others see you as confident and ready to lead.',
    2: 'You appear gentle and easy to approach.',
    3: 'People perceive you as charming and creative.',
    4: 'You come across as reliable and practical.',
    5: 'Others see you as dynamic and magnetic.',
    6: 'You appear nurturing and responsible.',
    7: 'People perceive you as thoughtful and mysterious.',
    8: 'You come across as powerful and authoritative.',
    9: 'Others see you as compassionate and wise.'
  };
  return traits[num] || traits[9];
}

const coreAlignmentPool: Record<number, {
  psychic: { theme: string; significance: string };
  expression: { theme: string; significance: string };
  soulUrge: { theme: string; significance: string };
  personality: { theme: string; significance: string };
}> = {
  1: {
    psychic: { theme: "Your Strategic Spark", significance: "you are built to initiate, and your life thrives when you lead from the front rather than waiting for others' permission." },
    expression: { theme: "The Visionary Architect", significance: "your natural talent is to create original solutions, and you are most successful when you embrace your unique path." },
    soulUrge: { theme: "Total Autonomy", significance: "your heart's secret fuel is independence; you feel most satisfied when you have full control over your own destiny." },
    personality: { theme: "Natural Authority", significance: "others instinctively see you as a leader, and you should use this commanding aura to build trust in professional circles." }
  },
  2: {
    psychic: { theme: "The Intuitive Bridge", significance: "you are designed to bring people together, and your daily success depends on your ability to listen and mediate." },
    expression: { theme: "The Diplomatic Healer", significance: "your professional superpower is empathy, allowing you to flourish in roles that require teamwork and harmony." },
    soulUrge: { theme: "Deep Connection", significance: "your soul yearns for peaceful relationships; you feel most fulfilled when you are in a supportive and loving environment." },
    personality: { theme: "Gentle Invitation", significance: "you project a warm and approachable energy that makes others feel safe and heard in your presence." }
  },
  3: {
    psychic: { theme: "The Creative Spark", significance: "you are meant to express yourself, and your daily life is brightest when you share your ideas and humor with the world." },
    expression: { theme: "The Master Communicator", significance: "your natural talent is to inspire others through words or art, making you a powerful voice in any group." },
    soulUrge: { theme: "Joyful Expression", significance: "your heart seeks happiness and self-expression; you feel most alive when you are creating something beautiful or fun." },
    personality: { theme: "Magnetic Charisma", significance: "others are drawn to your vibrant energy, and your natural charm can open doors in any social or business setting." }
  },
  4: {
    psychic: { theme: "The Disciplined Anchor", significance: "you are built for stability, and your daily progress is fastest when you follow a structured and organized routine." },
    expression: { theme: "The Practical Builder", significance: "your professional strength is logic and execution, allowing you to turn abstract ideas into lasting foundations." },
    soulUrge: { theme: "True Stability", significance: "your soul craves security and order; you feel most at peace when your home and work life are predictable and safe." },
    personality: { theme: "Solitary Reliability", significance: "others perceive you as a pillar of strength, and your reputation for being 'the reliable one' is your greatest social asset." }
  },
  5: {
    psychic: { theme: "The Versatile Voyager", significance: "you are designed for variety, and your daily energy stays high when you embrace change and explore new experiences." },
    expression: { theme: "The Adaptable Innovator", significance: "your professional talent is versatility, allowing you to solve complex problems by looking at them from many angles." },
    soulUrge: { theme: "Expansive Freedom", significance: "your soul yearns for freedom of movement and thought; you feel most satisfied when you are not restricted by rules." },
    personality: { theme: "Dynamic Excitement", significance: "you project an energetic and magnetic aura that interests others and makes you the center of attention in new circles." }
  },
  6: {
    psychic: { theme: "The Harmonious Stabilizer", significance: "you are built to nurture, and your daily life feels balanced when you are taking care of your loved ones or environment." },
    expression: { theme: "The Community Architect", significance: "your professional strength is bringing harmony to a team, making you the glue that holds projects together." },
    soulUrge: { theme: "Universal Love", significance: "your heart seeks to serve and protect; you feel most fulfilled when you are making a positive impact on your family or home." },
    personality: { theme: "Nurturing Presence", significance: "others instinctively trust your caring nature, making you the person everyone turns to for advice and support." }
  },
  7: {
    psychic: { theme: "The Analytical Seeker", significance: "you are designed for depth, and your daily success depends on finding quiet time to research and understand life's mysteries." },
    expression: { theme: "The Introspective Sage", significance: "your professional superpower is deep analysis, allowing you to uncover patterns and truths that others miss." },
    soulUrge: { theme: "Inner Wisdom", significance: "your soul yearns for solitude and reflection; you feel most at peace when you are exploring your own spiritual or mental depths." },
    personality: { theme: "Mysterious Intellectual", significance: "others see you as thoughtful and profound, creating an air of mystery that commands respect without needing to speak." }
  },
  8: {
    psychic: { theme: "The Power Turbine", significance: "you are built for material mastery, and your daily drive is fueled by the desire to achieve tangible, high-status results." },
    expression: { theme: "The Executive Visionary", significance: "your professional talent is leading large-scale operations with authority and calculated efficiency." },
    soulUrge: { theme: "Material Success", significance: "your heart seeks abundance and legacy; you feel most satisfied when you are building wealth and exerting influence." },
    personality: { theme: "Commanding Executive", significance: "you project an image of power and competence that makes others want to follow your leadership and vision." }
  },
  9: {
    psychic: { theme: "The Global Giver", significance: "you are designed for broad impact, and your daily life is most meaningful when you are helping others or finishing old cycles." },
    expression: { theme: "The Compassionate Leader", significance: "your professional superpower is humanitarian vision, allowing you to inspire large groups toward a common good." },
    soulUrge: { theme: "Universal Completion", significance: "your soul craves selfless service and let-go; you feel most satisfied when you are acting for the benefit of all." },
    personality: { theme: "Wise Old Soul", significance: "others perceive you as having deep wisdom and compassion, making you an inspirational figure in any community." }
  }
};

export function getCoreAlignmentUseCase(num: number, category: 'psychic' | 'expression' | 'soulUrge' | 'personality'): { theme: string; significance: string } {
  const k = num > 9 ? reduceToSingleDigit(num) : num;
  const content = coreAlignmentPool[k]?.[category];
  return content || { theme: "Cosmic Alignment", significance: "aligning your daily actions with your core numeric frequency leads to true progress." };
}

export function getFriendlyGrowthAdvice(type: 'friendly' | 'growth', numbers: number[]): string {
  if (type === 'friendly') {
    return `Align with people having these numbers for smooth collaboration and emotional support.`;
  }
  return `These numbers bring challenges that are necessary for your soul's evolution. Embrace them.`;
}

export function getFriendlyNumbers(num: number): number[] {
  const k = num > 9 ? reduceToSingleDigit(num) : num;
  const map: Record<number, number[]> = { 1: [1, 3, 5, 7, 9], 2: [2, 4, 6, 8], 3: [1, 3, 5, 6, 9], 4: [2, 4, 6, 8], 5: [1, 3, 5, 9], 6: [2, 3, 6, 9], 7: [1, 4, 5, 7], 8: [2, 4, 6, 8], 9: [1, 3, 5, 6, 9] };
  return map[k] || [1, 5, 9];
}

export function getEnemyNumbers(num: number): number[] {
  const k = num > 9 ? reduceToSingleDigit(num) : num;
  const map: Record<number, number[]> = { 1: [2, 4, 6], 2: [1, 5, 7], 3: [4, 7, 8], 4: [1, 3, 5, 9], 5: [2, 4, 6], 6: [1, 5, 7], 7: [2, 3, 6, 8], 8: [1, 3, 5, 7, 9], 9: [4, 8] };
  return map[k] || [2, 8];
}

export function getKarmicLaw(num: number): { title: string; desc: string } {
  const k = num > 9 ? reduceToSingleDigit(num) : num;
  const map: Record<number, { title: string; desc: string }> = {
    1: { title: "Law of Independence", desc: "Learn to stand on your own feet." },
    2: { title: "Law of Harmony", desc: "Learn to cooperate without losing identity." },
    3: { title: "Law of Expression", desc: "Learn to speak your truth clearly." },
    4: { title: "Law of Stability", desc: "Value the process over the shortcut." },
    5: { title: "Law of Freedom", desc: "Freedom comes from within." },
    6: { title: "Law of Responsibility", desc: "Help others without carrying them." },
    7: { title: "Law of Wisdom", desc: "Trust your intuition over outside opinions." },
    8: { title: "Law of Abundance", desc: "Balance wealth with integrity." },
    9: { title: "Law of Compassion", desc: "Love unconditionally and let go." }
  };
  return map[k] || { title: "Law of Progression", desc: "Moving forward with grace." };
}

// --- SENTENCE POOLS ---

const personalGrowthPool: Record<number, string[]> = {
  1: ["Independence is key.", "Start new chapters.", "Trust your authority."],
  2: ["Diplomacy is growth.", "Thrive in partnerships.", "Find inner peace."],
  // ... rest of the numbers would go here
};
const driverNumberInsights: Record<number, string[]> = { 1: ["Initiator,"], 2: ["Intuitive,"], 3: ["Creative,"], 4: ["Builder,"], 5: ["Adaptable,"], 6: ["Nurturer,"], 7: ["Seeker,"], 8: ["Ambitious,"], 9: ["Compassionate,"] };
const expressionTransitionPool = ["this translates into...", "consequently..."];
const expressionOutcomePool: Record<number, string[]> = { 1: ["leading with innovation."], 2: ["harmony and partnership."] };
const advicePool = ["You might find it helpful to focus on", "Consider exploring the benefits of"];

function getShuffledItem<T>(pool: T[], seed: number): T {
  const index = Math.abs(seed) % pool.length;
  return pool[index];
}

// --- DETAILED ANALYSIS POOLS ---

const growthBlueprintPool: Record<number, { para: string; points: string[] }> = {
  1: {
    para: "Your growth occurs when you step out of the shadows and embrace your role as a self-sufficient visionary. You aren't meant to follow established paths, but to carve new ones that reflect your unique perspective. This journey requires you to balance your immense drive with the patience to let your long-term goals mature.",
    points: ["Prioritize single-tasking to harness your full focus.", "Set clear boundaries to protect your creative energy from external drain.", "Take calculated risks that align with your deepest personal values."]
  },
  2: {
    para: "Growth for you is found in the power of connection and the quiet strength of your intuition. You thrive when you are 'the power behind the throne,' using your diplomatic skills to build harmony and bridges. Learning to trust your sensitivity as a strength rather than a vulnerability is your key to true inner expansion.",
    points: ["Practice active listening to sharpen your natural intuitive gifts.", "Engage in collaborative projects where your mediation skills can shine.", "Establish a peaceful daily sanctuary for emotional regrouping."]
  },
  3: {
    para: "Your path to expansion is paved with creative expression and the joy you bring to others. You grow when you stop filtering your ideas for approval and start sharing them because they vibrate with truth. Your optimism is a magnetic force, but it must be channeled into consistent action to manifest lasting results.",
    points: ["Dedicate time daily to a creative outlet like writing or art.", "Surround yourself with people who celebrate your expressive nature.", "Practice finishing projects once they lose their initial novelty."]
  },
  4: {
    para: "Your growth is rooted in the mastery of structure and the satisfaction of building something that lasts. You are the architect of your own destiny, finding clarity through organization and discipline. True expansion comes when you learn to value the process as much as the final product, trusting that steady progress wins.",
    points: ["Optimize your environment for maximum productivity and order.", "Break down long-term goals into smaller, manageable milestones.", "Value the stability of routine as a foundation for your freedom."]
  },
  5: {
    para: "Expansion for you comes through a wide range of experiences and the freedom to change direction. You grow when you embrace life's variety without losing your internal compass. Your adaptability is your greatest tool, and finding a central focus among many interests allows your versatile energy to culminate in success.",
    points: ["Say yes to new opportunities that challenge your comfort zone.", "Cultivate a 'home base' habit that grounds you during transitions.", "Learn to see change as a constant source of learning and renewal."]
  },
  6: {
    para: "Your growth is deeply interwined with your ability to nurture and create harmony. You find fulfillment when you serve your family and community, but your true expansion happens when you also apply that care to yourself. Balancing your sense of duty with personal boundaries is the key to your long-term vitality.",
    points: ["Create a harmonious living space that reflects your inner peace.", "Practice selfless service while maintaining your own energy reserves.", "Accept that you don't need to fix everyone to be valued."]
  },
  7: {
    para: "Growth for you is a journey into the depths of wisdom and the quiet spaces of the soul. You expansion occurs in solitude, where you can analyze life's mysteries and connect with your inner truth. Trusting your own insights over popular opinion is the mark of your personal evolution.",
    points: ["Incorporate 15 minutes of total silence into your daily routine.", "Deepen your knowledge in a subject that truly fascinates you.", "Keep a private journal to track your most profound realizations."]
  },
  8: {
    para: "Expansion for you is about the mastery of material resources and the exercise of authority with integrity. You grow when you view success not just as a destination but as a platform for greater impact. Balancing your high ambition with a sense of karmic responsibility leads to true and lasting abundance.",
    points: ["Review your financial and professional goals on a weekly basis.", "Practice delegating tasks to focus on high-level decision making.", "Ensure your path to success benefits others as much as yourself."]
  },
  9: {
    para: "Your growth is found in the practice of universal love and the courage to let go of what no longer serves the collective. Your expansion happens when you think globally and act with a compassionate heart. You are here to teach through example, showing that finishing a cycle is as important as starting one.",
    points: ["Engage in humanitarian work or activities that help a larger cause.", "Practice the art of detachment to move forward with grace.", "Share your broad perspective to inspire and uplift those around you."]
  }
};

const guideModulePool: Record<number, { para: string; points: string[] }> = {
  1: {
    para: "Your path is one of the pioneer, requiring immense self-discipline to transform raw ambition into tangible legacy. You are guided to take full ownership of your trajectory, recognizing that your strongest results come when you act with absolute conviction and single-pointed focus. Avoid the temptation to wait for approval; your success is self-generated.",
    points: ["Stick to a rigorous morning routine to ground your drive.", "Avoid procrastinating on small administrative details that block progress.", "Set firm boundaries between your work and personal regeneration."]
  },
  2: {
    para: "Patience and timing are your most powerful allies on your journey toward meaningful contribution. You are guided to be the master of the subtle dynamics, the one who builds bridges and maintains the harmony necessary for long-term stability. Your strength is found in cooperation, provided you do not sacrifice your core identity in the process.",
    points: ["Seek consensus before taking major collaborative or personal steps.", "Avoid ignoring your accurate gut feelings just to maintain temporary peace.", "Practice clear, assertive communication to prevent subtle misunderstandings."]
  },
  3: {
    para: "Guidance for you is centered on the sacred duty of expression and the discipline of focused creativity. You thrive when your magnetic energy is channeled into a single, high-impact vision rather than being scattered across many superficial interests. Your optimism is your greatest tool, but it must be rooted in the reality of completion.",
    points: ["Focus on finishing one major creative project before starting another.", "Avoid over-committing your social energy to the point of mental drain.", "Express your truth with a balance of radical honesty and gentle kindness."]
  },
  4: {
    para: "Your guidance is rooted in the beauty of the blueprint and the undeniable strength of a steady process. You are here to demonstrate that work done with precision and integrity is its own reward. Avoid taking shortcuts that compromise the foundation; your path is one of the methodical build towards lasting security.",
    points: ["Use detailed checklists for your most complex professional tasks.", "Avoid taking on more responsibilities than you can practically manage.", "Value small, consistent wins as the primary indicators of your success."]
  },
  5: {
    para: "Guidance for you is about balancing your inherent need for freedom with the necessity of a central focus. You are meant to be a worldly explorer, but every successful explorer needs a home base and a reliable map. Find the golden thread that connects your diverse interests and follow it with unyielding discipline.",
    points: ["Stay focused on your primary goal until it is at least 80% complete.", "Avoid changing your mind based on temporary boredom or restlessness.", "Embrace variety within a structured framework to prevent energy leaks."]
  },
  6: {
    para: "The guidance for your path is to balance the 'we' with the 'me' in all areas of service and care. Responsibility is your second nature, but you must ensure that your sense of duty does not become an emotional cage. You serve the world best when your own internal cup is overflowing, not when you are running on empty.",
    points: ["Delegate domestic and project responsibilities to trusted partners.", "Avoid feeling guilty for taking necessary time for self-restoration.", "Nurture your own dreams with the same intensity you nurture others."]
  },
  7: {
    para: "Your guidance is found in the silence of the deep search and the commitment to analytical truth. You are here to uncover the mysteries that others miss in their haste. Avoid the noise of the crowd and trust the research you perform in the quiet hours; that is where your most valuable insights are found.",
    points: ["Schedule daily 'deep work' sessions in total physical solitude.", "Avoid seeking external validation for truths you already know inside.", "Invest in high-quality learning resources to sharpen your expertise."]
  },
  8: {
    para: "Guidance for your life path is about the exercise of power balanced by a sense of higher purpose. Material success is your tool, not your final destination. Aim for the highest levels of achievement, but ensure every step you take is built on a foundation of absolute integrity and a long-term vision of impact.",
    points: ["Review your financial and professional strategies every single quarter.", "Avoid letting short-term gains cloud your vision of a lasting legacy.", "Act with the quiet authority that comes from total competence."]
  },
  9: {
    para: "The guidance for your soul is about the wisdom of release and the power of a global, humanitarian vision. You are a citizen of the world. Your ultimate success comes when you act for the greater good of the collective, seeing the inherent light in every person and every challenging situation.",
    points: ["Focus on projects that serve a wider community or global cause.", "Avoid holding onto old grudges or outdated emotional attachments.", "Lead with the compassion of a wise and worldly-experienced soul."]
  }
};

const careerModulePool: Record<number, { para: string; points: string[] }> = {
  1: {
    para: "In the professional sphere, you are a natural-born architect of original ideas and pioneering projects. You thrive in roles that demand high initiative, independent thinking, and the absolute autonomy to make fast, high-level decisions. Your best environment is one that rewards results over time spent and celebrates your leadership.",
    points: ["Target senior roles with leadership or independent project control.", "Seek environments that value radically innovative problem-solving.", "Look for performance-based rewards and clear, vertical growth paths."]
  },
  2: {
    para: "Your career strength is your unparalleled ability to foster collaboration and manage the subtle dynamics of a large team. You are the perfect mediator and advisor, thriving in environments that are peaceful, cooperative, and aesthetically orderly. You act as the glue that keeps complex professional structures intact.",
    points: ["Focus on roles in high-level diplomacy, counseling, or coordination.", "Look for companies with a strong, supportive, and inclusive culture.", "Seek positions where your sharp attention to detail is highly valued."]
  },
  3: {
    para: "The ideal work environment for you is one that vibrates with constant creativity and high-level communication. You need a platform to share your expansive ideas and a team that truly appreciates your natural charisma and optimistic energy. Rigid, silent, or overly bureaucratic offices act as a significant energetic drain.",
    points: ["Explore careers in digital media, public speaking, or the creative arts.", "Work in open spaces that allow for regular social interaction and ideation.", "Seek roles where your verbal or written communication skills are central."]
  },
  4: {
    para: "You are the bedrock of any successful organization, finding your professional stride in roles that require extreme precision and organization. You thrive when building massive systems from the ground up. You need a workplace that is structured, reliable, and fundamentally values the virtue of hard, consistent work.",
    points: ["Roles in operations management, engineering, or administration suit you.", "Target established companies with clear hierarchies and stable operations.", "Value roles where your organizational skills create significant order."]
  },
  5: {
    para: "Professional monotony is your primary enemy. You require a career that involves constant variety, movement, and perhaps a regular amount of travel. You thrive in fast-paced environments where no two days are ever exactly the same and you can utilize your immense versatility to solve changing problems.",
    points: ["Consider roles in sales, global travel, or freelance consulting.", "Work in environments that offer flexible schedules or remote mobility.", "Seek positions that require extremely quick thinking and adaptation."]
  },
  6: {
    para: "Your professional fulfillment comes from roles that involve high-level service, genuine care, and the systematic improvement of others' lives. You are the 'office parent' who brings harmony and wise advice to the team. You excel in careers related to healing, education, and social responsibility where your empathy is a lead asset.",
    points: ["Roles in elite teaching, healthcare, or human resources are ideal.", "Look for socially responsible companies with stable, family-like teams.", "Value environments where community harmony and ethics are top priorities."]
  },
  7: {
    para: "You are the professional specialist of the numerology world. You thrive in careers that allow for deep research, technical mastery, and a quiet, independent workspace. You need an environment where you are respected for your profound knowledge and left to do your 'deep work' without unnecessary interruption.",
    points: ["Look for roles in science, IT architecture, or specialized research.", "Seek work environments that offer private offices or total remote work.", "Target positions where quality of insight is more important than speed."]
  },
  8: {
    para: "In the professional world, you are a natural executive and a master of material manifestation. You thrive when you are managing large budgets, directing high-performance teams, and making high-stakes decisions. You need an environment that is professional, ambitious, and focused on material success and status.",
    points: ["Target senior executive management, finance, or entrepreneurship.", "Work in industries that reward high ambition and personal authority.", "Look for roles that offer significant responsibility and public recognition."]
  },
  9: {
    para: "Your career is often more of a vocation or a calling. You are most successful in roles that allow you to contribute to a better, more compassionate world. You thrive in humanitarian organizations, creative fields, and education where your broad, global vision can inspire others and make a tangible difference.",
    points: ["Roles in NGOs, philanthropy, or the cinematic arts are well-aligned.", "Seek organizations with a clear, noble, and impactful mission statement.", "Value work that allows you to act as a mentor or a visionary teacher."]
  }
};

const emotionsModulePool: Record<number, { para: string; points: string[] }> = {
  1: {
    para: "Emotionally, you are fiercely independent and process your feelings internally, which can sometimes lead to a sense of being 'alone at the top.' Your inner growth accelerates when you realize that sharing your vulnerability is a sign of supreme confidence, not a weakness of character.",
    points: ["Share your deeper inner goals with a trusted, private inner circle.", "Practice asking for help early to prevent overwhelming emotional burnout.", "Allow yourself dedicated quiet time to process feelings without judgment."]
  },
  2: {
    para: "You are profoundly sensitive to the emotional atmosphere and the subtle feelings of those around you. You process your emotions through deep connection. Learning to distinguish your own feelings from the emotional noise of others is your primary path toward total emotional mastery.",
    points: ["Establish a regular practice of clearing external energy from your space.", "Express your needs clearly instead of hoping others will guess them.", "Seek relationships where your sensitivity is respected and protected."]
  },
  3: {
    para: "Your emotions are vivid, colorful, and require regular creative expression to remain healthy. You tend to be the 'bright light' for others, but bottling up your own shadows can lead to sudden bursts of scattered energy. Processing your feelings through art or social sharing keeps your vibration balanced.",
    points: ["Use creative journaling to explore and release your deeper emotions.", "Don't feel the need to be the 'happy one' for others all of the time.", "Express your feelings while they are small to prevent emotional overflow."]
  },
  4: {
    para: "You process your emotions through the lens of security, stability, and routine. You feel most balanced when your external world is in perfect order. You are often the 'rock' for others, but you must ensure you have a private, safe place to show your own softer, more vulnerable side.",
    points: ["Build an emotional routine, such as a daily evening reflection habit.", "Allow yourself to feel 'messy' emotions without needing to fix them.", "Surround yourself with a few deeply reliable and grounded friends."]
  },
  5: {
    para: "Emotionally, you crave constant variety but can sometimes struggle with an intense internal restlessness. You process feelings through change and can feel trapped if your life becomes too predictable. Finding 'freedom within' through mindfulness helps stabilize your energetic cycles.",
    points: ["Practice being fully present in the moment to calm your restlessness.", "Express your feelings through physical movement or short-term changes.", "Value connections that respect and support your need for personal freedom."]
  },
  6: {
    para: "You are the emotional anchor and the heart for your entire community. You feel deeply for others and process emotions through acts of service. Your major breakthrough happens when you learn that you are worthy of love even when you aren't actively doing something for someone else.",
    points: ["Schedule regular, non-negotiable 'me time' into your weekly calendar.", "Learn to say 'no' to emotional demands without feeling any guilt.", "Practice the art of being nurtured by those you love and support."]
  },
  7: {
    para: "Your inner emotional world is deep, private, and highly analytical. You process feelings through reflective solitude, seeking to understand the root 'why' behind what you feel. You are a mystery to many, and sharing your inner world with a few trusted souls is your key to connection.",
    points: ["Incorporate deep meditation or long walks into your emotional hygiene.", "Share your deeper thoughts with one person who truly 'gets' you.", "Trust your inner wisdom to navigate even the most complex emotions."]
  },
  8: {
    para: "You process emotions through the lens of power, achievement, and self-control. You can be guarded with your feelings, viewing vulnerability as a potential risk. True emotional success happens when you integrate your professional authority with your private, compassionate heart.",
    points: ["Balance your high-stakes life with regular intervals of deep rest.", "Allow yourself to be vulnerable in your most trusted relationships.", "Recognize that true power always includes empathy and heart-wisdom."]
  },
  9: {
    para: "Your emotions are vast, worldly, and deeply connected to the joy and suffering of all humanity. You process feelings through the lens of the 'greater good.' Letting go of personal past hurts and focusing on universal love is what brings you the most profound emotional peace.",
    points: ["Practice forgiveness rituals to release old, heavy emotional ties.", "Maintain a daily gratitude practice to keep your perspective positive.", "Share your vast wisdom and compassion with those in your community."]
  }
};

const decisionModulePool: Record<number, { para: string; points: string[] }> = {
  1: {
    para: "Your decision style is remarkably fast, independent, and often pioneering. You don't like to wait for permission or consensus. You act on your first impression, which is usually correct for your path. Just ensure you take a brief moment to consider the long-term impact before jumping.",
    points: ["Trust your first instinct; it is your natural leadership signal.", "Write down one potential consequence before every major life move.", "Act with the absolute confidence that comes from your self-reliance."]
  },
  2: {
    para: "You are the diplomat of decision-making, preferring to gather all available data and consult with others before acting. You wait for a moment of internal harmony. Your gut feeling is your best guide, especially when it tells you to wait for the external noise to settle first.",
    points: ["Consult with a trusted, neutral advisor before making large changes.", "Wait for a genuine sense of peace before finalizing any major choice.", "Trust your intuition over cold logic when the two are in conflict."]
  },
  3: {
    para: "Your decisions are best made when they align with your sense of joy and creative potential. You process choices through a lens of 'what is most expansive?' Avoid making decisions based on fear of missing out; choose the path that allows your voice to be heard most clearly.",
    points: ["Choose the option that feels most creative and joyful in your body.", "Avoid analysis paralysis by setting a firm 24-hour decision deadline.", "Trust that expressing your choice clearly will open the next door."]
  },
  4: {
    para: "Decisions for you must be rooted in logic, structure, and long-term stability. You are the methodical builder who needs to see the plan before committing. Your most successful choices are the ones that have been thoroughly researched and fit into your larger life architecture.",
    points: ["Create a pro/con list that focuses on practical, material results.", "Trust the data you have gathered through your own careful research.", "Give yourself permission to build slowly once the decision is made."]
  },
  5: {
    para: "Your decision-making thrives on variety and adaptability, but you can sometimes struggle with choosing just one path. You process choices through the lens of 'what offers the most freedom?' Finding a central priority helps you avoid the trap of constant, inconclusive change.",
    points: ["Identify your one highest priority before looking at your options.", "Choose the path that offers growth, even if it feels a bit risky.", "Wait 48 hours for big decisions to ensure it isn't just a whim."]
  },
  6: {
    para: "You weigh your decisions against the impact they will have on your loved ones and your community. You are the harmonious decision-maker. Your challenge is learning to sometimes choose what is best for your own growth, even if it feels temporarily disruptive to the group.",
    points: ["Ask: 'Does this decision also nurture my own soul and health?'", "Trust your heart to know the difference between duty and sacrifice.", "Look for the win-win solution that maintains overall harmony."]
  },
  7: {
    para: "You process decisions through deep research, spiritual intuition, and analytical silence. You need to understand the 'underlying truth' before you act. Your most profound choices are made in solitude, away from the influence of popular opinion or external pressure.",
    points: ["Take a solitary walk or meditate before committing to a big move.", "Trust the 'quiet small voice' that speaks to you during your research.", "Verify all technical or legal details before signing any agreements."]
  },
  8: {
    para: "Your decision style is executive, authoritative, and focused on material and status outcomes. You process choices through the lens of 'is this efficient and powerful?' Balancing your natural ambition with absolute integrity is the key to your most successful life decisions.",
    points: ["Review the long-term financial implications of your major choices.", "Trust your ability to manage whatever outcome your decision brings.", "Choose the path of the most integrity, especially when it is harder."]
  },
  9: {
    para: "You make decisions based on the broad vision and the greater humanitarian good. You are a global decision-maker. Your most peaceful choices are the ones that involve letting go of the past and stepping into a future that uplift others as much as yourself.",
    points: ["Ask: 'How does this choice serve the world beyond my own needs?'", "Practice the art of releasing old patterns during your decision phase.", "Trust your broad perspective to see the path that others might miss."]
  }
};

const relationshipModulePool: Record<number, { para: string; points: string[] }> = {
  1: {
    para: "In your closest relationships, you need a partner who deeply respects your independence and shares your high ambition. You communicate directly, honestly, and value truth over sugar-coated words. You naturally lead in love, but you grow most when you learn to share the driver's seat.",
    points: ["Be as direct about your feelings as you are about your goals.", "Schedule high-quality time that is free from any work distractions.", "Acknowledge that partnership is a team effort, not a solo mission."]
  },
  2: {
    para: "Communication for you is about the subtle, the intuitive, and the deeply felt. You need a relationship where there is absolute emotional safety and a shared sense of harmony. You communicate best through gentleness and active listening, seeking a true soul-level connection.",
    points: ["Share your subtle feelings instead of waiting for them to be guessed.", "Create a peaceful sanctuary at home for your relationship to thrive.", "Prioritize harmony but do not avoid necessary, healthy truth-telling."]
  },
  3: {
    para: "Your relationship style is expressive, joyful, and deeply social. You need a partner who appreciates your charisma and joins you in your creative adventures. Communication is your love language, and sharing your optimistic vision for the future is how you truly bond with others.",
    points: ["Express your appreciation through words, letters, and creativity.", "Keep the spark alive by trying new social and artistic activities.", "Share your deeper fears as well as your joys to build true intimacy."]
  },
  4: {
    para: "You seek stability, security, and absolute reliability in your relationships. You are a grounded partner who expresses love through building a solid foundations and being a consistent presence. You value tradition and need a partner who respects your methodical approach to lite.",
    points: ["Build trust through small, consistent actions over a long period.", "Share your practical goals for the future with your partner clearly.", "Value the quiet stability of your home life as a source of strength."]
  },
  5: {
    para: "In relationships, you crave excitement, variety, and a partner who respects your fundamental need for personal freedom. You express love through shared adventures and deep, intellectual stimulating conversation. You thrive with someone who is as adaptable as you are.",
    points: ["Maintain your personal hobbies and friendships to feel balanced.", "Share your need for change and variety with your partner openly.", "Choose a partner who view life as an ever-changing adventure."]
  },
  6: {
    para: "You are the ultimate nurturer in relationships, creating a home that is a true sanctuary of love and harmony. You express your devotion through care and service, but you must ensure you do not become a 'martyr' in love. Your partner needs to nurture you as much as you nurture them.",
    points: ["Practice receiving love and care as graciously as you give it.", "Maintain healthy boundaries to prevent emotional over-extension.", "Focus on home and family as your primary creative relationship project."]
  },
  7: {
    para: "Your relationship style is wise, deep, and often quite private. You need a partner who respects your need for solitude and enjoys exploring life's deeper mysteries with you. You communicate best on an intellectual and spiritual level, seeking a partner who is a true mental equal.",
    points: ["Share your most profound realizations with your partner regularly.", "Schedule 'quiet nights in' to reconnect without external noise.", "Trust your partner with your inner world to build lasting intimacy."]
  },
  8: {
    para: "You approach relationships with the same ambition and focus on success that you bring to your career. You value power couples and need a partner who supports your drive for achievement. You express love through providing security and sharing your victories with your partner.",
    points: ["Balance your professional ambition with dedicated 'us' time.", "Share your professional victories and challenges with your partner.", "Ensure your relationship feels like a true, equal power-partnership."]
  },
  9: {
    para: "In relationships, you are compassionate, worldly, and deeply idealistic. You need a partner who shares your broad vision for a better world and respects your humanitarian heart. You express love through universal kindness and a deep, soul-level understanding of your partner.",
    points: ["Engage in humanitarian or community projects with your partner.", "Practice universal love while still focusing on your partner's needs.", "Lead your relationship with the wisdom and grace of a global soul."]
  }
};


const cosmicFrequencyPool: Record<number, { mantra: string; instruction: string }> = {
  1: {
    mantra: "I am the architect of my own peace.",
    instruction: "Repeat this 3 times at first light to shield your inner peace from external noise."
  },
  2: {
    mantra: "My intuition is my infallible guide.",
    instruction: "Chant this before bed to strengthen the bridge between your conscious mind and spiritual self."
  },
  3: {
    mantra: "Every word I speak creates a world of joy.",
    instruction: "Visualize golden light expanding from your throat as you say this during sunrise."
  },
  4: {
    mantra: "I build my life on a foundation of truth.",
    instruction: "Place your hands on natural soil and speak this to ground your electric aura."
  },
  5: {
    mantra: "I am free, I am fluid, I am evolving.",
    instruction: "Say this while facing the North-East to unlock stagnant energy and invite positive change."
  },
  6: {
    mantra: "Love flows to me and through me, endlessly.",
    instruction: "Expose your palms to natural sunlight for 108 seconds while holding this intention."
  },
  7: {
    mantra: "I descend into silence to find my light.",
    instruction: "Speak this in total solitude to amplify your dormant spiritual intuition."
  },
  8: {
    mantra: "Abundance is my natural state of being.",
    instruction: "Visualize a silver stream of energy entering your crown while repeating this at midnight."
  },
  9: {
    mantra: "I release the past to embrace the infinite.",
    instruction: "Inhale the scent of sandalwood or lavender as you say this to reset your karmic frequency."
  },
  11: {
    mantra: "I am a channel for the divine visionary light.",
    instruction: "Hold a piece of copper and face the East at dawn to ground your high-voltage inspiration."
  },
  22: {
    mantra: "My dreams are the blueprints for a better world.",
    instruction: "Touch running water while speaking this to manifest your massive material visions."
  },
  33: {
    mantra: "I heal through the vibration of selfless love.",
    instruction: "Place your left hand on your heart and breathe deeply 9 times to ignite your healing spark."
  }
};

// --- PREMIUM DETAILED INSIGHTS POOL ---

const premiumInsightsPool: Record<number, { question: string; description: string; subPoints: string[] }[]> = {
  1: [
    {
      question: "One habit blocking your growth",
      description: "As a Life Path 1, your drive for perfection and 'doing it all alone' often becomes your biggest hurdle. You tend to view asking for help as a sign of weakness, which leads to unnecessary burnout and missed opportunities for collaborative scaling. This individualistic approach restricts you to only what your two hands can do.",
      subPoints: ["Micromanage every small detail.", "Rejecting valid feedback from peers.", "Overworking to prove self-worth."]
    },
    {
      question: "Inner conflict you may face quietly",
      description: "You struggle with the paradox of wanting to lead the world while simultaneously fearing that you aren't 'original' enough. There is a quiet battle between your public confidence and a private imposter syndrome that whispers you are just performing a role rather than being a true pioneer.",
      subPoints: ["Confidence vs. Secret self-doubt.", "Need for speed vs. Quality control.", "Authority vs. Desire for approval."]
    },
    {
      question: "Why you feel misunderstood at times",
      description: "People often mistake your natural independence for coldness or arrogance. Because you focus so intensely on the goal, you may skip the 'social niceties' that others rely on for connection. You think you are being efficient; they think you are being dismissive.",
      subPoints: ["Directness perceived as aggression.", "Independence seen as aloofness.", "High standards labeled as critical."]
    },
    {
      question: "Decision-making pattern to be aware of",
      description: "You have a 'Ready, Fire, Aim' approach. While your speed is a superpower, you often make high-stakes choices based on temporary adrenaline. You decide first and look for the facts later, which can lead to expensive or time-consuming pivots down the road.",
      subPoints: ["Impulsive 'first-thought' bias.", "Ignoring long-term consequences.", "Decision fatigue from over-control."]
    },
    {
      question: "What drains your energy faster",
      description: "Nothing kills your vibration faster than bureaucracy and slow-moving environments. Being forced to wait for someone else's permission or following a repetitive, uninspired routine acts like a leak in your battery. You need constant movement and 'newness' to stay charged.",
      subPoints: ["Endless, unproductive meetings.", "Repetitive administrative tasks.", "Indecisive people around you."]
    },
    {
      question: "Practical remedies to balance this number",
      description: "To ground your high-voltage energy, you must learn the art of 'Strategic Silence.' Balancing your active Sun energy with grounding Earth practices will allow you to lead for the long haul without burning your own circuits out.",
      subPoints: ["Delegate three small tasks daily.", "Practice 5 minutes of stillness.", "Use Red Jasper for grounding."]
    }
  ],
  2: [
    {
      question: "One habit blocking your growth",
      description: "Your tendency to over-compromise to maintain peace often stalls your personal progress. You might find yourself saying 'yes' to others' dreams while your own goals sit on the sidelines. This fear of causing 'ripples' in the water keeps you in a safe but stagnant harbor.",
      subPoints: ["Avoiding difficult conversations.", "Putting others' needs before your own.", "Hesitating to take the lead."]
    },
    {
      question: "Inner conflict you may face quietly",
      description: "You live in a constant tug-of-war between your deep need for companionship and your emerging desire for personal identity. You fear that if you stand up for yourself, you will lose the very connections that feed your soul, leading to a quiet internal resentment.",
      subPoints: ["Harmony vs. Honest expression.", "Sensitivity vs. Emotional armor.", "Giving vs. Feeling drained."]
    },
    {
      question: "Why you feel misunderstood at times",
      description: "Others may see your gentleness as a lack of ambition or your caution as indecisiveness. In a world that prizes loud voices, your subtle and diplomatic approach is often overlooked or taken for granted, leading you to feel invisible even when you are the 'glue' holding things together.",
      subPoints: ["Quietness seen as weakness.", "Diplomacy mistaken for lack of opinion.", "Patience viewed as passivity."]
    },
    {
      question: "Decision-making pattern to be aware of",
      description: "You tend to seek 'consensus' before making a move. While this makes you a great team player, it often paralyzes your personal choices. You wait for everyone to be happy with your decision, which—ironically—results in nobody being fully satisfied, including you.",
      subPoints: ["Paralysis by over-analysis.", "Seeking external validation.", "Ignoring your own internal gut."]
    },
    {
      question: "What drains your energy faster",
      description: "Conflict-heavy environments and loud, aggressive personalities act like toxic noise to your system. You absorb the emotional stress of people around you, and if there is discord in your home or workplace, you will find it physically impossible to focus or feel energized.",
      subPoints: ["Unresolved arguments.", "Chaos and cluttered spaces.", "Emotional vampires in your circle."]
    },
    {
      question: "Practical remedies to balance this number",
      description: "To stay balanced, you must build 'Emotional Boundaries.' Learning that 'No' is a complete sentence will preserve your life force. Using soft, cooling energies will help you remain the peace-bringer without losing your own spark.",
      subPoints: ["Daily digital detox for 1 hour.", "Express one 'hard truth' weekly.", "Use Moonstone for intuition."]
    }
  ],
  3: [
    {
      question: "One habit blocking your growth",
      description: "Your greatest strength—multitasking and creativity—can be your greatest block if not channeled. You tend to start many high-energy projects but lose interest when the 'fun' part ends and the 'work' part begins. This leaves a trail of unfinished masterpieces that weigh down your energy.",
      subPoints: ["Scattering energy too thin.", "Chasing the 'shiny new object'.", "Avoiding routine and structure."]
    },
    {
      question: "Inner conflict you may face quietly",
      description: "You often hide your deeper struggles behind a mask of humor and optimism. There is a secret fear that if people saw your sadness or your 'boring' side, they would stop being attracted to your light. You feel a self-imposed pressure to always be the 'life of the party'.",
      subPoints: ["Public joy vs. Private gloom.", "Creativity vs. Financial fear.", "Expressiveness vs. Being 'too much'."]
    },
    {
      question: "Why you feel misunderstood at times",
      description: "Because you are so expressive and energetic, people sometimes fail to take your deep intellectual or spiritual side seriously. They see the 'performer' but miss the 'philosopher'. You feel like a deep ocean being treated like a shallow pond.",
      subPoints: ["Labeled as 'superficial'.", "Humor mistaken for lack of depth.", "Energy seen as 'attention-seeking'."]
    },
    {
      question: "Decision-making pattern to be aware of",
      description: "You decide based on 'how it feels' in the moment of excitement. While intuition is good, you often ignore the practical math or the logistical reality. You buy the ticket before checking if you're free, trusting that 'it will all work out'—which creates avoidable stress.",
      subPoints: ["Optimism bias in risk-taking.", "Ignoring the 'fine print'.", "Impulse buying/commitment."]
    },
    {
      question: "What drains your energy faster",
      description: "Isolation and boring, repetitive work are your energy killers. If you are stuck in a place where your voice isn't heard or where you can't be creative, your vibration drops rapidly. Being around 'Debbie Downers' who criticize your big ideas also drains you instantly.",
      subPoints: ["Silence and lack of feedback.", "Overly serious personalities.", "Repetitive data entry tasks."]
    },
    {
      question: "Practical remedies to balance this number",
      description: "To stay grounded, you need 'Creative Discipline.' Setting a timer for your focus work and finishing one thing before starting the next will manifest your dreams into reality. Grounding your voice through writing can also help clear mental clutter.",
      subPoints: ["Finish-one-Task-a-Day rule.", "Journaling to vent emotions.", "Use Citrine for focused joy."]
    }
  ],
  4: [
    {
      question: "One habit blocking your growth",
      description: "Your absolute need for 'the plan' can make you rigid. You often miss out on spontaneous opportunities because they weren't in your spreadsheet. This 'stay within the lines' habit creates a ceiling on your growth that doesn't need to be there.",
      subPoints: ["Over-planning for every scenario.", "Resisting necessary changes.", "Working too hard for too little."]
    },
    {
      question: "Inner conflict you may face quietly",
      description: "You battle between your need for total security and a hidden urge to throw it all away and be free. You pride yourself on being the 'stable one,' but you often resent the weight of that responsibility, wondering who is looking out for you while you look out for everyone else.",
      subPoints: ["Duty vs. Hidden desire for chaos.", "Frugality vs. Wanting luxury.", "Stability vs. Feeling 'stuck'."]
    },
    {
      question: "Why you feel misunderstood at times",
      description: "Your focus on facts and practicality can come across as boring or pessimistic to more 'airy' types. You think you are being realistic; they think you are killing the vibe. You feel frustrated when people prioritize feelings over the evidence right in front of them.",
      subPoints: ["Seen as 'too serious'.", "Practicality labeled as 'cold'.", "Directness seen as stubbornness."]
    },
    {
      question: "Decision-making pattern to be aware of",
      description: "You take a long time to decide because you need all the data first. While this prevents mistakes, it often leads to 'lost timing.' You wait so long to make sure the bridge is safe that the parade has already passed by. You over-calculate the risk and under-calculate the reward.",
      subPoints: ["Analysis paralysis.", "Focusing only on the negatives.", "Fear of 'wrong' decisions."]
    },
    {
      question: "What drains your energy faster",
      description: "Uncertainty and lack of structure are your primary drains. Working for a disorganized boss or living in a messy house causes you literal physical fatigue. People who break promises or 'wing it' without a plan will exhaust your patience and your energy.",
      subPoints: ["Last-minute plan changes.", "Laziness in others.", "Disorganized environments."]
    },
    {
      question: "Practical remedies to balance this number",
      description: "You must learn 'Strategic Flexibility.' Adding a 'wild card' hour to your week where you do something unplanned will break your rigidity. Grounding yourself in nature—not for work, but for beauty—will remind you that life isn't just a structure to be built.",
      subPoints: ["Do one unplanned thing weekly.", "Physical stretches for mobility.", "Use Tiger's Eye for focus."]
    }
  ],
  5: [
    {
      question: "One habit blocking your growth",
      description: "Your love for variety often leads to 'energy leakage.' You jump from one interest to another so quickly that you never reach the 'expert' level where the real rewards are. Chasing freedom often leads you into a cage of endless beginnings without any meaningful endings.",
      subPoints: ["Constant 're-starting'.", "Avoiding deep commitments.", "Scattering focus and funds."]
    },
    {
      question: "Inner conflict you may face quietly",
      description: "You struggle with the fear of being 'trapped' vs. the fear of being 'alone.' You value your independence so much that you often push away the very stability and relationships you secretly crave. You worry that if you settle down, the 'real' adventure will start without you.",
      subPoints: ["Freedom vs. Loneliness.", "Adventure vs. Security.", "Dopamine hits vs. Long-term joy."]
    },
    {
      question: "Why you feel misunderstood at times",
      description: "People often label you as 'unreliable' or 'flaky' because you change your mind so often. They don't see the internal library of knowledge you are collecting; they just see the outward restlessness. You feel misunderstood because your 'instability' is actually your way of learning.",
      subPoints: ["Curiosity seen as lack of focus.", "Adaptability labeled as flakiness.", "Boredom mistaken for lack of care."]
    },
    {
      question: "Decision-making pattern to be aware of",
      description: "You decide based on 'variety.' If a choice feels new and exciting, you take it, regardless of whether it's good for you. You often make 'escape' decisions—choosing a new path just to get away from a current one that feels slightly too predictable.",
      subPoints: ["Deciding based on boredom.", "Impulse travel/quit decisions.", "Ignoring historical mistakes."]
    },
    {
      question: "What drains your energy faster",
      description: "Repetition and confinement are your kryptonite. A 9-to-5 desk job without any window or variation will drain your life force in weeks. Being around 'small-minded' people who only talk about the same old things will also make you feel physically heavy and tired.",
      subPoints: ["Rules that make no sense.", "Stagnant, unchanging air.", "Restrictive schedules."]
    },
    {
      question: "Practical remedies to balance this number",
      description: "You need 'Anchored Freedom.' Establish one or two non-negotiable daily habits (like a morning ritual) to provide a spine for your changing days. This will allow you to explore the world without getting lost in the wind. FOCUS (Follow One Course Until Successful).",
      subPoints: ["Morning grounding routine.", "Deep-dive into ONE topic.", "Use Aquamarine for calm flow."]
    }
  ],
  6: [
    {
      question: "One habit blocking your growth",
      description: "Your 'Super-Rescuer' complex is your biggest block. You spend so much energy fixing other people's problems that you have nothing left for your own elevation. You subconsciously believe that if you stop helping, you will lose your value, which keeps you in a cycle of emotional exhaustion.",
      subPoints: ["Unsolicited 'fixing' of others.", "Taking on others' karma.", "Ignoring self-care for service."]
    },
    {
      question: "Inner conflict you may face quietly",
      description: "You battle with the 'Perfectionist vs. The Human.' You have an idealized vision of how your family, home, and life 'should' look, and when reality falls short, you feel like a failure. You quietly judge yourself for not being the perfect provider or the perfect partner 24/7.",
      subPoints: ["Idealism vs. Messy reality.", "Responsibility vs. Resentment.", "Self-sacrifice vs. Hidden needs."]
    },
    {
      question: "Why you feel misunderstood at times",
      description: "Your genuine desire to help can be perceived as 'meddling' or 'controlling' by others. You think you are showing love; they think you are overstepping boundaries. You feel hurt when your 'advice' isn't taken, feeling that your care has been rejected.",
      subPoints: ["Care mistaken for control.", "Help seen as interference.", "Reliability taken for granted."]
    },
    {
      question: "Decision-making pattern to be aware of",
      description: "You make decisions based on 'The Group.' You ask: 'What will my family think?' or 'Will this keep the peace?' rather than 'What do I actually want?' You often make 'Self-Sacrifice' decisions that buy harmony today but create deep resentment in your soul five years from now.",
      subPoints: ["People-pleasing choices.", "Guilt-based decision making.", "Choosing the 'safe' family path."]
    },
    {
      question: "What drains your energy faster",
      description: "Injustice and ingratitude are your energy leeches. If you feel that your hard work isn't being appreciated, or if you see someone being treated unfairly, it will bother you to the point of physical illness. Cluttered, unharmonious homes also drain your essence.",
      subPoints: ["Arguments in the home.", "Entitled people around you.", "Ugly or discordant spaces."]
    },
    {
      question: "Practical remedies to balance this number",
      description: "To stay balanced, you must learn the 'Art of Detachment.' Helping people is your gift, but you must learn to give 'with an open hand'—without needing a specific outcome or thanks. Nurturing your own 'Inner Child' is as important as nurturing your family.",
      subPoints: ["Set one firm 'Me' hour daily.", "Wait for a 'request' before helping.", "Use Rose Quartz for self-love."]
    }
  ],
  7: [
    {
      question: "One habit blocking your growth",
      description: "Your 'Lone Wolf' habit often turns into isolation. You wait until you have the 'perfect' answer before sharing anything, which prevents you from getting the real-world feedback you need to grow. You often over-intellectualize emotions, which keeps you disconnected from the heart of the matter.",
      subPoints: ["Hiding until you're 'perfect'.", "Skepticism that turns into cynicism.", "Over-analyzing simple situations."]
    },
    {
      question: "Inner conflict you may face quietly",
      description: "You are torn between your need for deep, spiritual truth and your sharp, scientific logic. You often feel like you don't 'fit in' either world fully. There is a secret fear that if you actually get close to people, they will find your inner world too strange or too intense.",
      subPoints: ["Logic vs. Intuition.", "Need for people vs. Love for solitude.", "Faith vs. Hard evidence."]
    },
    {
      question: "Why you feel misunderstood at times",
      description: "Others often see you as 'mysterious,' 'aloof,' or even 'creepy' because you are so observant and quiet. They don't realize you are just processing data; they think you are judging them. You feel misunderstood because you value 'depth' in a world that seems obsessed with 'noise'.",
      subPoints: ["Quietness seen as hiding something.", "Depth labeled as 'eccentricity'.", "Observation seen as judgment."]
    },
    {
      question: "Decision-making pattern to be aware of",
      description: "You make decisions based on 'The Hidden Why.' You won't move until you understand the root cause. This leads to massive delays in action. You also tend to make decisions in total isolation, ignoring practical advice from others who might have a more 'human' perspective on the situation.",
      subPoints: ["Excessive data collection.", "Ignoring 'emotional' variables.", "Deciding without outside input."]
    },
    {
      question: "What drains your energy faster",
      description: "Shallow conversations and loud, crowded environments will exhaust you in minutes. Being forced to 'small talk' at a party is more tiring for you than completing a 12-hour research project. High-pressure deadlines that require quick, shallow thinking also drain your soul.",
      subPoints: ["Small talk and gossip.", "Bright lights and constant noise.", "Shallow, fast-paced work."]
    },
    {
      question: "Practical remedies to balance this number",
      description: "You need 'Grounded Spirituality.' Spend time in nature to bring your high-vibration thoughts down into your body. Learning to share your 'works in progress' with one trusted person will break the cycle of isolation and help you manifest your wisdom faster.",
      subPoints: ["Share one 'rough draft' weekly.", "Daily grounding walk in silence.", "Use Amethyst for mental clarity."]
    }
  ],
  8: [
    {
      question: "One habit blocking your growth",
      description: "Your 'All or Nothing' mentality is your biggest hurdle. You often push yourself and everyone around you too hard, forgetting that 'sustainable growth' is better than a 'flash boom.' You tend to value status and material wins over personal health and emotional connection.",
      subPoints: ["Workaholism as a badge of honor.", "Judging others by their 'output'.", "Reluctance to show vulnerability."]
    },
    {
      question: "Inner conflict you may face quietly",
      description: "You battle with 'Power vs. Integrity.' You have a deep drive for success, but you often worry that to get to the top, you might have to compromise your soul. There is also a quiet fear of failure that drives you to over-control every aspect of your life to avoid a 'downward' move.",
      subPoints: ["Success vs. Spiritual peace.", "Control vs. Trust.", "Authority vs. Feeling like a servant."]
    },
    {
      question: "Why you feel misunderstood at times",
      description: "People often see you as 'power-hungry' or 'intimidating.' They don't see the massive weight of responsibility you carry or your desire to provide for everyone. You feel misunderstood because your 'boss' persona is actually just your way of ensuring survival and abundance for the whole team.",
      subPoints: ["Authority seen as arrogance.", "Drive mistaken for greed.", "Strength labeled as coldness."]
    },
    {
      question: "Decision-making pattern to be aware of",
      description: "You make decisions based on 'Leverage.' You ask: 'Will this increase my power or my profit?' while sometimes ignoring the 'heart' cost. You also tend to make decisions for others without their consent, believing that since you see the 'big picture,' you know what's best for them.",
      subPoints: ["Goal-only focused choices.", "Deciding for others (Over-reach).", "High-risk gambling on outcomes."]
    },
    {
      question: "What drains your energy faster",
      description: "Inefficiency and 'victim mentalities' drain you instantly. If you are around people who complain without taking action, it makes you physically tired. Losing money or status—even a small amount—can cause a massive energetic drop because you tie your worth to your 'external empire'.",
      subPoints: ["Waste of time or resources.", "Incompetence in others.", "Feeling 'locked out' of control."]
    },
    {
      question: "Practical remedies to balance this number",
      description: "You need 'Conscious Abundance.' Practice gratitude for what you *have* to shift out of the 'not enough' trap. Balancing your material ambition with selfless service will create a 'Karmic Loop' that brings even more success your way. Connect with your heart daily.",
      subPoints: ["Daily gratitude for 3 things.", "Weekly act of anonymous charity.", "Use Citrine for ethical wealth."]
    }
  ],
  9: [
    {
      question: "One habit blocking your growth",
      description: "Your habit of 'Holding on to the Past' blocks your future. Because you feel so deeply, you often carry old grudges or 'idealized versions' of how things used to be. This heavy emotional backpack prevents you from stepping into the new cycles that are waiting for you.",
      subPoints: ["Ruminating on 'could have beens'.", "Refusing to end dying cycles.", "Idealizing painful memories."]
    },
    {
      question: "Inner conflict you may face quietly",
      description: "You struggle with 'Global Love vs. Personal Needs.' You want to save the world, but you ignore your own bank account or your own health. There is a quiet war between your desire to be a selfless humanitarian and your very human need for personal boundaries and personal success.",
      subPoints: ["Universal love vs. Self-love.", "Giving vs. Receiving.", "Wisdom vs. Feeling world-weary."]
    },
    {
      question: "Why you feel misunderstood at times",
      description: "People often see you as 'intense,' 'dreamy,' or even 'unrealistic.' They think your big ideas for a better world are just talk, not realizing the deep pain you feel for humanity. You feel misunderstood because you are vibrating at a 'global' level while most people are stuck in 'local' drama.",
      subPoints: ["Vision labeled as 'fantasy'.", "Compassion seen as 'weakness'.", "Intensity mistaken for moodiness."]
    },
    {
      question: "Decision-making pattern to be aware of",
      description: "You make decisions based on 'The Ending.' You often wait until a situation is completely falling apart before you decide to move, causing unnecessary suffering. You also tend to make decisions based on 'Emotional Karma'—trying to heal something from the past through a current choice.",
      subPoints: ["Deciding too late (Wait & see).", "Martyrdom in choices.", "Ignoring the practical 'How-To'."]
    },
    {
      question: "What drains your energy faster",
      description: "Small-mindedness and selfishness drain you faster than anything else. If you are in an environment where people only care about themselves, you will feel a deep sense of despair. Cruelty in the news or in your direct environment will cause you actual heart-ache and physical exhaustion.",
      subPoints: ["Selfish behavior in others.", "Watching the world suffer.", "Being ignored by those you love."]
    },
    {
      question: "Practical remedies to balance this number",
      description: "You need 'Graceful Release.' Creating a weekly ritual of 'Letting Go'—whether physical (decluttering) or emotional (forgiveness)—will keep your energy light and fast. Focus on 'Quality over Quantity' in your service to others to prevent donor fatigue.",
      subPoints: ["Weekly decluttering session.", "Forgiveness meditation.", "Use Labradorite for protection."]
    }
  ]
};

const colorGuidancePool: Record<number, {
  luckyColors: { name: string; hex: string; description: string }[];
  challengingColors: { name: string; hex: string; description: string }[];
}> = {
  1: {
    luckyColors: [
      { name: "Royal Gold", hex: "#D4AF37", description: "This color resonates with your planetary ruler, the Sun. It enhances your natural leadership, attracts prosperity, and boosts your confidence during high-stakes decisions." },
      { name: "Ruby Red", hex: "#BE123C", description: "Red fuels your pioneering spirit. It provides the energetic 'spark' needed to initiate new projects and maintain your characteristic drive." },
      { name: "Copper Metallic", hex: "#B45309", description: "Grounds your solar energy, helping you materialize your visionary ideas without burning out." },
      { name: "Saffron", hex: "#F59E0B", description: "Increases your aura's visibility, making you a natural magnet for opportunities and high-level connections." },
      { name: "Electric Orange", hex: "#F97316", description: "Stimulates your vital force and keeps your creative enthusiasm high even during repetitive tasks." }
    ],
    challengingColors: [
      { name: "Midnight Black", hex: "#0F172A", description: "Black can act as an energetic drain for number 1s, absorbing your solar vitality and potentially leading to feelings of isolation." },
      { name: "Dusty Grey", hex: "#64748B", description: "Neutral greys can dampen your vibrant aura, making your bold ideas feel 'muted' to those around you." },
      { name: "Pasty Blue", hex: "#93C5FD", description: "Can cause a 'cooling' effect that slows down your momentum and introduces indecision." }
    ]
  },
  2: {
    luckyColors: [
      { name: "Moonlight White", hex: "#F8FAFC", description: "Reflecting the Moon's energy, white brings emotional clarity and heightens your natural intuition, helping you navigate complex relationships." },
      { name: "Pale Green", hex: "#86EFAC", description: "This shade of growth and harmony stabilizes your sensitive emotions and fosters a peaceful environment for creativity." },
      { name: "Silver", hex: "#CBD5E1", description: "Enhances your psychic abilities and artistic vision, acting as a mirror for your inner truth." },
      { name: "Pearl Grey", hex: "#E2E8F0", description: "A sophisticated tone that helps you maintain boundaries while remaining empathetic." },
      { name: "Cream", hex: "#FEF3C7", description: "Provides a soothing energetic 'cushion' that protects your nervous system from external stress." }
    ],
    challengingColors: [
      { name: "Fiery Red", hex: "#E11D48", description: "Aggressive reds can overstimulate your gentle system, causing emotional anxiety or unnecessary conflict." },
      { name: "Charcoal", hex: "#334155", description: "Dark, heavy tones can amplify your tendency toward moodiness or emotional withdrawal." },
      { name: "Deep Purple", hex: "#581C87", description: "Can make your already deep emotions feel 'too heavy', leading to a sense of overwhelm." }
    ]
  },
  3: {
    luckyColors: [
      { name: "Solar Yellow", hex: "#FACC15", description: "The color of Jupiter, yellow expands your creative expression and attracts social opportunities. It keeps your natural optimism radiating outward." },
      { name: "Saffron Orange", hex: "#F97316", description: "This vibrant tone stimulates your intellectual curiosity and helps you communicate your expansive ideas more effectively." },
      { name: "Light Lavender", hex: "#E879F9", description: "Balances your mental activity with spiritual insight, preventing your creative focus from becoming scattered." },
      { name: "Amber", hex: "#D97706", description: "A warm frequency that stabilizes your social energy and helps you command respect during public speaking." },
      { name: "Sky Blue", hex: "#7DD3FC", description: "Keeps your communication flowing smoothly and prevents your ideas from feeling 'blocked'." }
    ],
    challengingColors: [
      { name: "Deep Indigo", hex: "#3730A3", description: "Overly serious blues can restrict your playful energy, making you feel 'weighted down' by responsibilities." },
      { name: "Dark Purple", hex: "#581C87", description: "While spiritual, too much dark purple can lead to scattered focus and a sense of being 'lost in the clouds'." },
      { name: "Forest Green", hex: "#14532D", description: "Dark greens can dampen your expressive nature and make you focus too much on 'rules' rather than creativity." }
    ]
  },
  4: {
    luckyColors: [
      { name: "Electric Blue", hex: "#2563EB", description: "This high-frequency blue aligns with your revolutionary thinking. It provides the mental discipline needed to turn ideas into structures." },
      { name: "Silver Metallic", hex: "#94A3B8", description: "Metallic tones help ground your high-energy mind and provide a 'shield' against the chaos of the external world." },
      { name: "Khaki Green", hex: "#4D7C0F", description: "A grounding frequency that connects your practical work with the rhythm of the physical world." },
      { name: "Teal", hex: "#0D9488", description: "Helps you balance your unconventional views with the ability to communicate them in a way others understand." },
      { name: "Slate Grey", hex: "#334155", description: "Provides a stable energetic foundation for long-term planning and organizing massive projects." }
    ],
    challengingColors: [
      { name: "Kohl Black", hex: "#020617", description: "For number 4s, excessive black can create a 'wall' of rigidity, making it harder for you to adapt to necessary changes." },
      { name: "Dark Crimson", hex: "#991B1B", description: "Intense reds can trigger your inherent restlessness, leading to impulsive decisions that disrupt your foundations." },
      { name: "Bright Pink", hex: "#F472B6", description: "Can feel 'chaotic' to your structured aura, causing a minor breakdown in your mental order." }
    ]
  },
  5: {
    luckyColors: [
      { name: "Emerald Green", hex: "#10B981", description: "Mercury's favor falls on green. It stabilizes your fast-moving nervous system and helps you articulate thoughts with precision." },
      { name: "Turquoise", hex: "#06B6D4", description: "This color fosters your love for variety and travel, protecting your aura during adventurous pursuits." },
      { name: "Platinum Grey", hex: "#94A3B8", description: "Adds a touch of sophistication to your communication and helps you stay neutral during fast-paced changes." },
      { name: "Mint", hex: "#6EE7B7", description: "Refreshing your mental energy, mint helps you stay alert without becoming edgy or nervous." },
      { name: "Azure Blue", hex: "#3B82F6", description: "Enhances your ability to network and connect with diverse groups of people effortlessly." }
    ],
    challengingColors: [
      { name: "Deep Maroon", hex: "#7F1D1D", description: "Heavy, dark reds can stall your momentum and make you feel 'trapped' in routines." },
      { name: "Ebony", hex: "#000000", description: "Solid black can make your versatile personality feel 'one-dimensional' and restrict your communicative flow." },
      { name: "Dull Brown", hex: "#78350F", description: "Dampens your quick-witted nature and makes your ideas feel 'stagnant' or uninteresting." }
    ]
  },
  6: {
    luckyColors: [
      { name: "Rose Pink", hex: "#F472B6", description: "The vibration of Venus. Pink softens your environment and enhances your natural ability to nurture love." },
      { name: "Sky Blue", hex: "#38BDF8", description: "This calming tone prevents you from taking on too much emotional responsibility, reminding you to maintain personal boundaries." },
      { name: "Indigo", hex: "#4F46E5", description: "Helps you connect with higher wisdom while managing family and responsibility, adding depth to your care." },
      { name: "Apricot", hex: "#FB923C", description: "A warm, digestive color for your aura that helps you process the heavy emotions of others." },
      { name: "Soft Lilac", hex: "#C084FC", description: "Increases your sense of harmony and helps you find beauty in the most ordinary daily routines." }
    ],
    challengingColors: [
      { name: "Mustard Yellow", hex: "#A16207", description: "Dull yellows can trigger your critical side, causing you to focus on imperfections rather than beauty." },
      { name: "Glossy Black", hex: "#171717", description: "Can make your service-oriented heart feel 'guarded' or 'heavy,' leading to a sense of martyrdom." },
      { name: "Dark Olive", hex: "#365314", description: "Can introduce a vibration of 'obligation' rather than joyful service, draining your enthusiasm." }
    ]
  },
  7: {
    luckyColors: [
      { name: "Seafoam Green", hex: "#2DD4BF", description: "Resonates with your spiritual side. It provides a 'filter' for external noise, allowing you to access inner wisdom." },
      { name: "Pale Lavender", hex: "#C084FC", description: "Lavender heightens your meditative state and helps you decode the complex mysteries you are naturally drawn to." },
      { name: "White Smoke", hex: "#F5F5F5", description: "A clean, high-vibrational frequency that keeps your mind sharp and your aura transparent and protected." },
      { name: "Iridescent Blue", hex: "#60A5FA", description: "Connects your analytical mind with higher realms of inspiration and abstract thinking." },
      { name: "Deep Violet", hex: "#7C3AED", description: "A powerful tone for deep research and spiritual discovery, centering your psychic shield." }
    ],
    challengingColors: [
      { name: "Bright Orange", hex: "#EA580C", description: "Loud, extroverted colors like orange disrupt your need for quiet reflection and can cause significantly mental fatigue." },
      { name: "Crimson", hex: "#B91C1C", description: "Intense red can make your refined analytical mind feel 'rushed' or 'aggressive,' leading to frustration." },
      { name: "Yellow Ochre", hex: "#CA8A04", description: "Can create 'mental clutter' for a 7, making it difficult to find the silence you need to function." }
    ]
  },
  8: {
    luckyColors: [
      { name: "Royal Purple", hex: "#7E22CE", description: "The color of spiritual authority. It balances your material ambition with higher wisdom, ensuring your success serves a purpose." },
      { name: "Slate Blue", hex: "#475569", description: "Provides the calm, executive focus needed to manage large-scale resources without succumbing to stress." },
      { name: "Bronze Metallic", hex: "#92400E", description: "Reflects your material mastery and adds a vibration of long-term endurance and stability." },
      { name: "Black Charcoal", hex: "#334155", description: "For an 8, this is a power color that commands respect and provides a strong energetic shield in corporate battles." },
      { name: "Deep Emerald", hex: "#065F46", description: "Assists in manifesting financial abundance while keeping your growth balanced and ethical." }
    ],
    challengingColors: [
      { name: "Soft Pink", hex: "#FBCFE8", description: "Light, airy tones can make your powerful energy feel 'unfocused' or 'weak,' leading to missed opportunities." },
      { name: "Pale Yellow", hex: "#FEF08A", description: "Can create a sense of 'instability' in your naturally grounded and authoritative vibration." },
      { name: "Bright Red", hex: "#EF4444", description: "Too much direct red can cause your ambition to turn into aggression, harming your professional relationships." }
    ]
  },
  9: {
    luckyColors: [
      { name: "Coral Pink", hex: "#FB7185", description: "A balanced Mars vibration. It fuels your humanitarian work with compassion, ensuring actions are driven by love." },
      { name: "Ivory White", hex: "#F8F8F8", description: "Symbolizes the 'completion' of your cycle. It brings peace and the ability to let go of the past with grace." },
      { name: "Deep Magenta", hex: "#BE185D", description: "A healing frequency that helps you transform old pain into wisdom and global service." },
      { name: "Terra Cotta", hex: "#C2410C", description: "Grounds your lofty ideals into practical earthly action, helping you finish what you start." },
      { name: "Old Gold", hex: "#A16207", description: "The vibration of the 'elder', providing a wise and compassionate aura that naturally guides others." }
    ],
    challengingColors: [
      { name: "Deep Tan", hex: "#92400E", description: "Earthy, 'stale' tones can make you feel 'stuck' in old patterns, preventing universal transformation." },
      { name: "Industrial Grey", hex: "#4B5563", description: "Disconnected from your vast vision, grey can make your life feel 'small' and restrict your reach." },
      { name: "Acid Green", hex: "#84CC16", description: "This artificial-feeling frequency can clash with your natural, organic vibration of global completion." }
    ]
  }
};

// --- FINAL READING LOGIC ---

// --- COSMIC INSIGHT POOL (FOR HERO QUOTE) ---
const cosmicInsightPool: Record<number, string[]> = {
  1: [
    "You are a natural-born pioneer, destined to lead with independent courage. Your mission is to manifest unique ideas that redefine the status quo.",
    "The vibration of creation runs deep in your aura. You possess the raw willpower to turn a solitary vision into a tangible reality."
  ],
  2: [
    "Your strength lies in the invisible power of harmony and diplomacy. You are the bridge-builder who heals divides with empathy and intuitive grace.",
    "You possess an ethereal sensitivity to the needs of others. Your path is one of partnership, creating balance in a world of extremes."
  ],
  3: [
    "Your soul is a beacon of creative expression and joy. You are here to inspire others through the magic of your words, art, and vibrant social energy.",
    "The cosmic frequency of celebration flows through you. Your mission is to lift the collective spirit through pure, unadulterated self-expression."
  ],
  4: [
    "You are the master architect of the material realm. Your ability to build lasting foundations through discipline and order is a sacred cosmic gift.",
    "Your vibration is one of stability and profound methodical strength. You turn chaotic possibilities into grounded, reliable structures for all to benefit from."
  ],
  5: [
    "You are a catalyst for change and a fearless seeker of freedom. Your path is a whirlwind of variety, travel, and the expansion of the human experience.",
    "A versatile spirit, you thrive on the unpredictable rhythms of life. Your cosmic signature is one of adaptability and the pursuit of ultimate sensory truth."
  ],
  6: [
    "Your heart vibrates with the pure frequency of cosmic responsibility and care. You are the ultimate nurturer, creating sanctuary for all who cross your path.",
    "Love is your strongest ally. Your mission is to harmonize your surroundings through service, devotion, and the pursuit of domestic and artistic beauty."
  ],
  7: [
    "You are an ancient seeker of hidden truths and spiritual wisdom. Your path is an inward journey to decode the mysteries of the universe through analysis and faith.",
    "Silence is your sanctuary and introspection is your tool. Your cosmic signature suggests a profound intuitive connection to the unseen realms of knowledge."
  ],
  8: [
    "You are the master of material manifestation and executive power. Your path demands that you balance worldly success with the spiritual law of cause and effect.",
    "Your karmic signature is one of abundance and authority. You possess the endurance to build empires that stand the test of time and moral integrity."
  ],
  9: [
    "Yours is the vibration of the humanitarian who sees no borders. You are here to complete cycles of growth and lead the world with selfless, universal love.",
    "A bridge between the old and the new, your soul is ready for transformation. Your cosmic mission is to heal the collective through grace, art, and endings that spark new beginnings."
  ],
  11: [
    "You are an intuitive lightning rod, bridging the gap between higher realms and earthly reality. Your presence alone acts as a catalyst for spiritual awakening.",
    "Your cosmic signature hums with high-voltage inspiration. You are the master visionary who sees the infinite potential in the most mundane moments of human life."
  ],
  22: [
    "You are the Master Builder of the new age, possessing both the vision of a 11 and the practical discipline of a 4. Your dreams are blueprints for a better world.",
    "Your spiritual resonance allows you to manifest massive positive change. You don't just dream of a better future—you have the cosmic authority to actually build it."
  ],
  33: [
    "You are the Avatar of selfless service and unconditional love. Your vibration is that of the Master Teacher, healing the world through sheer compassionate presence.",
    "The highest frequency of nurturance flows through you. Your path is one of ultimate emotional responsibility, acting as a spiritual guardian for all of humanity."
  ]
};

export interface NumerologyReading {
  name: string;
  dob: Date;
  lifePathNumber: number;
  driverNumber: number;
  lifePathTraits: { title: string; description: string; strengths: string[]; tendencies: string[] };
  expressionNumber: number;
  expressionTraits: string;
  soulUrgeNumber: number;
  soulUrgeTraits: string;
  personalityNumber: number;
  personalityTraits: string;
  luckyNumbers: number[];
  luckyColor: { name: string; hex: string; line: string };
  colorGuidance: {
    luckyColors: { name: string; hex: string; description: string }[];
    challengingColors: { name: string; hex: string; description: string }[];
  };
  friendlyNumbers: number[];
  enemyNumbers: number[];
  karmicLaw: { title: string; desc: string };
  remedies: { habit: string; color: string; bestDay: string; quickTip: string; details: string[] };
  growthBlueprint: { para: string; points: string[] };
  guidanceModule: { para: string; points: string[] };
  careerModule: { para: string; points: string[] };
  emotionsModule: { para: string; points: string[] };
  decisionModule: { para: string; points: string[] };
  relationshipModule: { para: string; points: string[] };
  premiumInsights: { question: string; description: string; subPoints: string[] }[];
  whatThisMeans: string;
  quickInsight: string;
  cosmicInsight: string;
  cosmicFrequency: { mantra: string; instruction: string };
}

export function generateReading(name: string, dob: Date): NumerologyReading {
  const lp = calculateLifePathNumber(dob);
  const driver = calculateDriverNumber(dob);
  const exp = calculateExpressionNumber(name);
  const soul = calculateSoulUrgeNumber(name);
  const personality = calculatePersonalityNumber(name);
  const seed = lp + driver + exp;

  const freeReport = generateFreeReportFromDob(dob);
  const getPoolItem = (pool: Record<number, { para: string; points: string[] }>, num: number) => pool[num] || pool[9];

  const lpKey = lp > 9 ? reduceToSingleDigit(lp) : lp;

  // Custom Selection Logic for Colors (3-5 supportive, 2-3 challenging)
  const colorData = colorGuidancePool[lpKey] || colorGuidancePool[9];
  const selectBySeed = (pool: any[], min: number, max: number) => {
    const count = min + (seed % (max - min + 1));
    const shuffled = [...pool].sort((a, b) => {
      const valA = (a.name.length * seed) % 100;
      const valB = (b.name.length * seed) % 100;
      return valA - valB;
    });
    return shuffled.slice(0, count);
  };

  return {
    name, dob, lifePathNumber: lp,
    driverNumber: driver,
    lifePathTraits: getLifePathTraits(lp),
    expressionNumber: exp, expressionTraits: getExpressionTraits(exp),
    soulUrgeNumber: soul, soulUrgeTraits: getSoulUrgeTraits(soul),
    personalityNumber: personality, personalityTraits: getPersonalityTraits(personality),
    luckyNumbers: getLuckyNumbers(lp, driver, exp, soul, seed),
    luckyColor: { ...getLuckyColor(lp), line: freeReport.luckyColor.line },
    colorGuidance: {
      luckyColors: selectBySeed(colorData.luckyColors, 3, 5),
      challengingColors: selectBySeed(colorData.challengingColors, 2, 3)
    },
    friendlyNumbers: getFriendlyNumbers(lp),
    enemyNumbers: getEnemyNumbers(lp),
    karmicLaw: getKarmicLaw(lp),
    remedies: (function () {
      const key = lp > 9 ? String(reduceToSingleDigit(lp)) : String(lp);
      const baseRemedy = remediesData[key] || remediesData["1"];
      const ap = getShuffledItem(advicePool, seed);
      return { ...baseRemedy, habit: `${ap} ${baseRemedy.habit.toLowerCase()}` };
    })(),
    growthBlueprint: getPoolItem(growthBlueprintPool, lpKey),
    guidanceModule: getPoolItem(guideModulePool, lpKey),
    careerModule: getPoolItem(careerModulePool, lpKey),
    emotionsModule: getPoolItem(emotionsModulePool, lpKey),
    decisionModule: getPoolItem(decisionModulePool, lpKey),
    relationshipModule: getPoolItem(relationshipModulePool, lpKey),
    premiumInsights: premiumInsightsPool[lpKey] || premiumInsightsPool[9],
    whatThisMeans: freeReport.whatThisMeans,
    quickInsight: freeReport.quickInsight,
    cosmicInsight: (function () {
      const options = cosmicInsightPool[lp] || cosmicInsightPool[lpKey] || cosmicInsightPool[9];
      return options[seed % options.length];
    })(),
    cosmicFrequency: cosmicFrequencyPool[lp] || cosmicFrequencyPool[lpKey] || cosmicFrequencyPool[9]
  };
}

export interface FreeNumerologyReport {
  title: "Your Quick Numerology Snapshot";
  dob: string;
  lifePath: number;
  whatThisMeans: string;
  luckyColor: { name: string; hex: string; line: string };
  quickInsight: string;
  cta: string;
  disclaimer: string;
  text: string;
  premiumTeasers: { title: string; content: string }[];
  premiumModules: { title: string; description: string; icon: string }[];
  colorTeasers: {
    luckyTitle: string;
    challengingTitle: string;
    description: string;
  };
  numberTeasers: {
    friendlyTitle: string;
    growthTitle: string;
    description: string;
  };
  remedies: { habit: string; color: string; bestDay: string; quickTip: string; details: string[] };
  cosmicFrequency: { mantra: string; instruction: string };
}

function formatDobDDMMYYYY(dob: Date): string {
  const dd = String(dob.getDate()).padStart(2, "0");
  const mm = String(dob.getMonth() + 1).padStart(2, "0");
  const yyyy = String(dob.getFullYear());
  return `${dd}-${mm}-${yyyy}`;
}

function countWords(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

export function generateFreeReportFromDob(dob: Date): FreeNumerologyReport {
  const lp = calculateLifePathNumber(dob);
  const color = getLuckyColor(lp);
  const insights = premiumInsightsPool[lp > 9 ? reduceToSingleDigit(lp) : lp] || premiumInsightsPool[9];

  const whatThisMeansMap: Record<number, string> = {
    1: "You tend to be independent and action-oriented.",
    2: "You tend to be supportive and intuitive.",
    3: "You tend to be expressive and creative.",
    4: "You tend to be practical and disciplined.",
    5: "You tend to be adaptable and curious.",
    6: "You tend to be caring and responsible.",
    7: "You tend to be thoughtful and analytical.",
    8: "You tend to be ambitious and results-driven.",
    9: "You tend to be compassionate and broad-minded.",
    11: "You tend to be intuitive and inspiring.",
    22: "You tend to be practical and visionary.",
    33: "You tend to be nurturing and uplifting."
  };
  // Dynamic Seed-based Quick Insight Generation
  const day = dob.getDate();
  const month = dob.getMonth() + 1;
  const year = dob.getFullYear();
  const seed = (day * month * year) + lp;

  const actions = [
    "Hold", "Touch", "Visualize", "Scribe", "Speak", "Inhale the scent of",
    "Place your left hand on", "Expose your palms to", "Keep", "Face"
  ];
  const objects = [
    "Natural Sunlight", "a piece of Copper", "Blue Silk", "Running Water",
    "Natural Soil", "a Yellow Candle", "a Green Leaf", "a Silver Coin",
    "a White Flower", "a smooth River Stone", "a Sandalwood stick", "an Iron key"
  ];
  const rituals = [
    "for exactly 108 seconds", "at first light", "three consecutive times",
    "while facing the North-East", "under direct moonlight tonight", "to set your intention",
    "while breathing deeply", "with eyes closed", "at the start of your day"
  ];
  const benefits = [
    "to ground your electric aura", "to unlock dormant wealth flow", "to shield your inner peace",
    "to amplify your dormant intuition", "to clear stagnant mental fog", "to attract supportive cosmic allies",
    "to boost hidden confidence", "to reset your karmic frequency", "to ignite your creative spark"
  ];

  const getS = (arr: string[], s: number) => arr[s % arr.length];

  const quickInsight = `${getS(actions, seed)} ${getS(objects, seed + day)} ${getS(rituals, seed * month)} ${getS(benefits, seed + lp)}.`;
  return {
    title: "Your Quick Numerology Snapshot",
    dob: formatDobDDMMYYYY(dob),
    lifePath: lp,
    whatThisMeans: whatThisMeansMap[lp] || whatThisMeansMap[9],
    luckyColor: { name: color.name, hex: color.hex, line: "This color may help you feel more aligned." },
    quickInsight,
    cta: "Unlock full report.",
    disclaimer: "Your cosmic blueprint goes deeper than just numbers. This preview is just the beginning of your journey.",
    text: "Your numbers reveal a unique energetic signature that influences everything from your personality to your life's purpose.",
    premiumTeasers: insights.slice(0, 6).map(insight => ({
      title: insight.question,
      content: insight.description
    })),
    premiumModules: [
      {
        title: "Your Personal Growth Guidance",
        description: "A comprehensive analysis of your evolutionary path, detailing exactly how your energy expands through specific life challenges.",
        icon: "spellcheck"
      },
      {
        title: "Do This, Avoid This (Guidance)",
        description: "An essential list of actionable 'Power Moves' to accelerate your progress and 'Pitfalls' to avoid based on your numeric vibration.",
        icon: "lightbulb"
      },
      {
        title: "Work Style & Career Environment",
        description: "Identify the professional settings where you naturally thrive and the specific roles that align with your material manifestation power.",
        icon: "work"
      },
      {
        title: "Emotional Pattern Decoder",
        description: "Understand your subconscious emotional responses and learn how to manage your energy for greater internal peace and resilience.",
        icon: "psychology"
      },
      {
        title: "Decision-Making Guide",
        description: "Discover your optimal strategy for making choices that result in alignment rather than resistance, tailored to your Life Path.",
        icon: "gavel"
      },
      {
        title: "Relationship Communication Style",
        description: "Improve your connections by understanding how you naturally express love and how to better communicate with different vibrational types.",
        icon: "forum"
      },
    ],
    colorTeasers: {
      luckyTitle: "Why You Need This",
      challengingTitle: "Spectral Protection",
      description: "Colors are more than just visual—they are frequencies. The wrong tones can act as 'energy leaks' that drain your confidence and luck. Your personalized map reveals exactly which shades will amplify your unique vibration and which ones are currently sabotaging your aura."
    },
    numberTeasers: {
      friendlyTitle: "Friendly Numbers",
      growthTitle: "Challenging Numbers",
      description: "You are not an island. Certain numeric vibrations act as keys to unlock your path, while others create invisible resistance. Knowing your 'Friendly Allies' and 'Challenging Triggers' is the difference between swimming against the tide and riding the cosmic wave of success."
    },
    remedies: (function () {
      const key = lp > 9 ? String(reduceToSingleDigit(lp)) : String(lp);
      return remediesData[key] || remediesData["1"];
    })(),
    cosmicFrequency: cosmicFrequencyPool[lp] || cosmicFrequencyPool[lp > 9 ? reduceToSingleDigit(lp) : lp] || cosmicFrequencyPool[9]
  };
}


