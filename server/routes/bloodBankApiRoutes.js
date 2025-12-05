import express from 'express';
import {
  searchBloodBanksByPincode,
  getBloodAvailability,
  getUrgentRequirements,
  searchByBloodGroup
} from '../controllers/bloodBankApiController.js';

const router = express.Router();

// Public routes - no authentication needed for blood bank search
router.get('/search/pincode/:pincode', searchBloodBanksByPincode);
router.get('/availability', getBloodAvailability);
router.get('/urgent-requirements', getUrgentRequirements);
router.get('/search/blood-group', searchByBloodGroup);

// Additional utility routes
router.get('/blood-groups', (req, res) => {
  res.json({
    success: true,
    data: {
      bloodGroups: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      compatibility: {
        'A+': { canDonateTo: ['A+', 'AB+'], canReceiveFrom: ['A+', 'A-', 'O+', 'O-'] },
        'A-': { canDonateTo: ['A+', 'A-', 'AB+', 'AB-'], canReceiveFrom: ['A-', 'O-'] },
        'B+': { canDonateTo: ['B+', 'AB+'], canReceiveFrom: ['B+', 'B-', 'O+', 'O-'] },
        'B-': { canDonateTo: ['B+', 'B-', 'AB+', 'AB-'], canReceiveFrom: ['B-', 'O-'] },
        'AB+': { canDonateTo: ['AB+'], canReceiveFrom: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] },
        'AB-': { canDonateTo: ['AB+', 'AB-'], canReceiveFrom: ['A-', 'B-', 'AB-', 'O-'] },
        'O+': { canDonateTo: ['A+', 'B+', 'AB+', 'O+'], canReceiveFrom: ['O+', 'O-'] },
        'O-': { canDonateTo: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], canReceiveFrom: ['O-'] }
      }
    }
  });
});

export default router;