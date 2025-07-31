import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AiFillCalendar } from "react-icons/ai";
import { MdLocationPin } from "react-icons/md";
import { FaCopy, FaWhatsappSquare, FaFacebook } from "react-icons/fa";
import { UserContext } from "../UserContext"; // ✅ Make sure this path is correct

export default function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const { user } = useContext(UserContext); // ✅ Access the logged-in user
  const [ticketBooked, setTicketBooked] = useState(false);

//  useEffect(()=>{
//   if(!user){
//     Navigate('/register')
//   }
//  })

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:5000/api/events/getEvent/${id}`)
      .then((response) => {
        setEvent(response.data.event);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
      });
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard!");
  };

  const handleWhatsAppShare = () => {
    const message = encodeURIComponent(window.location.href);
    window.open(`https://wa.me/?text=${message}`, "_blank");
  };

  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
  };
  function generateBookingCode() {
  return 'BOOK-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}
const handlePayment = async () => {
  
  if (!user) {
    alert("Please login to book this event.");
    return;
  }

  try {
    const orderRes = await axios.post("http://localhost:5000/api/payment/create-order", {
      amount: event.ticketPrice,
      receipt: `receipt_${Date.now()}`,
    });

    const order = orderRes.data;
    const bookingCode = generateBookingCode(); // Moved outside for consistent use

    const options = {
      key: "rzp_test_pon8019ZLdKFBb",
      amount: order.amount,
      currency: order.currency,
      name: "Event Ticket",
      description: event.title,
      image: "https://yourlogo.com/logo.png",
      order_id: order.id,
      handler: async function (response) {
        try {
          await axios.post("http://localhost:5000/api/payment/save-payment", {
            user: user?._id,
            event: event._id, // ✅ Fixed here
            eventTitle: event.title,
            ownerName: event.organizedBy,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            amount: order.amount / 100, // optional: convert paise to rupees
            receipt: order.receipt,
            bookingCode,
          });

          alert(`Booking confirmed! Your code: ${bookingCode}`);
          setTicketBooked(true);
        } catch (err) {
          console.error("Error saving payment:", err);
          alert("Payment saved but booking storage failed.");
        }
      },
      prefill: {
        name: user.name || "User",
        email: user.email || "email@example.com",
        contact: user.phone || "0000000000",
      },
      notes: {
        event_id: event._id,
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    console.error("Payment initiation error:", err);
    alert("Failed to initialize payment.");
  }
};


  if (!event) return <div className="text-center mt-20 text-gray-500">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto mt-10 p-4 bg-white shadow-md rounded-lg">
      {event.image && (
        <img
          src={`http://localhost:5000/${event.image.replace("\\", "/")}`}
          alt={event.title}
          className="w-full h-64 object-cover rounded-md mb-6"
        />
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h1 className="text-3xl md:text-4xl font-bold text-primary">{event.title}</h1>
        <button
  onClick={handlePayment}
  disabled={ticketBooked} // ✅ disable if already booked
  className={`px-4 py-2 rounded text-white ${
    ticketBooked ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary hover:bg-primarydark'
  }`}
>
  {ticketBooked ? "Ticket Booked" : "Book Ticket"}
</button>

      </div>

      <div className="text-xl font-semibold text-gray-700 mb-2">
        {event.ticketPrice === 0 ? "Free" : `LKR. ${event.ticketPrice}`}
      </div>
      <div className="text-md text-gray-500 mb-4">
        Organized by <span className="font-semibold">{event.organizedBy}</span>
        {event.owner?.name && ` (${event.owner.name})`}
      </div>

      <p className="text-gray-700 leading-relaxed mb-6">{event.description}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex items-start gap-4">
          <AiFillCalendar className="text-primarydark mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-lg">Date and Time</h3>
            <p>Date: {event.eventDate.split("T")[0]}</p>
            <p>Time: {event.eventTime}</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <MdLocationPin className="text-primarydark mt-1" size={24} />
          <div>
            <h3 className="font-semibold text-lg">Location</h3>
            <p>{event.location}</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="font-bold text-lg mb-2">Share with friends</h3>
        <div className="flex gap-4 text-primarydark text-2xl">
          <button onClick={handleCopyLink}><FaCopy /></button>
          <button onClick={handleWhatsAppShare}><FaWhatsappSquare /></button>
          <button onClick={handleFacebookShare}><FaFacebook /></button>
        </div>
      </div>
    </div>
  );
}
