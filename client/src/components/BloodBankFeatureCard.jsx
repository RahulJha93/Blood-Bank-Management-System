import React from 'react';
import { Link } from 'react-router-dom';

const BloodBankFeatureCard = () => {
  return (
    <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-6 shadow-lg border border-red-200">
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-primary-red rounded-lg flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="ml-3 text-xl font-bold text-gray-900">Find Blood Banks</h3>
      </div>
      
      <p className="text-gray-700 mb-4">
        Search for blood banks across India using real data. Find nearby blood banks by pincode, 
        check blood availability, and view urgent requirements in your area.
      </p>
      
      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Real Indian Data
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Pincode Search
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Blood Availability
        </div>
        <div className="flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          Urgent Requests
        </div>
      </div>
      
      <Link 
        to="/search-blood-banks"
        className="inline-block w-full text-center bg-primary-red text-white px-4 py-2 rounded-lg hover:bg-primary-red-dark transition-colors font-medium"
      >
        Search Blood Banks Now
      </Link>
    </div>
  );
};

export default BloodBankFeatureCard;