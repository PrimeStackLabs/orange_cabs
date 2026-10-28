const AdminUser = require('../models/AdminUser');
const Package = require('../models/Package');
const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');
const Booking = require('../models/Booking');
const Enquiry = require('../models/Enquiry');
const Customer = require('../models/Customer');
const Review = require('../models/Review');
const Gallery = require('../models/Gallery');
const Offer = require('../models/Offer');
const BusinessSettings = require('../models/BusinessSettings');

exports.seedDatabase = async (req, res) => {
  try {
    // 1. Seed Super Admin
    let admin = await AdminUser.findOne({ email: 'admin@skbtravels.com' });
    if (!admin) {
      admin = await AdminUser.create({
        name: 'Admin',
        email: 'admin@skbtravels.com',
        password: 'admin@123',
        role: 'super_admin',
        phone: '9035897960',
      });
      console.log('Default super admin created: admin@skbtravels.com');
    }

    // 2. Seed Business Settings
    let settings = await BusinessSettings.findOne();
    if (!settings) {
      await BusinessSettings.create({
        businessName: 'SKB Tour and Travels',
        ownerName: 'Vicky',
        primaryPhone: '7338140524',
        alternatePhone: '9035897960',
        whatsappNumber: '919035897960',
        contactEmail: 'vickymegha903@gmail.com',
        locationArea: 'Airport area',
        pinCode: '560300',
        bookingTerms: 'Fares indicative. Confirmed directly with driver/owner before departure.',
      });
    }

    // 3. Seed Vehicles
    const vehicleCount = await Vehicle.countDocuments();
    let seededVehicles = [];
    if (vehicleCount === 0) {
      seededVehicles = await Vehicle.create([
        {
          name: 'Toyota Innova Crysta',
          category: 'Toyota Innova Crysta',
          registrationNumber: 'KA 01 AB 1234',
          passengerCapacity: '6+1 Seater',
          hasAc: true,
          description: 'Premium spacious MPV with dual AC, captain seats, and exceptional comfort for airport (₹40/km) and outstation journeys (₹22/km, beta ₹500).',
          image: '/assets/images/card-innova.png',
          availabilityStatus: 'available',
          indicativePrice: 'Airport ₹40/KM | Outstation ₹22/KM',
          isActive: true,
        },
        {
          name: 'Force Urbania',
          category: 'Urbania',
          registrationNumber: 'KA 05 CD 5678',
          passengerCapacity: '12-16 Seater',
          hasAc: true,
          description: 'Next-generation luxury van with panoramic windows, individual AC vents, and recliner seats for corporate and family travel.',
          image: '/assets/images/card-urbania.png',
          availabilityStatus: 'on_trip',
          indicativePrice: 'Custom quote based on itinerary',
          isActive: true,
        },
        {
          name: 'Tempo Traveller',
          category: 'TT',
          registrationNumber: 'KA 03 EF 9012',
          passengerCapacity: '12+1 Seater',
          hasAc: true,
          description: 'Comfortable 12+1 group transport equipped with ample luggage carrier and push-back seats at ₹22/km.',
          image: '/assets/images/card-tt.png',
          availabilityStatus: 'available',
          indicativePrice: '₹22 / KM',
          isActive: true,
        },
        {
          name: 'Swift Dzire (Sedan 4+1)',
          category: 'Sedan 4+1',
          registrationNumber: 'KA 02 GH 3456',
          passengerCapacity: '4+1 Seater',
          hasAc: true,
          description: 'Reliable, fuel-efficient sedan for airport pickup & drop (₹21/km) and outstation trips (₹13/km, beta ₹400).',
          image: '/assets/images/card-sedan.png',
          availabilityStatus: 'maintenance',
          indicativePrice: 'Airport ₹21/KM | Outstation ₹13/KM',
          isActive: true,
        },
      ]);
    } else {
      seededVehicles = await Vehicle.find();
    }

    // 4. Seed Drivers
    const driverCount = await Driver.countDocuments();
    if (driverCount === 0) {
      await Driver.create([
        {
          name: 'Ramesh Gowda',
          phoneNumber: '9845123456',
          licenceNumber: 'KA0120180012345',
          licenceExpiryDate: new Date('2028-11-15'),
          assignedVehicleName: 'Toyota Innova Crysta (KA 01 AB 1234)',
          availabilityStatus: 'available',
          experienceYears: 8,
          address: 'Devanahalli, Bengaluru',
        },
        {
          name: 'Manjunath K',
          phoneNumber: '9845654321',
          licenceNumber: 'KA0520190056789',
          licenceExpiryDate: new Date('2027-06-20'),
          assignedVehicleName: 'Force Urbania (KA 05 CD 5678)',
          availabilityStatus: 'on_duty',
          experienceYears: 10,
          address: 'Yelahanka, Bengaluru',
        },
        {
          name: 'Suresh Babu',
          phoneNumber: '9741238901',
          licenceNumber: 'KA0320200098765',
          licenceExpiryDate: new Date('2029-01-10'),
          assignedVehicleName: 'Tempo Traveller (KA 03 EF 9012)',
          availabilityStatus: 'available',
          experienceYears: 6,
          address: 'Hebbal, Bengaluru',
        },
      ]);
    }

    // 5. Seed Packages (with business specified rates)
    const packageCount = await Package.countDocuments();
    if (packageCount === 0) {
      await Package.create([
        {
          name: 'Local City Trip (4H / 40KM)',
          category: 'local',
          description: 'Ideal for short business meetings, local shopping, or doctor visits within Bengaluru city limits.',
          duration: '4 Hours',
          includedDistance: 40,
          basePrice: 1200,
          additionalHourRate: 150,
          additionalKmRate: 13,
          applicableConditions: ['Toll & parking charges extra at actuals', 'Sedan/SUV pricing varies'],
          image: '/assets/images/pkg-local-4h.jpg',
          isFeatured: true,
          displayOrder: 1,
        },
        {
          name: 'Local City Trip (8H / 80KM)',
          category: 'local',
          description: 'Full-day Bangalore city sightseeing, commercial errands, or multi-stop family travel with chauffeur.',
          duration: '8 Hours',
          includedDistance: 80,
          basePrice: 1900,
          additionalHourRate: 150,
          additionalKmRate: 13,
          applicableConditions: ['Toll & parking charges extra at actuals'],
          image: '/assets/images/pkg-local-8h.jpg',
          isFeatured: true,
          displayOrder: 2,
        },
        {
          name: 'Outstation Round Trip',
          category: 'outstation',
          description: 'Comfortable inter-city travel across South India. 4+1 Dzire ₹13/km, 6+1 Innova Crysta ₹22/km, 12+1 TT ₹22/km.',
          duration: 'Per Day',
          includedDistance: 300,
          basePrice: 3900,
          additionalHourRate: 0,
          additionalKmRate: 13,
          minDailyKm: 300,
          driverAllowance: 400,
          applicableConditions: ['Minimum 300 km billing per calendar day', 'Driver beta: ₹400 (Sedan) / ₹500 (Innova) separate', 'Inter-state taxes extra at actuals'],
          image: '/assets/images/pkg-outstation.jpg',
          isFeatured: true,
          displayOrder: 3,
        },
        {
          name: 'Kempegowda Airport Transfer',
          category: 'airport',
          description: 'Punctual 24/7 pickup & drop directly to/from Kempegowda International Airport (BLR). 4+1 Dzire ₹21/km, 6+1 Innova Crysta ₹40/km.',
          duration: 'Point to Point',
          includedDistance: 50,
          basePrice: 1050,
          additionalHourRate: 0,
          additionalKmRate: 21,
          applicableConditions: ['Includes airport pickup assistance', 'Toll charges extra via fastag'],
          image: '/assets/images/pkg-airport.jpg',
          isFeatured: true,
          displayOrder: 4,
        },
      ]);
    }

    // 6. Seed Bookings (matching screenshot reference IDs)
    const bookingCount = await Booking.countDocuments();
    if (bookingCount === 0) {
      await Booking.create([
        {
          bookingReference: '#BK1256',
          fullName: 'Ramesh Kumar',
          phoneNumber: '9845112233',
          tripType: 'outstation_round',
          tripTypeLabel: 'Outstation Trip',
          packageName: 'Outstation Trip',
          pickupLocation: 'Indiranagar, Bengaluru',
          destination: 'Mysore',
          travelDate: new Date('2026-10-20'),
          preferredVehicle: 'Toyota Innova Crysta',
          passengerCount: 4,
          status: 'confirmed',
          estimatedFare: 4200,
          finalFare: 4200,
        },
        {
          bookingReference: '#BK1255',
          fullName: 'Priya Sharma',
          phoneNumber: '9845223344',
          tripType: 'airport_transfer',
          tripTypeLabel: 'Airport Transfer',
          packageName: 'Airport Transfer',
          pickupLocation: 'Whitefield',
          destination: 'BLR Airport Terminal 2',
          travelDate: new Date('2026-10-20'),
          preferredVehicle: 'Toyota Etios',
          passengerCount: 2,
          status: 'pending',
          estimatedFare: 1400,
          finalFare: 0,
        },
        {
          bookingReference: '#BK1254',
          fullName: 'Manjunath H',
          phoneNumber: '9845334455',
          tripType: 'local_8h_80km',
          tripTypeLabel: '8 Hours / 80 KM',
          packageName: '8 Hours / 80 KM',
          pickupLocation: 'Koramangala',
          destination: 'Electronics City & Multiple Stops',
          travelDate: new Date('2026-10-19'),
          preferredVehicle: 'Toyota Innova Crysta',
          passengerCount: 3,
          status: 'confirmed',
          estimatedFare: 1900,
          finalFare: 1900,
        },
        {
          bookingReference: '#BK1253',
          fullName: 'Sneha R',
          phoneNumber: '9845445566',
          tripType: 'local_4h_40km',
          tripTypeLabel: 'Local 4 Hours',
          packageName: 'Local 4 Hours',
          pickupLocation: 'Malleshwaram',
          destination: 'MG Road',
          travelDate: new Date('2026-10-19'),
          preferredVehicle: 'Dzire Sedan',
          passengerCount: 1,
          status: 'completed',
          estimatedFare: 1200,
          finalFare: 1200,
        },
        {
          bookingReference: '#BK1252',
          fullName: 'Arjun Patil',
          phoneNumber: '9845556677',
          tripType: 'outstation_oneway',
          tripTypeLabel: 'Outstation Trip',
          packageName: 'Outstation Trip',
          pickupLocation: 'Hebbal',
          destination: 'Chikmagalur',
          travelDate: new Date('2026-10-19'),
          preferredVehicle: 'Force Urbania',
          passengerCount: 8,
          status: 'confirmed',
          estimatedFare: 8500,
          finalFare: 8500,
        },
      ]);
    }

    // 7. Seed Enquiries (matching screenshot recent enquiries)
    const enquiryCount = await Enquiry.countDocuments();
    if (enquiryCount === 0) {
      await Enquiry.create([
        {
          enquiryReference: 'ENQ-901',
          customerName: 'Vikram S',
          phoneNumber: '9035897960',
          tripType: 'Outstation Trip',
          pickupLocation: 'Bengaluru',
          destination: 'Ooty',
          preferredDate: new Date('2026-10-25'),
          preferredVehicle: 'Toyota Innova Crysta',
          message: 'Looking for a 3-day family round trip with driver.',
          status: 'new',
        },
        {
          enquiryReference: 'ENQ-902',
          customerName: 'Kavya M',
          phoneNumber: '9845667788',
          tripType: 'Airport Transfer',
          pickupLocation: 'HSR Layout',
          destination: 'Bengaluru Airport',
          preferredDate: new Date('2026-10-23'),
          preferredVehicle: 'Sedan 4+1',
          message: 'Morning 5 AM pickup needed for early flight.',
          status: 'contacted',
        },
        {
          enquiryReference: 'ENQ-903',
          customerName: 'Rohit P',
          phoneNumber: '9741889900',
          tripType: '8 Hours / 80 KM',
          pickupLocation: 'Jayanagar',
          destination: 'Bangalore City',
          preferredDate: new Date('2026-10-24'),
          preferredVehicle: 'Innova Crysta',
          message: 'Corporate client visit with multiple city stops.',
          status: 'new',
        },
        {
          enquiryReference: 'ENQ-904',
          customerName: 'Ananya K',
          phoneNumber: '9632114455',
          tripType: 'Local 4 Hours',
          pickupLocation: 'Sadashivanagar',
          destination: 'City Tour',
          preferredDate: new Date('2026-10-22'),
          preferredVehicle: 'Sedan',
          message: 'Shopping and lunch outing.',
          status: 'converted',
        },
        {
          enquiryReference: 'ENQ-905',
          customerName: 'Suresh B',
          phoneNumber: '9123445566',
          tripType: 'Outstation Trip',
          pickupLocation: 'Devanahalli',
          destination: 'Tirupati',
          preferredDate: new Date('2026-10-28'),
          preferredVehicle: 'Tempo Traveller',
          message: '12 passenger pilgrimage trip.',
          status: 'contacted',
        },
      ]);
    }

    // 8. Seed Reviews
    const reviewCount = await Review.countDocuments();
    if (reviewCount === 0) {
      await Review.create([
        {
          customerName: 'Dr. Anand Kumar',
          rating: 5,
          comment: 'Very professional airport pickup at 3 AM. The Innova was impeccably clean and Vicky ensured our driver arrived 15 minutes before time.',
          tripCategory: 'Airport Transfer',
          isTestimonial: true,
          isFeatured: true,
          status: 'approved',
        },
        {
          customerName: 'Sunita Menon',
          rating: 5,
          comment: 'Hired Force Urbania for our corporate team retreat to Coorg. Superb luxury interior, smooth drive and very polite chauffeur.',
          tripCategory: 'Corporate Outstation',
          isTestimonial: true,
          isFeatured: true,
          status: 'approved',
        },
        {
          customerName: 'Karthik Rao',
          rating: 5,
          comment: 'Transparent pricing with no hidden charges. Reliable travel partner in Bengaluru.',
          tripCategory: 'Local 8 Hours',
          isTestimonial: false,
          isFeatured: false,
          status: 'approved',
        },
      ]);
    }

    // 9. Seed Gallery
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.create([
        {
          title: 'Toyota Innova Crysta Fleet',
          category: 'vehicles',
          imageUrl: '/assets/images/hero-innova-crysta.png',
          altText: 'Premium Innova Crysta Chauffeur Driven',
          displayOrder: 1,
          isActive: true,
        },
        {
          title: 'Kempegowda International Airport Pickup Area',
          category: 'destinations',
          imageUrl: '/assets/images/airport-hero-banner.png',
          altText: 'Bangalore Airport Transfer Fleet',
          displayOrder: 2,
          isActive: true,
        },
        {
          title: 'Mysore Palace Heritage Tour',
          category: 'trips',
          imageUrl: '/assets/images/mysore-fleet-banner.png',
          altText: 'Outstation travel to Mysore Palace',
          displayOrder: 3,
          isActive: true,
        },
      ]);
    }

    // 10. Seed Offer
    const offerCount = await Offer.countDocuments();
    if (offerCount === 0) {
      await Offer.create([
        {
          title: 'Airport Transfer Early Bird Discount',
          code: 'FLYBLR10',
          description: 'Get special indicative discounts on advance booked airport transfers directly to Devanahalli.',
          discountType: 'percentage',
          discountValue: 10,
          bannerImage: '/assets/images/airport-hero-banner.png',
          isActive: true,
          displayOrder: 1,
        },
      ]);
    }

    return res.status(200).json({
      success: true,
      message: 'Database successfully seeded with realistic business data and default admin user.',
      defaultAdmin: {
        email: 'admin@skbtravels.com',
        password: 'admin@123',
        role: 'super_admin',
      },
    });
  } catch (error) {
    console.error('Seeding error:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
