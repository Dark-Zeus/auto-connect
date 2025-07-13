import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  CircularProgress,
  Fade,
  Alert,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Google as GoogleIcon,
  ArrowForward,
} from "@mui/icons-material";

import { UserContext } from "../contexts/UserContext";
import axios from "../utils/axios";
import "./LoginForm.css";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUserContext } = useContext(UserContext);

  const [formData, setFormData] = useState({
    email: "", // Changed from staffLoginId to email to match your backend
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post("/auth/login", formData);

      if (response.data?.success === true) {
        localStorage.setItem("token", response.data.token);
        setUserContext(response.data.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.data.user));

        toast.success(
          response.data?.message || "Welcome back! Login successful"
        );
        navigate("/dashboard");
      } else {
        toast.error(response.data?.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Login failed. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    const googleAuthUrl = `${
      import.meta.env.VITE_REACT_APP_BACKEND_API_URL
    }/auth/oauth/google`;
    window.open(googleAuthUrl, "_blank", "width=500,height=600");

    const handleMessage = (event) => {
      if (event.origin !== import.meta.env.VITE_REACT_APP_BACKEND_API_URL)
        return;

      try {
        const data = JSON.parse(event.data);
        if (data.accessToken) {
          localStorage.setItem("token", data.accessToken);
          setUserContext(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));

          toast.success("Google authentication successful!");
          navigate("/dashboard");
        }
      } catch (error) {
        toast.error("Google authentication failed");
      }

      window.removeEventListener("message", handleMessage);
    };

    window.addEventListener("message", handleMessage);
  };

  return (
    <div className="login-form-container">
      <Fade in={true} timeout={800}>
        <Paper className="login-form-paper" elevation={0}>
          <Box className="login-form-header">
            <Typography variant="h4" className="form-title">
              Welcome Back
            </Typography>
            <Typography variant="body1" className="form-subtitle">
              Sign in to your account to continue
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit} className="login-form">
            <TextField
              fullWidth
              name="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon className="input-icon" />
                  </InputAdornment>
                ),
              }}
              className="form-input"
              variant="outlined"
              placeholder="Enter your email address"
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon className="input-icon" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      className="visibility-icon"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              className="form-input"
              variant="outlined"
              placeholder="Enter your password"
            />

            <Box className="forgot-password-container">
              <Link to="/auth/forgot-password" className="forgot-password-link">
                Forgot your password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              className="login-button"
              disabled={isLoading}
              startIcon={
                isLoading ? <CircularProgress size={20} /> : <LoginIcon />
              }
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>

            <Divider className="divider">
              <Typography variant="body2" className="divider-text">
                or continue with
              </Typography>
            </Divider>

            <Button
              fullWidth
              variant="outlined"
              className="google-button"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              Continue with Google
            </Button>
          </Box>

          <Box className="form-footer">
            <Typography variant="body2" className="footer-text">
              Don't have an account?{" "}
              <Link to="/auth/register" className="register-link">
                Sign up here
                <ArrowForward className="arrow-icon" />
              </Link>
            </Typography>
          </Box>

          <Box className="form-bottom-links">
            <Link to="/terms" className="bottom-link">
              Terms & Conditions
            </Link>
            <Link to="/help" className="bottom-link">
              Help Center
            </Link>
          </Box>
        </Paper>
      </Fade>
    </div>
  );
};

export default LoginForm;
