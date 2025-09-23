import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ApiService from "../../service/ApiService";
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // After login, always go to TurfSearch
  const redirectTo = "/turfs";

  // auto-clear error after 5s
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  // if already logged in, redirect
  useEffect(() => {
    if (ApiService.isAuthenticated()) {
      navigate(redirectTo, { replace: true });
    }
  }, [navigate]);

  const validateForm = () => {
    if (!email.trim()) { setError('Please enter your email address.'); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Please enter a valid email address.'); return false; }
    if (!password) { setError('Please enter your password.'); return false; }
    if (password.length < 6) { setError('Password must be at least 6 characters long.'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await ApiService.loginUser({
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.status === 200 && response.data?.token) {
        // store token
        localStorage.setItem("token", response.data.token);

        // optional: decode JWT payload to store role
        try {
          const [, payloadB64] = response.data.token.split(".");
          const json = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
          if (json?.roles) {
            const roles = Array.isArray(json.roles) ? json.roles : Object.values(json.roles);
            if (roles.length) {
              localStorage.setItem("role", roles.includes("ADMIN") ? "ADMIN" : "USER");
            }
          }
        } catch (err) {
          console.warn("JWT decode failed", err);
        }

        // redirect to TurfSearch page
        navigate(redirectTo, { replace: true });
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.status === 401) setError('Invalid email or password.');
      else if (error.response?.status === 403) setError('Access denied.');
      else if (error.response?.status >= 500) setError('Server error. Try again later.');
      else setError(error.response?.data?.message || error.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Login to Turf Management</h2>

        {error && <div className="error-message" role="alert">{error}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleInputChange(setEmail)}
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
                value={password}
                onChange={handleInputChange(setPassword)}
                placeholder="Enter your password"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="register-link">
          Don't have an account?{' '}
          <Link to="/register" state={{ from: location.state?.from }}>
            Register here
          </Link>
        </p>

        <p className="forgot-password-link">
          <Link to="/forgot-password">Forgot your password?</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
