import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Droplet, ExternalLink } from 'lucide-react';

const NearbyBloodBanks = ({ pincode, bloodType = null }) => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pincode) {
      fetchNearbyBloodBanks();
    }
  }, [pincode, bloodType]);

  const fetchNearbyBloodBanks = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const endpoint = bloodType 
        ? `/api/blood-banks/search/blood-group?pincode=${pincode}&bloodGroup=${bloodType}`
        : `/api/blood-banks/search/pincode/${pincode}`;
      
      const response = await fetch(`http://localhost:5000${endpoint}`);
      const data = await response.json();
      
      if (data.success) {
        setBloodBanks(data.data.bloodBanks || data.data.availableBanks || []);
      } else {
        setError(data.message || 'No blood banks found');
      }
    } catch (err) {
      setError('Error fetching blood banks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="text-center py-4">
          <p className="text-red-600 mb-2">{error}</p>
          <button
            onClick={fetchNearbyBloodBanks}
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-red-600" />
          Nearby Blood Banks
          {bloodType && (
            <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
              {bloodType}
            </span>
          )}
        </h3>
        <span className="text-sm text-gray-500">
          {bloodBanks.length} found
        </span>
      </div>

      {bloodBanks.length === 0 ? (
        <div className="text-center py-4 text-gray-500">
          No blood banks found in your area
        </div>
      ) : (
        <div className="space-y-3">
          {bloodBanks.slice(0, 5).map((bank) => (
            <div key={bank.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-gray-900">{bank.name}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  bank.type === 'Government' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {bank.type}
                </span>
              </div>
              
              <div className="space-y-1 text-sm text-gray-600 mb-3">
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {bank.address} • {bank.distance}
                </p>
                <p className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {bank.phone}
                </p>
                <p className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {bank.operatingHours}
                </p>
              </div>

              {bank.availableUnits && (
                <div className="mb-3 p-2 bg-green-50 rounded text-sm">
                  <span className="font-medium text-green-800">
                    {bank.availableUnits} units of {bloodType} available
                  </span>
                </div>
              )}

              {bank.bloodAvailability && (
                <div className="mb-3">
                  <p className="text-xs text-gray-600 mb-1">Blood Availability:</p>
                  <div className="grid grid-cols-4 gap-1 text-xs">
                    {Object.entries(bank.bloodAvailability).map(([bg, count]) => (
                      <div
                        key={bg}
                        className={`text-center p-1 rounded ${
                          count > 0 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {bg}: {count}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <a
                  href={`tel:${bank.phone}`}
                  className="flex-1 bg-blue-600 text-white text-sm px-3 py-2 rounded-lg text-center hover:bg-blue-700"
                >
                  Call Now
                </a>
                <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 px-3 py-2 border border-blue-200 rounded-lg">
                  <ExternalLink className="w-3 h-3" />
                  Details
                </button>
              </div>
            </div>
          ))}
          
          {bloodBanks.length > 5 && (
            <div className="text-center pt-3">
              <a
                href={`/search-blood-banks?pincode=${pincode}&bloodGroup=${bloodType || ''}`}
                className="text-blue-600 hover:text-blue-700 text-sm"
              >
                View all {bloodBanks.length} blood banks →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyBloodBanks;