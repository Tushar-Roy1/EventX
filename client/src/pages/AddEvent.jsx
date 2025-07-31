import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';

export default function AddEvent() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

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

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔐 Redirect to signup if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/register");
    }
  }, [user, navigate]);

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

    const form = new FormData();
    form.append('owner', user._id);
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value);
    });

    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/events/createEvent', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      });

      setMessage("✅ Event posted successfully!");
      setFormData({
        title: "",
        optional: "",
        description: "",
        organizedBy: "",
        eventDate: "",
        eventTime: "",
        location: "",
        ticketPrice: 0,
        category: "",
        image: null,
      });

      setTimeout(() => {
        setMessage("");
        window.location.reload();
      }, 2000);
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      setMessage("❌ Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex flex-col items-start ml-10 mt-10 w-full max-w-2xl'>
      <h1 className='text-3xl font-bold mb-6'>Post an Event</h1>

      {message && (
        <div className={`mb-4 px-4 py-2 rounded text-white ${message.startsWith("✅") ? "bg-green-600" : "bg-red-600"}`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className='flex flex-col gap-4 w-full'>
        <label className='flex flex-col text-sm font-medium text-gray-700'>
          Category:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 p-2 rounded border ring-1 ring-gray-300 focus:ring-2 focus:ring-sky-500"
          >
            <option value="">Select Category</option>
            <option value="Music">Music</option>
            <option value="Tech">Tech</option>
            <option value="Sports">Sports</option>
            <option value="Business">Business</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
        </label>

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

        <label className='flex flex-col text-sm font-medium text-gray-700'>
          Image:
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className='mt-1 p-2 rounded border ring-1 ring-gray-300'
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className={`mt-4 py-2 px-6 text-white rounded transition ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700'}`}
        >
          {loading ? 'Posting...' : 'Submit'}
        </button>
      </form>
    </div>
  );
}
