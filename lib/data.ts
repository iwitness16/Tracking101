export const services = [
  {
    slug: 'air',
    title: 'Air Freight',
    image: '/images/plane3.jpg',
    short:
      'Time-critical air cargo with priority handling and global airport coverage.',
    description:
      'When speed matters most, our air freight network delivers. Priority and consolidated options, temperature-controlled handling, and customs clearance across 400+ airports.',
    features: [
      'Next-flight-out & express options',
      'Temperature & pharma-grade handling',
      'Dangerous goods certified',
      'Door-to-door customs clearance',
    ],
  },
  {
    slug: 'ocean',
    title: 'Ocean Freight',
    image: '/images/service-ocean.png',
    short:
      'Cost-efficient FCL and LCL ocean shipping on the world’s major trade lanes.',
    description:
      'Reliable, cost-effective sea freight for any volume. Full and less-than-container loads, reefer cargo, and project shipments backed by guaranteed space agreements.',
    features: [
      'FCL, LCL & reefer containers',
      'Guaranteed space allocation',
      'Project & break-bulk cargo',
      'Port-to-port & door delivery',
    ],
  },
  {
    slug: 'ground',
    title: 'Ground & Last Mile',
    image: '/images/truck.jpg',
    short:
      'Regional trucking and last-mile delivery with full route optimization.',
    description:
      'A modern fleet and vetted carrier partners move your goods across regions and into customers’ hands. Real-time route optimization and proof-of-delivery on every leg.',
    features: [
      'FTL & LTL trucking',
      'Optimized last-mile delivery',
      'Live driver tracking',
      'Electronic proof of delivery',
    ],
  },
  {
    slug: 'warehousing',
    title: 'Warehousing & Fulfillment',
    image: '/images/warehouse.jpg',
    short:
      'Smart, automated warehousing with inventory visibility and fulfillment.',
    description:
      'Strategically located, automated fulfillment centers keep your inventory close to demand. Real-time stock visibility, pick-and-pack, and seamless e-commerce integration.',
    features: [
      'Automated pick & pack',
      'Real-time inventory dashboards',
      'E-commerce integrations',
      'Bonded & climate-controlled space',
    ],
  },
]

export const testimonials = [
  {
    quote:
      'AtlasSwift transformed our supply chain. Their real-time tracking and proactive communication mean we are never in the dark about a shipment.',
    name: 'Elena Voss',
    role: 'VP Operations, Northwind Retail',
    avatar: '/images/avatar-1.png',
  },
  {
    quote:
      'We moved 12 markets onto AtlasSwift in a single quarter. On-time performance jumped to 99% and our customs delays effectively disappeared.',
    name: 'Daniel Park',
    role: 'Head of Logistics, Orbit Electronics',
    avatar: '/images/avatar-2.png',
  },
  {
    quote:
      'The team feels like an extension of ours. Reliable, transparent, and genuinely invested in our growth across three continents.',
    name: 'Amara Okafor',
    role: 'Supply Chain Director, Veridian Foods',
    avatar: '/images/avatar-3.png',
  },
]

export type TrackingEvent = {
  status: string
  location: string
  timestamp: string
  done: boolean
  current?: boolean
}

export type Shipment = {
  trackingId: string
  status: string
  statusLabel: string
  origin: { city: string; coords: [number, number] }
  destination: { city: string; coords: [number, number] }
  current: { city: string; coords: [number, number] }
  service: string
  weight: string
  pieces: number
  estimatedDelivery: string
  progress: number
  events: TrackingEvent[]
}

export const demoShipment: Shipment = {
  trackingId: 'ASL-7783-2049-XK',
  status: 'in-transit',
  statusLabel: 'In Transit',
  origin: { city: 'Rotterdam, NL', coords: [51.9244, 4.4777] },
  destination: { city: 'Newark, US', coords: [40.7357, -74.1724] },
  current: { city: 'Mid-Atlantic', coords: [47.5, -30.0] },
  service: 'Ocean Freight — FCL',
  weight: '18,400 kg',
  pieces: 2,
  estimatedDelivery: 'Jun 28, 2026',
  progress: 62,
  events: [
    {
      status: 'Order received',
      location: 'Rotterdam, NL',
      timestamp: 'Jun 18, 2026 · 09:12',
      done: true,
    },
    {
      status: 'Picked up & customs cleared',
      location: 'Port of Rotterdam, NL',
      timestamp: 'Jun 19, 2026 · 14:40',
      done: true,
    },
    {
      status: 'Departed origin port',
      location: 'Rotterdam, NL',
      timestamp: 'Jun 20, 2026 · 02:05',
      done: true,
    },
    {
      status: 'In transit — vessel underway',
      location: 'Mid-Atlantic',
      timestamp: 'Jun 23, 2026 · 11:30',
      done: true,
      current: true,
    },
    {
      status: 'Arriving at destination port',
      location: 'Newark, US',
      timestamp: 'Est. Jun 27, 2026',
      done: false,
    },
    {
      status: 'Out for delivery',
      location: 'Newark, US',
      timestamp: 'Est. Jun 28, 2026',
      done: false,
    },
    {
      status: 'Delivered',
      location: 'Newark, US',
      timestamp: 'Est. Jun 28, 2026',
      done: false,
    },
  ],
}

export const offices = [
  {
    city: 'Rotterdam',
    region: 'EMEA HQ',
    address: 'Wilhelminakade 909, 3072 AP Rotterdam, Netherlands',
    phone: '+31 10 555 0142',
  },
  {
    city: 'Singapore',
    region: 'APAC HQ',
    address: '8 Marina Blvd, Marina Bay Financial Centre, Singapore',
    phone: '+65 6555 0178',
  },
  {
    city: 'Newark',
    region: 'Americas HQ',
    address: '1100 Raymond Blvd, Newark, NJ 07102, United States',
    phone: '+1 (800) 555-0192',
  },
  {
    city: 'Dubai',
    region: 'Middle East',
    address: 'Jebel Ali Free Zone, Gate 4, Dubai, UAE',
    phone: '+971 4 555 0166',
  },
]

export const jobOpenings = [
  {
    title: 'Senior Logistics Coordinator',
    department: 'Operations',
    location: 'Rotterdam, NL',
    type: 'Full-time',
  },
  {
    title: 'Air Freight Operations Manager',
    department: 'Operations',
    location: 'Singapore',
    type: 'Full-time',
  },
  {
    title: 'Supply Chain Data Analyst',
    department: 'Technology',
    location: 'Newark, US',
    type: 'Full-time',
  },
  {
    title: 'Customs Compliance Specialist',
    department: 'Compliance',
    location: 'Dubai, UAE',
    type: 'Full-time',
  },
  {
    title: 'Frontend Engineer, Tracking Platform',
    department: 'Technology',
    location: 'Remote (EMEA)',
    type: 'Full-time',
  },
  {
    title: 'Fleet & Last-Mile Lead',
    department: 'Operations',
    location: 'Newark, US',
    type: 'Full-time',
  },
]

export const shipmentVolume = [
  { month: 'Jan', air: 420, ocean: 980, ground: 1240 },
  { month: 'Feb', air: 460, ocean: 1020, ground: 1180 },
  { month: 'Mar', air: 520, ocean: 1120, ground: 1320 },
  { month: 'Apr', air: 580, ocean: 1080, ground: 1410 },
  { month: 'May', air: 610, ocean: 1240, ground: 1490 },
  { month: 'Jun', air: 690, ocean: 1320, ground: 1560 },
]

export const onTimeTrend = [
  { week: 'W1', rate: 96.2 },
  { week: 'W2', rate: 97.1 },
  { week: 'W3', rate: 96.8 },
  { week: 'W4', rate: 98.3 },
  { week: 'W5', rate: 98.9 },
  { week: 'W6', rate: 99.1 },
]

export const adminShipments = [
  {
    id: 'ASL-7783-2049-XK',
    customer: 'Northwind Retail',
    route: 'Rotterdam → Newark',
    service: 'Ocean',
    status: 'In Transit',
    eta: 'Jun 28',
  },
  {
    id: 'ASL-6610-1188-QP',
    customer: 'Orbit Electronics',
    route: 'Singapore → Los Angeles',
    service: 'Air',
    status: 'Customs',
    eta: 'Jun 24',
  },
  {
    id: 'ASL-9921-7740-LM',
    customer: 'Veridian Foods',
    route: 'Dubai → Hamburg',
    service: 'Ocean',
    status: 'Delivered',
    eta: 'Jun 21',
  },
  {
    id: 'ASL-4402-3318-ZT',
    customer: 'Helix Pharma',
    route: 'Newark → Chicago',
    service: 'Ground',
    status: 'Out for Delivery',
    eta: 'Jun 22',
  },
  {
    id: 'ASL-5573-9902-BV',
    customer: 'Atlas Manufacturing',
    route: 'Shanghai → Rotterdam',
    service: 'Ocean',
    status: 'In Transit',
    eta: 'Jul 03',
  },
  {
    id: 'ASL-3047-2261-WX',
    customer: 'Nimbus Apparel',
    route: 'Istanbul → London',
    service: 'Ground',
    status: 'Delayed',
    eta: 'Jun 25',
  },
]

export const benefits = [
  {
    title: 'Global mobility',
    description:
      'Work across our offices on four continents with relocation and exchange programs.',
  },
  {
    title: 'Health & wellbeing',
    description:
      'Comprehensive medical, dental, and mental-health coverage for you and your family.',
  },
  {
    title: 'Learning budget',
    description:
      'Annual stipend for certifications, courses, and conferences to grow your craft.',
  },
  {
    title: 'Performance bonus',
    description:
      'Share in the company’s success with transparent, performance-linked bonuses.',
  },
  {
    title: 'Hybrid & remote',
    description:
      'Flexible working models with modern offices and full remote roles available.',
  },
  {
    title: 'Parental leave',
    description:
      'Generous, equal parental leave so you never have to choose between work and family.',
  },
]
