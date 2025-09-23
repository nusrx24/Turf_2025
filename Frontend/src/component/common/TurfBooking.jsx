import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import './TurfBooking.css';

const TurfBooking = ({ turf, selectedDate, selectedTime, onClose, onBookingSuccess }) => {
  const [bookingData, setBookingData] = useState({
    guestName: '',
    guestEmail: '',
    phoneNumber: '',
    numberOfGuests: 1,
    specialRequests: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if user is authenticated and get user details
  useEffect(() => {
    const checkUser = async () => {
      if (ApiService.isAuthenticated()) {
        try {
          const userProfile = await ApiService.getUserProfile();
          setUser(userProfile.user);
          // Pre-fill form with user data
          setBookingData(prev => ({
            ...prev,
            guestName: userProfile.user.name || '',
            guestEmail: userProfile.user.email || '',
            phoneNumber: userProfile.user.phoneNumber || ''
          }));
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }
    };
    checkUser();
  }, []);

  // Calculate total price
  const calculateTotalPrice = () => {
    const basePrice = turf.price || 0;
    const guestCount = parseInt(bookingData.numberOfGuests) || 1;
    // Add extra charge for additional guests (if any)
    const extraGuestCharge = guestCount > 1 ? (guestCount - 1) * 50 : 0;
    return basePrice + extraGuestCharge;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  // Validate booking form
  const validateBooking = () => {
    const { guestName, guestEmail, phoneNumber, numberOfGuests } = bookingData;

    if (!guestName.trim()) {
      setError('Please enter guest name.');
      return false;
    }

    if (!guestEmail.trim()) {
      setError('Please enter email address.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (!phoneNumber.trim()) {
      setError('Please enter phone number.');
      return false;
    }

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phoneNumber.replace(/[\s\-\(\)]/g, ''))) {
      setError('Please enter a valid phone number.');
      return false;
    }

    if (!numberOfGuests || numberOfGuests < 1 || numberOfGuests > 20) {
      setError('Number of guests must be between 1 and 20.');
      return false;
    }

    return true;
  };

  // Handle booking submission
  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!validateBooking()) {
      return;
    }

    // Check if user is authenticated
    if (!ApiService.isAuthenticated()) {
      const confirmLogin = window.confirm(
        'You need to be logged in to make a booking. Would you like to login now?'
      );
      if (confirmLogin) {
        navigate('/login', { 
          state: { 
            from: { pathname: '/home' },
            bookingData: {
              turf,
              selectedDate,
              selectedTime,
              guestDetails: bookingData
            }
          }
        });
      }
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const bookingRequest = {
        turfId: turf.id,
        checkInDate: selectedDate,
        checkOutDate: selectedDate, // Same day booking for turf
        timeSlot: selectedTime,
        numberOfGuests: parseInt(bookingData.numberOfGuests),
        guestName: bookingData.guestName.trim(),
        guestEmail: bookingData.guestEmail.trim().toLowerCase(),
        phoneNumber: bookingData.phoneNumber.replace(/[\s\-\(\)]/g, ''),
        specialRequests: bookingData.specialRequests.trim() || null,
        totalPrice: calculateTotalPrice()
      };

      const response = await ApiService.bookTurf(bookingRequest);

      if (response.statusCode === 200) {
        // Success! Show confirmation and close modal
        if (onBookingSuccess) {
          onBookingSuccess({
            bookingId: response.bookingConfirmationCode,
            turf: turf,
            date: selectedDate,
            time: selectedTime,
            totalPrice: calculateTotalPrice()
          });
        }
        onClose();
      }
    } catch (error) {
      console.error('Booking error:', error);
      
      if (error.response?.status === 409) {
        setError('This time slot is no longer available. Please select a different time.');
      } else if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(
          error.response?.data?.message || 
          error.message || 
          'Booking failed. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
        <div className="booking-header">
          <h3>Book {turf.turfType} Turf</h3>
          <button className="close-button" onClick={onClose} aria-label="Close booking form">
            ✕
          </button>
        </div>

        <div className="booking-summary">
          <div className="summary-item">
            <span className="label">Turf:</span>
            <span className="value">{turf.turfType}</span>
          </div>
          <div className="summary-item">
            <span className="label">Date:</span>
            <span className="value">{selectedDate}</span>
          </div>
          <div className="summary-item">
            <span className="label">Time:</span>
            <span className="value">{selectedTime}</span>
          </div>
          <div className="summary-item">
            <span className="label">Base Price:</span>
            <span className="value">₹{turf.price}</span>
          </div>
        </div>

        {error && (
          <div className="error-message" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleBooking} className="booking-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="guestName">Guest Name *</label>
              <input
                id="guestName"
                type="text"
                name="guestName"
                value={bookingData.guestName}
                onChange={handleInputChange}
                placeholder="Enter guest name"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="numberOfGuests">Number of Guests *</label>
              <input
                id="numberOfGuests"
                type="number"
                name="numberOfGuests"
                value={bookingData.numberOfGuests}
                onChange={handleInputChange}
                min="1"
                max="20"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="guestEmail">Email Address *</label>
              <input
                id="guestEmail"
                type="email"
                name="guestEmail"
                value={bookingData.guestEmail}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number *</label>
              <input
                id="phoneNumber"
                type="tel"
                name="phoneNumber"
                value={bookingData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="specialRequests">Special Requests (Optional)</label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              value={bookingData.specialRequests}
              onChange={handleInputChange}
              placeholder="Any special requirements or requests..."
              rows="3"
              disabled={isLoading}
            />
          </div>

          <div className="total-price">
            <span className="price-label">Total Price:</span>
            <span className="price-value">₹{calculateTotalPrice()}</span>
          </div>

          <div className="booking-actions">
            <button type="button" onClick={onClose} className="cancel-button" disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="book-button" disabled={isLoading}>
              {isLoading ? 'Booking...' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TurfBooking;