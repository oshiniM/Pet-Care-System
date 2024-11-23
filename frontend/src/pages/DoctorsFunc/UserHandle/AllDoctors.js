import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Input } from "antd";
import DoctorList from "./DoctorList";

const { Search } = Input;

const HomePage = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  // login user data
  const getUserData = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/users/getAllDoctors",

        {
          // headers: {
          //   Authorization: "Bearer " + localStorage.getItem("token"),
          // },
        }
      );
      if (res.data.success) {
        setDoctors(res.data.data);
        setFilteredDoctors(res.data.data); // Initialize filteredDoctors with all doctors
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const handleSearch = (value) => {
    setSearchQuery(value.toLowerCase()); // Ensure search query is in lowercase
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredDoctors(doctors); // If search query is empty, display all doctors
    } else {
      const filtered = doctors.filter(
        (doctor) =>
          doctor.firstName.toLowerCase().includes(searchQuery) ||
          doctor.lastName.toLowerCase().includes(searchQuery) ||
          doctor.specialization.toLowerCase().includes(searchQuery)
      );
      setFilteredDoctors(filtered);
    }
  }, [searchQuery, doctors]);

  return (
<div>
  <h1 className="text-center"><b>Our Great Doctors</b></h1>
 
  <Row>
        <div style={{ float: 'left', marginRight: '10px' }}>
        <Search
          placeholder="Search by doctor name or specialization"
          allowClear
          enterButton={false} // Disable the search button
          size="small"
          onChange={(e) => handleSearch(e.target.value)} // Listen to onChange event and update search query
          style={{
            width: '300px', // Define a fixed width for the search input
            border: '1px solid #1890ff', // Blue border to match Ant Design's color scheme
            borderRadius: '4px', // Rounded corners
            padding: '5px 10px', // Padding inside the search bar for better text visibility
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)', // Subtle shadow for depth
            backgroundColor: '#ffffff', // White background for clarity
            color: '#000000', // Text color
            fontSize: '14px', // Appropriate font size for readability
            transition: 'all 0.3s ease', // Smooth transition for hover and focus effects
            outline: 'none' // Remove default focus outline
          }}
          onMouseOver={({ target }) => target.style.borderColor = '#40a9ff'} // Hover effect to change border color
          onMouseOut={({ target }) => target.style.borderColor = '#1890ff'} // Reset border color on mouse out
          onFocus={({ target }) => target.style.boxShadow = '0 0 0 2px rgba(24, 144, 255, 0.2)'} // Focus effect to enhance visibility
          onBlur={({ target }) => target.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)'} // Reset shadow on blur
        />


        </div>
      </Row>
      <Row>
        {filteredDoctors.map((doctor) => (
          <DoctorList key={doctor._id} doctor={doctor} />
        ))}
      </Row>
</div>
    
  );
};

export default HomePage;
