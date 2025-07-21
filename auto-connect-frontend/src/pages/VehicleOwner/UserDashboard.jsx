import React from 'react';
import {
  Car,
  Calendar,
  Store,
  FileText,
  Shield,
  Star,
  TrendingUp,
  Search,
  Plus,
  ChevronRight,
  Clock,
} from 'lucide-react';

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #DFF2EB 0%, #f8f9fa 100%)',
    animation: 'fadeInUp 0.6s ease-out',
    padding: '2rem',
    fontFamily: 'Arial, sans-serif',
  },
  statGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: '1rem',
    padding: '1.5rem',
    border: '1px solid #DFF2EB',
    boxShadow: '0 4px 24px rgba(74, 98, 138, 0.1)',
    transition: 'all 0.3s ease',
  },
  quickActionSection: {
    marginTop: '2rem',
  },
  quickActionTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  quickActionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '1rem',
  },
  quickActionCard: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#fff',
    borderRadius: '1rem',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
    border: '1px solid #E2E8F0',
    cursor: 'pointer',
    transition: 'box-shadow 0.3s ease',
  },
  quickActionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
  },
  quickActionIconBox: (color) => ({
    width: '40px',
    height: '40px',
    borderRadius: '0.5rem',
    backgroundColor: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  quickActionLabel: {
    color: '#374151',
    fontWeight: 500,
  },
  // Appointment Overview styles below
  appointmentOverview: {
    marginTop: '2.5rem',
    background: '#fff',
    borderRadius: '1rem',
    padding: '2rem',
    boxShadow: '0 4px 24px rgba(74, 98, 138, 0.08)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    marginLeft: 'auto',
    marginRight: 'auto',
    border: '1px solid #DFF2EB',
  },
  appointmentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
    gap: '2rem',
    justifyContent: 'center',
  },
  appointmentCard: {
    background: '#f7fafc',
    borderRadius: '1rem',
    border: '1px solid #e5e7eb',
    padding: '2rem 1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 100,
    minHeight: 100,
    boxShadow: '0 2px 8px rgba(122, 178, 211, 0.07)',
  },
  appointmentIconBox: (bg) => ({
    background: bg,
    borderRadius: '50%',
    width: 40,
    height: 40,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1rem',
    boxShadow: '0 2px 6px 0 rgba(122, 178, 211,0.08)',
  }),
  appointmentLabel: {
    fontWeight: 600,
    fontSize: 10,
    color: '#323a47',
    marginTop: '.5rem',
    marginBottom: '0',
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  appointmentNumber: (color) => ({
    fontSize: 20,
    fontWeight: 800,
    color,
    lineHeight: 1,
    letterSpacing: 1,
    margin: 0,
  }),
};

const StatCard = ({ title, value, subtitle, icon, trend, color }) => (
  <div style={styles.statCard}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
      <div>
        <div style={styles.quickActionIconBox(color)}>{icon}</div>
        <h3 style={{ color: '#4B5563', fontSize: '0.875rem', fontWeight: 500, marginTop: '1rem' }}>{title}</h3>
        <p style={{ fontSize: '1.875rem', fontWeight: 700, color: '#111827', margin: '0.25rem 0' }}>{value}</p>
        {subtitle && <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>{subtitle}</p>}
      </div>
      {trend !== undefined && (
        <div
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '0.5rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            backgroundColor: trend > 0 ? '#D1FAE5' : '#FEE2E2',
            color: trend > 0 ? '#065F46' : '#991B1B',
          }}
        >
          {trend > 0 ? '+' : ''}
          {trend}%
        </div>
      )}
    </div>
  </div>
);

const QuickActionButton = ({ label, icon, color }) => (
  <div style={styles.quickActionCard}>
    <div style={styles.quickActionLeft}>
      <div style={styles.quickActionIconBox(color)}>{icon}</div>
      <span style={styles.quickActionLabel}>{label}</span>
    </div>
    <ChevronRight style={{ color: '#9CA3AF' }} />
  </div>
);

