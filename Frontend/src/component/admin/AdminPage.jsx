import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ApiService from '../../service/ApiService';

const AdminPage = () => {
    const [adminName, setAdminName] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminName = async () => {
            try {
                const response = await ApiService.getUserProfile();
                setAdminName(response.user.name);
            } catch (error) {
                console.error('Error fetching admin details:', error.message);
            }
        };

        fetchAdminName();
    }, []);

    return (
        <div className="admin-page">
            <h1 className="welcome-message">Welcome, {adminName}</h1>
            <p className="admin-subtitle">Turf Management System Administrator</p>
            
            <div className="admin-actions">
                <div className="admin-action-card" onClick={() => navigate('/admin/manage-turfs')}>
                    <div className="admin-icon">⚽</div>
                    <h3>Manage Turfs</h3>
                    <p>Add, edit, or remove turf facilities</p>
                </div>
                
                <div className="admin-action-card" onClick={() => navigate('/admin/manage-bookings')}>
                    <div className="admin-icon">📅</div>
                    <h3>Manage Bookings</h3>
                    <p>View and manage all turf bookings</p>
                </div>
                
                <div className="admin-action-card" onClick={() => navigate('/admin/manage-users')}>
                    <div className="admin-icon">👥</div>
                    <h3>Manage Users</h3>
                    <p>View and manage user accounts</p>
                </div>
                
                <div className="admin-action-card" onClick={() => navigate('/admin/reports')}>
                    <div className="admin-icon">📊</div>
                    <h3>Reports & Analytics</h3>
                    <p>View booking statistics and reports</p>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;