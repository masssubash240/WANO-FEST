export interface EventItem {
  id: string;
  eventNumber?: string;
  title: string;
  subtitle: string;
  category: 'tech' | 'non-tech';
  tag: string;
  image: string;
  prize?: string;
  teamSize: string;
  description: string;
  highlights: string[];
  coordinator: string;
  department?: string;
  year?: string;
  venue?: string;
  date?: string;
  time?: string;
  duration?: string;
  eligibility?: string;
  icon?: string;
  rulesSummary?: string[];
  registrationLink?: string;
}

export interface CharacterCard {
  id: string;
  name: string;
  jpName: string;
  subTitle: string;
  icon: string;
  element: string;
  accentColor: string;
  description: string;
}

export interface Speaker {
  id: string;
  name: string;
  title: string;
  organization: string;
  topic: string;
  badge: string;
  avatar: string;
}

export interface ScheduleSession {
  time: string;
  title: string;
  location: string;
  track: 'tech' | 'non-tech' | 'all';
  speaker?: string;
  tag: string;
}

export interface ScheduleDay {
  dayNumber: number;
  date: string;
  title: string;
  subTitle: string;
  sessions: ScheduleSession[];
}

export interface TicketTier {
  id: string;
  name: string;
  jpRank: string;
  bounty: string;
  price: string;
  popular?: boolean;
  features: string[];
  cta: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}
