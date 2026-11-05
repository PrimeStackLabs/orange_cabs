import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, Car, Fuel, Users, Check, X, ImagePlus, Upload } from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

const VEHICLE_IMAGE_FALLBACK = '/images/fleet/innova-crysta-zx.webp';

const getVehicleImage = (vehicle) => {
  const descriptor = `${vehicle.name || ''} ${vehicle.category || ''}`.toLowerCase();
  const publicFleetImages = [
    { match: /hycross/, src: '/images/fleet/innova-hycross.webp' },
    { match: /crysta/, src: '/images/fleet/innova-crysta-zx.webp' },
    { match: /ertiga/, src: '/images/fleet/innova-crysta-zx.webp' },
    { match: /fortuner/, src: '/images/fleet/toyota-fortuner.webp' },
    { match: /bmw|x5/, src: '/images/fleet/bmw-x5.webp' },
    { match: /mercedes|e-class/, src: '/images/fleet/mercedes-eclass.webp' },
    { match: /urbania/, src: '/images/fleet/force-urbania.webp' },
    { match: /bharatbenz|coach|bus/, src: '/images/fleet/bharatbenz-coach.webp' },
    { match: /superb/, src: '/images/fleet/skoda-superb.webp' },
    { match: /honda city/, src: '/images/fleet/honda-city.png' },
    { match: /dzire|sedan/, src: '/images/fleet/maruti-dzire.webp' },
    { match: /wagonr|swift|hatchback/, src: '/images/fleet/maruti-dzire.webp' }
  ];
  const configuredImage = typeof vehicle.image === 'string' ? vehicle.image.trim() : '';
  if (configuredImage) return configuredImage;

  return publicFleetImages.find(({ match }) => match.test(descriptor))?.src || VEHICLE_IMAGE_FALLBACK;
};

