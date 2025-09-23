import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';
import DatePicker from 'react-datepicker';

const TurfDetailsPage = () => {
  const navigate = useNavigate();
  const { turfId } = useParams();
  const [turfDetails, setTurfDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingDate, setBookingDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState('');
  const [numPlayers, setNumPlayers] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [userId, setUserId] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Time slots for booking
  const timeSlots = [
    '06:00-08:00', '08:00-10:00', '10:00-12:00', 
    '12:00-14:00', '14:00-16:00', '16:00-18:00', 
    '18:00-20:00', '20:00-22:00'
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getTurfById(turfId);
        setTurfDetails(response.turf || response);
        const userProfile = await ApiService.getUserProfile();
        setUserId(userProfile.user.id);
      } catch (error) {
        setError(error.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [turfId]);

  const handleConfirmBooking = async () => {
    if (!bookingDate || !timeSlot) {
      setErrorMessage('Please select booking date and time slot.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    if (isNaN(numPlayers) || numPlayers < 1) {
      setErrorMessage('Please enter a valid number of players.');
      setTimeout(() => setErrorMessage(''), 5000);
      return;
    }

    // Calculate total price based on turf price per hour
    const turfPricePerHour = turfDetails.turfPrice;
    const [startTime] = timeSlot.split('-');
    const duration = 2; // Assuming 2-hour slots
    const totalPrice = turfPricePerHour * duration;

    setTotalPrice(totalPrice);
  };

  const acceptBooking = async () => {
    try {
      const formattedBookingDate = new Date(bookingDate.getTime() - (bookingDate.getTimezoneOffset() * 60000)).toISOString().split('T')[0];

      const booking = {
        bookingDate: formattedBookingDate,
        timeSlot: timeSlot,
        numOfPlayers: numPlayers,
        duration: 2 // Assuming 2-hour slots
      };

      const response = await ApiService.bookTurf(turfId, userId, booking);
      if (response.statusCode === 200) {
        setConfirmationCode(response.bookingConfirmationCode);
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false);
          navigate('/turfs');
        }, 10000);
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || error.message);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  if (isLoading) {
    return <p className='turf-detail-loading'>Loading turf details...</p>;
  }

  if (error) {
    return <p className='turf-detail-loading'>{error}</p>;
  }

  if (!turfDetails) {
    return <p className='turf-detail-loading'>Turf not found.</p>;
  }

  const { turfName, turfType, turfPrice, turfPhotoUrl, turfDescription, capacity, dimensions, bookings } = turfDetails;

  return (
    <div className="turf-details-booking">
      {showMessage && (
        <p className="booking-success-message">
          Booking successful! Confirmation code: {confirmationCode}. An SMS and email of your booking details have been sent to you.
        </p>
      )}
      {errorMessage && (
        <p className="error-message">
          {errorMessage}
        </p>
      )}
      <h2>Turf Details</h2>
      <br />
      <img src={turfPhotoUrl} alt={turfName || turfType} className="turf-details-image" />
      <div className="turf-details-info">
        <h3>{turfName || turfType}</h3>
        <p>Type: {turfType}</p>
        <p>Price: ${turfPrice} / hour</p>
        {capacity && <p>Capacity: {capacity} players</p>}
        {dimensions && <p>Dimensions: {dimensions}</p>}
        <p>{turfDescription}</p>
      </div>
      {bookings && bookings.length > 0 && (
        <div>
          <h3>Existing Booking Details</h3>
          <ul className="booking-list">
            {bookings.map((booking, index) => (
              <li key={booking.id} className="booking-item">
                <span className="booking-number">Booking {index + 1} </span>
                <span className="booking-text">Date: {booking.bookingDate} </span>
                <span className="booking-text">Time: {booking.timeSlot}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className="booking-info">
        <button className="book-now-button" onClick={() => setShowBookingForm(true)}>Book Now</button>
        <button className="go-back-button" onClick={() => setShowBookingForm(false)}>Go Back</button>
        {showBookingForm && (
          <div className="booking-form-container">
            <DatePicker
              className="detail-search-field"
              selected={bookingDate}
              onChange={(date) => setBookingDate(date)}
              placeholderText="Booking Date"
              dateFormat="dd/MM/yyyy"
            />
            
            <div className="time-slot-div">
              <label>Time Slot:</label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
              >
                <option value="">Select Time Slot</option>
                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>

            <div className='players-container'>
              <div className="players-div">
                <label>Number of Players:</label>
                <input
                  type="number"
                  min="1"
                  max={capacity || 20}
                  value={numPlayers}
                  onChange={(e) => setNumPlayers(parseInt(e.target.value))}
                />
              </div>
              <button className="confirm-booking" onClick={handleConfirmBooking}>Calculate Price</button>
            </div>
          </div>
        )}
        {totalPrice > 0 && (
          <div className="total-price">
            <p>Total Price: ${totalPrice}</p>
            <p>Number of Players: {numPlayers}</p>
            <p>Time Slot: {timeSlot}</p>
            <button onClick={acceptBooking} className="accept-booking">Confirm Booking</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TurfDetailsPage;