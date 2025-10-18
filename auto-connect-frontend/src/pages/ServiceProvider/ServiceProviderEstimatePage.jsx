import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ServiceProviderEstimatePage.css';

const ServiceProviderEstimatePage = () => {
  const navigate = useNavigate();
  const { estimateId } = useParams();

  // State for accident details
  const [accidentDetails, setAccidentDetails] = useState(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('info'); // 'info', 'confirm', 'success', 'error'
  const [modalMessage, setModalMessage] = useState('');
  const [modalAction, setModalAction] = useState(null);

  // Estimate form state
  const [estimateData, setEstimateData] = useState({
    estimateNumber: '',
    estimateDate: new Date().toISOString().split('T')[0],
    repairItems: [
      { id: 1, description: '', quantity: 1, unitPrice: '', laborHours: 0 }
    ],
    laborRate: 500,
    additionalCharges: 0,
    notes: '',
    warrantyPeriod: '12',
    estimationValidity: '7'
  });

  const [formErrors, setFormErrors] = useState({});

  // Fetch accident details
  useEffect(() => {
    const mockAccidentDetails = {
      id: estimateId,
      claimId: 'CLM-2024-001',
      customerName: 'John Silva',
      vehicleNumber: 'ABC-1234',
      vehicleModel: 'Toyota Corolla 2022',
      accidentDate: '2024-12-15',
      accidentLocation: 'Galle Road, Colombo 06',
      accidentDescription: 'Vehicle collision with front-end damage including bumper, headlight, and minor bodywork damage.',
      policyNumber: 'POL-001-2024',
      photos: [
        'https://via.placeholder.com/300x200?text=Front+Damage+1',
        'https://via.placeholder.com/300x200?text=Front+Damage+2',
        'https://via.placeholder.com/300x200?text=Side+Damage'
      ],
      estimatedDamageArea: 'Front bumper, headlights, hood, front fender',
      adjustedAmount: 150000
    };

    setAccidentDetails(mockAccidentDetails);
    setEstimateData(prev => ({
      ...prev,
      estimateNumber: `EST-${Date.now()}`
    }));
  }, [estimateId]);

  // Modal helper function
  const showMessageModal = (type, message, action = null) => {
    setModalType(type);
    setModalMessage(message);
    setModalAction(action);
    setShowModal(true);

    // Auto-close for non-confirm modals
    if (type !== 'confirm') {
      setTimeout(() => setShowModal(false), 3000);
    }
  };

  // Add repair item
  const handleAddRepairItem = () => {
    setEstimateData(prev => ({
      ...prev,
      repairItems: [
        ...prev.repairItems,
        {
          id: Math.max(...prev.repairItems.map(item => item.id), 0) + 1,
          description: '',
          quantity: 1,
          unitPrice: '',
          laborHours: 0
        }
      ]
    }));
  };

  // Remove repair item
  const handleRemoveRepairItem = (itemId) => {
    setEstimateData(prev => ({
      ...prev,
      repairItems: prev.repairItems.filter(item => item.id !== itemId)
    }));
  };

  // Update repair item
  const handleUpdateRepairItem = (itemId, field, value) => {
    setEstimateData(prev => ({
      ...prev,
      repairItems: prev.repairItems.map(item =>
        item.id === itemId ? { ...item, [field]: value } : item
      )
    }));
  };

  // Update estimate data
  const handleEstimateDataChange = (field, value) => {
    setEstimateData(prev => ({
      ...prev,
      [field]: value
    }));
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  // Calculate item subtotal
  const calculateItemSubtotal = (item) => {
    const materialCost = (parseFloat(item.unitPrice) || 0) * (parseInt(item.quantity) || 0);
    const laborCost = (item.laborHours || 0) * estimateData.laborRate;
    return materialCost + laborCost;
  };

  // Calculate total
  const calculateTotal = () => {
    const itemsTotal = estimateData.repairItems.reduce((sum, item) => {
      return sum + calculateItemSubtotal(item);
    }, 0);

    const additionalCharges = parseFloat(estimateData.additionalCharges) || 0;
    const total = itemsTotal + additionalCharges;

    return {
      itemsTotal,
      additionalCharges,
      total,
      laborTotal: estimateData.repairItems.reduce((sum, item) => {
        return sum + ((item.laborHours || 0) * estimateData.laborRate);
      }, 0)
    };
  };

  // Validate form
  const validateForm = () => {
    const errors = {};

    if (estimateData.repairItems.length === 0) {
      errors.repairItems = 'At least one repair item is required';
    }

    estimateData.repairItems.forEach((item) => {
      if (!item.description.trim()) {
        errors[`item_${item.id}_description`] = 'Description is required';
      }
      if (!item.unitPrice || parseFloat(item.unitPrice) <= 0) {
        errors[`item_${item.id}_price`] = 'Valid price is required';
      }
    });

    if (!estimateData.notes.trim()) {
      errors.notes = 'Estimation notes are required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Download accident report
  const handleDownloadAccidentReport = () => {
    showMessageModal(
      'info',
      '📥 Downloading accident details PDF...\n\nFile will be saved to your downloads folder.'
    );
  };

  // Save as draft
  const handleSaveDraft = () => {
    showMessageModal(
      'info',
      `💾 Draft Saved!\n\n` +
      `Claim ID: ${accidentDetails.claimId}\n` +
      `Vehicle: ${accidentDetails.vehicleNumber}\n` +
      `Total Estimation: ${calculateTotal().total.toLocaleString('en-US')} LKR\n\n` +
      `Your progress has been saved. You can edit and submit later.`
    );
  };

  // Show confirmation before submit
  const handleSubmitClick = () => {
    if (!validateForm()) {
      showMessageModal(
        'error',
        `❌ Validation Error\n\nPlease fix the following:\n\n` +
        `• All repair items must have description\n` +
        `• Unit price must be greater than 0\n` +
        `• Estimation notes are required`
      );
      return;
    }

    const totalAmount = calculateTotal().total;
    const insuranceAmount = accidentDetails.adjustedAmount;
    const variance = ((totalAmount - insuranceAmount) / insuranceAmount * 100).toFixed(2);

    setModalAction('submit');
    showMessageModal(
      'confirm',
      `⚠️ Confirm Estimation Submission\n\n` +
      `Claim ID: ${accidentDetails.claimId}\n` +
      `Vehicle: ${accidentDetails.vehicleNumber}\n` +
      `Total Estimation: ${totalAmount.toLocaleString('en-US')} LKR\n` +
      `Insurance Estimate: ${insuranceAmount.toLocaleString('en-US')} LKR\n` +
      `Variance: ${variance}%\n` +
      `Warranty: ${estimateData.warrantyPeriod} Months\n\n` +
      `Are you sure you want to submit this estimation?`
    );
  };

  // Handle modal confirm
  const handleModalConfirm = async () => {
    if (modalAction === 'submit') {
      setSubmitLoading(true);
      setShowModal(false);

      try {
        const finalEstimate = {
          ...estimateData,
          accidentDetailsId: accidentDetails.id,
          claimId: accidentDetails.claimId,
          submittedAt: new Date().toISOString(),
          total: calculateTotal().total
        };

        console.log('Submitting estimate:', finalEstimate);

        setTimeout(() => {
          setSubmitLoading(false);
          showMessageModal(
            'success',
            `✅ Success!\n\n` +
            `Estimate submitted successfully to insurance company!\n\n` +
            `Redirecting to dashboard...`
          );

          // Navigate to dashboard after a short delay
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        }, 1500);
      } catch (error) {
        console.error('Error submitting estimate:', error);
        setSubmitLoading(false);
        showMessageModal(
          'error',
          `❌ Error\n\n` +
          `Failed to submit estimate.\n` +
          `Please try again or contact support.`
        );
      }
    }
  };

  const totals = calculateTotal();

  if (!accidentDetails) {
    return (
      <div className="sp-estimate-page">
        <div className="error-state">
          <p>Unable to load accident details.</p>
          <button onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="sp-estimate-page">
      {/* Page Header */}
      <div className="sp-page-header">
        <div className="header-content">
          <h1>Create Repair Estimation</h1>
          <p>Review accident details and provide detailed repair estimation</p>
        </div>
        <div className="header-meta">
          <span className="estimate-id">{estimateData.estimateNumber}</span>
          <span className="estimate-date">{estimateData.estimateDate}</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="sp-content-grid">
        {/* Left Column - Accident Details */}
        <div className="sp-left-column">
          {/* Accident Details Card */}
          <section className="sp-card accident-details">
            <div className="sp-card-header">
              <h2>Accident & Vehicle Details</h2>
              <button 
                className="download-btn"
                onClick={() => showMessageModal('info', 'Downloading accident report...')}
              >
                📥 Download Report
              </button>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Claim ID</span>
                <span className="detail-value">{accidentDetails.claimId}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Customer</span>
                <span className="detail-value">{accidentDetails.customerName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle Number</span>
                <span className="detail-value">{accidentDetails.vehicleNumber}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Vehicle Model</span>
                <span className="detail-value">{accidentDetails.vehicleModel}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Accident Date</span>
                <span className="detail-value">{accidentDetails.accidentDate}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Location</span>
                <span className="detail-value">{accidentDetails.accidentLocation}</span>
              </div>
            </div>

            <div className="accident-description">
              <h4>Accident Description</h4>
              <p>{accidentDetails.accidentDescription}</p>
            </div>

            <div className="damage-area">
              <h4>Estimated Damage Area</h4>
              <p>{accidentDetails.estimatedDamageArea}</p>
            </div>

            <div className="insurance-estimate">
              <h4>Insurance Company Estimate</h4>
              <div className="estimate-box">
                <strong>{accidentDetails.adjustedAmount.toLocaleString('en-US')} LKR</strong>
                <p>Use this as a reference for your estimation</p>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Estimation Form */}
        <div className="sp-right-column">
          {/* Repair Items Section */}
          <section className="sp-card repair-items">
            <div className="sp-card-header">
              <h2>Repair Items & Pricing</h2>
              <button 
                className="add-item-btn"
                onClick={handleAddRepairItem}
              >
                + Add Item
              </button>
            </div>

            {formErrors.repairItems && (
              <div className="error-message">{formErrors.repairItems}</div>
            )}

            <div className="items-list">
              {estimateData.repairItems.map((item, index) => (
                <div key={item.id} className="repair-item-card">
                  <div className="item-number">Item {index + 1}</div>

                  <div className="item-form-grid">
                    <div className="form-group full-width">
                      <label>Description of Work*</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleUpdateRepairItem(item.id, 'description', e.target.value)}
                        placeholder="e.g., Front bumper replacement"
                        className={formErrors[`item_${item.id}_description`] ? 'error' : ''}
                      />
                      {formErrors[`item_${item.id}_description`] && (
                        <span className="field-error">{formErrors[`item_${item.id}_description`]}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Quantity*</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateRepairItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                      />
                    </div>

                    <div className="form-group">
                      <label>Unit Price (LKR)*</label>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateRepairItem(item.id, 'unitPrice', e.target.value)}
                        placeholder="0"
                        className={formErrors[`item_${item.id}_price`] ? 'error' : ''}
                      />
                      {formErrors[`item_${item.id}_price`] && (
                        <span className="field-error">{formErrors[`item_${item.id}_price`]}</span>
                      )}
                    </div>

                    <div className="form-group">
                      <label>Labor Hours</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={item.laborHours}
                        onChange={(e) => handleUpdateRepairItem(item.id, 'laborHours', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>

                    <div className="form-group">
                      <label>Subtotal</label>
                      <div className="subtotal-display">
                        {calculateItemSubtotal(item).toLocaleString('en-US')} LKR
                      </div>
                    </div>

                    {estimateData.repairItems.length > 1 && (
                      <div className="form-group">
                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => handleRemoveRepairItem(item.id)}
                        >
                          🗑️ Remove
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Labor & Charges Section */}
          <section className="sp-card labor-charges">
            <div className="sp-card-header">
              <h2>Labor & Additional Charges</h2>
            </div>

            <div className="labor-rate-section">
              <div className="form-group">
                <label>Labor Rate per Hour (LKR)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={estimateData.laborRate}
                  onChange={(e) => handleEstimateDataChange('laborRate', parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="labor-info">
                <p>Total Labor Cost: <strong>{totals.laborTotal.toLocaleString('en-US')} LKR</strong></p>
              </div>
            </div>

            <div className="additional-charges-section">
              <div className="form-group">
                <label>Additional Charges (if any)</label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={estimateData.additionalCharges}
                  onChange={(e) => handleEstimateDataChange('additionalCharges', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </section>

          {/* Warranty & Validity Section */}
          <section className="sp-card warranty-section">
            <div className="sp-card-header">
              <h2>Warranty & Validity</h2>
            </div>

            <div className="warranty-grid">
              <div className="form-group">
                <label>Warranty Period (months)</label>
                <select
                  value={estimateData.warrantyPeriod}
                  onChange={(e) => handleEstimateDataChange('warrantyPeriod', e.target.value)}
                >
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months (1 Year)</option>
                  <option value="24">24 Months (2 Years)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Estimation Valid For (days)</label>
                <select
                  value={estimateData.estimationValidity}
                  onChange={(e) => handleEstimateDataChange('estimationValidity', e.target.value)}
                >
                  <option value="7">7 Days</option>
                  <option value="14">14 Days</option>
                  <option value="30">30 Days</option>
                </select>
              </div>
            </div>
          </section>

          {/* Notes Section */}
          <section className="sp-card notes-section">
            <div className="sp-card-header">
              <h2>Estimation Notes</h2>
            </div>

            <div className="form-group">
              <label>Additional Notes & Comments*</label>
              <textarea
                rows="5"
                value={estimateData.notes}
                onChange={(e) => handleEstimateDataChange('notes', e.target.value)}
                placeholder="Add any important notes, special conditions, or recommendations for this repair..."
                className={formErrors.notes ? 'error' : ''}
              />
              {formErrors.notes && (
                <span className="field-error">{formErrors.notes}</span>
              )}
            </div>
          </section>

          {/* Cost Summary */}
          <section className="sp-card cost-summary">
            <div className="sp-card-header">
              <h2>Cost Summary</h2>
            </div>

            <div className="summary-breakdown">
              <div className="summary-line">
                <span className="label">Materials & Parts:</span>
                <span className="value">
                  {(totals.itemsTotal - totals.laborTotal).toLocaleString('en-US')} LKR
                </span>
              </div>
              <div className="summary-line">
                <span className="label">Labor Cost:</span>
                <span className="value">{totals.laborTotal.toLocaleString('en-US')} LKR</span>
              </div>
              <div className="summary-line">
                <span className="label">Additional Charges:</span>
                <span className="value">{totals.additionalCharges.toLocaleString('en-US')} LKR</span>
              </div>
              <div className="summary-line total">
                <span className="label">Total Estimation:</span>
                <span className="value">{totals.total.toLocaleString('en-US')} LKR</span>
              </div>
              <div className="insurance-reference">
                <p>Insurance Estimate: {accidentDetails.adjustedAmount.toLocaleString('en-US')} LKR</p>
                <p className="variance">
                  Variance: {((totals.total - accidentDetails.adjustedAmount) / accidentDetails.adjustedAmount * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <section className="sp-card action-buttons">
            <button
              className="save-draft-btn"
              onClick={handleSaveDraft}
              disabled={submitLoading}
            >
              💾 Save as Draft
            </button>
            <button
              className="submit-btn"
              onClick={handleSubmitClick}
              disabled={submitLoading}
            >
              {submitLoading ? 'Submitting...' : '📤 Submit Estimation'}
            </button>
            <button
              className="cancel-btn"
              onClick={() => navigate(-1)}
              disabled={submitLoading}
            >
              Cancel
            </button>
          </section>
        </div>
      </div>

      {/* Modal Overlay */}
      {showModal && (
        <div className="modal-overlay">
          <div className={`modal-box modal-${modalType}`}>
            <div className="modal-header">
              <h3>
                {modalType === 'confirm' && '⚠️ Confirm'}
                {modalType === 'success' && '✅ Success'}
                {modalType === 'error' && '❌ Error'}
                {modalType === 'info' && 'ℹ️ Information'}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-content">
              <pre className="modal-message">{modalMessage}</pre>
            </div>

            <div className="modal-actions">
              {modalType === 'confirm' ? (
                <>
                  <button
                    className="modal-cancel-btn"
                    onClick={() => setShowModal(false)}
                    disabled={submitLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="modal-confirm-btn"
                    onClick={() => console.log('Confirmed')}
                    disabled={submitLoading}
                  >
                    Confirm & Submit
                  </button>
                </>
              ) : (
                <button
                  className="modal-close-btn"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceProviderEstimatePage;