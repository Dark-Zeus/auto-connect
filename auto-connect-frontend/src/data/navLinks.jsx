import AdaptivePaginatableTable from "@components/atoms/AdaptivePaginatableTable";
import { resolveExample } from "./paramResolvers/exampleResolver"

function getNavLinks(userContext) {
  let nav = [];

  // VEHICLE OWNER Navigation
  if (userContext.role === "vehicle_owner") {
    nav.push({
      path: [`/dashboard`],
      title: "Dashboard",
      icon: "dashboard",
      page: "Dashboard",
    });

    nav.push({
      title: "My Vehicles",
      icon: "directions_car",
      page: "My Vehicles",
      defLinkSettings: {
        title: "Vehicle List",
        icon: "directions_car",
      },
      sub: [
        {
          path: [`/vehicles`],
          title: "Vehicle List",
          icon: "directions_car",
          page: "Vehicle List",
        },
        {
          path: [`/vehicles/add`],
          title: "Add New Vehicle",
          icon: "add_circle",
          page: "Add New Vehicle",
        },
        {
          path: [`/vehicles/:vehicleId`],
          title: "Vehicle Details",
          icon: "info",
          page: "Vehicle Details",
        },
        {
          path: [`/vehicles/:vehicleId/history`],
          title: "Vehicle History",
          icon: "history",
          page: "Vehicle History",
        }
      ]
    });

    nav.push({
      title: "Service Management",
      icon: "build",
      page: "Service Management",
      defLinkSettings: {
        title: "Book Service",
        icon: "build",
      },
      sub: [
        {
          path: [`/services`],
          title: "Book Service",
          icon: "build",
          page: "Book Service",
        },
        {
          path: [`/services/history`],
          title: "Service History",
          icon: "history",
          page: "Service History",
        },
        {
          path: [`/services/providers`],
          title: "Service Providers",
          icon: "business",
          page: "Service Providers",
        },
        {
          path: [`/services/appointments`],
          title: "Upcoming Appointments",
          icon: "schedule",
          page: "Upcoming Appointments",
        },
        {
          path: [`/services/reminders`],
          title: "Maintenance Reminders",
          icon: "notifications",
          page: "Maintenance Reminders",
        }
      ]
    });

    nav.push({
      title: "Marketplace & Trading",
      icon: "store",
      page: "Marketplace & Trading",
      defLinkSettings: {
        title: "Marketplace Home",
        icon: "store",
      },
      sub: [
        {
          path: [`/marketplace`],
          title: "Marketplace Home",
          icon: "store",
          page: "Marketplace Home",
        },
        {
          path: [`/marketplace/buy`],
          title: "Buy Vehicle",
          icon: "shopping_cart",
          page: "Buy Vehicle",
        },
        {
          path: [`/marketplace/sell`],
          title: "Sell Vehicle",
          icon: "sell",
          page: "Sell Vehicle",
        },
        {
          path: [`/marketplace/my-ads`],
          title: "My Ads",
          icon: "campaign",
          page: "My Ads",
        },
        {
          path: [`/marketplace/saved-ads`],
          title: "Saved Ads",
          icon: "bookmark",
          page: "Saved Ads",
        },
        {
          path: [`/marketplace/history-report`],
          title: "Vehicle History Report",
          icon: "description",
          page: "Vehicle History Report",
        },
        {
          path: [`/marketplace/subscription`],
          title: "Subscription",
          icon: "subscriptions",
          page: "Subscription",
        }
      ]
    });

    nav.push({
      title: "Insurance & Claims",
      icon: "security",
      page: "Insurance & Claims",
      defLinkSettings: {
        title: "Insurance Dashboard",
        icon: "security",
      },
      sub: [
        {
          path: [`/insurance`],
          title: "Insurance Dashboard",
          icon: "security",
          page: "Insurance Dashboard",
        },
        {
          path: [`/insurance/policies`],
          title: "Policy Management",
          icon: "policy",
          page: "Policy Management",
        },
        {
          path: [`/insurance/claims/new`],
          title: "File New Claim",
          icon: "report_problem",
          page: "File New Claim",
        },
        {
          path: [`/insurance/claims/history`],
          title: "Claim History",
          icon: "history",
          page: "Claim History",
        },
        {
          path: [`/insurance/accidents`],
          title: "Accident Reports",
          icon: "warning",
          page: "Accident Reports",
        }
      ]
    });

    nav.push({
      title: "Documents",
      icon: "folder",
      page: "Documents",
      defLinkSettings: {
        title: "Documents Dashboard",
        icon: "folder",
      },
      sub: [
        {
          path: [`/documents`],
          title: "Documents Dashboard",
          icon: "folder",
          page: "Documents Dashboard",
        },
        {
          path: [`/documents/vehicle-papers`],
          title: "Vehicle Papers",
          icon: "description",
          page: "Vehicle Papers",
        },
        {
          path: [`/documents/service-records`],
          title: "Service Records",
          icon: "build",
          page: "Service Records",
        },
        {
          path: [`/documents/insurance-docs`],
          title: "Insurance Documents",
          icon: "security",
          page: "Insurance Documents",
        },
        {
          path: [`/documents/compliance`],
          title: "Compliance Certificates",
          icon: "verified",
          page: "Compliance Certificates",
        }
      ]
    });

    nav.push({
      title: "Profile",
      icon: "person",
      page: "Profile",
      defLinkSettings: {
        title: "Profile Overview",
        icon: "person",
      },
      sub: [
        {
          path: [`/profile`],
          title: "Profile Overview",
          icon: "person",
          page: "Profile Overview",
        },
        {
          path: [`/profile/personal`],
          title: "Personal Information",
          icon: "person_outline",
          page: "Personal Information",
        },
        {
          path: [`/profile/contact`],
          title: "Contact Details",
          icon: "contact_phone",
          page: "Contact Details",
        },
        {
          path: [`/profile/preferences`],
          title: "Preferences",
          icon: "settings",
          page: "Preferences",
        },
        {
          path: [`/profile/security`],
          title: "Security Settings",
          icon: "lock",
          page: "Security Settings",
        }
      ]
    });
  }

  // SERVICE PROVIDER Navigation
  if (userContext.role === "service_center" || userContext.role === "repair_center") {
    nav.push({
      path: [`/dashboard`],
      title: "Dashboard",
      icon: "dashboard",
      page: "Dashboard",
    });

    nav.push({
      title: "Appointments",
      icon: "schedule",
      page: "Appointments",
      defLinkSettings: {
        title: "Appointment Management",
        icon: "schedule",
      },
      sub: [
        {
          path: [`/appointments`],
          title: "Appointment Management",
          icon: "schedule",
          page: "Appointment Management",
        },
        {
          path: [`/appointments/calendar`],
          title: "Service Calendar",
          icon: "calendar_today",
          page: "Service Calendar",
        }
      ]
    });

    nav.push({
      title: "Customer Management",
      icon: "people",
      page: "Customer Management",
      defLinkSettings: {
        title: "Customer List",
        icon: "people",
      },
      sub: [
        {
          path: [`/customers`],
          title: "Customer List",
          icon: "people",
          page: "Customer List",
        },
        {
          path: [`/customers/history`],
          title: "Customer History",
          icon: "history",
          page: "Customer History",
        },
        {
          path: [`/customers/reviews`],
          title: "Reviews & Ratings",
          icon: "star_rate",
          page: "Reviews & Ratings",
        },
        {
          path: [`/customers/communication`],
          title: "Communication Center",
          icon: "message",
          page: "Communication Center",
        }
      ]
    });

    nav.push({
      title: "Service Management",
      icon: "build",
      page: "Service Management",
      defLinkSettings: {
        title: "Service Categories",
        icon: "build",
      },
      sub: [
        {
          path: [`/services`],
          title: "Service Categories",
          icon: "build",
          page: "Service Categories",
        },
        {
          path: [`/services/pricing`],
          title: "Service Pricing",
          icon: "attach_money",
          page: "Service Pricing",
        },
        {
          path: [`/services/history`],
          title: "Service History",
          icon: "history",
          page: "Service History",
        },
        {
          path: [`/services/quality`],
          title: "Quality Control",
          icon: "verified",
          page: "Quality Control",
        }
      ]
    });

    nav.push({
      title: "Inventory",
      icon: "inventory",
      page: "Inventory",
      defLinkSettings: {
        title: "Inventory Management",
        icon: "inventory",
      },
      sub: [
        {
          path: [`/inventory`],
          title: "Inventory Management",
          icon: "inventory",
          page: "Inventory Management",
        },
        {
          path: [`/inventory/stock`],
          title: "Stock Levels",
          icon: "inventory_2",
          page: "Stock Levels",
        },
        {
          path: [`/inventory/suppliers`],
          title: "Supplier Management",
          icon: "local_shipping",
          page: "Supplier Management",
        },
        {
          path: [`/inventory/orders`],
          title: "Order History",
          icon: "history",
          page: "Order History",
        }
      ]
    });

    nav.push({
      title: "Financial",
      icon: "account_balance",
      page: "Financial",
      defLinkSettings: {
        title: "Financial Dashboard",
        icon: "account_balance",
      },
      sub: [
        {
          path: [`/financial`],
          title: "Financial Dashboard",
          icon: "account_balance",
          page: "Financial Dashboard",
        },
        {
          path: [`/financial/payments`],
          title: "Payment Management",
          icon: "payment",
          page: "Payment Management",
        },
        {
          path: [`/financial/invoices`],
          title: "Invoice Generation",
          icon: "receipt",
          page: "Invoice Generation",
        },
        {
          path: [`/financial/revenue`],
          title: "Revenue Reports",
          icon: "trending_up",
          page: "Revenue Reports",
        },
        {
          path: [`/financial/transactions`],
          title: "Transaction History",
          icon: "history",
          page: "Transaction History",
        }
      ]
    });

    nav.push({
      title: "Business Profile",
      icon: "business",
      page: "Business Profile",
      defLinkSettings: {
        title: "Company Information",
        icon: "business",
      },
      sub: [
        {
          path: [`/business`],
          title: "Company Information",
          icon: "business",
          page: "Company Information",
        },
        {
          path: [`/business/certifications`],
          title: "Certifications",
          icon: "verified",
          page: "Certifications",
        },
        {
          path: [`/business/hours`],
          title: "Operating Hours",
          icon: "schedule",
          page: "Operating Hours",
        },
        {
          path: [`/business/areas`],
          title: "Service Areas",
          icon: "location_on",
          page: "Service Areas",
        }
      ]
    });

    nav.push({
      path: [`/analytics`],
      title: "Reports & Analytics",
      icon: "analytics",
      page: "Reports & Analytics",
    });

    nav.push({
      title: "Profile",
      icon: "person",
      page: "Profile",
      defLinkSettings: {
        title: "Profile Overview",
        icon: "person",
      },
      sub: [
        {
          path: [`/profile`],
          title: "Profile Overview",
          icon: "person",
          page: "Profile Overview",
        },
        {
          path: [`/profile/personal`],
          title: "Personal Information",
          icon: "person_outline",
          page: "Personal Information",
        },
        {
          path: [`/profile/contact`],
          title: "Contact Details",
          icon: "contact_phone",
          page: "Contact Details",
        },
        {
          path: [`/profile/preferences`],
          title: "Preferences",
          icon: "settings",
          page: "Preferences",
        },
        {
          path: [`/profile/security`],
          title: "Security Settings",
          icon: "lock",
          page: "Security Settings",
        }
      ]
    });
  }

  // INSURANCE COMPANY Navigation
  if (userContext.role === "insurance_agent") {
    nav.push({
      path: [`/dashboard`],
      title: "Dashboard",
      icon: "dashboard",
      page: "Dashboard",
    });

    nav.push({
      title: "Claims Management",
      icon: "assignment",
      page: "Claims Management",
      defLinkSettings: {
        title: "Claims Dashboard",
        icon: "assignment",
      },
      sub: [
        {
          path: [`/claims`],
          title: "Claims Dashboard",
          icon: "assignment",
          page: "Claims Dashboard",
        },
        {
          path: [`/claims/active`],
          title: "Active Claims",
          icon: "pending_actions",
          page: "Active Claims",
        },
        {
          path: [`/claims/processing`],
          title: "Claim Processing",
          icon: "process",
          page: "Claim Processing",
        },
        {
          path: [`/claims/assessment`],
          title: "Damage Assessment",
          icon: "assessment",
          page: "Damage Assessment",
        }
      ]
    });

    nav.push({
      title: "Policy Management",
      icon: "policy",
      page: "Policy Management",
      defLinkSettings: {
        title: "Policy Dashboard",
        icon: "policy",
      },
      sub: [
        {
          path: [`/policies`],
          title: "Policy Dashboard",
          icon: "policy",
          page: "Policy Dashboard",
        },
        {
          path: [`/policies/create`],
          title: "Create New Policy",
          icon: "add_circle",
          page: "Create New Policy",
        },
        {
          path: [`/policies/premium`],
          title: "Premium Management",
          icon: "attach_money",
          page: "Premium Management",
        },
        {
          path: [`/policies/analytics`],
          title: "Policy Analytics",
          icon: "analytics",
          page: "Policy Analytics",
        }
      ]
    });

    nav.push({
      title: "Vehicle Assessment",
      icon: "assessment",
      page: "Vehicle Assessment",
      defLinkSettings: {
        title: "Assessment Dashboard",
        icon: "assessment",
      },
      sub: [
        {
          path: [`/assessment`],
          title: "Assessment Dashboard",
          icon: "assessment",
          page: "Assessment Dashboard",
        },
        {
          path: [`/assessment/damage-reports`],
          title: "Damage Reports",
          icon: "report_problem",
          page: "Damage Reports",
        },
        {
          path: [`/assessment/valuation`],
          title: "Valuation Tools",
          icon: "calculate",
          page: "Valuation Tools",
        },
        {
          path: [`/assessment/inspections`],
          title: "Inspection Records",
          icon: "search",
          page: "Inspection Records",
        }
      ]
    });

    nav.push({
      title: "Service Authorization",
      icon: "verified_user",
      page: "Service Authorization",
      defLinkSettings: {
        title: "Authorization Dashboard",
        icon: "verified_user",
      },
      sub: [
        {
          path: [`/authorization`],
          title: "Authorization Dashboard",
          icon: "verified_user",
          page: "Authorization Dashboard",
        },
        {
          path: [`/authorization/repairs`],
          title: "Repair Approvals",
          icon: "check_circle",
          page: "Repair Approvals",
        },
        {
          path: [`/authorization/verification`],
          title: "Service Verification",
          icon: "verified",
          page: "Service Verification",
        },
        {
          path: [`/authorization/history`],
          title: "Authorization History",
          icon: "history",
          page: "Authorization History",
        }
      ]
    });

    nav.push({
      title: "Financial Management",
      icon: "account_balance",
      page: "Financial Management",
      defLinkSettings: {
        title: "Financial Dashboard",
        icon: "account_balance",
      },
      sub: [
        {
          path: [`/financial`],
          title: "Financial Dashboard",
          icon: "account_balance",
          page: "Financial Dashboard",
        },
        {
          path: [`/financial/settlements`],
          title: "Settlements",
          icon: "handshake",
          page: "Settlements",
        },
        {
          path: [`/financial/payments`],
          title: "Payment Processing",
          icon: "payment",
          page: "Payment Processing",
        },
        {
          path: [`/financial/reports`],
          title: "Financial Reports",
          icon: "trending_up",
          page: "Financial Reports",
        },
        {
          path: [`/financial/budget`],
          title: "Budget Management",
          icon: "account_balance_wallet",
          page: "Budget Management",
        }
      ]
    });

    nav.push({
      title: "Risk Management",
      icon: "shield",
      page: "Risk Management",
      defLinkSettings: {
        title: "Risk Dashboard",
        icon: "shield",
      },
      sub: [
        {
          path: [`/risk`],
          title: "Risk Dashboard",
          icon: "shield",
          page: "Risk Dashboard",
        },
        {
          path: [`/risk/assessment`],
          title: "Risk Assessment",
          icon: "assessment",
          page: "Risk Assessment",
        },
        {
          path: [`/risk/fraud`],
          title: "Fraud Detection",
          icon: "gavel",
          page: "Fraud Detection",
        },
        {
          path: [`/risk/compliance`],
          title: "Compliance Monitoring",
          icon: "rule",
          page: "Compliance Monitoring",
        }
      ]
    });

    nav.push({
      title: "Network Management",
      icon: "hub",
      page: "Network Management",
      defLinkSettings: {
        title: "Network Dashboard",
        icon: "hub",
      },
      sub: [
        {
          path: [`/network`],
          title: "Network Dashboard",
          icon: "hub",
          page: "Network Dashboard",
        },
        {
          path: [`/network/partners`],
          title: "Partner Management",
          icon: "people",
          page: "Partner Management",
        },
        {
          path: [`/network/performance`],
          title: "Performance Monitoring",
          icon: "speed",
          page: "Performance Monitoring",
        },
        {
          path: [`/network/contracts`],
          title: "Contract Management",
          icon: "description",
          page: "Contract Management",
        }
      ]
    });

    nav.push({
      title: "Profile",
      icon: "person",
      page: "Profile",
      defLinkSettings: {
        title: "Profile Overview",
        icon: "person",
      },
      sub: [
        {
          path: [`/profile`],
          title: "Profile Overview",
          icon: "person",
          page: "Profile Overview",
        },
        {
          path: [`/profile/personal`],
          title: "Personal Information",
          icon: "person_outline",
          page: "Personal Information",
        },
        {
          path: [`/profile/contact`],
          title: "Contact Details",
          icon: "contact_phone",
          page: "Contact Details",
        },
        {
          path: [`/profile/preferences`],
          title: "Preferences",
          icon: "settings",
          page: "Preferences",
        },
        {
          path: [`/profile/security`],
          title: "Security Settings",
          icon: "lock",
          page: "Security Settings",
        }
      ]
    });
  }

  // SYSTEM ADMINISTRATOR Navigation
  if (userContext.role === "system_admin") {
    nav.push({
      path: [`/dashboard`],
      title: "Dashboard",
      icon: "dashboard",
      page: "Dashboard",
    });

    nav.push({
      title: "User Management",
      icon: "people",
      page: "User Management",
      defLinkSettings: {
        title: "All Users",
        icon: "people",
      },
      sub: [
        {
          path: [`/users`],
          title: "All Users",
          icon: "people",
          page: "All Users",
        },
        {
          path: [`/users/vehicleowners`],
          title: "Vehicle Owners",
          icon: "directions_car",
          page: "Vehicle Owners",
        },
        {
          path: [`/users/insurancecompanies`],
          title: "Insurance Companies",
          icon: "security",
          page: "Insurance Companies",
        },
        {
          path: [`/users/services`],
          title: "Service Centers",
          icon: "build",
          page: "Service Centers",
        }
      ]
    });

    nav.push({
      title: "Platform Management",
      icon: "settings",
      page: "Platform Management",
      defLinkSettings: {
        title: "System Configuration",
        icon: "settings",
      },
      sub: [
        {
          path: [`/platform/config`],
          title: "System Configuration",
          icon: "settings",
          page: "System Configuration",
        },
        {
          path: [`/platform/features`],
          title: "Feature Toggles",
          icon: "toggle_on",
          page: "Feature Toggles",
        },
        {
          path: [`/platform/content`],
          title: "Content Management",
          icon: "edit",
          page: "Content Management",
        },
        {
          path: [`/platform/api`],
          title: "API Management",
          icon: "api",
          page: "API Management",
        }
      ]
    });

    nav.push({
      title: "Service Provider Verification",
      icon: "verified",
      page: "Service Provider Verification",
      defLinkSettings: {
        title: "Pending Verifications",
        icon: "pending",
      },
      sub: [
        {
          path: [`/verification/pending`],
          title: "Pending Verifications",
          icon: "pending",
          page: "Pending Verifications",
        },
        {
          path: [`/verification/process`],
          title: "Verification Process",
          icon: "process",
          page: "Verification Process",
        },
        {
          path: [`/verification/certifications`],
          title: "Certification Management",
          icon: "verified",
          page: "Certification Management",
        },
        {
          path: [`/verification/analytics`],
          title: "Provider Analytics",
          icon: "analytics",
          page: "Provider Analytics",
        }
      ]
    });

    nav.push({
      title: "Financial Oversight",
      icon: "account_balance",
      page: "Financial Oversight",
      defLinkSettings: {
        title: "Transaction Monitoring",
        icon: "monitor_heart",
      },
      sub: [
        {
          path: [`/financial/transactions`],
          title: "Transaction Monitoring",
          icon: "monitor_heart",
          page: "Transaction Monitoring",
        },
        {
          path: [`/financial/revenue`],
          title: "Revenue Analytics",
          icon: "trending_up",
          page: "Revenue Analytics",
        },
        {
          path: [`/financial/commission`],
          title: "Commission Management",
          icon: "percent",
          page: "Commission Management",
        },
        {
          path: [`/financial/gateway`],
          title: "Payment Gateway",
          icon: "payment",
          page: "Payment Gateway",
        }
      ]
    });

    nav.push({
      title: "Security & Compliance",
      icon: "shield",
      page: "Security & Compliance",
      defLinkSettings: {
        title: "Security Logs",
        icon: "security",
      },
      sub: [
        {
          path: [`/security/logs`],
          title: "Security Logs",
          icon: "security",
          page: "Security Logs",
        },
        {
          path: [`/security/audit`],
          title: "Audit Trails",
          icon: "track_changes",
          page: "Audit Trails",
        },
        {
          path: [`/security/compliance`],
          title: "Compliance Reports",
          icon: "rule",
          page: "Compliance Reports",
        },
        {
          path: [`/security/data`],
          title: "Data Protection",
          icon: "privacy_tip",
          page: "Data Protection",
        }
      ]
    });

    nav.push({
      title: "Analytics & Reports",
      icon: "analytics",
      page: "Analytics & Reports",
      defLinkSettings: {
        title: "Platform Analytics",
        icon: "analytics",
      },
      sub: [
        {
          path: [`/analytics`],
          title: "Platform Analytics",
          icon: "analytics",
          page: "Platform Analytics",
        },
        {
          path: [`/analytics/users`],
          title: "User Behavior",
          icon: "people_outline",
          page: "User Behavior",
        },
        {
          path: [`/analytics/business`],
          title: "Business Intelligence",
          icon: "business_center",
          page: "Business Intelligence",
        },
        {
          path: [`/analytics/performance`],
          title: "Performance Reports",
          icon: "speed",
          page: "Performance Reports",
        }
      ]
    });

    nav.push({
      title: "System Maintenance",
      icon: "build_circle",
      page: "System Maintenance",
      defLinkSettings: {
        title: "System Health",
        icon: "health_and_safety",
      },
      sub: [
        {
          path: [`/system/health`],
          title: "System Health",
          icon: "health_and_safety",
          page: "System Health",
        },
        {
          path: [`/system/database`],
          title: "Database Management",
          icon: "storage",
          page: "Database Management",
        },
        {
          path: [`/system/backup`],
          title: "Backup & Recovery",
          icon: "backup",
          page: "Backup & Recovery",
        },
        {
          path: [`/system/errors`],
          title: "Error Logs",
          icon: "error",
          page: "Error Logs",
        }
      ]
    });

    nav.push({
      path: [`/notifications`],
      title: "Notifications",
      icon: "notifications",
      page: "Notifications",
    });

    nav.push({
      path: [`/subscription`],
      title: "Subscriptions",
      icon: "subscriptions",
      page: "Subscriptions",
    });

    nav.push({
      path: [`/updates`],
      title: "Updates",
      icon: "system_update",
      page: "Updates",
    });

    nav.push({
      title: "Support & Help",
      icon: "help",
      page: "Support & Help",
      defLinkSettings: {
        title: "Help Desk",
        icon: "help_center",
      },
      sub: [
        {
          path: [`/support/helpdesk`],
          title: "Help Desk",
          icon: "help_center",
          page: "Help Desk",
        },
        {
          path: [`/support/users`],
          title: "User Support",
          icon: "support_agent",
          page: "User Support",
        },
        {
          path: [`/support/docs`],
          title: "Documentation",
          icon: "description",
          page: "Documentation",
        },
        {
          path: [`/support/training`],
          title: "Training Materials",
          icon: "school",
          page: "Training Materials",
        }
      ]
    });
  }

  return processNavLinks(nav);
}

function processNavLinks(nav) {
  nav.forEach(navItem => {
    // Check main nav items for subNav
    if (navItem.subNav && Array.isArray(navItem.subNav)) {
      const defaultItem = {
        path: navItem.path,
        title: navItem.defLinkSettings?.title || navItem.title || "Default",
        page: navItem.page,
        icon: navItem.defLinkSettings?.icon || navItem.icon || "home",
        paramResolvers: navItem.paramResolvers
      };
      navItem.subNav.unshift(defaultItem);
    }

    // Check sub items for subNav
    if (navItem.sub) {
      navItem.sub.forEach(subItem => {
        if (subItem.subNav && Array.isArray(subItem.subNav)) {
          const defaultItem = {
            path: subItem.path,
            title: "Default",
            page: subItem.page,
            icon: subItem.icon,
            paramResolvers: subItem.paramResolvers
          };
          subItem.subNav.unshift(defaultItem);
        }
      });
    }
  });

  return nav;
}

export { getNavLinks };
