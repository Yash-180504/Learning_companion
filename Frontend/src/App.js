import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider }   from './context/AppContext';
import Auth              from './pages/Auth';
import Landing           from './pages/Landing';
import Layout            from './components/Layout';
import Dashboard         from './pages/Dashboard';
import StudentProfile    from './pages/StudentProfile';
import DiagnosticQuiz    from './pages/DiagnosticQuiz';
import FlashcardReview   from './pages/FlashcardReview';
import TutorChat         from './pages/TutorChat';
import LearningPath      from './pages/LearningPath';
import './App.css';

const ProtectedRoute = ({ children }) =>
  localStorage.getItem('currentUser') ? children : <Navigate to="/login" replace />;

export default function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/"      element={<Landing />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/app"   element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index                  element={<Dashboard />} />
            <Route path="profile"         element={<StudentProfile />} />
            <Route path="quiz"            element={<DiagnosticQuiz />} />
            <Route path="flashcards"      element={<FlashcardReview />} />
            <Route path="tutor"           element={<TutorChat />} />
            <Route path="learning-path"   element={<LearningPath />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}
