import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = () => {
    axios
      .get("http://localhost:5000/api/events/myevents", { withCredentials: true })
      .then(res => setEvents(res.data))
      .catch(err => console.error("Failed to load events", err));
  };

  const handleUpdate = (eventId) => {
    navigate(`/update-event/${eventId}`);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/events/delete/${eventId}`, {
        withCredentials: true,
      });
      // After deletion, re-fetch the events
      fetchEvents();
    } catch (err) {
      console.error("Failed to delete event", err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Events</h1>
      {events.length === 0 ? (
        <p>You haven't created any events yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map(event => (
            <div key={event._id} className="border p-4 rounded shadow">
              <img
                src={`http://localhost:5000/${event.image.replace("\\", "/")}`}
                alt={event.title}
                className="w-full h-40 object-cover mb-2"
              />
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-600">{event.description}</p>
              <p><strong>Date:</strong> {new Date(event.eventDate).toLocaleDateString()}</p>
              <p><strong>Location:</strong> {event.location}</p>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleUpdate(event._id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update
                </button>
                <button
                  onClick={() => handleDelete(event._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEvents;
