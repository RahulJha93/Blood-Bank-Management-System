import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CheckCircle, XCircle, Clock, MapPin, Calendar, RefreshCw } from "lucide-react";
import EnhancedRequestStatus from "../../components/EnhancedRequestStatus";

const HospitalRequestHistory = () => {
  const [requests, setRequests] = useState([]);
  const [hospital, setHospital] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        // Load both requests and hospital profile
        const [requestsRes, hospitalRes] = await Promise.all([
          axios.get("http://localhost:5000/api/hospital/blood/requests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/hospital/profile", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        setRequests(requestsRes.data.data || []);
        setHospital(hospitalRes.data.data || null);
      } catch (err) {
        console.error("Load data error:", err);
        toast.error("Failed to load request history");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const getStatusConfig = (status) => {
    const config = {
      pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock, label: "Pending" },
      accepted: { color: "bg-green-100 text-green-800", icon: CheckCircle, label: "Accepted" },
      rejected: { color: "bg-red-100 text-red-800", icon: XCircle, label: "Rejected" }
    };
    return config[status] || config.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <span className="ml-3 text-gray-600">Loading history...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-xl">
              <Calendar className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Request History</h1>
          </div>
          <p className="text-gray-600">Track your blood request status and history</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-l-green-400">
            <div className="text-2xl font-bold text-gray-800">{requests.length}</div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-l-yellow-400">
            <div className="text-2xl font-bold text-yellow-600">
              {requests.filter(r => r.status === "pending").length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-l-green-400">
            <div className="text-2xl font-bold text-green-600">
              {requests.filter(r => r.status === "accepted").length}
            </div>
            <div className="text-sm text-gray-600">Accepted</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-l-red-400">
            <div className="text-2xl font-bold text-red-600">
              {requests.filter(r => r.status === "rejected").length}
            </div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-6">
          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-12">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-800 mb-2">No request history</h3>
                <p className="text-gray-600 mb-6">Your blood requests will appear here once you make them.</p>
                <button
                  onClick={() => window.location.href = '/hospital/request-blood'}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Make Your First Request
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Enhanced Request Status Cards */}
              {requests.map((request) => (
                <EnhancedRequestStatus
                  key={request._id}
                  request={request}
                  hospitalPincode={hospital?.address?.pincode}
                />
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalRequestHistory;