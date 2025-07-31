import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';

export default function UpdateEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const [formData, setFormData] = useState({
    title: "",
    optional: "",
    description: "",
    organizedBy: "",
    eventDate: "",
    eventTime: "",
    location: "",
    ticketPrice: 0,
    image: null,
    category: "",
  });

  const [initialLoading, setInitialLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ Fetch existing event data
const [originalEvent, setOriginalEvent] = useState(null); // 🆕 Added

useEffect(() => {
  axios.get(`http://localhost:5000/api/events/getEvent/${id}`, { withCredentials: true })
    .then(res => {
      const event = res.data.event || res.data.events?.[0]; // ✅ Try both
      if (!event) {
        setMessage("❌ Event not found");
        return;
      }

      setOriginalEvent(event);
      setFormData({
        title: event.title || "",
        optional: event.optional || "",
        description: event.description || "",
        organizedBy: event.organizedBy || "",
        eventDate: event.eventDate?.slice(0, 10) || "",
        eventTime: event.eventTime || "",
        location: event.location || "",
        ticketPrice: event.ticketPrice ?? 0,
        image: null,
        category: event.category || "",
      });
    })
    .catch(err => {
      console.error("❌ Failed to fetch event", err);
      setMessage("❌ Failed to fetch event data.");
    })
    .finally(() => setInitialLoading(false));
}, [id]);


const handleChange = (e) => {
  const { name, value, files } = e.target;

  if (files && files.length > 0) {
    setFormData((prev) => ({ ...prev, [name]: files[0] }));
  } else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user) {
    alert("Please log in to update the event.");
    return;
  }

  const form = new FormData();

  for (const key in formData) {
    if (key === "image") {
      if (formData.image) form.append("image", formData.image); // only if updated
    } else {
      const newValue = formData[key];
      const fallbackValue = originalEvent?.[key];
      const valueToSend = newValue !== "" && newValue !== null ? newValue : fallbackValue;
      form.append(key, valueToSend);
    }
  }

  setSubmitting(true);
  try {
    const response = await axios.put(
      `http://localhost:5000/api/events/update/${id}`,
      form,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      }
    );

    setMessage("✅ Event updated successfully!");
    setTimeout(() => navigate("/myevents"), 1500);
  } catch (err) {
    console.error("❌ Update failed", err.response?.data || err.message);
    setMessage("❌ Failed to update event.");
  } finally {
    setSubmitting(false);
  }
};


  if (initialLoading) {
    return <div className="ml-10 mt-10 text-gray-600">Loading event data...</div>;
  }

  return (
    <div className='flex flex-col items-start ml-10 mt-10 w-full max-w-2xl'>
      <h1 className='text-3xl font-bold mb-6'>Update Event</h1>

      {message && (
        <div className={`mb-4 px-4 py-2 rounded text-white ${message.startsWith("✅") ? "bg-green-600" : "bg-red-600"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
        {/* Category Dropdown */}
        <label className='flex flex-col text-sm font-medium text-gray-700'>
          Category:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 p-2 rounded border ring-1 ring-gray-300 focus:ring-2 focus:ring-sky-500"
          >
            <option value="">Select category</option>
            <option value="Music">Music</option>
            <option value="Tech">Tech</option>
            <option value="Sports">Sports</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </label>

        {/* Other Inputs */}
        {[
          { name: "title", type: "text" },
          { name: "optional", type: "text" },
          { name: "description", type: "textarea" },
          { name: "organizedBy", type: "text" },
          { name: "eventDate", type: "date" },
          { name: "eventTime", type: "time" },
          { name: "location", type: "text" },
          { name: "ticketPrice", type: "number" },
        ].map(({ name, type }) => (
          <label key={name} className='flex flex-col text-sm font-medium text-gray-700'>
            {name[0].toUpperCase() + name.slice(1)}:
            {type === "textarea" ? (
              <textarea
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className='mt-1 p-2 rounded border ring-1 ring-gray-300 focus:ring-2 focus:ring-sky-500'
              />
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className='mt-1 p-2 rounded border ring-1 ring-gray-300 focus:ring-2 focus:ring-sky-500'
              />
            )}
          </label>
        ))}

        {/* Image Upload */}
        <label className='flex flex-col text-sm font-medium text-gray-700'>
          Image (leave blank to keep current):
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className='mt-1 p-2 rounded border ring-1 ring-gray-300'
          />
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className={`mt-4 py-2 px-6 text-white rounded transition ${submitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700'}`}
        >
          {submitting ? 'Updating...' : 'Update Event'}
        </button>
      </form>
    </div>
  );
}
