// src/service/ApiService.js
import axios from "axios";

export default class ApiService {
  // use Vite env if available, else fallback
  static BASE_URL = import.meta?.env?.VITE_API_BASE || "http://localhost:8080/api";

  static getHeader() {
    const token = localStorage.getItem("token");
    return {
      Authorization: token ? `Bearer ${token}` : undefined,
      "Content-Type": "application/json",
    };
  }

  /** AUTH **/

  static async registerUser(registration) {
    // backend expects: { fullName, email, password }
    const response = await axios.post(`${this.BASE_URL}/auth/register`, registration, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true, // let us inspect non-2xx
    });
    // normalize so UI can check status or message
    return { status: response.status, data: response.data };
  }

  static async loginUser(loginDetails) {
    // backend returns: { token: "..." }
    const response = await axios.post(`${this.BASE_URL}/auth/login`, loginDetails, {
      headers: { "Content-Type": "application/json" },
      validateStatus: () => true,
    });

    if (response.status === 200 && response.data?.token) {
      const token = response.data.token;
      localStorage.setItem("token", token);

      // (optional) extract roles from JWT claim and store a simple role flag
      try {
        const [, payloadB64] = token.split(".");
        const json = JSON.parse(atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/")));
        // jwt claim was Map<String, Set<Role>>; store first role if present
        const roles = Array.isArray(json?.roles) ? json.roles : (json?.roles ? Array.from(json.roles) : []);
        if (roles?.length) {
          // store one role string for your isAdmin/isUser helpers
          localStorage.setItem("role", roles.includes("ADMIN") ? "ADMIN" : "USER");
        }
      } catch (_) { /* ignore parse errors */ }
    }

    return { status: response.status, data: response.data };
  }

  /** USERS **/
  static async getAllUsers() {
    const response = await axios.get(`${this.BASE_URL}/users/all`, { headers: this.getHeader() });
    return response.data;
  }
  static async getUserProfile() {
    const response = await axios.get(`${this.BASE_URL}/users/get-logged-in-profile-info`, { headers: this.getHeader() });
    return response.data;
  }
  static async getUser(userId) {
    const response = await axios.get(`${this.BASE_URL}/users/get-by-id/${userId}`, { headers: this.getHeader() });
    return response.data;
  }
  static async getUserBookings(userId) {
    const response = await axios.get(`${this.BASE_URL}/users/get-user-bookings/${userId}`, { headers: this.getHeader() });
    return response.data;
  }
  static async deleteUser(userId) {
    const response = await axios.delete(`${this.BASE_URL}/users/delete/${userId}`, { headers: this.getHeader() });
    return response.data;
  }

/** TURFS **/

static async addTurf(formData) {
  const result = await axios.post(`${this.BASE_URL}/turfs/add`, formData, {
    headers: { ...this.getHeader(), "Content-Type": "multipart/form-data" },
  });
  return result.data;
}

static async getTurfTypes() {
  const response = await axios.get(`${this.BASE_URL}/turfs/types`, {
    headers: this.getHeader(),
  });
  return response.data;
}

static async getAvailableTurfsByDateAndType(bookingDate, bookingTime, turfType) {
  const response = await axios.get(
    `${this.BASE_URL}/turfs/available-turfs-by-date-and-type`,
    {
      params: { bookingDate, bookingTime, turfType }, // safer than manual string concat
      headers: this.getHeader(),
    }
  );
  return response.data;
}

static async getAllAvailableTurfs() {
  const response = await axios.get(`${this.BASE_URL}/turfs/all-available-turfs`, {
    headers: this.getHeader(),
  });
  return response.data;
}

static async getAllTurfs() {
  const response = await axios.get(`${this.BASE_URL}/turfs/all`, {
    headers: this.getHeader(),
  });
  return response.data;
}

static async getTurfById(turfId) {
  const response = await axios.get(`${this.BASE_URL}/turfs/turf-by-id/${turfId}`, {
    headers: this.getHeader(),
  });
  return response.data;
}

static async deleteTurf(turfId) {
  const result = await axios.delete(`${this.BASE_URL}/turfs/delete/${turfId}`, {
    headers: this.getHeader(),
  });
  return result.data;
}

static async updateTurf(turfId, formData) {
  const result = await axios.put(`${this.BASE_URL}/turfs/update/${turfId}`, formData, {
    headers: { ...this.getHeader(), "Content-Type": "multipart/form-data" },
  });
  return result.data;
}

  /** BOOKINGS (later) **/
  static async bookTurf(turfId, userId, booking) {
    const response = await axios.post(`${this.BASE_URL}/bookings/book-turf/${turfId}/${userId}`, booking, {
      headers: this.getHeader(),
    });
    return response.data;
  }
  static async getAllBookings() {
    const result = await axios.get(`${this.BASE_URL}/bookings/all`, { headers: this.getHeader() });
    return result.data;
  }
  static async getBookingByConfirmationCode(bookingCode) {
    const result = await axios.get(`${this.BASE_URL}/bookings/get-by-confirmation-code/${bookingCode}`);
    return result.data;
  }
  static async cancelBooking(bookingId) {
    const result = await axios.delete(`${this.BASE_URL}/bookings/cancel/${bookingId}`, { headers: this.getHeader() });
    return result.data;
  }

  /** AUTH CHECKS **/
  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  }
  static isAuthenticated() {
    const token = localStorage.getItem("token");
    return !!token;
  }
  static isAdmin() {
    const role = localStorage.getItem("role");
    return role === "ADMIN";
  }
  static isUser() {
    const role = localStorage.getItem("role");
    return role === "USER";
  }
}
