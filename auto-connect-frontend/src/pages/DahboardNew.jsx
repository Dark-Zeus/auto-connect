import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Avatar,
  Chip,
  Card,
  CardContent,
} from "@mui/material";
import {
  Logout as LogoutIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import { performLogout } from "../utils/logout.util";

import { UserContext } from "../contexts/UserContext";
import "./Dashboard.css";

const DashboardNew = () => {
  const navigate = useNavigate();
  const { userContext, setUserContext } = useContext(UserContext);

  const handleLogout = async () => {
    await performLogout(setUserContext, navigate);
  };

  const dashboardCards = [
    {
      title: "Profile",
      description: "Manage your account settings and personal information",
      icon: <PersonIcon />,
      color: "#7AB2D3",
    },
    {
      title: "Settings",
      description: "Configure your preferences and application settings",
      icon: <SettingsIcon />,
      color: "#4A628A",
    },
    {
      title: "Notifications",
      description: "View and manage your notifications",
      icon: <NotificationsIcon />,
      color: "#B9E5E8",
    },
  ];

  return (
    <div className="dashboard-page">
      {/* Header */}
      <Box className="dashboard-header">
        <Container maxWidth="lg">
          <Box className="header-content">
            <Box className="header-left">
              <DashboardIcon className="dashboard-icon" />
              <Typography variant="h4" className="dashboard-title">
                Dashboard
              </Typography>
            </Box>
            <Box className="header-right">
              <Box className="user-info">
                <Avatar className="user-avatar">
                  {userContext?.firstName?.charAt(0) ||
                    userContext?.email?.charAt(0) ||
                    "U"}
                </Avatar>
                <Box className="user-details">
                  <Typography variant="subtitle1" className="user-name">
                    {userContext?.firstName && userContext?.lastName
                      ? `${userContext.firstName} ${userContext.lastName}`
                      : userContext?.email || "User"}
                  </Typography>
                  <Chip
                    label={userContext?.role || "User"}
                    size="small"
                    className="user-role"
                  />
                </Box>
              </Box>
              <Button
                variant="outlined"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                className="logout-button"
              >
                Logout
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" className="dashboard-content">
        <Box className="welcome-section">
          <Paper className="welcome-card">
            <Typography variant="h5" className="welcome-title">
              Welcome back, {userContext?.firstName || "User"}! 👋
            </Typography>
            <Typography variant="body1" className="welcome-text">
              You have successfully logged into your AutoConnect dashboard. From
              here you can manage your account, view your activity, and access
              all available features.
            </Typography>
          </Paper>
        </Box>

        <Box className="dashboard-grid">
          <Grid container spacing={3}>
            {dashboardCards.map((card, index) => (
              <Grid item xs={12} md={4} key={index}>
                <Card className="dashboard-card">
                  <CardContent className="card-content">
                    <Box
                      className="card-icon"
                      sx={{ backgroundColor: card.color }}
                    >
                      {card.icon}
                    </Box>
                    <Typography variant="h6" className="card-title">
                      {card.title}
                    </Typography>
                    <Typography variant="body2" className="card-description">
                      {card.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      className="card-button"
                      sx={{ borderColor: card.color, color: card.color }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Box className="stats-section">
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Paper className="stat-card">
                <Typography variant="h3" className="stat-number">
                  24/7
                </Typography>
                <Typography variant="body1" className="stat-label">
                  System Uptime
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className="stat-card">
                <Typography variant="h3" className="stat-number">
                  100%
                </Typography>
                <Typography variant="body1" className="stat-label">
                  Secure Access
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper className="stat-card">
                <Typography variant="h3" className="stat-number">
                  ∞
                </Typography>
                <Typography variant="body1" className="stat-label">
                  Possibilities
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </div>
  );
};

export default DashboardNew;
