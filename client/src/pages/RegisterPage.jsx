/* eslint-disable no-empty */
import { Link, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { GoogleLogin } from '@react-oauth/google';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [redirect, setRedirect] = useState('');

  async function registerUser(ev) {
    ev.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/users/register', {
        name,
        email,
        password,
      });
      alert('Registration Successful');
      setRedirect(true);
    } catch (e) {
      alert('Registration failed');
    }
  }

  if (redirect) {
    return <Navigate to={'/login'} />;
  }

  return (
    <div className="flex w-full h-full lg:-ml-24 px-10 py-10 justify-between place-items-center mt-12">
      <div className="hidden lg:flex flex-col right-box">
        <div className="flex flex-col gap-3">
          <div className="text-3xl font-black">Welcome to</div>
          <div>
            <img src="../src/assets/logo.jpg" alt="" className="w-40 rounded-full" />
          </div>
        </div>

        <div className="ml-48 w-80 mt-6">
          <img src="../src/assets/signuppic.svg" alt="" className='w-full' />
        </div>
      </div>

      <div className="bg-white w-full sm:w-full md:w-1/2 lg:w-1/3 px-7 py-7 rounded-xl justify-center align-middle">
        <form className="flex flex-col w-auto items-center" onSubmit={registerUser}>
          <h1 className='px-3 font-extrabold mb-5 text-primarydark text-2xl'>Sign Up</h1>

          <div className="input">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M18.685 19.097A9.723..." clipRule="evenodd" />
            </svg>
            <input type="text" placeholder="Name" className="input-et" value={name} onChange={ev => setName(ev.target.value)} />
          </div>

          <div className="input">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M17.834 6.166a8.25..." clipRule="evenodd" />
            </svg>
            <input type="email" placeholder="Email" className="input-et" value={email} onChange={ev => setEmail(ev.target.value)} />
          </div>

          <div className="input">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M15.75 1.5a6.75..." clipRule="evenodd" />
            </svg>
            <input type="password" placeholder="Password" className="input-et" value={password} onChange={ev => setPassword(ev.target.value)} />
          </div>

          <div className="input">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M15.75 1.5a6.75..." clipRule="evenodd" />
            </svg>
            <input type="password" placeholder="Confirm password" className="input-et" value={confirmPassword} onChange={ev => setConfirmPassword(ev.target.value)} />
          </div>

          <div className="w-full py-4">
            <button type="submit" className="primary w-full">Create Account</button>
          </div>

          {/* Divider */}
          <div className="text-gray-500 my-2">or</div>

          {/* Google Login Button */}
          <div className="w-full flex justify-center mb-4">
            <GoogleLogin
  onSuccess={async (credentialResponse) => {
    const token = credentialResponse.credential;
    if (!token) {
      console.error("No Google token received");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/google-login",
        { credential: token }, // ✅ Make sure the backend expects 'credential' key
        { withCredentials: true }
      );
      console.log("Google login success:", res.data);
      setRedirect(true); // Optional: navigate after login
    } catch (err) {
      console.error("Google login failed:", err.response?.data || err.message);
    }
  }}
  onError={() => {
    console.log("Google Login Failed");
  }}
/>



          </div>

          <div className="container2">
            <div className="w-full h-full p-1">
              <Link to={'/login'}>
                <button type="button" className="text-black cursor-pointer rounded w-full h-full font-bold">Sign In</button>
              </Link>
            </div>
            <div className="w-full h-full p-1">
              <Link to={'/register'}>
                <button type="button" className="text-white cursor-pointer rounded w-full h-full bg-primary font-bold">Sign Up</button>
              </Link>
            </div>
          </div>

          <Link to={'/'} className="">
            <button className="secondary">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M11.03 3.97a.75..." clipRule="evenodd" />
              </svg>
              Back
            </button>
          </Link>
        </form>
      </div>
    </div>
  );
}
