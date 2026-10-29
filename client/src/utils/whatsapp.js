/**
 * Client-side WhatsApp utilities for SKB Tour and Travels
 * Primary WhatsApp Booking & Enquiry Number: 7338140524 (+91 73381 40524)
 */

export const WHATSAPP_NUMBER =
  (import.meta.env.VITE_WHATSAPP_NUMBER ? String(import.meta.env.VITE_WHATSAPP_NUMBER).replace(/\D/g, '') : '') ||
  '917338140524';

export function createWhatsAppBookingUrl(bookingData) {
  const tripTypeLabels = {
    airport_transfer: 'Airport Pickup / Drop',
    local_4h_40km: 'Local Trip (4 Hours / 40 KM)',
    local_8h_80km: 'Local Trip (8 Hours / 80 KM)',
    outstation_oneway: 'Outstation One-Way Drop',
    outstation_round: 'Outstation Round Trip',
    pan_india: 'PAN India Travel',
    group_travel: 'Family / Group Travel',
  };

  const tripLabel = tripTypeLabels[bookingData.tripType] || bookingData.tripTypeLabel || bookingData.tripType;

  const dateStr = bookingData.travelDate
    ? new Date(bookingData.travelDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'Pending';

  const returnDateStr = bookingData.returnDate
    ? new Date(bookingData.returnDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  let msg = `*NEW BOOKING ENQUIRY — SKB TOUR AND TRAVELS*\n`;
  if (bookingData.bookingReference) {
    msg += `Reference ID: *${bookingData.bookingReference}*\n`;
  }
  msg += `─────────────────────────\n`;
  msg += `*Name:* ${bookingData.fullName || 'Not provided'}\n`;
  msg += `*Phone:* ${bookingData.phoneNumber || 'Not provided'}\n`;
  msg += `*Trip Type:* ${tripLabel}\n`;
  msg += `*Vehicle:* ${bookingData.preferredVehicle || 'Not selected'}\n`;
  msg += `*Pickup:* ${bookingData.pickupLocation || 'Not specified'}\n`;
  msg += `*Destination:* ${bookingData.destination || 'Not specified'}\n`;
  msg += `*Travel Date:* ${dateStr}\n`;

  if (bookingData.pickupTime) {
    msg += `*Pickup Time:* ${bookingData.pickupTime}\n`;
  }
  if (bookingData.passengerCount) {
    msg += `*Passengers:* ${bookingData.passengerCount}\n`;
  }
  if (returnDateStr) {
    msg += `*Return Date:* ${returnDateStr}\n`;
  }
  if (bookingData.additionalStops) {
    msg += `*Via / Stops:* ${bookingData.additionalStops}\n`;
  }
  if (bookingData.luggageInfo) {
    msg += `*Luggage:* ${bookingData.luggageInfo}\n`;
  }
  if (bookingData.additionalInstructions) {
    msg += `*Special Note:* ${bookingData.additionalInstructions}\n`;
  }
  msg += `─────────────────────────\n`;
  msg += `*Request:* Please confirm availability and the exact written fare for this route. Thank you!`;

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function createWhatsAppQuickUrl(text) {
  const fallback = 'Hello Vicky, I would like to enquire about booking a vehicle with SKB Tour and Travels.';
  const message = text || fallback;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
