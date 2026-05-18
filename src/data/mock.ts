// Import the app's color palette — used if any data field needs to reference theme colors
import { Colors } from '../theme';

// USER represents the currently logged-in attendee of the games
export const USER = {
  name: 'Mamadou Diallo',        // Full display name shown in the profile header
  role: 'Visiteur',              // Accreditation role: Visiteur / Athlète / Journaliste / Staff
  country: 'Sénégal',           // Full country name, shown in profile UI
  countryCode: 'SN',            // ISO 3166-1 alpha-2 code — used to display the flag emoji
  accreditation: 'JOJ-2026-VIS-08421', // Unique badge/QR code identifier for venue entry
  walletBalance: 47500,         // Current in-app wallet balance in the smallest currency unit (francs CFA)
  currency: 'XOF',             // ISO 4217 currency code — West African CFA franc used in Senegal
};

// TicketCategory groups every possible ticket type the user might own
export type TicketCategory = 'VIP' | 'General' | 'Transport' | 'Accreditation';

// TICKETS holds all the tickets owned by the current user
export const TICKETS = [
  {
    id: 'T001',                              // Unique ticket identifier for lookups and key props
    event: "Cérémonie d'ouverture",          // Human-readable event name shown on the ticket card
    venue: 'Stade Léopold Sédar Senghor',   // Physical venue where the event takes place
    date: '27 Jul 2026',                     // Date of the event, pre-formatted for display
    time: '19:00',                           // Start time of the event (local Dakar time)
    seat: 'Section A · Rangée 12 · Siège 34', // Precise seat location inside the venue
    type: 'VIP' as TicketCategory,           // Category drives the badge color on the ticket card
    status: 'active' as const,              // 'active' = usable today; 'upcoming' = future date
    icon: 'star' as const,                  // Ionicon name rendered as the ticket illustration
  },
  {
    id: 'T002',
    event: 'Basketball — Phase de groupes',
    venue: 'Dakar Arena',
    date: '28 Jul 2026',
    time: '14:00',
    seat: 'Tribune Nord · Siège 118',
    type: 'General' as TicketCategory,      // General admission — cheaper tier, numbered seat
    status: 'active' as const,
    icon: 'basketball-outline' as const,    // Sport-specific icon to help users scan their tickets quickly
  },
  {
    id: 'T003',
    event: 'Athlétisme — 100m Final',
    venue: 'Stade Iba Mar Diop',
    date: '30 Jul 2026',
    time: '20:30',
    seat: 'Tribune Est · Siège 55',
    type: 'General' as TicketCategory,
    status: 'upcoming' as const,            // 'upcoming' — grayed-out in the UI, not yet scannable
    icon: 'walk-outline' as const,
  },
  {
    id: 'TP001',                             // 'TP' prefix distinguishes transport passes from event tickets
    event: 'Pass transport — Navette',
    venue: 'AIBD vers Centre Ville',         // Route: Airport → City Centre
    date: 'Validité: 27 Jul — 06 Août',     // Validity range instead of a single date
    time: 'Toute la journée',               // Valid all day — no fixed departure slot on the ticket
    seat: 'Trajets illimités',              // Unlimited trips during the validity period
    type: 'Transport' as TicketCategory,    // Transport type renders a different card style
    status: 'active' as const,
    icon: 'bus-outline' as const,
  },
];

