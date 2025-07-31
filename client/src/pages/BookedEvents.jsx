import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";

export default function BookedEvents() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const ticketRefs = useRef([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/payment/mybookings", {
          withCredentials: true,
        });
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const downloadPDF = async (index) => {
    const ticketElement = ticketRefs.current[index];
    if (!ticketElement) return;

    const canvas = await html2canvas(ticketElement, { scale: 2 }); // better quality
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Event_Ticket_${index + 1}.pdf`);
  };

  if (loading) return <div className="p-4">Loading bookings...</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6">🎟️ My Booked Events</h2>

      {bookings.length === 0 ? (
        <p>You haven't booked any events yet.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking, index) => (
            <div
              key={booking._id}
              ref={(el) => (ticketRefs.current[index] = el)}
              className="border border-gray-300 p-6 rounded-lg shadow-md bg-white relative"
            >
              <h3 className="text-xl font-semibold mb-2">{booking.eventTitle}</h3>
              <p><strong>Organized By:</strong> {booking.ownerName}</p>
              <p><strong>Date:</strong> {new Date(booking.eventDateTime).toLocaleString()}</p>
              <p><strong>Amount:</strong> ₹{booking.amount}</p>
              <p><strong>Payment ID:</strong> {booking.paymentId}</p>
              <p><strong>Booking Code:</strong> {booking.bookingCode}</p>
              <p><strong>Booked On:</strong> {new Date(booking.createdAt).toLocaleString()}</p>

              <button
                onClick={() => downloadPDF(index)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              >
                Download Ticket
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
