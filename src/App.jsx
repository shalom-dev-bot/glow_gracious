import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Core
import Login from "./pages/Login";
import Register from "./pages/Register";
import Activate from "./pages/Activate";

// Bookings
import BookingList from "./pages/BookingList";
import BookingCreate from "./pages/BookingCreate";

// Events
import EventList from "./pages/EventList";
import EventDetail from "./pages/EventDetail";
import EventCreate from "./pages/EventCreate";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Core - Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/activate/:token" element={<Activate />} />

          {/* Bookings */}
          <Route path="/bookings" element={<BookingList />} />
          <Route path="/bookings/create" element={<BookingCreate />} />

          {/* Events */}
          <Route path="/events" element={<EventList />} />
          <Route path="/events/create" element={<EventCreate />} />
          <Route path="/events/:id" element={<EventDetail />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
