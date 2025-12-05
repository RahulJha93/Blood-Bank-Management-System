import React, { useState, } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  MapPin, 
  Phone, 
  ExternalLink,
  Search,
  Filter,
  Calendar
} from 'lucide-react';
import axios from 'axios';

const EnhancedRequestStatus = ({ request, hospitalPincode }) => {
  const [externalOptions, setExternalOptions] = useState([]);
  const [showExternalOptions, setShowExternalOptions] = useState(false);
  const [loading, setLoading] = useState(false);

  // Get status configuration
  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'text-yellow-600 bg-yellow-50', icon: Clock, text: 'Pending Review' },
      approved: { color: 'text-green-600 bg-green-50', icon: CheckCircle, text: 'Approved' },
      rejected: { color: 'text-red-600 bg-red-50', icon: XCircle, text: 'Rejected' },
      fulfilled: { color: 'text-blue-600 bg-blue-50', icon: CheckCircle, text: 'Fulfilled' }
    };
    return configs[status] || configs.pending;
  };

  // Fetch external blood bank options
  const fetchExternalOptions = async () => {
    if (!hospitalPincode || !request.bloodGroup) return;
    
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/api/blood-banks/search/blood-group`,
        {
          params: { 
            pincode: hospitalPincode,
            bloodGroup: request.bloodGroup 
          }
        }
      );
      
      if (response.data.success) {
        const availableOptions = (response.data.data.availableBanks || [])
          .filter(bank => bank.availableUnits > 0)
          .slice(0, 3) // Show top 3 options
          .map(bank => ({
            facilityName: bank.name,
            quantity: bank.availableUnits,
            address: bank.address,
            contactNumber: bank.phone,
            bloodGroup: request.bloodGroup
          }));
        
        setExternalOptions(availableOptions);
      } else {
        setExternalOptions([]);
      }
    } catch (error) {
      console.error('Failed to fetch external options:', error);
      setExternalOptions([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle showing external options
  const handleShowExternalOptions = () => {
    if (!showExternalOptions && externalOptions.length === 0) {
      fetchExternalOptions();
    }
    setShowExternalOptions(!showExternalOptions);
  };

  const statusConfig = getStatusConfig(request.status);
  const StatusIcon = statusConfig.icon;
  
  const isRequestUnfulfilled = ['rejected', 'pending'].includes(request.status);
  const isUrgent = request.urgency === 'urgent' || request.priority === 'high';

  return (
    <div className="bg-white border rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold text-red-600">
                {request.bloodGroup}
              </span>
              <span className="text-lg text-gray-800 font-medium">
                {request.quantity} units
              </span>
              {isUrgent && (
                <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                  URGENT
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(request.requestDate || request.createdAt).toLocaleDateString()}
              </span>
              {request.facilityName && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {request.facilityName}
                </span>
              )}
            </div>
          </div>
          
          <div className={`px-3 py-2 rounded-full flex items-center gap-2 ${statusConfig.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-medium">{statusConfig.text}</span>
          </div>
        </div>

        {/* Request Details */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {request.purpose && (
              <div>
                <span className="font-medium text-gray-700">Purpose:</span>
                <span className="ml-2 text-gray-600">{request.purpose}</span>
              </div>
            )}
            {request.patientAge && (
              <div>
                <span className="font-medium text-gray-700">Patient Age:</span>
                <span className="ml-2 text-gray-600">{request.patientAge} years</span>
              </div>
            )}
            {request.notes && (
              <div className="col-span-full">
                <span className="font-medium text-gray-700">Notes:</span>
                <span className="ml-2 text-gray-600">{request.notes}</span>
              </div>
            )}
          </div>
        </div>

        {/* External Options Section */}
        {isRequestUnfulfilled && hospitalPincode && (
          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-sm font-medium text-gray-800">Alternative Sources</h4>
              <button
                onClick={handleShowExternalOptions}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                disabled={loading}
              >
                <Search className="w-4 h-4" />
                {showExternalOptions ? 'Hide Options' : 'Find External Sources'}
              </button>
            </div>

            {showExternalOptions && (
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Searching nearby blood banks...</p>
                  </div>
                ) : externalOptions.length > 0 ? (
                  externalOptions.map((option, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-green-800">{option.facilityName}</span>
                            <span className="text-sm text-green-600">
                              {option.quantity} units available
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 text-xs text-gray-600">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {option.address}
                            </span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {option.contactNumber}
                            </span>
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => window.open(`tel:${option.contactNumber}`, '_self')}
                          className="ml-3 p-1 text-green-600 hover:text-green-700"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <AlertTriangle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">
                      No external sources found for {request.bloodGroup} near your location
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Success Message for Approved Requests */}
        {request.status === 'approved' && (
          <div className="border-t border-gray-200 pt-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-green-800">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Request approved! Contact the blood lab for pickup instructions.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Rejection with External Alternatives */}
        {request.status === 'rejected' && hospitalPincode && (
          <div className="border-t border-gray-200 pt-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2 text-yellow-800 mb-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Internal request was rejected. Consider external alternatives above.
                </span>
              </div>
              {request.rejectionReason && (
                <p className="text-xs text-gray-600">
                  Reason: {request.rejectionReason}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedRequestStatus;