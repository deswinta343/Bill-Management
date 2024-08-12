import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Card } from "@mui/material";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from 'axios';
import AddIcon from "@mui/icons-material/Add";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button as BootstrapButton } from 'react-bootstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import invite from "assets/images/invite.png";
import Table from "examples/Tables/Table";
import SoftAvatar from "components/SoftAvatar";
import cat from "assets/images/avatar-animal/cat.png";
import SuiBadgeDot from "components/SoftBadge";
import SuiBox from "components/SoftBox";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import SearchIcon from '@material-ui/icons/Search';
import { InputAdornment } from '@mui/material';


function InviteCircle() {
  const { id_circle, circle_name } = useParams();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [recommendedUsers, setRecommendedUsers] = useState([]);
  const [circles, setCircles] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState('');
  const [statuses, setStatuses] = useState([]);
  const [creator, setCreator] = useState('');

  console.log("circleId:", id_circle);
  const circleId = id_circle;

  const handleChangeUsername = async (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'username':
        setUsername(value);
        setUsernameError(value.trim() === '' ? '*Username is required' : '');
        break;
      default:
        break;
    }

    if (name === 'username' && value.trim() !== '') {
      setSearchLoading(true);
      const token = localStorage.getItem('jwtToken');
      const headers = { 'Authorization': `Bearer ${token}` };

      try {
        const response = await axios.post(`http://152.42.188.210:8080/api/auth/search_user/${id_circle}`, { keyword: value }, { headers });
        if (response.status === 200) {
          const filteredUsers = response.data.data.filter(user => user.username.toLowerCase().startsWith(value.toLowerCase()));
          setRecommendedUsers(filteredUsers);
        } else {
          throw new Error('Failed to fetch search results');
        }
      } catch (error) {
        console.error("Error searching users:", error);
        toast.error("Failed to fetch search results");
      } finally {
        setSearchLoading(false);
      }
    } else {
      setRecommendedUsers([]);
    }
  };

  const showModalInvite = () => {
    setUsername("");
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
    console.log("id circle :", id_circle);
    try {
      const response = await axios.post(`http://152.42.188.210:8080/api/auth/circles/${id_circle}/invite`, {
        username: username,
      }, { headers });
      console.log(`Inviting username ${username} to circle ${id_circle}`);
      if (response.status === 200) {
        setUsername('');
        setError('');
        closeModalInvite();
        toast.success('Invite successfully');
        console.log('Invite successfully');
        fetchMemberInvite();
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

  const handleClickUser = (user) => {
    setUsername(user.username);
    setSearchKeyword(user.username);
    setRecommendedUsers([]);
  };

  const fetchCreator = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError("Token not found. Please login again.");
      setLoading(false);
      return;
    }
    const headers = { 'Authorization': `Bearer ${token}` };
    setLoading(true);
    try {
      const response = await axios.get(`http://152.42.188.210:8080/index.php/api/auth/get_circle`, { headers });
      console.log("Response dari server:", response.data);
      if (response.data.success && response.data.data.length > 0) {
        setCreator(response.data.data[0].creator_username);
      } else {
        setError("Failed to fetch creator information.");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to fetch data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberInvite = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError("Token not found. Please login again.");
      setLoading(false);
      return;
    }
    const headers = { 'Authorization': `Bearer ${token}` };
    setLoading(true);
    try {
      const response = await axios.get(`http://152.42.188.210:8080/api/auth/circle/${circleId}/member`, { headers });
      console.log("response member invite:", response.data);
      setMembers(response.data.data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to fetch data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCreator();
    fetchMemberInvite();
  }, []);


  return (
    <DashboardLayout>
      <ToastContainer />
      <Box display="flex" flexDirection="column" minHeight="100vh" width="80%">
        <Card>
          <Box py={3} px={3}>
            <Box
              display="flex" flexDirection="column" width="100%" height="80%">
              <Box display="flex" textAlign="center" mb={1}>
                <SoftTypography variant="h6" fontWeight="bold">
                  Pay attention to your inviters. When you invite another user, that user will enter your circle automatically.
                </SoftTypography>
              </Box>
            </Box>
          </Box>
        </Card>
        <SoftBox pb={2} />
        <Card>
          <Box py={8} px={8}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100%"
              height="100%"
            >
              <Box display="flex" alignItems="center" mb={2}>
                <img src={invite} alt="Invitation" style={{ width: '30px', height: '30px', marginRight: '8px' }} />
                <SoftTypography variant="h6" fontWeight="bold">
                  Add a username to join your circle
                </SoftTypography>
              </Box>
              <Box mb={2}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={showModalInvite}>
                  Add Username
                </Button>
              </Box>
            </Box>
          </Box>
        </Card>
        <SoftBox pb={2} />
        <Card>
          <Box py={2} px={2}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              width="100%"
              height="80%"
            >
              <Box display="flex" justifyContent="space-between" alignItems="center" pt={3} px={3}>
                <div>
                  <SoftTypography variant="h6" fontWeight="bold">
                    Member Circle {circle_name}
                  </SoftTypography>
                </div>
              </Box>
              <Box display="flex" textAlign="center" mb={2}>
                <SoftTypography variant="h6">
                  Creator: {creator}
                </SoftTypography>
              </Box>
            </Box>
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
              <>
                <Table
                  columns={[
                    { name: "image", align: "center" },
                    { name: "status", align: "center" },
                    { name: "name", align: "center" },
                  ]}
                  rows={members.map((member) => ({
                    image: <SoftAvatar src={cat} sx={{ width: '32px', height: '32px' }} />,
                    status: (
                            <p>{member.status || 'unknown'}</p>
                    ),
                    name: member.username_invite,
                  }))}
                />
                {loading && <SoftTypography style={{ paddingLeft: '20px' }}>Loading...</SoftTypography>}
              </>
            </SoftBox>
          </SoftBox>
        </Card>
      </Box>
      <Dialog open={showInviteModal} onClose={closeModalInvite} maxWidth="md" fullWidth>
        <DialogTitle>Invite Circle</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <TextField
              type="text"
              placeholder="Enter Username"
              name="username"
              autoFocus
              onChange={handleChangeUsername}
              value={username}
              error={Boolean(usernameError)}
              helperText={usernameError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>

          {searchLoading && <CircularProgress />}
          <List>
            {recommendedUsers.map((user) => (
              <ListItem button key={user.id} onClick={() => handleClickUser(user)}>
                <ListItemAvatar>
                  <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.username} />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <BootstrapButton variant="primary" className="px-4" onClick={handleSubmitInvite}>
            Invite
          </BootstrapButton>
          <BootstrapButton type='submit' variant="danger" onClick={closeModalInvite}>
            Cancel
          </BootstrapButton>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  )
}
export default InviteCircle;
