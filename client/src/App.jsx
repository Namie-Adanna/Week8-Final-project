import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Placeholder components for routes we'll build later
const Dashboard = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Dashboard - Coming Soon</h1></div>;
const BookService = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Book Service - Coming Soon</h1></div>;
const Bookings = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">My Bookings - Coming Soon</h1></div>;
const Profile = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Profile - Coming Soon</h1></div>;
const Admin = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Admin Panel - Coming Soon</h1></div>;
const About = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">About - Coming Soon</h1></div>;
const Contact = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">Contact - Coming Soon</h1></div>;
const NotFound = () => <div className="min-h-screen flex items-center justify-center"><h1 className="text-2xl">404 - Page Not Found</h1></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/book/:serviceId"
                element={
                  <ProtectedRoute>
                    <BookService />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bookings"
                element={
                  <ProtectedRoute>
                    <Bookings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute adminOnly>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>

        {/* Toast Notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: '#22c55e',
              },
            },
            error: {
              duration: 5000,
              theme: {
                primary: '#ef4444',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;