import React, { useState, useEffect } from 'react';
import { Droplet, MapPin, Building, ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react';
import axios from 'axios';

const UnifiedBloodAvailability = ({ internalStock, labPincode }) => {
  const [externalAvailability, setExternalAvailability] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('internal');

  // Blood group list for comprehensive checking
  const allBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Fetch external blood availability
  const fetchExternalAvailability = async () => {
    if (!labPincode) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/blood-bank-api/blood-availability/${labPincode}`
      );
      setExternalAvailability(response.data.availability || []);
    } catch (error) {
      console.error('Failed to fetch external availability:', error);
      setExternalAvailability([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'external') {
      fetchExternalAvailability();
    }
  }, [activeTab, labPincode]);

  // Create internal stock summary
  const internalStockSummary = allBloodGroups.map(bloodType => {
    const stockItem = internalStock?.find(item => 
      item.bloodGroup === bloodType || item.bloodType === bloodType
    );
    return {
      bloodGroup: bloodType,
      quantity: stockItem?.quantity || 0,
      source: 'internal'
    };
  });

  // Blood type color mapping
  const getBloodTypeColor = (bloodType) => {
    const colors = {
      'A+': 'bg-red-100 text-red-700',
      'A-': 'bg-red-200 text-red-800',
      'B+': 'bg-blue-100 text-blue-700',
      'B-': 'bg-blue-200 text-blue-800',
      'AB+': 'bg-purple-100 text-purple-700',
      'AB-': 'bg-purple-200 text-purple-800',
      'O+': 'bg-green-100 text-green-700',
      'O-': 'bg-green-200 text-green-800'
    };
    return colors[bloodType] || 'bg-gray-100 text-gray-700';
  };

  // Availability status
  const getAvailabilityStatus = (quantity) => {
    if (quantity === 0) return { status: 'unavailable', color: 'text-red-600', icon: '●' };
    if (quantity < 10) return { status: 'critical', color: 'text-orange-600', icon: '⚠' };
    if (quantity < 50) return { status: 'low', color: 'text-yellow-600', icon: '▼' };
    return { status: 'good', color: 'text-green-600', icon: '●' };
  };

  const BloodAvailabilityCard = ({ item, isExternal = false }) => {
    const status = getAvailabilityStatus(item.quantity);
    return (
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getBloodTypeColor(item.bloodGroup)}`}>
            {item.bloodGroup}
          </div>
          {isExternal && item.facilityName && (
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Building className="w-3 h-3" />
              <span className="truncate max-w-32">{item.facilityName}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <span className={`text-sm ${status.color}`}>
            {status.icon}
          </span>
          <span className="font-medium text-gray-800">
            {item.quantity > 0 ? `${item.quantity} units` : 'Not Available'}
          </span>
          {isExternal && item.contactNumber && (
            <button className="p-1 text-gray-400 hover:text-gray-600">
              <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-6">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Droplet className="w-5 h-5 text-blue-600" />
          Blood Availability Overview
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Internal stock and external blood bank availability
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('internal')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'internal'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Internal Stock ({internalStock?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('external')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'external'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          External Sources
          {!labPincode && <span className="text-red-500 ml-1">*</span>}
        </button>
        <button
          onClick={() => setActiveTab('combined')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'combined'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          }`}
        >
          Combined View
        </button>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {activeTab === 'internal' && (
          <>
            {internalStockSummary.map((item) => (
              <BloodAvailabilityCard key={`internal-${item.bloodGroup}`} item={item} />
            ))}
            {internalStockSummary.every(item => item.quantity === 0) && (
              <div className="text-center py-8">
                <Droplet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">No internal blood stock available</p>
                <p className="text-sm text-gray-500">Organize blood donation camps to build inventory</p>
              </div>
            )}
          </>
        )}

        {activeTab === 'external' && (
          <>
            {!labPincode ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Pincode not available</p>
                <p className="text-sm text-gray-500">Update your lab profile to see external blood bank availability</p>
              </div>
            ) : loading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 text-blue-500 mx-auto mb-3 animate-spin" />
                <p className="text-gray-600">Loading external availability...</p>
              </div>
            ) : externalAvailability.length > 0 ? (
              externalAvailability.map((item, index) => (
                <BloodAvailabilityCard 
                  key={`external-${index}`} 
                  item={item} 
                  isExternal={true} 
                />
              ))
            ) : (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">No external data available</p>
                <p className="text-sm text-gray-500">External blood banks near {labPincode} not found</p>
                <button 
                  onClick={fetchExternalAvailability}
                  className="mt-3 px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Retry
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'combined' && (
          <>
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Internal Stock</h4>
              <div className="space-y-2">
                {internalStockSummary.slice(0, 3).map((item) => (
                  <BloodAvailabilityCard key={`combined-internal-${item.bloodGroup}`} item={item} />
                ))}
              </div>
            </div>
            
            {labPincode && externalAvailability.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">External Sources</h4>
                <div className="space-y-2">
                  {externalAvailability.slice(0, 3).map((item, index) => (
                    <BloodAvailabilityCard 
                      key={`combined-external-${index}`} 
                      item={item} 
                      isExternal={true} 
                    />
                  ))}
                </div>
              </div>
            )}
            
            <div className="pt-3 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                Switch to individual tabs for complete availability details
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default UnifiedBloodAvailability;