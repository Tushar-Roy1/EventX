import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsArrowRightShort } from "react-icons/bs";
import { BiLike } from "react-icons/bi";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom"; 

export default function IndexPage() {
  const [events, setEvents] = useState([]);
  const { search } = useLocation();
  const { user } = useContext(UserContext); // ✅ access current user
  const [likedEvents, setLikedEvents] = useState({});
  const navigate = useNavigate();


const handleBookClick = (eventId) => {
  if (!user) {
    navigate("/register");
  } else {
    navigate(`/event/${eventId}`);
  }
};



  // ✅ Fetch all events initially
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/events/getEvent")
      .then((response) => {
        setEvents(response.data.events);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      });
  }, []);

  // ✅ Refetch when filters are applied
  useEffect(() => {
    if (search) {
      axios
        .get(`http://localhost:5000/api/events/search${search}`)
        .then((res) => {
          setEvents(res.data);
        })
        .catch((err) => {
          console.error("Error fetching filtered events:", err);
        });
    }
  }, [search]);

  // ✅ Like functionality
  const handleLike = (eventId) => {
  setLikedEvents((prev) => ({
    ...prev,
    [eventId]: !prev[eventId],
  }));

  setEvents((prevEvents) =>
    prevEvents.map((event) =>
      event._id === eventId
        ? {
            ...event,
            likes: likedEvents[eventId]
              ? event.likes - 1
              : event.likes + 1,
          }
        : event
    )
  );
};


  // ✅ Filter: show only future or today’s events that are NOT created by the current user
  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.eventDate);
    const currentDate = new Date();
    const isUpcoming =
      eventDate > currentDate ||
      eventDate.toDateString() === currentDate.toDateString();

    const isNotMyEvent = event.owner?._id !== user?._id;

    return isUpcoming && isNotMyEvent;
  });

  return (
    <div className="mt-1 flex flex-col">
      {/* ✅ Hero Section */}
      <div className="hidden sm:block">
        <div className="flex item-center inset-0">
          <img src="../src/assets/event.jpg" alt="Hero" className="w-full h-70" />
        </div>
      </div>

      {/* ✅ Events Grid */}
      <div className="mx-10 my-5 grid gap-x-6 gap-y-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:mx-5">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
           <div
  key={event._id}
  className="bg-white rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-gray-200"
>
  {/* Event Image */}
  <div className="relative">
    {event.image && (
      <img
        src={`http://localhost:5000/${event.image.replace("\\", "/")}`}
        alt={event.title}
        className="w-full h-48 object-cover"
      />
    )}
    <button
      onClick={() => handleLike(event._id)}
      className="absolute top-2 right-2 bg-white text-gray-700 p-2 rounded-full shadow hover:text-primary hover:scale-105 transition"
      title="Like"
    >
      <BiLike size={20} />
    </button>
  </div>

  {/* Event Content */}
  <div className="p-4 flex flex-col gap-3">
    {/* Title & Likes */}
    <div className="flex justify-between items-start">
      <h2 className="text-lg font-bold text-gray-800">{event.title}</h2>
      <span className="flex items-center gap-1 text-sm text-gray-500">
        <BiLike /> {event.likes}
      </span>
    </div>

    {/* Date & Price */}
    <div className="flex justify-between text-sm text-gray-600 font-medium">
      <span>📅 {event.eventDate.split("T")[0]} | 🕒 {event.eventTime}</span>
      <span className="text-blue-600">
        {event.ticketPrice === 0 ? "Free" : `Rs. ${event.ticketPrice}`}
      </span>
    </div>

    {/* Description */}
    <p className="text-sm text-gray-600 line-clamp-3">{event.description}</p>

    {/* Organized/Created */}
    <div className="text-xs text-gray-500 leading-snug mt-1">
      <p>
        <span className="font-semibold text-gray-700">Organizer:</span>{" "}
        {event.organizedBy}
      </p>
      <p>
        <span className="font-semibold text-gray-700">Created by:</span>{" "}
        {user?.name?.toUpperCase()}
      </p>
    </div>

    {/* Button */}
    {/* <Link
      to={`/event/${event._id}`}
      className="mt-3"
    > */}
      <button
       onClick={() => handleBookClick(event._id)}
       className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-all flex justify-center items-center gap-1">
        Book Ticket <BsArrowRightShort size={22} />
      </button>
    {/* </Link> */}
  </div>
</div>

          ))
        ) : (
          <div className="text-center text-gray-500 text-lg mt-10 col-span-full">
            No upcoming public events found.
          </div>
        )}
      </div>
    </div>
  );
}
