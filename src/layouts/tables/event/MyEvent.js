import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CircularProgress } from '@mui/material';
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button as BootstrapButton, Form } from 'react-bootstrap';
import axios from 'axios';
import AddIcon from "@mui/icons-material/Add";
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Icon from '@mui/material/Icon';
import time from "assets/images/time.png";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Grid } from '@mui/material';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl
} from '@mui/material';

function EventMyCircle() {
    const [isLoading, setIsLoading] = useState(true);
    const [nama_event, setNama_event] = useState("");
    const [nama_eventError, setNama_eventError] = useState(null);
    const [deskripsi, setDeskripsi] = useState("");
    const [deskripsiError, setDeskripsiError] = useState(null);
    const [start_eventErr, setStart_eventErr] = useState(null);
    const [end_eventError, setEnd_eventError] = useState(null);
    const { id_circle, circle_name } = useParams();
    const [showEventModal, setShowEventModal] = useState(false);
    const [start_event, setStart_event] = useState(new Date().toISOString().slice(0, 19));
    const [end_event, setEnd_event] = useState(new Date().toISOString().slice(0, 19));
    const [events, setEvents] = useState([]);
    const [circle, setCircle] = useState(null);
    const [error, setError] = useState('');

    const handleStartDateChange = (e) => {
        const date = new Date(e.target.value);
        const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');
        setStart_event(formattedDate);
    };

    const handleEndDataChange = (e) => {
        const date = new Date(e.target.value);
        const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss');
        setEnd_event(formattedDate);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'nama_event':
                setNama_event(value);
                setNama_eventError(value.trim() === '' ? '*Event name is required' : '');
                break;
            case 'deskripsi':
                setDeskripsi(value);
                setDeskripsiError(value.trim() === '' ? '*Description event is required' : '');
                break;
            default:
                break;
        }
    }

    const showModalEvent = () => {
        setNama_event("");
        setDeskripsi("");
        setShowEventModal(true);
        setStart_event(new Date());
        setEnd_event(new Date());
    };

    const closeModalEvent = () => {
        setNama_event("");
        setDeskripsi("");
        setStart_event(new Date());
        setEnd_event(new Date());
        setShowEventModal(false);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        let nama_eventError = '';
        let start_eventErr = '';
        let end_eventError = '';

        if (nama_event === "") {
            nama_eventError = 'Event name is required';
        } else if (nama_event.length < 3) {
            nama_eventError = 'Event name must be at least 3 characters long';
        }

        if (!start_event || new Date(start_event) < new Date()) {
            start_eventErr = 'Start date must be today or later';
        }

        if (!end_event || new Date(end_event) < new Date()) {
            end_eventError = 'End date must be today or later';
        }

        if (!end_event || new Date(end_event) < new Date(start_event)) {
            end_eventError = 'End date must be after start event';
        }

        setNama_eventError(nama_eventError);
        setStart_eventErr(start_eventErr);
        setEnd_eventError(end_eventError);

        if (nama_eventError || start_eventErr || end_eventError) {
            return;
        }

        const token = localStorage.getItem('jwtToken');
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            const response = await axios.post(`http://152.42.188.210:8080/index.php/api/auth/post_events/${id_circle}`, {
                nama_event: nama_event,
                deskripsi: deskripsi,
                start_event: start_event,
                end_event: end_event,
            }, { headers });

            toast.success('Event created successfully');
            console.log(response);
            closeModalEvent();
            fetchData();
        } catch (error) {
            console.error("Error form:", error);
            if (error.response) {
                console.error("Headers:", error.response.headers);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Request setup error:", error.message);
            }
        }
    };

    const fetchData = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError("Token not found. Please login again.");
            setIsLoading(false);
            return;
        }
        const headers = { 'Authorization': `Bearer ${token}` };

        try {
            const response = await axios.get(`http://152.42.188.210:8080/index.php/api/auth/get_events/${id_circle}`, { headers });
            console.log("Response dari server:", response.data);
            setEvents(response.data.data);
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
            const response = await axios.post(`http://152.42.188.210:8080/api/auth/join-event/${id_event}`, {}, { headers });
            console.log(response);
            toast.success('Successfully joined the event');
        } catch (error) {
            console.error("Error joining event:", error);
            if (error.response) {
                console.error("Status code:", error.response.status);
                console.error("Response data:", error.response.data);
            } else if (error.request) {
                console.error("No response received:", error.request);
            } else {
                console.error("Request setup error:", error.message);
            }
            toast.error('Failed to join the event');
        }
    };

    const truncateEventName = (nama_event) => {
        return nama_event.length > 6 ? nama_event.substring(0, 6) + '...' : nama_event;
    }

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
                    <Button variant="contained" startIcon={<AddIcon />} onClick={showModalEvent}>
                        Create Event
                    </Button>
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
                    {events && events.length > 0 ? (
                        events.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.id_event}>
                                <Card style={{ marginBottom: '20px' }}>
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
                                    <SoftBox px={3} pb={3}>
                                        <Link to={`/DetailEventMyCircle/${id_circle}/${item.id_event}`}>
                                            <SoftTypography
                                                component="span"
                                                variant="button"
                                                color="text"
                                                fontWeight="medium"
                                                sx={{
                                                    mt: "auto",
                                                    mr: "auto",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    cursor: "pointer",
                                                    "& .material-icons-round": {
                                                        fontSize: "1.125rem",
                                                        transform: `translate(2px, -0.5px)`,
                                                        transition: "transform 0.2s cubic-bezier(0.34,1.61,0.7,1.3)",
                                                    },
                                                    "&:hover .material-icons-round, &:focus  .material-icons-round": {
                                                        transform: `translate(6px, -0.5px)`,
                                                    },
                                                }}
                                            >
                                                View Detail
                                                <ArrowForwardIcon sx={{ fontWeight: "bold" }} />
                                            </SoftTypography>
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
            <div className='body-flex'>
            <div className="overlay" />
            <div className="flex">
                <div className="col-15 p-5">
                    <Dialog open={showEventModal} onClose={closeModalEvent}>
                        <DialogTitle>Create Event</DialogTitle>
                        <DialogContent>
                            <Form>
                                <Form.Group className='mb-4' controlId="formEventName">
                                    <Form.Control
                                        type="text"
                                        placeholder='Enter event name'
                                        rows={1}
                                        name='nama_event'
                                        value={nama_event}
                                        onChange={handleChange}
                                    />
                                       {nama_eventError && (
                                            <div className="errorMsg" style={{ fontSize: 'smaller', color: 'red' }}>
                                                {nama_eventError}
                                            </div>
                                        )}
                                </Form.Group>
                                <Form.Group className='mb-4' controlId="formEventDescription">
                                    <Form.Control
                                        as="textarea"
                                        placeholder='Enter Description Event'
                                        rows={3}
                                        name="deskripsi"
                                        value={deskripsi}
                                        onChange={handleChange}
                                    />
                                       {deskripsiError && (
                                            <div className="errorMsg" style={{ fontSize: 'smaller', color: 'red' }}>
                                                {deskripsiError}
                                            </div>
                                        )}
                                </Form.Group>
                                <Form.Group className='mb-2' controlId="formStartEvent" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                    <div>
                                        <TextField
                                            label="Start Event"
                                            type="datetime-local"
                                            value={start_event}
                                            onChange={handleStartDateChange}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                           {start_eventErr && (
                                                <div className="errorMsg" style={{ fontSize: 'smaller', color: 'red' }}>
                                                    {start_eventErr}
                                                </div>
                                            )}
                                    </div>
                                    <div>
                                        <TextField
                                            label="End Event"
                                            type="datetime-local"
                                            value={end_event}
                                            onChange={handleEndDataChange}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                           {end_eventError && (
                                                <div className="errorMsg" style={{ fontSize: 'smaller', color: 'red' }}>
                                                    {end_eventError}
                                                </div>
                                            )}
                                    </div>
                                </Form.Group>
                            </Form>
                        </DialogContent>
                        <DialogActions>
                            <BootstrapButton type='submit' variant="danger" onClick={closeModalEvent}>
                                Close
                            </BootstrapButton>
                            <BootstrapButton  variant="primary" className="px-4" onClick={handleFormSubmit}>
                                Save
                            </BootstrapButton>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        </div>
        </DashboardLayout>
    );
}

export default EventMyCircle;
