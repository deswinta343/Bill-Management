import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, Grid } from '@mui/material';
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import time from "assets/images/time.png";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Button from 'react-bootstrap/Button';

function EventJoin() {
    const [isLoading, setIsLoading] = useState(false);
    const { id_circle, circle_name } = useParams();
    const [events, setEvents] = useState([]);
    const [error, setError] = useState('');
    const [userJoinedEvents, setUserJoinedEvents] = useState([]);

    const fetchData = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('jwtToken');
        const username = localStorage.getItem('username');
        if (!token) {
            setError("Token not found. Please login again.");
            setIsLoading(false);
            return;
        }
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const response = await axios.get(`http://152.42.188.210:8080/index.php/api/auth/get_events/${id_circle}`, { headers });
            const eventsData = response.data.data;

            const userJoinedEventsPromises = eventsData.map(async (event) => {
                try {
                    const membersResponse = await axios.get(`http://152.42.188.210:8080/api/auth/events/${event.id_event}/members`, { headers });
                    const members = membersResponse.data ? membersResponse.data.data : [];

                    console.log(`Members of event ${event.id_event}:`, members); // Debugging log

                    // Additional log to check each member username
                    members.forEach(member => {
                        console.log(`Member username: ${member.username}`);
                    });

                    return members.some(member => member.username === username) ? event.id_event : null;
                } catch (error) {
                    console.error(`Error fetching members for event ${event.id_event}:`, error);
                    return null;
                }
            });

            const userJoinedEventsResults = await Promise.all(userJoinedEventsPromises);
            console.log("User joined events:", userJoinedEventsResults); // Debugging log

            setUserJoinedEvents(userJoinedEventsResults.filter(id_event => id_event !== null));
            setEvents(eventsData);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to fetch data. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id_circle]);


    const handleJoinEvent = async (id_event) => {
        const token = localStorage.getItem('jwtToken');
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            await axios.post(`http://152.42.188.210:8080/api/auth/join-event/${id_event}`, {}, { headers });
            toast.success('Successfully joined the event');
            setUserJoinedEvents([...userJoinedEvents, id_event]);
        } catch (error) {
            console.error("Error joining event:", error);
            if (error.response) {
                console.error("Status code:", error.response.status);
                console.error("Response data:", error.response.data);
                toast.error('Failed to join the event');
            } else if (error.request) {
                console.error("No response received:", error.request);
                toast.error('Failed to join the event');
            } else {
                console.error("Request setup error:", error.message);
                toast.error('Failed to join the event');
            }
        }
    };

    const handleCancelEvent = async (id_event) => {
        const token = localStorage.getItem('jwtToken');
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            await axios.post(`http://152.42.188.210:8080/api/auth/event/${id_event}/cancel`, {}, { headers });
            toast.success('Successfully cancelled the event');
            setUserJoinedEvents(userJoinedEvents.filter(eventId => eventId !== id_event));
        } catch (error) {
            console.error("Error cancelling event:", error);
            if (error.response) {
                console.error("Status code:", error.response.status);
                console.error("Response data:", error.response.data);
                toast.error('Failed to cancel the event');
            } else if (error.request) {
                console.error("No response received:", error.request);
                toast.error('Failed to cancel the event');
            } else {
                console.error("Request setup error:", error.message);
                toast.error('Failed to cancel the event');
            }
        }
    };

    const truncateEventName = (nama_event) => {
        return nama_event.length > 6 ? nama_event.substring(0, 6) + '...' : nama_event;
    };

    return (
        <DashboardLayout>
            <ToastContainer />
            <Card>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={3}>
                    <div>
                        <SoftTypography variant="h6" fontWeight="bold">
                            Circle {circle_name}
                        </SoftTypography>
                    </div>
                </SoftBox>
                <SoftBox pb={3} />
            </Card>
            <SoftBox pb={2} />
            {isLoading ? (
                <Grid display="flex" justifyContent="center" alignItems="center" height="100px">
                    {isLoading && <SoftTypography style={{ paddingLeft: '20px' }}>Loading...</SoftTypography>}
                </Grid>
            ) : (
                <Grid container spacing={2}>
                    {events.length > 0 ? (
                        events.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.id_event}>
                                <Card style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                    <div>
                                        <SoftBox display="flex" justifyContent="space-between" pt={3} px={3}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <SoftTypography variant="h5" fontWeight="bold" style={{ marginLeft: '15px', marginRight: '20px' }}>
                                                    Event {truncateEventName(item.nama_event)}
                                                </SoftTypography>
                                                <img src={time} alt="time" style={{ marginLeft: '20px', marginRight: '15px', width: '100px', height: '100px' }} />
                                            </div>
                                        </SoftBox>
                                        <SoftBox pb={2} />
                                        <div style={{ borderBottom: '1px solid #ccc', width: '100%' }}></div>
                                        <SoftBox pb={1} />
                                    </div>
                                    <SoftBox px={3} pb={3} display="flex" justifyContent="space-between">
                                        {!userJoinedEvents.includes(item.id_event) ? (
                                            <Button variant="primary" className="px-4"

                                                onClick={() => handleJoinEvent(item.id_event)}
                                            >
                                                Join
                                            </Button>
                                        ) : (
                                            <Button variant="primary" className="px-4"
                                                onClick={() => handleCancelEvent(item.id_event)}
                                            >
                                                Cancel
                                            </Button>
                                        )}
                                        <Link to={`/DetailEventMyCircle/${id_circle}/${item.id_event}`}>
                                            <Button variant="contained" color="primary" style={{ marginLeft: '8px' }}>
                                                View Detail
                                                <ArrowForwardIcon style={{ marginLeft: '5px' }} />
                                            </Button>
                                        </Link>
                                    </SoftBox>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12}>
                            <SoftBox display="flex" justifyContent="center" alignItems="center" height="100px">
                                <SoftTypography variant="h6" color="text" fontWeight="medium">
                                    No events found
                                </SoftTypography>
                            </SoftBox>
                        </Grid>
                    )}
                </Grid>
            )}
            <SoftBox pb={3} />
        </DashboardLayout>
    );
}

export default EventJoin;
