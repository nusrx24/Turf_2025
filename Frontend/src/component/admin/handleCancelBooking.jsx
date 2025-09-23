import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditBookingPage = () => {
    const navigate = useNavigate();
    const { bookingCode } = useParams();
    const [bookingDetails, setBookingDetails] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccessMessage] = useState('');
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const response = await ApiService.getBookingByConfirmationCode(bookingCode);
                setBookingDetails(response.booking);
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };

        fetchBookingDetails();
    }, [bookingCode]);

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to cancel this booking?')) {
            return;
        }

        setIsCancelling(true);
        try {
            const response = await ApiService.cancelBooking(bookingId);
            if (response.statusCode === 200) {
                setSuccessMessage("Booking was successfully cancelled");
                
                setTimeout(() => {
                    setSuccessMessage('');
                    navigate('/admin/manage-bookings');
                }, 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsCancelling(false);
        }
    };

    if (!bookingDetails) {
        return <div className="loading">Loading booking details...</div>;
    }

    return (
        <div className="edit-booking-page">
            <h2>Booking Details</h2>
            {error && <p className='error-message'>{error}</p>}
            {success && <p className='success-message'>{success}</p>}
            
            {bookingDetails && (
                <div className="booking-details-card">
                    <h3>Booking Information</h3>
                    <div className="booking-info-grid">
                        <div className="info-item">
                            <strong>Confirmation Code:</strong>
                            <span>{bookingDetails.bookingConfirmationCode}</span>
                        </div>
                        <div className="info-item">
                            <strong>Booking Date:</strong>
                            <span>{bookingDetails.bookingDate}</span>
                        </div>
                        <div className="info-item">
                            <strong>Time Slot:</strong>
                            <span>{bookingDetails.timeSlot}</span>
                        </div>
                        <div className="info-item">
                            <strong>Duration:</strong>
                            <span>{bookingDetails.duration} hours</span>
                        </div>
                        <div className="info-item">
                            <strong>Number of Players:</strong>
                            <span>{bookingDetails.numOfPlayers}</span>
                        </div>
                        <div className="info-item">
                            <strong>Total Amount:</strong>
                            <span>${bookingDetails.totalAmount}</span>
                        </div>
                        <div className="info-item">
                            <strong>Status:</strong>
                            <span className={`status status-${bookingDetails.status?.toLowerCase()}`}>
                                {bookingDetails.status}
                            </span>
                        </div>
                    </div>

                    <hr />
                    
                    <h3>Customer Details</h3>
                    <div className="customer-info-grid">
                        <div className="info-item">
                            <strong>Name:</strong>
                            <span>{bookingDetails.user?.name}</span>
                        </div>
                        <div className="info-item">
                            <strong>Email:</strong>
                            <span>{bookingDetails.user?.email}</span>
                        </div>
                        <div className="info-item">
                            <strong>Phone Number:</strong>
                            <span>{bookingDetails.user?.phoneNumber}</span>
                        </div>
                    </div>

                    <hr />
                    
                    <h3>Turf Details</h3>
                    <div className="turf-info-grid">
                        <div className="info-item">
                            <strong>Turf Name:</strong>
                            <span>{bookingDetails.turf?.turfName}</span>
                        </div>
                        <div className="info-item">
                            <strong>Turf Type:</strong>
                            <span>{bookingDetails.turf?.turfType}</span>
                        </div>
                        <div className="info-item">
                            <strong>Price per Hour:</strong>
                            <span>${bookingDetails.turf?.turfPrice}</span>
                        </div>
                        {bookingDetails.turf?.capacity && (
                            <div className="info-item">
                                <strong>Capacity:</strong>
                                <span>{bookingDetails.turf.capacity} players</span>
                            </div>
                        )}
                        {bookingDetails.turf?.dimensions && (
                            <div className="info-item">
                                <strong>Dimensions:</strong>
                                <span>{bookingDetails.turf.dimensions}</span>
                            </div>
                        )}
                    </div>
                    
                    {bookingDetails.turf?.turfPhotoUrl && (
                        <div className="turf-photo">
                            <img src={bookingDetails.turf.turfPhotoUrl} alt={bookingDetails.turf.turfName} />
                        </div>
                    )}

                    {bookingDetails.status !== 'CANCELLED' && (
                        <div className="booking-actions">
                            <button
                                className="cancel-booking-button"
                                onClick={() => handleCancelBooking(bookingDetails.id)}
                                disabled={isCancelling}
                            >
                                {isCancelling ? 'Cancelling...' : 'Cancel Booking'}
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default EditBookingPage;