import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Card, Typography } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Table from "examples/Tables/Table";
import SoftAvatar from "components/SoftAvatar";
import SuiBadgeDot from "components/SoftBadge";
import SuiBox from "components/SoftBox";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cat from "assets/images/avatar-animal/cat.png";

function MemberCircle() {
  const { id_circle, circle_name } = useParams();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchData = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError("Token not found. Please login again.");
      setLoading(false);
      return;
    }
    const headers = { 'Authorization': `Bearer ${token}` };
    setLoading(true);
    try {
      const response = await axios.get(`http://152.42.188.210:8080/api/auth/circles/${id_circle}/members`, { headers });
      console.log("Response dari server:", response.data);
      setMembers(response.data.data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to fetch data. Please try again.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <ToastContainer />
      <Box display="flex" flexDirection="column" minHeight="100vh" width="100%">
        <Card>
        <Box display="flex" alignItems="center" style={{ position: 'absolute', top: '40px', left: '40px', cursor: 'pointer' }} onClick={() => navigate(-1)}>
              <ArrowBackIcon />
              <Typography variant="h6" color="text" style={{ marginLeft: '8px' }}>Back</Typography>
            </Box>
          <Box py={5} px={5}>
          </Box>
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
              <Table
                columns={[
                  { name: "image", align: "center" },
                  { name: "status", align: "center" },
                  { name: "name", align: "center" },
                ]}
                rows={members.map(item => ({
                  image: <SoftAvatar src={cat} sx={{ width: '32px', height: '32px' }} />,
                  status: (
                    <SuiBox ml={-1.325}>
                      <SuiBadgeDot size="small" badgeContent="member active" />
                    </SuiBox>
                  ),
                  name: item.invited_username,
                }))}
              />
              {loading && <SoftTypography style={{ paddingLeft: '20px' }}>Loading...</SoftTypography>}
            </SoftBox>
          </SoftBox>
        </Card>
      </Box>
    </DashboardLayout>
  );
}

export default MemberCircle;
