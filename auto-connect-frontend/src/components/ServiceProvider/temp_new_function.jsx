  // COMPLETELY REDESIGNED Parts and Labor Step
  const renderPartsLaborStep = () => (
    <Box sx={{ py: 2 }}>
      <Alert 
        severity="info" 
        sx={{ 
          mb: 4, 
          borderRadius: "16px", 
          backgroundColor: "#e3f2fd", 
          border: "2px solid #1976d2",
          p: 3 
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#1976d2", mb: 1 }}>
          🔧 PARTS & LABOUR SECTION
        </Typography>
        <Typography variant="body1" sx={{ color: "#1976d2" }}>
          For each original service below, enter labour details and add any additional parts that were used during the service.
        </Typography>
      </Alert>

      <Stack spacing={6}>
        {formData.completedServices.map((service, serviceIndex) => (
          <Paper
            key={serviceIndex}
            elevation={4}
            sx={{
              borderRadius: "20px",
              overflow: "hidden",
              border: "3px solid #1976d2",
              boxShadow: "0 8px 32px rgba(25, 118, 210, 0.2)",
            }}
          >
            {/* Service Header */}
            <Box
              sx={{
                backgroundColor: "#1976d2",
                color: "white",
                p: 4,
                textAlign: "center",
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
                📋 {service.serviceName}
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9 }}>
                Original Service from Booking - Enter Labour & Parts Details
              </Typography>
            </Box>

            <Box sx={{ p: 4, backgroundColor: "#fafafa" }}>
              {/* LABOUR SECTION */}
              <Paper
                elevation={3}
                sx={{
                  mb: 4,
                  p: 4,
                  borderRadius: "16px",
                  backgroundColor: "#e8f5e8",
                  border: "3px solid #4caf50",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: "15px",
                      backgroundColor: "#4caf50",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 3,
                    }}
                  >
                    <PersonIcon sx={{ color: "white", fontSize: 30 }} />
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{ fontWeight: 900, color: "#2e7d32" }}
                  >
                    LABOUR DETAILS
                  </Typography>
                </Box>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: "12px", backgroundColor: "white" }}>
                      <Typography variant="h6" sx={{ mb: 2, color: "#2e7d32", fontWeight: 700 }}>
                        ⏰ Hours Worked
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        inputProps={{ min: 0, step: 0.5 }}
                        value={service.laborDetails?.hoursWorked || ""}
                        onChange={(e) => {
                          const hours = parseFloat(e.target.value) || 0;
                          const rate = parseFloat(service.laborDetails?.laborRate) || 0;
                          const totalCost = hours * rate;
                          
                          setFormData(prev => ({
                            ...prev,
                            completedServices: prev.completedServices.map((s, i) =>
                              i === serviceIndex
                                ? {
                                    ...s,
                                    laborDetails: {
                                      ...s.laborDetails,
                                      hoursWorked: hours,
                                      laborCost: totalCost
                                    }
                                  }
                                : s
                            )
                          }));
                        }}
                        placeholder="Enter hours worked"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontSize: "1.2rem",
                            fontWeight: 600,
                          },
                        }}
                      />
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: "12px", backgroundColor: "white" }}>
                      <Typography variant="h6" sx={{ mb: 2, color: "#2e7d32", fontWeight: 700 }}>
                        💰 Rate per Hour (LKR)
                      </Typography>
                      <TextField
                        fullWidth
                        type="number"
                        inputProps={{ min: 0 }}
                        value={service.laborDetails?.laborRate || ""}
                        onChange={(e) => {
                          const rate = parseFloat(e.target.value) || 0;
                          const hours = parseFloat(service.laborDetails?.hoursWorked) || 0;
                          const totalCost = hours * rate;
                          
                          setFormData(prev => ({
                            ...prev,
                            completedServices: prev.completedServices.map((s, i) =>
                              i === serviceIndex
                                ? {
                                    ...s,
                                    laborDetails: {
                                      ...s.laborDetails,
                                      laborRate: rate,
                                      laborCost: totalCost
                                    }
                                  }
                                : s
                            )
                          }));
                        }}
                        placeholder="Enter hourly rate"
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            fontSize: "1.2rem",
                            fontWeight: 600,
                          },
                        }}
                      />
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, borderRadius: "12px", backgroundColor: "#c8e6c9" }}>
                      <Typography variant="h6" sx={{ mb: 2, color: "#1b5e20", fontWeight: 700 }}>
                        🧮 Total Labour Cost
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          fontWeight: 900,
                          color: "#1b5e20",
                          textAlign: "center",
                          p: 2,
                          backgroundColor: "white",
                          borderRadius: "8px",
                        }}
                      >
                        LKR {(service.laborDetails?.laborCost || 0).toLocaleString()}
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Paper>

              {/* PARTS SECTION */}
              <Paper
                elevation={3}
                sx={{
                  mb: 4,
                  borderRadius: "16px",
                  backgroundColor: "#fff3e0",
                  border: "3px solid #ff9800",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    backgroundColor: "#ff9800",
                    color: "white",
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>
                    🔧 PARTS SECTION
                  </Typography>
                  <Typography variant="h6">
                    Add any additional parts used beyond original requirements
                  </Typography>
                </Box>

                <Box sx={{ p: 4 }}>
                  {/* Parts Required Checkbox */}
                  <Paper
                    sx={{
                      p: 3,
                      mb: 4,
                      backgroundColor: "white",
                      borderRadius: "12px",
                      border: "2px solid #ff9800",
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={service.partsRequired || false}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFormData(prev => ({
                              ...prev,
                              completedServices: prev.completedServices.map((s, i) =>
                                i === serviceIndex
                                  ? {
                                      ...s,
                                      partsRequired: isChecked,
                                      partsUsed: isChecked ? (s.partsUsed || []) : []
                                    }
                                  : s
                              )
                            }));
                          }}
                          sx={{
                            color: "#ff9800",
                            "&.Mui-checked": {
                              color: "#ff9800",
                            },
                            transform: "scale(1.5)",
                          }}
                        />
                      }
                      label={
                        <Typography
                          variant="h5"
                          sx={{ color: "#e65100", fontWeight: 800, ml: 2 }}
                        >
                          ✅ ADDITIONAL PARTS WERE USED DURING SERVICE
                        </Typography>
                      }
                    />
                    <Typography
                      variant="body1"
                      sx={{ color: "#bf360c", mt: 2, ml: 8 }}
                    >
                      Check this box if parts beyond the original service requirements were used
                    </Typography>
                  </Paper>

                  {service.partsRequired ? (
                    <>
                      {/* Add Parts Button */}
                      <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Button
                          startIcon={<AddIcon sx={{ fontSize: "2rem" }} />}
                          onClick={() => {
                            const newPart = {
                              partName: "",
                              partNumber: "",
                              quantity: 1,
                              unitPrice: 0,
                              totalPrice: 0,
                              condition: "NEW",
                            };
                            
                            setFormData(prev => ({
                              ...prev,
                              completedServices: prev.completedServices.map((s, i) =>
                                i === serviceIndex
                                  ? {
                                      ...s,
                                      partsUsed: [...(s.partsUsed || []), newPart]
                                    }
                                  : s
                              )
                            }));
                          }}
                          variant="contained"
                          size="large"
                          sx={{
                            borderRadius: "20px",
                            backgroundColor: "#ff9800",
                            color: "white",
                            fontWeight: 900,
                            fontSize: "1.5rem",
                            px: 8,
                            py: 3,
                            boxShadow: "0 8px 24px rgba(255, 152, 0, 0.4)",
                            "&:hover": {
                              backgroundColor: "#f57c00",
                              transform: "translateY(-4px)",
                              boxShadow: "0 12px 32px rgba(255, 152, 0, 0.6)",
                            },
                          }}
                        >
                          🆕 ADD NEW PART MANUALLY
                        </Button>
                      </Box>

                      {/* Parts List */}
                      {service.partsUsed && service.partsUsed.length > 0 ? (
                        <Paper
                          elevation={4}
                          sx={{
                            borderRadius: "16px",
                            overflow: "hidden",
                            border: "3px solid #ff9800",
                          }}
                        >
                          <Box
                            sx={{
                              backgroundColor: "#ff9800",
                              color: "white",
                              p: 2,
                              textAlign: "center",
                            }}
                          >
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>
                              🛠️ PARTS ADDED ({service.partsUsed.length})
                            </Typography>
                          </Box>
                          
                          <TableContainer sx={{ backgroundColor: "white" }}>
                            <Table>
                              <TableHead>
                                <TableRow sx={{ backgroundColor: "#ffcc80" }}>
                                  <TableCell sx={{ fontWeight: 800, fontSize: "1.1rem" }}>Part Name</TableCell>
                                  <TableCell sx={{ fontWeight: 800, fontSize: "1.1rem" }}>Part Number</TableCell>
                                  <TableCell align="center" sx={{ fontWeight: 800, fontSize: "1.1rem" }}>Qty</TableCell>
                                  <TableCell align="center" sx={{ fontWeight: 800, fontSize: "1.1rem" }}>Unit Price (LKR)</TableCell>
                                  <TableCell align="center" sx={{ fontWeight: 800, fontSize: "1.1rem" }}>Total (LKR)</TableCell>
                                  <TableCell align="center" sx={{ fontWeight: 800, fontSize: "1.1rem" }}>Condition</TableCell>
                                  <TableCell align="center" sx={{ fontWeight: 800, fontSize: "1.1rem" }}>Remove</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {service.partsUsed.map((part, partIndex) => (
                                  <TableRow
                                    key={partIndex}
                                    sx={{
                                      "&:hover": { backgroundColor: "#fff3e0" },
                                      borderBottom: "2px solid #ffcc80",
                                    }}
                                  >
                                    <TableCell>
                                      <TextField
                                        fullWidth
                                        value={part.partName || ""}
                                        onChange={(e) => {
                                          const newPartsUsed = [...service.partsUsed];
                                          newPartsUsed[partIndex] = {
                                            ...newPartsUsed[partIndex],
                                            partName: e.target.value
                                          };
                                          
                                          setFormData(prev => ({
                                            ...prev,
                                            completedServices: prev.completedServices.map((s, i) =>
                                              i === serviceIndex
                                                ? { ...s, partsUsed: newPartsUsed }
                                                : s
                                            )
                                          }));
                                        }}
                                        placeholder="Enter part name"
                                        sx={{
                                          "& .MuiOutlinedInput-root": {
                                            backgroundColor: "white",
                                            fontSize: "1.1rem",
                                            fontWeight: 600,
                                          },
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        fullWidth
                                        value={part.partNumber || ""}
                                        onChange={(e) => {
                                          const newPartsUsed = [...service.partsUsed];
                                          newPartsUsed[partIndex] = {
                                            ...newPartsUsed[partIndex],
                                            partNumber: e.target.value
                                          };
                                          
                                          setFormData(prev => ({
                                            ...prev,
                                            completedServices: prev.completedServices.map((s, i) =>
                                              i === serviceIndex
                                                ? { ...s, partsUsed: newPartsUsed }
                                                : s
                                            )
                                          }));
                                        }}
                                        placeholder="Part number"
                                        sx={{
                                          "& .MuiOutlinedInput-root": {
                                            backgroundColor: "white",
                                            fontSize: "1.1rem",
                                          },
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        type="number"
                                        inputProps={{ min: 1 }}
                                        value={part.quantity || 1}
                                        onChange={(e) => {
                                          const quantity = parseInt(e.target.value) || 1;
                                          const unitPrice = parseFloat(part.unitPrice) || 0;
                                          const totalPrice = quantity * unitPrice;
                                          
                                          const newPartsUsed = [...service.partsUsed];
                                          newPartsUsed[partIndex] = {
                                            ...newPartsUsed[partIndex],
                                            quantity: quantity,
                                            totalPrice: totalPrice
                                          };
                                          
                                          setFormData(prev => ({
                                            ...prev,
                                            completedServices: prev.completedServices.map((s, i) =>
                                              i === serviceIndex
                                                ? { ...s, partsUsed: newPartsUsed }
                                                : s
                                            )
                                          }));
                                        }}
                                        sx={{
                                          width: "100px",
                                          "& .MuiOutlinedInput-root": {
                                            backgroundColor: "white",
                                            textAlign: "center",
                                            fontSize: "1.1rem",
                                            fontWeight: 600,
                                          },
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        type="number"
                                        inputProps={{ min: 0 }}
                                        value={part.unitPrice || ""}
                                        onChange={(e) => {
                                          const unitPrice = parseFloat(e.target.value) || 0;
                                          const quantity = parseInt(part.quantity) || 1;
                                          const totalPrice = quantity * unitPrice;
                                          
                                          const newPartsUsed = [...service.partsUsed];
                                          newPartsUsed[partIndex] = {
                                            ...newPartsUsed[partIndex],
                                            unitPrice: unitPrice,
                                            totalPrice: totalPrice
                                          };
                                          
                                          setFormData(prev => ({
                                            ...prev,
                                            completedServices: prev.completedServices.map((s, i) =>
                                              i === serviceIndex
                                                ? { ...s, partsUsed: newPartsUsed }
                                                : s
                                            )
                                          }));
                                        }}
                                        placeholder="0.00"
                                        sx={{
                                          width: "140px",
                                          "& .MuiOutlinedInput-root": {
                                            backgroundColor: "white",
                                            fontSize: "1.1rem",
                                            fontWeight: 600,
                                          },
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell align="center">
                                      <Paper sx={{ p: 2, backgroundColor: "#ffcc80", borderRadius: "8px" }}>
                                        <Typography
                                          variant="h5"
                                          sx={{
                                            fontWeight: 900,
                                            color: "#e65100",
                                          }}
                                        >
                                          {(part.totalPrice || 0).toLocaleString()}
                                        </Typography>
                                      </Paper>
                                    </TableCell>
                                    <TableCell>
                                      <Select
                                        value={part.condition || "NEW"}
                                        onChange={(e) => {
                                          const newPartsUsed = [...service.partsUsed];
                                          newPartsUsed[partIndex] = {
                                            ...newPartsUsed[partIndex],
                                            condition: e.target.value
                                          };
                                          
                                          setFormData(prev => ({
                                            ...prev,
                                            completedServices: prev.completedServices.map((s, i) =>
                                              i === serviceIndex
                                                ? { ...s, partsUsed: newPartsUsed }
                                                : s
                                            )
                                          }));
                                        }}
                                        sx={{
                                          minWidth: 120,
                                          "& .MuiOutlinedInput-root": {
                                            backgroundColor: "white",
                                            fontSize: "1.1rem",
                                          },
                                        }}
                                      >
                                        <MenuItem value="NEW">New</MenuItem>
                                        <MenuItem value="REFURBISHED">Refurbished</MenuItem>
                                        <MenuItem value="USED">Used</MenuItem>
                                      </Select>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Button
                                        color="error"
                                        variant="contained"
                                        size="large"
                                        onClick={() => {
                                          const newPartsUsed = service.partsUsed.filter((_, i) => i !== partIndex);
                                          
                                          setFormData(prev => ({
                                            ...prev,
                                            completedServices: prev.completedServices.map((s, i) =>
                                              i === serviceIndex
                                                ? { ...s, partsUsed: newPartsUsed }
                                                : s
                                            )
                                          }));
                                        }}
                                        sx={{
                                          borderRadius: "12px",
                                          fontWeight: 800,
                                          fontSize: "1.2rem",
                                          px: 3,
                                          py: 1.5,
                                        }}
                                      >
                                        🗑️ REMOVE
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          
                          {/* Parts Total */}
                          <Box
                            sx={{
                              backgroundColor: "#ff9800",
                              color: "white",
                              p: 3,
                              textAlign: "center",
                            }}
                          >
                            <Typography variant="h3" sx={{ fontWeight: 900 }}>
                              PARTS TOTAL: LKR {(service.partsUsed?.reduce((total, part) => total + (part.totalPrice || 0), 0) || 0).toLocaleString()}
                            </Typography>
                          </Box>
                        </Paper>
                      ) : (
                        <Alert
                          severity="info"
                          sx={{
                            borderRadius: "16px",
                            backgroundColor: "#fff8e1",
                            border: "3px solid #ffc107",
                            textAlign: "center",
                            p: 4,
                          }}
                        >
                          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2, color: "#e65100" }}>
                            ⬆️ CLICK "ADD NEW PART MANUALLY" BUTTON ABOVE ⬆️
                          </Typography>
                          <Typography variant="h6" sx={{ color: "#bf360c" }}>
                            No parts have been added yet. Use the orange button above to start adding parts one by one.
                          </Typography>
                        </Alert>
                      )}
                    </>
                  ) : (
                    <Alert
                      severity="success"
                      sx={{
                        borderRadius: "16px",
                        backgroundColor: "#e8f5e8",
                        border: "3px solid #4caf50",
                        textAlign: "center",
                        p: 4,
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 800, color: "#2e7d32", mb: 1 }}>
                        ✅ NO ADDITIONAL PARTS REQUIRED
                      </Typography>
                      <Typography variant="h6" sx={{ color: "#388e3c" }}>
                        If additional parts were needed, check the checkbox above to enable parts addition.
                      </Typography>
                    </Alert>
                  )}
                </Box>
              </Paper>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );