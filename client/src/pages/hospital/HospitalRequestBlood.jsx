import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Droplet, MapPin, Phone, Clock, Send, Search, Building, ExternalLink } from "lucide-react";

const HospitalRequestBlood = () => {
  const [labs, setLabs] = useState([]);
  const [externalBloodBanks, setExternalBloodBanks] = useState([]);
  const [activeTab, setActiveTab] = useState("internal"); // "internal" or "external"
  const [form, setForm] = useState({
    labId: "",
    bloodType: "",
    units: "",
    pincode: ""
  });
  const [loading, setLoading] = useState(false);
  const [labsLoading, setLabsLoading] = useState(true);
  const [externalLoading, setExternalLoading] = useState(false);

  const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

  useEffect(() => {
    const loadLabs = async () => {
      try {
        setLabsLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/facility/labs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLabs(res.data.labs || []);
        console.log("Labs loaded:", res.data.labs);
      } catch (err) {
        console.error("Load labs error:", err);
        toast.error("Failed to load blood labs");
      } finally {
        setLabsLoading(false);
      }
    };
    loadLabs();
  }, []);

  // NEW: Search external blood banks
  const searchExternalBloodBanks = async () => {
    if (!form.pincode || !form.bloodType) {
      toast.error("Please enter pincode and blood type to search external banks");
      return;
    }

    setExternalLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/blood-banks/search/blood-group?pincode=${form.pincode}&bloodGroup=${form.bloodType}`
      );
      const data = await response.json();
      
      if (data.success) {
        setExternalBloodBanks(data.data.availableBanks || []);
        setActiveTab("external");
        toast.success(`Found ${data.data.availableBanks?.length || 0} external blood banks with ${form.bloodType}`);
      } else {
        toast.error(data.message || 'No external blood banks found');
        setExternalBloodBanks([]);
      }
    } catch (error) {
      toast.error('Error searching external blood banks');
      console.error(error);
      setExternalBloodBanks([]);
    } finally {
      setExternalLoading(false);
    }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (activeTab === "internal") {
        // Internal lab request (existing logic)
        const response = await axios.post(
          "http://localhost:5000/api/hospital/blood/request",
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Blood request sent to internal lab successfully!");
      } else {
        // External blood bank - create urgent request in the system
        const response = await axios.post(
          "http://localhost:5000/api/hospital/external-blood-request",
          {
            bloodType: form.bloodType,
            units: form.units,
            pincode: form.pincode,
            externalBanks: externalBloodBanks
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("External blood bank request created! You'll need to contact the banks directly.");
      }

      setForm({ labId: "", bloodType: "", units: "", pincode: "" });
      console.log("Request sent successfully");
    } catch (err) {
      console.error("Submit request error:", err);
      toast.error(err.response?.data?.message || "Failed to send request");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-xl">
              <Droplet className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Request Blood</h1>
          </div>
          <p className="text-gray-600">Request blood from internal labs or search external blood banks</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("internal")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "internal"
                  ? "border-b-2 border-red-600 text-red-600 bg-red-50"
                  : "text-gray-600 hover:text-red-600"
              }`}
            >
              <Building className="w-5 h-5 inline mr-2" />
              Internal Blood Labs
            </button>
            <button
              onClick={() => setActiveTab("external")}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === "external"
                  ? "border-b-2 border-red-600 text-red-600 bg-red-50"
                  : "text-gray-600 hover:text-red-600"
              }`}
            >
              <ExternalLink className="w-5 h-5 inline mr-2" />
              External Blood Banks
            </button>
          </div>
        </div>

        {/* Request Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8">
          <form onSubmit={submitRequest} className="space-y-6">
            
            {/* Common Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Blood Type */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Droplet size={16} className="text-red-600" />
                  Blood Type
                </label>
                <select
                  value={form.bloodType}
                  onChange={(e) => setForm({ ...form, bloodType: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  required
                >
                  <option value="">-- Select Blood Type --</option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Units */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Units Needed
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                  value={form.units}
                  min="1"
                  max="100"
                  onChange={(e) => setForm({ ...form, units: e.target.value })}
                  placeholder="Enter number of units"
                  required
                />
              </div>
            </div>

            {/* Conditional Fields Based on Tab */}
            {activeTab === "internal" ? (
              /* Internal Lab Selection */
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-red-600" />
                  Select Internal Blood Lab
                </label>
                {labsLoading ? (
                  <div className="flex items-center gap-2 text-gray-500">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                    Loading labs...
                  </div>
                ) : (
                  <select
                    value={form.labId}
                    onChange={(e) => setForm({ ...form, labId: e.target.value })}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                    required={activeTab === "internal"}
                    disabled={labs.length === 0}
                  >
                    <option value="">-- Select Blood Lab --</option>
                    {labs.map((lab) => (
                      <option key={lab._id} value={lab._id}>
                        {lab.name} — {lab.address?.city}
                        {lab.operatingHours && ` (${lab.operatingHours.open} - ${lab.operatingHours.close})`}
                      </option>
                    ))}
                  </select>
                )}
                {labs.length === 0 && !labsLoading && (
                  <p className="text-sm text-red-600 mt-1">No approved blood labs available</p>
                )}
              </div>
            ) : (
              /* External Search Fields */
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin size={16} className="text-red-600" />
                    Your Hospital Pincode
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
                      value={form.pincode}
                      onChange={(e) => setForm({ ...form, pincode: e.target.value })}
                      placeholder="Enter 6-digit pincode"
                      maxLength="6"
                      pattern="[0-9]{6}"
                      required={activeTab === "external"}
                    />
                    <button
                      type="button"
                      onClick={searchExternalBloodBanks}
                      disabled={!form.pincode || !form.bloodType || externalLoading}
                      className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {externalLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Search size={18} />
                      )}
                      Search
                    </button>
                  </div>
                </div>

                {/* External Search Results */}
                {externalBloodBanks.length > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <h4 className="font-medium text-blue-900 mb-3">
                      Found {externalBloodBanks.length} blood banks with {form.bloodType}:
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {externalBloodBanks.map((bank, index) => (
                        <div key={index} className="bg-white rounded-lg p-3 text-sm">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-gray-900">{bank.name}</p>
                              <p className="text-gray-600">{bank.distance} • {bank.operatingHours}</p>
                              <p className="text-green-700 font-medium">
                                {bank.availableUnits} units available
                              </p>
                            </div>
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {bank.type}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-blue-700 mt-2">
                      ℹ️ You'll need to contact these banks directly after submitting the request
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (activeTab === "internal" && labs.length === 0) || (activeTab === "external" && externalBloodBanks.length === 0)}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Sending Request...
                </>
              ) : (
                <>
                  <Send size={18} />
                  {activeTab === "internal" ? "Send Request to Lab" : "Create External Request"}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Available Labs Info */}
        {labs.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-lg border border-red-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <MapPin size={20} className="text-red-600" />
              Available Blood Labs ({labs.length})
            </h3>
            <div className="grid gap-3">
              {labs.map((lab) => (
                <div key={lab._id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium text-gray-800">{lab.name}</div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <MapPin size={12} />
                      {lab.address?.street}, {lab.address?.city}, {lab.address?.state} - {lab.address?.pincode}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Clock size={12} />
                      {lab.operatingHours?.open} - {lab.operatingHours?.close}
                    </div>
                    <div className="text-sm text-gray-600 flex items-center gap-1">
                      <Phone size={12} />
                      {lab.phone}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalRequestBlood;