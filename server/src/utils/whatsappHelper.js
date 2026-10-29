/**
 * WhatsApp message generator for SKB Tour and Travels
 * Primary WhatsApp Booking & Enquiry Number: 7338140524 (+91 73381 40524)
 */

const WHATSAPP_PHONE = process.env.WHATSAPP_NUMBER || '917338140524';

function formatBookingWhatsAppMessage(booking) {
  const tripTypeLabels = {
    airport_transfer: 'Airport Transfer (Pickup / Drop)',
    local_4h_40km: 'Local Trip (4 Hours / 40 KM)',
    local_8h_80km: 'Local Trip (8 Hours / 80 KM)',
    outstation_oneway: 'Outstation One-Way Drop',
    outstation_round: 'Outstation Round Trip',
    pan_india: 'PAN India Long Distance Trip',
    group_travel: 'Family / Group Travel',
  };

  const tripLabel = tripTypeLabels[booking.tripType] || booking.tripTypeLabel || booking.tripType;
  const dateFormatted = booking.travelDate
    ? new Date(booking.travelDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : 'To be confirmed';

  const returnDateFormatted = booking.returnDate
    ? new Date(booking.returnDate).toLocaleDateString('en-IN', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null;

  let msg = `*NEW BOOKING ENQUIRY — SKB TOUR AND TRAVELS*\n`;
  if (booking.bookingReference) {
    msg += `Ref ID: *${booking.bookingReference}*\n`;
  }
  msg += `─────────────────────────\n`;
  msg += `*Customer Name:* ${booking.fullName}\n`;
  msg += `*Contact Number:* ${booking.phoneNumber}\n`;
  msg += `*Trip Category:* ${tripLabel}\n`;
  msg += `*Vehicle Preference:* ${booking.preferredVehicle}\n`;
  msg += `*Pickup Location:* ${booking.pickupLocation}\n`;
  msg += `*Destination:* ${booking.destination}\n`;
  msg += `*Travel Date:* ${dateFormatted}\n`;
  if (booking.pickupTime) {
    msg += `*Pickup Time:* ${booking.pickupTime}\n`;
  }
  if (booking.passengerCount) {
    msg += `*Passengers:* ${booking.passengerCount}\n`;
  }
  if (returnDateFormatted) {
    msg += `*Return Date:* ${returnDateFormatted}\n`;
  }
  if (booking.additionalStops) {
    msg += `*Via / Stops:* ${booking.additionalStops}\n`;
  }
  if (booking.luggageInfo) {
    msg += `*Luggage Info:* ${booking.luggageInfo}\n`;
  }
  if (booking.additionalInstructions) {
    msg += `*Special Instructions:* ${booking.additionalInstructions}\n`;
  }
  msg += `─────────────────────────\n`;
  msg += `*Request:* Please confirm availability and exact written fare for this route. Thank you!`;

  const encodedText = encodeURIComponent(msg);
  const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;

  return { rawText: msg, encodedText, url };
}

module.exports = {
  WHATSAPP_PHONE,
  formatBookingWhatsAppMessage,
};
