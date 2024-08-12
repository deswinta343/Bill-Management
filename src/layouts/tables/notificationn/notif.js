import React, { useState, useEffect } from 'react';
import { Box, Card, Typography } from "@mui/material";
import { Button as BootstrapButton } from 'react-bootstrap';
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import megaphone from 'assets/images/megaphone.png';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { ToastContainer, toast } from 'react-toastify';

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userId } = useParams(); 
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('jwtToken');
                const userId = localStorage.getItem('userId');
                if (!token) {
                    throw new Error("Token not found. Please login again.");
                }
                const response = await axios.get(`http://152.42.188.210:8080/api/auth/notifications/${userId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (response.status === 200) {
                    setNotifications(response.data.notifications);
                } else {
                    throw new Error('Failed to fetch notifications');
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
                setError("Failed to fetch notifications. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [userId]);

    const handleApprove = async (notification) => {
        const { id: notificationId, circleId } = notification;
        console.log(`circleId: ${circleId}, notificationId: ${notificationId}`);
        if (circleId === null) {
            setError("circleId is null. Cannot approve invitation.");
            toast.error("circleId is null. Cannot approve invitation.");
            return;
        }
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error("Token not found. Please login again.");
            }
            const response = await axios.post(`http://152.42.188.210:8080/api/auth/invitation/accept/${circleId}/${notificationId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 200) {
                console.log(response.data.message);
                setNotifications(notifications.filter(notification => notification.id !== notificationId));
                toast.success('Successfully accepted the invitation');
            } else {
                throw new Error('Failed to accept invitation');
            }
        } catch (error) {
            console.error("Error accepting invitation:", error);
            setError("Failed to accept invitation. Please try again.");
            toast.error("Failed to accept invitation. Please try again.");
        }
    };

    const handleDecline = async (notification) => {
        const { id: notificationId, circleId } = notification;
        console.log(`circleId: ${circleId}, notificationId: ${notificationId}`);
        if (circleId === null) {
            setError("circleId is null. Cannot decline invitation.");
            toast.error("circleId is null. Cannot decline invitation.");
            return;
        }
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                throw new Error("Token not found. Please login again.");
            }
            const response = await axios.post(`http://152.42.188.210:8080/api/auth/decline-invitation/${circleId}/${notificationId}`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.status === 200) {
                console.log(response.data.message);
                setNotifications(notifications.filter(notification => notification.id !== notificationId));
                toast.success('Successfully declined the invitation');
            } else {
                throw new Error('Failed to decline invitation');
            }
        } catch (error) {
            console.error("Error declining invitation:", error);
            setError("Failed to decline invitation. Please try again.");
            toast.error("Failed to decline invitation. Please try again.");
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
                        ) : notifications.length === 0 ? (
                            <Box p={2} textAlign="center">
                                <SoftTypography>No notifications</SoftTypography>
                            </Box>
                        ) : (
                            <Box>
                                {notifications.map(item => (
                                    <Box key={item.id} p={2} borderBottom="1px solid #ddd" display="flex" alignItems="center" justifyContent="space-between">
                                        <Box display="flex" alignItems="center">
                                            <img src={megaphone} alt="Megaphone" style={{ marginRight: '10px', width: '30px', height: '30px' }} />
                                            <SoftTypography variant="description" color="text" style={{ fontSize: '15px' }}>{item.message}</SoftTypography>
                                        </Box>
                                        <Box>
                                            <BootstrapButton variant="primary" className="px-4" onClick={() => handleApprove(item)} style={{ marginRight: '8px' }}>Approve</BootstrapButton>
                                            <BootstrapButton type='submit' variant="danger" onClick={() => handleDecline(item)}>Decline</BootstrapButton>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Card>
            </Box>
        </DashboardLayout>
    );
}

export default Notification;
