// ═══════════════════════════════════════════════════════════════
// ADMIN-EDITABLE EVENT CONFIGURATION — SINGLE SOURCE OF TRUTH
// Event details supplied for the current CybiTradic Wano Fest setup.
// Unknown operational details remain TBA until the organizers provide them.
// ═══════════════════════════════════════════════════════════════

export interface ChallengeZone {
  zoneNumber: string;
  name: string;
  category: string;
  description: string;
  difficulty: number;
  points: number;
  tags: string[];
}

export interface MissionStage {
  step: string;
  title: string;
  jpTitle: string;
  subtitle: string;
  description: string;
  artwork: string;
  intel: string[];
}

export interface MapNode {
  id: string;
  name: string;
  code: string;
  type: string;
  x: number;
  y: number;
  difficulty: string;
  description: string;
}

export interface DetailedEventData {
  id: string;
  missionNumber: string;
  title: string;
  japaneseTitle: string;
  tagline: string;
  missionType: 'TECH' | 'NON-TECH' | 'E-SPORTS';
  category: string;
  status: 'OPEN' | 'LIVE' | 'COMPLETED';
  heroArtwork: string;
  fallbackArtwork: string;
  bounty: {
    prizePool: string;
    firstPlace: string;
    secondPlace: string;
    thirdPlace: string;
    currency: string;
    crewSize: string;
    battleTime: string;
    difficulty: string;
    mode: string;
  };
  story: {
    heading: string;
    subheading: string;
    paragraph1: string;
    paragraph2: string;
    challengeCore: string;
    loreQuote: string;
    loreAuthor: string;
  };
  battleMap: {
    title: string;
    description: string;
    nodes: MapNode[];
  };
  challengeZones: ChallengeZone[];
  stickyStory: MissionStage[];
  journey: {
    stepNumber: string;
    title: string;
    time: string;
    desc: string;
  }[];
  codeOfBattle: {
    number: string;
    rule: string;
    jpRule: string;
    detail: string;
  }[];
  treasure: {
    firstPrize: string;
    secondPrize: string;
    thirdPrize: string;
    extras: string[];
  };
  crewTiers: {
    type: 'SOLO' | 'DUO' | 'TRIO' | 'SQUAD';
    name: string;
    minMembers: number;
    maxMembers: number;
    silhouettesCount: number;
    recommendedSkills: string[];
    description: string;
  }[];
  liveStatus: {
    state: 'REGISTRATION_OPEN' | 'LIVE_BATTLE' | 'MISSION_COMPLETE';
    targetDate: string;
    currentRound: string;
    activeCrews: number;
    registeredCrews: number;
  };
  leaderboard: {
    rank: number;
    crewName: string;
    affiliation: string;
    score: number;
    badge: string;
  }[];
  venueLocations: {
    id: string;
    name: string;
    area: string;
    coords: { x: number; y: number };
    briefing: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
  coordinatorInfo?: {
    name: string;
    department: string;
    year: string;
    contact?: string;
    role?: string;
  }[];
  judgingRubric?: {
    criterion: string;
    marks?: number;
    percentage?: number;
    description: string;
  }[];
  submissionRequirements?: string[];
  importantNotes?: string[];
  registrationLink?: string;
}

const TBA = 'To Be Announced';

type EventSeed = {
  id: string;
  missionNumber: string;
  title: string;
  japaneseTitle: string;
  tagline: string;
  missionType: DetailedEventData['missionType'];
  category: string;
  image: string;
  crewSize: string;
  battleTime: string;
  mode: string;
  difficulty?: string;
  description: string;
  rules: string[];
  judging?: { criterion: string; marks: number; description: string }[];
  submission?: string[];
  notes?: string[];
  faq?: { question: string; answer: string }[];
  coordinator?: { name: string; department: string; year: string; role?: string; contact?: string }[];
  crewType?: 'SOLO' | 'DUO' | 'TRIO' | 'SQUAD';
  minMembers: number;
  maxMembers: number;
};

const makeDetail = (seed: EventSeed): DetailedEventData => {
  const crewType = seed.crewType || (seed.maxMembers === 1 ? 'SOLO' : seed.maxMembers === 2 ? 'DUO' : seed.maxMembers <= 3 ? 'TRIO' : 'SQUAD');
  const artwork = seed.image;
  const rules = seed.rules;

  return {
    id: seed.id,
    missionNumber: seed.missionNumber,
    title: seed.title,
    japaneseTitle: seed.japaneseTitle,
    tagline: seed.tagline,
    missionType: seed.missionType,
    category: seed.category,
    status: 'OPEN',
    heroArtwork: artwork,
    fallbackArtwork: artwork,
    bounty: {
      prizePool: TBA,
      firstPlace: TBA,
      secondPlace: TBA,
      thirdPlace: TBA,
      currency: 'INR',
      crewSize: seed.crewSize,
      battleTime: seed.battleTime,
      difficulty: seed.difficulty || 'GRAND LINE ★★★☆☆',
      mode: seed.mode,
    },
    story: {
      heading: `ENTER ${seed.title.toUpperCase()}`,
      subheading: seed.tagline,
      paragraph1: seed.description,
      paragraph2: 'All participants must follow the published rules, organizer instructions, event timings and submission requirements. Operational details marked TBA will be updated by the organizing committee.',
      challengeCore: rules[0] || 'Follow the event instructions and complete the challenge fairly.',
      loreQuote: 'Different crews. Different skills. One Grand Line.',
      loreAuthor: 'CybiTradic Wano Fest',
    },
    battleMap: {
      title: 'MISSION ROUTE',
      description: 'Follow the event journey from registration to final submission or performance.',
      nodes: [
        { id: `${seed.id}-1`, name: 'REGISTRATION', code: 'STEP 01', type: 'ENTRY', x: 12, y: 70, difficulty: 'NORMAL', description: 'Complete registration and follow the organizer instructions.' },
        { id: `${seed.id}-2`, name: 'CHALLENGE', code: 'STEP 02', type: 'MISSION', x: 40, y: 32, difficulty: 'HARD', description: rules[Math.min(1, rules.length - 1)] || 'Complete the main event challenge.' },
        { id: `${seed.id}-3`, name: 'SUBMISSION', code: 'STEP 03', type: 'SUBMIT', x: 70, y: 66, difficulty: 'HARD', description: seed.submission?.[0] || 'Submit the required output before the announced deadline.' },
        { id: `${seed.id}-4`, name: 'RESULTS', code: 'FINALS', type: 'RESULT', x: 92, y: 24, difficulty: 'LEGENDARY', description: 'Results will be announced by the organizing committee.' },
      ],
    },
    challengeZones: rules.slice(0, 4).map((rule, index) => ({
      zoneNumber: `0${index + 1}`,
      name: rule.length > 42 ? `${seed.title.toUpperCase()} RULE ${index + 1}` : rule.toUpperCase(),
      category: seed.category,
      description: rule,
      difficulty: Math.min(5, 2 + Math.floor(index / 2)),
      points: 25,
      tags: ['RULE', seed.missionType],
    })),
    stickyStory: [
      { step: '01', title: 'ASSEMBLE', jpTitle: '集結', subtitle: 'READY YOUR CREW', description: 'Register, report on time and prepare the required equipment or materials.', artwork, intel: ['Registration', 'Eligibility', 'Check-in'] },
      { step: '02', title: 'CHALLENGE', jpTitle: '挑戦', subtitle: 'FACE THE MISSION', description: seed.description, artwork, intel: ['Follow rules', 'Stay fair', 'Complete the task'] },
      { step: '03', title: 'CONQUER', jpTitle: '勝利', subtitle: 'SUBMIT & STAND TALL', description: 'Complete the event requirements and submit before the official deadline where applicable.', artwork, intel: ['Submission', 'Judging', 'Results'] },
    ],
    journey: [
      { stepNumber: '01', title: 'REGISTER', time: 'BEFORE EVENT', desc: 'Complete registration within the announced deadline.' },
      { stepNumber: '02', title: 'REPORT', time: 'CHECK-IN', desc: 'Report at the announced venue and time with required ID or materials.' },
      { stepNumber: '03', title: 'COMPETE', time: seed.battleTime, desc: 'Take part according to the event-specific rules.' },
      { stepNumber: '04', title: 'SUBMIT / FINISH', time: 'DEADLINE', desc: 'Submit the required output or complete the final round.' },
    ],
    codeOfBattle: rules.map((rule, index) => ({
      number: String(index + 1).padStart(2, '0'),
      rule: rule,
      jpRule: 'RULE',
      detail: rule,
    })),
    treasure: {
      firstPrize: TBA,
      secondPrize: TBA,
      thirdPrize: TBA,
      extras: ['Prize details will be announced by the organizing committee.'],
    },
    crewTiers: [{
      type: crewType,
      name: seed.maxMembers === 1 ? 'SOLO CREW' : `${seed.crewSize.toUpperCase()} CREW`,
      minMembers: seed.minMembers,
      maxMembers: seed.maxMembers,
      silhouettesCount: Math.min(4, Math.max(1, seed.maxMembers)),
      recommendedSkills: ['Focus', 'Creativity', 'Teamwork'],
      description: seed.crewSize,
    }],
    liveStatus: { state: 'REGISTRATION_OPEN', targetDate: '', currentRound: 'REGISTRATION OPEN', activeCrews: 0, registeredCrews: 0 },
    leaderboard: [],
    venueLocations: [{ id: 'venue-tba', name: 'TO BE ANNOUNCED', area: 'EVENT VENUE', coords: { x: 50, y: 40 }, briefing: 'The venue will be announced by the organizing committee.' }],
    faq: seed.faq || [
      { question: 'Who can participate?', answer: 'Registered college students who meet the event eligibility requirements can participate.' },
      { question: 'When is the venue announced?', answer: 'The venue and schedule will be announced by the organizing committee.' },
      { question: 'What happens if a rule is violated?', answer: 'The organizers may take action up to disqualification according to the published rules.' },
    ],
    coordinatorInfo: seed.coordinator,
    judgingRubric: seed.judging,
    submissionRequirements: seed.submission,
    importantNotes: seed.notes,
  };
};

const events: EventSeed[] = [
  {
    id: 'project-expo',
    missionNumber: 'EVENT 05',
    title: 'Project Expo',
    japaneseTitle: '創造の証 // BUILD INNOVATE INSPIRE',
    tagline: 'Build. Innovate. Inspire.',
    missionType: 'TECH',
    category: 'TECHNICAL — INNOVATION & PROTOTYPE',
    image: '/images/project_expo_banner.png',
    coordinator: [
      { name: 'JAYASRI', department: 'Cybersecurity', year: 'III', role: 'Project Expo Coordinator', contact: '9342481695' }
    ],
    crewSize: '2–4 Members',
    battleTime: 'Full Day Exhibition & Evaluation',
    mode: 'PROJECT SHOWCASE & DEMONSTRATION',
    minMembers: 2,
    maxMembers: 4,
    description: 'Project Expo is a technical innovation event where students can showcase their innovative projects, working prototypes, software applications, hardware solutions, AI systems, cybersecurity projects, IoT solutions, and emerging technology ideas.',
    rules: [
      'Each team must present one project.',
      'The project should be developed by the participating team.',
      'Participants must explain the problem being solved.',
      'Teams must explain their proposed solution and implementation.',
      'Teams must explain the technologies and tools used.',
      'Judges may ask technical questions about the project.',
      'Teams should demonstrate the working prototype whenever applicable.',
      'Participants must bring their own required hardware, components, and accessories.',
      'Projects must be safe and suitable for a college technical event.',
      "Plagiarism or falsely claiming another team's project is prohibited.",
      "Participants must not damage venue infrastructure or another team's project.",
      "Judges' decision regarding evaluation and results will be final."
    ],
    judging: [
      { criterion: 'Innovation & Originality', marks: 25, description: 'Uniqueness of idea and creative approach to problem solving (25%).' },
      { criterion: 'Technical Implementation', marks: 25, description: 'Architecture, code quality, hardware design, and tech complexity (25%).' },
      { criterion: 'Problem Solving', marks: 20, description: 'Effectiveness of the solution addressing the real-world issue (20%).' },
      { criterion: 'Real-World Impact', marks: 15, description: 'Practical viability, scalability, and societal impact (15%).' },
      { criterion: 'Presentation & Demonstration', marks: 15, description: 'Working prototype demo, clarity, and team communication (15%).' },
    ],
    submission: [
      'Artificial Intelligence & Machine Learning',
      'Cybersecurity & Network Defense',
      'Web & Mobile Applications',
      'IoT & Smart Systems',
      'Robotics & Automation',
      'Blockchain & Cloud Computing',
      'Data Science & Analytics',
      'Healthcare, Green Tech & FinTech',
    ],
    notes: [
      'Team Size: 2–4 Members per team.',
      'One project per team.',
      'All team members should be available during presentation/evaluation.',
      'Team members must be registered before the event.',
      'Team changes after registration are not allowed.',
      'Coordinator: JAYASRI • Phone: 9342481695',
    ],
  },
  {
    id: 'paper-presentation',
    missionNumber: 'EVENT 06',
    title: 'Paper Presentation',
    japaneseTitle: '叡智の探求 // PRESENT IDEAS CREATE IMPACT',
    tagline: 'Present Ideas • Create Impact',
    missionType: 'TECH',
    category: 'TECHNICAL — RESEARCH & PRESENTATION',
    image: '/images/paper_presentation_banner.png',
    coordinator: [
      { name: 'JANANI', department: 'Cybersecurity', year: 'III', role: 'Paper Presentation Coordinator', contact: '6385326280' }
    ],
    crewSize: '1–3 Members',
    battleTime: '10 Minutes (7 Mins Presentation + 3 Mins Q&A)',
    mode: 'SLIDE PRESENTATION & DEFENSE',
    minMembers: 1,
    maxMembers: 3,
    description: 'Paper Presentation is a technical presentation event where participants present innovative ideas, research concepts, emerging technologies, technical solutions, and problem-solving approaches through a professional presentation.',
    rules: [
      'The topic must be related to technology, innovation, research, or engineering.',
      'Participants must prepare their own presentation.',
      'Content should be original and technically relevant.',
      'Proper references must be provided wherever required.',
      'Participants must stay within the allotted time (7 min presentation + 3 min Q&A).',
      'Judges may ask technical questions after the presentation.',
      'Participants should be able to explain the content of their presentation.',
      'Plagiarism may result in disqualification.',
      'Participants should keep a backup copy of their presentation.',
      'Inappropriate or offensive content is not permitted.',
      'The final presentation submission format will be announced by the organizers.',
      "Judges' decision will be final."
    ],
    judging: [
      { criterion: 'Technical Knowledge', marks: 25, description: 'Depth of technical understanding and engineering concepts (25%).' },
      { criterion: 'Innovation & Originality', marks: 20, description: 'Novelty of approach and research freshness (20%).' },
      { criterion: 'Content Quality', marks: 20, description: 'Structure, methodology, and empirical evidence (20%).' },
      { criterion: 'Presentation Skills', marks: 20, description: 'Visual design of slides, vocal delivery, and timing (20%).' },
      { criterion: 'Q&A / Technical Understanding', marks: 15, description: 'Handling judges questions and defense of thesis (15%).' },
    ],
    submission: [
      'Structure: 1. Title | 2. Problem Statement | 3. Background | 4. Existing System',
      'Structure: 5. Proposed Idea | 6. Methodology | 7. Architecture | 8. Innovation',
      'Structure: 9. Applications | 10. Advantages | 11. Future Scope | 12. Conclusion | 13. References',
      'Timing: Presentation 7 Mins • Q&A 3 Mins • Total 10 Mins',
    ],
    notes: [
      'Team Size: 1–3 Members per team.',
      'One paper/presentation per team.',
      'All registered participants must be present during presentation.',
      'Team changes after registration are not allowed.',
      'Coordinator: JANANI • Phone: 6385326280',
    ],
  },
  {
    id: 'capture-the-flag', missionNumber: 'EVENT 01', title: 'Capture the Flag', japaneseTitle: '旗を奪え // CYBER MISSION',
    tagline: 'FIND • EXPLOIT • SOLVE • CAPTURE', missionType: 'TECH', category: 'TECHNICAL — CYBERSECURITY', image: '/images/capture_the_flag.png',
    coordinator: [
      { name: 'Subash', department: 'Cybersecurity', year: 'III' }
    ],
    crewSize: 'Team Size: To Be Announced', battleTime: 'To Be Announced', mode: 'CYBERSECURITY CHALLENGE', minMembers: 1, maxMembers: 4,
    description: 'A cyber security challenge focused on exploring, analyzing, decoding, exploiting and capturing flags through practical problem-solving.',
    rules: ['Rules & regulations will be announced by the organizing committee.'],
  },
  {
    id: 'coding-challenge', missionNumber: 'EVENT 02', title: 'Coding Challenge', japaneseTitle: '論理の戦い // CODE THE WAY',
    tagline: 'THINK • CODE • DEBUG • SUBMIT', missionType: 'TECH', category: 'TECHNICAL — PROGRAMMING', image: '/images/coding_challenge.png',
    coordinator: [
      { name: 'Janani', department: 'IT', year: 'III' }
    ],
    crewSize: 'Solo / Individual', battleTime: 'Round-Based Time Limit', mode: 'CODING CHALLENGE', minMembers: 1, maxMembers: 1,
    description: 'Solve the given coding problems under strict time limits. Winners are selected based on correctness, time and performance.',
    rules: ['All registered participants can participate.', 'Participants must carry their college ID card.', 'Participants must solve the given coding problems.', 'Only permitted programming languages can be used.', 'Copying code from other participants is not allowed.', 'Participants must follow the instructions given by coordinators.', 'Each round has a specified time limit and code must be submitted before the deadline.', 'Mobile phones and internet usage depend on the coordinators’ instructions.', 'Unfair practices may lead to disqualification.', 'The judges’ decision will be final.'],
    judging: [
      { criterion: 'Correctness', marks: 50, description: 'Correct solutions and test-case performance.' },
      { criterion: 'Time', marks: 25, description: 'Efficiency and submission time.' },
      { criterion: 'Performance', marks: 25, description: 'Overall solution performance and quality.' },
    ],
    submission: ['Submit code before the round deadline.', 'Use only the permitted programming languages.'],
  },
  {
    id: 'ai-prompt', missionNumber: 'EVENT 03', title: 'AI Prompt', japaneseTitle: '創造の言葉 // PROMPT THE POSSIBLE',
    tagline: 'IDEA • PROMPT • GENERATE • INNOVATE', missionType: 'TECH', category: 'TECHNICAL — AI', image: '/images/ai_prompt.png',
    coordinator: [
      { name: 'Dinakaran', department: 'IT', year: 'III' }
    ],
    crewSize: 'Solo / Individual', battleTime: 'To Be Announced', mode: 'PROMPT CHALLENGE', minMembers: 1, maxMembers: 1,
    description: 'A creative AI prompting challenge where participants turn ideas into useful outputs through clear, original and effective prompts.',
    rules: ['Rules & regulations will be announced by the organizing committee.'],
  },
  {
    id: 'ui-ux-challenge', missionNumber: 'EVENT 04', title: 'UI/UX Challenge', japaneseTitle: '設計の航海 // DESIGN BEYOND LIMITS',
    tagline: 'IDEAS • USERS • INTERFACES • IMPACT', missionType: 'TECH', category: 'TECHNICAL — UI/UX DESIGN', image: '/images/ui_ux_challenge.png',
    notes: ['Good design is invisible — users notice when it is missing, not when it is there.'],
    coordinator: [
      { name: 'Essakiraja', department: 'CSE', year: 'III' }
    ],
    crewSize: 'Solo / Individual', battleTime: 'To Be Announced', mode: 'DESIGN CHALLENGE', minMembers: 1, maxMembers: 1,
    description: 'Design a user-centered interface that turns a real problem into a clear, useful and engaging digital experience.',
    rules: ['Consistency — use clear, consistent fonts, colors, spacing and components throughout.', 'Visual hierarchy — size, weight and color should guide the eye to what matters most first.', 'Clarity over cleverness — if an interaction is hard to understand, simplify it.', 'Feedback — every action should show a visible response such as loading, error or success.', 'Contrast & readability — text should remain easy to read against the background.', 'Whitespace — give elements room to breathe and avoid cramming content edge to edge.', 'Familiar patterns — use recognizable navigation and interaction conventions.', 'Forgiving design — make mistakes easy to undo or recover from and confirm destructive actions.', 'Accessibility — consider color blindness, screen readers and keyboard-only navigation.', 'Test with real users — validate that the interface is understandable to new users.'],
  },
  {
    id: 'will-of-d', missionNumber: 'EVENT 05', title: 'Will of D', japaneseTitle: '意志の試練 // THE GRAND QUIZ',
    tagline: 'PRELIMS • AUDIO-VISUAL • RAPID FIRE • BUZZER FINALS', missionType: 'NON-TECH', category: 'NON-TECHNICAL — QUIZ', image: '/images/will_of_d_new.png',
    coordinator: [
      { name: 'Jayasri', department: 'Cybersecurity', year: 'III' }
    ],
    crewSize: 'Maximum 2 Members', battleTime: 'Round-Based', mode: 'PRELIMS → FINALS', minMembers: 1, maxMembers: 2,
    description: 'A multi-round quiz with a preliminary round followed by General Knowledge, Audio-Visual, Rapid Fire and Buzzer rounds as decided by the organizing committee.',
    rules: ['Participants must register within the specified deadline. Each team shall consist of a maximum of two members.', 'All registered teams will participate in a preliminary round; top-scoring teams qualify for subsequent rounds.', 'Qualified teams compete in General Knowledge, Audio-Visual, Rapid Fire and Buzzer rounds as decided by the organizing committee.', 'Marks are awarded for correct answers. Negative marking, if applicable, will be announced before the round.', 'In case of a tie, a tie-breaker round will be conducted.', 'Use of mobile phones, electronic devices, notes or external assistance is strictly prohibited.', 'Any form of malpractice may lead to disqualification.', 'The Quiz Master’s and organizing committee’s decision shall be final and binding.'],
    faq: [
      { question: 'How many members can be in a team?', answer: 'Each team can have a maximum of two members.' },
      { question: 'What happens after the preliminary round?', answer: 'Top-scoring teams qualify for the subsequent quiz rounds.' },
      { question: 'Are phones allowed?', answer: 'No. Mobile phones, electronic devices, notes and external assistance are prohibited.' },
    ],
  },
  {
    id: 'red-line-rush', missionNumber: 'EVENT 06', title: 'Red Line Rush', japaneseTitle: '赤い航路 // TREASURE HUNT',
    tagline: 'CLUES • TEAMWORK • STRATEGY • TREASURE', missionType: 'NON-TECH', category: 'NON-TECHNICAL — TREASURE HUNT', image: '/images/nikas_dance_arena_new.png',
    coordinator: [
      { name: 'Surya Mathavan', department: 'CSE', year: 'III' }
    ],
    crewSize: 'Exactly 4 Members', battleTime: 'Time Based', mode: 'CAMPUS TREASURE HUNT', minMembers: 4, maxMembers: 4,
    description: 'A team treasure hunt where crews follow clues in order, stay within boundaries, collect required proof and race to find the final treasure.',
    rules: ['Start together — everyone begins at the agreed starting point and time.', 'Follow the clues in order — do not skip ahead unless a clue specifically allows it.', 'Stay within the designated boundaries.', 'Do not move, damage or hide clues.', 'No outside help, internet assistance, hints from non-players or following another team unless allowed.', 'Respect off-limits areas and never enter locked, dangerous, private or prohibited spaces.', 'All 4 members should participate and solve the clues together; do not split unless organizers allow it.', 'Collect proof when required, such as a photo, recorded answer or specified item.', 'Hints may have a time penalty, for example 2 minutes per hint if announced.', 'The first team to correctly complete all clues and find the treasure wins.'],
    notes: ['Each team must have exactly 4 members.', 'Do not damage, hide or move clues.', 'The organizer may define the exact hint penalty before the event.'],
    crewType: 'SQUAD',
    faq: [
      { question: 'How many members are required?', answer: 'Exactly 4 members per team.' },
      { question: 'Can the team split up?', answer: 'No, unless the organizers specifically allow it.' },
      { question: 'Can teams use internet help?', answer: 'No outside help or internet assistance is allowed unless explicitly permitted.' },
    ],
  },
  {
    id: 'nikas-dance-arena', missionNumber: 'EVENT 07', title: "Nika's Dance Arena", japaneseTitle: '舞の海 // DANCE ARENA',
    tagline: 'MOVE • EXPRESS • INSPIRE • CONQUER', missionType: 'NON-TECH', category: 'NON-TECHNICAL — DANCE', image: '/images/red_line_rush_new.png',
    coordinator: [
      { name: 'Vishwa', department: 'Cybersecurity', year: 'II' },
      { name: 'Saathish Kambattam', department: 'CSE', year: 'III' }
    ],
    crewSize: 'Maximum 8–10 Participants', battleTime: '3–5 Minutes', mode: 'STAGE PERFORMANCE', minMembers: 1, maxMembers: 10,
    description: 'A cultural dance event open to registered college students, with styles such as Classical, Folk, Western, Contemporary, Bollywood, Freestyle and Fusion.',
    rules: ['The event is open to registered college students and participants must carry a valid college ID card.', 'Each college can register one team unless the symposium announces otherwise.', 'Maximum 8–10 participants per team.', 'Any permitted dance style may be performed: Classical, Folk, Western, Contemporary, Bollywood, Freestyle, Fusion or similar.', 'Performance time is 3–5 minutes. Exceeding the time limit may result in mark deduction.', 'Participants should report at least 30 minutes before their scheduled performance.', 'Final music track must be submitted in MP3 format before the event and a backup copy should be carried on a pen drive.', 'Costumes must be appropriate for a college cultural event. Vulgar, offensive or inappropriate content is prohibited.', 'Props require prior approval. Fire, liquids, powders, smoke-producing materials, sharp objects and hazardous props are prohibited.', 'Judges’ decision will be final.'],
    judging: [
      { criterion: 'Choreography & Creativity', marks: 20, description: 'Originality, choreography and creative interpretation.' },
      { criterion: 'Synchronization / Coordination', marks: 20, description: 'Team coordination and synchronization.' },
      { criterion: 'Rhythm & Musicality', marks: 15, description: 'Timing and musical interpretation.' },
      { criterion: 'Expression & Stage Presence', marks: 15, description: 'Expression and stage confidence.' },
      { criterion: 'Technique & Execution', marks: 15, description: 'Technical execution and control.' },
      { criterion: 'Costume & Overall Presentation', marks: 10, description: 'Appropriate costume and presentation.' },
      { criterion: 'Audience Engagement / Overall Impact', marks: 5, description: 'Overall impact.' },
    ],
    submission: ['Submit the final music track in MP3 format before the event.', 'Carry a backup copy of the submitted track.'],
  },
  {
    id: 'binks-rhythm', missionNumber: 'EVENT 08', title: "Bink's Rhythm", japaneseTitle: '歌の航海 // SING BEYOND BORDERS',
    tagline: 'SING • EXPRESS • INSPIRE • BELONG', missionType: 'NON-TECH', category: 'NON-TECHNICAL — SINGING', image: '/images/binks_rhythm_new.png',
    coordinator: [
      { name: 'Vishwa', department: 'Cybersecurity', year: 'II' },
      { name: 'Saathish Kambattam', department: 'CSE', year: 'III' }
    ],
    crewSize: 'Solo / Duet / Group', battleTime: 'Solo 3–5 min | Duet/Group 4–6 min', mode: 'LIVE VOCAL PERFORMANCE', minMembers: 1, maxMembers: 10,
    description: 'A singing competition with Solo, Duet and Group categories, judged on voice, pitch, rhythm, pronunciation, expression, song selection and stage presence.',
    rules: ['Open to registered college students; valid college ID is compulsory.', 'Categories may include Solo Singing, Duet Singing and Group Singing.', 'Solo performance time is 3–5 minutes; duet/group performance time is 4–6 minutes.', 'Songs may be in any Indian or foreign language subject to college guidelines.', 'Vulgar, offensive, hateful or inappropriate lyrics are not permitted.', 'Participants should perform the song themselves; pre-recorded vocals should not be used for live singing categories.', 'Karaoke/backing tracks may be allowed and must be submitted before the event.', 'Approved live instruments/accompanists may be allowed; maximum one accompanist for solo singing.', 'Participants should memorize lyrics; reading lyrics from a mobile phone during performance is not allowed unless organizers make an exception.', 'Judges’ decision will be final.'],
    judging: [
      { criterion: 'Voice Quality', marks: 20, description: 'Voice quality and control.' },
      { criterion: 'Pitch & Sur', marks: 20, description: 'Pitch accuracy and musicality.' },
      { criterion: 'Rhythm / Timing', marks: 15, description: 'Rhythmic accuracy and timing.' },
      { criterion: 'Pronunciation & Clarity', marks: 15, description: 'Clear pronunciation and diction.' },
      { criterion: 'Expression / Emotion', marks: 10, description: 'Emotional delivery.' },
      { criterion: 'Song Selection', marks: 10, description: 'Suitability of song choice.' },
      { criterion: 'Stage Presence', marks: 10, description: 'Confidence and presentation.' },
    ],
  },
  {
    id: 'pirate-portraits', missionNumber: 'EVENT 09', title: 'Pirate Portraits', japaneseTitle: '一枚の物語 // FRAMES BEYOND BORDERS',
    tagline: 'CLICK • EXPLORE • EXPRESS • INSPIRE', missionType: 'NON-TECH', category: 'NON-TECHNICAL — PHOTOGRAPHY', image: '/images/pirate_portraits.png',
    coordinator: [
      { name: 'Yokesh', department: 'AI & DS', year: 'II' },
      { name: 'Seeman', department: 'CSE', year: 'III' }
    ],
    crewSize: 'Solo', battleTime: 'Event Period', mode: 'PHOTOGRAPHY', minMembers: 1, maxMembers: 1,
    description: 'Capture moments, people, places and stories around the college event using a mobile phone or digital camera while following the originality and privacy rules.',
    rules: ['Eligibility: all registered college students can participate.', 'Participants must register before the event starts.', 'Photos must be related to the college event/fest.', 'Only original photographs taken by the participant are allowed.', 'Basic editing such as brightness, contrast and cropping is allowed; heavy manipulation is not allowed.', 'AI-generated or AI-created photographs are not allowed.', 'Participants may use a mobile phone or digital camera.', 'Each participant can submit a maximum of 3 photographs.', 'Submit photographs in JPG/JPEG format.', 'Downloaded or copied photographs will lead to disqualification.', 'Participants must obtain appropriate permission before photographing people, especially in sensitive situations.', 'Photos must be captured and submitted within the specified event time.', 'Submit through the announced submission method before the deadline.', 'Judges’ decision is final and binding; rule violations, plagiarism, inappropriate content or late submission may result in disqualification.'],
    judging: [
      { criterion: 'Creativity', marks: 20, description: 'Creative approach and storytelling.' },
      { criterion: 'Composition', marks: 20, description: 'Framing and visual balance.' },
      { criterion: 'Relevance to Theme', marks: 20, description: 'Connection to the college event/fest.' },
      { criterion: 'Technical Quality', marks: 20, description: 'Focus, exposure and image quality.' },
      { criterion: 'Originality', marks: 20, description: 'Originality of the captured photograph.' },
    ],
    submission: ['Maximum 3 photographs per participant.', 'JPG/JPEG format only.', 'Submit before the announced deadline.'],
    notes: ['AI-generated images are not allowed.', 'Respect privacy and obtain appropriate permission before photographing people.'],
  },
  {
    id: 'grand-line-visuals', missionNumber: 'EVENT 10', title: 'Grand Line Visuals', japaneseTitle: '映像の航海 // VIDEOGRAPHY EVENT',
    tagline: 'FRAMES • STORIES • BEYOND BORDERS', missionType: 'NON-TECH', category: 'NON-TECHNICAL — VIDEOGRAPHY', image: '/images/grand_line_visuals.png',
    coordinator: [
      { name: 'Yokesh', department: 'AI & DS', year: 'II' },
      { name: 'Seeman', department: 'CSE', year: 'III' }
    ],
    crewSize: 'Solo / Duo', battleTime: 'To Be Announced', mode: 'VIDEOGRAPHY', minMembers: 1, maxMembers: 2,
    description: 'Capture the symposium through moving images, focusing on people, places, moments, storytelling and creative visual perspectives.',
    rules: ['Steady shots over fancy moves — use a locked-off tripod shot for talks whenever possible.', 'Hold shots longer than feels natural — at least 5–10 seconds per angle.', 'Get cutaways — brief audience reactions or wide room shots provide useful edit points and help hide jump cuts.', 'Audio first, video second — a lavalier or shotgun mic on the speaker matters more than camera quality.', 'Eye level, not podium level — shoot around the speaker’s eye height.', 'Fill the frame — get close enough that the speaker or subject dominates the shot.', 'Watch the background — check for mic stands, exit signs or other distracting elements.', 'Catch the gesture — capture speakers mid-gesture or mid-expression for more natural moments.'],
    notes: ['Use steady framing, clean audio, eye-level composition and purposeful cutaways for talks.'],
  },
  {
    id: 'straw-hat-studios', missionNumber: 'EVENT 11', title: 'Straw Hat Studios', japaneseTitle: '物語の海 // SHORT FILM EVENT',
    tagline: 'DREAM • SHOOT • CREATE • INSPIRE', missionType: 'NON-TECH', category: 'NON-TECHNICAL — SHORT FILM', image: '/images/straw_hat_studios.jpg',
    coordinator: [
      { name: 'Rajkumar', department: 'AI & DS', year: 'III' },
      { name: 'Sivanesan', department: 'AI & DS', year: 'III' }
    ],
    crewSize: '1–4 Members', battleTime: '5–10 Minutes', mode: 'SHORT FILM PRODUCTION', minMembers: 1, maxMembers: 4,
    description: 'Create an original short film that demonstrates storytelling, creativity and technical execution through directing, acting, cinematography, editing and sound.',
    rules: ['Each team must have a minimum of 1 member and maximum of 4 members.', 'Each team can participate with 1–4 members only.', 'One member may handle multiple roles such as Director, Actor, Cinematographer or Editor.', 'Each team must nominate one Team Leader.', 'Only registered team members are permitted to participate in the production.', 'The submitted film must be an original creation of the participating team.', 'Content must be suitable for a college symposium and should demonstrate creativity, storytelling and technical execution.', 'Minimum duration is 5 minutes and maximum duration is 10 minutes including opening and ending credits.', 'Films may be in Tamil or English. Other languages must have English subtitles.', 'Plagiarism and unauthorized copyrighted music, movie clips, images or videos are prohibited.', 'AI-generated content, if used, must be disclosed when requested by organizers.', 'File format is MP4; recommended resolution is 1080p or higher and aspect ratio 16:9.', 'Each team can submit one short film before the official deadline.', 'Hate speech, discriminatory content, explicit sexual content, excessively graphic violence, plagiarism or unauthorized copyrighted material may lead to rejection or disqualification.', 'Teams may use mobile phones, cameras, DSLRs, mirrorless cameras or other recording equipment.', 'Misbehavior or damage to college/event property may result in disqualification.', 'Organizers may modify the schedule or reject entries that violate the rules.'],
    judging: [
      { criterion: 'Story & Concept', marks: 15, description: 'Story quality and concept.' },
      { criterion: 'Acting', marks: 15, description: 'Performance and character portrayal.' },
      { criterion: 'Cinematography', marks: 15, description: 'Visual storytelling and camera work.' },
      { criterion: 'Editing', marks: 15, description: 'Pacing, transitions and edit quality.' },
      { criterion: 'Sound & Music', marks: 10, description: 'Audio quality and appropriate music.' },
      { criterion: 'Creativity', marks: 15, description: 'Originality and creative execution.' },
      { criterion: 'Overall Impact', marks: 15, description: 'Overall audience and judging impact.' },
    ],
    submission: ['One short film per team.', 'MP4 format; 1080p or higher recommended.', 'Tamil/English; other languages require English subtitles.', 'Submit before the official deadline.'],
    notes: ['Opening and ending credits are included in the 5–10 minute duration.', 'Teams are responsible for arranging their own equipment.'],
  },
  {
    id: 'e-sports', missionNumber: 'EVENT 12', title: 'E-Sports', japaneseTitle: 'ゲームの航海 // BATTLE FOR GLORY',
    tagline: 'GAMES • SKILLS • STRATEGY • FAIR PLAY', missionType: 'E-SPORTS', category: 'NON-TECHNICAL — E-SPORTS', image: '/images/esports_games.png',
    coordinator: [
      { name: 'Sivanesan', department: 'AI & DS', year: 'III' },
      { name: 'Rajkumar', department: 'AI & DS', year: 'III' },
      { name: 'Dhanush Priyan', department: 'CS', year: 'III' },
      { name: 'Ranjan M', department: 'AI & DS', year: 'III' },
      { name: 'Saathish Kambattan', department: 'CSE', year: 'III' },
      { name: 'Vishwa', department: 'Cybersecurity', year: 'II' },
      { name: 'Yogesh', department: 'AI & DS', year: 'II' },
      { name: 'Barani Kumar', department: 'CSE', year: 'III' }
    ],
    crewSize: 'Game Format Announced', battleTime: 'Match Schedule Announced', mode: 'MULTI-GAME TOURNAMENT', minMembers: 1, maxMembers: 4,
    description: 'A combined E-Sports category featuring PUBG, Free Fire, Chess and Carrom Pool. Each game follows its announced tournament format, schedule and applicable rules.',
    rules: ['PUBG — players must follow the tournament instructions, required team format and match schedule; hacks, cheats, unauthorized software, opponent teaming and game-glitch exploitation are prohibited.', 'Free Fire — players must use registered game accounts; hacking, cheating, unauthorized third-party applications, bug exploitation and abusive behavior are prohibited.', 'Chess — each player has 16 pieces, White moves first, official chess rules apply, touch-move rules apply in official competitions, and the objective is checkmate.', 'Carrom Pool — matches follow the announced tournament format and official carrom rules; players must use the striker properly, avoid unauthorized assistance and follow fair-play requirements.', 'All players must report on time, maintain discipline and sportsmanship, follow organizer instructions and report disputes to the referee or organizer.', 'The organizer’s decision is final.'],
    notes: ['Games included: PUBG • Free Fire • Chess • Carrom Pool.', 'Exact team formats, match schedules, time controls and disconnection policies will be announced by organizers.'],
  },

];

const GAME_COMMON_RULES = [
  'Participants must register before the competition.',
  'Players must report on time.',
  'Cheating is strictly prohibited.',
  'Maintain discipline and sportsmanship.',
  'Follow the organizer’s instructions.',
  'Any disputes must be reported to the referee.',
  'The organizer’s decision will be final.',
];

export const DETAILED_EVENTS: Record<string, DetailedEventData> = Object.fromEntries(
  events.map((event) => [
    event.id,
    makeDetail(event.missionType === 'E-SPORTS'
      ? { ...event, rules: [...event.rules, ...GAME_COMMON_RULES] }
      : event)
  ])
) as Record<string, DetailedEventData>;
