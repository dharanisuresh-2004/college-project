// StudentEditOverlay.jsx
import React, { useState, useEffect } from "react";
import "./studentForm.css";

export default function StudentEditOverlay({ student, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    date_of_birth: "",
    department: "CSE",
    year: 2023,
    current_semester: 1,
    address: "",
    contact_no: "",
    emergency_contact_no: "",
    use_college_bus: false,
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        age: student.age || "",
        date_of_birth: student.date_of_birth || "",
        department: student.department || "CSE",
        year: student.year || 2023,
        current_semester: student.current_semester || 1,
        address: student.address || "",
        contact_no: student.contact_no || "",
        emergency_contact_no: student.emergency_contact_no || "",
        use_college_bus: !!student.use_college_bus,
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSave = () => {
    // Send updated data to parent
    onSave(student.id, {
      ...formData,
      age: Number(formData.age),
      year: Number(formData.year),
      current_semester: Number(formData.current_semester),
      use_college_bus: Boolean(formData.use_college_bus),
    });
    onClose();
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <h3>Edit Student - {student.name}</h3>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          value={formData.age}
          onChange={handleChange}
        />
        <input
          type="text"
          name="date_of_birth"
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={formData.date_of_birth}
          onChange={handleChange}
        />
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
        >
          {["CSE", "ECE", "EEE", "MECH", "CIVIL", "IT"].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <input
          type="number"
          name="year"
          placeholder="Year"
          value={formData.year}
          onChange={handleChange}
        />
        <input
          type="number"
          name="current_semester"
          placeholder="Current Semester"
          value={formData.current_semester}
          onChange={handleChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
        />
        <input
          type="text"
          name="contact_no"
          placeholder="Contact No"
          value={formData.contact_no}
          onChange={handleChange}
        />
        <input
          type="text"
          name="emergency_contact_no"
          placeholder="Emergency Contact No"
          value={formData.emergency_contact_no}
          onChange={handleChange}
        />
        <label>
          <input
            type="checkbox"
            name="use_college_bus"
            checked={formData.use_college_bus}
            onChange={handleChange}
          />{" "}
          Use College Bus
        </label>

        <div style={{ display: "flex", justifyContent: "center", gap: "15px", marginTop: "15px" }}>
          <button onClick={handleSave}>Save</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
