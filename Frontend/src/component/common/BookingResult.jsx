import React from 'react';
import { Link } from 'react-router-dom';

const BookingResult = ({ bookingSearchResults }) => {
  return (
    <div className="booking-results">
      {bookingSearchResults.length > 0 ? (
        bookingSearchResults.map((booking) => (
          <div key={booking.id} className="booking-result-item">
            <p><strong>Booking Code:</strong> {booking.bookingConfirmationCode}</p>
            <p><strong>Turf:</strong> {booking.turf?.turfName || booking.turfId}</p>
            <p><strong>User:</strong> {booking.user?.name || booking.userId}</p>
            <p><strong>Date:</strong> {booking.bookingDate}</p>
            <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
            <p><strong>Duration:</strong> {booking.duration} hours</p>
            <p><strong>Players:</strong> {booking.numOfPlayers}</p>
            <p><strong>Status:</strong> 
              <span className={`status status-${booking.status?.toLowerCase() || 'confirmed'}`}>
                {booking.status || 'Confirmed'}
              </span>
            </p>
            <p><strong>Total Amount:</strong> ${booking.totalAmount}</p>
            
            <Link to={`/admin/edit-booking/${booking.bookingConfirmationCode}`} className="edit-link">
              Manage Booking
            </Link>
          </div>
        ))
      ) : (
        <p className="no-bookings-message">No bookings found</p>
      )}
    </div>
  );
};

export default BookingResult;