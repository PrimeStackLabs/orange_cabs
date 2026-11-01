import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Enquiry from '../models/Enquiry.js';
import ChatMessage from '../models/ChatMessage.js';
import Testimonial from '../models/Testimonial.js';
import FAQ from '../models/FAQ.js';
import Gallery from '../models/Gallery.js';
import Setting from '../models/Setting.js';
import ActivityLog from '../models/ActivityLog.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/orangecab';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB');

    // Clear existing collections
    await Promise.all([
      Vehicle.deleteMany({}),
      Driver.deleteMany({}),
      Service.deleteMany({}),
      Booking.deleteMany({}),
      Enquiry.deleteMany({}),
      ChatMessage.deleteMany({}),
      Testimonial.deleteMany({}),
      FAQ.deleteMany({}),
      Gallery.deleteMany({}),
      Setting.deleteMany({}),
      ActivityLog.deleteMany({})
    ]);
    console.log('[Seed] Collections cleared');

    // 1. Admins
    const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    if (process.env.ADMIN_PASSWORD && adminEmail && !(await Admin.exists({ email: adminEmail }))) {
      await Admin.create({
        name: process.env.ADMIN_NAME?.trim() || 'Super Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD,
        role: 'Super Admin'
      });
    } else if (!await Admin.exists({})) {
      console.log('[Seed] No admin was created; configure ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD or run npm run create-admin.');
    }

    // 2. Vehicles (8 vehicles across categories: Hatchback, Sedan, SUV, Innova, Tempo Traveller, Luxury, Bus)
    const vehiclesData = [
      {
        name: 'Maruti Suzuki WagonR / Swift',
        category: 'Hatchback',
        registrationNumber: 'KA 01 HB 1010',
        seatingCapacity: 4,
        luggageCapacity: 2,
        ac: true,
        perKmRate: 11,
        baseFare: 600,
        features: ['AC Air Conditioning', 'Bluetooth Audio', 'Fast Mobile Charger', 'Clean Sanitized Cabin'],
        image: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
        fuelType: 'CNG',
        status: 'available',
        order: 1
      },
      {
        name: 'Maruti Suzuki Dzire',
        category: 'Sedan',
        registrationNumber: 'KA 01 MJ 1024',
        seatingCapacity: 4,
        luggageCapacity: 3,
        ac: true,
        perKmRate: 13,
        baseFare: 800,
        features: ['Dual Airbags', 'Dual Zone AC', 'Large Boot Space', 'USB Fast Charger', 'GPS Telematics'],
        image: '/images/fleet/maruti-dzire.webp',
        fuelType: 'CNG',
        status: 'available',
        order: 2
      },
      {
        name: 'Maruti Suzuki Ertiga Smart Hybrid',
        category: 'SUV',
        registrationNumber: 'KA 05 NR 4410',
        seatingCapacity: 6,
        luggageCapacity: 3,
        ac: true,
        perKmRate: 18,
        baseFare: 1200,
        features: ['Roof AC Vents', 'Captain Comfort Seats', 'High Ground Clearance', 'Rear Cup Holders'],
        image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80',
        fuelType: 'Petrol',
        status: 'available',
        order: 3
      },
      {
        name: 'Toyota Innova Crysta ZX',
        category: 'Innova',
        registrationNumber: 'KA 51 EA 9001',
        seatingCapacity: 7,
        luggageCapacity: 4,
        ac: true,
        perKmRate: 22,
        baseFare: 1600,
        features: ['Executive Plush Recliners', 'Independent AC Controls', 'Highway Ride Balance', 'Premium Sound'],
        image: '/images/fleet/innova-crysta-zx.webp',
        fuelType: 'Diesel',
        status: 'available',
        order: 4
      },
      {
        name: 'Toyota Innova Hycross Hybrid',
        category: 'Innova',
        registrationNumber: 'KA 02 LN 8820',
        seatingCapacity: 7,
        luggageCapacity: 4,
        ac: true,
        perKmRate: 24,
        baseFare: 1800,
        features: ['Ottoman Executive Lounge', 'Panoramic Sunroof', 'Silent EV Hybrid Drive', 'JBL Audio'],
        image: '/images/fleet/innova-hycross.webp',
        fuelType: 'Petrol',
        status: 'available',
        order: 5
      },
      {
        name: 'Force Urbania Executive Cruiser',
        category: 'Tempo Traveller',
        registrationNumber: 'KA 03 TT 5555',
        seatingCapacity: 13,
        luggageCapacity: 10,
        ac: true,
        perKmRate: 28,
        baseFare: 2500,
        features: ['Individual Air Vents', 'Individual Reclining Seats', 'LED TV & Microphone', 'High Roof Walkthrough'],
        image: '/images/fleet/force-urbania.webp',
        fuelType: 'Diesel',
        status: 'available',
        order: 6
      },
      {
        name: 'Mercedes-Benz E-Class Luxury',
        category: 'Luxury',
        registrationNumber: 'KA 01 LX 0007',
        seatingCapacity: 4,
        luggageCapacity: 3,
        ac: true,
        perKmRate: 45,
        baseFare: 3500,
        features: ['Chauffeur VIP Amenities', 'Burmester Sound System', 'Chilled Mineral Water', 'Wi-Fi Hotspot'],
        image: '/images/fleet/mercedes-eclass.webp',
        fuelType: 'Diesel',
        status: 'available',
        order: 7
      },
      {
        name: 'BharatBenz AC Tourist Coach',
        category: 'Bus',
        registrationNumber: 'KA 04 BB 3399',
        seatingCapacity: 26,
        luggageCapacity: 25,
        ac: true,
        perKmRate: 42,
        baseFare: 4500,
        features: ['Air Suspension', 'Wide Pushback Seats', 'Overhead Luggage Bins', 'Emergency First Aid Kit'],
        image: '/images/fleet/bharatbenz-coach.webp',
        fuelType: 'Diesel',
        status: 'available',
        order: 8
      }
    ];
    const vehicles = await Vehicle.insertMany(vehiclesData);

    // 3. Drivers (6 drivers)
    const driversData = [
      {
        name: 'Ramesh Kumar',
        phone: '+91 98450 12345',
        email: 'ramesh.k@orangecab.in',
        licenseNumber: 'KA-01-2015-00891',
        rating: 4.9,
        experienceYears: 8,
        totalTrips: 1420,
        status: 'available',
        assignedVehicle: vehicles[1]._id
      },
      {
        name: 'Suresh Patil',
        phone: '+91 97420 54321',
        email: 'suresh.p@orangecab.in',
        licenseNumber: 'KA-05-2017-00452',
        rating: 4.8,
        experienceYears: 6,
        totalTrips: 980,
        status: 'available',
        assignedVehicle: vehicles[2]._id
      },
      {
        name: 'Mohammed Mansoor',
        phone: '+91 99001 88776',
        email: 'mansoor.m@orangecab.in',
        licenseNumber: 'KA-03-2012-00123',
        rating: 5.0,
        experienceYears: 12,
        totalTrips: 2150,
        status: 'available',
        assignedVehicle: vehicles[3]._id
      },
      {
        name: 'Anand Gowda',
        phone: '+91 96112 33445',
        email: 'anand.g@orangecab.in',
        licenseNumber: 'KA-04-2018-00994',
        rating: 4.9,
        experienceYears: 5,
        totalTrips: 840,
        status: 'available',
        assignedVehicle: vehicles[4]._id
      },
      {
        name: 'Venkatesh Rao',
        phone: '+91 98801 99882',
        email: 'venkatesh.r@orangecab.in',
        licenseNumber: 'KA-02-2014-00671',
        rating: 4.8,
        experienceYears: 10,
        totalTrips: 1650,
        status: 'available',
        assignedVehicle: vehicles[5]._id
      },
      {
        name: 'Rajesh Nair',
        phone: '+91 94480 77112',
        email: 'rajesh.n@orangecab.in',
        licenseNumber: 'KA-51-2016-00331',
        rating: 4.9,
        experienceYears: 9,
        totalTrips: 1320,
        status: 'available',
        assignedVehicle: vehicles[6]._id
      }
    ];
    const drivers = await Driver.insertMany(driversData);

    // 4. Services
    const servicesData = [
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
    await Service.insertMany(servicesData);

    // 5. Testimonials (6 reviews)
    const testimonialsData = [
      {
        name: 'Karthik Subramanian',
        role: 'VP Engineering, Tech Mahindra',
        city: 'Bangalore',
        rating: 5,
        comment: 'Orange Cab is our exclusive mobility partner for international leadership delegations. Their Innova Crystas are spotlessly pristine, and drivers are always 15 minutes early.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        status: 'approved',
        order: 1
      },
      {
        name: 'Ananya Deshmukh',
        role: 'Founder, Studio 9 Design',
        city: 'Mysore',
        rating: 5,
        comment: 'Booked a round-trip Bangalore to Coorg for our family. The chauffeur Anand drove with such care through the ghat curves. Zero surge price, transparent billing, 10/10 service!',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
        status: 'approved',
        order: 2
      },
      {
        name: 'Dr. Arvind Nambiar',
        role: 'Senior Cardiologist, Manipal Hospital',
        city: 'Bangalore',
        rating: 5,
        comment: 'I take early morning flights to Delhi twice a week. With Orange Cab, I never have to worry about cancelled airport cabs. It is seamless and supremely dependable.',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        status: 'approved',
        order: 3
      },
      {
        name: 'Sneha Hegde',
        role: 'Marketing Director, Infosys',
        city: 'Mangalore',
        rating: 5,
        comment: 'Their Force Urbania was immaculate for our company team outing to Sakleshpur. Reclining captain seats, chilled AC, and very polite driver. Highly recommend Orange Cab!',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        status: 'approved',
        order: 4
      },
      {
        name: 'Rohan Mehra',
        role: 'Director, Zenith Logistics',
        city: 'Bangalore',
        rating: 5,
        comment: 'We hired their luxury Mercedes E-Class for our wedding anniversary. The vehicle was spotless, champagne glasses provided, and chauffeur was impeccably groomed.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        status: 'approved',
        order: 5
      },
      {
        name: 'Pooja Kulkarni',
        role: 'Principal Architect',
        city: 'Ooty',
        rating: 5,
        comment: 'The glass booking widget on the website made booking so fast. Received an instant confirmation with booking ID and WhatsApp dispatch notice in seconds.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        status: 'approved',
        order: 6
      }
    ];
    await Testimonial.insertMany(testimonialsData);

    // 6. FAQs (6 FAQs)
    const faqsData = [
      {
        question: 'How do I book a cab with Orange Cab?',
        answer: 'Simply click "Book Now" in the top navigation or use our hero booking widget. Enter your name, phone, pickup, drop, date, time, and cab type. You will receive an instant booking ID (e.g. OC-2026-00001) and WhatsApp confirmation!',
        category: 'Booking',
        order: 1
      },
      {
        question: 'Are there any hidden charges, night fees, or tolls?',
        answer: 'Never. Orange Cab guarantees 100% transparent pricing. Outstation and local tariffs are calculated on per-km rates with zero hidden charges. Any toll or parking receipts are itemized clearly on your invoice.',
        category: 'Pricing',
        order: 2
      },
      {
        question: 'How early should I book for Bangalore Airport transfers?',
        answer: 'We recommend booking at least 2 to 3 hours in advance for Bangalore Kempegowda Airport (BLR). For urgent flights, our express dispatch team operates 24/7 and can deploy a vehicle in as little as 20 minutes.',
        category: 'Airport',
        order: 3
      },
      {
        question: 'Are your chauffeurs police-verified and background-checked?',
        answer: 'Yes, 100%. Every Orange Cab driver undergoes mandatory background verification, police clearance, commercial license validation, and POSH customer service training before taking their first ride.',
        category: 'Safety',
        order: 4
      },
      {
        question: 'What cab types and capacities are available in your fleet?',
        answer: 'Our fleet ranges from 4-seater hatchbacks and executive sedans (Dzire, Etios), 6-seater SUVs (Ertiga), 7-seater premium Innova Crysta & Hycross, 13-seater Force Urbania Tempo Travellers, up to 26-seater luxury BharatBenz coaches.',
        category: 'Fleet',
        order: 5
      },
      {
        question: 'Can I cancel or modify my booking if my plans change?',
        answer: 'Yes. Free cancellation is permitted up to 2 hours before scheduled pickup. You can contact our 24/7 command center via phone, WhatsApp, or through the chatbot on the website.',
        category: 'Cancellation',
        order: 6
      }
    ];
    await FAQ.insertMany(faqsData);

    // 7. Gallery (8 images)
    const galleryData = [
      {
        title: 'Toyota Innova Crysta Executive Highway Cruiser',
        category: 'Fleet',
        image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=800&q=80',
        order: 1
      },
      {
        title: 'Mercedes-Benz Luxury Corporate Fleet',
        category: 'Luxury',
        image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80',
        order: 2
      },
      {
        title: 'Force Urbania Premium Group Traveller',
        category: 'Group',
        image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=800&q=80',
        order: 3
      },
      {
        title: 'Scenic Western Ghats Road Trip Convoy',
        category: 'Outstation',
        image: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
        order: 4
      },
      {
        title: 'Curbside Bangalore Airport On-Time Dispatch',
        category: 'Airport',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=80',
        order: 5
      },
      {
        title: 'Impeccable Sanitized Cabin Hygiene',
        category: 'Quality',
        image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80',
        order: 6
      },
      {
        title: 'Grand Wedding Convoy Hospitality',
        category: 'Events',
        image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        order: 7
      },
      {
        title: 'Corporate Campus Shuttle Operations',
        category: 'Corporate',
        image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=800&q=80',
        order: 8
      }
    ];
    await Gallery.insertMany(galleryData);

    // 8. Bookings (10 bookings: OC-2026-00001 through OC-2026-00010)
    const bookingsData = [
      {
        bookingId: 'OC-2026-00001',
        name: 'Rahul Sharma',
        phone: '+91 98451 11223',
        email: 'rahul.sharma@gmail.com',
        pickup: 'Indiranagar 100ft Road, Bangalore',
        drop: 'Kempegowda International Airport (BLR)',
        date: '2026-10-31',
        time: '05:30 AM',
        cabType: 'Sedan',
        passengers: 2,
        message: 'Early morning international flight, flight AI 102.',
        status: 'Confirmed',
        vehicle: vehicles[1]._id,
        driver: drivers[0]._id,
        estimatedFare: 1450,
        source: 'Website Modal'
      },
      {
        bookingId: 'OC-2026-00002',
        name: 'Priya Venkatesh',
        phone: '+91 99012 33445',
        email: 'priya.v@outlook.com',
        pickup: 'Koramangala 4th Block, Bangalore',
        drop: 'Mysore Palace, Mysore',
        date: '2026-11-01',
        time: '07:00 AM',
        cabType: 'Innova',
        passengers: 6,
        message: 'Family weekend trip, elderly parents onboard.',
        status: 'Assigned',
        vehicle: vehicles[3]._id,
        driver: drivers[2]._id,
        estimatedFare: 4299,
        source: 'Website Modal'
      },
      {
        bookingId: 'OC-2026-00003',
        name: 'Amitabh Sen',
        phone: '+91 98800 55667',
        email: 'amitabh.sen@tcs.com',
        pickup: 'Whitefield ITPL Main Gate, Bangalore',
        drop: 'Electronic City Phase 1, Bangalore',
        date: '2026-10-30',
        time: '09:00 AM',
        cabType: 'SUV',
        passengers: 3,
        message: 'Executive client review meeting.',
        status: 'Pending',
        estimatedFare: 1650,
        source: 'Website Modal'
      },
      {
        bookingId: 'OC-2026-00004',
        name: 'Dr. Meenakshi Sundaram',
        phone: '+91 94481 99880',
        email: 'meenakshi.s@fortis.in',
        pickup: 'Bannerghatta Road, Bangalore',
        drop: 'Taj Madikeri Resort, Coorg',
        date: '2026-11-04',
        time: '06:00 AM',
        cabType: 'Innova',
        passengers: 5,
        message: 'Coffee plantation holiday, need luggage carrier.',
        status: 'Confirmed',
        vehicle: vehicles[4]._id,
        driver: drivers[3]._id,
        estimatedFare: 6799,
        source: 'Website Modal'
      },
      {
        bookingId: 'OC-2026-00005',
        name: 'Sandeep Varma',
        phone: '+91 96110 77889',
        email: 'sandeep.varma@gmail.com',
        pickup: 'MG Road Metro Station, Bangalore',
        drop: 'Kempegowda Airport Terminal 2',
        date: '2026-10-30',
        time: '02:15 PM',
        cabType: 'Sedan',
        passengers: 1,
        message: 'Need prompt curbside drop at Gate 3.',
        status: 'Completed',
        vehicle: vehicles[1]._id,
        driver: drivers[0]._id,
        estimatedFare: 1350,
        source: 'Hero Widget'
      },
      {
        bookingId: 'OC-2026-00006',
        name: 'Kavita Menon',
        phone: '+91 97411 22334',
        email: 'kavita.menon@wipro.com',
        pickup: 'Sarjapur Road, Bangalore',
        drop: 'Savoy - IHCL SeleQtions, Ooty',
        date: '2026-11-08',
        time: '05:00 AM',
        cabType: 'Innova',
        passengers: 4,
        message: 'Scenic Bandipur safari road transit.',
        status: 'Pending',
        estimatedFare: 7599,
        source: 'Website Modal'
      },
      {
        bookingId: 'OC-2026-00007',
        name: 'Sunil Chetri',
        phone: '+91 99887 66554',
        email: 'sunil.c@sportshub.in',
        pickup: 'Kanteerava Stadium, Bangalore',
        drop: 'ITC Gardenia, Residency Road',
        date: '2026-10-29',
        time: '06:30 PM',
        cabType: 'Luxury',
        passengers: 2,
        message: 'VIP delegation chauffeur required.',
        status: 'Completed',
        vehicle: vehicles[6]._id,
        driver: drivers[5]._id,
        estimatedFare: 4500,
        source: 'Fleet Card'
      },
      {
        bookingId: 'OC-2026-00008',
        name: 'Aishwarya Joshi',
        phone: '+91 98442 33110',
        email: 'aishwarya.j@designbox.in',
        pickup: 'Jayanagar 4th Block, Bangalore',
        drop: 'Chikmagalur Golf Club',
        date: '2026-11-12',
        time: '06:00 AM',
        cabType: 'SUV',
        passengers: 4,
        message: 'Need child booster seat if available.',
        status: 'Confirmed',
        vehicle: vehicles[2]._id,
        driver: drivers[1]._id,
        estimatedFare: 5499,
        source: 'Website Modal'
      },
      {
        bookingId: 'OC-2026-00009',
        name: 'Gaurav Aggarwal',
        phone: '+91 91102 44556',
        email: 'gaurav.aggarwal@flipkart.com',
        pickup: 'Bellandur EcoSpace, Bangalore',
        drop: 'Nandi Hills Sunrise Viewpoint',
        date: '2026-11-02',
        time: '04:00 AM',
        cabType: 'Sedan',
        passengers: 3,
        message: 'Sunrise round trip with waiting.',
        status: 'Assigned',
        vehicle: vehicles[1]._id,
        driver: drivers[0]._id,
        estimatedFare: 2800,
        source: 'Website Modal'
      },
      {
        bookingId: 'OC-2026-00010',
        name: 'Team Horizon Event Planners',
        phone: '+91 99450 88221',
        email: 'events@horizonweddings.in',
        pickup: 'Palace Grounds, Bangalore',
        drop: 'The Leela Bhartiya City',
        date: '2026-11-15',
        time: '01:00 PM',
        cabType: 'Tempo Traveller',
        passengers: 12,
        message: 'Wedding sangeet group guest shuttle.',
        status: 'Pending',
        estimatedFare: 5899,
        source: 'Services Page'
      }
    ];
    await Booking.insertMany(bookingsData);

    // 9. Initial Settings
    await Setting.create({
      brandName: 'ORANGE CARS',
      tagline: 'Your Journey, Our Priority.',
      phone: '+91 99999 99999',
      whatsapp: '919999999999',
      email: 'info@orangecab.in',
      address: 'Ground Floor, Prestige Meridian, MG Road, Bangalore 560001, Karnataka, India',
      workingHours: '24 Hours / 7 Days a Week',
      socialLinks: {
        facebook: 'https://facebook.com/orangecab',
        instagram: 'https://instagram.com/orangecab',
        twitter: 'https://x.com/orangecab',
        youtube: 'https://youtube.com/@orangecab',
        linkedin: 'https://linkedin.com/company/orangecab',
        whatsapp: 'https://wa.me/919999999999',
        telegram: 'https://t.me/orangecab',
        pinterest: 'https://pinterest.com/orangecab'
      },
      seo: {
        metaTitle: 'Orange Cab | Premium Intercity & Airport Cab Booking in Bangalore',
        metaDescription: 'Book premium, punctual, chauffeur-driven cabs with Orange Cab. 100% verified drivers, transparent billing, and luxury fleet.',
        keywords: 'cab booking, outstation taxi, airport transfer bangalore, luxury cabs, tempo traveller hire'
      },
      hero: {
        headline: "South India's Premier Mobility Company",
        subheadline: 'Your Journey, Our Priority.'
      },
      about: {
        story: 'Founded in 2016, Orange Cab was born out of a clear mission: to bring true luxury, uncompromised safety, and absolute punctuality to intercity and corporate travel in India. What started with five executive sedans in Bangalore has today evolved into a premier fleet of over 500 premium vehicles serving corporate leaders, families, and discerning travelers across 15+ major cities.',
        badge: 'Since 2016',
        founderMessage: 'Our commitment is simple — every single guest deserves a spotless vehicle, an impeccably trained chauffeur, and absolute peace of mind. We measure our success not by trips completed, but by the smiles when our guests arrive safely at their destinations.',
        founderName: 'Vikramaditya Rao',
        founderTitle: 'Founder & CEO, Orange Cab',
        founderPhoto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
      },
      stats: {
        rides: '50,000+',
        onTime: '99.8%',
        cities: '15+',
        rating: '4.9/5'
      },
      chatbotQuickReplies: [
        'Book a cab now',
        'Check per-km rates',
        'Airport transfer BLR',
        'Corporate ETS inquiry',
        'Talk to human agent'
      ]
    });

    // 10. Sample Enquiries
    await Enquiry.create([
      {
        name: 'Suresh Raina',
        email: 'suresh.raina@techcorp.com',
        phone: '+91 98888 12345',
        subject: 'Monthly Corporate ETS Requirement for 40 Employees',
        message: 'Looking for daily pickup and drop for 40 software engineers between Whitefield and Indiranagar. Please share corporate tariff.',
        source: 'contact_form',
        status: 'New'
      },
      {
        name: 'Pooja Hegde',
        email: 'pooja.hegde@gmail.com',
        phone: '+91 97777 54321',
        subject: 'Wedding Guest Transport on Dec 12th',
        message: 'Need 3 Innova Crystas and 1 Force Urbania for 2 full days for a wedding celebration at Clarks Exotica.',
        source: 'contact_form',
        status: 'Replied',
        replyMessage: 'Sent custom quote via WhatsApp and email.'
      }
    ]);

    // 11. Initial Activity Log
    await ActivityLog.create({
      action: 'SYSTEM_SEED',
      details: 'System database successfully seeded with 10 bookings, 8 vehicles, 6 drivers, 8 services, 6 testimonials, 6 FAQs, and 8 gallery images.',
      adminName: 'System',
      category: 'system'
    });

    console.log('[Seed] Database successfully seeded with all 12 trimmed models!');
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    process.exit(1);
  }
};

seedDatabase();
