import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ApiService from '../../service/ApiService';
import './TurfSearch.css';

const TurfSearch = ({ handleSearchResult }) => {
  const [bookingDate, setBookingDate] = useState(null);
  const [bookingTime, setBookingTime] = useState('');
  const [turfType, setTurfType] = useState('');
  const [turfTypes, setTurfTypes] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);

  const defaultTurfTypes = [
    'Football','Cricket','Basketball','Tennis','Badminton','Volleyball',
    'Hockey','Rugby','Baseball','Soccer','Futsal','Multi-Purpose'
  ];

  const timeSlots = [
    '06:00-08:00','08:00-10:00','10:00-12:00',
    '12:00-14:00','14:00-16:00','16:00-18:00',
    '18:00-20:00','20:00-22:00'
  ];

  const formatDateYYYYMMDD = (d) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  useEffect(() => {
    (async () => {
      try {
        setIsLoadingTypes(true);
        const types = await ApiService.getTurfTypes();
        setTurfTypes(Array.isArray(types) && types.length ? types : defaultTurfTypes);
      } catch {
        setTurfTypes(defaultTurfTypes);
      } finally {
        setIsLoadingTypes(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => setError(''), 5000);
      return () => clearTimeout(t);
    }
  }, [error]);

  const showError = (msg) => setError(msg);
  const clearError = () => { if (error) setError(''); };

  const validateInputs = () => {
    if (!bookingDate) { showError('Please select a booking date.'); return false; }
    const today = new Date(); today.setHours(0,0,0,0);
    const selected = new Date(bookingDate); selected.setHours(0,0,0,0);
    if (selected < today) { showError('Please select a future date.'); return false; }
    if (!bookingTime) { showError('Please select a time slot.'); return false; }
    if (!turfType) { showError('Please select a turf type.'); return false; }
    return true;
  };

  const handleInternalSearch = async () => {
    clearError();
    if (!validateInputs()) return;

    setIsLoading(true);
    try {
      const dateStr = formatDateYYYYMMDD(bookingDate);
      const data = await ApiService.getAvailableTurfsByDateAndType(dateStr, bookingTime, turfType);

      let turfList = [];
      if (data?.statusCode === 200) turfList = data.turfList || [];
      else if (Array.isArray(data)) turfList = data;

      if (typeof handleSearchResult === 'function') {
        handleSearchResult(turfList, dateStr, bookingTime);
      }
    } catch (err) {
      if (err.response?.status === 401) showError('Your session expired. Please login again.');
      else if (err.response?.status === 403) showError('You are not authorized. Please login first.');
      else if (err.response?.status === 404) showError('No turfs available for the selected criteria.');
      else showError(err.response?.data?.message || err.message || 'Search failed. Please try again.');
      if (typeof handleSearchResult === 'function') handleSearchResult([], null, null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="search-section">
      <div className="search-container">
        <div className="search-field">
          <label htmlFor="booking-date">Booking Date</label>
          <DatePicker
            id="booking-date"
            selected={bookingDate}
            onChange={(d) => { setBookingDate(d); clearError(); }}
            dateFormat="dd/MM/yyyy"
            placeholderText="Select Booking Date"
            minDate={new Date()}
            maxDate={(() => { const d = new Date(); d.setMonth(d.getMonth() + 3); return d; })()}
            showPopperArrow={false}
            autoComplete="off"
          />
        </div>

        <div className="search-field">
          <label htmlFor="time-slot">Time Slot</label>
          <select id="time-slot" value={bookingTime} onChange={(e) => { setBookingTime(e.target.value); clearError(); }}>
            <option disabled value="">Select Time Slot</option>
            {timeSlots.map(ts => <option key={ts} value={ts}>{ts}</option>)}
          </select>
        </div>

        <div className="search-field">
          <label htmlFor="turf-type">Turf Type</label>
          <select
            id="turf-type"
            value={turfType}
            onChange={(e) => { setTurfType(e.target.value); clearError(); }}
            disabled={isLoadingTypes}
          >
            <option disabled value="">{isLoadingTypes ? 'Loading turf types...' : 'Select Turf Type'}</option>
            {turfTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        <button
          className={`home-search-button ${isLoading ? 'loading' : ''}`}
          onClick={handleInternalSearch}
          disabled={isLoading || isLoadingTypes}
        >
          {isLoading ? 'Searching...' : 'Search Turfs'}
        </button>
      </div>

      {error && <div className="error-message" role="alert">{error}</div>}
    </section>
  );
};

export default TurfSearch;
