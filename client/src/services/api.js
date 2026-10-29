/**
 * REST API client for SKB Tour and Travels
 */

import { API_BASE } from './apiConfig';

export async function submitBooking(bookingPayload) {
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingPayload),
    });

    if (!res.ok) {
      let msg = 'Server rejected the booking enquiry.';
      try {
        const data = await res.json();
        if (data?.message) msg = data.message;
      } catch {
        // Not JSON
      }
      throw new Error(msg);
    }
    return await res.json();
  } catch (error) {
    console.warn('[API Warning] submitBooking failed, falling back to local processing:', error.message);
    throw error;
  }
}

export async function submitContact(contactPayload) {
  try {
    const res = await fetch(`${API_BASE}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactPayload),
    });

    if (!res.ok) {
      let msg = 'Failed to submit contact message.';
      try {
        const data = await res.json();
        if (data?.message) msg = data.message;
      } catch {
        // Not JSON
      }
      throw new Error(msg);
    }
    return await res.json();
  } catch (error) {
    console.warn('[API Warning] submitContact failed:', error.message);
    throw error;
  }
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
