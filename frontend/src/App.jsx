import { useState } from 'react'
import './App.css'
import HomePage from './mainpage/homePage.jsx'
import ErrorPage from './mainpage/errorPage.jsx';
import Attendance from './mainpage/attendance/attendance.jsx';
import Students from './mainpage/students/students.jsx';
import NavBar from './navBar.jsx';
import EventsPage from './mainpage/eventsPage/eventsPage.jsx';
import Grades from './mainpage/gradesPage/gradesPage.jsx';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import LibraryPage from './mainpage/libraryPage/libraryPage.jsx';

function App() {

  return (
    <>
      <div style={{
        background: 'radial-gradient(1200px 600px at 10% 10%, rgba(99,102,241,0.08), transparent), linear-gradient(180deg, #0f172a 0%, #071033 100%)',
        minHeight: '100vh'
      }}>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/student" element={<Students />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/grades" element={<Grades />} />
            <Route path="/library" element={<LibraryPage />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </div>
    </>
  )
}

export default App
