// src/components/atoms/StatusBadge.jsx
import React from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  Pause, 
  Play, 
  Eye, 
  EyeOff,
  Star,
  Zap,
  Shield,
  Award
} from 'lucide-react';

const StatusBadge = ({ 
  status, 
  size = 'sm',
  variant = 'default',
  showIcon = true,
  className = "",
  onClick,
  animated = false,
  customText,
  customColor
}) => {
  
  // Predefined status configurations
  const statusConfigs = {
    // Service Status
    active: {
      color: 'tw:bg-green-100 tw:text-green-800 tw:border-green-200',
      icon: CheckCircle,
      text: 'Active',
      animationClass: 'tw:animate-pulse'
    },
    inactive: {
      color: 'tw:bg-red-100 tw:text-red-800 tw:border-red-200',
      icon: XCircle,
      text: 'Inactive',
      animationClass: ''
    },
    pending: {
      color: 'tw:bg-yellow-100 tw:text-yellow-800 tw:border-yellow-200',
      icon: Clock,
      text: 'Pending',
      animationClass: 'tw:animate-bounce'
    },
    draft: {
      color: 'tw:bg-gray-100 tw:text-gray-800 tw:border-gray-200',
      icon: Eye,
      text: 'Draft',
      animationClass: ''
    },
    
    // Booking Status
    booked: {
      color: 'tw:bg-blue-100 tw:text-blue-800 tw:border-blue-200',
      icon: CheckCircle,
      text: 'Booked',
      animationClass: ''
    },
    confirmed: {
      color: 'tw:bg-green-100 tw:text-green-800 tw:border-green-200',
      icon: Shield,
      text: 'Confirmed',
      animationClass: ''
    },
    cancelled: {
      color: 'tw:bg-red-100 tw:text-red-800 tw:border-red-200',
      icon: XCircle,
      text: 'Cancelled',
      animationClass: ''
    },
    completed: {
      color: 'tw:bg-green-100 tw:text-green-800 tw:border-green-200',
      icon: CheckCircle,
      text: 'Completed',
      animationClass: ''
    },
    
    // Payment Status
    paid: {
      color: 'tw:bg-green-100 tw:text-green-800 tw:border-green-200',
      icon: CheckCircle,
      text: 'Paid',
      animationClass: ''
    },
    unpaid: {
      color: 'tw:bg-red-100 tw:text-red-800 tw:border-red-200',
      icon: AlertCircle,
      text: 'Unpaid',
      animationClass: 'tw:animate-pulse'
    },
    partial: {
      color: 'tw:bg-yellow-100 tw:text-yellow-800 tw:border-yellow-200',
      icon: Clock,
      text: 'Partial',
      animationClass: ''
    },
    refunded: {
      color: 'tw:bg-blue-100 tw:text-blue-800 tw:border-blue-200',
      icon: AlertCircle,
      text: 'Refunded',
      animationClass: ''
    },
    
    // Approval Status
    approved: {
      color: 'tw:bg-green-100 tw:text-green-800 tw:border-green-200',
      icon: CheckCircle,
      text: 'Approved',
      animationClass: ''
    },
    rejected: {
      color: 'tw:bg-red-100 tw:text-red-800 tw:border-red-200',
      icon: XCircle,
      text: 'Rejected',
      animationClass: ''
    },
    reviewing: {
      color: 'tw:bg-yellow-100 tw:text-yellow-800 tw:border-yellow-200',
      icon: Clock,
      text: 'Under Review',
      animationClass: 'tw:animate-pulse'
    },
    
    // Priority Status
    high: {
      color: 'tw:bg-red-100 tw:text-red-800 tw:border-red-200',
      icon: AlertCircle,
      text: 'High Priority',
      animationClass: 'tw:animate-bounce'
    },
    medium: {
      color: 'tw:bg-yellow-100 tw:text-yellow-800 tw:border-yellow-200',
      icon: Clock,
      text: 'Medium Priority',
      animationClass: ''
    },
    low: {
      color: 'tw:bg-green-100 tw:text-green-800 tw:border-green-200',
      icon: CheckCircle,
      text: 'Low Priority',
      animationClass: ''
    },
    
    // Visibility Status
    public: {
      color: 'tw:bg-green-100 tw:text-green-800 tw:border-green-200',
      icon: Eye,
      text: 'Public',
      animationClass: ''
    },
    private: {
      color: 'tw:bg-gray-100 tw:text-gray-800 tw:border-gray-200',
      icon: EyeOff,
      text: 'Private',
      animationClass: ''
    },
    
    // Special Status
    featured: {
      color: 'tw:bg-purple-100 tw:text-purple-800 tw:border-purple-200',
      icon: Star,
      text: 'Featured',
      animationClass: 'tw:animate-pulse'
    },
    premium: {
      color: 'tw:bg-yellow-100 tw:text-yellow-800 tw:border-yellow-200',
      icon: Award,
      text: 'Premium',
      animationClass: ''
    },
    express: {
      color: 'tw:bg-orange-100 tw:text-orange-800 tw:border-orange-200',
      icon: Zap,
      text: 'Express',
      animationClass: 'tw:animate-pulse'
    },
    
    // Availability Status
    available: {
      color: 'tw:bg-green-100 tw:text-green-800 tw:border-green-200',
      icon: CheckCircle,
      text: 'Available',
      animationClass: ''
    },
    unavailable: {
      color: 'tw:bg-red-100 tw:text-red-800 tw:border-red-200',
      icon: XCircle,
      text: 'Unavailable',
      animationClass: ''
    },
    busy: {
      color: 'tw:bg-orange-100 tw:text-orange-800 tw:border-orange-200',
      icon: Pause,
      text: 'Busy',
      animationClass: ''
    },
    
    // Verification Status
    verified: {
      color: 'tw:bg-blue-100 tw:text-blue-800 tw:border-blue-200',
      icon: Shield,
      text: 'Verified',
      animationClass: ''
    },
    unverified: {
      color: 'tw:bg-gray-100 tw:text-gray-800 tw:border-gray-200',
      icon: AlertCircle,
      text: 'Unverified',
      animationClass: ''
    }
  };

  // Size configurations
  const sizeClasses = {
    xs: {
      padding: 'tw:px-2 tw:py-0.5',
      text: 'tw:text-xs',
      icon: 'tw:h-3 tw:w-3'
    },
    sm: {
      padding: 'tw:px-3 tw:py-1',
      text: 'tw:text-sm',
      icon: 'tw:h-4 tw:w-4'
    },
    md: {
      padding: 'tw:px-4 tw:py-2',
      text: 'tw:text-base',
      icon: 'tw:h-5 tw:w-5'
    },
    lg: {
      padding: 'tw:px-6 tw:py-3',
      text: 'tw:text-lg',
      icon: 'tw:h-6 tw:w-6'
    }
  };

  // Variant styles
  const variantStyles = {
    default: 'tw:border',
    solid: 'tw:border-0',
    outline: 'tw:bg-transparent tw:border-2',
    ghost: 'tw:bg-transparent tw:border-0'
  };

  // Get configuration for the status
  const config = statusConfigs[status] || statusConfigs.pending;
  const sizeConfig = sizeClasses[size];
  const Icon = config.icon;

  // Custom color override
  const colorClass = customColor || config.color;
  
  // Build the complete className
  const badgeClassName = `
    tw:inline-flex tw:items-center tw:font-semibold tw:rounded-full tw:transition-all tw:duration-200
    ${sizeConfig.padding} 
    ${sizeConfig.text} 
    ${colorClass}
    ${variantStyles[variant]}
    ${animated ? config.animationClass : ''}
    ${onClick ? 'tw:cursor-pointer hover:tw:scale-105 hover:tw:shadow-sm' : ''}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      e.stopPropagation();
      onClick(status, e);
    }
  };

  return (
    <span 
      className={badgeClassName}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          handleClick(e);
        }
      }}
    >
      {showIcon && Icon && (
        <Icon className={`${sizeConfig.icon} tw:mr-1 tw:flex-shrink-0`} />
      )}
      <span className="tw:truncate">
        {customText || config.text}
      </span>
    </span>
  );
};

// Additional utility component for multiple statuses
export const StatusGroup = ({ statuses, size = 'sm', maxVisible = 3, className = "" }) => {
  const visibleStatuses = statuses.slice(0, maxVisible);
  const hiddenCount = statuses.length - maxVisible;

  return (
    <div className={`tw:flex tw:items-center tw:space-x-2 tw:flex-wrap ${className}`}>
      {visibleStatuses.map((status, index) => (
        <StatusBadge
          key={typeof status === 'string' ? status : status.key || index}
          status={typeof status === 'string' ? status : status.status}
          size={size}
                  customText={typeof status === 'object' ? status.text : undefined}
                  customColor={typeof status === 'object' ? status.color : undefined}
                />
              ))}
              {hiddenCount > 0 && (
                <span className="tw:text-xs tw:text-gray-500">+{hiddenCount} more</span>
              )}
            </div>
          );
        };

export default StatusBadge;