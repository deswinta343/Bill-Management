import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import SoftTypography from "components/SoftTypography";
import axios from 'axios';
import SoftBox from "components/SoftBox";
import { Button as BootstrapButton } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Bill() {
    const [paymentProofs, setPaymentProofs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedBill, setSelectedBill] = useState(null);
    const { id_circle, id_event } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPaymentProofs = async () => {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                setError("Token not found. Please login again.");
                setLoading(false);
                return;
            }
            const headers = { 'Authorization': `Bearer ${token}` };
            try {
                const response = await axios.get(`http://152.42.188.210:8080/index.php/api/auth/circles/${id_circle}/events/${id_event}/payment-proofs`, { headers });
                if (response.data && Array.isArray(response.data.payment_proofs)) {
                    setPaymentProofs(response.data.payment_proofs);
                } else {
                    setPaymentProofs([]);
                }
            } catch (error) {
                console.error("Error fetching payment proofs:", error);
                setError("Failed to fetch payment proofs. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentProofs();
    }, [id_circle, id_event]);

    const handleClickOpen = (bill) => {
        setSelectedBill(bill);
    };

    const handleClose = () => {
        setSelectedBill(null);
    };

    const handleAccept = async (paymentProofId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error("Token not found. Please login again.");
            }

            const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
            const response = await axios.put(`http://152.42.188.210:8080/index.php/api/auth/payment-proofs/${paymentProofId}/status`, { status: 'accepted' }, { headers });

            console.log(response.data);
            toast.success('Status updated to accepted');
            handleClose();
            setPaymentProofs((prevProofs) => prevProofs.map((proof) => (proof.id === paymentProofId ? { ...proof, status: 'accepted' } : proof)));
        } catch (error) {
            console.error('Error updating status to accepted:', error);
            toast.error('Failed to update status');
        }
    };

    const handleReject = async (paymentProofId) => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error("Token not found. Please login again.");
            }

            const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' };
            const response = await axios.put(`http://152.42.188.210:8080/index.php/api/auth/payment-proofs/${paymentProofId}/status`, { status: 'rejected' }, { headers });

            console.log(response.data);
            toast.success('Status updated to rejected');
            handleClose();
            setPaymentProofs((prevProofs) => prevProofs.map((proof) => (proof.id === paymentProofId ? { ...proof, status: 'rejected' } : proof)));
        } catch (error) {
            console.error('Error updating status to rejected:', error);
            toast.error('Failed to update status');
        }
    };

    return (
        <DashboardLayout>
            <ToastContainer />
            <Box display="flex" flexDirection="column" width="100%">
                <Card>
                    <Box p={2} display="flex" alignItems="center" style={{ cursor: 'pointer' }} onClick={() => navigate(-1)}>
                        <ArrowBackIcon />
                        <Typography variant="h6" color="text" style={{ marginLeft: '8px' }}>Back</Typography>
                    </Box>
                    <Box py={2} px={2}>
                        {loading ? (
                            <Box p={2} textAlign="center">
                                <SoftTypography>Loading...</SoftTypography>
                            </Box>
                        ) : error ? (
                            <Box p={2} textAlign="center">
                                <SoftTypography color="error">{error}</SoftTypography>
                            </Box>
                        ) : paymentProofs.length === 0 ? (
                            <Box p={2} textAlign="center">
                                <SoftTypography>No payment proofs found</SoftTypography>
                            </Box>
                        ) : (
                            <Box>
                                {paymentProofs.map(proof => (
                                    <Box key={proof.id} p={2} borderBottom="1px solid #ddd" display="flex" alignItems="center" justifyContent="space-between" style={{ cursor: 'pointer' }}>
                                        <Box display="flex" alignItems="center" onClick={() => handleClickOpen(proof)}>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">Hi, your friend makes payment circle from {proof.circle_name} check and approve!</Typography>
                                                <SoftTypography variant="description" color="text" style={{ fontSize: '15px' }}>{proof.username} - {proof.status}</SoftTypography>
                                            </Box>
                                        </Box>
                                        <Typography variant="body1" color={proof.paid ? 'green' : 'red'}>
                                            {proof.paid ? 'Paid off' : <PictureAsPdfIcon onClick={() => handleClickOpen(proof)} />}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Card>

                <Dialog
                    open={!!selectedBill}
                    onClose={handleClose}
                    maxWidth="md"
                    fullWidth
                >
                    <DialogTitle>
                        <SoftTypography>Payment Detail</SoftTypography>
                    </DialogTitle>
                    <DialogContent dividers>
                        {selectedBill && (
                            <Box>
                                <SoftTypography variant="body1" color={selectedBill.paid ? 'green' : 'red'}>
                                    {selectedBill.paid ? 'Paid off' : (
                                        <Box display="flex" flexDirection="column" alignItems="flex-start" width="100%" p={2}>
                                            <embed src={`http://152.42.188.210:8080${selectedBill.file_url}`} type="application/pdf" width="100%" height="600px" />
                                            <Box>
                                                <SoftTypography variant="description" color="text" style={{ fontSize: '15px', textAlign: 'right' }}>
                                                    Circle: {selectedBill.circle_name}
                                                </SoftTypography>
                                            </Box>
                                            <Box>
                                                <SoftTypography variant="description" color="text" style={{ fontSize: '15px', textAlign: 'right' }}>
                                                    Event: {selectedBill.event_name}
                                                </SoftTypography>
                                            </Box>
                                            <Box>
                                                <SoftTypography variant="description" color="text" style={{ fontSize: '15px', textAlign: 'right' }}>
                                                    From: {selectedBill.username}
                                                </SoftTypography>
                                            </Box>
                                            <Box>
                                                <SoftTypography variant="description" color="text" style={{ fontSize: '15px', textAlign: 'right' }}>
                                                    Status: {selectedBill.status}
                                                </SoftTypography>
                                            </Box>
                                            <Box>
                                                <BootstrapButton
                                                    variant="danger"
                                                    style={{ marginBottom: '10px', marginTop: '10px', marginLeft: '10px' }}
                                                    onClick={() => handleReject(selectedBill.id)}
                                                >
                                                    Rejected
                                                </BootstrapButton>
                                                <BootstrapButton
                                                    variant="primary"
                                                    style={{ marginBottom: '10px', marginTop: '10px', marginLeft: '10px' }}
                                                    onClick={() => handleAccept(selectedBill.id)}
                                                >
                                                    Accepted
                                                </BootstrapButton>
                                            </Box>
                                            <Box className="alert alert-warning" role="alert">
                                                Pay attention to the attached proof of payment! Click approve if appropriate and decline if not appropriate
                                            </Box>
                                        </Box>
                                    )}
                                </SoftTypography>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </DashboardLayout>
    );
}

export default Bill;
