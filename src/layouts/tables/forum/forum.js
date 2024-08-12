import React, { useState, useEffect, useRef } from 'react';
import { Box, Card, Typography, TextField, Avatar } from '@mui/material';
import SoftTypography from "components/SoftTypography";
import SoftBox from 'components/SoftBox';
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import axios from 'axios';
import { Button as BootstrapButton } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import AvatarGroup from 'assets/images/avatar-animal/avatarGroup.png';
import Pusher from "pusher-js";

function Chat() {
    const [isLoading, setIsLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const { circleId, circle_name } = useParams();
    const [error, setError] = useState('');
    const [members, setMembers] = useState([]);
    const username = localStorage.getItem('username');
    const [messageText, setMessageText] = useState('');
    const messagesEndRef = useRef(null);

    const fetchMessages = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError("Token not found. Please login again.");
            setIsLoading(false);
            return;
        }
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            const response = await axios.get(`http://152.42.188.210:8080/api/auth/circles/${circleId}/messages`, { headers });
            console.log('Full API response:', response);
            setMessages(response.data?.chats || []);
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
        fetchMessages();
        const intervalId = setInterval(fetchMessages, 5000);

        return () => clearInterval(intervalId);
    }, [circleId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const DataMember = async () => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            setError("Token not found. Please login again.");
            setIsLoading(false);
            return;
        }
        const headers = { 'Authorization': `Bearer ${token}` };
        setIsLoading(true);
        try {
            const response = await axios.get(`http://152.42.188.210:8080/api/auth/circles/${circleId}/members`, { headers });
            console.log("Response dari server:", response.data);
            setMembers(response.data.data);
            setIsLoading(false);
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("Failed to fetch data. Please try again.");
            }
            setIsLoading(false);
        }
    };

    useEffect(() => {
        DataMember();
    }, [circleId]);

    const displayMembers = () => {
        const limit = 5;
        const displayedMembers = members.slice(0, limit).map((member) => member.invited_username).join(', ');
        return members.length > limit ? `${displayedMembers}, ...` : displayedMembers;
    };

    const renderMessages = () => {
        console.log('Rendering messages:', messages);
        if (messages.length === 0) {
            return <SoftTypography variant="body2">No messages here yet, Start now!</SoftTypography>;
        }

        return messages.map((message) => {
            const isCurrentUser = message.user.username === username;
            return (
                <SoftBox
                    key={message.id}
                    display="flex"
                    justifyContent={isCurrentUser ? 'flex-end' : 'flex-start'}
                    mb={2}
                >
                    <Card style={{ marginBottom: '15px', padding: '10px', width: 'fit-content' }}>
                        <SoftBox display="flex" alignItems="center">
                            <Avatar style={{ marginRight: '10px' }}>
                                {message.user.username.charAt(0).toUpperCase()}
                            </Avatar>
                            <SoftBox display="flex" flexDirection="column" alignItems="flex-start">
                                <SoftTypography variant="body2" fontWeight="bold">
                                    {message.user.username}
                                </SoftTypography>
                                <SoftTypography variant="body2">
                                    {message.message}
                                </SoftTypography>
                            </SoftBox>
                        </SoftBox>
                    </Card>
                </SoftBox>
            );
        });
    };

    const handleMessageChange = (e) => {
        setMessageText(e.target.value);
    };

    const handleSendMessage = async () => {
        const token = localStorage.getItem('jwtToken');
        const headers = { 'Authorization': `Bearer ${token}` };
        try {
            await axios.post(`http://152.42.188.210:8080/api/auth/circles/${circleId}/messages`, { message: messageText }, { headers });
            setMessageText('');
            fetchMessages();
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    return (
        <DashboardLayout>
            <Card>
                <SoftBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={3}>
                    <SoftBox display="flex" alignItems="center">
                        <img src={AvatarGroup} alt="time" style={{ marginLeft: '5px', marginRight: '5px', width: '30px', height: '30px' }} />
                        <SoftTypography variant="h6" fontWeight="bold" ml={2}>
                            Forum {circle_name}
                        </SoftTypography>
                    </SoftBox>
                </SoftBox>
                <SoftBox pb={3} px={3}>
                    <SoftTypography variant="body2">
                        {isLoading ? 'Loading...' : displayMembers()}
                    </SoftTypography>
                    {error && <SoftTypography color="error">{error}</SoftTypography>}
                </SoftBox>
            </Card>
            <SoftBox pb={2} />
            <SoftBox
                pb={2}
                px={3}
                flex={1}
                display="flex"
                flexDirection="column"
                height="calc(100vh - 200px)"
                overflow="auto"
            >
                {isLoading ? (
                    <SoftTypography>Loading...</SoftTypography>
                ) : (
                    renderMessages()
                )}
                {error && <SoftTypography color="error">{error}</SoftTypography>}
                <div ref={messagesEndRef} />
            </SoftBox>
            <Box
                mt={2}
                display="flex"
                p={2}
                style={{
                    position: 'fixed',
                    bottom: 0,
                    width: '80%',
                    backgroundColor: 'white',
                    boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Box
                    mr={2}
                    display="flex"
                    alignItems="center"
                >
                    <BootstrapButton variant="primary" className="px-4" onClick={handleSendMessage}>
                        Send
                    </BootstrapButton>
                </Box>
                <TextField
                    placeholder='Type your message'
                    value={messageText}
                    onChange={handleMessageChange}
                    multiline
                    rows={1}
                    variant="outlined"
                    fullWidth
                    style={{ marginRight: '8px', width: '80%', fontSize: '14px' }}
                />
            </Box>
        </DashboardLayout>
    );
}

export default Chat;
