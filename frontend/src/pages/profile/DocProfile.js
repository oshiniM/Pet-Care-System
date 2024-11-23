import React, { useState, useEffect } from "react";
import "./DocProfile.css"; // Ensure the CSS file is in the same directory or adjust the path as needed
import axios from 'axios'; // Import axios
import Swal from 'sweetalert2'; // Import SweetAlert2
import { useNavigate } from 'react-router-dom';  // Import useNavigate

const DocProfile = () => {
  const [doctorDetails, setDoctorDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();  // Create navigate function

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/v1/doctor/doctorInfo", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch doctor details');
        }

        const data = await response.json();
        setDoctorDetails(data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, []);

  const removeSubject = async (id) => {
    try {
      const isConfirmed = await Swal.fire({
        title: 'Are you sure?',
        text: 'You want to delete this doctor?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      });
  
      if (isConfirmed.isConfirmed) {
        const finalURL = `http://localhost:5000/api/v1/doctor/${id}`;
        await axios.delete(finalURL);  // Deleting the doctor
  
        Swal.fire(
          'Deleted!',
          'The Doctor has been deleted.',
          'success'
        ).then(() => {
          navigate('/login');  // Navigate to the login page
        });
      }
    } catch (error) {
      console.log("Error deleting doctor:", error);
      Swal.fire(
        'Error!',
        'Failed to delete the doctor.',
        'error'
      );
    }
  };

  return (
    <div className="container">
      <h2 className="title">Doctor Details</h2>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error">Error: {error}</p>}
      {doctorDetails && (
        <div className="details">
          <div className="detail-item"><span className="detail-label">First Name:</span><span className="detail-content">{doctorDetails.firstName}</span></div>
          <div className="detail-item"><span className="detail-label">Last Name:</span><span className="detail-content">{doctorDetails.lastName}</span></div>
          <div className="detail-item"><span className="detail-label">Phone:</span><span className="detail-content">{doctorDetails.phone}</span></div>
          <div className="detail-item"><span className="detail-label">Email:</span><span className="detail-content">{doctorDetails.email}</span></div>
          <div className="detail-item"><span className="detail-label">Website:</span><span className="detail-content">{doctorDetails.website}</span></div>
          <div className="detail-item"><span className="detail-label">Address:</span><span className="detail-content">{doctorDetails.address}</span></div>
          <div className="detail-item"><span className="detail-label">Specialization:</span><span className="detail-content">{doctorDetails.specialization}</span></div>
          <div className="detail-item"><span className="detail-label">Fees Per Consultation:</span><span className="detail-content">{doctorDetails.feesPerCunsaltation}</span></div>
          <div className="detail-item"><span className="detail-label">Timings:</span><span className="detail-content">{doctorDetails.timings}</span></div>
        </div>
      )}
        <button className="btn btn-danger form-btn" onClick={() => removeSubject(doctorDetails._id)}>
          Delete
        </button>
    </div>
    
  );
};

export default DocProfile;
