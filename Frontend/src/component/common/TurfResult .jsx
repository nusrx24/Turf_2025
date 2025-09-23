import React, { useState } from 'react';
import TurfBooking from './TurfBooking';
import './TurfResult.css';

const TurfResult = ({ turfSearchResults, searchDate, searchTime }) => {
  const [selectedTurf, setSelectedTurf] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(null);

  // Normalize turf data to ensure consistent format (same as TurfSearch)
  const normalizeTurfData = (turfList) => {
    if (!Array.isArray(turfList)) {
      console.warn('Expected array but received:', typeof turfList, turfList);
      return [];
    }

    return turfList.map(turf => {
      const normalizedTurf = {
        // ID fields
        id: turf.id || turf.turfId || turf._id || Math.random().toString(36).substr(2, 9),
        
        // Name fields
        name: turf.name || turf.turfName || turf.title || 'Unknown Turf',
        
        // Location/Area fields
        area: turf.area || turf.location || turf.address || 'Location not specified',
        location: turf.location || turf.area || turf.address || 'Location not specified',
        
        // Sport/Type fields
        sportType: turf.sportType || turf.sport || turf.type || turf.turfType || 'Not specified',
        turfType: turf.turfType || turf.sportType || turf.sport || turf.type || 'Not specified',
        
        // Price fields
        pricePerSlot: turf.pricePerSlot || turf.price || turf.cost || turf.rate || 0,
        price: turf.price || turf.pricePerSlot || turf.cost || turf.rate || 0,
        
        // Image fields
        image: turf.image || turf.imageUrl || turf.photo || turf.turfPhotoUrl || null,
        turfPhotoUrl: turf.turfPhotoUrl || turf.image || turf.imageUrl || turf.photo || null,
        
        // Additional fields
        description: turf.description || turf.desc || '',
        size: turf.size || turf.dimensions || null,
        capacity: turf.capacity || turf.maxPlayers || null,
        amenities: turf.amenities || turf.facilities || [],
        facilities: turf.facilities || turf.amenities || [],
        rating: turf.rating || turf.avgRating || null,
        
        // Availability
        isAvailable: turf.isAvailable !== undefined ? turf.isAvailable : true
      };

      return normalizedTurf;
    });
  };

  // Handle booking button click
  const handleBookNow = (turf) => {
    setSelectedTurf(turf);
    setShowBookingModal(true);
  };

  // Handle successful booking
  const handleBookingSuccess = (bookingDetails) => {
    setBookingSuccess(bookingDetails);
    setShowBookingModal(false);
    
    // Show success message for 5 seconds
    setTimeout(() => {
      setBookingSuccess(null);
    }, 5000);
  };

  // Close booking modal
  const closeBookingModal = () => {
    setShowBookingModal(false);
    setSelectedTurf(null);
  };

  // Format price display
  const formatPrice = (price) => {
  const numPrice = Number(price);

  if (isNaN(numPrice) || numPrice <= 0) {
    return 'Contact for price';
  }

  return new Intl.NumberFormat('en-LK', {
    style: 'currency',
    currency: 'LKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numPrice);
};


  // Format date display
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // If no search results
  if (!turfSearchResults || turfSearchResults.length === 0) {
    return null;
  }

  // Normalize the results to handle different data formats
  const normalizedResults = normalizeTurfData(turfSearchResults);

  return (
    <section className="turf-results-section">
      {/* Success Message */}
      {bookingSuccess && (
        <div className="booking-success-message" role="alert">
          <div className="success-icon">✅</div>
          <div className="success-content">
            <h4>Booking Confirmed!</h4>
            <p>
              Your booking for {bookingSuccess.turf?.name || bookingSuccess.turf?.turfType} on {formatDateDisplay(bookingSuccess.date)} 
              at {bookingSuccess.time} has been confirmed.
            </p>
            <p>
              <strong>Booking ID:</strong> {bookingSuccess.bookingId}
            </p>
            <p>
              <strong>Total Amount:</strong> {formatPrice(bookingSuccess.totalPrice)}
            </p>
          </div>
        </div>
      )}

      <div className="results-header">
        <h3>Available Turfs</h3>
        <p className="results-count">
          {normalizedResults.length} turf{normalizedResults.length !== 1 ? 's' : ''} found
          {searchDate && searchTime && (
            <span> for {formatDateDisplay(searchDate)} at {searchTime}</span>
          )}
        </p>
      </div>

      <div className="turf-results-grid">
        {normalizedResults.map((turf) => (
          <div key={turf.id} className="turf-card">
            {/* Turf Image */}
            <div className="turf-image">
              {turf.turfPhotoUrl ? (
                <img 
                  src={turf.turfPhotoUrl} 
                  alt={`${turf.name} - ${turf.turfType}`}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div 
                className="image-placeholder" 
                style={{ display: turf.turfPhotoUrl ? 'none' : 'flex' }}
              >
                <span>🏟️</span>
                <p>No Image Available</p>
              </div>
            </div>

            {/* Turf Details */}
            <div className="turf-details">
              <div className="turf-header">
                <h4 className="turf-name">{turf.name}</h4>
                <div className="turf-price">{formatPrice(turf.price)}</div>
              </div>

              <div className="turf-type-badge">
                <span>{turf.turfType}</span>
              </div>

              <div className="turf-info">
                {turf.location && (
                  <div className="info-item">
                    <span className="info-icon">📍</span>
                    <span>{turf.location}</span>
                  </div>
                )}
                
                {turf.size && (
                  <div className="info-item">
                    <span className="info-icon">📏</span>
                    <span>{turf.size}</span>
                  </div>
                )}
                
                {turf.capacity && (
                  <div className="info-item">
                    <span className="info-icon">👥</span>
                    <span>Up to {turf.capacity} players</span>
                  </div>
                )}

                {turf.rating && (
                  <div className="info-item">
                    <span className="info-icon">⭐</span>
                    <span>{turf.rating}/5</span>
                  </div>
                )}
              </div>

              {turf.description && (
                <div className="turf-description">
                  <p>{turf.description}</p>
                </div>
              )}

              {/* Amenities */}
              {turf.amenities && turf.amenities.length > 0 && (
                <div className="turf-amenities">
                  <h5>Amenities:</h5>
                  <div className="amenities-list">
                    {turf.amenities.slice(0, 4).map((amenity, index) => (
                      <span key={index} className="amenity-tag">
                        {amenity}
                      </span>
                    ))}
                    {turf.amenities.length > 4 && (
                      <span className="amenity-tag more">
                        +{turf.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Availability Status */}
              <div className="availability-status">
                <span className={`status-indicator ${turf.isAvailable ? 'available' : 'unavailable'}`}></span>
                <span>{turf.isAvailable ? 'Available for booking' : 'Currently unavailable'}</span>
              </div>

              {/* Action Buttons */}
              <div className="turf-actions">
                <button 
                  className="book-now-button"
                  onClick={() => handleBookNow(turf)}
                  disabled={!turf.isAvailable}
                >
                  {turf.isAvailable ? 'Book Now' : 'Not Available'}
                </button>
                <button 
                  className="details-button"
                  onClick={() => console.log('View details for:', turf)}
                >
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedTurf && (
        <TurfBooking
          turf={selectedTurf}
          selectedDate={searchDate}
          selectedTime={searchTime}
          onClose={closeBookingModal}
          onBookingSuccess={handleBookingSuccess}
        />
      )}
    </section>
  );
};

export default TurfResult;