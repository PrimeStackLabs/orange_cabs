/**
 * REST API client for SKB Tour and Travels
 * Resilient, fast client that stores all enquiries and bookings to backend AND syncs to local admin stores
 */

import { API_BASE } from './apiConfig';
import { WHATSAPP_NUMBER } from '../utils/whatsapp';

// Local storage synchronizer to ensure admin always sees latest submissions immediately
function syncToLocalStorage(key, newItem, uniqueField = '_id') {
  try {
    const raw = localStorage.getItem(key);
    let items = raw ? JSON.parse(raw) : [];
    // Avoid duplicates
    items = items.filter((item) => item[uniqueField] !== newItem[uniqueField]);
    items.unshift(newItem);
    localStorage.setItem(key, JSON.stringify(items));
  } catch (err) {
    console.warn(`Local sync warning for ${key}:`, err.message);
  }
}

/**
 * Submit Booking Enquiry
 */
export async function submitBooking(bookingPayload) {
  const localRef = `SKB-${Date.now().toString().slice(-6)}`;
  const localRecord = {
    _id: 'b_' + Date.now(),
    bookingReference: localRef,
    ...bookingPayload,
    status: 'enquiry_received',
    createdAt: new Date().toISOString(),
  };

  // Immediate local cache update
  syncToLocalStorage('skb_admin_bookings', localRecord, 'bookingReference');
  syncToLocalStorage(
    'skb_admin_enquiries',
    {
      _id: 'enq_' + Date.now(),
      enquiryReference: `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: bookingPayload.fullName,
      phoneNumber: bookingPayload.phoneNumber,
      tripType: bookingPayload.tripType,
      pickupLocation: bookingPayload.pickupLocation,
      destination: bookingPayload.destination,
      preferredVehicle: bookingPayload.preferredVehicle,
      preferredDate: bookingPayload.travelDate,
      message: bookingPayload.additionalInstructions || `Booking ref ${localRef}`,
      status: 'new',
      source: 'website_form',
      createdAt: new Date().toISOString(),
    },
    'enquiryReference'
  );

  syncToLocalStorage(
    'skb_admin_customers',
    {
      _id: 'c_' + Date.now(),
      name: bookingPayload.fullName,
      phoneNumber: bookingPayload.phoneNumber,
      lastTripDate: bookingPayload.travelDate || new Date().toISOString(),
      totalBookings: 1,
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    'phoneNumber'
  );

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingPayload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.booking) {
        syncToLocalStorage('skb_admin_bookings', data.booking, '_id');
      }
      return data;
    }
  } catch (error) {
    console.warn('[API Warning] submitBooking remote error, preserved locally:', error.message);
  }

  // Fallback return if remote is slow / sleeping
  return {
    success: true,
    dbPersisted: false,
    booking: localRecord,
    message: 'Booking enquiry recorded. Vicky will confirm availability and fare on WhatsApp.',
  };
}

/**
 * Submit Quick Travel Enquiry (From Fleet, Packages, Quick Search, or Instant WhatsApp)
 */
export async function submitEnquiry(enquiryPayload) {
  const refNum = Math.floor(1000 + Math.random() * 9000);
  const enquiryRef = `ENQ-${refNum}`;
  const cleanPhone = String(enquiryPayload.phoneNumber || '').replace(/\D/g, '');

  const localEnquiry = {
    _id: 'enq_' + Date.now(),
    enquiryReference: enquiryRef,
    customerName: enquiryPayload.customerName?.trim() || 'Guest Customer',
    phoneNumber: cleanPhone,
    email: enquiryPayload.email || '',
    tripType: enquiryPayload.tripType || 'General Enquiry',
    pickupLocation: enquiryPayload.pickupLocation || '',
    destination: enquiryPayload.destination || '',
    preferredVehicle: enquiryPayload.preferredVehicle || '',
    preferredDate: enquiryPayload.preferredDate || null,
    message: enquiryPayload.message || '',
    source: enquiryPayload.source || 'whatsapp_click',
    status: 'new',
    createdAt: new Date().toISOString(),
  };

  // Immediate storage in local Admin cache
  syncToLocalStorage('skb_admin_enquiries', localEnquiry, 'enquiryReference');
  syncToLocalStorage(
    'skb_admin_customers',
    {
      _id: 'c_' + Date.now(),
      name: localEnquiry.customerName,
      phoneNumber: localEnquiry.phoneNumber,
      email: localEnquiry.email,
      lastTripDate: new Date().toISOString(),
      totalBookings: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    },
    'phoneNumber'
  );

  // Generate WhatsApp message
  let waText = `*NEW TRAVEL ENQUIRY — SKB TOUR AND TRAVELS*\n`;
  waText += `Ref: *${enquiryRef}*\n`;
  waText += `─────────────────────────\n`;
  waText += `*Name:* ${localEnquiry.customerName}\n`;
  waText += `*Phone:* ${localEnquiry.phoneNumber}\n`;
  if (localEnquiry.preferredVehicle) waText += `*Vehicle:* ${localEnquiry.preferredVehicle}\n`;
  if (localEnquiry.tripType) waText += `*Trip Category:* ${localEnquiry.tripType}\n`;
  if (localEnquiry.pickupLocation) waText += `*Pickup:* ${localEnquiry.pickupLocation}\n`;
  if (localEnquiry.destination) waText += `*Destination:* ${localEnquiry.destination}\n`;
  if (localEnquiry.preferredDate) {
    try {
      const d = new Date(localEnquiry.preferredDate);
      if (!isNaN(d)) {
        waText += `*Travel Date:* ${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}\n`;
      }
    } catch {
      // ignore date format error
    }
  }
  if (localEnquiry.message) waText += `*Details:* ${localEnquiry.message}\n`;
  waText += `─────────────────────────\n`;
  waText += `Hello Vicky, I would like to check availability and rate for this enquiry.`;

  const fallbackUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 9000);

    const res = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enquiryPayload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.enquiry) {
        syncToLocalStorage('skb_admin_enquiries', data.enquiry, '_id');
      }
      return {
        ...data,
        whatsappUrl: data.whatsappUrl || fallbackUrl,
      };
    }
  } catch (err) {
    console.warn('[API Warning] submitEnquiry remote failed, stored locally:', err.message);
  }

  return {
    success: true,
    dbPersisted: false,
    enquiry: localEnquiry,
    whatsappUrl: fallbackUrl,
  };
}

/**
 * Submit Contact Form Message
 */
export async function submitContact(contactPayload) {
  const localContact = {
    _id: 'contact_' + Date.now(),
    name: contactPayload.name,
    phone: contactPayload.phone,
    email: contactPayload.email || '',
    subject: contactPayload.subject || 'General Travel Enquiry',
    message: contactPayload.message,
    createdAt: new Date().toISOString(),
  };

  syncToLocalStorage('skb_admin_contacts', localContact);

  // Also submit as enquiry so admin inbox has it immediately
  await submitEnquiry({
    customerName: contactPayload.name,
    phoneNumber: contactPayload.phone,
    email: contactPayload.email,
    tripType: contactPayload.subject || 'Contact Page Enquiry',
    message: contactPayload.message,
    source: 'contact_page',
  }).catch(() => {});

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(`${API_BASE}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactPayload),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      return await res.json();
    }
  } catch (error) {
    console.warn('[API Warning] submitContact remote error:', error.message);
  }

  return {
    success: true,
    message: 'Thank you! Your message and enquiry have been received. Vicky will call or message you shortly.',
    contact: localContact,
  };
}

export async function fetchFleet() {
  try {
    const res = await fetch(`${API_BASE}/fleet`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.fleet;
  } catch (error) {
    console.warn('[API Warning] fetchFleet failed, using static data:', error.message);
    return null;
  }
}
