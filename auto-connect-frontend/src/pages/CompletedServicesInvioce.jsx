// CompletedServicesInvoice.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import jsPDF from "jspdf";

const CompletedServicesInvoice = ({ open, onClose, booking }) => {
  if (!booking) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Vehicle Service Invoice", 20, 20);
    doc.setFontSize(11);
    doc.text(`Booking ID: ${booking.id}`, 20, 30);
    doc.text(`Date: ${booking.date}`, 20, 40);
    doc.text(`Time: ${booking.time}`, 20, 50);
    doc.text(`Service Center: ${booking.centerName}`, 20, 60);
    doc.text(`Location: ${booking.location}`, 20, 70);
    doc.text(`Status: ${booking.status}`, 20, 80);

    let offset = 90;
    doc.text("Services:", 20, offset);
    booking.services.forEach((s, i) => {
      doc.text(`- ${s}`, 30, offset + (i + 1) * 10);
    });
    offset += booking.services.length * 10 + 10;

    doc.text("Estimated Total: Rs. 9,500", 20, offset);
    doc.text("Tax (5%): Rs. 475", 20, offset + 10);
    doc.text("Total: Rs. 9,975", 20, offset + 20);

    doc.save(`Invoice_${booking.id}.pdf`);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography fontSize={24} fontWeight={600}>
          Invoice
        </Typography>
      </DialogTitle>

      <Divider />

      <DialogContent dividers>
        <Typography fontSize={16} fontWeight={500} gutterBottom>
          <strong>Booking ID:</strong> {booking.id}
        </Typography>
        <Typography fontSize={16} fontWeight={500}>
          <strong>Date:</strong> {booking.date}
        </Typography>
        <Typography fontSize={16} fontWeight={500}>
          <strong>Time:</strong> {booking.time}
        </Typography>
        <Typography fontSize={16} fontWeight={500}>
          <strong>Service Center:</strong> {booking.centerName}
        </Typography>
        <Typography fontSize={14} fontWeight={400}>
          <strong>Location:</strong> {booking.location}
        </Typography>

        <Typography fontSize={18} fontWeight={600} sx={{ mt: 2 }}>
          Services:
        </Typography>
        {booking.services.map((s, i) => (
          <Typography fontSize={16} fontWeight={500} key={i}>
            - {s}
          </Typography>
        ))}

        <Divider sx={{ my: 2 }} />

        <Typography fontSize={16} fontWeight={500}>
          Subtotal: Rs. 9,500
        </Typography>
        <Typography fontSize={16} fontWeight={500}>
          Tax (5%): Rs. 475
        </Typography>
        <Typography fontSize={16} fontWeight={700}>
          Total: Rs. 9,975
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button
          onClick={handleDownloadPDF}
          variant="contained"
          color="primary"
          sx={{ fontSize: 13, fontWeight: 500 }}
        >
          Download PDF
        </Button>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ fontSize: 13, fontWeight: 500 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CompletedServicesInvoice;
