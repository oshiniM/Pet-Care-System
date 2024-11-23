import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { Table, Input, Button } from "antd";
import { getUser } from "../../../services/authService";
import { SearchOutlined, FilePdfOutlined } from "@ant-design/icons";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

const { Search } = Input;

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAppointments, setFilteredAppointments] = useState([]);

  const getAppointments = async () => {
    const data = await getUser();
    try {
      const res = await axios.get("http://localhost:5000/api/users/user-appointments", {
        params: {
          userId: data._id
        }
      });
      if (res.data.success) {
        setAppointments(res.data.data);
        setFilteredAppointments(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAppointments();
  }, []);

  useEffect(() => {
    const lowercasedValue = searchQuery.toLowerCase();
    if (!lowercasedValue.trim()) {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter(
        (appointment) =>
          appointment._id.toLowerCase().includes(lowercasedValue) ||
          moment(appointment.date).format("DD-MM-YYYY").includes(lowercasedValue) ||
          moment(appointment.time).format("HH:mm").includes(lowercasedValue) ||
          appointment.status.toLowerCase().includes(lowercasedValue)
      );
      setFilteredAppointments(filtered);
    }
  }, [searchQuery, appointments]);

  const handleSearch = (value) => {
    const lowercasedValue = value.toLowerCase();
    if (!lowercasedValue.trim()) {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter(
        (appointment) =>
          appointment._id.toLowerCase().includes(lowercasedValue) ||
          moment(appointment.date).format("DD-MM-YYYY").includes(lowercasedValue) ||
          moment(appointment.time).format("HH:mm").includes(lowercasedValue) ||
          appointment.status.toLowerCase().includes(lowercasedValue)
      );
      setFilteredAppointments(filtered);
    }
    console.log('Search:', value);
  };
  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredAppointments(appointments); 
    } else {
      const filtered = appointments.filter(
        (appointment) =>
          appointment._id.toLowerCase().includes(searchQuery) ||
          moment(appointment.date).format("DD-MM-YYYY").includes(searchQuery) ||
          moment(appointment.time).format("HH:mm").includes(searchQuery) ||
          appointment.status.toLowerCase().includes(searchQuery)
      );
      setFilteredAppointments(filtered);
    }
  }, [searchQuery, appointments]);

  const columns = [
    {
      title: "ID",
      dataIndex: "_id",
    },
    // {
    //   title: "Name",
    //   dataIndex: "name",
    //   render: (text, record) => (
    //     <span>
    //       {record.doctorInfo.firstName} {record.doctorInfo.lastName}
    //     </span>
    //   ),
    // },
    // {
    //   title: "Phone",
    //   dataIndex: "phone",
    //   render: (text, record) => <span>{record.doctorInfo.phone}</span>,
    // },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => (
        <span>
          {moment(record.date).format("DD-MM-YYYY")} &nbsp;
          {moment(record.time).format("HH:mm")}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const generatePDFReport = () => {
    const doc = new jsPDF();
    
  // Load image from the server or locally
  const loadImage = (url, callback) => {
    const img = new Image();
    img.src = url;
    img.onload = () => callback(img);
    img.onerror = () => {
      console.error('Image loading failed');
      callback(); // Proceed without image
    };
  };
  
    // Function to add content to PDF
    const addContentToPDF = (img) => {
      if (img) {
        doc.addImage(img, 'PNG', 10, 10, 30, 30);
      }
      
      // Define address lines
      const petCareAddressLines = ["E3, Isurupura", "Malabe", "Sri Lanka"];
      let addressYPosition = 50; // Start position for address text
      petCareAddressLines.forEach(line => {
        doc.text(line, 10, addressYPosition);
        addressYPosition += 10;
      });
  
      // Define columns and prepare rows data
      const tableColumn = ["ID", "Date & Time", "Status"];
      const tableRows = filteredAppointments.map(appointment => [
        appointment._id,
        `${moment(appointment.date).format("DD-MM-YYYY")} ${moment(appointment.time).format("HH:mm")}`,
        appointment.status
      ]);
  
      doc.autoTable(tableColumn, tableRows, { startY: addressYPosition + 10 });
  
      const title = "Appointments Report";
      doc.setFontSize(14);
      const titleWidth = doc.getStringUnitWidth(title) * doc.internal.getFontSize() / doc.internal.scaleFactor;
      const titleX = (doc.internal.pageSize.width - titleWidth) / 2;
      doc.text(title, titleX, addressYPosition - 20);
  
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString();
      doc.setFontSize(10);
      doc.text(`Generated on: ${formattedDate}`, 10, doc.internal.pageSize.height - 20);
  
      doc.text("Manager's Signature:", 10, doc.internal.pageSize.height - 10);
      doc.line(60, doc.internal.pageSize.height - 10, 150, doc.internal.pageSize.height - 10);
  
      doc.save("appointments_report.pdf");
    };
  
    // Load the logo image and generate the report
    loadImage('/petLogo.png', addContentToPDF);
  };
  

  return (
    <div>
      <h1>Appointments List</h1>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <Search
          placeholder="Search by ID, Date, Time, or Status"
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          onChange={handleChange}
          style={{ width: 300, height: 40, borderRadius: '4px' }}
        />
        <Button type="primary" icon={<FilePdfOutlined />} onClick={generatePDFReport}>Generate PDF Report</Button>
      </div>
      <Table columns={columns} dataSource={filteredAppointments} />
    </div>
  );
};

export default Appointments;