// EVENTS is the full schedule feed — both upcoming and ongoing matches
export const EVENTS = [
  {
    id: 'E001',                           // Unique event ID referenced by tickets and notifications
    sport: 'Basketball',                  // Sport label used for filtering the schedule by discipline
    match: "Sénégal vs Côte d'Ivoire",   // Human-readable match title shown in list cards
    homeCode: 'SN',                       // ISO country code for the home/first team — renders flag
    awayCode: 'CI',                       // ISO country code for the away/second team — renders flag
    venue: 'Dakar Arena',
    time: '14:00',
    date: '28 Jul',
    status: 'upcoming' as const,         // 'upcoming' | 'live' | 'finished' — drives status badge color
    category: 'Phase de groupes',        // Round name: group stage, quarter-final, final…
  },
  {
    id: 'E002',
    sport: 'Football',
    match: 'Mali vs Cameroun',
    homeCode: 'ML',
    awayCode: 'CM',
    venue: 'Stade LSS',                  // Short alias for Stade Léopold Sédar Senghor
    time: '16:30',
    date: '28 Jul',
    status: 'upcoming' as const,
    category: 'Quart de finale',
  },
  {
    id: 'E003',
    sport: 'Natation',
    match: 'Finale 100m libre',
    homeCode: '',                         // Empty string: individual events have no "team" codes
    awayCode: '',
    venue: 'Piscine Olympique',
    time: '10:00',
    date: '28 Jul',
    status: 'live' as const,            // 'live' triggers the red LIVE badge and real-time score fetch
    category: 'Finale',
  },
  {
    id: 'E004',
    sport: 'Athletisme',
    match: '100m hommes — Demi-finale',
    homeCode: '',
    awayCode: '',
    venue: 'Stade Iba Mar Diop',
    time: '09:30',
    date: '28 Jul',
    status: 'live' as const,
    category: 'Demi-finale',
  },
  {
    id: 'E005',
    sport: 'Judo',
    match: 'Finale — 66kg',
    homeCode: '',
    awayCode: '',
    venue: 'Palais des Sports',
    time: '11:00',
    date: '27 Jul',
    status: 'finished' as const,        // 'finished' — result is locked, no live updates needed
    category: 'Finale',
  },
];

// StatLine describes a single row in the in-match statistics table
export type StatLine = {
  label: string;   // Stat name shown on the left (e.g. "Possession", "Rebonds")
  home: number;    // Value for the home/first team
  away: number;    // Value for the away/second team
  pct?: boolean;   // Optional flag — if true, render the values as percentages (e.g. possession)
};

// LIVE_SCORES holds the currently active matches with full statistics breakdown
export const LIVE_SCORES = [
  {
    id: 'L001',                      // Unique ID used as the React key and for deep-link navigation
    sport: 'Basketball',
    homeTeam: 'Sénégal',            // Full team name displayed in the score card header
    awayTeam: 'Nigéria',
    homeCode: 'SN',                  // Country code for the flag — same convention as EVENTS
    awayCode: 'NG',
    homeScore: 67,                   // Current score for the home team
    awayScore: 54,                   // Current score for the away team
    period: 'Q3 · 5:23',            // Current game period and time remaining/elapsed
    stats: {
      lines: [
        { label: 'Points Q1', home: 18, away: 15 },        // Points scored in the first quarter
        { label: 'Points Q2', home: 22, away: 19 },        // Points scored in the second quarter
        { label: 'Points Q3', home: 27, away: 20 },        // Points scored so far in the third quarter
        { label: 'Rebonds', home: 26, away: 19 },          // Total rebounds (offensive + defensive)
        { label: 'Passes décisives', home: 18, away: 13 }, // Assists — passes leading directly to a score
        { label: 'Fautes', home: 11, away: 14 },           // Personal fouls accumulated by each team
      ] as StatLine[],
      // highlight pinpoints the standout individual performer on each side
      highlight: { label: 'Meilleurs marqueurs', home: 'Diallo · 22 pts', away: 'Adebayo · 18 pts' },
    },
  },
  {
    id: 'L002',
    sport: 'Football',
    homeTeam: 'Guinée',
    awayTeam: 'Bénin',
    homeCode: 'GN',
    awayCode: 'BJ',
    homeScore: 1,
    awayScore: 1,
    period: "72'",                   // Current minute of the football match
    stats: {
      lines: [
        { label: 'Possession', home: 54, away: 46, pct: true }, // Ball possession — must sum to ~100 %
        { label: 'Tirs', home: 12, away: 9 },                   // Total shots (on or off target)
        { label: 'Tirs cadrés', home: 5, away: 4 },             // Shots on target (goalkeeper had to act)
        { label: 'Corners', home: 6, away: 3 },                 // Corner kicks earned
        { label: 'Fautes', home: 14, away: 17 },                // Fouls committed
        { label: 'Hors-jeux', home: 3, away: 2 },               // Offside calls against each team
      ] as StatLine[],
      // Scorers with the minute of each goal — feeds the match timeline widget
      highlight: { label: 'Buteurs', home: 'Camara · 34\'', away: 'Dossou · 61\'' },
    },
  },
  {
    id: 'L003',
    sport: 'Handball',
    homeTeam: 'Maroc',
    awayTeam: 'Tunisie',
    homeCode: 'MA',
    awayCode: 'TN',
    homeScore: 24,
    awayScore: 19,
    period: 'Mi-temps 2',           // Second half underway
    stats: {
      lines: [
        { label: 'Tirs au but', home: 38, away: 31 },      // Total shots attempted on goal
        { label: 'Tirs cadrés', home: 24, away: 19 },      // Shots on target (= current score + saved)
        { label: 'Arrêts gardien', home: 12, away: 14 },   // Saves made by each goalkeeper
        { label: '7m accordés', home: 2, away: 3 },        // Penalty shots (7-metre throws) awarded
        { label: 'Exclusions 2 min', home: 4, away: 6 },   // 2-minute suspensions (yellow card equivalent)
        { label: 'Cartons rouges', home: 0, away: 1 },     // Direct red cards — player ejected for the match
      ] as StatLine[],
      highlight: { label: 'Top marqueurs', home: 'Ait El Hadj · 8 buts', away: 'Ben Romdhane · 7 buts' },
    },
  },
];

// TRANSPORT lists the transport options available to the user right now
export const TRANSPORT = [
  {
    id: 'TR001',
    type: 'shuttle',                         // 'shuttle' = official games bus (fixed route & schedule)
    name: 'Navette Officielle',
    from: 'Aéroport AIBD',                  // Departure point
    to: 'Centre des Médias',               // Destination
    nextDeparture: '14:35',                 // Time of the very next available bus
    duration: '45 min',                     // Estimated travel time for this route
    available: 12,                          // Seats still available on the next bus
    icon: 'bus-outline' as const,           // Ionicon used to illustrate this transport type
  },
  {
    id: 'TR002',
    type: 'yango',                          // 'yango' = on-demand ride-hailing (like Uber)
    name: 'Yango Ride',
    from: 'Ma position',                    // Dynamic — will be replaced by GPS coordinates at runtime
    to: 'Dakar Arena',
    estimate: "8 min d'attente",            // Estimated wait time for the next available driver
    price: '2 500 XOF',                    // Fare estimate shown before the user confirms booking
    icon: 'car-outline' as const,
  },
  {
    id: 'TR003',
    type: 'shuttle',
    name: 'Bus Athlètes',                   // Dedicated shuttle reserved for athletes / accredited staff
    from: 'Village Olympique',
    to: 'Stade Léopold Sédar Senghor',
    nextDeparture: '15:00',
    duration: '20 min',
    available: 5,                           // Low availability — the UI can highlight this in orange/red
    icon: 'bus-outline' as const,
  },
];

