import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import './RegisterPage.css';

function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');

  // auto-clear messages
  useEffect(() => {
    if (errorMessage) {
      const t = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(t);
    }
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage) {
      const t = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(t);
    }
  }, [successMessage]);

  // redirect if already logged in
  useEffect(() => {
    if (ApiService.isAuthenticated?.()) {
      navigate('/home', { replace: true });
    }
  }, [navigate]);

  const checkPasswordStrength = (password) => {
    if (password.length < 6) return 'weak';
    if (password.length < 10 && !/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/.test(password)) return 'medium';
    if (password.length >= 10 && /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9])/.test(password)) return 'strong';
    return 'medium';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));

    if (errorMessage) setErrorMessage('');
    if (name === 'password') setPasswordStrength(checkPasswordStrength(value));
  };

  const validateForm = () => {
    const { fullName, email, password } = formData;

    if (!fullName.trim()) { setErrorMessage('Please enter your full name.'); return false; }
    if (fullName.trim().length < 2) { setErrorMessage('Name must be at least 2 characters long.'); return false; }

    if (!email.trim()) { setErrorMessage('Please enter your email address.'); return false; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) { setErrorMessage('Please enter a valid email address.'); return false; }

    if (!password) { setErrorMessage('Please enter a password.'); return false; }
    if (password.length < 6) { setErrorMessage('Password must be at least 6 characters long.'); return false; }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const cleanedData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      };

      const response = await ApiService.registerUser(cleanedData);

      // backend returns 200 OK with no body in our setup
      if (response?.status === 200 || response?.statusCode === 200) {
        setFormData({ fullName: '', email: '', password: '' });
        setPasswordStrength('');
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login', {
            state: {
              from: location.state?.from,
              message: 'Registration successful! Please log in with your credentials.'
            }
          });
        }, 1500);
      } else {
        setErrorMessage('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response?.status === 409) {
        setErrorMessage('An account with this email already exists. Please use a different email or try logging in.');
      } else if (error.response?.status >= 500) {
        setErrorMessage('Server error. Please try again later.');
      } else {
        setErrorMessage(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 'weak': return 'Weak password';
      case 'medium': return 'Medium strength';
      case 'strong': return 'Strong password';
      default: return '';
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {errorMessage && <div className="error-message" role="alert">{errorMessage}</div>}
        {successMessage && <div className="success-message" role="alert">{successMessage}</div>}

        <h2>Create Account</h2>
        <p className="auth-subtitle">Join our turf management system</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
              disabled={isLoading}
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              required
              disabled={isLoading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a secure password"
                required
                disabled={isLoading}
                minLength={6}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {formData.password && (
              <div className={`password-strength ${passwordStrength}`}>
                {getPasswordStrengthText()}
              </div>
            )}
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p className="register-link">
          Already have an account?{' '}
          <Link to="/login" state={{ from: location.state?.from }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
