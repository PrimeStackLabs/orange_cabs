import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plane,
  Car,
  Compass,
  Users,
  Clock,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Sparkles,
  MessageCircle,
  UserCheck,
  Calendar,
  Hourglass,
  ArrowLeftRight,
  Moon,
  FileText,
  ChevronDown,
  Phone,
  Star,
  Quote,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { FLEET_DATA } from '../data/fleetData';
import { BUSINESS_INFO } from '../data/businessInfo';
import { FAQ_DATA } from '../data/faqData';
import { REVIEWS_DATA, REVIEWS_STATS } from '../data/reviewsData';
import QuickEnquiryModal from '../components/ui/QuickEnquiryModal';
import './Home.css';

// Official Authentic WhatsApp Icon SVG
function WhatsAppSvgIcon({ size = 16, className = '' }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

export default function Home() {
  const navigate = useNavigate();

  // Quick Trip Enquiry State
  const [tripType, setTripType] = useState('airport_transfer');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');

  // Quick Enquiry Modal State
  const [enquiryModal, setEnquiryModal] = useState({ isOpen: false, prefill: {} });

  const handleOpenVehicleEnquiry = (vehicleName) => {
    setEnquiryModal({
      isOpen: true,
      prefill: {
        preferredVehicle: vehicleName,
        tripType: `${vehicleName} Rental Enquiry`,
        message: `I would like to enquire about availability and rates for ${vehicleName}.`,
      },
    });
  };

  // FAQ Accordion State (first item open by default)
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Reviews Carousel State (Only 3 visible, auto-scrolling with pause on hover)
  const [reviewSlideIndex, setReviewSlideIndex] = useState(0);
  const [isReviewPaused, setIsReviewPaused] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleReviewsCount = windowWidth > 1024 ? 3 : windowWidth > 640 ? 2 : 1;
  const maxReviewIndex = Math.max(0, REVIEWS_DATA.length - visibleReviewsCount);

  useEffect(() => {
    if (isReviewPaused) return;
    const timer = setInterval(() => {
      setReviewSlideIndex((prev) => (prev >= maxReviewIndex ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [isReviewPaused, maxReviewIndex]);

  const handlePrevReview = () => {
    setReviewSlideIndex((prev) => (prev <= 0 ? maxReviewIndex : prev - 1));
  };

  const handleNextReview = () => {
    setReviewSlideIndex((prev) => (prev >= maxReviewIndex ? 0 : prev + 1));
  };

  const handleSearchEnquiry = (e) => {
    e.preventDefault();
    navigate('/booking', {
      state: {
        prefill: {
          tripType,
          pickupLocation: pickup,
          destination,
          travelDate,
        },
      },
    });
  };

  const popularVehicles = FLEET_DATA.slice(0, 4);

  return (
    <div className="home-page-root">
      {/* 1. Hero Section ("Every Mile, Made Memorable.") */}
      <section className="home-hero-dark" aria-label="Hero Banner">
        <div className="container hero-split-container">
          {/* Left Column: Headline & Action Buttons */}
          <div className="hero-left-col">
            <div className="hero-logo-emblem">
              <img src="/assets/images/skb-logo.jpeg" alt="SKB Crest" className="emblem-img" />
              <div className="emblem-text">
                <span className="emblem-skb">SKB</span>
                <span className="emblem-sub">TOUR AND TRAVELS</span>
              </div>
            </div>

            <h1 className="hero-main-heading">
              Every Mile,<br />
              <span className="hero-gold-text">Made Memorable.</span>
            </h1>

            <p className="hero-main-subtext">
              Airport transfers, city rides and outstation escapes — travel with comfort, confidence and a team that cares.
            </p>

            <div className="hero-button-pair">
              <Link to="/booking" className="btn-hero-gold">
                Plan Your Journey
              </Link>
              <Link to="/fleet" className="btn-hero-dark-outline">
                Explore Our Fleet
              </Link>
            </div>
          </div>

          {/* Right Column: Sharp High-Resolution Airport Chauffeur Hero Visual */}
          <div className="hero-right-col">
            <div className="hero-visual-frame">
              <img
                src="/assets/images/hero-airport-uhd.jpg"
                alt="SKB Tour and Travels Premium Airport Transfer Fleet"
                className="hero-airport-fleet-img"
              />
              <div className="hero-visual-glass-badge">
                <span className="badge-dot-live" />
                <span>Kempegowda International Airport (BLR) & PAN India Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Four Quick Service Highlights Row (White Strip) */}
      <section className="services-strip-white" aria-label="Services Highlights">
        <div className="container">
          <div className="services-strip-grid">
            <div className="service-strip-item">
              <div className="strip-gold-icon">
                <Plane size={20} />
              </div>
              <div className="strip-info">
                <h4 className="strip-title">Airport Transfers</h4>
                <p className="strip-sub">Hassle-free pickup & drop</p>
              </div>
            </div>

            <div className="service-strip-item">
              <div className="strip-gold-icon">
                <Car size={20} />
              </div>
              <div className="strip-info">
                <h4 className="strip-title">Local City Rides</h4>
                <p className="strip-sub">Comfortable city travel</p>
              </div>
            </div>

            <div className="service-strip-item">
              <div className="strip-gold-icon">
                <Compass size={20} />
              </div>
              <div className="strip-info">
                <h4 className="strip-title">Outstation Journeys</h4>
                <p className="strip-sub">One-way & round trips</p>
              </div>
            </div>

            <div className="service-strip-item">
              <div className="strip-gold-icon">
                <Users size={20} />
              </div>
              <div className="strip-info">
                <h4 className="strip-title">Family & Group Travel</h4>
                <p className="strip-sub">Perfect for families & groups</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Quick Trip Enquiry Box (Dark Navy Card with Gold Border) */}
      <section className="quick-enquiry-section" aria-label="Quick Trip Enquiry">
        <div className="container">
          <div className="quick-enquiry-card-navy">
            <h3 className="enquiry-card-title">Quick Trip Enquiry</h3>

            <form onSubmit={handleSearchEnquiry} className="enquiry-form-row">
              <div className="enquiry-field">
                <select
                  value={tripType}
                  onChange={(e) => setTripType(e.target.value)}
                  className="enquiry-select"
                >
                  <option value="airport_transfer">Trip Type: Airport Transfer</option>
                  <option value="local_4h_40km">Local City Trip (4H / 8H)</option>
                  <option value="outstation_oneway">Outstation One-Way</option>
                  <option value="outstation_round">Outstation Round Trip</option>
                  <option value="group_travel">Family & Group Travel</option>
                </select>
              </div>

              <div className="enquiry-field">
                <input
                  type="text"
                  placeholder="Pickup Location"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  className="enquiry-input"
                />
              </div>

              <div className="enquiry-field">
                <input
                  type="text"
                  placeholder="Destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="enquiry-input"
                />
              </div>

              <div className="enquiry-field date-field">
                <input
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="enquiry-input"
                />
              </div>

              <button type="submit" className="btn-search-enquire-gold">
                Search / Enquire
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 4. Explore Our Packages ("Travel Your Way" - Matching Reference Image) */}
      <section className="home-packages-section" aria-label="Explore Our Packages">
        <div className="container">
          {/* Centered Heading with Gold Underline */}
          <div className="packages-heading-center">
            <div className="packages-tagline-gold">
              <span className="tagline-dash" />
              <span>EXPLORE OUR PACKAGES</span>
              <span className="tagline-dash" />
            </div>
            <h2 className="packages-section-title">
              Travel Your <span className="packages-title-gold">Way</span>
            </h2>
            <div className="packages-gold-underline" />
          </div>

          {/* 4 Equal-Height Luxury Package Cards */}
          <div className="home-packages-grid">
            {/* Card 1: Local 4 Hours / 40 KM */}
            <div className="pkg-gold-card">
              <div className="pkg-card-media">
                <img
                  src="/assets/images/pkg-local-4h.jpg"
                  alt="SKB Local 4 Hours 40 KM Travel Package"
                  className="pkg-car-img"
                  loading="lazy"
                />
              </div>

              <div className="pkg-card-content">
                <h3 className="pkg-card-title">Local 4 Hours / 40 KM</h3>

                <div className="pkg-price-panel">
                  <div className="pkg-price-row">
                    <span className="pkg-currency">₹</span>
                    <span className="pkg-amount">1,200</span>
                  </div>
                  <span className="pkg-price-type">FIXED BASE PACKAGE</span>
                </div>

                <ul className="pkg-specs-list">
                  <li className="pkg-spec-item">
                    <Clock size={16} className="spec-icon-gold" />
                    <span>Duration: <strong>4 Hours</strong></span>
                  </li>
                  <li className="pkg-spec-item">
                    <MapPin size={16} className="spec-icon-gold" />
                    <span>Included Distance: <strong>40 KM</strong></span>
                  </li>
                  <li className="pkg-spec-item">
                    <Hourglass size={16} className="spec-icon-gold" />
                    <span>Additional Hour: <strong>₹ 150 / hr</strong></span>
                  </li>
                  <li className="pkg-spec-item">
                    <MapPin size={16} className="spec-icon-gold" />
                    <span>Additional KM: <strong>₹ 13 / km</strong></span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() =>
                    navigate('/booking', {
                      state: {
                        prefill: {
                          tripType: 'local_4h_40km',
                          preferredVehicle: 'Toyota Innova Crysta',
                          additionalInstructions: 'Booking enquiry for Local 4 Hours / 40 KM Package (₹1,200)',
                        },
                      },
                    })
                  }
                  className="pkg-btn-navy"
                  aria-label="Book Local 4 Hours Package"
                >
                  <Calendar size={16} />
                  <span>Book This Package</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Card 2: Local 8 Hours / 80 KM (MOST POPULAR) */}
            <div className="pkg-gold-card pkg-card-featured">
              <div className="pkg-card-media">
                <img
                  src="/assets/images/pkg-local-8h.jpg"
                  alt="SKB Local 8 Hours 80 KM Travel Package - Most Popular"
                  className="pkg-car-img"
                  loading="lazy"
                />
              </div>

              <div className="pkg-card-content">
                <h3 className="pkg-card-title">Local 8 Hours / 80 KM</h3>

                <div className="pkg-price-panel pkg-price-featured">
                  <div className="pkg-price-row">
                    <span className="pkg-currency">₹</span>
                    <span className="pkg-amount">1,900</span>
                  </div>
                  <span className="pkg-price-type">FIXED BASE PACKAGE</span>
                </div>

                <ul className="pkg-specs-list">
                  <li className="pkg-spec-item">
                    <Clock size={16} className="spec-icon-gold" />
                    <span>Duration: <strong>8 Hours</strong></span>
                  </li>
                  <li className="pkg-spec-item">
                    <MapPin size={16} className="spec-icon-gold" />
                    <span>Included Distance: <strong>80 KM</strong></span>
                  </li>
                  <li className="pkg-spec-item">
                    <Hourglass size={16} className="spec-icon-gold" />
                    <span>Additional Hour: <strong>₹ 150 / hr</strong></span>
                  </li>
                  <li className="pkg-spec-item">
                    <MapPin size={16} className="spec-icon-gold" />
                    <span>Additional KM: <strong>₹ 13 / km</strong></span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() =>
                    navigate('/booking', {
                      state: {
                        prefill: {
                          tripType: 'local_8h_80km',
                          preferredVehicle: 'Toyota Innova Crysta',
                          additionalInstructions: 'Booking enquiry for Local 8 Hours / 80 KM Most Popular Package (₹1,900)',
                        },
                      },
                    })
                  }
                  className="pkg-btn-navy"
                  aria-label="Book Local 8 Hours Package"
                >
                  <Calendar size={16} />
                  <span>Book This Package</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Card 3: Outstation Trips */}
            <div className="pkg-gold-card">
              <div className="pkg-card-media">
                <img
                  src="/assets/images/pkg-outstation.jpg"
                  alt="SKB Outstation Trips Travel Package"
                  className="pkg-car-img"
                  loading="lazy"
                />
              </div>

              <div className="pkg-card-content">
                <h3 className="pkg-card-title">Outstation Trips</h3>

                <div className="pkg-price-panel">
                  <div className="pkg-price-row">
                    <span className="pkg-currency">₹</span>
                    <span className="pkg-amount">13</span>
                    <span className="pkg-per-unit">/ km</span>
                  </div>
                  <span className="pkg-price-type">INDICATIVE STARTING FARE</span>
                </div>

                <ul className="pkg-specs-list">
                  <li className="pkg-spec-item">
                    <MapPin size={16} className="spec-icon-gold" />
                    <span>4+1 Dzire: <strong>₹13/km</strong> | 6+1 Innova: <strong>₹22/km</strong></span>
                  </li>
                  <li className="pkg-spec-item">
                    <ArrowLeftRight size={16} className="spec-icon-gold" />
                    <span>Min. Billing: <strong>300 KM / Day Average</strong></span>
                  </li>
                  <li className="pkg-spec-item">
                    <Moon size={16} className="spec-icon-gold" />
                    <span>Driver Beta: <strong>₹400 (Sedan) / ₹500 (Innova)</strong></span>
                  </li>
                  <li className="pkg-spec-item">
                    <FileText size={16} className="spec-icon-gold" />
                    <span>Tolls, Parking & Interstate Extra</span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() =>
                    navigate('/booking', {
                      state: {
                        prefill: {
                          tripType: 'outstation_round',
                          preferredVehicle: 'Toyota Innova Crysta',
                          additionalInstructions: 'Booking enquiry for Outstation Trips (Starting ₹13/km)',
                        },
                      },
                    })
                  }
                  className="pkg-btn-navy"
                  aria-label="Book Outstation Trips Package"
                >
                  <Calendar size={16} />
                  <span>Book This Package</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Card 4: Airport Transfers */}
            <div className="pkg-gold-card">
              <div className="pkg-card-media">
                <img
                  src="/assets/images/pkg-airport.jpg"
                  alt="SKB Airport Transfers Travel Package"
                  className="pkg-car-img"
                  loading="lazy"
                />
              </div>

              <div className="pkg-card-content">
                <h3 className="pkg-card-title">Airport Transfers</h3>

                <div className="pkg-price-panel">
                  <div className="pkg-price-row">
                    <span className="pkg-currency">₹</span>
                    <span className="pkg-amount">21</span>
                    <span className="pkg-per-unit">/ km</span>
                  </div>
                  <span className="pkg-price-type">INDICATIVE STARTING FARE</span>
                </div>

                <ul className="pkg-specs-list">
                  <li className="pkg-spec-item">
                    <MapPin size={16} className="spec-icon-gold" />
                    <span>4+1 Dzire: <strong>₹21/km</strong> | 6+1 Innova: <strong>₹40/km</strong></span>
                  </li>
                  <li className="pkg-spec-item">
                    <Plane size={16} className="spec-icon-gold" />
                    <span>Pickup & Drop Available 24/7</span>
                  </li>
                  <li className="pkg-spec-item">
                    <Clock size={16} className="spec-icon-gold" />
                    <span>On-Time Flight Tracking</span>
                  </li>
                  <li className="pkg-spec-item">
                    <FileText size={16} className="spec-icon-gold" />
                    <span>Tolls & Terminal Parking Separate</span>
                  </li>
                </ul>

                <button
                  type="button"
                  onClick={() =>
                    navigate('/booking', {
                      state: {
                        prefill: {
                          tripType: 'airport_transfer',
                          preferredVehicle: 'Toyota Innova Crysta',
                          additionalInstructions: 'Booking enquiry for Airport Transfers (Starting ₹21/km)',
                        },
                      },
                    })
                  }
                  className="pkg-btn-navy"
                  aria-label="Book Airport Transfers Package"
                >
                  <Calendar size={16} />
                  <span>Book This Package</span>
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Our Popular Vehicles (Matching Uploaded Mockup) */}
      <section className="popular-vehicles-section" aria-label="Our Popular Vehicles">
        <div className="container">
          {/* Header Row with Tagline, Headline and "View All Vehicles" Button */}
          <div className="popular-vehicles-header-row">
            <div className="popular-header-left">
              <div className="popular-tagline-gold">
                <span className="gold-dash" />
                <span>OUR FLEET</span>
              </div>
              <h2 className="popular-section-title">
                Our Popular <span className="gold-serif">Vehicles</span>
              </h2>
              <p className="popular-section-desc">
                Choose from our premium and well-maintained vehicles for a comfortable, safe and memorable journey. Perfect for airport transfers, local trips, outstation travel and more.
              </p>
            </div>
            <div className="popular-header-right">
              <Link to="/fleet" className="btn-view-all-fleet-gold">
                <span>View All Vehicles</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* 4 Evenly Sized Vehicle Cards Grid */}
          <div className="popular-vehicles-grid">
            {popularVehicles.map((vehicle) => (
              <div key={vehicle.id} className="vehicle-card-white">
                {/* 16:10 Aspect Ratio Image Container */}
                <div className="vehicle-card-img-wrap">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="vehicle-photo"
                    loading="lazy"
                  />
                  {/* Category Badge top right */}
                  <span className="vehicle-badge-gold">{vehicle.badge}</span>
                </div>

                {/* Details */}
                <div className="vehicle-card-text">
                  <h3 className="vehicle-name-dark">{vehicle.name}</h3>

                  <div className="vehicle-seater-row">
                    <Users size={15} className="seater-icon-gold" />
                    <span>{vehicle.capacity}</span>
                  </div>

                  {(vehicle.airportRate || vehicle.outstationRate) && (
                    <div className="vehicle-rates-chips">
                      {vehicle.airportRate && (
                        <div className="rate-chip highlight">
                          <span className="rate-chip-label">Airport:</span>
                          <span className="rate-chip-val">{vehicle.airportRate}</span>
                        </div>
                      )}
                      {vehicle.outstationRate && (
                        <div className="rate-chip">
                          <span className="rate-chip-label">Outstation:</span>
                          <span className="rate-chip-val">{vehicle.outstationRate}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="vehicle-tagline-text">{vehicle.description}</p>

                  {/* Direct WhatsApp Enquiry Button */}
                  <button
                    type="button"
                    onClick={() => handleOpenVehicleEnquiry(vehicle.name)}
                    className="btn-enquire-now-pill"
                    aria-label={`Enquire about ${vehicle.name} on WhatsApp`}
                  >
                    <WhatsAppSvgIcon size={16} />
                    <span>Enquire Now</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Fleet Features Strip */}
          <div className="popular-features-strip-card">
            <div className="popular-feature-col">
              <div className="popular-feature-icon-circle">
                <Car size={20} className="text-gold" />
              </div>
              <div className="popular-feature-info">
                <h4 className="popular-feature-title">Well Maintained Vehicles</h4>
                <p className="popular-feature-desc">Clean, safe and reliable</p>
              </div>
            </div>

            <div className="popular-feature-col">
              <div className="popular-feature-icon-circle">
                <UserCheck size={20} className="text-gold" />
              </div>
              <div className="popular-feature-info">
                <h4 className="popular-feature-title">Experienced Drivers</h4>
                <p className="popular-feature-desc">Professional and polite</p>
              </div>
            </div>

            <div className="popular-feature-col">
              <div className="popular-feature-icon-circle">
                <ShieldCheck size={20} className="text-gold" />
              </div>
              <div className="popular-feature-info">
                <h4 className="popular-feature-title">Comfortable Seating</h4>
                <p className="popular-feature-desc">For families and groups</p>
              </div>
            </div>

            <div className="popular-feature-col">
              <div className="popular-feature-icon-circle">
                <Compass size={20} className="text-gold" />
              </div>
              <div className="popular-feature-info">
                <h4 className="popular-feature-title">All India Travel</h4>
                <p className="popular-feature-desc">Your journey, our priority</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. "Your Next Journey Starts Here." Banner (Cinematic Large Luxury Banner) */}
      <section className="journey-banner-section" aria-label="Your Next Journey Banner">
        <div className="container">
          <div className="journey-cta-navy-card">
            {/* Left: Premium Framed Vehicle Visual */}
            <div className="journey-card-left-img">
              <div className="journey-img-frame">
                <img
                  src="/assets/images/card-sedan.png"
                  alt="SKB Tour and Travels Premium Fleet"
                  className="journey-car-img"
                  loading="lazy"
                />
                <div className="journey-img-glass-pill">
                  <span className="journey-live-dot" />
                  <span>Verified Chauffeurs</span>
                </div>
              </div>
            </div>

            {/* Center: Large Luxury Typography & Highlights */}
            <div className="journey-card-center-text">
              <div className="journey-tagline-gold">
                <span className="journey-tagline-dash" />
                <span>EXPERIENCE EXCELLENCE IN TRAVEL</span>
              </div>
              <h2 className="journey-title">
                Your Next Journey <span className="journey-title-gold">Starts Here.</span>
              </h2>
              <p className="journey-sub">
                Comfort <span className="journey-dot">•</span> Safety <span className="journey-dot">•</span> Reliability <span className="journey-dot">•</span> Affordable Travel
              </p>
              <div className="journey-perks-row">
                <span className="journey-perk-item">✓ 24/7 Availability</span>
                <span className="journey-perk-item">✓ BLR Airport & PAN India</span>
                <span className="journey-perk-item">✓ Sanitized Premium Cabs</span>
              </div>
            </div>

            {/* Right: Prominent Action Button & Contact */}
            <div className="journey-card-right-btn">
              <Link to="/booking" className="btn-book-your-ride-gold">
                <span>Book Your Ride</span>
                <ArrowRight size={18} />
              </Link>
              <div className="journey-call-links-wrap">
                <a
                  href="tel:7338140524"
                  className="journey-quick-call-link"
                  aria-label="Call Helpline on 7338140524"
                >
                  Call: +91 73381 40524
                </a>
                <span className="journey-dot">•</span>
                <a
                  href="tel:9035897960"
                  className="journey-quick-call-link"
                  aria-label="Call Vicky on 9035897960"
                >
                  +91 90358 97960
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Why Choose SKB Tour and Travels (Luxury Advantage Section After Journey Banner) */}
      <section className="why-choose-luxury-section" aria-label="Why Choose SKB Tour and Travels">
        <div className="container">
          <div className="why-choose-header-center">
            <div className="why-tagline-gold">
              <span className="tagline-dash" />
              <span>THE SKB ADVANTAGE</span>
              <span className="tagline-dash" />
            </div>
            <h2 className="why-section-title">
              Why Choose <span className="why-gold-serif">SKB Tour and Travels</span>
            </h2>
            <div className="why-gold-underline" />
          </div>

          <div className="why-choose-cards-grid">
            <div className="why-card-item">
              <div className="why-icon-bubble">
                <Car size={26} className="why-icon-navy" />
              </div>
              <h3 className="why-item-title">Multiple Vehicle Options</h3>
              <p className="why-item-desc">Sedans, Innova, TT & Urbania</p>
            </div>

            <div className="why-card-item">
              <div className="why-icon-bubble">
                <Clock size={26} className="why-icon-navy" />
              </div>
              <h3 className="why-item-title">24/7 Booking Support</h3>
              <p className="why-item-desc">Round-the-clock help & enquiry</p>
            </div>

            <div className="why-card-item">
              <div className="why-icon-bubble">
                <Plane size={26} className="why-icon-navy" />
              </div>
              <h3 className="why-item-title">Airport & Outstation</h3>
              <p className="why-item-desc">BLR Airport & PAN India trips</p>
            </div>

            <div className="why-card-item">
              <div className="why-icon-bubble">
                <ShieldCheck size={26} className="why-icon-navy" />
              </div>
              <h3 className="why-item-title">Affordable & Fair Pricing</h3>
              <p className="why-item-desc">Transparent with zero hidden fees</p>
            </div>

            <div className="why-card-item">
              <div className="why-icon-bubble">
                <Users size={26} className="why-icon-navy" />
              </div>
              <h3 className="why-item-title">Family & Group Service</h3>
              <p className="why-item-desc">Spacious & safe tourist travel</p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Frequently Asked Questions (Matching Reference Image) */}
      <section className="faq-luxury-section" aria-label="Frequently Asked Questions">
        <div className="container">
          <div className="faq-header-center">
            <div className="faq-tagline-gold">
              <span className="tagline-dash" />
              <span>GOT QUESTIONS?</span>
              <span className="tagline-dash" />
            </div>
            <h2 className="faq-section-title">
              Frequently Asked <span className="faq-gold-serif">Questions</span>
            </h2>
            <div className="faq-gold-underline" />
            <p className="faq-section-subtitle">
              Clear, transparent answers to help you plan your journey with total confidence and peace of mind.
            </p>
          </div>

          <div className="faq-accordion-container">
            {FAQ_DATA.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={item.id}
                  className={`faq-accordion-item ${isOpen ? 'active' : ''}`}
                >
                  <button
                    type="button"
                    className="faq-accordion-header"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${item.id}`}
                  >
                    <div className="faq-header-left">
                      <span className="faq-item-number">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <span className="faq-item-question">{item.question}</span>
                    </div>
                    <span className="faq-toggle-circle">
                      <ChevronDown
                        size={19}
                        strokeWidth={2.4}
                        className={`faq-chevron-icon ${isOpen ? 'rotated' : ''}`}
                      />
                    </span>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${item.id}`}
                      className="faq-accordion-body"
                    >
                      <p>{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Direct Enquiry Strip Card */}
          <div className="faq-support-strip-card">
            <div className="faq-support-left">
              <div className="faq-support-icon-wrap">
                <MessageCircle size={24} className="faq-support-icon" />
              </div>
              <div className="faq-support-text">
                <h4 className="faq-support-title">Still have questions or special requirements?</h4>
                <p className="faq-support-desc">
                  Contact Vicky directly for custom tour packages, corporate billing, or immediate airport taxi dispatch.
                </p>
              </div>
            </div>
            <div className="faq-support-actions">
              <a
                href={`https://wa.me/917338140524?text=${encodeURIComponent(
                  'Hello Vicky, I have a question regarding cab booking with SKB Tour and Travels.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="faq-btn-whatsapp"
                aria-label="Chat on WhatsApp"
              >
                <WhatsAppSvgIcon size={18} />
                <span>Chat on WhatsApp</span>
              </a>
              <a
                href="tel:7338140524"
                className="faq-btn-call"
                aria-label="Call Helpline on 7338140524"
              >
                <Phone size={15} />
                <span>Call 73381 40524</span>
              </a>
              <a
                href="tel:9035897960"
                className="faq-btn-call"
                aria-label="Call Vicky on 9035897960"
              >
                <Phone size={15} />
                <span>Call 90358 97960</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Customer Testimonials & Reviews (Placed Directly After FAQ) */}
      <section className="reviews-luxury-section" aria-label="Customer Reviews and Testimonials">
        <div className="container">
          {/* Header */}
          <div className="reviews-header-center">
            <div className="reviews-tagline-gold">
              <span className="tagline-dash" />
              <span>WHAT OUR TRAVELERS SAY</span>
              <span className="tagline-dash" />
            </div>
            <h2 className="reviews-section-title">
              Client <span className="reviews-gold-serif">Testimonials</span> & Reviews
            </h2>
            <div className="reviews-gold-underline" />
            <p className="reviews-section-subtitle">
              Real journeys, genuine experiences. Trusted by families, business executives, and groups across Bengaluru and PAN India.
            </p>

            {/* Google Rating Trust Pill */}
            <div className="reviews-trust-badge">
              <div className="trust-stars-row">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="trust-star-gold" fill="#F59E0B" />
                ))}
              </div>
              <span className="trust-score-bold">{REVIEWS_STATS.averageRating} / 5.0</span>
              <span className="trust-dot">•</span>
              <span className="trust-source-text">Over {REVIEWS_STATS.totalReviews} Verified Journeys</span>
            </div>
          </div>

          {/* Reviews Carousel (Shows exactly 3 reviews on desktop, auto-scrolling) */}
          <div
            className="reviews-carousel-wrapper"
            onMouseEnter={() => setIsReviewPaused(true)}
            onMouseLeave={() => setIsReviewPaused(false)}
          >
            {/* Left Navigation Arrow */}
            <button
              type="button"
              onClick={handlePrevReview}
              className="reviews-nav-arrow prev"
              aria-label="Previous Review"
              title="Previous Review"
            >
              <ChevronLeft size={24} strokeWidth={2.6} />
            </button>

            {/* Slider Viewport & Track */}
            <div className="reviews-carousel-viewport">
              <div
                className="reviews-slider-track"
                style={{
                  transform: `translateX(-${reviewSlideIndex * (100 / visibleReviewsCount)}%)`,
                }}
              >
                {REVIEWS_DATA.map((review) => (
                  <div key={review.id} className="review-slide-col">
                    <div className="review-card-luxury">
                      {/* Top Row: Stars + Verified Badge */}
                      <div className="review-card-top">
                        <div className="review-stars-group">
                          {[...Array(review.rating)].map((_, i) => (
                            <Star key={i} size={15} className="star-gold-fill" fill="#F59E0B" />
                          ))}
                        </div>
                        <span className="review-trip-tag">
                          <CheckCircle2 size={13} className="tag-check-icon" />
                          <span>{review.tripType}</span>
                        </span>
                      </div>

                      {/* Decorative Quote Icon */}
                      <div className="review-quote-icon-wrap">
                        <Quote size={26} className="review-quote-svg" />
                      </div>

                      {/* Review Text */}
                      <p className="review-quote-text">"{review.text}"</p>

                      {/* Author Info */}
                      <div className="review-author-row">
                        <div className="review-avatar-circle">
                          <span>{review.initials}</span>
                        </div>
                        <div className="review-author-meta">
                          <h4 className="review-author-name">{review.name}</h4>
                          <span className="review-author-sub">
                            {review.role} • {review.city}
                          </span>
                        </div>
                        <span className="review-time-ago">{review.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Navigation Arrow */}
            <button
              type="button"
              onClick={handleNextReview}
              className="reviews-nav-arrow next"
              aria-label="Next Review"
              title="Next Review"
            >
              <ChevronRight size={24} strokeWidth={2.6} />
            </button>

            {/* Pagination Dots Row */}
            <div className="reviews-dots-row">
              {Array.from({ length: maxReviewIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setReviewSlideIndex(idx)}
                  className={`reviews-dot-pill ${reviewSlideIndex === idx ? 'active' : ''}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Bottom Trust Counter Strip */}
          <div className="reviews-bottom-stats-card">
            <div className="stats-col-item">
              <span className="stats-number-gold">4.9 ★</span>
              <span className="stats-label-dark">Average Traveler Rating</span>
            </div>
            <div className="stats-divider-vert" />
            <div className="stats-col-item">
              <span className="stats-number-gold">{REVIEWS_STATS.totalReviews}</span>
              <span className="stats-label-dark">Completed Safe Trips</span>
            </div>
            <div className="stats-divider-vert" />
            <div className="stats-col-item">
              <span className="stats-number-gold">{REVIEWS_STATS.punctualityRate}</span>
              <span className="stats-label-dark">Punctuality Commitment</span>
            </div>
            <div className="stats-divider-vert" />
            <div className="stats-col-item">
              <span className="stats-number-gold">24 / 7</span>
              <span className="stats-label-dark">Dedicated Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Enquiry Modal for Instant WhatsApp Capture */}
      <QuickEnquiryModal
        isOpen={enquiryModal.isOpen}
        onClose={() => setEnquiryModal({ isOpen: false, prefill: {} })}
        prefill={enquiryModal.prefill}
      />
    </div>
  );
}
