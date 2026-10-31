import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Car } from 'lucide-react';

const Preloader = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#101010]"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute w-80 h-80 rounded-full bg-brandRed/15 blur-[120px] pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <img
                src="/images/orange-cab-logo.png"
                alt="Orange Cabs"
                className="h-14 sm:h-16 w-auto object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/logo_2.png';
                }}
              />
            </motion.div>

            {/* Slogan */}
            <motion.p
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="text-[11px] tracking-[0.25em] text-gray-400 uppercase font-medium"
            >
              Every Journey Deserves Excellence
            </motion.p>

            {/* Sleek progress line */}
            <div className="w-40 h-0.5 bg-white/10 rounded-full mt-6 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.7, ease: 'easeInOut' }}
                className="h-full bg-gradient-to-r from-brandRed to-accentOrange rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Preloader;
