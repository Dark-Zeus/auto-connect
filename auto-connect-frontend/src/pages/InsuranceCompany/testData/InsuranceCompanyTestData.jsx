// Test data for Insurance Company Profile
export const insuranceCompanyTestData = {
  // Company Information
  insuranceCompanyId: 'ins_001',
  firstName: 'ABC Insurance',
  lastName: 'Company Ltd.',
  email: 'contact@abcinsurance.com',
  phone: '+94112345678',
  avatar: null, // Can be set to a base64 image string or URL
  
  // Address Information
  address: {
    street: '123 Business District, Colombo 01',
    city: 'Colombo',
    district: 'Colombo',
    province: 'Western Province',
    postalCode: '00100'
  },
  
  // Business Information
  businessInfo: {
    businessName: 'ABC Insurance Company Ltd.',
    licenseNumber: 'INS2020001',
    businessRegistrationNumber: 'BR123456789',
    taxIdentificationNumber: 'TIN987654321',
    establishedDate: '2010-01-15',
    // Additional business details
    description: 'Leading vehicle insurance provider in Sri Lanka with comprehensive coverage options.',
    website: 'https://www.abcinsurance.lk',
    businessEmail: 'contact@abcinsurance.com',
    businessPhone: '+94112345678'
  },
  
  // Policy Documents
  policyDocuments: [
    {
      id: 1,
      name: 'Vehicle Insurance Terms & Conditions',
      uploadDate: '2024-01-15',
      fileSize: '2.5 MB',
      status: 'active',
      version: '2024.1'
    },
    {
      id: 2,
      name: 'Vehicle Insurance Policy Handbook',
      uploadDate: '2024-02-10',
      fileSize: '1.8 MB',
      status: 'active',
      version: '2024.1'
    },
    {
      id: 3,
      name: 'Claims Processing Guidelines',
      uploadDate: '2024-03-05',
      fileSize: '1.2 MB',
      status: 'active',
      version: '2024.1'
    },
    {
      id: 4,
      name: 'Premium Calculation Manual',
      uploadDate: '2024-01-20',
      fileSize: '3.1 MB',
      status: 'active',
      version: '2024.1'
    }
  ],
  
  // Account Status & Verification
  isVerified: true,
  isActive: true,
  emailVerified: true,
  phoneVerified: true,
  businessLicenseVerified: true,
  kycStatus: 'completed', // completed, pending, rejected
  memberSince: '2010-01-15',
  lastLogin: '2024-08-17T10:30:00Z',
  accountTier: 'enterprise', // basic, premium, enterprise
  
  // Company Statistics & Performance
  stats: {
    totalPolicies: 15420,
    activePolicies: 12890,
    totalClaims: 2340,
    processedClaims: 2298,
    pendingClaims: 42,
    claimsSuccessRate: 98.2,
    averageClaimProcessingTime: 5.2, // in days
    customerSatisfactionRating: 4.6,
    totalAgents: 45,
    activeAgents: 42,
    branchOffices: 8,
    yearlyRevenue: 450000000, // in LKR
    monthlyRevenue: 37500000,
    marketShare: 12.5, // percentage
    policyRenewalRate: 89.3
  },
  
  // Company Information Details
  companyDetails: {
    registrationNumber: 'BR123456789',
    vatNumber: 'VAT987654321',
    incorporationDate: '2010-01-15',
    legalStructure: 'Private Limited Company',
    regulatoryLicense: 'IRCSL/INS/2020/001',
    paidUpCapital: 500000000, // in LKR
    authorizedCapital: 1000000000, // in LKR
    companyType: 'Vehicle Insurance Provider',
    industry: 'Insurance Services',
    regulatoryBody: 'Insurance Regulatory Commission of Sri Lanka (IRCSL)',
    auditFirm: 'KPMG Sri Lanka',
    legalAdvisors: 'Julius & Creasy'
  },
  
  // Coverage Types & Products
  products: [
    {
      id: 'comprehensive',
      name: 'Comprehensive Vehicle Insurance',
      description: 'Complete protection for your vehicle including theft, accidents, and natural disasters',
      isActive: true,
      premiumRange: { min: 15000, max: 150000 }, // in LKR
      coverageLimit: 5000000 // in LKR
    },
    {
      id: 'thirdparty',
      name: 'Third Party Insurance',
      description: 'Mandatory coverage for third party damages and injuries',
      isActive: true,
      premiumRange: { min: 5000, max: 25000 }, // in LKR
      coverageLimit: 1000000 // in LKR
    },
    {
      id: 'thirdpartyfire',
      name: 'Third Party Fire & Theft',
      description: 'Third party coverage plus protection against fire and theft',
      isActive: true,
      premiumRange: { min: 8000, max: 45000 }, // in LKR
      coverageLimit: 2000000 // in LKR
    }
  ],
  
  // Branch Network
  branches: [
    {
      id: 1,
      name: 'Head Office - Colombo',
      address: '123 Business District, Colombo 01',
      phone: '+94112345678',
      email: 'colombo@abcinsurance.com',
      manager: 'Mr. Kamal Perera',
      isHeadOffice: true,
      staffCount: 25
    },
    {
      id: 2,
      name: 'Kandy Branch',
      address: '456 Temple Street, Kandy',
      phone: '+94812345678',
      email: 'kandy@abcinsurance.com',
      manager: 'Ms. Nimal Silva',
      isHeadOffice: false,
      staffCount: 8
    },
    {
      id: 3,
      name: 'Galle Branch',
      address: '789 Fort Road, Galle',
      phone: '+94912345678',
      email: 'galle@abcinsurance.com',
      manager: 'Mr. Sunil Fernando',
      isHeadOffice: false,
      staffCount: 6
    }
  ],
  
  // Contact & Communication Preferences
  preferences: {
    communicationMethod: 'email', // email, phone, whatsapp
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      marketingEmails: false,
      policyUpdates: true,
      regulatoryAlerts: true,
      systemMaintenance: true
    },
    privacy: {
      profileVisibility: 'public', // public, private, limited
      showContactInfo: true,
      showBusinessInfo: true,
      showStats: false
    }
  },
  
  // Security Information
  security: {
    lastPasswordChange: '2024-05-17T14:20:00Z',
    twoFactorEnabled: true,
    loginHistory: [
      {
        date: '2024-08-17T10:30:00Z',
        location: 'Colombo, Sri Lanka',
        device: 'Chrome on Windows',
        ipAddress: '192.168.1.1',
        user: 'Admin User'
      },
      {
        date: '2024-08-16T16:45:00Z',
        location: 'Colombo, Sri Lanka',
        device: 'Mobile Safari',
        ipAddress: '192.168.1.2',
        user: 'Manager User'
      }
    ],
    securityQuestions: [
      {
        question: 'What is the name of your first branch location?',
        isSet: true
      },
      {
        question: 'What year was the company established?',
        isSet: true
      }
    ]
  },
  
  // Regulatory & Compliance
  compliance: {
    ircslLicense: {
      number: 'IRCSL/INS/2020/001',
      issuedDate: '2020-01-15',
      expiryDate: '2025-01-14',
      status: 'active'
    },
    annualReturns: {
      lastFiled: '2024-03-31',
      nextDue: '2025-03-31',
      status: 'up-to-date'
    },
    auditReports: {
      lastAudit: '2024-03-31',
      nextAudit: '2025-03-31',
      auditor: 'KPMG Sri Lanka',
      status: 'compliant'
    },
    reserveRequirements: {
      required: 100000000, // in LKR
      maintained: 125000000, // in LKR
      status: 'compliant'
    }
  },
  
  // Financial Information
  financials: {
    lastYearRevenue: 420000000, // in LKR
    currentYearRevenue: 450000000, // in LKR
    grossPremiums: 380000000, // in LKR
    netPremiums: 342000000, // in LKR
    claimsPaid: 156000000, // in LKR
    operatingExpenses: 89000000, // in LKR
    netProfit: 45000000, // in LKR
    totalAssets: 890000000, // in LKR
    totalLiabilities: 234000000, // in LKR
    shareholderEquity: 656000000 // in LKR
  },
  
  // Recent Activities
  recentActivities: [
    {
      id: 'act_001',
      type: 'policy_document_updated',
      description: 'Updated Vehicle Insurance Terms & Conditions',
      timestamp: '2024-08-17T09:30:00Z',
      user: 'Legal Department'
    },
    {
      id: 'act_002',
      type: 'regulatory_filing',
      description: 'Submitted quarterly regulatory report to IRCSL',
      timestamp: '2024-08-15T15:45:00Z',
      user: 'Compliance Officer'
    },
    {
      id: 'act_003',
      type: 'branch_opened',
      description: 'Opened new branch in Matara',
      timestamp: '2024-08-10T11:20:00Z',
      user: 'Operations Manager'
    },
    {
      id: 'act_004',
      type: 'system_update',
      description: 'Upgraded policy management system',
      timestamp: '2024-08-05T14:00:00Z',
      user: 'IT Administrator'
    }
  ]
};

export default insuranceCompanyTestData;