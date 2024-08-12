import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "@mui/material/Card";
import SoftBox from "components/SoftBox";
import SoftTypography from "components/SoftTypography";
import SoftInput from "components/SoftInput";
import SoftButton from "components/SoftButton";
import axios from 'axios';
import BasicLayout from "layouts/authentication/components/BasicLayout";
import curved6 from "assets/images/curved-images/curved14.jpg";
import { jwtDecode } from 'jwt-decode';

function SignUp() {
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(null);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [passwordAgain, setPasswordAgain] = useState("");  
  const [passwordAgainError, setPasswordAgainError] = useState(null);
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('jwtToken');

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name){
      case 'username':
        setUsername(value);
        setUsernameError('');
        break;
      case 'email':
        setEmail(value);
        setEmailError('');
        break;
      case 'password':
        setPassword(value);
        setPasswordError('');
        break;
      case 'passwordAgain':
        setPasswordAgain(value);
        setPasswordAgainError('');
        break;
      default:
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    let usernameError = '';
    let emailError = '';
    let passwordError = '';
    let passwordAgainError = '';

    if (username === ""){
      usernameError = 'Username is required';
    } else if (username.length < 3){
      usernameError = 'Username must be at least 3 characters long';
    }
    if (email === ""){
      emailError = 'Email is required';
    }
    if (password === ""){
      passwordError = 'Password is required';
    } else if (password.length < 8){
      passwordError = 'Password must be at least 8 characters long';
    }
    if (passwordAgain !== password){
      passwordAgainError = 'Passwords do not match';
    }

    setUsernameError(usernameError);
    setEmailError(emailError);
    setPasswordError(passwordError);
    setPasswordAgainError(passwordAgainError);

    if (usernameError || emailError || passwordError || passwordAgainError){
      return;
    }

    try {
      const response = await axios.post(`http://152.42.188.210:8080/api/auth/register`, {
        username: username, 
        email: email, 
        password: password
      });
      const token = response.data.data.token;
      const userId = response.data.data.user_id;
      localStorage.setItem('username', username);
      localStorage.setItem('jwtToken', token);
      localStorage.setItem('userId', userId);
      axios.interceptors.request.use(
        config => {
          const token = localStorage.getItem('jwtToken');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        error => {
          return Promise.reject(error);
        }
      );
      navigate('/dashboard');
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      navigate('/dashboard');
    }
  }, [isLoggedIn, navigate]);

  return (
    <BasicLayout
      title="Welcome!"
      description="Use these awesome forms to login or create new account in your project for free."
      image={curved6}
    >
<Card sx={{ maxWidth: 1000, width: '100%', margin: '0 auto' }}>
        <SoftBox p={3} textAlign="center">
          <SoftTypography variant="h5" fontWeight="medium">
            Register now
          </SoftTypography>
        </SoftBox>
        <SoftBox px={2}>
          <SoftBox component="form" role="form" onSubmit={handleRegister}>
            <SoftBox>
              <SoftBox mb={1} ml={0.5}>
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Username
                </SoftTypography>
              </SoftBox>
              <SoftInput
                type="text"
                name="username"
                placeholder="Username"
                value={username}
                onChange={handleChange}
              />
              {usernameError && (
                <div className="errorMsg" style={{ fontSize: 'smaller', color: 'red' }}>
                  {usernameError}
                </div>
              )}
            </SoftBox>
            <SoftBox>
              <SoftBox mb={1} ml={0.5}>
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Email
                </SoftTypography>
              </SoftBox>
              <SoftInput
                type="email"
                name="email"
                placeholder="Email"
                value={email}
                onChange={handleChange}
              />
              {emailError && (
                <div className="errorMsg" style={{ fontSize: 'smaller', color: 'red' }}>
                  {emailError}
                </div>
              )}
            </SoftBox>
            <SoftBox>
              <SoftBox mb={1} ml={0.5}>
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Password
                </SoftTypography>
              </SoftBox>
              <SoftInput
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={handleChange}
              />
              {passwordError && (
                <div className="errorMsg" style={{ fontSize: 'smaller', color: 'red' }}>
                  {passwordError}
                </div>
              )}
            </SoftBox>
            <SoftBox>
              <SoftBox mb={1} ml={0.5}>
                <SoftTypography component="label" variant="caption" fontWeight="bold">
                  Password Again
                </SoftTypography>
              </SoftBox>
              <SoftInput
                type="password"
                name="passwordAgain"
                placeholder="Password Again"
                value={passwordAgain}
                onChange={handleChange}
              />
              {passwordAgainError && (
                <div className="errorMsg" style={{ fontSize: 'smaller', color: 'red' }}>
                  {passwordAgainError}
                </div>
              )}
            </SoftBox>
            <SoftBox mt={4} mb={1}>
              <SoftButton
                type="submit"
                variant="gradient"
                color="dark"
                fullWidth
                onClick={handleRegister}
              >
                Sign up
              </SoftButton>
            </SoftBox>
            <SoftBox mt={3} textAlign="center">
              <SoftTypography variant="button" color="text" fontWeight="regular">
                Already have an account?&nbsp;
                <SoftTypography
                  component={Link}
                  to="/authentication/sign-in"
                  variant="button"
                  color="dark"
                  fontWeight="bold"
                  textGradient
                >
                  Sign in
                </SoftTypography>
              </SoftTypography>
            </SoftBox>
          </SoftBox>
        </SoftBox>
        <SoftBox pb={3} />
      </Card>
    </BasicLayout>
  );
}

export default SignUp;
