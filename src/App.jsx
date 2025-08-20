import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Activate from "./pages/Activate";
import EventsList from "./pages/EventsList";
import EventsDetail from "./pages/EventsDetail";
import EventsCreate from "./pages/EventsCreate";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Contact from "./pages/Contact";
import BookingList from "./pages/BookingList";
import BookingCreate from "./pages/BookingCreate";
import PackagesList from "./pages/PackagesList";
import Announcements from "./pages/Announcements";
import Testimonials from "./pages/Testimonials";
import PaymentList from "./pages/PaymentList";
import PaymentCreate from "./pages/PaymentCreate";
import PaymentDetail from "./pages/PaymentDetail";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-black flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/activate/:token" element={<Activate />} />
              <Route path="/events" element={<EventsList />} />
              <Route path="/events/:id" element={<EventsDetail />} />
              <Route path="/events/create" element={<EventsCreate />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/bookings" element={<BookingList />} />
              <Route path="/bookings/create" element={<BookingCreate />} />
              <Route path="/bookings/create/:eventId" element={<BookingCreate />} />
              <Route path="/packages" element={<PackagesList />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/payments" element={<PaymentList />} />
              <Route path="/payments/create" element={<PaymentCreate />} />
              <Route path="/payments/create/:bookingId" element={<PaymentCreate />} />
              <Route path="/payments/:id" element={<PaymentDetail />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
