import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../service/ApiService';

const EditTurfPage = () => {
    const { turfId } = useParams();
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
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchTurfDetails = async () => {
            try {
                const response = await ApiService.getTurfById(turfId);
                const turf = response.turf || response;
                setTurfDetails({
                    turfPhotoUrl: turf.turfPhotoUrl,
                    turfType: turf.turfType,
                    turfPrice: turf.turfPrice,
                    turfDescription: turf.turfDescription,
                    turfName: turf.turfName || '',
                    capacity: turf.capacity || '',
                    dimensions: turf.dimensions || ''
                });
            } catch (error) {
                setError(error.response?.data?.message || error.message);
            }
        };
        fetchTurfDetails();
    }, [turfId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTurfDetails(prevState => ({
            ...prevState,
            [name]: value,
        }));
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

    const handleUpdate = async () => {
        setIsLoading(true);
        setError('');
        setSuccess('');
        
        try {
            const formData = new FormData();
            formData.append('turfType', turfDetails.turfType);
            formData.append('turfPrice', turfDetails.turfPrice);
            formData.append('turfDescription', turfDetails.turfDescription);
            formData.append('turfName', turfDetails.turfName);
            formData.append('capacity', turfDetails.capacity);
            formData.append('dimensions', turfDetails.dimensions);

            if (file) {
                formData.append('photo', file);
            }

            const result = await ApiService.updateTurf(turfId, formData);
            if (result.statusCode === 200) {
                setSuccess('Turf updated successfully.');
                
                setTimeout(() => {
                    setSuccess('');
                    navigate('/admin/manage-turfs');
                }, 3000);
            }
        } catch (error) {
            setError(error.response?.data?.message || error.message);
            setTimeout(() => setError(''), 5000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this turf? This action cannot be undone.')) {
            setIsLoading(true);
            try {
                const result = await ApiService.deleteTurf(turfId);
                if (result.statusCode === 200) {
                    setSuccess('Turf deleted successfully.');
                    
                    setTimeout(() => {
                        setSuccess('');
                        navigate('/admin/manage-turfs');
                    }, 3000);
                }
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                setTimeout(() => setError(''), 5000);
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="edit-turf-container">
            <h2>Edit Turf</h2>
            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
            
            <div className="edit-turf-form">
                <div className="form-group">
                    <label>Turf Photo</label>
                    {preview ? (
                        <img src={preview} alt="Turf Preview" className="turf-photo-preview" />
                    ) : (
                        turfDetails.turfPhotoUrl && (
                            <img src={turfDetails.turfPhotoUrl} alt="Turf" className="turf-photo" />
                        )
                    )}
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
                    <input
                        type="text"
                        name="turfType"
                        value={turfDetails.turfType}
                        onChange={handleChange}
                        placeholder="e.g., Football, Cricket, Multi-sport"
                    />
                </div>

                <div className="form-group">
                    <label>Price per Hour ($)</label>
                    <input
                        type="number"
                        name="turfPrice"
                        value={turfDetails.turfPrice}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                    />
                </div>

                <div className="form-group">
                    <label>Capacity (Players)</label>
                    <input
                        type="number"
                        name="capacity"
                        value={turfDetails.capacity}
                        onChange={handleChange}
                        min="1"
                        placeholder="Maximum number of players"
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
                        rows="4"
                        placeholder="Describe the turf features, surface type, amenities, etc."
                    ></textarea>
                </div>

                <div className="form-buttons">
                    <button 
                        className="update-button" 
                        onClick={handleUpdate}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : 'Update Turf'}
                    </button>
                    <button 
                        className="delete-button" 
                        onClick={handleDelete}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete Turf'}
                    </button>
                    <button 
                        className="cancel-button" 
                        onClick={() => navigate('/admin/manage-turfs')}
                        disabled={isLoading}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditTurfPage;