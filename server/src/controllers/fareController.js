import Setting from '../models/Setting.js';

const CAB_RATES = {
  Sedan: { perKm: 13, baseFare: 800, baseKm: 40, capacity: 4, name: 'Comfort Sedan (Etios/Dzire)' },
  SUV: { perKm: 18, baseFare: 1200, baseKm: 40, capacity: 6, name: 'Spacious SUV (Ertiga/Carens)' },
  Innova: { perKm: 22, baseFare: 1600, baseKm: 40, capacity: 7, name: 'Innova Crysta Premium' },
  'Tempo Traveller': { perKm: 28, baseFare: 2500, baseKm: 50, capacity: 12, name: 'Executive Tempo (12-16 Seater)' },
  Luxury: { perKm: 45, baseFare: 3500, baseKm: 40, capacity: 4, name: 'Luxury Class (Mercedes/BMW)' }
};

export const calculateFare = async (req, res, next) => {
  try {
    const { tripType = 'outstation_oneway', distanceKm = 100, cabType = 'Sedan', days = 1 } = req.body;
    
    const settings = (await Setting.findOne()) || {
      gstPercentage: 5,
      driverAllowancePerDay: 400,
      tollTaxesEstimated: 250
    };

    const dist = Math.max(Number(distanceKm) || 50, 20);
    const numDays = Math.max(Number(days) || 1, 1);
    const cab = CAB_RATES[cabType] || CAB_RATES.Sedan;

    let effectiveDistance = dist;
    if (tripType === 'outstation_round') {
      // Outstation round trips generally have min 250 km / day or 2x distance
      effectiveDistance = Math.max(dist * 2, 250 * numDays);
    } else if (tripType === 'local') {
      effectiveDistance = Math.max(dist, 80);
    } else if (tripType === 'airport') {
      effectiveDistance = Math.max(dist, 40);
    }

    const distanceFare = Math.round(effectiveDistance * cab.perKm);
    const driverAllowance = (tripType === 'outstation_round' || tripType === 'outstation_oneway')
      ? settings.driverAllowancePerDay * numDays
      : 0;
    
    const tollAndTaxes = tripType.startsWith('outstation') ? settings.tollTaxesEstimated : 100;
    const subtotal = cab.baseFare + distanceFare + driverAllowance + tollAndTaxes;
    const gst = Math.round((subtotal * settings.gstPercentage) / 100);
    const totalFare = subtotal + gst;

    res.json({
      success: true,
      data: {
        tripType,
        cabType,
        cabName: cab.name,
        capacity: cab.capacity,
        estimatedDistanceKm: dist,
        chargeableDistanceKm: effectiveDistance,
        perKmRate: cab.perKm,
        breakdown: {
          baseFare: cab.baseFare,
          distanceFare,
          driverAllowance,
          tollAndTaxes,
          gst,
          totalFare
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTariffRates = async (req, res) => {
  res.json({
    success: true,
    rates: CAB_RATES
  });
};