const VehiclesView = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalVehicle, setModalVehicle] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const imageInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    category: 'Sedan',
    registrationNumber: '',
    seatingCapacity: 4,
    luggageCapacity: 2,
    perKmRate: 13,
    baseFare: 800,
    fuelType: 'Diesel',
    modelYear: 2024,
    image: '/images/fleet/maruti-dzire.webp',
    features: ['Air Conditioning', 'Music System', 'GPS Tracking']
  });

  const fetchVehicles = async () => {
    try {
      const { data } = await api.get('/cabs');
      if (data.success) {
        setVehicles(data.vehicles);
      }
    } catch (err) {
      toast.error('Failed to load fleet');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (!selectedImage) {
      setSelectedImagePreview('');
      return undefined;
    }

    const previewUrl = URL.createObjectURL(selectedImage);
    setSelectedImagePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [selectedImage]);

  const openAdd = () => {
    setModalVehicle(null);
    setSelectedImage(null);
    setForm({
      name: '',
      category: 'Sedan',
      registrationNumber: '',
      seatingCapacity: 4,
      luggageCapacity: 2,
      perKmRate: 13,
      baseFare: 800,
      fuelType: 'Diesel',
      modelYear: 2024,
      image: '/images/fleet/maruti-dzire.webp',
      features: ['Air Conditioning', 'Dual Airbags', 'Music System', 'GPS Tracking']
    });
    setShowModal(true);
  };

  const openEdit = (v) => {
    setModalVehicle(v);
    setSelectedImage(null);
    setForm({
      name: v.name,
      category: v.category,
      registrationNumber: v.registrationNumber,
      seatingCapacity: v.seatingCapacity,
      luggageCapacity: v.luggageCapacity,
      perKmRate: v.perKmRate,
      baseFare: v.baseFare,
      fuelType: v.fuelType,
      modelYear: v.modelYear,
      image: v.image || getVehicleImage(v),
      features: v.features
    });
    setShowModal(true);
  };

  const handleImageSelection = (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    const supportedTypes = {
      jpg: ['image/jpeg'],
      jpeg: ['image/jpeg'],
      png: ['image/png'],
      webp: ['image/webp']
    };

    if (!supportedTypes[extension]?.includes(file.type)) {
      toast.error('Choose a JPG, JPEG, PNG, or WEBP image.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be 5 MB or smaller.');
      return;
    }

    setSelectedImage(file);
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error('Choose an image before uploading.');
      return;
    }

    const body = new FormData();
    body.append('image', selectedImage);
    setUploadingImage(true);
    try {
      const { data } = await api.post('/cabs/upload-image', body, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (!data.success || !data.imageUrl) {
        throw new Error(data.message || 'Image upload did not return an image URL.');
      }

      setForm((current) => ({ ...current, image: data.imageUrl }));
      setSelectedImage(null);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setForm((current) => ({ ...current, image: '' }));
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const vehicleForm = { ...form, image: form.image || VEHICLE_IMAGE_FALLBACK };
      if (modalVehicle) {
        await api.put(`/cabs/${modalVehicle._id}`, vehicleForm);
        toast.success('Vehicle updated');
      } else {
        await api.post('/cabs', vehicleForm);
        toast.success('Vehicle added to fleet');
      }
      setShowModal(false);
      fetchVehicles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save vehicle');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      await api.delete(`/cabs/${id}`);
      toast.success('Vehicle removed');
      fetchVehicles();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-black text-2xl sm:text-3xl text-white">Fleet & Vehicles</h1>
          <p className="text-xs text-gray-400 mt-1">Manage vehicles, per-km tariff rates and capacities</p>
        </div>
        <button
          onClick={openAdd}
          className="btn-shine px-4 py-2.5 rounded-xl bg-orange hover:bg-orange-glow text-white font-bold text-xs shadow-glow-orange flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Vehicle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div key={v._id} className="glass-card rounded-3xl overflow-hidden border border-white/10 flex flex-col justify-between">
            <div>
              <div className="h-44 relative overflow-hidden">
                <img
                  src={getVehicleImage(v)}
                  alt={v.name}
                  className="w-full h-full object-cover"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = VEHICLE_IMAGE_FALLBACK;
                  }}
                />
                <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-orange text-white text-xs font-bold">
                  {v.category}
                </span>
                <span className="absolute bottom-3 left-3 bg-navy/80 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-white">
                  {v.registrationNumber}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-heading font-bold text-lg text-white">{v.name}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mt-2">
                  <span>{v.seatingCapacity} Seats</span>
                  <span>•</span>
                  <span>{v.fuelType}</span>
                  <span>•</span>
                  <span>Year {v.modelYear}</span>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-400 block">Outstation Rate</span>
                    <span className="font-heading font-black text-xl text-orange">₹{v.perKmRate}/km</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-gray-400 block">Base Fare</span>
                    <span className="font-bold text-white">₹{v.baseFare}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 pt-0 border-t border-white/5 flex justify-end gap-2 mt-2">
              <button
                onClick={() => openEdit(v)}
                className="p-2 rounded-xl glass hover:border-orange text-orange"
                title="Edit Vehicle"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(v._id)}
                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 hover:text-white text-red-400 transition-colors"
                title="Delete Vehicle"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Add / Edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/85 backdrop-blur-md">
          <div className="glass-card border border-white/20 p-6 sm:p-8 rounded-3xl max-h-[90vh] overflow-y-auto max-w-lg w-full shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-heading font-bold text-xl text-white mb-4">
              {modalVehicle ? 'Edit Fleet Vehicle' : 'Add New Vehicle'}
            </h3>
            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-300 mb-1">Model Name *</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Toyota Innova Crysta ZX"
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  >
                    <option value="Hatchback" className="bg-navy">Hatchback</option>
                    <option value="Sedan" className="bg-navy">Sedan</option>
                    <option value="SUV" className="bg-navy">SUV</option>
                    <option value="Innova" className="bg-navy">Innova</option>
                    <option value="Tempo Traveller" className="bg-navy">Tempo Traveller</option>
                    <option value="Luxury" className="bg-navy">Luxury</option>
                    <option value="Bus" className="bg-navy">Bus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Registration Plate *</label>
                  <input
                    type="text"
                    required
                    value={form.registrationNumber}
                    onChange={(e) => setForm({ ...form, registrationNumber: e.target.value.toUpperCase() })}
                    placeholder="KA 01 MJ 1024"
                    className="w-full px-3 py-2 rounded-xl glass-input font-mono"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 mb-1">Per Km Rate (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.perKmRate}
                    onChange={(e) => setForm({ ...form, perKmRate: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 mb-1">Base Fare (₹) *</label>
                  <input
                    type="number"
                    required
                    value={form.baseFare}
                    onChange={(e) => setForm({ ...form, baseFare: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl glass-input"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  disabled={uploadingImage}
                  onChange={(e) => {
                    setSelectedImage(null);
                    setForm({ ...form, image: e.target.value });
                  }}
                  className="w-full px-3 py-2 rounded-xl glass-input"
                />
              </div>
              <div className="space-y-2">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                  onChange={handleImageSelection}
                  className="hidden"
                  aria-label="Choose a vehicle image"
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => imageInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-2 rounded-xl glass text-gray-200 flex items-center gap-2"
                  >
                    <ImagePlus className="w-4 h-4 text-orange" />
                    Upload Image from Gallery
                  </button>
                  {selectedImage && (
                    <button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={uploadingImage}
                      className="px-3 py-2 rounded-xl bg-orange hover:bg-orange-glow text-white font-semibold flex items-center gap-2 disabled:opacity-60"
                    >
                      <Upload className="w-4 h-4" />
                      {uploadingImage ? 'Uploading...' : 'Upload Image'}
                    </button>
                  )}
                  {form.image && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      disabled={uploadingImage}
                      className="px-3 py-2 rounded-xl glass text-red-300 flex items-center gap-2 disabled:opacity-60"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove Image
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-gray-400">JPG, JPEG, PNG, or WEBP. Maximum file size: 5 MB.</p>
                {(selectedImagePreview || form.image) && (
                  <img
                    src={selectedImagePreview || form.image}
                    alt="Vehicle image preview"
                    className="h-32 w-full rounded-xl border border-white/10 object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = VEHICLE_IMAGE_FALLBACK;
                    }}
                  />
                )}
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl glass text-gray-300">
                  Cancel
                </button>
                <button type="submit" disabled={uploadingImage} className="px-5 py-2 rounded-xl bg-orange hover:bg-orange-glow text-white font-bold disabled:opacity-60">
                  {uploadingImage ? 'Uploading image...' : 'Save Vehicle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesView;
