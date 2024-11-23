import React from 'react';
import jsPDF from 'jspdf';
import moment from 'moment';

const Report = ({ appointments }) => {
    const sortedAppointments = [...appointments].sort((a, b) => a._id.localeCompare(b._id));

    const generateReport = (appointment) => {
        const doc = new jsPDF();
        const y = 10;
        
        doc.text(`Date: ${moment(appointment.date).format("DD-MM-YYYY")}`, 10, y + 10);
        doc.text(`Time: ${moment(appointment.time).format("HH:mm")}`, 10, y + 20);
        // Add more details to the report as needed

        doc.save(`${appointment._id}_Report.pdf`);
    };

    return (
        <div>
            {sortedAppointments.map((appointment, index) => (
                <button key={index} onClick={() => generateReport(appointment)}>
                    Generate PDF Report for Appointment ID: {appointment._id}
                </button>
            ))}
        </div>
    );
};

export default Report;
