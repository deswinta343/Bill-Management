import React, { useState, useEffect } from 'react';
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from '@mui/material';
import { Modal, Button as BootstrapButton, Form } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from 'examples/LayoutContainers/DashboardLayout';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';
import Tooltip from "@mui/material/Tooltip";
import SoftInput from "components/SoftInput";
import "bootstrap/dist/css/bootstrap.min.css";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SuiBadgeDot from "components/SoftBadge";
import SuiBox from "components/SoftBox";
import Table from "examples/Tables/Table";
import SoftAvatar from "components/SoftAvatar";
import team1 from "assets/images/team1.jpg";
import {
    Box,
    Card,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl
} from '@mui/material';
import { useParams } from 'react-router-dom';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChatIcon from '@mui/icons-material/Chat';

function MyCircle() {
    const [circles, setCircles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [circle_name, setcircle_name] = useState("");
    const [id_circle, setId_Circle] = useState("");
    const [circle_nameError, setcircle_nameError] = useState(null);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [username, setUsername] = useState("");
    const [usernameError, setUsernameError] = useState(null);
    const [original_circle_name, setOriginal_circle_name] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCircles, setFilteredCircles] = useState([]);

    const fetchData = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError("Token not found. Please login again.");
            setLoading(false);
            return;
        }
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const response = await axios.get('http://152.42.188.210:8080/index.php/api/auth/get_circle', { headers });
            console.log("Response dari server:", response.data);
            response.data.data.forEach(circle => {
                console.log("Circle:", circle);
            });
            setCircles(response.data.data);
            setFilteredCircles(response.data.data);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            }
        } finally {
            setLoading(false);
        }
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'circle_name':
                setcircle_name(value);
                setcircle_nameError('');
                break;
            default:
                break;
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        let error = '';
        if (circle_name === "") {
            error = 'Circle name is required';
        } else if (circle_name.length < 3) {
            error = 'Circle name must be at least 3 characters long';
        }
        if (error) {
            setcircle_nameError(error);
            return;
        }
        
        const token = localStorage.getItem('jwtToken');
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const response = await axios.post('http://152.42.188.210:8080/index.php/api/auth/create_circle', {
                circle_name: circle_name,
            }, { headers });
    
            console.log(response);
    
            closeModalAdd();
            console.log(circles.creator_username);
            console.log(circles.id_circle);
            toast.success('Circle created successfully');
            const newCircle = { id_circle: response.data.id_circle, circle_name: circle_name };
            setCircles([...circles, newCircle]);
            fetchData();
        } catch (error) {
            console.error("Error submitting form:", error);
            // Handle error here
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error("Server error response:", error.response.data);
                console.error("Status code:", error.response.status);
                console.error("Headers:", error.response.headers);
                if (error.response.status === 400) {
                    toast.error('circle names are not permitted');
                } else {
                    setError("Server error: " + error.response.data.message);
                }
            } else if (error.request) {
                // The request was made but no response was received
                console.error("No response received:", error.request);
                setError("No response from server. Please try again later.");
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error("Request setup error:", error.message);
            }
        }
    };
    
    
    const showModalAdd = () => {
        setcircle_name("");
        setShowAddModal(true);
    };

    const closeModalAdd = () => {
        setcircle_name("")
        setShowAddModal(false);
    };

    const showModalUpdate = (data) => {
        setcircle_name(data.circle_name);
        setOriginal_circle_name(data.circle_name);
        setId_Circle(data.id_circle);
        setShowUpdateModal(true);
    };


    const closeModalUpdate = () => {
        setcircle_name("");
        setId_Circle("");
        setShowUpdateModal(false);
    };

    const showModalDelete = (data) => {
        setOriginal_circle_name(data.circle_name);
        setcircle_name(data.circle_name);
        setId_Circle(data.id_circle);
        setShowDeleteModal(true);
    };

    const closeModalDelete = () => {
        setcircle_name("");
        setId_Circle("");
        setShowDeleteModal(false);
    };

    const updatedCircles = async (e) => {
        e.preventDefault();
        let error = '';
        if (id_circle === "") {
            error = 'Circle ID is required';
        } else {
            if (circle_name === "") {
                error = 'Circle name is required';
            } else if (circle_name.length < 3) {
                error = 'Circle name must be at least 3 characters long';
            } else if (circle_name === original_circle_name) {
                error = 'No changes detected';
            }
        }
        if (error) {
            setcircle_nameError(error);
            return;
        }
        const token = localStorage.getItem('jwtToken');
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const response = await axios.put(`http://152.42.188.210:8080/index.php/api/auth/update_circle/${id_circle}`, {
                circle_name: circle_name,
            }, { headers });
            closeModalUpdate();
            toast.success('Circle updated successfully');
            fetchData();
            const updatedData = circles.map(circle =>
                circle.id_circle === id_circle ? { ...circle, circle_name: circle_name } : circle
            );
            setCircles(updatedData);
        } catch (error) {
            console.error("Error updating circle:", error);
        }
    };

    const DeleteDataCircle = async (event) => {
        event.preventDefault();
        const token = localStorage.getItem('jwtToken');
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            if (!id_circle) {
                console.error('ID circle is not defined');
                return;
            }
            const deleteData = await axios.delete(
                `http://152.42.188.210:8080/index.php/api/auth/delete_circle/${id_circle}`,
                { headers }
            );
            console.log(deleteData.data);
            closeModalDelete();
            fetchData();
            toast.success('Circle delete successfully');
            const updatedData = circles.filter(circle => circle.id_circle !== id_circle);
            setCircles(updatedData);
        } catch (error) {
            toast.error("Failed to delete");
            console.error("Error delete circle:", error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);

    const avatars = (members) =>
        members.map(([image, name]) => (
            <Tooltip key={name} title={name} placeholder="bottom">
                <SoftAvatar
                    src={image}
                    alt="name"
                    size="xs"
                    sx={{
                        border: ({ borders: { borderWidth }, palette: { white } }) =>
                            `${borderWidth[2]} solid ${white.main}`,
                        cursor: "pointer",
                        position: "relative",

                        "&:not(:first-of-type)": {
                            ml: -1.25,
                        },

                        "&:hover, &:focus": {
                            zIndex: "10",
                        },
                    }}
                />
            </Tooltip>
        ));

    const handleChangeUsername = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'username':
                setUsername(value);
                setUsernameError(value.trim() === '' ? '*Username is required' : '');
                break;
            default:
                break;
        }
    };

    const showModalInvite = (circle) => {
        setId_Circle(circle.id_circle); // Perbarui nilai id_circle saat tombol undangan diklik
        setUsername(""); // Reset nilai username
        setShowInviteModal(true);
    };

    const handleSubmitInvite = async (e) => {
        e.preventDefault();
        let error = '';

        if (username === "") {
            error = 'Username is required';
        }

        setUsernameError(error);
        if (error) {
            setError(error);
            return;
        }
        const token = localStorage.getItem('jwtToken');
        const headers = { 'Authorization': `Bearer ${token}` };
        console.log("id circle :", circles.id_circle)
        try {
            const response = await axios.post(`http://152.42.188.210:8080/api/auth/circles/${id_circle}/invite`, {
                username: username,
            }, { headers });
            console.log(`Inviting username ${username} to circle ${id_circle}`);
            if (response.status === 200) {
                setUsername('');
                setError('');
                closeModalInvite();
                toast.success('Invite successfully, waiting approve');
                console.log('Invite successfully, waiting approve');
            } else {
                throw new Error('Failed to invite user to circle');
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setError('Failed to invite. Make sure the username entered is correct');
            toast.error("Failed to invite");
        }
    };


    const closeModalInvite = () => {
        setUsername("");
        setShowInviteModal(false);
    };

    const handleSearchChange = async (event) => {
        const searchTerm = event.target.value;
        setSearchTerm(searchTerm);
        setLoading(true);

        try {
            const token = localStorage.getItem('jwtToken');
            const headers = { 'Authorization': `Bearer ${token}` };

            if (searchTerm.trim() !== '') {
                // Jika search term tidak kosong, lakukan pencarian berdasarkan keyword
                const response = await axios.get(`http://152.42.188.210:8080/api/auth/search_circle`, {
                    headers,
                    params: { search_query: searchTerm }
                });
                setFilteredCircles(response.data.data);
                setError('');
            } else {
                // Jika search term kosong, kembalikan ke data asli
                setFilteredCircles(circles);
                setError('');
            }
        } catch (error) {
            console.error("Failed to search circles:", error);
            setFilteredCircles([]);
            // setError('Failed to search circles');
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
        <DashboardNavbar />
        <ToastContainer />
        <SoftBox py={3}>
            <Card>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={3}>
                    <div>
                        <SoftInput
                            placeholder="Type here..."
                            icon={{ component: "search", direction: "left" }}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        />
                    </div>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={showModalAdd}>
                        Create Circle
                    </Button>
                </SoftBox>
                <SoftBox pb={3} />
                <SoftBox>
                        <SoftBox
                            sx={{
                                "& .MuiTableRow-root:not(:last-child)": {
                                    "& td": {
                                        borderBottom: ({ borders: { borderWidth, borderColor } }) =>
                                            `${borderWidth[1]} solid ${borderColor}`,
                                    },
                                },
                            }}
                        >
                            <>
                                {loading ? (
                                    <SoftTypography style={{ paddingLeft: '20px' }}>Loading...</SoftTypography>
                                ) : (
                                    filteredCircles.length > 0 ? (
                                        <Table
                                            columns={[
                                                { name: "image", align: "center" },
                                                { name: "circle", align: "center" },
                                                { name: "creator", align: "center" },
                                                { name: "forum", align: "center" },
                                                { name: "invite", align: "center" },
                                                { name: "action", align: "center" },
                                            ]}
                                            rows={filteredCircles.map(circle => ({
                                                image: <SoftAvatar src={team1} />,
                                                circle: (
                                                    <Tooltip title="view event">
                                                        <Link to={`/EventMyCircle/${circle.id_circle}/${circle.circle_name}`}>
                                                            {circle.circle_name}
                                                        </Link>
                                                    </Tooltip>
                                                ),
                                                creator: (
                                                    <SuiBadgeDot size="small" badgeContent={circle.creator_username ? circle.creator_username : "Unknown Creator"} />
                                                ),
                                                forum: (
                                                    <Tooltip title="Go forum">
                                                    <Link to={`/Chat/${circle.id_circle}/${circle.circle_name}`}>
                                                    <ChatIcon fontSize="medium" />
                                                    </Link>
                                                </Tooltip>
                                                ),
                                                invite: (
                                                    <Tooltip title="Add User">
        <Link to={`/InviteCircle/${circle.id_circle}/${circle.circle_name}`}>
            <PersonAddIcon fontSize="medium" />
        </Link>
    </Tooltip>
                                                ),
                                                action: (
                                                    <>
                                                        <SoftTypography
                                                            component="a"
                                                            variant="caption"
                                                            color="secondary"
                                                            fontWeight="medium"
                                                            style={{ marginRight: '8px', cursor: 'pointer' }}
                                                            onClick={() => showModalUpdate(circle)}
                                                        >
                                                            Edit
                                                        </SoftTypography>
                                                        <SoftTypography
                                                            component="a"
                                                            variant="caption"
                                                            color="secondary"
                                                            fontWeight="medium"
                                                            style={{ cursor: 'pointer' }}
                                                            onClick={() => showModalDelete(circle)}
                                                        >
                                                            Delete
                                                        </SoftTypography>
                                                    </>
                                                ),
                                            }))}
                                        />
                                    ) : (
                                        <SoftTypography style={{ paddingLeft: '20px' }}>Circle not found</SoftTypography>
                                    )
                                )}
                                
                        </>
                    </SoftBox>
                </SoftBox>
            </Card>
                {/* Create Circle Dialog */}
                <Dialog open={showAddModal} onClose={closeModalAdd} centered maxWidth="md" fullWidth>
                    <DialogTitle>Create Circle</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                type="text"
                                placeholder="Enter circle name"
                                name="circle_name"
                                autoFocus
                                onChange={handleChange}
                                value={circle_name}
                                error={Boolean(circle_nameError)}
                                helperText={circle_nameError}
                            />
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                    <BootstrapButton type='submit' variant="danger" onClick={closeModalAdd}>
                            Cancel
                        </BootstrapButton>
                        <BootstrapButton variant="primary" className="px-4" onClick={handleFormSubmit}>Save</BootstrapButton>
                    </DialogActions>
                </Dialog>

                {/* Update Circle Dialog */}
                <Dialog open={showUpdateModal} onClose={closeModalUpdate} centered maxWidth="md" fullWidth>
                    <DialogTitle>Update Circle</DialogTitle>
                    <DialogContent>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                type="text"
                                placeholder="Enter circle name"
                                name="circle_name"
                                autoFocus
                                onChange={(e) => setcircle_name(e.target.value)}
                                value={circle_name}
                                error={Boolean(circle_nameError)}
                                helperText={circle_nameError}
                            />
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                    <BootstrapButton type='submit' variant="danger" onClick={closeModalUpdate}>
                                Close
                            </BootstrapButton>
                            <BootstrapButton variant="primary" className="px-4" onClick={updatedCircles}>
                                Save changes
                            </BootstrapButton>
                    </DialogActions>
                </Dialog>
                {/* Delete Circle Dialog */}
                <Dialog open={showDeleteModal} onClose={closeModalDelete} centered maxWidth="md" fullWidth>
                    <DialogTitle>Delete Data</DialogTitle>
                    <DialogContent>
                        <Box className="alert alert-warning" role="alert">
                            Warning! The circle data will be permanently deleted.
                        </Box>
                        <Box className="col-sm-12">
                            <Box className="card">
                                <Box className="card-body">
                                    <Box className="row">
                                        <Typography className="col-4 card-text">Circle Name</Typography>
                                        <Typography className="col-6 card-text">: {circle_name}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </DialogContent>
                    <DialogActions>
                    <BootstrapButton type='submit' variant="danger" onClick={DeleteDataCircle}>
                            Delete
                        </BootstrapButton>
                        <BootstrapButton variant="primary" className="px-4" onClick={closeModalDelete}>Cancel</BootstrapButton>
                    </DialogActions>
                </Dialog>
            </SoftBox>
        </DashboardLayout>
    )
}

export default MyCircle;