import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../services/api';

const ContactSettingsContext = createContext({
  phone: '',
  phoneHref: '',
  whatsappHref: ''
});

function getPhoneDetails(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return { phone: '', phoneHref: '' };

  const internationalDigits = digits.length === 10 ? `91${digits}` : digits;
  return {
    phone: String(value).trim(),
    phoneHref: `tel:+${internationalDigits}`
  };
}

function getWhatsAppHref(value) {
  const digits = String(value || '').replace(/\D/g, '');
  if (!digits) return '';

  return `https://wa.me/${digits.length === 10 ? `91${digits}` : digits}`;
}

export function ContactSettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    phone: '',
    whatsapp: ''
  });

  useEffect(() => {
    let active = true;

    const refreshSettings = () => {
      api.get('/settings')
        .then(({ data }) => {
          if (active && data.success && data.settings) {
            setSettings({
              phone: data.settings.phone || '',
              whatsapp: data.settings.whatsapp || ''
            });
          }
        })
        .catch((error) => {
          console.error('Failed to load contact settings:', error);
        });
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') refreshSettings();
    };
    const handleSettingsUpdate = (event) => {
      if (event.key === 'orange-cabs-contact-settings-updated') refreshSettings();
    };

    refreshSettings();
    const refreshInterval = window.setInterval(refreshWhenVisible, 15000);
    window.addEventListener('focus', refreshSettings);
    document.addEventListener('visibilitychange', refreshWhenVisible);
    window.addEventListener('storage', handleSettingsUpdate);

    return () => {
      active = false;
      window.clearInterval(refreshInterval);
      window.removeEventListener('focus', refreshSettings);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
      window.removeEventListener('storage', handleSettingsUpdate);
    };
  }, []);

  const value = useMemo(() => ({
    ...getPhoneDetails(settings.phone),
    whatsappHref: getWhatsAppHref(settings.whatsapp)
  }), [settings]);

  return (
    <ContactSettingsContext.Provider value={value}>
      {children}
    </ContactSettingsContext.Provider>
  );
}

export function useContactSettings() {
  return useContext(ContactSettingsContext);
}
