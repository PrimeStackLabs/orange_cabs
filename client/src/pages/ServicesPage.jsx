import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BusFront, Building2, Check, MapPin, Plane, Sparkles, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useBookingModal } from '../context/BookingModalContext';
import api from '../services/api';
import { VEHICLE_IMAGE_FALLBACK } from '../constants/vehicleImages';

export default function ServicesPage() {
  const { openBookingModal } = useBookingModal();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    api.get('/services')
      .then(({ data }) => {
        if (active && data.success) setServices(data.services || []);
      })
      .catch((error) => {
        console.error('Failed to load public services:', error);
        toast.error('Services could not be loaded. Please try again later.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="bg-[#F7F7F7] pb-20 pt-24 text-charcoal">
      <section className="services-page-hero relative overflow-hidden">
        <motion.div
          className="mx-auto grid min-h-[390px] max-w-7xl grid-cols-1 items-center gap-8 px-5 py-9 sm:px-8 lg:min-h-[410px] lg:grid-cols-[1fr_1.05fr] lg:gap-12 lg:px-12"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FFE0A6] bg-[#FFF3D6] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#D94308] sm:text-xs">
              <BusFront className="h-4 w-4" />
              Transportation Services
            </span>
            <h1 className="mt-4 max-w-[650px] font-heading text-4xl font-black leading-[1.03] tracking-tight text-[#171717] sm:text-5xl lg:text-[52px]">
              Reliable Travel Solutions for{' '}
              <span className="services-page-hero__highlight">Every Journey</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base sm:leading-7">
              From airport pickups to corporate travel, choose a service and let our team take care of the details.
            </p>

            <div className="mt-6 grid max-w-xl grid-cols-2 gap-y-4 sm:grid-cols-4 sm:gap-y-0">
              {[
                { label: <>Airport<br />Transfers</>, Icon: Plane },
                { label: <>Group<br />Travel</>, Icon: Users },
                { label: <>Corporate<br />Travel</>, Icon: Building2 },
                { label: <>Outstation<br />Trips</>, Icon: MapPin },
              ].map(({ label, Icon }, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center gap-1.5 px-2 text-center ${index > 0 ? 'sm:border-l sm:border-gray-300' : ''}`}
                >
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF0DD] text-[#F45B0B]">
                    <Icon className="h-6 w-6" />
                  </span>
                  <span className="text-xs font-bold leading-tight text-[#262626] sm:text-[13px]">{label}</span>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openBookingModal}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F45B0B] to-[#D94308] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-900/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                Book Your Ride <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/fleet"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#171717] px-6 py-2.5 text-sm font-semibold text-[#171717] transition duration-200 hover:border-[#F45B0B] hover:bg-orange-50 hover:text-[#D94308]"
              >
                <BusFront className="h-4 w-4" /> View Our Fleet
              </Link>
            </div>
          </div>

          <div className="services-page-hero__visual relative mx-auto h-[250px] w-full max-w-[760px] sm:h-[340px] lg:h-[350px]">
            <div className="services-page-hero__accent" />
            <div className="services-page-hero__photo-frame">
              <img
                src="/images/fleet/force-urbania.webp"
                alt="Force Urbania ready for comfortable group and corporate travel"
                className="services-page-hero__image"
              />
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <div key={index} className="h-96 animate-pulse rounded-3xl bg-white shadow-sm" />
              ))}
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-600">
              No services are currently available. Please contact us for assistance.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <motion.article
                  key={service._id || service.slug}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  className="luxury-card group flex flex-col overflow-hidden"
                >
                  <div className="relative h-56 overflow-hidden bg-gray-100">
                    <img
                      src={service.image}
                      alt={service.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = VEHICLE_IMAGE_FALLBACK;
                      }}
                    />
                    {service.badge && (
                      <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-bold text-brandRed shadow-sm">
                        <Sparkles className="h-3.5 w-3.5 text-orange-600" />
                        {service.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between gap-5 p-6">
                    <div>
                      <h2 className="font-heading text-xl font-bold text-charcoal transition-colors group-hover:text-orange-700">
                        {service.title}
                      </h2>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600">{service.description}</p>
                      {service.features?.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {service.features.slice(0, 3).map((feature) => (
                            <li key={feature} className="flex items-start gap-2 text-xs text-gray-600">
                              <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => openBookingModal({ serviceType: service.title })}
                      className="btn-primary flex w-full items-center justify-center gap-2 text-sm"
                    >
                      Book this service
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
