import './DashboardButtons.css';
import { Link } from 'react-router-dom';

const DashboardButtons = () => {
  return (
    <div className="db-container">
      <h2 className="db-title">Quick Actions</h2>
      <div className="db-grid">
        <Link to="/attendance" className="db-button">Attendance Management</Link>
        <Link to="/student" className="db-button">Student Management</Link>
        <Link to="/library" className="db-button">Library Management</Link>
        <Link to="/events" className="db-button">Event Management</Link>
        <Link to="/grades" className="db-button">Grades Management</Link>
      </div>
    </div>
  );
};

export default DashboardButtons;

