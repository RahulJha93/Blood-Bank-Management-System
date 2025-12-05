import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const BloodBankSearch = () => {
  const [searchType, setSearchType] = useState('pincode');
  const [pincode, setPincode] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [bloodGroups, setBloodGroups] = useState([]);
  const [urgentRequirements, setUrgentRequirements] = useState([]);

  useEffect(() => {
    fetchBloodGroups();
  }, []);

  const fetchBloodGroups = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/blood-banks/blood-groups');
      const data = await response.json();
      if (data.success) {
        setBloodGroups(data.data.bloodGroups);
      }
    } catch (error) {
      console.error('Error fetching blood groups:', error);
    }
  };

  const searchByPincode = async () => {
    if (!pincode || !/^[1-9][0-9]{5}$/.test(pincode)) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/api/blood-banks/search/pincode/${pincode}`);
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data);
        toast.success(`Found ${data.data.bloodBanks.length} blood banks in your area`);
        
        // Also fetch urgent requirements for this area
        fetchUrgentRequirements(pincode);
      } else {
        toast.error(data.message || 'No blood banks found');
      }
    } catch (error) {
      toast.error('Error searching blood banks');
      console.error(error);
    }
    setLoading(false);
  };

  const searchByBloodGroup = async () => {
    if (!pincode || !bloodGroup) {
      toast.error('Please enter both pincode and blood group');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/blood-banks/search/blood-group?pincode=${pincode}&bloodGroup=${bloodGroup}`
      );
      const data = await response.json();
      
      if (data.success) {
        setSearchResults(data.data);
        toast.success(`Found ${data.data.totalUnits} units of ${bloodGroup} blood available`);
      } else {
        toast.error(data.message || 'No blood available');
      }
    } catch (error) {
      toast.error('Error searching blood availability');
      console.error(error);
    }
    setLoading(false);
  };

  const fetchUrgentRequirements = async (pincode) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/blood-banks/urgent-requirements?pincode=${pincode}`
      );
      const data = await response.json();
      
      if (data.success) {
        setUrgentRequirements(data.data.urgentRequests || []);
      }
    } catch (error) {
      console.error('Error fetching urgent requirements:', error);
    }
  };

  const handleSearch = () => {
    if (searchType === 'pincode') {
      searchByPincode();
    } else {
      searchByBloodGroup();
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Search Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Blood Banks Near You</h1>
        <p className="text-gray-600">Search for blood banks and availability across India using real data</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="pincode"
                checked={searchType === 'pincode'}
                onChange={(e) => setSearchType(e.target.value)}
                className="mr-2"
              />
              Search by Area
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="bloodgroup"
                checked={searchType === 'bloodgroup'}
                onChange={(e) => setSearchType(e.target.value)}
                className="mr-2"
              />
              Search by Blood Type
            </label>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode *
            </label>
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Enter 6-digit pincode (e.g., 110001)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              maxLength="6"
            />
          </div>

          {searchType === 'bloodgroup' && (
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group *
              </label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map((bg) => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          )}

          <div className="flex-none">
            <label className="block text-sm font-medium text-gray-700 mb-1">&nbsp;</label>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full md:w-auto px-6 py-2 bg-primary-red text-white rounded-lg hover:bg-primary-red-dark disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Blood Banks List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {searchType === 'pincode' ? 'Nearby Blood Banks' : `Blood Banks with ${searchResults.bloodGroup}`}
              </h2>
              
              {searchResults.location && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Location:</span> {searchResults.location.district}, {searchResults.location.state}
                  </p>
                  {searchResults.totalUnits && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Total Units Available:</span> {searchResults.totalUnits}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-4">
                {(searchResults.bloodBanks || searchResults.availableBanks || []).map((bank) => (
                  <div key={bank.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{bank.name}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bank.type === 'Government' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {bank.type}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{bank.address}</p>
                    <p className="text-sm text-gray-600 mb-2">📞 {bank.phone}</p>
                    <p className="text-sm text-gray-600 mb-2">🕒 {bank.operatingHours}</p>
                    <p className="text-sm text-gray-600 mb-2">📍 {bank.distance}</p>
                    
                    {bank.availableUnits && (
                      <div className="mt-2 p-2 bg-green-50 rounded">
                        <p className="text-sm font-medium text-green-800">
                          Available: {bank.availableUnits} units of {searchResults.bloodGroup}
                        </p>
                      </div>
                    )}

                    {bank.bloodAvailability && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 mb-1">Blood Availability:</p>
                        <div className="grid grid-cols-4 gap-2 text-xs">
                          {Object.entries(bank.bloodAvailability).map(([bg, count]) => (
                            <div key={bg} className={`text-center p-1 rounded ${
                              count > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {bg}: {count}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-1">
                      {bank.services?.map((service) => (
                        <span key={service} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Urgent Requirements Sidebar */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">🚨 Urgent Requirements</h3>
              
              {urgentRequirements.length > 0 ? (
                <div className="space-y-3">
                  {urgentRequirements.map((req) => (
                    <div key={req.id} className="border border-red-200 rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-gray-900">{req.bloodGroup}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(req.urgency)}`}>
                          {req.urgency}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Units needed: {req.unitsNeeded}</p>
                      <p className="text-sm text-gray-600 mb-1">Hospital: {req.hospital}</p>
                      <p className="text-sm text-gray-600 mb-1">Distance: {req.distance}</p>
                      <p className="text-sm text-primary-red font-medium">📞 {req.contactNumber}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No urgent requirements in your area</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBankSearch;