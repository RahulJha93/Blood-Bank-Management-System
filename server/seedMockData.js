import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import connectDB from './config/db.js';
import Facility from './models/facilityModel.js';
import Donor from './models/donorModel.js';
import BloodCamp from './models/bloodCampModel.js';
import Blood from './models/bloodModel.js';
import BloodRequest from './models/bloodRequestModel.js';
import Admin from './models/adminModel.js';

// Sample data generators
const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB+"];
const campStatuses = ["Upcoming", "Ongoing", "Completed", "Cancelled"];
const facilityTypes = ["hospital", "blood-lab"];
const facilityCategories = ["Government", "Private", "Trust", "Charity"];

// Indian cities with pincodes
const indianLocations = [
  { city: "Mumbai", state: "Maharashtra", pincode: "400001" },
  { city: "Delhi", state: "Delhi", pincode: "110001" },
  { city: "Bangalore", state: "Karnataka", pincode: "560001" },
  { city: "Hyderabad", state: "Telangana", pincode: "500001" },
  { city: "Ahmedabad", state: "Gujarat", pincode: "380001" },
  { city: "Chennai", state: "Tamil Nadu", pincode: "600001" },
  { city: "Kolkata", state: "West Bengal", pincode: "700001" },
  { city: "Surat", state: "Gujarat", pincode: "395001" },
  { city: "Pune", state: "Maharashtra", pincode: "411001" },
  { city: "Jaipur", state: "Rajasthan", pincode: "302001" },
  { city: "Lucknow", state: "Uttar Pradesh", pincode: "226001" },
  { city: "Kanpur", state: "Uttar Pradesh", pincode: "208001" },
  { city: "Nagpur", state: "Maharashtra", pincode: "440001" },
  { city: "Indore", state: "Madhya Pradesh", pincode: "452001" },
  { city: "Thane", state: "Maharashtra", pincode: "400601" },
];

const getRandomLocation = () => indianLocations[Math.floor(Math.random() * indianLocations.length)];
const getRandomBloodGroup = () => bloodGroups[Math.floor(Math.random() * bloodGroups.length)];
const getRandomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const getRandomPhone = () => `${Math.floor(Math.random() * 3) + 7}${Math.floor(Math.random() * 900000000) + 100000000}`;

// Generate mock facilities (hospitals and blood labs)
const generateMockFacilities = () => {
  const facilities = [];
  
  // Generate 10 hospitals
  for (let i = 1; i <= 10; i++) {
    const location = getRandomLocation();
    const facilityType = "hospital";
    
    facilities.push({
      name: `${location.city} ${["General", "Medical", "Multi-Specialty", "Emergency", "Super Specialty"][Math.floor(Math.random() * 5)]} Hospital`,
      email: `hospital${i}@${location.city.toLowerCase()}.com`,
      password: "password123",
      phone: getRandomPhone(),
      emergencyContact: getRandomPhone(),
      address: {
        street: `${Math.floor(Math.random() * 999) + 1} Medical Road`,
        city: location.city,
        state: location.state,
        pincode: location.pincode
      },
      registrationNumber: `HSP${location.state.substring(0, 2).toUpperCase()}${String(i).padStart(4, '0')}`,
      facilityType,
      role: facilityType,
      facilityCategory: facilityCategories[Math.floor(Math.random() * facilityCategories.length)],
      documents: {
        registrationProof: {
          url: `https://example.com/docs/hospital${i}.pdf`,
          filename: `hospital_${i}_registration.pdf`,
          uploadedAt: new Date()
        }
      },
      status: Math.random() > 0.2 ? "approved" : "pending", // 80% approved
      operatingHours: {
        open: "08:00",
        close: "20:00",
        workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      },
      is24x7: Math.random() > 0.7, // 30% are 24x7
      emergencyServices: true,
      isActive: true,
      lastLogin: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
    });
  }

  // Generate 8 blood labs
  for (let i = 1; i <= 8; i++) {
    const location = getRandomLocation();
    const facilityType = "blood-lab";
    
    facilities.push({
      name: `${location.city} ${["Regional", "Central", "Government", "Red Cross", "Community"][Math.floor(Math.random() * 5)]} Blood Bank`,
      email: `bloodlab${i}@${location.city.toLowerCase()}.com`,
      password: "password123",
      phone: getRandomPhone(),
      emergencyContact: getRandomPhone(),
      address: {
        street: `${Math.floor(Math.random() * 999) + 1} Blood Bank Road`,
        city: location.city,
        state: location.state,
        pincode: location.pincode
      },
      registrationNumber: `BBL${location.state.substring(0, 2).toUpperCase()}${String(i).padStart(4, '0')}`,
      facilityType,
      role: facilityType,
      facilityCategory: facilityCategories[Math.floor(Math.random() * facilityCategories.length)],
      documents: {
        registrationProof: {
          url: `https://example.com/docs/bloodlab${i}.pdf`,
          filename: `bloodlab_${i}_registration.pdf`,
          uploadedAt: new Date()
        }
      },
      status: Math.random() > 0.15 ? "approved" : "pending", // 85% approved
      operatingHours: {
        open: "09:00",
        close: "18:00",
        workingDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
      },
      is24x7: Math.random() > 0.5, // 50% are 24x7
      emergencyServices: Math.random() > 0.3, // 70% have emergency services
      isActive: true,
      lastLogin: getRandomDate(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), new Date())
    });
  }

  return facilities;
};

// Generate mock donors
const generateMockDonors = () => {
  const donors = [];
  const firstNames = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Pooja", "Arjun", "Kavya", "Ravi", "Meera", 
                     "Sanjay", "Divya", "Karan", "Nisha", "Ajay", "Rina", "Suresh", "Anita", "Manoj", "Swati"];
  const lastNames = ["Sharma", "Patel", "Singh", "Gupta", "Kumar", "Yadav", "Reddy", "Joshi", "Agarwal", "Mishra"];

  for (let i = 1; i <= 25; i++) {
    const location = getRandomLocation();
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const age = Math.floor(Math.random() * 35) + 18; // 18-52 years
    const weight = Math.floor(Math.random() * 40) + 50; // 50-89 kg
    
    // Calculate last donation date (some donors never donated, others have history)
    let lastDonationDate = null;
    let donationHistory = [];
    
    if (Math.random() > 0.3) { // 70% have donated before
      const donationCount = Math.floor(Math.random() * 8) + 1; // 1-8 donations
      for (let j = 0; j < donationCount; j++) {
        const donationDate = getRandomDate(
          new Date(Date.now() - 365 * 24 * 60 * 60 * 1000 * 3), // Up to 3 years ago
          new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) // At least 90 days ago
        );
        
        donationHistory.push({
          donationDate: donationDate,
          facility: null, // Will need to populate with actual facility ID later
          bloodGroup: getRandomBloodGroup(),
          quantity: 1, // Standard 1 unit
          remarks: "Regular donation",
          verified: Math.random() > 0.2 // 80% verified
        });
        
        if (j === 0 || donationDate > lastDonationDate) {
          lastDonationDate = donationDate;
        }
      }
    }

    donors.push({
      fullName: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@gmail.com`,
      password: "password123",
      phone: getRandomPhone(),
      bloodGroup: getRandomBloodGroup(),
      dateOfBirth: new Date(Date.now() - age * 365 * 24 * 60 * 60 * 1000),
      age,
      gender: Math.random() > 0.5 ? "Male" : "Female",
      weight,
      address: {
        street: `${Math.floor(Math.random() * 999) + 1} ${["MG Road", "Park Street", "Main Road", "Gandhi Nagar"][Math.floor(Math.random() * 4)]}`,
        city: location.city,
        state: location.state,
        pincode: location.pincode
      },
      donationHistory,
      lastDonationDate,
      isActive: Math.random() > 0.05, // 95% active
      lastLogin: getRandomDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), new Date())
    });
  }

  return donors;
};

// Generate mock blood camps
const generateMockBloodCamps = (facilities) => {
  const camps = [];
  const bloodLabs = facilities.filter(f => f.facilityType === "blood-lab");
  
  const campTitles = [
    "Annual Blood Drive",
    "Emergency Blood Collection Camp",
    "Community Health Blood Donation",
    "World Blood Donor Day Camp",
    "Corporate Blood Donation Drive",
    "Youth Blood Donation Campaign",
    "Festival Season Blood Camp",
    "Mega Blood Donation Camp",
    "Mobile Blood Donation Unit",
    "Weekend Blood Drive"
  ];

  const venues = [
    "Community Center Hall",
    "City Convention Center",
    "Hospital Premises",
    "College Auditorium",
    "Corporate Office",
    "Shopping Mall",
    "Sports Complex",
    "School Ground",
    "Temple Premises",
    "Park Pavilion"
  ];

  for (let i = 1; i <= 20; i++) {
    const location = getRandomLocation();
    const bloodLab = bloodLabs[Math.floor(Math.random() * bloodLabs.length)];
    const status = campStatuses[Math.floor(Math.random() * campStatuses.length)];
    
    // Generate date based on status
    let campDate;
    if (status === "Upcoming") {
      campDate = getRandomDate(new Date(), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000));
    } else if (status === "Ongoing") {
      campDate = getRandomDate(new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), new Date(Date.now() + 1 * 24 * 60 * 60 * 1000));
    } else {
      campDate = getRandomDate(new Date(Date.now() - 180 * 24 * 60 * 60 * 1000), new Date());
    }

    const expectedDonors = Math.floor(Math.random() * 100) + 20; // 20-119 expected
    const actualDonors = status === "Completed" ? Math.floor(expectedDonors * (0.6 + Math.random() * 0.4)) : 
                        status === "Ongoing" ? Math.floor(expectedDonors * Math.random() * 0.8) : 0;

    camps.push({
      hospital: bloodLab._id,
      title: campTitles[Math.floor(Math.random() * campTitles.length)],
      description: `Join us for a life-saving blood donation camp in ${location.city}. Your donation can save up to 3 lives! Free health check-up and refreshments provided.`,
      date: campDate,
      time: {
        start: ["09:00", "10:00", "08:30"][Math.floor(Math.random() * 3)],
        end: ["17:00", "18:00", "16:30"][Math.floor(Math.random() * 3)]
      },
      location: {
        venue: venues[Math.floor(Math.random() * venues.length)],
        city: location.city,
        state: location.state,
        pincode: location.pincode
      },
      expectedDonors,
      actualDonors,
      status
    });
  }

  return camps;
};

// Generate mock blood inventory
const generateMockBloodInventory = (facilities) => {
  const bloodUnits = [];
  const bloodLabs = facilities.filter(f => f.facilityType === "blood-lab");
  const hospitals = facilities.filter(f => f.facilityType === "hospital");
  
  // Generate blood units for blood labs
  bloodLabs.forEach(lab => {
    bloodGroups.forEach(bloodGroup => {
      const unitsCount = Math.floor(Math.random() * 50) + 5; // 5-54 units per blood group
      
      for (let i = 0; i < unitsCount; i++) {
        bloodUnits.push({
          bloodGroup,
          quantity: 1, // Each unit is 1 bag
          expiryDate: getRandomDate(
            new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // At least 1 week from now
            new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)  // Up to 35 days from now
          ),
          bloodLab: lab._id,
          createdAt: getRandomDate(
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Up to 30 days ago
            new Date()
          )
        });
      }
    });
  });

  // Generate some blood units for hospitals (smaller quantities)
  hospitals.slice(0, 5).forEach(hospital => { // Only first 5 hospitals
    bloodGroups.forEach(bloodGroup => {
      if (Math.random() > 0.6) { // 40% chance to have this blood group
        const unitsCount = Math.floor(Math.random() * 15) + 1; // 1-15 units
        
        for (let i = 0; i < unitsCount; i++) {
          bloodUnits.push({
            bloodGroup,
            quantity: 1,
            expiryDate: getRandomDate(
              new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // At least 3 days from now
              new Date(Date.now() + 25 * 24 * 60 * 60 * 1000)  // Up to 25 days from now
            ),
            hospital: hospital._id,
            createdAt: getRandomDate(
              new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
              new Date()
            )
          });
        }
      }
    });
  });

  return bloodUnits;
};

// Generate mock blood requests
const generateMockBloodRequests = (hospitals, bloodLabs) => {
  const requests = [];
  
  for (let i = 0; i < 30; i++) {
    const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];
    const lab = bloodLabs[Math.floor(Math.random() * bloodLabs.length)];
    const bloodType = getRandomBloodGroup();
    const units = Math.floor(Math.random() * 8) + 1; // 1-8 units
    const status = ["pending", "accepted", "rejected"][Math.floor(Math.random() * 3)];
    
    const request = {
      hospitalId: hospital._id,
      labId: lab._id,
      bloodType,
      units,
      status,
      notes: [
        "Urgent requirement for surgery",
        "Emergency patient needs blood transfusion",
        "Regular stock replenishment",
        "Accident victim requires immediate attention",
        "Planned surgery blood requirement"
      ][Math.floor(Math.random() * 5)],
      createdAt: getRandomDate(
        new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        new Date()
      )
    };

    if (status !== "pending") {
      request.processedAt = getRandomDate(request.createdAt, new Date());
    }

    requests.push(request);
  }

  return requests;
};

// Main seeding function
const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");
    
    // Connect to database
    await connectDB();
    
    // Clear existing data (except admin)
    console.log("🗑️  Clearing existing data...");
    await Facility.deleteMany({});
    await Donor.deleteMany({});
    await BloodCamp.deleteMany({});
    await Blood.deleteMany({});
    await BloodRequest.deleteMany({});
    
    console.log("✨ Generating mock facilities...");
    const facilities = generateMockFacilities();
    const savedFacilities = await Facility.insertMany(facilities);
    console.log(`✅ Created ${savedFacilities.length} facilities`);
    
    console.log("✨ Generating mock donors...");
    const donors = generateMockDonors();
    const savedDonors = await Donor.insertMany(donors);
    console.log(`✅ Created ${savedDonors.length} donors`);
    
    console.log("✨ Generating mock blood camps...");
    const camps = generateMockBloodCamps(savedFacilities);
    const savedCamps = await BloodCamp.insertMany(camps);
    console.log(`✅ Created ${savedCamps.length} blood camps`);
    
    console.log("✨ Generating mock blood inventory...");
    const bloodUnits = generateMockBloodInventory(savedFacilities);
    const savedBloodUnits = await Blood.insertMany(bloodUnits);
    console.log(`✅ Created ${savedBloodUnits.length} blood units`);
    
    console.log("✨ Generating mock blood requests...");
    const hospitals = savedFacilities.filter(f => f.facilityType === "hospital");
    const bloodLabs = savedFacilities.filter(f => f.facilityType === "blood-lab");
    const requests = generateMockBloodRequests(hospitals, bloodLabs);
    const savedRequests = await BloodRequest.insertMany(requests);
    console.log(`✅ Created ${savedRequests.length} blood requests`);
    
    console.log("\n📊 Database Seeding Summary:");
    console.log(`• Facilities (Hospitals + Blood Labs): ${savedFacilities.length}`);
    console.log(`• Donors: ${savedDonors.length}`);
    console.log(`• Blood Camps: ${savedCamps.length}`);
    console.log(`• Blood Units: ${savedBloodUnits.length}`);
    console.log(`• Blood Requests: ${savedRequests.length}`);
    
    console.log("\n🎉 Database seeding completed successfully!");
    
    // Sample login credentials
    console.log("\n🔑 Sample Login Credentials:");
    console.log("Donors:");
    console.log("  Email: rahul.sharma1@gmail.com | Password: password123");
    console.log("  Email: priya.patel2@gmail.com | Password: password123");
    console.log("\nHospitals:");
    console.log("  Email: hospital1@mumbai.com | Password: password123");
    console.log("  Email: hospital2@delhi.com | Password: password123");
    console.log("\nBlood Labs:");
    console.log("  Email: bloodlab1@mumbai.com | Password: password123");
    console.log("  Email: bloodlab2@delhi.com | Password: password123");
    
    process.exit(0);
    
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seeding
seedDatabase();