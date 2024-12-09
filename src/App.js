import React from 'react';
import './App.css';
import Prediction from './prediction/prediction';
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
} from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page with Auto-Redirect */}
        <Route path="/" element={<LandingPage />} />

        {/* Prediction Page (Protected Route) */}
        <Route
          path="/prediction"
          element={
            <>
              <SignedIn>
                <Prediction />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

function LandingPage() {
  const { isSignedIn } = useAuth(); // Check the authentication state
  const navigate = useNavigate();

  // Redirect to `/prediction` if already signed in
  React.useEffect(() => {
    if (isSignedIn) {
      navigate('/prediction');
    }
  }, [isSignedIn, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 text-center">
      <div className="max-w-md p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold text-green-600">Lungs Cancer Detection</h1>
        <p className="mt-4 text-gray-600">
          Welcome to our AI-powered lung cancer detection system. Sign in to get started.
        </p>
        <div className="mt-6">
          <SignInButton />
        </div>
      </div>
    </div>
  );
}
