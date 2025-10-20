import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Grid,
  Button,
  Chip,
  Box,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Container,
  IconButton,
  Tooltip,
  Badge,
  Avatar,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
// Custom Timeline components using Material-UI
import {
  DirectionsCar as CarIcon,
  History as HistoryIcon,
  Build as BuildIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  Assignment as AssignmentIcon,
  AttachMoney as AttachMoneyIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
  Print as PrintIcon,
  Info as InfoIcon,
  Download as DownloadIcon,
  FilterList as FilterListIcon,
  Search as SearchIcon,
  Timeline as TimelineIcon,
  LocationOn as LocationOnIcon,
  Speed as SpeedIcon,
  LocalGasStation as LocalGasStationIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  TrendingUp as TrendingUpIcon,
} from "@mui/icons-material";
import vehicleHistoryAPI from "@services/vehicleHistoryApiService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const VehicleHistoryPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicleHistory, setVehicleHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // Load user's vehicles on component mount
  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    try {
      setLoading(true);
      const response = await vehicleHistoryAPI.getOwnerVehicles();
      setVehicles(response.data.vehicles);
    } catch (error) {
      setError("Failed to load vehicles. Please try again.");
      console.error("Error loading vehicles:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadVehicleHistory = async (vehicleId) => {
    try {
      setHistoryLoading(true);
      const response = await vehicleHistoryAPI.getVehicleCompleteHistory(
        vehicleId
      );
      setVehicleHistory(response.data);
    } catch (error) {
      setError("Failed to load vehicle history. Please try again.");
      console.error("Error loading vehicle history:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleHistory(null);
    loadVehicleHistory(vehicle.id);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return `LKR ${amount.toLocaleString()}`;
  };

  const getStatusColor = (status) => {
    const colorMap = {
      COMPLETED: "success",
      IN_PROGRESS: "warning",
      CONFIRMED: "info",
      PENDING: "default",
      CANCELLED: "error",
      REJECTED: "error",
    };
    return colorMap[status] || "default";
  };

  const handleDownloadPDF = async () => {
    if (!vehicleHistory) return;

    setDownloadingPDF(true);
    try {
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;

      // Header
      pdf.setFillColor(74, 98, 138);
      pdf.rect(0, 0, pageWidth, 40, "F");

      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(24);
      pdf.setFont("helvetica", "bold");
      pdf.text("Vehicle History Report", pageWidth / 2, 20, {
        align: "center",
      });

      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(
        `Generated on: ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        30,
        { align: "center" }
      );

      yPosition = 50;

      // Vehicle Information Section
      pdf.setTextColor(44, 62, 80);
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Vehicle Information", 15, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const vehicleInfo = [
        `Registration Number: ${
          vehicleHistory.vehicle?.registrationNumber || "N/A"
        }`,
        `Make: ${vehicleHistory.vehicle?.make || "N/A"}`,
        `Model: ${vehicleHistory.vehicle?.model || "N/A"}`,
        `Year: ${vehicleHistory.vehicle?.year || "N/A"}`,
        `Engine Number: ${vehicleHistory.vehicle?.engineNumber || "N/A"}`,
        `Chassis Number: ${vehicleHistory.vehicle?.chassisNumber || "N/A"}`,
      ];

      vehicleInfo.forEach((info) => {
        pdf.text(info, 15, yPosition);
        yPosition += 7;
      });

      yPosition += 5;

      // Statistics Section
      pdf.setFontSize(16);
      pdf.setFont("helvetica", "bold");
      pdf.text("Service Statistics", 15, yPosition);
      yPosition += 10;

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const statistics = [
        `Total Services: ${vehicleHistory.statistics?.totalServices || 0}`,
        `Total Service Cost: ${formatCurrency(
          vehicleHistory.statistics?.totalServiceCost
        )}`,
        `Average Service Cost: ${formatCurrency(
          vehicleHistory.statistics?.averageServiceCost
        )}`,
        `Average Rating: ${vehicleHistory.statistics?.averageRating || "N/A"}`,
        `Last Service Date: ${formatDate(
          vehicleHistory.statistics?.lastServiceDate
        )}`,
      ];

      statistics.forEach((stat) => {
        pdf.text(stat, 15, yPosition);
        yPosition += 7;
      });

      yPosition += 10;

      // Service History Section
      if (
        vehicleHistory.completeHistory &&
        vehicleHistory.completeHistory.length > 0
      ) {
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("Complete Service History", 15, yPosition);
        yPosition += 10;

        vehicleHistory.completeHistory.forEach((historyItem, index) => {
          // Check if we need a new page
          if (yPosition > pageHeight - 40) {
            pdf.addPage();
            yPosition = 20;
          }

          pdf.setFillColor(223, 242, 235);
          pdf.rect(10, yPosition - 5, pageWidth - 20, 35, "F");

          pdf.setFontSize(12);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(44, 62, 80);

          let title = "";
          if (historyItem.type === "registration") {
            title = "Vehicle Registration";
          } else if (historyItem.type === "service") {
            title = historyItem.description || "Service";
          } else if (historyItem.type === "accident") {
            title = historyItem.description || "Accident";
          }

          pdf.text(title, 15, yPosition);
          yPosition += 7;

          pdf.setFontSize(10);
          pdf.setFont("helvetica", "normal");
          pdf.text(`Date: ${formatDate(historyItem.date)}`, 15, yPosition);

          if (historyItem.status) {
            pdf.text(`Status: ${historyItem.status}`, 80, yPosition);
          }

          if (historyItem.cost > 0) {
            pdf.text(
              `Cost: ${formatCurrency(historyItem.cost)}`,
              140,
              yPosition
            );
          }

          yPosition += 7;

          if (historyItem.serviceCenter) {
            pdf.text(
              `Service Center: ${historyItem.serviceCenter}`,
              15,
              yPosition
            );
            yPosition += 7;
          }

          yPosition += 10;
        });
      }

      // Footer
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(9);
        pdf.setTextColor(108, 117, 125);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
        pdf.text(
          "Generated by Auto-Connect Vehicle Management System",
          pageWidth / 2,
          pageHeight - 5,
          { align: "center" }
        );
      }

      // Save the PDF
      const fileName = `Vehicle_History_${
        vehicleHistory.vehicle?.registrationNumber || "Report"
      }_${new Date().toLocaleDateString().replace(/\//g, "-")}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setDownloadingPDF(false);
    }
  };

  const renderVehicleSelection = () => (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Enhanced Hero Header Section */}
      <Box
        sx={{
          textAlign: "center",
          mb: 6,
          background: "linear-gradient(135deg, #7AB2D3 0%, #4A628A 100%)",
          borderRadius: 4,
          py: 6,
          px: { xs: 3, md: 5 },
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(74, 98, 138, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        {/* Enhanced Decorative Background Elements */}
        <Box
          sx={{
            position: "absolute",
            top: -30,
            right: -30,
            width: 140,
            height: 140,
            bgcolor: "#DFF2EB",
            borderRadius: "50%",
            opacity: 0.15,
            animation: "pulse 3s ease-in-out infinite",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -40,
            left: -40,
            width: 160,
            height: 160,
            bgcolor: "#B9E5E8",
            borderRadius: "50%",
            opacity: 0.15,
            animation: "pulse 3s ease-in-out infinite 1.5s",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            right: "8%",
            width: 100,
            height: 100,
            bgcolor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "50%",
            transform: "translateY(-50%)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: "20%",
            left: "12%",
            width: 60,
            height: 60,
            bgcolor: "rgba(255, 255, 255, 0.08)",
            borderRadius: "50%",
          }}
        />

        <Avatar
          sx={{
            width: 90,
            height: 90,
            bgcolor: "rgba(255, 255, 255, 0.25)",
            mx: "auto",
            mb: 3,
            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
            border: "3px solid rgba(255, 255, 255, 0.35)",
            transition: "all 0.3s ease",
            position: "relative",
            zIndex: 1,
            "&:hover": {
              transform: "scale(1.08)",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.25)",
            },
          }}
        >
          <CarIcon sx={{ fontSize: 48, color: "white" }} />
        </Avatar>

        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 800,
            color: "white",
            mb: 2,
            textShadow: "0 3px 10px rgba(0, 0, 0, 0.25)",
            letterSpacing: "-0.5px",
            fontSize: { xs: "1.85rem", md: "2.5rem" },
            position: "relative",
            zIndex: 1,
          }}
        >
          My Vehicle Fleet
        </Typography>

        <Typography
          variant="h6"
          sx={{
            color: "rgba(255, 255, 255, 0.95)",
            maxWidth: 640,
            mx: "auto",
            lineHeight: 1.65,
            mb: 4,
            textShadow: "0 2px 5px rgba(0, 0, 0, 0.18)",
            fontSize: { xs: "0.95rem", md: "1.1rem" },
            fontWeight: 400,
            px: 2,
            position: "relative",
            zIndex: 1,
          }}
        >
          Monitor your vehicles' complete lifecycle from registration to
          maintenance history
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 2.5,
            flexWrap: "wrap",
            position: "relative",
            zIndex: 1,
          }}
        >
          <Chip
            icon={<CarIcon />}
            label={`${vehicles.length} Registered Vehicle${
              vehicles.length !== 1 ? "s" : ""
            }`}
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.95)",
              color: "#4A628A",
              fontWeight: 700,
              px: 2.5,
              py: 2.25,
              height: "auto",
              fontSize: "0.95rem",
              border: "2px solid rgba(255, 255, 255, 0.45)",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.18)",
              transition: "all 0.3s ease",
              "& .MuiChip-icon": {
                color: "#4A628A",
                fontSize: 22,
              },
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 18px rgba(0, 0, 0, 0.22)",
                bgcolor: "white",
              },
            }}
          />
          <Chip
            icon={<HistoryIcon />}
            label="Full Service History"
            sx={{
              bgcolor: "rgba(255, 255, 255, 0.95)",
              color: "#27ae60",
              fontWeight: 700,
              px: 2.5,
              py: 2.25,
              height: "auto",
              fontSize: "0.95rem",
              boxShadow: "0 4px 14px rgba(0, 0, 0, 0.18)",
              transition: "all 0.3s ease",
              border: "2px solid rgba(255, 255, 255, 0.45)",
              "& .MuiChip-icon": {
                color: "#27ae60",
                fontSize: 22,
              },
              "&:hover": {
                transform: "translateY(-2px)",
                boxShadow: "0 6px 18px rgba(0, 0, 0, 0.22)",
                bgcolor: "white",
              },
            }}
          />
        </Box>
      </Box>

      {/* Enhanced Search Section */}
      <Box
        sx={{
          mb: 6,
          display: "flex",
          justifyContent: "center",
          px: { xs: 2, md: 0 },
        }}
      >
        <TextField
          placeholder="Search by registration number, make, or model..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{
            width: { xs: "100%", md: 560 },
            "& .MuiOutlinedInput-root": {
              bgcolor: "white",
              borderRadius: 3.5,
              boxShadow: "0 3px 16px rgba(74, 98, 138, 0.12)",
              border: "2px solid transparent",
              transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              py: 0.25,
              "& fieldset": {
                border: "none",
              },
              "&:hover": {
                boxShadow: "0 5px 22px rgba(74, 98, 138, 0.18)",
                transform: "translateY(-1px)",
                border: "2px solid #B9E5E8",
              },
              "&.Mui-focused": {
                boxShadow: "0 6px 28px rgba(74, 98, 138, 0.25)",
                transform: "translateY(-1px)",
                border: "2px solid #7AB2D3",
                "& .search-icon-box": {
                  bgcolor: "#7AB2D3",
                  "& .MuiSvgIcon-root": {
                    color: "white",
                  },
                },
              },
            },
            "& .MuiInputBase-input": {
              fontSize: "0.95rem",
              fontWeight: 500,
              color: "#2c3e50",
              py: 1.5,
              "&::placeholder": {
                color: "#95a5a6",
                opacity: 1,
                fontWeight: 400,
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Box
                  className="search-icon-box"
                  sx={{
                    bgcolor: "#DFF2EB",
                    borderRadius: 2,
                    p: 0.85,
                    display: "flex",
                    alignItems: "center",
                    mr: 1.25,
                    transition: "all 0.35s ease",
                  }}
                >
                  <SearchIcon sx={{ color: "#4A628A", fontSize: 22 }} />
                </Box>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Vehicle Cards Grid - Exactly 4 per row */}
      <Grid container spacing={4}>
        {vehicles
          .filter(
            (vehicle) =>
              searchTerm === "" ||
              vehicle.registrationNumber
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
              (vehicle.make &&
                vehicle.make
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())) ||
              (vehicle.model &&
                vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()))
          )
          .map((vehicle) => (
            <Grid item xs={12} sm={6} md={6} lg={3} key={vehicle.id}>
              <Card
                sx={{
                  cursor: "pointer",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                  borderRadius: 3.5,
                  overflow: "hidden",
                  border: "2px solid #e9ecef",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                  background: "white",
                  "&:hover": {
                    transform: "translateY(-6px) scale(1.015)",
                    boxShadow: "0 16px 36px rgba(74, 98, 138, 0.22)",
                    borderColor: "#B9E5E8",
                    "& .vehicle-header": {
                      background:
                        "linear-gradient(135deg, #7AB2D3 0%, #4A628A 100%)",
                    },
                    "& .vehicle-icon": {
                      transform: "scale(1.12) rotate(3deg)",
                      color: "white",
                    },
                    "& .view-history-btn": {
                      bgcolor: "#7AB2D3",
                      transform: "translateY(-1px)",
                      boxShadow: "0 6px 18px rgba(74, 98, 138, 0.35)",
                    },
                    "& .info-box": {
                      bgcolor: "#e8f4fd",
                      borderLeftColor: "#7AB2D3",
                    },
                  },
                }}
                onClick={() => handleVehicleSelect(vehicle)}
              >
                {/* Vehicle Header with Badge */}
                <Box
                  className="vehicle-header"
                  sx={{
                    height: 130,
                    background:
                      "linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 50%, #DFF2EB 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    transition: "all 0.35s ease",
                    overflow: "hidden",
                  }}
                >
                  {/* Decorative elements */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -25,
                      right: -25,
                      width: 90,
                      height: 90,
                      bgcolor: "#B9E5E8",
                      borderRadius: "50%",
                      opacity: 0.4,
                      transition: "all 0.35s ease",
                    }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: -18,
                      left: -18,
                      width: 75,
                      height: 75,
                      bgcolor: "#7AB2D3",
                      borderRadius: "50%",
                      opacity: 0.35,
                      transition: "all 0.35s ease",
                    }}
                  />

                  <CarIcon
                    className="vehicle-icon"
                    sx={{
                      fontSize: 52,
                      color: "#4A628A",
                      transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
                      zIndex: 1,
                    }}
                  />
                </Box>

                <CardContent
                  sx={{
                    p: 3,
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  {/* Registration Number */}
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      fontWeight: 700,
                      color: "#2c3e50",
                      mb: 1,
                      fontSize: "1.3rem",
                    }}
                  >
                    {vehicle.registrationNumber}
                  </Typography>
                  <br />
                  <br />

                  {/* Vehicle Details */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#495057",
                      mb: 2.5,
                      fontWeight: 600,
                      fontSize: "1.05rem",
                    }}
                  >
                    {vehicle.year ? `${vehicle.year} ` : ""}
                    {vehicle.make || "Unknown"} {vehicle.model || "Model"}
                  </Typography>

                  {/* Vehicle Information - Compact & Elegant */}
                  <Stack spacing={1.75} sx={{ mb: 3, flexGrow: 1 }}>
                    <Box
                      className="info-box"
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        p: 1.5,
                        bgcolor: "#f8f9fa",
                        borderRadius: 2,
                        borderLeft: "3px solid #7AB2D3",
                        transition: "all 0.25s ease",
                      }}
                    >
                      <SettingsIcon
                        sx={{
                          fontSize: 19,
                          color: "#7AB2D3",
                          mt: 0.2,
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#6c757d",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            fontSize: "0.65rem",
                            display: "block",
                            mb: 0.3,
                          }}
                        >
                          Engine Number
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#2c3e50",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                          }}
                        >
                          {vehicle.engineNumber || "N/A"}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      className="info-box"
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        p: 1.5,
                        bgcolor: "#f8f9fa",
                        borderRadius: 2,
                        borderLeft: "3px solid #4A628A",
                        transition: "all 0.25s ease",
                      }}
                    >
                      <AssignmentIcon
                        sx={{
                          fontSize: 19,
                          color: "#4A628A",
                          mt: 0.2,
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#6c757d",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            fontSize: "0.65rem",
                            display: "block",
                            mb: 0.3,
                          }}
                        >
                          Chassis Number
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#2c3e50",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                          }}
                        >
                          {vehicle.chassisNumber || "N/A"}
                        </Typography>
                      </Box>
                    </Box>

                    <Box
                      className="info-box"
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1.5,
                        p: 1.5,
                        bgcolor: "#DFF2EB",
                        borderRadius: 2,
                        borderLeft: "3px solid #27ae60",
                        transition: "all 0.25s ease",
                      }}
                    >
                      <CalendarIcon
                        sx={{
                          fontSize: 19,
                          color: "#27ae60",
                          mt: 0.2,
                        }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#6c757d",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: 0.5,
                            fontSize: "0.65rem",
                            display: "block",
                            mb: 0.3,
                          }}
                        >
                          Registered Date
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "#2c3e50",
                            fontWeight: 600,
                            fontSize: "0.85rem",
                          }}
                        >
                          {formatDate(vehicle.registeredDate)}
                        </Typography>
                      </Box>
                    </Box>
                  </Stack>

                  {/* Action Button - Enhanced */}
                  <Button
                    className="view-history-btn"
                    variant="contained"
                    fullWidth
                    startIcon={<HistoryIcon />}
                    sx={{
                      bgcolor: "#4A628A",
                      color: "white",
                      borderRadius: 2.5,
                      py: 1.5,
                      fontSize: "0.95rem",
                      fontWeight: 700,
                      textTransform: "none",
                      boxShadow: "0 6px 16px rgba(74, 98, 138, 0.25)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: "#7AB2D3",
                        boxShadow: "0 8px 20px rgba(74, 98, 138, 0.35)",
                        transform: "translateY(-2px)",
                      },
                    }}
                  >
                    View Complete History
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>

      {/* Empty State */}
      {vehicles.length === 0 && (
        <Box
          sx={{
            textAlign: "center",
            py: 10,
            px: 4,
            bgcolor: "white",
            borderRadius: 3.5,
            border: "2px dashed #B9E5E8",
            boxShadow: "0 4px 16px rgba(74, 98, 138, 0.08)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative background elements */}
          <Box
            sx={{
              position: "absolute",
              top: -30,
              right: -30,
              width: 120,
              height: 120,
              bgcolor: "#DFF2EB",
              borderRadius: "50%",
              opacity: 0.6,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -40,
              left: -40,
              width: 140,
              height: 140,
              bgcolor: "#B9E5E8",
              borderRadius: "50%",
              opacity: 0.5,
            }}
          />

          <Box
            sx={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box
              sx={{
                bgcolor: "linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 100%)",
                borderRadius: "50%",
                width: 100,
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
                boxShadow: "0 6px 20px rgba(122, 178, 211, 0.25)",
              }}
            >
              <CarIcon
                sx={{
                  fontSize: 56,
                  color: "#4A628A",
                }}
              />
            </Box>
            <Typography
              variant="h4"
              sx={{
                color: "#2c3e50",
                fontWeight: 700,
                mb: 2,
              }}
            >
              No Vehicles Found
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6c757d",
                maxWidth: 420,
                mx: "auto",
                lineHeight: 1.65,
                fontSize: "1.05rem",
              }}
            >
              You don't have any vehicles registered in the system yet. Register
              your first vehicle to start tracking its complete service history
              and maintenance records.
            </Typography>
          </Box>
        </Box>
      )}
    </Container>
  );

  const getHistoryTypeIcon = (type) => {
    switch (type) {
      case "registration":
        return <AssignmentIcon />;
      case "service":
        return <BuildIcon />;
      case "accident":
        return <WarningIcon />;
      default:
        return <HistoryIcon />;
    }
  };

  const getHistoryTypeColor = (type, status) => {
    switch (type) {
      case "registration":
        return "primary";
      case "service":
        return status === "COMPLETED"
          ? "success"
          : status === "IN_PROGRESS"
          ? "warning"
          : "info";
      case "accident":
        return "error";
      default:
        return "default";
    }
  };

  const filteredHistory =
    vehicleHistory?.completeHistory?.filter((item) => {
      if (filterType === "all") return true;
      return item.type === filterType;
    }) || [];

  const renderVehicleHistory = () => {
    if (!vehicleHistory) return null;

    return (
      <Container maxWidth="lg" sx={{ py: 5 }}>
        {/* Enhanced Header Section with Better Visual Hierarchy */}
        <Box
          sx={{
            background:
              "linear-gradient(135deg, rgba(122, 178, 211, 0.08) 0%, rgba(223, 242, 235, 0.12) 100%)",
            borderRadius: 4,
            p: { xs: 3, md: 5 },
            mb: 5,
            boxShadow: "0 8px 32px rgba(74, 98, 138, 0.12)",
            border: "1px solid rgba(122, 178, 211, 0.2)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Decorative Background Elements */}
          <Box
            sx={{
              position: "absolute",
              top: -40,
              right: -40,
              width: 150,
              height: 150,
              bgcolor: "#7AB2D3",
              borderRadius: "50%",
              opacity: 0.06,
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: -30,
              left: -30,
              width: 120,
              height: 120,
              bgcolor: "#4A628A",
              borderRadius: "50%",
              opacity: 0.05,
            }}
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              gap: 4,
              position: "relative",
              zIndex: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
              <IconButton
                onClick={() => {
                  setSelectedVehicle(null);
                  setVehicleHistory(null);
                }}
                sx={{
                  bgcolor: "white",
                  color: "#4A628A",
                  width: 56,
                  height: 56,
                  boxShadow: "0 4px 16px rgba(74, 98, 138, 0.15)",
                  border: "2px solid rgba(122, 178, 211, 0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "#4A628A",
                    color: "white",
                    transform: "translateX(-4px)",
                    boxShadow: "0 6px 20px rgba(74, 98, 138, 0.25)",
                  },
                }}
              >
                <ArrowBackIcon sx={{ fontSize: 24 }} />
              </IconButton>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    color: "#2c3e50",
                    mb: 1.5,
                    letterSpacing: "-0.5px",
                    lineHeight: 1.2,
                  }}
                >
                  Vehicle History
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    icon={<CarIcon />}
                    label={vehicleHistory?.vehicle?.registrationNumber}
                    sx={{
                      bgcolor: "#4A628A",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "0.95rem",
                      height: 36,
                      px: 1.5,
                      boxShadow: "0 2px 8px rgba(74, 98, 138, 0.3)",
                      "& .MuiChip-icon": {
                        color: "white",
                      },
                    }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "#495057",
                      fontWeight: 600,
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                    }}
                  >
                    {vehicleHistory?.vehicle?.year}{" "}
                    {vehicleHistory?.vehicle?.make}{" "}
                    {vehicleHistory?.vehicle?.model}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                alignSelf: { xs: "flex-end", md: "center" },
              }}
            >
              <Tooltip title="Print History" arrow placement="top">
                <IconButton
                  onClick={() => window.print()}
                  sx={{
                    bgcolor: "white",
                    color: "#4A628A",
                    width: 48,
                    height: 48,
                    boxShadow: "0 4px 12px rgba(74, 98, 138, 0.12)",
                    border: "1px solid rgba(122, 178, 211, 0.2)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      bgcolor: "#DFF2EB",
                      transform: "translateY(-2px)",
                      boxShadow: "0 6px 16px rgba(74, 98, 138, 0.2)",
                    },
                  }}
                >
                  <PrintIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                title={
                  downloadingPDF ? "Generating PDF..." : "Download PDF Report"
                }
                arrow
                placement="top"
              >
                <span>
                  <IconButton
                    onClick={handleDownloadPDF}
                    disabled={downloadingPDF}
                    sx={{
                      bgcolor: downloadingPDF ? "#e0e0e0" : "#4A628A",
                      color: "white",
                      width: 48,
                      height: 48,
                      boxShadow: downloadingPDF
                        ? "none"
                        : "0 4px 12px rgba(74, 98, 138, 0.3)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        bgcolor: downloadingPDF ? "#e0e0e0" : "#7AB2D3",
                        transform: downloadingPDF ? "none" : "translateY(-2px)",
                        boxShadow: downloadingPDF
                          ? "none"
                          : "0 6px 16px rgba(74, 98, 138, 0.4)",
                      },
                      "&.Mui-disabled": {
                        bgcolor: "#e0e0e0",
                        color: "#9e9e9e",
                      },
                    }}
                  >
                    {downloadingPDF ? (
                      <CircularProgress size={24} sx={{ color: "#9e9e9e" }} />
                    ) : (
                      <DownloadIcon />
                    )}
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          </Box>
        </Box>

        {/* Modern Overview Statistics Dashboard */}
        <Grid container spacing={3} sx={{ mb: 4, justifyContent: "center" }}>
          <Grid item xs={12} md={10}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #6B8FB0 0%, #8BB4D3 100%)",
                color: "white",
                borderRadius: 3.5,
                boxShadow: "0 6px 24px rgba(107, 143, 176, 0.25)",
                overflow: "hidden",
                position: "relative",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 32px rgba(107, 143, 176, 0.3)",
                },
              }}
            >
              {/* Decorative Element */}
              <Box
                sx={{
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.08)",
                }}
              />

              <CardContent sx={{ p: 5, position: "relative", zIndex: 1 }}>
                {/* Vehicle Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    mb: 4,
                    pb: 3.5,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.25)",
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.25)",
                      borderRadius: 2.5,
                      p: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CarIcon sx={{ fontSize: 48, color: "white" }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 800,
                        mb: 0.75,
                        textShadow: "0 2px 6px rgba(0,0,0,0.25)",
                        lineHeight: 1.2,
                        fontSize: "1.65rem",
                      }}
                    >
                      {vehicleHistory?.vehicle?.registrationNumber}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        opacity: 0.95,
                        fontWeight: 500,
                        textShadow: "0 1px 4px rgba(0,0,0,0.18)",
                        fontSize: "1.05rem",
                      }}
                    >
                      {vehicleHistory?.vehicle?.year}{" "}
                      {vehicleHistory?.vehicle?.make}{" "}
                      {vehicleHistory?.vehicle?.model}
                    </Typography>
                  </Box>
                </Box>

                {/* Statistics Grid */}
                <Grid container spacing={3}>
                  <Grid item xs={6} md={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 3,
                        px: 2,
                        borderRadius: 2.5,
                        bgcolor: "rgba(255, 255, 255, 0.15)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.25)",
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 900,
                          mb: 1,
                          textShadow: "0 2px 6px rgba(0,0,0,0.25)",
                          fontSize: { xs: "2.25rem", md: "2.75rem" },
                          lineHeight: 1,
                        }}
                      >
                        {vehicleHistory?.statistics?.totalServices || 0}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          opacity: 0.95,
                          fontWeight: 700,
                          fontSize: "0.95rem",
                        }}
                      >
                        Total Services
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 3,
                        px: 2,
                        borderRadius: 2.5,
                        bgcolor: "rgba(255, 255, 255, 0.15)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.25)",
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 900,
                          mb: 1,
                          textShadow: "0 2px 6px rgba(0,0,0,0.25)",
                          fontSize: { xs: "1.5rem", md: "1.85rem" },
                          lineHeight: 1,
                        }}
                      >
                        {formatCurrency(
                          vehicleHistory?.statistics?.totalServiceCost
                        )}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          opacity: 0.95,
                          fontWeight: 700,
                          fontSize: "0.95rem",
                        }}
                      >
                        Total Cost
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 3,
                        px: 2,
                        borderRadius: 2.5,
                        bgcolor: "rgba(255, 255, 255, 0.15)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.25)",
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 900,
                          mb: 1,
                          textShadow: "0 2px 6px rgba(0,0,0,0.25)",
                          fontSize: { xs: "1.5rem", md: "1.85rem" },
                          lineHeight: 1,
                        }}
                      >
                        {formatCurrency(
                          vehicleHistory?.statistics?.averageServiceCost
                        )}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          opacity: 0.95,
                          fontWeight: 700,
                          fontSize: "0.95rem",
                        }}
                      >
                        Average Cost
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6} md={3}>
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 3,
                        px: 2,
                        borderRadius: 2.5,
                        bgcolor: "rgba(255, 255, 255, 0.15)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          bgcolor: "rgba(255, 255, 255, 0.25)",
                          transform: "translateY(-3px)",
                        },
                      }}
                    >
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 900,
                          mb: 1,
                          textShadow: "0 2px 6px rgba(0,0,0,0.25)",
                          fontSize: { xs: "2.25rem", md: "2.75rem" },
                          lineHeight: 1,
                        }}
                      >
                        {vehicleHistory?.statistics?.averageRating || "N/A"}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          opacity: 0.95,
                          fontWeight: 700,
                          fontSize: "0.95rem",
                        }}
                      >
                        Avg Rating
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={2}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(74, 98, 138, 0.15)",
                border: "1px solid rgba(122, 178, 211, 0.25)",
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                transition: "all 0.3s ease",
                position: "relative",
                overflow: "hidden",
                "&:hover": {
                  boxShadow: "0 8px 28px rgba(74, 98, 138, 0.2)",
                  transform: "translateY(-2px)",
                  borderColor: "#7AB2D3",
                },
              }}
            >
              {/* Top Accent */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background:
                    "linear-gradient(90deg, #6B8FB0 0%, #8BB4D3 50%, #6B8FB0 100%)",
                }}
              />

              <CardContent sx={{ p: 3.5, pt: 4 }}>
                {/* Header */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    mb: 2.5,
                    pb: 1.5,
                    borderBottom: "1px solid #e0e0e0",
                  }}
                >
                  <InfoIcon sx={{ color: "#4A628A", fontSize: 22 }} />
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 800,
                      color: "#2c3e50",
                      fontSize: "1.05rem",
                    }}
                  >
                    Vehicle Details
                  </Typography>
                </Box>

                {/* Horizontal Details */}
                <Stack spacing={2}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "#f8f9fa",
                      border: "1px solid #e0e0e0",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        bgcolor: "#DFF2EB",
                        borderColor: "#B9E5E8",
                        transform: "translateX(2px)",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#7AB2D3",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: 0.4,
                        fontSize: "0.7rem",
                      }}
                    >
                      Engine
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#2c3e50",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        fontFamily: "monospace",
                      }}
                    >
                      {vehicleHistory?.vehicle?.engineNumber}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "#f8f9fa",
                      border: "1px solid #e0e0e0",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        bgcolor: "#DFF2EB",
                        borderColor: "#B9E5E8",
                        transform: "translateX(2px)",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#4A628A",
                        fontWeight: 800,
                        textTransform: "uppercase",
                        letterSpacing: 0.4,
                        fontSize: "0.7rem",
                      }}
                    >
                      Chassis
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#2c3e50",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        fontFamily: "monospace",
                      }}
                    >
                      {vehicleHistory?.vehicle?.chassisNumber}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: "#e8f5e8",
                      border: "1px solid #d4edda",
                      transition: "all 0.25s ease",
                      "&:hover": {
                        bgcolor: "#d4edda",
                        borderColor: "#27ae60",
                        transform: "translateX(2px)",
                      },
                    }}
                  >
                    <Box
                      sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                    >
                      <CalendarIcon sx={{ fontSize: 14, color: "#27ae60" }} />
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#27ae60",
                          fontWeight: 800,
                          textTransform: "uppercase",
                          letterSpacing: 0.4,
                          fontSize: "0.7rem",
                        }}
                      >
                        Last Service
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#2c3e50",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                      }}
                    >
                      {formatDate(vehicleHistory?.statistics?.lastServiceDate)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid><br/>

        {/* Filter and Statistics Section */}
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            p: 4,
            mb: 5,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            border: "1px solid #DFF2EB",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", md: "center" },
              flexDirection: { xs: "column", md: "row" },
              gap: 3,
              mb: 4,
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  color: "#2c3e50",
                  mb: 1,
                }}
              >
                Activity Filters
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#6c757d",
                }}
              >
                Filter and view your vehicle's complete activity history
              </Typography>
            </Box>

            <FormControl
              sx={{
                minWidth: 220,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#7AB2D3",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#4A628A",
                  },
                },
              }}
            >
              <InputLabel sx={{ color: "#6c757d" }}>Filter by Type</InputLabel>
              <Select
                value={filterType}
                label="Filter by Type"
                onChange={(e) => setFilterType(e.target.value)}
                sx={{
                  color: "#2c3e50",
                  fontWeight: 500,
                }}
              >
                <MenuItem value="all">All Activities</MenuItem>
                <MenuItem value="registration">Registration</MenuItem>
                <MenuItem value="service">Services</MenuItem>
                <MenuItem value="accident">Accidents</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <Chip
              icon={<AssignmentIcon />}
              label={`${
                vehicleHistory?.completeHistory?.filter(
                  (h) => h.type === "registration"
                ).length || 0
              } Registration`}
              sx={{
                bgcolor: "#DFF2EB",
                color: "#4A628A",
                fontWeight: 600,
                fontSize: "0.85rem",
                "& .MuiChip-icon": {
                  color: "#4A628A",
                },
                "&:hover": {
                  bgcolor: "#B9E5E8",
                  transform: "translateY(-1px)",
                },
              }}
            />
            <Chip
              icon={<BuildIcon />}
              label={`${
                vehicleHistory?.completeHistory?.filter(
                  (h) => h.type === "service"
                ).length || 0
              } Services`}
              sx={{
                bgcolor: "#e8f5e8",
                color: "#27ae60",
                fontWeight: 600,
                fontSize: "0.85rem",
                "& .MuiChip-icon": {
                  color: "#27ae60",
                },
                "&:hover": {
                  bgcolor: "#d4edda",
                  transform: "translateY(-1px)",
                },
              }}
            />
            <Chip
              icon={<WarningIcon />}
              label={`${
                vehicleHistory?.completeHistory?.filter(
                  (h) => h.type === "accident"
                ).length || 0
              } Accidents`}
              sx={{
                bgcolor: "#ffeaa7",
                color: "#f39c12",
                fontWeight: 600,
                fontSize: "0.85rem",
                "& .MuiChip-icon": {
                  color: "#f39c12",
                },
                "&:hover": {
                  bgcolor: "#fdcb6e",
                  transform: "translateY(-1px)",
                },
              }}
            />
          </Box>
        </Box>

        {/* Timeline Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            mb: 4,
            p: 3,
            bgcolor: "white",
            borderRadius: 3,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            border: "1px solid #f8f9fa",
          }}
        >
          <Box
            sx={{
              bgcolor: "linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 100%)",
              borderRadius: 2,
              p: 2,
              display: "flex",
              alignItems: "center",
            }}
          >
            <TimelineIcon sx={{ color: "#4A628A", fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: "#2c3e50",
                mb: 0.5,
              }}
            >
              Complete Activity Timeline
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6c757d",
              }}
            >
              Chronological history of all vehicle activities and services
            </Typography>
          </Box>
        </Box>

        {/* Timeline Items */}
        <Box sx={{ position: "relative", pl: { xs: 0, md: 2 } }}>
          {filteredHistory.map((historyItem, index) => (
            <Box key={historyItem.id} sx={{ position: "relative", mb: 6 }}>
              {/* Timeline Connector */}
              {index < filteredHistory.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    left: { xs: 20, md: 60 },
                    top: 100,
                    width: 3,
                    height: 140,
                    background:
                      "linear-gradient(180deg, #B9E5E8 0%, #DFF2EB 100%)",
                    borderRadius: 1.5,
                    zIndex: 0,
                  }}
                />
              )}

              <Box
                sx={{
                  display: "flex",
                  gap: { xs: 2, md: 4 },
                  position: "relative",
                  zIndex: 1,
                  flexDirection: { xs: "column", md: "row" },
                }}
              >
                {/* Date and Icon Section */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "row", md: "column" },
                    alignItems: "center",
                    gap: { xs: 2, md: 1 },
                    minWidth: { xs: "auto", md: 180 },
                    textAlign: { xs: "left", md: "center" },
                  }}
                >
                  <Box
                    sx={{
                      textAlign: { xs: "left", md: "center" },
                      mb: { xs: 0, md: 2 },
                    }}
                  >
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: "#2c3e50",
                        mb: 0.5,
                      }}
                    >
                      {formatDate(historyItem.date)}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#7AB2D3",
                        fontWeight: 500,
                        fontSize: "0.85rem",
                      }}
                    >
                      {new Date(historyItem.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>

                  <Avatar
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor:
                        historyItem.type === "registration"
                          ? "#4A628A"
                          : historyItem.type === "service"
                          ? "#27ae60"
                          : historyItem.type === "accident"
                          ? "#f39c12"
                          : "#7AB2D3",
                      border: "4px solid white",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.1)",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
                      },
                    }}
                  >
                    {getHistoryTypeIcon(historyItem.type)}
                  </Avatar>
                </Box>

                {/* Content Card */}
                <Box sx={{ flexGrow: 1 }}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                      border: "1px solid #f8f9fa",
                      transition: "all 0.3s ease",
                      overflow: "hidden",
                      "&:hover": {
                        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
                        transform: "translateY(-3px)",
                        borderColor: "#B9E5E8",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          mb: 3,
                        }}
                      >
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 700,
                              color: "#2c3e50",
                              mb: 1.5,
                              lineHeight: 1.3,
                            }}
                          >
                            {historyItem.type === "registration" &&
                              "Vehicle Registration"}
                            {historyItem.type === "service" &&
                              historyItem.description}
                            {historyItem.type === "accident" &&
                              historyItem.description}
                          </Typography>

                          {historyItem.status && (
                            <Chip
                              label={historyItem.status}
                              sx={{
                                bgcolor:
                                  historyItem.status === "COMPLETED"
                                    ? "#e8f5e8"
                                    : historyItem.status === "IN_PROGRESS"
                                    ? "#ffeaa7"
                                    : historyItem.status === "PENDING"
                                    ? "#E8F4FD"
                                    : "#f8f9fa",
                                color:
                                  historyItem.status === "COMPLETED"
                                    ? "#27ae60"
                                    : historyItem.status === "IN_PROGRESS"
                                    ? "#f39c12"
                                    : historyItem.status === "PENDING"
                                    ? "#3498db"
                                    : "#6c757d",
                                fontWeight: 600,
                                fontSize: "0.8rem",
                                mb: 2,
                              }}
                            />
                          )}
                        </Box>

                        {historyItem.cost > 0 && (
                          <Box
                            sx={{
                              textAlign: "right",
                              ml: 3,
                              bgcolor: "#DFF2EB",
                              borderRadius: 2,
                              p: 2,
                              minWidth: 120,
                            }}
                          >
                            <Typography
                              variant="h5"
                              sx={{
                                fontWeight: 700,
                                color: "#4A628A",
                                mb: 0.5,
                              }}
                            >
                              {formatCurrency(historyItem.cost)}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#6c757d",
                                fontWeight: 500,
                                textTransform: "uppercase",
                                letterSpacing: 0.5,
                              }}
                            >
                              Service Cost
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      <Typography
                        variant="body1"
                        sx={{
                          color: "#6c757d",
                          lineHeight: 1.6,
                          fontSize: "0.95rem",
                        }}
                      >
                        {historyItem.type === "registration" &&
                          "Vehicle successfully registered in the system with all required documentation and verification."}
                        {historyItem.type === "service" &&
                          "Professional service completed by certified technicians with quality assurance."}
                        {historyItem.type === "accident" &&
                          "Accident details and related documentation will be available here once the system is implemented."}
                      </Typography>

                      {historyItem.type === "service" &&
                        historyItem.serviceCenter && (
                          <Box
                            sx={{
                              mt: 3,
                              p: 2,
                              bgcolor: "#f8f9fa",
                              borderRadius: 2,
                              display: "flex",
                              alignItems: "center",
                              gap: 2,
                            }}
                          >
                            <PersonIcon
                              sx={{ color: "#7AB2D3", fontSize: 20 }}
                            />
                            <Typography
                              variant="body2"
                              sx={{
                                color: "#495057",
                                fontWeight: 500,
                              }}
                            >
                              Serviced by:{" "}
                              <strong>{historyItem.serviceCenter}</strong>
                            </Typography>
                          </Box>
                        )}
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Empty State */}
        {filteredHistory.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 10,
              px: 4,
              bgcolor: "white",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "2px dashed #B9E5E8",
            }}
          >
            <Box
              sx={{
                bgcolor: "#DFF2EB",
                borderRadius: "50%",
                width: 120,
                height: 120,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <TimelineIcon sx={{ fontSize: 60, color: "#7AB2D3" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#2c3e50",
                mb: 2,
              }}
            >
              No{" "}
              {filterType === "all"
                ? "Activities"
                : filterType.charAt(0).toUpperCase() + filterType.slice(1)}{" "}
              Found
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6c757d",
                maxWidth: 500,
                mx: "auto",
                lineHeight: 1.6,
                fontSize: "1.1rem",
              }}
            >
              {filterType === "all"
                ? "This vehicle has no recorded activities yet. Activities will appear here as they occur."
                : `No ${filterType} activities found for this vehicle. Try selecting a different filter to view other activities.`}
            </Typography>
          </Box>
        )}

        {/* Accident Management Placeholder */}
        {(filterType === "all" || filterType === "accident") && (
          <Card
            sx={{
              mt: 6,
              borderRadius: 3,
              overflow: "hidden",
              border: "1px solid #ffeaa7",
              boxShadow: "0 4px 20px rgba(243, 156, 18, 0.1)",
            }}
          >
            <Box
              sx={{
                background: "linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 100%)",
                p: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  mb: 2,
                }}
              >
                <Box
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.3)",
                    borderRadius: 3,
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <WarningIcon sx={{ fontSize: 32, color: "#f39c12" }} />
                </Box>
                <Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: "#f39c12",
                      mb: 0.5,
                    }}
                  >
                    Accident Management System
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: "#f39c12",
                      opacity: 0.9,
                    }}
                  >
                    Coming Soon - Enhanced Safety Features
                  </Typography>
                </Box>
              </Box>
            </Box>
            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="body1"
                sx={{
                  color: "#495057",
                  lineHeight: 1.7,
                  fontSize: "1rem",
                  mb: 3,
                }}
              >
                Our comprehensive accident tracking system is currently under
                development. Once implemented, this powerful feature will
                provide:
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#DFF2EB",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircleIcon
                        sx={{ fontSize: 18, color: "#4A628A" }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#495057", fontWeight: 500 }}
                    >
                      Detailed accident reports and documentation
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#DFF2EB",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircleIcon
                        sx={{ fontSize: 18, color: "#4A628A" }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#495057", fontWeight: 500 }}
                    >
                      Insurance claim tracking and management
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#DFF2EB",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircleIcon
                        sx={{ fontSize: 18, color: "#4A628A" }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#495057", fontWeight: 500 }}
                    >
                      Repair records and damage assessments
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      mb: 2,
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "#DFF2EB",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CheckCircleIcon
                        sx={{ fontSize: 18, color: "#4A628A" }}
                      />
                    </Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "#495057", fontWeight: 500 }}
                    >
                      Integration with service history
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Container>
    );
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 100%)",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "white",
            borderRadius: 3,
            p: 6,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            maxWidth: 400,
          }}
        >
          <CircularProgress size={64} sx={{ color: "#4A628A", mb: 3 }} />
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: "#2c3e50",
              mb: 2,
            }}
          >
            Loading Your Vehicles
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "#6c757d",
              lineHeight: 1.6,
            }}
          >
            Fetching your vehicle information and preparing the dashboard...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 3,
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 3,
              p: 6,
              textAlign: "center",
              boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            }}
          >
            <Box
              sx={{
                bgcolor: "#fee",
                borderRadius: "50%",
                width: 80,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <WarningIcon sx={{ fontSize: 40, color: "#e74c3c" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#2c3e50",
                mb: 2,
              }}
            >
              Something went wrong
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6c757d",
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              {error}
            </Typography>
            <Button
              variant="contained"
              onClick={loadVehicles}
              size="large"
              sx={{
                bgcolor: "#4A628A",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": {
                  bgcolor: "#7AB2D3",
                },
              }}
            >
              Try Again
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #DFF2EB 0%, #B9E5E8 50%, #f8f9fa 100%)",
        py: 4,
      }}
    >
      {!selectedVehicle ? (
        renderVehicleSelection()
      ) : historyLoading ? (
        <Container maxWidth="sm">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "60vh",
              textAlign: "center",
            }}
          >
            <Box
              sx={{
                bgcolor: "white",
                borderRadius: 3,
                p: 6,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                maxWidth: 400,
              }}
            >
              <CircularProgress size={64} sx={{ color: "#4A628A", mb: 3 }} />
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  color: "#2c3e50",
                  mb: 2,
                }}
              >
                Loading Vehicle History
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: "#6c757d",
                  lineHeight: 1.6,
                }}
              >
                Gathering comprehensive data for{" "}
                <strong>{selectedVehicle?.registrationNumber}</strong>...
              </Typography>
            </Box>
          </Box>
        </Container>
      ) : vehicleHistory ? (
        renderVehicleHistory()
      ) : (
        <Container maxWidth="sm">
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              bgcolor: "white",
              borderRadius: 3,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              p: 6,
            }}
          >
            <Box
              sx={{
                bgcolor: "#E8F4FD",
                borderRadius: "50%",
                width: 80,
                height: 80,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 3,
              }}
            >
              <InfoIcon sx={{ fontSize: 40, color: "#3498db" }} />
            </Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "#2c3e50",
                mb: 2,
              }}
            >
              No History Available
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#6c757d",
                mb: 4,
                lineHeight: 1.6,
              }}
            >
              No history data is available for this vehicle yet. Activities will
              appear here as they occur.
            </Typography>
            <Button
              variant="outlined"
              onClick={() => {
                setSelectedVehicle(null);
                setVehicleHistory(null);
              }}
              startIcon={<ArrowBackIcon />}
              size="large"
              sx={{
                borderColor: "#4A628A",
                color: "#4A628A",
                px: 4,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                "&:hover": {
                  borderColor: "#7AB2D3",
                  color: "#7AB2D3",
                  bgcolor: "#DFF2EB",
                },
              }}
            >
              Back to Vehicles
            </Button>
          </Box>
        </Container>
      )}
    </Box>
  );
};

export default VehicleHistoryPage;
