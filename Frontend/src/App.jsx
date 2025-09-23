import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './component/common/Navbar.jsx';
import FooterComponent from './component/common/Footer.jsx'; // KEEP THIS ONE
import LoginPage from './component/auth/LoginPage.jsx';
import RegisterPage from './component/auth/RegisterPage.jsx';
import HomePage from './component/home/HomePage.jsx';
import AllTurfsPage from './component/booking_turfs/AllTurfsPage.jsx';
import TurfDetailsBookingPage from './component/booking_turfs/TurfDetailsPage.jsx';
import FindBookingPage from './component/booking_turfs/FindBookingPage.jsx';
import AdminPage from './component/admin/AdminPage.jsx';
import ManageTurfPage from './component/admin/ManageTurfPage.jsx';
import EditTurfPage from './component/admin/EditTurfPage.jsx';
import AddTurfPage from './component/admin/AddTurfPage.jsx';
import ManageBookingsPage from './component/admin/ManageBookingPages.jsx';
import EditBookingPage from './component/admin/EditBookingPage.jsx';
import UserProfilePage from './component/profile/UserProfilePage.jsx';
import ModifyProfilePage from './component/profile/ModifyProfilePage.jsx';
import { ProtectedRoute, AdminRoute } from './service/guard.js';



function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            {/* Public Routes */}
            <Route exact path="/home" element={<HomePage />} />
            <Route exact path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/turfs" element={<AllTurfsPage />} />
            <Route path="/find-booking" element={<FindBookingPage />} />

            {/* Protected Routes */}
            <Route path="/turf-details-book/:turfId"
              element={<ProtectedRoute element={<TurfDetailsBookingPage />} />}
            />
            <Route path="/profile"
              element={<ProtectedRoute element={<UserProfilePage />} />}
            />
            <Route path="/modify-profile"
              element={<ProtectedRoute element={<ModifyProfilePage />} />}
            />

            {/* Admin Routes */}
            <Route path="/admin"
              element={<AdminRoute element={<AdminPage />} />}
            />
            <Route path="/admin/manage-turfs"
              element={<AdminRoute element={<ManageTurfPage />} />}
            />
            <Route path="/admin/edit-turf/:turfId"
              element={<AdminRoute element={<EditTurfPage />} />}
            />
            <Route path="/admin/add-turf"
              element={<AdminRoute element={<AddTurfPage />} />}
            />
            <Route path="/admin/manage-bookings"
              element={<AdminRoute element={<ManageBookingsPage />} />}
            />
            <Route path="/admin/edit-booking/:bookingCode"
              element={<AdminRoute element={<EditBookingPage />} />}
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/home" />} />
          </Routes>
        </div>
        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}

export default App;