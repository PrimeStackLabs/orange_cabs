import Setting from '../models/Setting.js';

const LEGACY_CATEGORY_ALIASES = {
  'Premium Sedan': 'Sedan',
  'Executive Sedan': 'Sedan',
  Innova: 'SUV',
  'Toyota Innova Crysta': 'SUV',
  'Toyota Innova Hycross': 'SUV',
  'Luxury SUV': 'Luxury Cars',
  Luxury: 'Luxury Cars',
  'Mercedes-Benz': 'Luxury Cars',
  'Luxury Mini Bus': 'Tempo Traveller'
};

const getCategory = (categories, requestedCategory) => {
  const categoryName = LEGACY_CATEGORY_ALIASES[requestedCategory] || requestedCategory;
  return categories.find(({ name }) => name.toLowerCase() === categoryName.toLowerCase());
};

export const calculateFare = async (req, res, next) => {
  try {
    const {
      tripType = 'outstation_oneway',
      distanceKm = 100,
      cabType = 'Sedan',
      days = 1
    } = req.body;
    const distance = Number(distanceKm);
    const settings = await Setting.findOne() || await Setting.create({});
    const categories = settings.vehicleCategories || [];
    const category = getCategory(categories, cabType);

    if (!Number.isFinite(distance) || distance <= 0) {
      return res.status(400).json({ success: false, message: 'Enter a valid trip distance.' });
    }

    if (!category) {
      return res.status(400).json({ success: false, message: 'Select a valid vehicle category.' });
    }

    const isOutstation = String(tripType).startsWith('outstation');
    const minimumDistance = isOutstation
      ? settings?.outstationPricing?.minimumBillingDistance || 300
      : 0;
    const chargeableDistanceKm = Math.max(distance, minimumDistance);
    const distanceFare = Math.round(chargeableDistanceKm * category.minRate);

    res.json({
      success: true,
      data: {
        tripType,
        cabType: category.name,
        cabName: category.name,
        capacity: category.passengers,
        estimatedDistanceKm: distance,
        chargeableDistanceKm,
        perKmRate: category.minRate,
        maximumPerKmRate: category.maxRate,
        breakdown: {
          baseFare: 0,
          distanceFare,
          driverAllowance: 0,
          tollAndTaxes: 0,
          gst: 0,
          totalFare: distanceFare
        },
        outstationPricing: isOutstation ? settings?.outstationPricing : undefined
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getTariffRates = async (req, res, next) => {
  try {
    const settings = await Setting.findOne() || await Setting.create({});
    const rates = Object.fromEntries((settings.vehicleCategories || []).map((category) => [
      category.name,
      {
        perKm: category.minRate,
        maxPerKm: category.maxRate,
        baseFare: 0,
        baseKm: settings.outstationPricing?.minimumBillingDistance || 300,
        capacity: category.passengers,
        name: category.name
      }
    ]));

    res.json({
      success: true,
      rates,
      minimumBillingDistance: settings.outstationPricing?.minimumBillingDistance || 300
    });
  } catch (error) {
    next(error);
  }
};
