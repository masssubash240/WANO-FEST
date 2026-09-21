export interface Coordinator {
  name: string;
  phone: string;
  tel: string;
  wa?: string;
  email?: string;
  role?: string;
  website?: string;
}

export interface QuartermasterGroup {
  eventCategory: string;
  eventName: string;
  bounty: string;
  coordinators: Coordinator[];
}

export interface SiteConfig {
  college: {
    name: string;
    tagline: string;
    website: string;
    email: string;
    whatsapp: string;
    whatsappUrl: string;
    youtubeUrl: string;
    youtubeVideoId: string;
    instagramUrl: string;
    instagramHandle: string;
    address: string;
    googleMapsUrl: string;
    googleMapsEmbedUrl: string;
  };
  quartermasters: QuartermasterGroup[];
  eventCoordinators: Record<string, Coordinator[]>;
  harborCards: {
    id: string;
    title: string;
    subtitle: string;
    actionLabel: string;
    href: string;
    type: 'website' | 'maps' | 'mail' | 'instagram';
    valueToCopy?: string;
  }[];
  contactCards: {
    id: string;
    title: string;
    badge: string;
    value: string;
    displayValue: string;
    actionLabel: string;
    href: string;
    type: 'website' | 'email' | 'whatsapp' | 'instagram' | 'youtube' | 'location';
    copyable?: boolean;
    copyValue?: string;
  }[];
}

