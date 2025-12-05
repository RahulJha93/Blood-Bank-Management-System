import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, User, Heart, Droplet, AlertCircle, Check } from 'lucide-react';

const DonationRegistrationModal = ({ camp, isOpen, onClose, onConfirm, isLoading }) => {
  const [formData, setFormData] = useState({
    preferredTime: '',
    specialRequests: '',
    emergencyContact: '',
    emergencyPhone: '',
    consentGiven: false
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.consentGiven) {
      newErrors.consentGiven = 'You must give consent to proceed';
    }
    
    if (formData.emergencyContact && !formData.emergencyPhone) {
      newErrors.emergencyPhone = 'Emergency contact phone is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    
    onConfirm(camp._id, formData);
  };

  const campDate = new Date(camp.date);
  const timeSlots = camp.time ? [
    `${camp.time.start} - ${camp.time.end}`,
    'Morning (9:00 AM - 12:00 PM)',
    'Afternoon (1:00 PM - 4:00 PM)',
    'Evening (4:00 PM - 7:00 PM)'
  ] : ['Any Time'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <Heart className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Register for Blood Camp</h2>
              <p className="text-sm text-gray-600">Complete your donation registration</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Camp Information */}
        <div className="p-6 bg-red-50 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">{camp.title}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-red-500" />
              <span>{campDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-red-500" />
              <span>{camp.time?.start || 'TBD'} - {camp.time?.end || 'TBD'}</span>
            </div>
            <div className="flex items-start gap-2 md:col-span-2">
              <MapPin className="w-4 h-4 text-red-500 mt-0.5" />
              <span>
                {camp.location?.venue}, {camp.location?.city}, {camp.location?.state} - {camp.location?.pincode}
              </span>
            </div>
            <div className="flex items-center gap-2 md:col-span-2">
              <Droplet className="w-4 h-4 text-red-500" />
              <span>All blood types welcome • Expected capacity: {camp.expectedDonors} donors</span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <div className="p-6 space-y-6">
          {/* Preferred Time Slot */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Preferred Time Slot
            </label>
            <select
              value={formData.preferredTime}
              onChange={(e) => handleInputChange('preferredTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Select preferred time</option>
              {timeSlots.map((slot, index) => (
                <option key={index} value={slot}>{slot}</option>
              ))}
            </select>
          </div>

          {/* Emergency Contact */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact Name (Optional)
              </label>
              <input
                type="text"
                value={formData.emergencyContact}
                onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                placeholder="Contact person name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                value={formData.emergencyPhone}
                onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                placeholder="Emergency contact phone"
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.emergencyPhone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.emergencyPhone && (
                <p className="mt-1 text-sm text-red-600">{errors.emergencyPhone}</p>
              )}
            </div>
          </div>

          {/* Special Requests */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Requests or Medical Information (Optional)
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => handleInputChange('specialRequests', e.target.value)}
              placeholder="Any special accommodations or medical information the team should know..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Important Information */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="text-sm">
                <h4 className="font-medium text-blue-800 mb-2">Important Donation Guidelines:</h4>
                <ul className="text-blue-700 space-y-1">
                  <li>• You must be 18-65 years old and weigh at least 50kg</li>
                  <li>• Have a valid government-issued ID with you</li>
                  <li>• Avoid alcohol 24 hours before donation</li>
                  <li>• Eat a healthy meal and stay hydrated before donating</li>
                  <li>• Wait at least 3 months between whole blood donations</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Consent */}
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.consentGiven}
                onChange={(e) => handleInputChange('consentGiven', e.target.checked)}
                className="mt-1"
              />
              <span className="text-sm text-gray-700">
                I understand and agree to the donation process. I confirm that I am eligible to donate blood 
                and have provided accurate information. I consent to the medical screening and donation process.
              </span>
            </label>
            {errors.consentGiven && (
              <p className="text-sm text-red-600">{errors.consentGiven}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-700 hover:text-gray-900 transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !formData.consentGiven}
            className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Registering...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                Confirm Registration
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DonationRegistrationModal;