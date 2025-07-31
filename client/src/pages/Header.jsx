import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { RxExit } from "react-icons/rx";
import { BsFillCaretDownFill } from "react-icons/bs";
import axios from "axios";

export default function Header() {
  const { user, setUser } = useContext(UserContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState("date");

  const searchInputRef = useRef();
  const navigate = useNavigate();

  // Auto-navigate on filter change
useEffect(() => {
  const isOnHomePage = window.location.pathname === "/";

  if (!isOnHomePage) return; // Don't auto-navigate unless you're on homepage

  const params = new URLSearchParams();

  if (searchQuery.trim()) params.append("search", searchQuery);
  if (selectedCategory !== "All") params.append("category", selectedCategory);
  if (location.trim()) params.append("location", location);
  if (date.trim()) params.append("date", date);
  if (sort) params.append("sort", sort);

  const url = `/?${params.toString()}`;
  navigate(url);
}, [searchQuery, selectedCategory, location, date, sort, navigate]);

const isFirstRender = useRef(true);

  // Optional: Clear search on outside click
 useEffect(() => {
  if (isFirstRender.current) {
    isFirstRender.current = false;
    return;
  }

  const isOnHomePage = window.location.pathname === "/";
  if (!isOnHomePage) return;

  const params = new URLSearchParams();

  if (searchQuery.trim()) params.append("search", searchQuery);
  if (selectedCategory !== "All") params.append("category", selectedCategory);
  if (location.trim()) params.append("location", location);
  if (date.trim()) params.append("date", date);
  if (sort && sort !== "date") params.append("sort", sort); // only if user changed

  const urlParams = params.toString();
  navigate(urlParams ? `/?${urlParams}` : "/");

}, [searchQuery, selectedCategory, location, date, sort, navigate]);

  const logout = async () => {
    await axios.post("http://localhost:5000/api/users/logout");
    setUser(null);
    navigate("/");
  };

  return (
    <header className="flex flex-wrap py-2 px-4 sm:px-6 justify-between items-center bg-white shadow relative z-40">
      {/* Logo */}
      <Link to="/" className="flex items-center">
  <img src="../src/assets/logo.jpg" alt="Logo" className="w-24 h-auto object-contain rounded-full" />
</Link>


      {/* Search & Filters */}
      <div
        className="flex flex-wrap items-center justify-evenly bg-white rounded py-2 px-4 w-full md:w-3/5 gap-2 shadow-md mt-2 md:mt-0"
        ref={searchInputRef}
      >
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events..."
          className="text-sm border rounded px-2 py-1 w-40"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="All">All Categories</option>
          <option value="Music">Music</option>
          <option value="Tech">Tech</option>
          <option value="Sports">Sports</option>
          <option value="Business">Business</option>
          <option value="Education">Education</option>
        </select>

        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="text-sm border rounded px-2 py-1 w-32"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-sm border rounded px-2 py-1"
        />

        {/* <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="text-sm border rounded px-2 py-1"
        >
          <option value="date">Sort by Date</option>
          <option value="title">Sort by Title</option>
        </select> */}
      </div>

      {/* Create Event Button */}
   <Link
  to="/createEvent"
  className="hidden md:inline-flex items-center text-primary hover:text-blue-600 transition-colors duration-200"
>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 mr-1"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
    aria-hidden="true"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
  <span className="text-sm font-medium">Create Event</span>
</Link>

      {/* Auth Navigation */}
      <div className="flex items-center gap-4 mt-2 md:mt-0">
        {user ? (
          <div className="relative">
            <div className="flex items-center gap-2">
              <Link to="/useraccount" className="font-semibold">
                {user.name}
              </Link>
              <BsFillCaretDownFill
                className="cursor-pointer"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              />
            </div>
            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg py-2 z-50">
                <Link to="/bookevents" className="block px-4 py-2 hover:bg-gray-100">Booked Events</Link>
                <Link to="/myevents" className="block px-4 py-2 hover:bg-gray-100">My Events</Link>
                <Link to="/calendar" className="block px-4 py-2 hover:bg-gray-100">Calendar</Link>
                <button
                  onClick={logout}
                  className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                >
                  Log out <RxExit className="ml-1" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Sign In
            </button>
          </Link>
        )}
      </div>
    </header>
  );
}
