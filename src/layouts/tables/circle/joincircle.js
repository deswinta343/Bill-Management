import React, { useState, useEffect } from 'react';
import Card from "@mui/material/Card";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { IconButton } from '@mui/material';
import { Modal, Form } from "react-bootstrap";
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
import SoftInput from "components/SoftInput";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
} from "@coreui/react";
import "bootstrap/dist/css/bootstrap.min.css";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import SuiBadgeDot from "components/SoftBadge";
import SuiBox from "components/SoftBox";
import Table from "examples/Tables/Table";
import SoftAvatar from "components/SoftAvatar";
import team2 from "assets/images/team2.jpg";
import Tooltip from "@mui/material/Tooltip";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import ChatIcon from '@mui/icons-material/Chat';
import GroupIcon from '@mui/icons-material/Group';

function JoinCircle() {
    const [circles, setCircles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [circle_name, setcircle_name] = useState("");
    const [id_circle, setId_Circle] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredCircles, setFilteredCircles] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError("Token not found. Please login again.");
            setLoading(false);
            return;
        }
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const response = await axios.get('http://152.42.188.210:8080/api/auth/invited-circles', { headers });
            console.log("Response dari server:", response.data);
            response.data.data.forEach(circle => {
                console.log(circle.creator_username);
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
                        <SoftTypography variant="h6" fontWeight="bold">
                            Circle Join
                        </SoftTypography>
                        <div>
                            <SoftInput
                                placeholder="Type here..."
                                icon={{ component: "search", direction: "left" }}
                                value={searchTerm}
                                onChange={handleSearchChange}
                            />
                        </div>
                    </SoftBox>

                    <SoftBox pb={3} />
                    <SoftBox>
                        <SoftBox
                            sx={{
                                "& .MuiTableRow-root:not(:last-child)": {
                                    "& td": {
                                        borderBottom: ({ borders: { borderWidth, borderColor } }) => `${borderWidth[1]} solid ${borderColor}`,
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
                                                { name: "member", align: "center" },
                                            ]}
                                            rows={filteredCircles.map(circle => ({
                                                image: <SoftAvatar src={team2} />,
                                                circle: (<Tooltip title="view event">
                                                    <Link to={`/EventJoin/${circle.id_circle}/${circle.circle_name}`}>
                                                        {circle.circle_name}
                                                    </Link>
                                                </Tooltip>),
                                                  creator: <SuiBadgeDot size="small" badgeContent={circle.creator_username ? circle.creator_username : "Unknown Creator"} />
                                                  ,
  forum: (
    <Tooltip title="Go forum">
    <Link to={`/Chat/${circle.id_circle}/${circle.circle_name}`}>
    <ChatIcon fontSize="medium" />
    </Link>
</Tooltip>
),
                                                member: (
                                                    <Tooltip title="view member">
                                                        <Link to={`/MemberCircle/${circle.id_circle}/${circle.circle_name}`}>
                                                            <GroupIcon fontSize="medium"/>
                                                        </Link>
                                                    </Tooltip>
                                                ),
                                              

                                            }))}
                                        />
                                    ) : (
                                        <SoftTypography style={{ paddingLeft: '20px' }}>Circle not found</SoftTypography>
                                    )
                                )}
                                {error && <SoftTypography style={{ paddingLeft: '20px' }}>{error}</SoftTypography>}
                            </>
                        </SoftBox>
                    </SoftBox>
                </Card>
            </SoftBox>
        </DashboardLayout>
    )
}

export default JoinCircle;