import { Box, Card } from "@mui/material";
import SoftTypography from "components/SoftTypography";
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import megaphone from 'assets/images/megaphone.png';

function ItemNotif() {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { userId } = useParams();

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
                    // Ambil 3 item terbaru
                    const latestNotifications = response.data.notifications.slice(0, 3);
                    setNotifications(latestNotifications);

                    // Hitung notifikasi yang belum dibaca
                    const unreadCount = latestNotifications.filter(item => !item.isRead).length;
                    setUnreadCount(unreadCount);
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

    const handleNotificationClick = (notificationId) => {
        // Update state notifikasi
        setNotifications(prevNotifications => 
            prevNotifications.filter(notification => notification.id !== notificationId)
        );

        // Update count unread
        setUnreadCount(prevCount => prevCount - 1);
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <SoftTypography variant="h6">
                Notifications {unreadCount > 0 && `(${unreadCount} new)`}
            </SoftTypography>
            <Card style={{ width: '300px', marginTop: '10px' }}>
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
                            <Link key={item.id} to={`/Notification`} onClick={() => handleNotificationClick(item.id)}>
                                <Box p={2} borderBottom="1px solid #ddd" display="flex" alignItems="center" style={{ padding: '2px' }}>
                                    <img src={megaphone} alt="Megaphone" style={{ marginRight: '10px', width: '30px', height: '30px' }} />
                                    <SoftTypography variant="description" color="text" style={{ fontSize: '14px' }}>{item.message}</SoftTypography>
                                </Box>
                            </Link>
                        ))}
                    </Box>
                )}
            </Card>
        </Box>
    );
}

export default ItemNotif;
