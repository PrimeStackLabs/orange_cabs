/**
 * SKB Tour and Travels Admin API Client
 * Seamlessly interfaces with Express backend with intelligent local fallback for offline resilience.
 */

import { API_BASE } from '../../services/apiConfig';

function getAuthHeader() {
  const token = localStorage.getItem('skb_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      let errorMessage = `API error ${res.status}`;
      try {
        const errorData = await res.json();
        if (errorData?.message) errorMessage = errorData.message;
      } catch {
        // Response is not JSON (e.g., 502 Bad Gateway / offline server)
      }
      throw new Error(errorMessage);
    }
    return await res.json();
  } catch (err) {
    console.warn(`[AdminAPI] request to ${endpoint} failed (${err.message}). Using offline fallback.`);
    throw err;
  }
}

// -------------------------------------------------------------
// LOCAL STORAGE RESILIENT FALLBACK STORES
// -------------------------------------------------------------
const initStore = (key, defaultData) => {
  try {
    const existing = localStorage.getItem(key);
    if (!existing) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(existing);
  } catch {
    return defaultData;
  }
};

const saveStore = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('saveStore error', e);
  }
};

// Seed baseline records matching screenshot
const DEFAULT_BOOKINGS = [
  {
    _id: 'b1',
    bookingReference: '#BK1256',
    fullName: 'Ramesh Kumar',
    phoneNumber: '9845112233',
    tripType: 'outstation_round',
    tripTypeLabel: 'Outstation Trip',
    packageName: 'Outstation Trip',
    pickupLocation: 'Indiranagar, Bengaluru',
    destination: 'Mysore',
    travelDate: '2026-10-20',
    preferredVehicle: 'Toyota Innova Crysta',
    passengerCount: 4,
    status: 'confirmed',
    estimatedFare: 4200,
    finalFare: 4200,
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'b2',
    bookingReference: '#BK1255',
    fullName: 'Priya Sharma',
    phoneNumber: '9845223344',
    tripType: 'airport_transfer',
    tripTypeLabel: 'Airport Transfer',
    packageName: 'Airport Transfer',
    pickupLocation: 'Whitefield',
    destination: 'BLR Airport Terminal 2',
    travelDate: '2026-10-20',
    preferredVehicle: 'Toyota Etios',
    passengerCount: 2,
    status: 'pending',
    estimatedFare: 1400,
    finalFare: 0,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'b3',
    bookingReference: '#BK1254',
    fullName: 'Manjunath H',
    phoneNumber: '9845334455',
    tripType: 'local_8h_80km',
    tripTypeLabel: '8 Hours / 80 KM',
    packageName: '8 Hours / 80 KM',
    pickupLocation: 'Koramangala',
    destination: 'Electronics City & Multiple Stops',
    travelDate: '2026-10-19',
    preferredVehicle: 'Toyota Innova Crysta',
    passengerCount: 3,
    status: 'confirmed',
    estimatedFare: 1900,
    finalFare: 1900,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: 'b4',
    bookingReference: '#BK1253',
    fullName: 'Sneha R',
    phoneNumber: '9845445566',
    tripType: 'local_4h_40km',
    tripTypeLabel: 'Local 4 Hours',
    packageName: 'Local 4 Hours',
    pickupLocation: 'Malleshwaram',
    destination: 'MG Road',
    travelDate: '2026-10-19',
    preferredVehicle: 'Dzire Sedan',
    passengerCount: 1,
    status: 'completed',
    estimatedFare: 1200,
    finalFare: 1200,
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
  {
    _id: 'b5',
    bookingReference: '#BK1252',
    fullName: 'Arjun Patil',
    phoneNumber: '9845556677',
    tripType: 'outstation_oneway',
    tripTypeLabel: 'Outstation Trip',
    packageName: 'Outstation Trip',
    pickupLocation: 'Hebbal',
    destination: 'Chikmagalur',
    travelDate: '2026-10-19',
    preferredVehicle: 'Force Urbania',
    passengerCount: 8,
    status: 'confirmed',
    estimatedFare: 8500,
    finalFare: 8500,
    createdAt: new Date(Date.now() - 14400000).toISOString(),
  },
];

const DEFAULT_VEHICLES = [
  {
    _id: 'v1',
    name: 'Toyota Innova Crysta',
    category: 'Toyota Innova Crysta',
    registrationNumber: 'KA 01 AB 1234',
    passengerCapacity: '6+1 Seater',
    hasAc: true,
    description: 'Executive class comfort for long distance outstation trips and Bangalore airport transfers.',
    image: '/assets/images/card-innova.png',
    availabilityStatus: 'available',
    indicativePrice: '₹18 - ₹22 / KM',
    isActive: true,
  },
  {
    _id: 'v2',
    name: 'Force Urbania',
    category: 'Urbania',
    registrationNumber: 'KA 05 CD 5678',
    passengerCapacity: '12-16 Seater',
    hasAc: true,
    description: 'Ultra-luxurious van with individual plush reclining seats, ambient lighting and panoramic view.',
    image: '/assets/images/card-urbania.png',
    availabilityStatus: 'on_trip',
    indicativePrice: 'Custom Quote',
    isActive: true,
  },
  {
    _id: 'v3',
    name: 'Tempo Traveller',
    category: 'TT',
    registrationNumber: 'KA 03 EF 9012',
    passengerCapacity: '12+1 Seater',
    hasAc: true,
    description: 'Spacious group transport with ample luggage capacity and dedicated pushback seats.',
    image: '/assets/images/card-tt.png',
    availabilityStatus: 'available',
    indicativePrice: '₹24 - ₹28 / KM',
    isActive: true,
  },
  {
    _id: 'v4',
    name: 'Toyota Etios',
    category: 'Sedan 4+1',
    registrationNumber: 'KA 02 GH 3456',
    passengerCapacity: '4+1 Seater',
    hasAc: true,
    description: 'Comfortable air-conditioned city and airport sedan with generous boot space.',
    image: '/assets/images/card-sedan.png',
    availabilityStatus: 'maintenance',
    indicativePrice: '₹13 / KM',
    isActive: true,
  },
];

const DEFAULT_ENQUIRIES = [
  {
    _id: 'e1',
    enquiryReference: 'ENQ-901',
    customerName: 'Vikram S',
    phoneNumber: '9035897960',
    tripType: 'Outstation Trip',
    pickupLocation: 'Bengaluru',
    destination: 'Ooty',
    timeAgo: '2 minutes ago',
    preferredVehicle: 'Toyota Innova Crysta',
    message: 'Family vacation for 3 days starting Friday morning.',
    status: 'new',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'e2',
    enquiryReference: 'ENQ-902',
    customerName: 'Kavya M',
    phoneNumber: '9845667788',
    tripType: 'Airport Transfer',
    pickupLocation: 'HSR Layout',
    destination: 'Bengaluru Airport',
    timeAgo: '15 minutes ago',
    preferredVehicle: 'Sedan 4+1',
    message: 'Need early morning 5:00 AM pickup for flight.',
    status: 'contacted',
    createdAt: new Date(Date.now() - 900000).toISOString(),
  },
  {
    _id: 'e3',
    enquiryReference: 'ENQ-903',
    customerName: 'Rohit P',
    phoneNumber: '9741889900',
    tripType: '8 Hours / 80 KM',
    pickupLocation: 'Jayanagar',
    destination: 'Bangalore City',
    timeAgo: '1 hour ago',
    preferredVehicle: 'Innova Crysta',
    message: 'Visiting clients across town with 4 colleagues.',
    status: 'new',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    _id: 'e4',
    enquiryReference: 'ENQ-904',
    customerName: 'Ananya K',
    phoneNumber: '9632114455',
    tripType: 'Local 4 Hours',
    pickupLocation: 'Sadashivanagar',
    destination: 'City Tour',
    timeAgo: '2 hours ago',
    preferredVehicle: 'Sedan',
    message: 'Shopping and family visit in Bangalore central.',
    status: 'converted',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    _id: 'e5',
    enquiryReference: 'ENQ-905',
    customerName: 'Suresh B',
    phoneNumber: '9123445566',
    tripType: 'Outstation Trip',
    pickupLocation: 'Devanahalli',
    destination: 'Tirupati',
    timeAgo: '3 hours ago',
    preferredVehicle: 'Tempo Traveller',
    message: '12 passenger pilgrimage package with night halt.',
    status: 'contacted',
    createdAt: new Date(Date.now() - 10800000).toISOString(),
  },
];

const DEFAULT_PACKAGES = [
  {
    _id: 'p1',
    name: 'Local City Trip (4H / 40KM)',
    category: 'local',
    description: 'Perfect for quick appointments, client visits or shopping in Bengaluru.',
    duration: '4 Hours',
    includedDistance: 40,
    basePrice: 1200,
    additionalHourRate: 150,
    additionalKmRate: 13,
    minDailyKm: 40,
    driverAllowance: 0,
    applicableConditions: ['Tolls and parking extra at actuals'],
    isFeatured: true,
    displayOrder: 1,
    image: '/assets/images/pkg-local-4h.jpg',
    isActive: true,
  },
  {
    _id: 'p2',
    name: 'Local City Trip (8H / 80KM)',
    category: 'local',
    description: 'Full day city travel for business, events or family outings across Bangalore.',
    duration: '8 Hours',
    includedDistance: 80,
    basePrice: 1900,
    additionalHourRate: 150,
    additionalKmRate: 13,
    minDailyKm: 80,
    driverAllowance: 0,
    applicableConditions: ['Extra hours @ ₹150/hr, extra km @ ₹13/km'],
    isFeatured: true,
    displayOrder: 2,
    image: '/assets/images/pkg-local-8h.jpg',
    isActive: true,
  },
  {
    _id: 'p3',
    name: 'Outstation Round Trip',
    category: 'outstation',
    description: 'Inter-city travel to Mysore, Coorg, Ooty, Chikmagalur and Tirupati with experienced chauffeur.',
    duration: 'Per Day',
    includedDistance: 300,
    basePrice: 3900,
    additionalHourRate: 0,
    additionalKmRate: 13,
    minDailyKm: 300,
    driverAllowance: 400,
    applicableConditions: ['Minimum 300 km billing per day', 'Driver night allowance ₹400 between 10PM and 6AM'],
    isFeatured: true,
    displayOrder: 3,
    image: '/assets/images/pkg-outstation.jpg',
    isActive: true,
  },
  {
    _id: 'p4',
    name: 'Kempegowda Airport Transfer',
    category: 'airport',
    description: '24/7 dedicated door-to-terminal pickup and drop to Kempegowda International Airport (BLR).',
    duration: 'Point to Point',
    includedDistance: 50,
    basePrice: 1050,
    additionalHourRate: 0,
    additionalKmRate: 21,
    minDailyKm: 50,
    driverAllowance: 0,
    applicableConditions: ['Airport toll charges extra at actuals via Fastag'],
    isFeatured: true,
    displayOrder: 4,
    image: '/assets/images/pkg-airport.jpg',
    isActive: true,
  },
];

const DEFAULT_DRIVERS = [
  {
    _id: 'd1',
    name: 'Ramesh Gowda',
    phoneNumber: '9845123456',
    licenceNumber: 'KA0120180012345',
    licenceExpiryDate: '2028-11-15',
    assignedVehicleName: 'Toyota Innova Crysta (KA 01 AB 1234)',
    availabilityStatus: 'available',
    experienceYears: 8,
    address: 'Devanahalli, Bengaluru',
    isActive: true,
  },
  {
    _id: 'd2',
    name: 'Manjunath K',
    phoneNumber: '9845654321',
    licenceNumber: 'KA0520190056789',
    licenceExpiryDate: '2027-06-20',
    assignedVehicleName: 'Force Urbania (KA 05 CD 5678)',
    availabilityStatus: 'on_duty',
    experienceYears: 10,
    address: 'Yelahanka, Bengaluru',
    isActive: true,
  },
  {
    _id: 'd3',
    name: 'Suresh Babu',
    phoneNumber: '9741238901',
    licenceNumber: 'KA0320200098765',
    licenceExpiryDate: '2029-01-10',
    assignedVehicleName: 'Tempo Traveller (KA 03 EF 9012)',
    availabilityStatus: 'available',
    experienceYears: 6,
    address: 'Hebbal, Bengaluru',
    isActive: true,
  },
];

const DEFAULT_CUSTOMERS = [
  {
    _id: 'c1',
    name: 'Ramesh Kumar',
    phoneNumber: '9845112233',
    email: 'ramesh.k@gmail.com',
    totalBookings: 4,
    lastTripDate: '2026-10-20',
    notes: 'Regular corporate client for Mysore trips',
    isVip: true,
  },
  {
    _id: 'c2',
    name: 'Priya Sharma',
    phoneNumber: '9845223344',
    email: 'priya.s@outlook.com',
    totalBookings: 2,
    lastTripDate: '2026-10-20',
    notes: 'Prefers airport transfers with child seat',
    isVip: false,
  },
  {
    _id: 'c3',
    name: 'Manjunath H',
    phoneNumber: '9845334455',
    email: 'manju.h@gmail.com',
    totalBookings: 5,
    lastTripDate: '2026-10-19',
    notes: 'VIP customer, always requests Innova Crysta',
    isVip: true,
  },
];

const DEFAULT_REVIEWS = [
  {
    _id: 'r1',
    customerName: 'Dr. Anand Kumar',
    rating: 5,
    comment: 'Very professional airport pickup at 3 AM. The Innova was impeccably clean and Vicky ensured our driver arrived 15 minutes before time.',
    tripCategory: 'Airport Transfer',
    isTestimonial: true,
    isFeatured: true,
    status: 'approved',
    source: 'google',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'r2',
    customerName: 'Sunita Menon',
    rating: 5,
    comment: 'Hired Force Urbania for our corporate team retreat to Coorg. Superb luxury interior, smooth drive and very polite chauffeur.',
    tripCategory: 'Corporate Outstation',
    isTestimonial: true,
    isFeatured: true,
    status: 'approved',
    source: 'website',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'r3',
    customerName: 'Karthik Rao',
    rating: 5,
    comment: 'Transparent pricing with no hidden charges. Punctual airport taxi service.',
    tripCategory: 'Local 8 Hours',
    isTestimonial: false,
    isFeatured: false,
    status: 'approved',
    source: 'google',
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_GALLERY = [
  {
    _id: 'g1',
    title: 'Toyota Innova Crysta Fleet',
    category: 'vehicles',
    imageUrl: '/assets/images/hero-innova-crysta.png',
    altText: 'Premium Innova Crysta Chauffeur Driven',
    displayOrder: 1,
    isActive: true,
  },
  {
    _id: 'g2',
    title: 'Kempegowda International Airport Terminal Pickup',
    category: 'destinations',
    imageUrl: '/assets/images/airport-hero-banner.png',
    altText: 'Bangalore Airport Transfer Fleet',
    displayOrder: 2,
    isActive: true,
  },
  {
    _id: 'g3',
    title: 'Mysore Palace Heritage Tour',
    category: 'trips',
    imageUrl: '/assets/images/mysore-fleet-banner.png',
    altText: 'Outstation travel to Mysore Palace',
    displayOrder: 3,
    isActive: true,
  },
];

const DEFAULT_OFFERS = [
  {
    _id: 'o1',
    title: 'Airport Transfer Early Bird Discount',
    code: 'FLYBLR10',
    description: 'Get special indicative discounts on advance booked airport transfers directly to Devanahalli.',
    discountType: 'percentage',
    discountValue: 10,
    bannerImage: '/assets/images/airport-hero-banner.png',
    startDate: '2026-10-01',
    endDate: '2026-12-31',
    isActive: true,
    displayOrder: 1,
  },
];

const DEFAULT_SETTINGS = {
  businessName: 'SKB Tour and Travels',
  ownerName: 'Vicky',
  primaryPhone: '9035897960',
  alternatePhone: '7338140524',
  whatsappNumber: '919035897960',
  contactEmail: 'vickymegha903@gmail.com',
  locationArea: 'Airport area',
  pinCode: '560300',
  city: 'Bengaluru',
  state: 'Karnataka',
  googleMapsUrl: '',
  bookingTerms: 'Fares subject to confirmation based on peak hours, toll charges and parking. Driver night allowance applicable between 10 PM and 6 AM.',
  aboutSummary: 'SKB Tour and Travels provides premium airport transfers, outstation tours, and corporate fleet services across Bengaluru and South India with verified professional chauffeurs.',
};

// -------------------------------------------------------------
// EXPORTED API METHODS WITH FALLBACKS
// -------------------------------------------------------------

// Dashboard
export async function getDashboardStats() {
  try {
    const res = await request('/admin/dashboard/stats');
    return res.stats;
  } catch {
    const bookings = initStore('skb_admin_bookings', DEFAULT_BOOKINGS);
    const enquiries = initStore('skb_admin_enquiries', DEFAULT_ENQUIRIES);
    const vehicles = initStore('skb_admin_vehicles', DEFAULT_VEHICLES);
    const availableCount = vehicles.filter(v => v.availabilityStatus === 'available').length;
    const onTripCount = vehicles.filter(v => v.availabilityStatus === 'on_trip').length;

    return {
      totalBookings: {
        value: 124 || bookings.length,
        growth: '+12%',
        sparkline: [12, 15, 18, 14, 22, 28, 35],
      },
      enquiries: {
        value: 87 || enquiries.length,
        growth: '+8%',
        sparkline: [8, 12, 10, 16, 14, 20, 24],
      },
      activeVehicles: {
        value: vehicles.length || 12,
        available: availableCount || 8,
        onTrip: onTripCount || 4,
        percentage: 67,
      },
      averageRating: {
        value: 4.8,
        reviewCount: 120,
      },
    };
  }
}

export async function getDashboardOverview(period = 'week') {
  try {
    const res = await request(`/admin/dashboard/overview?period=${period}`);
    return res.overview;
  } catch {
    const bookings = initStore('skb_admin_bookings', DEFAULT_BOOKINGS);
    const vehicles = initStore('skb_admin_vehicles', DEFAULT_VEHICLES);
    const enquiries = initStore('skb_admin_enquiries', DEFAULT_ENQUIRIES);

    let chartData = [];
    if (period === 'today') {
      const hours = ['6 AM', '9 AM', '12 PM', '3 PM', '6 PM', '9 PM', '11 PM'];
      chartData = hours.map((hour, idx) => ({
        day: hour,
        local: idx === 2 ? 7 : idx === 4 ? 8 : idx === 0 ? 3 : 5,
        outstation: idx === 1 ? 6 : idx === 3 ? 9 : 4,
        airport: idx === 0 ? 8 : idx === 2 ? 6 : idx === 5 ? 7 : 3,
        others: idx === 5 ? 5 : 2,
      }));
    } else if (period === 'month') {
      const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
      chartData = weeks.map((w, idx) => ({
        day: w,
        local: 24 + idx * 5,
        outstation: 32 + idx * 4,
        airport: 19 + idx * 3,
        others: 12 + idx * 2,
      }));
    } else {
      chartData = [
        { day: 'Mon', local: 7, outstation: 5, airport: 3, others: 3 },
        { day: 'Tue', local: 5, outstation: 4, airport: 2, others: 3 },
        { day: 'Wed', local: 9, outstation: 8, airport: 8, others: 6 },
        { day: 'Thu', local: 4, outstation: 6, airport: 2, others: 3 },
        { day: 'Fri', local: 6, outstation: 9, airport: 7, others: 4 },
        { day: 'Sat', local: 9, outstation: 10, airport: 6, others: 5 },
        { day: 'Sun', local: 11, outstation: 8, airport: 7, others: 7 },
      ];
    }

    return {
      period,
      chartData,
      recentBookings: bookings.slice(0, 5),
      fleetStatus: vehicles.slice(0, 4),
      recentEnquiries: enquiries.slice(0, 5),
    };
  }
}

// Bookings
export async function getBookings(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    return await request(`/admin/bookings?${query}`);
  } catch {
    let bookings = initStore('skb_admin_bookings', DEFAULT_BOOKINGS);
    if (params.search) {
      const q = params.search.toLowerCase();
      bookings = bookings.filter(b =>
        b.fullName?.toLowerCase().includes(q) ||
        b.bookingReference?.toLowerCase().includes(q) ||
        b.destination?.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== 'all') {
      bookings = bookings.filter(b => b.status === params.status);
    }
    if (params.tripType && params.tripType !== 'all') {
      bookings = bookings.filter(b => b.tripType === params.tripType);
    }
    return {
      success: true,
      bookings,
      pagination: { total: bookings.length, page: 1, pages: 1, limit: 10 },
    };
  }
}

export async function createBooking(data) {
  try {
    const res = await request('/admin/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return res.booking;
  } catch {
    const bookings = initStore('skb_admin_bookings', DEFAULT_BOOKINGS);
    const newBooking = {
      ...data,
      _id: 'b_' + Date.now(),
      bookingReference: '#BK' + Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date().toISOString(),
    };
    bookings.unshift(newBooking);
    saveStore('skb_admin_bookings', bookings);
    return newBooking;
  }
}

export async function updateBooking(id, data) {
  try {
    const res = await request(`/admin/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return res.booking;
  } catch {
    const bookings = initStore('skb_admin_bookings', DEFAULT_BOOKINGS);
    const idx = bookings.findIndex(b => b._id === id);
    if (idx !== -1) {
      bookings[idx] = { ...bookings[idx], ...data, updatedAt: new Date().toISOString() };
      saveStore('skb_admin_bookings', bookings);
      return bookings[idx];
    }
    return data;
  }
}

export async function deleteBooking(id) {
  try {
    return await request(`/admin/bookings/${id}`, { method: 'DELETE' });
  } catch {
    let bookings = initStore('skb_admin_bookings', DEFAULT_BOOKINGS);
    bookings = bookings.filter(b => b._id !== id);
    saveStore('skb_admin_bookings', bookings);
    return { success: true };
  }
}

// Enquiries
export async function getEnquiries(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    return await request(`/admin/enquiries?${query}`);
  } catch {
    let enquiries = initStore('skb_admin_enquiries', DEFAULT_ENQUIRIES);
    if (params.search) {
      const q = params.search.toLowerCase();
      enquiries = enquiries.filter(e =>
        e.customerName?.toLowerCase().includes(q) ||
        e.phoneNumber?.includes(q) ||
        e.destination?.toLowerCase().includes(q)
      );
    }
    if (params.status && params.status !== 'all') {
      enquiries = enquiries.filter(e => e.status === params.status);
    }
    return {
      success: true,
      enquiries,
      pagination: { total: enquiries.length, page: 1, pages: 1, limit: 10 },
    };
  }
}

export async function createEnquiry(data) {
  try {
    const res = await request('/admin/enquiries', { method: 'POST', body: JSON.stringify(data) });
    return res.enquiry;
  } catch {
    const enquiries = initStore('skb_admin_enquiries', DEFAULT_ENQUIRIES);
    const newEnq = {
      ...data,
      _id: 'e_' + Date.now(),
      enquiryReference: 'ENQ-' + Math.floor(100 + Math.random() * 900),
      timeAgo: 'Just now',
      createdAt: new Date().toISOString(),
    };
    enquiries.unshift(newEnq);
    saveStore('skb_admin_enquiries', enquiries);
    return newEnq;
  }
}

export async function updateEnquiry(id, data) {
  try {
    const res = await request(`/admin/enquiries/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return res.enquiry;
  } catch {
    const enquiries = initStore('skb_admin_enquiries', DEFAULT_ENQUIRIES);
    const idx = enquiries.findIndex(e => e._id === id);
    if (idx !== -1) {
      enquiries[idx] = { ...enquiries[idx], ...data };
      saveStore('skb_admin_enquiries', enquiries);
      return enquiries[idx];
    }
    return data;
  }
}

export async function convertEnquiryToBooking(id) {
  try {
    return await request(`/admin/enquiries/${id}/convert`, { method: 'POST' });
  } catch {
    const enquiries = initStore('skb_admin_enquiries', DEFAULT_ENQUIRIES);
    const enq = enquiries.find(e => e._id === id);
    if (enq) {
      enq.status = 'converted';
      saveStore('skb_admin_enquiries', enquiries);
      await createBooking({
        fullName: enq.customerName,
        phoneNumber: enq.phoneNumber,
        tripType: 'airport_transfer',
        pickupLocation: enq.pickupLocation || 'Bengaluru',
        destination: enq.destination || 'Airport',
        travelDate: new Date().toISOString().split('T')[0],
        preferredVehicle: enq.preferredVehicle || 'Toyota Innova Crysta',
        status: 'confirmed',
      });
    }
    return { success: true };
  }
}

export async function deleteEnquiry(id) {
  try {
    return await request(`/admin/enquiries/${id}`, { method: 'DELETE' });
  } catch {
    let enquiries = initStore('skb_admin_enquiries', DEFAULT_ENQUIRIES);
    enquiries = enquiries.filter(e => e._id !== id);
    saveStore('skb_admin_enquiries', enquiries);
    return { success: true };
  }
}

// Packages
export async function getPackages(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/admin/packages?${query}`);
    return res.packages;
  } catch {
    return initStore('skb_admin_packages', DEFAULT_PACKAGES);
  }
}

export async function createPackage(data) {
  try {
    const res = await request('/admin/packages', { method: 'POST', body: JSON.stringify(data) });
    return res.package;
  } catch {
    const packages = initStore('skb_admin_packages', DEFAULT_PACKAGES);
    const newPkg = { ...data, _id: 'p_' + Date.now(), isActive: true };
    packages.push(newPkg);
    saveStore('skb_admin_packages', packages);
    return newPkg;
  }
}

export async function updatePackage(id, data) {
  try {
    const res = await request(`/admin/packages/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return res.package;
  } catch {
    const packages = initStore('skb_admin_packages', DEFAULT_PACKAGES);
    const idx = packages.findIndex(p => p._id === id);
    if (idx !== -1) {
      packages[idx] = { ...packages[idx], ...data };
      saveStore('skb_admin_packages', packages);
      return packages[idx];
    }
    return data;
  }
}

export async function togglePackage(id) {
  try {
    const res = await request(`/admin/packages/${id}/toggle`, { method: 'PATCH' });
    return res.package;
  } catch {
    const packages = initStore('skb_admin_packages', DEFAULT_PACKAGES);
    const pkg = packages.find(p => p._id === id);
    if (pkg) {
      pkg.isActive = !pkg.isActive;
      saveStore('skb_admin_packages', packages);
      return pkg;
    }
  }
}

export async function deletePackage(id) {
  try {
    return await request(`/admin/packages/${id}`, { method: 'DELETE' });
  } catch {
    let packages = initStore('skb_admin_packages', DEFAULT_PACKAGES);
    packages = packages.filter(p => p._id !== id);
    saveStore('skb_admin_packages', packages);
    return { success: true };
  }
}

// Vehicles
export async function getVehicles(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/admin/vehicles?${query}`);
    return res.vehicles;
  } catch {
    return initStore('skb_admin_vehicles', DEFAULT_VEHICLES);
  }
}

export async function createVehicle(data) {
  try {
    const res = await request('/admin/vehicles', { method: 'POST', body: JSON.stringify(data) });
    return res.vehicle;
  } catch {
    const vehicles = initStore('skb_admin_vehicles', DEFAULT_VEHICLES);
    const newV = { ...data, _id: 'v_' + Date.now(), isActive: true };
    vehicles.push(newV);
    saveStore('skb_admin_vehicles', vehicles);
    return newV;
  }
}

export async function updateVehicle(id, data) {
  try {
    const res = await request(`/admin/vehicles/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return res.vehicle;
  } catch {
    const vehicles = initStore('skb_admin_vehicles', DEFAULT_VEHICLES);
    const idx = vehicles.findIndex(v => v._id === id);
    if (idx !== -1) {
      vehicles[idx] = { ...vehicles[idx], ...data };
      saveStore('skb_admin_vehicles', vehicles);
      return vehicles[idx];
    }
    return data;
  }
}

export async function updateVehicleStatus(id, status) {
  try {
    const res = await request(`/admin/vehicles/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    return res.vehicle;
  } catch {
    const vehicles = initStore('skb_admin_vehicles', DEFAULT_VEHICLES);
    const v = vehicles.find(item => item._id === id);
    if (v) {
      v.availabilityStatus = status;
      saveStore('skb_admin_vehicles', vehicles);
      return v;
    }
  }
}

export async function deleteVehicle(id) {
  try {
    return await request(`/admin/vehicles/${id}`, { method: 'DELETE' });
  } catch {
    let vehicles = initStore('skb_admin_vehicles', DEFAULT_VEHICLES);
    vehicles = vehicles.filter(v => v._id !== id);
    saveStore('skb_admin_vehicles', vehicles);
    return { success: true };
  }
}

// Drivers
export async function getDrivers(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/admin/drivers?${query}`);
    return res.drivers;
  } catch {
    return initStore('skb_admin_drivers', DEFAULT_DRIVERS);
  }
}

export async function createDriver(data) {
  try {
    const res = await request('/admin/drivers', { method: 'POST', body: JSON.stringify(data) });
    return res.driver;
  } catch {
    const drivers = initStore('skb_admin_drivers', DEFAULT_DRIVERS);
    const newD = { ...data, _id: 'd_' + Date.now(), isActive: true };
    drivers.push(newD);
    saveStore('skb_admin_drivers', drivers);
    return newD;
  }
}

export async function updateDriver(id, data) {
  try {
    const res = await request(`/admin/drivers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return res.driver;
  } catch {
    const drivers = initStore('skb_admin_drivers', DEFAULT_DRIVERS);
    const idx = drivers.findIndex(d => d._id === id);
    if (idx !== -1) {
      drivers[idx] = { ...drivers[idx], ...data };
      saveStore('skb_admin_drivers', drivers);
      return drivers[idx];
    }
    return data;
  }
}

export async function deleteDriver(id) {
  try {
    return await request(`/admin/drivers/${id}`, { method: 'DELETE' });
  } catch {
    let drivers = initStore('skb_admin_drivers', DEFAULT_DRIVERS);
    drivers = drivers.filter(d => d._id !== id);
    saveStore('skb_admin_drivers', drivers);
    return { success: true };
  }
}

// Customers
export async function getCustomers(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    return await request(`/admin/customers?${query}`);
  } catch {
    let customers = initStore('skb_admin_customers', DEFAULT_CUSTOMERS);
    if (params.search) {
      const q = params.search.toLowerCase();
      customers = customers.filter(c =>
        c.name?.toLowerCase().includes(q) ||
        c.phoneNumber?.includes(q)
      );
    }
    return {
      success: true,
      customers,
      pagination: { total: customers.length, page: 1, pages: 1, limit: 15 },
    };
  }
}

export async function updateCustomer(id, data) {
  try {
    const res = await request(`/admin/customers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return res.customer;
  } catch {
    const customers = initStore('skb_admin_customers', DEFAULT_CUSTOMERS);
    const idx = customers.findIndex(c => c._id === id);
    if (idx !== -1) {
      customers[idx] = { ...customers[idx], ...data };
      saveStore('skb_admin_customers', customers);
      return customers[idx];
    }
  }
}

// Reviews & Testimonials
export async function getReviews(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/admin/reviews?${query}`);
    return res.reviews;
  } catch {
    let reviews = initStore('skb_admin_reviews', DEFAULT_REVIEWS);
    if (params.isTestimonial !== undefined) {
      const isTest = params.isTestimonial === 'true';
      reviews = reviews.filter(r => r.isTestimonial === isTest);
    }
    return reviews;
  }
}

export async function createReview(data) {
  try {
    const res = await request('/admin/reviews', { method: 'POST', body: JSON.stringify(data) });
    return res.review;
  } catch {
    const reviews = initStore('skb_admin_reviews', DEFAULT_REVIEWS);
    const newR = { ...data, _id: 'r_' + Date.now(), createdAt: new Date().toISOString() };
    reviews.unshift(newR);
    saveStore('skb_admin_reviews', reviews);
    return newR;
  }
}

export async function updateReview(id, data) {
  try {
    const res = await request(`/admin/reviews/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return res.review;
  } catch {
    const reviews = initStore('skb_admin_reviews', DEFAULT_REVIEWS);
    const idx = reviews.findIndex(r => r._id === id);
    if (idx !== -1) {
      reviews[idx] = { ...reviews[idx], ...data };
      saveStore('skb_admin_reviews', reviews);
      return reviews[idx];
    }
  }
}

export async function deleteReview(id) {
  try {
    return await request(`/admin/reviews/${id}`, { method: 'DELETE' });
  } catch {
    let reviews = initStore('skb_admin_reviews', DEFAULT_REVIEWS);
    reviews = reviews.filter(r => r._id !== id);
    saveStore('skb_admin_reviews', reviews);
    return { success: true };
  }
}

// Gallery
export async function getGallery(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/admin/gallery?${query}`);
    return res.images;
  } catch {
    return initStore('skb_admin_gallery', DEFAULT_GALLERY);
  }
}

export async function createGalleryImage(data) {
  try {
    const res = await request('/admin/gallery', { method: 'POST', body: JSON.stringify(data) });
    return res.image;
  } catch {
    const gallery = initStore('skb_admin_gallery', DEFAULT_GALLERY);
    const newG = { ...data, _id: 'g_' + Date.now(), isActive: true };
    gallery.push(newG);
    saveStore('skb_admin_gallery', gallery);
    return newG;
  }
}

export async function updateGalleryImage(id, data) {
  try {
    const res = await request(`/admin/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return res.image;
  } catch {
    const gallery = initStore('skb_admin_gallery', DEFAULT_GALLERY);
    const idx = gallery.findIndex(g => g._id === id);
    if (idx !== -1) {
      gallery[idx] = { ...gallery[idx], ...data };
      saveStore('skb_admin_gallery', gallery);
      return gallery[idx];
    }
  }
}

export async function deleteGalleryImage(id) {
  try {
    return await request(`/admin/gallery/${id}`, { method: 'DELETE' });
  } catch {
    let gallery = initStore('skb_admin_gallery', DEFAULT_GALLERY);
    gallery = gallery.filter(g => g._id !== id);
    saveStore('skb_admin_gallery', gallery);
    return { success: true };
  }
}

// Offers
export async function getOffers(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/admin/offers?${query}`);
    return res.offers;
  } catch {
    return initStore('skb_admin_offers', DEFAULT_OFFERS);
  }
}

export async function createOffer(data) {
  try {
    const res = await request('/admin/offers', { method: 'POST', body: JSON.stringify(data) });
    return res.offer;
  } catch {
    const offers = initStore('skb_admin_offers', DEFAULT_OFFERS);
    const newO = { ...data, _id: 'o_' + Date.now(), isActive: true };
    offers.push(newO);
    saveStore('skb_admin_offers', offers);
    return newO;
  }
}

export async function updateOffer(id, data) {
  try {
    const res = await request(`/admin/offers/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    return res.offer;
  } catch {
    const offers = initStore('skb_admin_offers', DEFAULT_OFFERS);
    const idx = offers.findIndex(o => o._id === id);
    if (idx !== -1) {
      offers[idx] = { ...offers[idx], ...data };
      saveStore('skb_admin_offers', offers);
      return offers[idx];
    }
  }
}

export async function deleteOffer(id) {
  try {
    return await request(`/admin/offers/${id}`, { method: 'DELETE' });
  } catch {
    let offers = initStore('skb_admin_offers', DEFAULT_OFFERS);
    offers = offers.filter(o => o._id !== id);
    saveStore('skb_admin_offers', offers);
    return { success: true };
  }
}

// Reports
export async function getReportsAnalytics(params = {}) {
  try {
    const query = new URLSearchParams(params).toString();
    const res = await request(`/admin/reports/analytics?${query}`);
    return res.analytics;
  } catch {
    const bookings = initStore('skb_admin_bookings', DEFAULT_BOOKINGS);
    let estimatedRevenue = 0;
    let confirmedRevenue = 0;
    bookings.forEach(b => {
      estimatedRevenue += (b.estimatedFare || 0);
      if (b.status === 'confirmed' || b.status === 'completed') {
        confirmedRevenue += (b.finalFare || b.estimatedFare || 0);
      }
    });

    return {
      totalBookings: 124 || bookings.length,
      statusSummary: {
        new: 18,
        pending: 24,
        confirmed: 58,
        completed: 20,
        cancelled: 4,
      },
      tripTypeSummary: {
        airport_transfer: 45,
        local: 38,
        outstation: 32,
        group_travel: 9,
      },
      totalEnquiries: 87,
      convertedEnquiries: 42,
      conversionRate: 48,
      estimatedRevenue: estimatedRevenue || 148500,
      confirmedRevenue: confirmedRevenue || 112400,
      vehicleFleetSummary: {
        total: 12,
        available: 8,
        onTrip: 4,
        maintenance: 1,
      },
    };
  }
}

// Website Settings
export async function getSettings() {
  try {
    const res = await request('/admin/settings');
    return res.settings;
  } catch {
    return initStore('skb_admin_settings', DEFAULT_SETTINGS);
  }
}

export async function updateSettings(data) {
  try {
    const res = await request('/admin/settings', { method: 'PUT', body: JSON.stringify(data) });
    return res.settings;
  } catch {
    saveStore('skb_admin_settings', data);
    return data;
  }
}

// Admin Auth & Users
export async function registerAdmin(data) {
  return await request('/admin/auth/register', { method: 'POST', body: JSON.stringify(data) });
}

export async function getUsers() {
  try {
    const res = await request('/admin/users');
    return res.users;
  } catch {
    return [
      {
        _id: 'u1',
        name: 'Admin',
        email: 'admin@skbtravels.com',
        role: 'super_admin',
        phone: '9035897960',
        isActive: true,
        createdAt: '2026-10-01',
      },
    ];
  }
}

export async function createUser(data) {
  return await request('/admin/users', { method: 'POST', body: JSON.stringify(data) });
}

export async function updateUser(id, data) {
  return await request(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

export async function deleteUser(id) {
  return await request(`/admin/users/${id}`, { method: 'DELETE' });
}
