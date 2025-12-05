import axios from 'axios';

// Real eRaktkosh API endpoints (Government of India)
const ERAKTKOSH_BASE_URL = 'https://www.eraktkosh.in/BLDAHIMS';
const PINCODE_API_URL = 'https://api.postalpincode.in';

// Search nearby blood banks by pincode
export const searchBloodBanksByPincode = async (req, res) => {
  try {
    const { pincode } = req.params;
    
    // Validate pincode format
    if (!/^[1-9][0-9]{5}$/.test(pincode)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid pincode format' 
      });
    }

    // Get location details from pincode
    const pincodeResponse = await axios.get(`${PINCODE_API_URL}/pincode/${pincode}`);
    
    if (pincodeResponse.data[0].Status === 'Error') {
      return res.status(404).json({
        success: false,
        message: 'Invalid pincode'
      });
    }

    const locationData = pincodeResponse.data[0].PostOffice[0];
    const { District, State } = locationData;

    // Mock blood bank data based on real Indian blood banks structure
    // In production, this would be replaced with actual eRaktkosh API calls
    const mockBloodBanks = await getMockBloodBanksForLocation(District, State, pincode);

    res.json({
      success: true,
      data: {
        location: {
          pincode,
          district: District,
          state: State,
        },
        bloodBanks: mockBloodBanks,
        total: mockBloodBanks.length
      }
    });

  } catch (error) {
    console.error('Error searching blood banks:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching blood banks',
      error: error.message
    });
  }
};

// Get blood availability by location and blood group
export const getBloodAvailability = async (req, res) => {
  try {
    const { pincode, bloodGroup } = req.query;

    if (!pincode || !bloodGroup) {
      return res.status(400).json({
        success: false,
        message: 'Pincode and blood group are required'
      });
    }

    // Get location details
    const pincodeResponse = await axios.get(`${PINCODE_API_URL}/pincode/${pincode}`);
    const locationData = pincodeResponse.data[0].PostOffice[0];

    // Mock availability data (replace with real API calls)
    const availability = await getBloodAvailabilityData(locationData.District, bloodGroup);

    res.json({
      success: true,
      data: availability
    });

  } catch (error) {
    console.error('Error getting blood availability:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting blood availability',
      error: error.message
    });
  }
};

// Get urgent blood requirements
export const getUrgentRequirements = async (req, res) => {
  try {
    const { pincode, radius = 50 } = req.query;

    // Get location details
    const pincodeResponse = await axios.get(`${PINCODE_API_URL}/pincode/${pincode}`);
    const locationData = pincodeResponse.data[0].PostOffice[0];

    // Mock urgent requirements (replace with real data)
    const urgentRequirements = await getUrgentRequirementsData(locationData.District, radius);

    res.json({
      success: true,
      data: urgentRequirements
    });

  } catch (error) {
    console.error('Error getting urgent requirements:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting urgent requirements',
      error: error.message
    });
  }
};

// Helper functions for mock data (replace with actual API calls)
const getMockBloodBanksForLocation = async (district, state, pincode) => {
  // This represents real blood bank data structure from eRaktkosh
  const bloodBanks = [
    {
      id: 'BB001',
      name: `${district} Government Hospital Blood Bank`,
      address: `Main Hospital Road, ${district}, ${state}`,
      pincode: pincode,
      phone: '+91-11-23061469',
      type: 'Government',
      services: ['Whole Blood', 'Platelets', 'Plasma', 'RBC'],
      operatingHours: '24x7',
      distance: '2.3 km',
      coordinates: { lat: 28.6139, lng: 77.2090 },
      bloodAvailability: {
        'A+': 15, 'A-': 3, 'B+': 12, 'B-': 2,
        'AB+': 5, 'AB-': 1, 'O+': 20, 'O-': 4
      },
      lastUpdated: new Date()
    },
    {
      id: 'BB002',
      name: `${district} Red Cross Society`,
      address: `Red Cross Building, ${district}, ${state}`,
      pincode: pincode,
      phone: '+91-11-23061470',
      type: 'NGO',
      services: ['Whole Blood', 'Emergency Supply'],
      operatingHours: '9 AM - 6 PM',
      distance: '5.7 km',
      coordinates: { lat: 28.6129, lng: 77.2080 },
      bloodAvailability: {
        'A+': 8, 'A-': 2, 'B+': 10, 'B-': 1,
        'AB+': 3, 'AB-': 0, 'O+': 15, 'O-': 2
      },
      lastUpdated: new Date()
    },
    {
      id: 'BB003',
      name: `${state} State Blood Transfusion Centre`,
      address: `Medical College Road, ${district}, ${state}`,
      pincode: pincode,
      phone: '+91-11-23061471',
      type: 'Government',
      services: ['All Blood Components', 'Testing', 'Storage'],
      operatingHours: '24x7',
      distance: '8.1 km',
      coordinates: { lat: 28.6149, lng: 77.2100 },
      bloodAvailability: {
        'A+': 25, 'A-': 8, 'B+': 22, 'B-': 5,
        'AB+': 12, 'AB-': 3, 'O+': 35, 'O-': 7
      },
      lastUpdated: new Date()
    }
  ];

  return bloodBanks;
};

const getBloodAvailabilityData = async (district, bloodGroup) => {
  return {
    bloodGroup,
    location: district,
    totalUnitsAvailable: Math.floor(Math.random() * 50) + 10,
    nearbyBanks: Math.floor(Math.random() * 10) + 3,
    urgentRequests: Math.floor(Math.random() * 5),
    lastUpdated: new Date(),
    availability: [
      {
        bankName: `${district} Government Hospital`,
        units: Math.floor(Math.random() * 20) + 5,
        distance: '2.3 km',
        status: 'Available'
      },
      {
        bankName: `${district} Red Cross`,
        units: Math.floor(Math.random() * 15) + 2,
        distance: '5.7 km',
        status: 'Limited'
      }
    ]
  };
};

const getUrgentRequirementsData = async (district, radius) => {
  return {
    location: district,
    radius: `${radius} km`,
    urgentRequests: [
      {
        id: 'UR001',
        patientName: 'Emergency Patient',
        bloodGroup: 'O-',
        unitsNeeded: 3,
        hospital: `${district} Emergency Hospital`,
        urgency: 'Critical',
        contactNumber: '+91-11-23061469',
        datePosted: new Date(),
        distance: '3.2 km'
      },
      {
        id: 'UR002',
        patientName: 'Surgery Patient',
        bloodGroup: 'A+',
        unitsNeeded: 2,
        hospital: `${district} Medical Centre`,
        urgency: 'High',
        contactNumber: '+91-11-23061470',
        datePosted: new Date(),
        distance: '7.8 km'
      }
    ],
    totalRequests: 2
  };
};

// Search blood banks by blood group requirement
export const searchByBloodGroup = async (req, res) => {
  try {
    const { bloodGroup, pincode, radius = 25 } = req.query;

    if (!bloodGroup || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Blood group and pincode are required'
      });
    }

    // Get location details
    const pincodeResponse = await axios.get(`${PINCODE_API_URL}/pincode/${pincode}`);
    const locationData = pincodeResponse.data[0].PostOffice[0];

    // Get blood banks with specific blood group availability
    const bloodBanks = await getMockBloodBanksForLocation(locationData.District, locationData.State, pincode);
    
    // Filter banks that have the required blood group
    const availableBanks = bloodBanks.filter(bank => 
      bank.bloodAvailability[bloodGroup] > 0
    ).map(bank => ({
      ...bank,
      availableUnits: bank.bloodAvailability[bloodGroup]
    }));

    res.json({
      success: true,
      data: {
        bloodGroup,
        location: {
          pincode,
          district: locationData.District,
          state: locationData.State
        },
        availableBanks,
        totalBanks: availableBanks.length,
        totalUnits: availableBanks.reduce((sum, bank) => sum + bank.availableUnits, 0)
      }
    });

  } catch (error) {
    console.error('Error searching by blood group:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching by blood group',
      error: error.message
    });
  }
};