// TRANSACTIONS is the wallet history — most recent entries first
export const TRANSACTIONS = [
  // type: 'debit' = money spent; 'credit' = money added to the wallet
  { id: 'TX001', type: 'debit' as const,  label: 'Snack Bar Zone A',          amount: 3500,  date: "Aujourd'hui · 12:34", icon: 'restaurant-outline' as const },   // Food purchase inside the venue
  { id: 'TX002', type: 'credit' as const, label: 'Rechargement Orange Money',  amount: 25000, date: "Aujourd'hui · 09:00", icon: 'add-circle-outline' as const },   // Top-up via Orange Money mobile payment
  { id: 'TX003', type: 'debit' as const,  label: 'Maillot Officiel JOJ',      amount: 18000, date: 'Hier · 18:45',        icon: 'shirt-outline' as const },         // Official games merchandise purchase
  { id: 'TX004', type: 'debit' as const,  label: 'Course Yango',              amount: 2500,  date: 'Hier · 14:20',        icon: 'car-outline' as const },           // Yango ride charged to the wallet
  { id: 'TX005', type: 'credit' as const, label: 'Rechargement Wave',         amount: 50000, date: '26 Jul · 10:15',      icon: 'phone-portrait-outline' as const },// Top-up via Wave mobile money
];

// NOTIFICATIONS is the in-app notification feed, newest first
export const NOTIFICATIONS = [
  {
    id: 'N001',
    icon: 'radio-outline' as const,   // Radio icon = LIVE broadcast alert
    color: '#E63946',                 // Red — used for urgent / live-score alerts
    title: 'LIVE · Basketball',
    body: 'Sénégal mène 67-54 face au Nigéria (Q3 · 5:23)', // Live score update pushed in real time
    time: 'Il y a 2 min',            // Human-readable relative timestamp
    read: false,                      // false = unread → shown with a blue dot indicator
  },
  {
    id: 'N002',
    icon: 'ticket-outline' as const,
    color: '#FF6B35',                 // Orange — used for ticket/event reminders
    title: 'Rappel · Billet actif',
    body: "Cérémonie d'ouverture dans 3h — Stade Léopold Sédar Senghor", // Countdown reminder before event
    time: 'Il y a 15 min',
    read: false,
  },
  {
    id: 'N003',
    icon: 'bus-outline' as const,
    color: '#4A90E2',                 // Blue — used for transport / logistical alerts
    title: 'Navette AIBD → Centre Médias',
    body: 'Prochain départ dans 8 min · 12 places disponibles', // Departure countdown + seat availability
    time: 'Il y a 22 min',
    read: true,                       // true = already read → no dot, slightly dimmed in the list
  },
  {
    id: 'N004',
    icon: 'football-outline' as const,
    color: '#E63946',
    title: 'BUT · Football',
    body: "Guinée 1 - 1 Bénin · 61ème minute — Égalisation de Dossou", // Goal alert with scorer and minute
    time: 'Il y a 34 min',
    read: true,
  },
  {
    id: 'N005',
    icon: 'wallet-outline' as const,
    color: '#C9A84C',                 // Gold — used for wallet / financial notifications
    title: 'Rechargement confirmé',
    body: '+25 000 XOF ajoutés via Orange Money',  // Confirms the top-up from TX002
    time: "Aujourd'hui · 09:00",
    read: true,
  },
  {
    id: 'N006',
    icon: 'medal-outline' as const,
    color: '#C9A84C',                 // Gold medal icon color — matches the medal type
    title: 'Médaille d\'or · Judo',
    body: "Le Sénégal remporte l'or en Judo -66kg — Finale terminée", // Result of event E005
    time: "Hier · 18:30",
    read: true,
  },
];

// MEDAL_TABLE is the official countries ranking sorted by gold medals (then silver, then bronze)
export const MEDAL_TABLE = [
  { rank: 1, country: 'Sénégal',      code: 'SN', gold: 7, silver: 4, bronze: 5 }, // Host nation leads the table
  { rank: 2, country: 'Maroc',        code: 'MA', gold: 5, silver: 6, bronze: 3 },
  { rank: 3, country: 'Algérie',      code: 'DZ', gold: 4, silver: 3, bronze: 7 },
  { rank: 4, country: "Côte d'Ivoire",code: 'CI', gold: 3, silver: 5, bronze: 2 },
  { rank: 5, country: 'Cameroun',     code: 'CM', gold: 2, silver: 3, bronze: 4 },
];
