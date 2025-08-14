// ClaimDetailsTestData.jsx
//import Accpic1 from '../../assets/images/AccidentCars/AccCar1.jpeg';
//import Accpic2 from '../../assets/images/AccidentCars/AccCar2.jpeg';

const claimDetailsTestData = [
  { 
    id: 'CLM-2025-001',
    customer: 'John Silva', 
    vehicle: 'Honda Civic - ABC-1234', 
    type: 'Accident', 
    amount: 150000, 
    status: 'pending', 
    date: '2025-08-05', 
    priority: 'high',      
    accidentReport: 'Rear-end collision at Galle Road intersection.',
    images: ['/uploads/claim1_img1.jpg', '/uploads/claim1_img2.jpg'],
    policeReport: '/uploads/police_report_001.pdf',
    comments: ''
  },
  { 
    id: 'CLM-2025-002',
    customer: 'Sarah Fernando',
    vehicle: 'Toyota Prius - XYZ-5678',
    type: 'Theft',
    amount: 280000,
    status: 'investigating',
    date: '2025-08-04',
    priority: 'urgent',
    accidentReport: 'Rear-end collision at Galle Road intersection.',
    images: ['/uploads/claim1_img1.jpg', '/uploads/claim1_img2.jpg'],
    policeReport: '/uploads/police_report_001.pdf',
    comments: ''
  },
  { 
    id: 'CLM-2025-003',
    customer: 'Mike Perera',
    vehicle: 'Nissan Leaf - DEF-9012',
    type: 'Vandalism',
    amount: 45000,
    status: 'approved',
    date: '2025-08-03',
    priority: 'normal',
    accidentReport: 'Rear-end collision at Galle Road intersection.',
    images: ['/uploads/claim1_img1.jpg', '/uploads/claim1_img2.jpg'],
    policeReport: '/uploads/police_report_001.pdf',
    comments: ''
  },
  { 
    id: 'CLM-2025-004',
    customer: 'Lisa Rajapaksa',
    vehicle: 'BMW X5 - GHI-3456',
    type: 'Fire Damage',
    amount: 520000,
    status: 'processing',
    date: '2025-08-02',
    priority: 'high',
    accidentReport: 'Rear-end collision at Galle Road intersection.',
    images: ['/uploads/claim1_img1.jpg', '/uploads/claim1_img2.jpg'],
    policeReport: '/uploads/police_report_001.pdf',
    comments: ''
  },
  { 
    id: 'CLM-2025-005',
    customer: 'Rajiv Perera',
    vehicle: 'Suzuki Alto - KLM-7890',
    type: 'Accident',
    amount: 80000,
    status: 'pending',
    date: '2025-08-01',
    priority: 'normal',
    accidentReport: 'Rear-end collision at Galle Road intersection.',
    images: ['/uploads/claim1_img1.jpg', '/uploads/claim1_img2.jpg'],
    policeReport: '/uploads/police_report_001.pdf',
    comments: ''
  },
  { 
    id: 'CLM-2025-006',
    customer: 'Anusha Wijesinghe',
    vehicle: 'Toyota Hilux - JKL-1111',
    type: 'Flood Damage',
    amount: 300000,
    status: 'approved',
    date: '2025-07-30',
    priority: 'high',
    accidentReport: 'Rear-end collision at Galle Road intersection.',
    images: ['/uploads/claim1_img1.jpg', '/uploads/claim1_img2.jpg'],
    policeReport: '/uploads/police_report_001.pdf',
    comments: ''
  },
  { 
    id: 'CLM-2025-007',
    customer: 'Tharindu Silva',
    vehicle: 'Mitsubishi Lancer - QWE-2222',
    type: 'Theft', 
    amount: 200000,
    status: 'pending',
    date: '2025-07-28',
    priority: 'urgent',
    accidentReport: 'Rear-end collision at Galle Road intersection.',
    images: ['/uploads/claim1_img1.jpg', '/uploads/claim1_img2.jpg'],
    policeReport: '/uploads/police_report_001.pdf',
    comments: ''
  },
    { 
    id: 'CLM-2025-008',
    customer: 'Praba Silva',
    vehicle: 'Suzuki - QWE-2222',
    type: 'Accident', 
    amount: 400000,
    status: 'pending',
    date: '2025-07-28',
    priority: 'urgent',
    accidentReport: '',
    images: ['/uploads/claim1_img1.jpg', '/uploads/claim1_img2.jpg'],
    policeReport: '/uploads/police_report_001.pdf',
    comments: ''
  }
];

export default claimDetailsTestData;
