import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import axios from '../utils/axios';

import RightIconRectInput from "./atoms/RightIconRectInput";
import IconButton from "./atoms/IconButton";

import { UserContext } from "../contexts/UserContext";

import "../css/login-form.css"

import { ReactComponent as GoogleIcon } from '../images/google-icon.svg';



function RegisterForm() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("-");
    const [repPassword, setRepPassword] = useState("");

    const [emailError, setEmailError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [repPasswordError, setRepPasswordError] = useState(null);

    const { userContext, setUserContext } = useContext(UserContext)



    const googleAuth = (event) => {
        event.preventDefault();
        const googleAuthUrl = process.env.REACT_APP_BACKEND_URL + "/auth/oauth/googleoauth";
        window.open(googleAuthUrl, "_blank", "width=500,height=500");
    }
  };

  // Password strength calculation
  useEffect(() => {
    const calculatePasswordStrength = (password) => {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (/[a-z]/.test(password)) strength += 15;
      if (/[A-Z]/.test(password)) strength += 15;
      if (/[0-9]/.test(password)) strength += 15;
      if (/[^A-Za-z0-9]/.test(password)) strength += 30;
      return Math.min(strength, 100);
    };

    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 30) return "#e74c3c";
    if (passwordStrength < 60) return "#f39c12";
    if (passwordStrength < 80) return "#f1c40f";
    return "#27ae60";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  const validateForm = () => {
    const newErrors = {};

    // Step 0: Basic Info
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else {
      const phoneRegex = /^[0-9+\-\s()]+$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    if (!formData.role) {
      newErrors.role = "Please select a user role";
    }

    // Step 1: Address
    if (!formData.street.trim()) {
      newErrors.street = "Street address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.district.trim()) {
      newErrors.district = "District is required";
    }
    if (!formData.province.trim()) {
      newErrors.province = "Province is required";
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }

    // Step 2: Role-specific validation
    if (requiresBusinessInfo) {
      if (!formData.businessName.trim()) {
        newErrors.businessName = "Business name is required";
      }
      if (!formData.licenseNumber.trim()) {
        newErrors.licenseNumber = "License number is required";
      }
      if (!formData.businessRegistrationNumber.trim()) {
        newErrors.businessRegistrationNumber =
          "Business registration number is required";
      }
      if (!formData.taxIdentificationNumber.trim()) {
        newErrors.taxIdentificationNumber =
          "Tax identification number is required";
      }
    }

    if (requiresPoliceInfo) {
      if (!formData.badgeNumber.trim()) {
        newErrors.badgeNumber = "Badge number is required";
      }
      if (!formData.department.trim()) {
        newErrors.department = "Department is required";
      }
      if (!formData.rank.trim()) {
        newErrors.rank = "Rank is required";
      }
    }

    // Step 3: Security
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (passwordStrength < 60) {
      newErrors.password =
        "Password is too weak. Please choose a stronger password";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    // Validate current step before proceeding
    const stepValidations = {
      0: ["firstName", "lastName", "email", "phone", "role"],
      1: ["street", "city", "district", "province", "postalCode"],
      2: requiresBusinessInfo
        ? [
            "businessName",
            "licenseNumber",
            "businessRegistrationNumber",
            "taxIdentificationNumber",
          ]
        : requiresPoliceInfo
        ? ["badgeNumber", "department", "rank"]
        : [],
      3: ["password", "confirmPassword"],
    };

    const fieldsToValidate = stepValidations[currentStep] || [];
    const stepErrors = {};

    fieldsToValidate.forEach((field) => {
      if (!formData[field] || !formData[field].toString().trim()) {
        stepErrors[field] = `This field is required`;
      }
    });

    // Additional validations for current step
    if (currentStep === 0) {
      if (
        formData.email &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
      ) {
        stepErrors.email = "Please enter a valid email address";
      }
      if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
        stepErrors.phone = "Please enter a valid phone number";
      }
    }

    if (currentStep === 3) {
      if (passwordStrength < 60) {
        stepErrors.password = "Password is too weak";
      }
      if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = "Passwords do not match";
      }
      if (!acceptTerms) {
        stepErrors.terms = "You must accept the terms and conditions";
      }
    }

    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      toast.error("Please fix the errors before proceeding");
      return;
    }

    setErrors({});
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const addService = () => {
    const newService = prompt("Enter service name:");
    if (newService && newService.trim()) {
      setFormData((prev) => ({
        ...prev,
        servicesOffered: [...prev.servicesOffered, newService.trim()],
      }));
    }
  };

  const removeService = (index) => {
    setFormData((prev) => ({
      ...prev,
      servicesOffered: prev.servicesOffered.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors below");
      return;
    }

        setRepPasswordError(null);
    }, [repPassword, password]);


    return (
        <>
            <form action="" onSubmit={register} className="register-form form auth-form">
                <div className="form-title">Register</div>
                <RightIconRectInput extraClass={`content-${emailError ? false : true}`} onChange={setEmail} placeholder="example@email.com" icon="email"
                    inputLabel={
                        <div className="password__label">
                            <span>Email</span>
                            <span className="error right-label">{emailError ? <div>{emailError}</div> : null}</span>
                        </div>
                    }
                    required />
                <br />
                <RightIconRectInput extraClass={`content-${passwordError ? false : true}`} onChange={setPassword} type="password" placeholder="Enter atleast 8 characters" icon="lock"
                    inputLabel={
                        <div className="password__label">
                            <span>Password</span>
                            <span className="error right-label">{passwordError ? <div>{passwordError}</div> : null}</span>
                        </div>
                    }
                    required />
                <RightIconRectInput extraClass={`content-${repPasswordError ? false : true}`} onChange={setRepPassword} type="password" placeholder="Repeat Password" icon="lock"
                    inputLabel={
                        <div className="password__label">
                            <span>Repeat Password</span>
                            <span className="error right-label">{repPasswordError ? <div>{repPasswordError}</div> : null}</span>
                        </div>
                    }
                    required />
                <br />
                <IconButton content={"Register"} type="submit" extraClass={"btn-borderw-1 btn-borderc-747775 btn-margin login-btn"} />
                <div className="h-divider"></div>
                <IconButton icon="google" onClick={googleAuth} iconb={<GoogleIcon />} w="max" extraClass="google-auth-btn btn-margin" content={"Continue with Google"} />
            </form>
            <div className="form-bottom-bar">
                <div>T&C</div>
                <div>Help</div>
                <div className="register-link"><Link to="/auth/login"><span>Login</span><span className="register__icon">arrow_forward</span></Link></div>
            </div>
        </>
    );
}

export default RegisterForm;
