import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  ShieldCheck,
  Clock,
  MapPin,
  Car,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { FLEET_DATA } from '../data/fleetData';
import { createWhatsAppQuickUrl } from '../utils/whatsapp';
import QuickEnquiryModal from '../components/ui/QuickEnquiryModal';
import './Fleet.css';

export default function Fleet() {
  const [enquiryModal, setEnquiryModal] = useState({ isOpen: false, prefill: {} });

  const handleOpenEnquiry = (vehicleName) => {
    setEnquiryModal({
      isOpen: true,
      prefill: {
        vehicleName,
        preferredVehicle: vehicleName,
        tripType: `${vehicleName} Rental Enquiry`,
      },
    });
  };
  return (
    <div className="fleet-page-root">
      {/* 1. Header Banner */}
      <section className="fleet-banner-navy" aria-label="Our Fleet Banner">
        <div className="container fleet-banner-grid">
          <div className="fleet-banner-left">
            <div className="fleet-badge-pill">
              <Sparkles size={13} className="badge-sparkle-icon" />
              <span>PREMIUM FLEET COLLECTION</span>
            </div>

            <h1 className="fleet-hero-heading">
              The Right Ride for <span className="text-gold-gradient">Every Journey</span>
            </h1>

            <p className="fleet-hero-desc">
              Experience the gold standard of chauffeured travel. Impeccably clean, air-conditioned, and meticulously maintained vehicles driven by verified professional chauffeurs across South India.
            </p>

            <div className="fleet-hero-perks">
              <div className="fleet-perk-item">
                <CheckCircle2 size={15} className="perk-icon" />
                <span>Sanitized & AC Fleet</span>
              </div>
              <div className="fleet-perk-item">
                <CheckCircle2 size={15} className="perk-icon" />
                <span>Verified Chauffeurs</span>
              </div>
              <div className="fleet-perk-item">
                <CheckCircle2 size={15} className="perk-icon" />
                <span>Fixed Transparent Rates</span>
              </div>
            </div>

            <div className="fleet-hero-actions">
              <Link to="/booking" className="btn-fleet-hero-gold">
                <span>Book a Ride</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href={createWhatsAppQuickUrl(
                  'Hello Vicky, I would like to check vehicle availability and rates for an upcoming trip.'
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-fleet-hero-wa"
              >
                <MessageCircle size={16} />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>
          </div>

          <div className="fleet-banner-right">
            <div className="fleet-showcase-frame">
              <div className="fleet-showcase-glow" />

              <div className="fleet-image-glass-card">
                <img
                  src="/assets/images/mysore-fleet-banner.png"
                  alt="SKB Tour and Travels Fleet in front of Mysore Palace"
                  className="fleet-palace-banner-img"
                />

                {/* Floating Top Pill */}
                <div className="fleet-floating-badge top">
                  <ShieldCheck size={14} className="text-gold" />
                  <span>Verified Fleet • Mysore & Bengaluru</span>
                </div>

                {/* Floating Bottom Card */}
                <div className="fleet-floating-badge bottom">
                  <span className="fleet-pulse-dot" />
                  <div className="floating-badge-text">
                    <span className="badge-bold-title">24/7 Available Fleet</span>
                    <span className="badge-sub-text">Innova Crysta, Sedans & Travellers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Vehicle Cards Grid (2 rows of 3 columns) */}
      <section className="fleet-cards-section" aria-label="Available Vehicles">
        <div className="container">
          <div className="fleet-grid-3x2">
            {FLEET_DATA.map((vehicle) => {
              if (vehicle.isCustomCard) {
                return (
                  <div key={vehicle.id} className="fleet-card-dark-special">
                    <h3 className="special-card-title">{vehicle.name}</h3>
                    <p className="special-card-text">{vehicle.description}</p>
                    <button
                      type="button"
                      onClick={() => handleOpenEnquiry(vehicle.name)}
                      className="btn-enquire-now-pill"
                    >
                      Enquire Now
                    </button>
                  </div>
                );
              }

              return (
                <div key={vehicle.id} className="vehicle-card-white">
                  <div className="vehicle-badge-gold">{vehicle.badge}</div>

                  <div className="vehicle-card-img-wrap">
                    <img
                      src={vehicle.image}
                      alt={vehicle.name}
                      className="vehicle-photo"
                    />
                  </div>

                  <div className="vehicle-card-text">
                    <h3 className="vehicle-name-dark">{vehicle.name}</h3>

                    <div className="vehicle-seater-row">
                      <Users size={14} className="text-gold" />
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
                        {vehicle.localRate && vehicle.localRate !== 'Custom' && (
                          <div className="rate-chip">
                            <span className="rate-chip-label">Local:</span>
                            <span className="rate-chip-val">{vehicle.localRate}</span>
                          </div>
                        )}
                        {vehicle.driverBeta && (
                          <div className="rate-chip">
                            <span className="rate-chip-label">Beta:</span>
                            <span className="rate-chip-val">{vehicle.driverBeta}</span>
                          </div>
                        )}
                      </div>
                    )}

                    <p className="vehicle-tagline-text">{vehicle.description}</p>

                    <button
                      type="button"
                      onClick={() => handleOpenEnquiry(vehicle.name)}
                      className="btn-enquire-now-pill"
                      aria-label={`Enquire about ${vehicle.name} on WhatsApp`}
                    >
                      <MessageCircle size={16} />
                      <span>Enquire Now</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Bottom Feature Commitments Strip (Warm Cream & White Luxury Card) */}
      <section className="fleet-commitments-section" aria-label="Fleet Service Commitments">
        <div className="container">
          <div className="fleet-commitments-card">
            <div className="commitment-item">
              <div className="commitment-icon-bubble">
                <ShieldCheck size={22} className="commitment-icon" />
              </div>
              <div className="commitment-text">
                <h4 className="commitment-title">Well Maintained Vehicles</h4>
                <p className="commitment-sub">Clean, safe & reliable</p>
              </div>
            </div>

            <div className="commitment-item">
              <div className="commitment-icon-bubble">
                <Car size={22} className="commitment-icon" />
              </div>
              <div className="commitment-text">
                <h4 className="commitment-title">Experienced Drivers</h4>
                <p className="commitment-sub">Professional & polite</p>
              </div>
            </div>

            <div className="commitment-item">
              <div className="commitment-icon-bubble">
                <MapPin size={22} className="commitment-icon" />
              </div>
              <div className="commitment-text">
                <h4 className="commitment-title">All India Travel</h4>
                <p className="commitment-sub">Local & PAN India</p>
              </div>
            </div>

            <div className="commitment-item">
              <div className="commitment-icon-bubble">
                <Clock size={22} className="commitment-icon" />
              </div>
              <div className="commitment-text">
                <h4 className="commitment-title">24/7 Support</h4>
                <p className="commitment-sub">Round-the-clock booking</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Quick Enquiry Modal */}
      <QuickEnquiryModal
        isOpen={enquiryModal.isOpen}
        onClose={() => setEnquiryModal({ isOpen: false, prefill: {} })}
        prefill={enquiryModal.prefill}
      />
    </div>
  );
}
