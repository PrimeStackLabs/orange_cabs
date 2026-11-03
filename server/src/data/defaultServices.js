const defaultServices = [
  {
    title: 'Airport Pickup & Drop',
    slug: 'airport-pickup-drop',
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=900&q=80',
    description: 'Book a vehicle for airport pickup or drop-off. Share your flight and pickup details when requesting a booking.',
    features: ['Airport Pickup', 'Airport Drop-off'],
    badge: 'Airport Travel',
    order: 1
  },
  {
    title: 'Local Travel',
    slug: 'local-travel',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
    description: 'Arrange point-to-point transportation for local journeys within your city.',
    features: ['Local Pickup', 'Flexible Destination'],
    badge: 'City Travel',
    order: 2
  },
  {
    title: 'Outstation Travel',
    slug: 'outstation-travel',
    image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=900&q=80',
    description: 'Plan an intercity journey with the vehicle category and route that suit your trip.',
    features: ['Intercity Travel', 'Category-based Per-kilometre Rates'],
    badge: 'Intercity',
    order: 3
  },
  {
    title: 'Corporate Travel',
    slug: 'corporate-travel',
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=900&q=80',
    description: 'Request transportation for business travel, team movement, or a corporate itinerary.',
    features: ['Business Travel', 'Team Transportation'],
    badge: 'Business',
    order: 4
  },
  {
    title: 'One-Way Transportation',
    slug: 'one-way-transportation',
    image: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=900&q=80',
    description: 'Book a direct trip from your pickup location to your destination.',
    features: ['Direct Pickup', 'Destination Drop-off'],
    badge: 'Direct Travel',
    order: 5
  },
  {
    title: 'Wedding & Event Transportation',
    slug: 'wedding-event-transportation',
    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=900&q=80',
    description: 'Coordinate transportation for wedding guests and event itineraries.',
    features: ['Event Transportation', 'Group Vehicle Options'],
    badge: 'Events',
    order: 6
  },
  {
    title: 'One-Day Packages',
    slug: 'one-day-packages',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    description: 'Request a vehicle for a day and share your itinerary for a confirmed quote.',
    features: ['Day-long Itinerary', 'Quote Confirmed Before Travel'],
    badge: 'Day Trips',
    order: 7
  },
  {
    title: 'Hourly Packages',
    slug: 'hourly-packages',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=900&q=80',
    description: 'Request an hourly city itinerary and confirm the applicable package in your quote.',
    features: ['Hourly Itinerary', 'Quote Confirmed Before Travel'],
    badge: 'Hourly Travel',
    order: 8
  }
];

export default defaultServices;
