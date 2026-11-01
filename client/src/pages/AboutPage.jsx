import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  CarFront,
  CheckCircle2,
  Clock3,
  Compass,
  Phone,
  PlayCircle,
  ShieldCheck,
  Tag,
  Users,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBookingModal } from '../context/BookingModalContext';

export default function AboutPage() {
  const { openBookingModal } = useBookingModal();

  const corePillars = [
    {
      title: 'Certified Safety & Defense',
      desc: 'Rigorous 100% background-checked chauffeurs, real-time GPS telematics, speed governors, and 24/7 SOS dispatch room.',
      image: '/images/SAFETY.jpg',
      icon: ShieldCheck,
    },
    {
      title: 'Statutory Compliance',
      desc: '100% commercial registration compliance, comprehensive passenger insurance, certified fitness certificates, and GST billing.',
      image: '/images/COMPLIANCE.jpg',
      icon: CheckCircle2,
    },
    {
      title: 'Green & Sustainable Mobility',
      desc: 'Active introduction of CNG and electric vehicles (EV) to help enterprise partners fulfill their ESG decarbonization goals.',
      image: '/images/SUSTAINABILITY.jpg',
      icon: Compass,
    },
  ];

  return (
    <div className="about-page pt-20 text-charcoal">
      <section className="about-hero relative overflow-hidden bg-white text-[#171717]">
        <motion.div
          className="relative z-10 mx-auto grid min-h-[460px] max-w-[1580px] grid-cols-1 items-center gap-8 px-5 py-10 sm:px-8 lg:min-h-[570px] lg:grid-cols-[0.94fr_1.06fr] lg:gap-10 lg:px-12"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          <div className="relative z-10 max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#FFE0A6] bg-[#FFF3D6] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#D94308] sm:text-xs">
              <CarFront className="h-4 w-4" />
              Automotive Excellence
            </span>
            <h1 className="mt-5 max-w-[720px] font-heading text-4xl font-black leading-[1.02] tracking-tight sm:text-5xl lg:text-[60px]">
              Redefining <span className="about-hero__highlight">Executive</span>
              <br />Transportation
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-6 text-[#4c5b73] sm:text-base sm:leading-7">
              Founded with a commitment to integrity, punctuality, and passenger peace of mind across South India.
            </p>
            <div className="about-hero__trust mt-7 grid max-w-xl grid-cols-2 sm:grid-cols-4">
              {[
                { label: <>Safe &amp;<br />Reliable</>, Icon: ShieldCheck },
                { label: <>Spacious &amp;<br />Comfortable</>, Icon: Users },
                { label: <>On-Time<br />Service</>, Icon: Clock3 },
                { label: <>Transparent<br />Pricing</>, Icon: Tag },
              ].map(({ label, Icon }, index) => (
                <div key={index} className="flex flex-col items-center gap-1.5 px-1 py-2 text-center sm:border-l sm:border-gray-300 sm:first:border-0 sm:px-2">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0DD] text-[#F45B0B] sm:h-12 sm:w-12">
                    <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </span>
                  <span className="text-[10px] font-bold leading-tight text-[#171717] sm:text-xs">{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={openBookingModal}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F45B0B] to-[#D94308] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-900/20 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl"
              >
                <CarFront className="h-5 w-5" />
                Book Your Ride <ArrowRight className="h-4 w-4" />
              </button>
              <Link
                to="/fleet"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#F45B0B] px-6 py-3 text-sm font-semibold text-[#171717] transition duration-200 hover:bg-orange-50 hover:text-[#D94308]"
              >
                <PlayCircle className="h-5 w-5 text-[#F45B0B]" /> Explore Our Fleet
              </Link>
            </div>
          </div>

          <div className="about-hero__visual relative mx-auto h-[260px] w-full max-w-[820px] sm:h-[360px] lg:h-[460px]">
            <div className="about-hero__accent" />
            <div className="about-hero__photo-frame">
              <img
                src="/images/fleet/innova-crysta-zx.webp"
                alt="Orange Cars executive Toyota Innova"
                className="about-hero__image"
              />
            </div>
            <div className="about-hero__vehicle-card">
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold text-[#171717] sm:text-sm">
                <Users className="h-4 w-4 text-[#F45B0B]" />
                Comfort for every passenger
              </span>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="story" className="bg-white py-12 sm:py-14 lg:py-16">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 lg:px-12">
          <motion.div
            className="about-founder-card relative min-h-[250px] overflow-hidden rounded-[22px] bg-[#171717] shadow-xl sm:min-h-[310px]"
            initial={{ opacity: 0, x: -18 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <img src="/images/fleet/innova-crysta-zx.webp" alt="Premium Orange Cars fleet vehicle" className="absolute inset-0 h-full w-full object-cover object-center" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171717] via-[#171717]/35 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#FFB900]">Orange Cars Premium Fleet</span>
              <p className="mt-2 max-w-sm font-heading text-xl font-bold leading-snug sm:text-2xl">Every journey, elevated.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55 }}
          >
            <span className="badge-pill-orange">Our Story &amp; Heritage</span>
            <h2 className="mt-3 font-heading text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-[34px]">
              Built on Trust, <span className="text-[#D94308]">Precision, and Unwavering Commitment</span>
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Orange Cabs was established to address the critical gaps in intercity and corporate employee transportation: unpredictable surge tariffs, last-minute cancellations, and lack of driver accountability.
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Today, Orange Cabs operates one of Bangalore&apos;s most reliable premium fleets, providing airport transfers, dedicated enterprise rosters, executive sedans, Toyota Innovas, and luxury tourist coaches to over 100 enterprise clients and thousands of private travelers.
            </p>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <div className="rounded-xl border border-orange-100 bg-white p-3.5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <h3 className="font-heading text-sm font-bold text-[#171717]">Our Mission</h3>
                <p className="mt-1 text-xs leading-5 text-gray-600">Make every trip dependable through professional chauffeurs, clear fares, and thoughtful service.</p>
              </div>
              <div className="rounded-xl border border-orange-100 bg-white p-3.5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                <h3 className="font-heading text-sm font-bold text-[#171717]">Our Vision</h3>
                <p className="mt-1 text-xs leading-5 text-gray-600">Set a higher standard for safe, comfortable mobility for people and businesses across India.</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {[
                ['10,000+', 'Successful Trips'],
                ['99.8%', 'On-Time Record'],
                ['100+', 'Corporate Partners'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-xl bg-white px-2 py-3 text-center">
                  <strong className="block font-heading text-lg font-black leading-5 text-[#D94308] sm:text-xl">{value}</strong>
                  <span className="mt-1 block text-[9px] font-medium leading-3 text-gray-500 sm:text-[10px]">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="bg-[#FFF9F2] py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <div className="mx-auto mb-8 max-w-2xl text-center sm:mb-9">
            <span className="badge-pill-orange">Enterprise Governance</span>
            <h2 className="mt-4 font-heading text-3xl font-black tracking-tight sm:text-4xl">
              Our Pillars of <span className="text-[#F45B0B]">Excellence</span>
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              We uphold the highest benchmarks of safety, compliance, and environmental stewardship across every kilometre travelled.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {corePillars.map((pillar, index) => {
              const Icon = pillar.icon;
              return (
                <motion.article
                  key={pillar.title}
                  className="group overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{ duration: 0.45, delay: index * 0.08 }}
                >
                  <div className="relative h-36 overflow-hidden bg-orange-50 sm:h-40">
                    <img
                      src={pillar.image}
                      alt={pillar.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = '/images/fleet/innova-crysta-zx.webp';
                      }}
                    />
                    <span className="absolute bottom-4 left-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#F45B0B] shadow-md">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="font-heading text-lg font-bold text-[#171717]">{pillar.title}</h3>
                    <p className="mt-1.5 text-xs leading-5 text-gray-600">{pillar.desc}</p>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="about-cta relative isolate overflow-hidden px-5 py-10 text-center text-[#171717] sm:px-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-heading text-2xl font-black tracking-tight sm:text-3xl">
            Ready to Travel with <span className="text-[#D94308]">Orange Cabs?</span>
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xs leading-5 text-gray-600 sm:text-sm">
            Book your journey online or contact our enterprise team for customized corporate proposals.
          </p>
          <div className="mt-5 flex flex-col justify-center gap-3 sm:flex-row">
            <button
              onClick={openBookingModal}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#F45B0B] to-[#D94308] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              Book Your Ride <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('openCorporateProposal'))}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-full border border-[#171717] px-5 py-2.5 text-xs font-semibold text-[#171717] transition hover:border-[#D94308] hover:bg-orange-50 hover:text-[#D94308]"
            >
              <Building2 className="h-4 w-4" /> Corporate Inquiries
            </button>
          </div>
          <a href="tel:+919742588995" className="mt-4 inline-flex items-center gap-2 text-xs text-gray-600 transition hover:text-[#D94308]">
            <Phone className="h-3.5 w-3.5 text-[#D94308]" /> Need help? +91 97425 88995
          </a>
        </div>
      </section>
    </div>
  );
}
