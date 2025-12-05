import React, { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, AlertTriangle, Droplet, ExternalLink } from 'lucide-react';

const DonorOpportunityFeed = ({ donorPincode, donorBloodGroup }) => {
  const [urgentRequests, setUrgentRequests] = useState([]);
  const [nearbyCamps, setNearbyCamps] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (donorPincode) {
      fetchOpportunities();
    }
  }, [donorPincode, donorBloodGroup]);

  const fetchOpportunities = async () => {
    setLoading(true);
    try {
      // Fetch external urgent requirements
      const urgentResponse = await fetch(
        `http://localhost:5000/api/blood-banks/urgent-requirements?pincode=${donorPincode}`
      );
      const urgentData = await urgentResponse.json();
      
      if (urgentData.success) {
        // Filter for donor's blood group compatibility
        const compatibleRequests = urgentData.data.urgentRequests.filter(req => 
          isCompatibleDonor(donorBloodGroup, req.bloodGroup)
        );
        setUrgentRequests(compatibleRequests);
      }

      // Fetch nearby blood camps (could be enhanced with real camp data)
      const campsResponse = await fetch(
        `http://localhost:5000/api/blood-banks/search/pincode/${donorPincode}`
      );
      const campsData = await campsResponse.json();
      
      if (campsData.success) {
        setNearbyCamps(campsData.data.bloodBanks.slice(0, 3)); // Show top 3
      }

    } catch (error) {
      console.error('Error fetching opportunities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Blood type compatibility check
  const isCompatibleDonor = (donorType, requiredType) => {
    const compatibility = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'], // Universal donor
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+'] // Universal receiver, restrictive donor
    };
    return compatibility[donorType]?.includes(requiredType) || false;
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'Critical': return 'border-red-500 bg-red-50';
      case 'High': return 'border-orange-500 bg-orange-50';
      default: return 'border-yellow-500 bg-yellow-50';
    }
  };

  const handleContactHospital = (request) => {
    window.open(`tel:${request.contactNumber}`, '_self');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-16 bg-gray-200 rounded"></div>
            <div className="h-16 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Urgent Blood Requirements */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-800">Urgent Blood Needed Near You</h3>
          <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
            {urgentRequests.length} compatible
          </span>
        </div>

        {urgentRequests.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Droplet className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p>No urgent blood requirements matching your blood type ({donorBloodGroup}) in your area.</p>
            <p className="text-sm mt-1">Check back later or expand your search radius.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {urgentRequests.map((request, index) => (
              <div 
                key={index}
                className={`border-l-4 rounded-lg p-4 ${getUrgencyColor(request.urgency)}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl font-bold text-red-700">
                        {request.bloodGroup}
                      </span>
                      <span className="text-lg font-medium text-gray-700">
                        {request.unitsNeeded} units needed
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.urgency === 'Critical' 
                          ? 'bg-red-100 text-red-800'
                          : request.urgency === 'High'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.urgency}
                      </span>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {request.hospital} • {request.distance}
                      </p>
                      <p className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Posted {new Date(request.datePosted).toLocaleDateString()}
                      </p>
                      <p className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {request.contactNumber}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <button
                      onClick={() => handleContactHospital(request)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm font-medium"
                    >
                      Call Hospital
                    </button>
                    {isCompatibleDonor(donorBloodGroup, request.bloodGroup) && (
                      <p className="text-xs text-green-700 font-medium">
                        ✓ You can donate
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="bg-white/70 rounded p-2 text-sm">
                  <p className="text-gray-700">
                    <strong>Help save a life:</strong> This hospital urgently needs {request.bloodGroup} blood. 
                    Your donation of {donorBloodGroup} can help!
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nearby Blood Banks for Donation */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Nearby Donation Centers</h3>
        </div>

        {nearbyCamps.length === 0 ? (
          <p className="text-gray-500 text-center py-4">
            No nearby donation centers found
          </p>
        ) : (
          <div className="space-y-3">
            {nearbyCamps.map((bank, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{bank.name}</h4>
                    <div className="space-y-1 text-sm text-gray-600 mt-1">
                      <p className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {bank.address} • {bank.distance}
                      </p>
                      <p className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {bank.operatingHours}
                      </p>
                      <p className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {bank.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      bank.type === 'Government' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {bank.type}
                    </span>
                    <div className="mt-2 space-y-1">
                      <button
                        onClick={() => window.open(`tel:${bank.phone}`, '_self')}
                        className="block w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                      >
                        Call to Donate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="text-center pt-3">
              <a
                href={`/search-blood-banks?pincode=${donorPincode}`}
                className="text-blue-600 hover:text-blue-700 text-sm inline-flex items-center gap-1"
              >
                View all nearby centers <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorOpportunityFeed;