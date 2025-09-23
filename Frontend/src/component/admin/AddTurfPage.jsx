import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const AddTurfPage = () => {
    const navigate = useNavigate();
    const [turfDetails, setTurfDetails] = useState({
        turfPhotoUrl: '',
        turfType: '',
        turfPrice: '',
        turfDescription: '',
        turfName: '',
        capacity: '',
        dimensions: ''
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [turfTypes, setTurfTypes] = useState([]);
    const [newTurfType, setNewTurfType] = useState(false);

    useEffect(() => {
        const fetchTurfTypes = async () => {
            try {
                const types = await ApiService.getTurfTypes();
                setTurfTypes(types);
            } catch (error) {
                console.error('Error fetching turf types:', error.message);
            }
        };
        fetchTurfTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTurfDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleTurfTypeChange = (e) => {
        if (e.target.value === 'new') {
            setNewTurfType(true);
            setTurfDetails(prevState => ({ ...prevState, turfType: '' }));
        } else {
            setNewTurfType(false);
            setTurfDetails(prevState => ({ ...prevState, turfType: e.target.value }));
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setFile(null);
            setPreview(null);
        }
    };

    const addTurf = async () => {
        if (!turfDetails.turfType || !turfDetails.turfPrice || !turfDetails.turfDescription) {
            setError('Turf type, price, and description are required.');
            setTimeout(() => setError(''), 5000);
            return;
        }

        if (!window.confirm('Do you want to add this turf?')) {
            return;
        }

        try {
            const formData = new FormData();
            formData.append('turfType', turfDetails.turfType);
            formData.append('turfPrice', turfDetails.turfPrice);
            formData.append('turfDescription', turfDetails.turfDescription);
            formData.append('turfName', turfDetails.turfName || turfDetails.turfType);
            formData.append('capacity', turfDetails.capacity);
            formData.append('dimensions', turfDetails.dimensions);

            if (file) {
                formData.append('photo', file);
            }

            const result = await ApiService.addTurf(formData);
            if (result.statusCode === 200) {
                setSuccess('Turf added successfully.');
                
                setTimeout(() => {
                    setSuccess('');
                    navigate('/admin/manage-turfs');
                }, 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        }
    };

    return (
        <div className="edit-turf-container">
            <h2>Add New Turf</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            
            <div className="edit-turf-form">
                <div className="form-group">
                    {preview && (
                        <img src={preview} alt="Turf Preview" className="turf-photo-preview" />
                    )}
                    <label>Turf Photo</label>
                    <input
                        type="file"
                        name="turfPhoto"
                        onChange={handleFileChange}
                        accept="image/*"
                    />
                </div>

                <div className="form-group">
                    <label>Turf Name</label>
                    <input
                        type="text"
                        name="turfName"
                        value={turfDetails.turfName}
                        onChange={handleChange}
                        placeholder="e.g., Main Football Field"
                    />
                </div>

                <div className="form-group">
                    <label>Turf Type</label>
                    <select value={turfDetails.turfType} onChange={handleTurfTypeChange}>
                        <option value="">Select a turf type</option>
                        {turfTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                        <option value="new">Other (please specify)</option>
                    </select>
                    {newTurfType && (
                        <input
                            type="text"
                            name="turfType"
                            placeholder="Enter new turf type"
                            value={turfDetails.turfType}
                            onChange={handleChange}
                        />
                    )}
                </div>

                <div className="form-group">
                    <label>Price per Hour ($)</label>
                    <input
                        type="number"
                        name="turfPrice"
                        value={turfDetails.turfPrice}
                        onChange={handleChange}
                        placeholder="e.g., 50"
                        min="0"
                    />
                </div>

                <div className="form-group">
                    <label>Capacity (Players)</label>
                    <input
                        type="number"
                        name="capacity"
                        value={turfDetails.capacity}
                        onChange={handleChange}
                        placeholder="e.g., 14"
                        min="1"
                    />
                </div>

                <div className="form-group">
                    <label>Dimensions</label>
                    <input
                        type="text"
                        name="dimensions"
                        value={turfDetails.dimensions}
                        onChange={handleChange}
                        placeholder="e.g., 100m x 60m"
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="turfDescription"
                        value={turfDetails.turfDescription}
                        onChange={handleChange}
                        placeholder="Describe the turf features, surface type, etc."
                        rows="4"
                    ></textarea>
                </div>

                <button className="add-button" onClick={addTurf}>Add Turf</button>
            </div>
        </div>
    );
};

export default AddTurfPage;