export const SITE_CONFIG: SiteConfig = {
  college: {
    name: 'Sri Sai Ranganathan Engineering College',
    tagline: 'Anime × Technology × Opportunity',
    website: 'https://reccbe.ac.in/',
    email: 'reccbe@reccbe.ac.in',
    whatsapp: '+91 63838 53695',
    whatsappUrl: 'https://wa.me/916383853695',
    youtubeUrl: 'https://www.youtube.com/watch?v=J1NxjkbQ1xw',
    youtubeVideoId: 'J1NxjkbQ1xw',
    instagramUrl: 'https://www.instagram.com/ssrec_cbe',
    instagramHandle: '@ssrec_cbe',
    address: 'Sri Sai Ranganathan Engineering College, REC Kalvi Nagar, Thondamuthur, Zakirnaickenpalayam, Viraliyur, Tamil Nadu 641109',
    googleMapsUrl: 'https://www.google.com/maps/place/Sri+Sai+Ranganathan+Engineering+College,+REC+Kalvi+Nagar,+Thondamuthur+Zakirnaickenpalayam,+Post+Via,+Viraliyur,+Thondamuthur,+Tamil+Nadu+641109/data=!4m2!3m1!1s0x3ba860e379ab02fd:0x219a15bc44d1b4fc',
    googleMapsEmbedUrl: 'https://www.google.com/maps?q=Sri+Sai+Ranganathan+Engineering+College+Thondamuthur&output=embed',
  },

  quartermasters: [
    {
      eventCategory: 'E-SPORTS DIVISION',
      eventName: 'BGMI & Free Fire Battles',
      bounty: '฿ 1,500,000',
      coordinators: [
        {
          name: 'Dhanush Priyan',
          phone: '+91 84385 04441',
          tel: '+918438504441',
          wa: 'https://wa.me/918438504441',
          role: 'BGMI Quartermaster',
        },
        {
          name: 'Sivanesan',
          phone: '+91 63743 86120',
          tel: '+916374386120',
          wa: 'https://wa.me/916374386120',
          email: 'itzsiva01@gmail.com',
          role: 'Free Fire Commander',
        },
        {
          name: 'Raj Kumar',
          phone: '+91 93611 84362',
          tel: '+919361184362',
          wa: 'https://wa.me/919361184362',
          role: 'Tournament Marshal',
        },
      ],
    },
    {
      eventCategory: 'CINEMATIC DIVISION',
      eventName: 'Straw Hat Studios (Short Film)',
      bounty: '฿ 1,200,000',
      coordinators: [
        {
          name: 'Sivanesan',
          phone: '+91 63743 86120',
          tel: '+916374386120',
          wa: 'https://wa.me/916374386120',
          email: 'itzsiva01@gmail.com',
          role: 'Film Director / Producer',
        },
        {
          name: 'Raj Kumar',
          phone: '+91 93611 84362',
          tel: '+919361184362',
          wa: 'https://wa.me/919361184362',
          role: 'Screening Coordinator',
        },
      ],
    },
    {
      eventCategory: 'CYBERSECURITY DIVISION',
      eventName: 'Capture The Flag (CTF)',
      bounty: '฿ 2,000,000',
      coordinators: [
        {
          name: 'Subash Kumar M',
          phone: '+91 63838 53695',
          tel: '+916383853695',
          wa: 'https://wa.me/916383853695',
          email: 'm.subashumar3@gmail.com',
          role: 'CTF Grandmaster',
          website: 'https://godofcybertech.vercel.app/',
        },
      ],
    },
    {
      eventCategory: 'EXPLORATION DIVISION',
      eventName: 'Red Line Rush (Treasure Hunt)',
      bounty: '฿ 1,000,000',
      coordinators: [
        {
          name: 'Surya Mathavan',
          phone: '+91 78240 50332',
          tel: '+917824050332',
          wa: 'https://wa.me/917824050332',
          email: 'suryamathavan39@gmail.com',
          role: 'Treasure Navigator',
        },
      ],
    },
  ],

  // Specific event mappings for CoordinatorStrip under every event card
  eventCoordinators: {
    'capture-the-flag': [
      {
        name: 'Subash Kumar M',
        phone: '+91 63838 53695',
        tel: '+916383853695',
        wa: 'https://wa.me/916383853695',
        email: 'm.subashumar3@gmail.com',
        role: 'CTF Lead',
        website: 'https://godofcybertech.vercel.app/',
      },
    ],
    'straw-hat-studios': [
      {
        name: 'Sivanesan',
        phone: '+91 63743 86120',
        tel: '+916374386120',
        wa: 'https://wa.me/916374386120',
        email: 'itzsiva01@gmail.com',
        role: 'Lead',
      },
      {
        name: 'Raj Kumar',
        phone: '+91 93611 84362',
        tel: '+919361184362',
        wa: 'https://wa.me/919361184362',
        role: 'Co-Lead',
      },
    ],
    'red-line-rush': [
      {
        name: 'Surya Mathavan',
        phone: '+91 78240 50332',
        tel: '+917824050332',
        wa: 'https://wa.me/917824050332',
        email: 'suryamathavan39@gmail.com',
        role: 'Hunt Master',
      },
    ],
    'e-sports': [
      {
        name: 'Dhanush Priyan (BGMI)',
        phone: '+91 84385 04441',
        tel: '+918438504441',
        wa: 'https://wa.me/918438504441',
        role: 'BGMI Lead',
      },
      {
        name: 'Sivanesan (Free Fire)',
        phone: '+91 63743 86120',
        tel: '+916374386120',
        wa: 'https://wa.me/916374386120',
        email: 'itzsiva01@gmail.com',
        role: 'Free Fire Lead',
      },
      {
        name: 'Raj Kumar',
        phone: '+91 93611 84362',
        tel: '+919361184362',
        wa: 'https://wa.me/919361184362',
        role: 'Marshal',
      },
    ],
    'project-expo': [
      {
        name: 'JAYASRI',
        phone: '9342481695',
        tel: '9342481695',
        wa: 'https://wa.me/919342481695',
        role: 'Project Expo Coordinator',
      },
    ],
    'paper-presentation': [
      {
        name: 'JANANI',
        phone: '6385326280',
        tel: '6385326280',
        wa: 'https://wa.me/916385326280',
        role: 'Paper Presentation Coordinator',
      },
    ],
    'coding-challenge': [
      {
        name: 'Janani',
        phone: '+91 95009 81246',
        tel: '+919500981246',
        wa: 'https://wa.me/919500981246',
        role: 'Lead',
      },
    ],
    'ai-prompt': [
      {
        name: 'Dinakaran',
        phone: '+91 95009 81246',
        tel: '+919500981246',
        wa: 'https://wa.me/919500981246',
        role: 'Lead',
      },
    ],
    'ui-ux-challenge': [
      {
        name: 'Essakiraja',
        phone: '+91 95009 81246',
        tel: '+919500981246',
        wa: 'https://wa.me/919500981246',
        role: 'Lead',
      },
    ],
    'will-of-d': [
      {
        name: 'Jayasri',
        phone: '+91 95009 81246',
        tel: '+919500981246',
        wa: 'https://wa.me/919500981246',
        role: 'Lead',
      },
    ],
    'nikas-dance-arena': [
      {
        name: 'Vishwa & Saathish',
        phone: '+91 95009 81246',
        tel: '+919500981246',
        wa: 'https://wa.me/919500981246',
        role: 'Leads',
      },
    ],
    'binks-rhythm': [
      {
        name: 'Vishwa & Saathish',
        phone: '+91 95009 81246',
        tel: '+919500981246',
        wa: 'https://wa.me/919500981246',
        role: 'Leads',
      },
    ],
    'pirate-portraits': [
      {
        name: 'Yokesh & Seeman',
        phone: '+91 95009 81246',
        tel: '+919500981246',
        wa: 'https://wa.me/919500981246',
        role: 'Leads',
      },
    ],
    'grand-line-visuals': [
      {
        name: 'Yokesh & Seeman',
        phone: '+91 95009 81246',
        tel: '+919500981246',
        wa: 'https://wa.me/919500981246',
        role: 'Leads',
      },
    ],
  },

  harborCards: [
    {
      id: 'website',
      title: 'COLLEGE SANCTUARY',
      subtitle: 'reccbe.ac.in',
      actionLabel: 'VISIT HARBOR ➔',
      href: 'https://reccbe.ac.in/',
      type: 'website',
    },
    {
      id: 'maps',
      title: 'CHART THE ROUTE',
      subtitle: 'Thondamuthur, Coimbatore',
      actionLabel: 'GET DIRECTIONS ➔',
      href: 'https://www.google.com/maps/place/Sri+Sai+Ranganathan+Engineering+College,+REC+Kalvi+Nagar,+Thondamuthur+Zakirnaickenpalayam,+Post+Via,+Viraliyur,+Thondamuthur,+Tamil+Nadu+641109/data=!4m2!3m1!1s0x3ba860e379ab02fd:0x219a15bc44d1b4fc',
      type: 'maps',
    },
    {
      id: 'mail',
      title: 'TRANSMISSION DESK',
      subtitle: 'reccbe@reccbe.ac.in',
      actionLabel: 'COPY TRANSMISSION',
      href: 'mailto:reccbe@reccbe.ac.in',
      type: 'mail',
      valueToCopy: 'reccbe@reccbe.ac.in',
    },
    {
      id: 'instagram',
      title: 'FLEET BROADCAST',
      subtitle: '@ssrec_cbe',
      actionLabel: 'FOLLOW FLEET',
      href: 'https://www.instagram.com/ssrec_cbe',
      type: 'instagram',
    },
  ],

  contactCards: [
    {
      id: 'contact-website',
      title: 'OFFICIAL SANCTUARY',
      badge: 'NAVY PORTAL',
      value: 'reccbe.ac.in',
      displayValue: 'Official Website & Academic Records',
      actionLabel: 'OPEN PORTAL ➔',
      href: 'https://reccbe.ac.in/',
      type: 'website',
    },
    {
      id: 'contact-email',
      title: 'DEN DEN TRANSMISSION',
      badge: 'OFFICIAL MAIL',
      value: 'reccbe@reccbe.ac.in',
      displayValue: 'reccbe@reccbe.ac.in',
      actionLabel: 'DISPATCH MAIL',
      href: 'mailto:reccbe@reccbe.ac.in',
      type: 'email',
      copyable: true,
      copyValue: 'reccbe@reccbe.ac.in',
    },
    {
      id: 'contact-whatsapp',
      title: 'TELEGRAPH FREQUENCY',
      badge: 'INSTANT DISPATCH',
      value: '+91 63838 53695',
      displayValue: '+91 63838 53695 (Subash)',
      actionLabel: 'LAUNCH WHATSAPP ➔',
      href: 'https://wa.me/916383853695',
      type: 'whatsapp',
      copyable: true,
      copyValue: '+916383853695',
    },
    {
      id: 'contact-instagram',
      title: 'LOG VOYAGE INSTAGRAM',
      badge: '@SSREC_CBE',
      value: '@ssrec_cbe',
      displayValue: 'Photos, Live Updates & Stories',
      actionLabel: 'EXPLORE FLEET ➔',
      href: 'https://www.instagram.com/ssrec_cbe',
      type: 'instagram',
    },
    {
      id: 'contact-youtube',
      title: 'GRAND ARCHIVE YOUTUBE',
      badge: 'OFFICIAL STREAM',
      value: 'WANO FEST 2026 Trailer',
      displayValue: 'Cinematic Highlights & Keynotes',
      actionLabel: 'PLAY ARCHIVE ➔',
      href: 'https://www.youtube.com/watch?v=J1NxjkbQ1xw',
      type: 'youtube',
    },
    {
      id: 'contact-location',
      title: 'HARBOR COORDINATES',
      badge: 'CAMPUS ANCHOR',
      value: 'Viraliyur, Thondamuthur, CBE',
      displayValue: 'Sri Sai Ranganathan Engineering College, REC Kalvi Nagar',
      actionLabel: 'OPEN GOOGLE MAPS ➔',
      href: 'https://www.google.com/maps/place/Sri+Sai+Ranganathan+Engineering+College,+REC+Kalvi+Nagar,+Thondamuthur+Zakirnaickenpalayam,+Post+Via,+Viraliyur,+Thondamuthur,+Tamil+Nadu+641109/data=!4m2!3m1!1s0x3ba860e379ab02fd:0x219a15bc44d1b4fc',
      type: 'location',
      copyable: true,
      copyValue: 'Sri Sai Ranganathan Engineering College, REC Kalvi Nagar, Thondamuthur, Zakirnaickenpalayam, Viraliyur, Tamil Nadu 641109',
    },
  ],
};