const AppointmentOverview = ({ completed, upcoming, pending }) => (
  <div style={styles.appointmentOverview}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
      <h2 style={{ fontWeight: 700, fontSize: 20, color: '#3a4d60', margin: 0 }}>
        Appointment Overview
      </h2>
      <button
        style={{
          color: '#3272d5',
          background: 'none',
          border: 'none',
          fontWeight: 600,
          fontSize: 15,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 6
        }}
        onClick={() => alert('View All Appointments')}
      >
        View All <ChevronRight size={17} />
      </button>
    </div>
    <div style={styles.appointmentGrid}>
      {/* Completed */}
      <div style={styles.appointmentCard}>
        <div style={styles.appointmentIconBox('#41d884')}>
          <Clock color="white" size={30} />
        </div>
        <div style={styles.appointmentNumber('#16a34a')}>{completed}</div>
        <div style={styles.appointmentLabel}>Completed</div>
      </div>
      {/* Upcoming */}
      <div style={styles.appointmentCard}>
        <div style={styles.appointmentIconBox('#4F8DFD')}>
          <Calendar color="white" size={30} />
        </div>
        <div style={styles.appointmentNumber('#2563eb')}>{upcoming}</div>
        <div style={styles.appointmentLabel}>Upcoming</div>
      </div>
      {/* Pending */}
      <div style={styles.appointmentCard}>
        <div style={styles.appointmentIconBox('#FBBF24')}>
          <Clock color="white" size={30} />
        </div>
        <div style={styles.appointmentNumber('#d97706')}>{pending}</div>
        <div style={styles.appointmentLabel}>Pending</div>
      </div>
    </div>
  </div>
);

  const dashboardStats = {
    vehicles: 3,
    activeListings: 2,
    totalAppointments: 8,
    completedAppointments: 5,
    upcomingAppointments: 2,
    pendingAppointments: 1,
    insuranceClaims: 1,
    totalEarnings: 45000,
    avgRating: 4.8,
  };

  const quickActions = [
    { label: 'Add New Vehicle', icon: <Plus color="white" size={20} />, color: '#3B82F6' },
    { label: 'Book Appointment', icon: <Calendar color="white" size={20} />, color: '#8B5CF6' },
    { label: 'Request Valuation', icon: <TrendingUp color="white" size={20} />, color: '#6366F1' },
    { label: 'Vehicle History Report', icon: <FileText color="white" size={20} />, color: '#14B8A6' },
    { label: 'Find Service Providers', icon: <Search color="white" size={20} />, color: '#10B981' },
    { label: 'List Vehicle for Sale', icon: <Store color="white" size={20} />, color: '#F97316' },
    { label: 'Claim Insurance', icon: <Shield color="white" size={20} />, color: '#EF4444' },
    { label: 'Rate Service Provider', icon: <Star color="white" size={20} />, color: '#FACC15' },
  ];

  const activities = [
  { status: 'completed', message: 'Service appointment completed for Honda Civic', time: '2 hours ago' },
  { status: 'new', message: 'New inquiry for your Outlander listing', time: '5 hours ago' },
  { status: 'updated', message: 'Vehicle valuation updated for Premio', time: '1 day ago' },
  { status: 'completed', message: 'Insurance claim processed successfully', time: '2 days ago' },
];

const statusDotColor = (status) => {
  switch (status) {
    case 'completed': return '#22c55e'; // green
    case 'new': return '#3b82f6';      // blue
    case 'updated': return '#facc15';  // yellow
    default: return '#9ca3af';         // gray
  }
};

const RecentActivity = () => (
  <div style={{
    marginTop: '2.5rem',
    background: '#fff',
    borderRadius: '1rem',
    padding: '2rem 2rem 1.5rem 2rem',
    boxShadow: '0 4px 24px rgba(74, 98, 138, 0.08)',
    border: '1px solid #DFF2EB',
    minWidth: 340,
    maxWidth: 700,
    marginLeft: 'auto',
    marginRight: 'auto',
    position: 'relative',
  }}>
    
    {/* Title row */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
      <span style={{ fontWeight: 700, fontSize: 22, color: '#1a2637' }}>Recent Activity</span>
      {/* Refresh/history icon */}
      <Clock style={{ color: '#8893a6', opacity: 0.8 }} size={22} />
    </div>
    {/* Activity List */}
    <div style={{ marginTop: 12, marginBottom: 20 }}>
      {activities.map((a, idx) => (
        <div key={idx} style={{
          display: 'flex', alignItems: 'flex-start', marginBottom: 22, gap: 13
        }}>
          {/* Colored dot */}
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: statusDotColor(a.status),
            marginTop: 6,
            flexShrink: 0
          }} />
          <div>
            <div style={{
              color: '#182737', fontWeight: 600, fontSize: 17,
              marginBottom: 2, lineHeight: 1
            }}>
              {a.message}
            </div>
            <div style={{
              fontSize: 13, color: '#8491af', marginTop: 1, fontWeight: 400
            }}>
              {a.time}
            </div>
          </div>
        </div>
      ))}
    </div>
    {/* View all link */}
    <div
      style={{
        width: '100%', textAlign: 'center',
        marginTop: 24
      }}
    >
      <a
        href="#"
        style={{
          color: '#2563eb', fontWeight: 600, fontSize: 18,
          textDecoration: 'none', letterSpacing: '0.01em',
          transition: 'color 0.18s', cursor: 'pointer'
        }}
        onClick={e => { e.preventDefault(); alert('View All Activities'); }}
      >
        View All Activities
      </a>
    </div>
  </div>
);

const UserDashboard = () => {
  const dashboardStats = {
    vehicles: 3,
    activeListings: 2,
    totalAppointments: 8,
    completedAppointments: 5,
    upcomingAppointments: 2,
    pendingAppointments: 1,
    insuranceClaims: 1,
    totalEarnings: 45000,
    avgRating: 4.8,
  };

  const quickActions = [
    { label: 'Add New Vehicle', icon: <Plus color="white" size={20} />, color: '#3B82F6' },
    { label: 'Book Appointment', icon: <Calendar color="white" size={20} />, color: '#8B5CF6' },
    { label: 'Request Valuation', icon: <TrendingUp color="white" size={20} />, color: '#6366F1' },
    { label: 'Vehicle History Report', icon: <FileText color="white" size={20} />, color: '#14B8A6' },
    { label: 'Find Service Providers', icon: <Search color="white" size={20} />, color: '#10B981' },
    { label: 'List Vehicle for Sale', icon: <Store color="white" size={20} />, color: '#F97316' },
    { label: 'Claim Insurance', icon: <Shield color="white" size={20} />, color: '#EF4444' },
    { label: 'Rate Service Provider', icon: <Star color="white" size={20} />, color: '#FACC15' },
  ];

return (
    <div style={styles.page}>
      {/* Stat Cards */}
      <div style={styles.statGrid}>
        <StatCard
          title="My Vehicles"
          value={dashboardStats.vehicles}
          subtitle="Active vehicles"
          icon={<Car size={24} color="white" />}
          color="#3B82F6"
          trend={12}
        />
        <StatCard
          title="Active Listings"
          value={dashboardStats.activeListings}
          subtitle={`${dashboardStats.totalEarnings.toLocaleString()} LKR potential`}
          icon={<Store size={24} color="white" />}
          color="#10B981"
          trend={8}
        />
        <StatCard
          title="Appointments"
          value={dashboardStats.upcomingAppointments}
          subtitle={`${dashboardStats.completedAppointments} completed this month`}
          icon={<Calendar size={24} color="white" />}
          color="#8B5CF6"
          trend={-5}
        />
        <StatCard
          title="Service Rating"
          value={dashboardStats.avgRating}
          subtitle="Average rating received"
          icon={<Star size={24} color="white" />}
          color="#FACC15"
          trend={15}
        />
      </div>

      {/* Quick Actions */}
      <div style={styles.quickActionSection}>
        <h2 style={styles.quickActionTitle}>Quick Actions</h2>
        <div style={styles.quickActionsGrid}>
          {quickActions.map((action, idx) => (
            <QuickActionButton
              key={idx}
              label={action.label}
              icon={action.icon}
              color={action.color}
            />
          ))}
        </div>
      </div>

      {/* Appointment Overview */}
      <AppointmentOverview
        completed={dashboardStats.completedAppointments}
        upcoming={dashboardStats.upcomingAppointments}
        pending={dashboardStats.pendingAppointments}
      />

      {/* Recent Activity (NEW) */}
      <RecentActivity />
    </div>
  );
};

export default UserDashboard;
