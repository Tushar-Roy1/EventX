/* eslint-disable no-unused-vars */
import { Route, Routes } from 'react-router-dom'
import './App.css'
import IndexPage from './pages/IndexPage'
import RegisterPage from './pages/RegisterPage'
import Layout from './Layout'
import LoginPage from './pages/LoginPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import UserAccountPage from './pages/UserAccountPage'
import AddEvent from './pages/AddEvent'
import EventPage from './pages/EventPage'
import CalendarView from './pages/CalendarView'
import MyEvents from './pages/MyEvents'
import UpdateEvent from './pages/UpdateEvent'
import BookedEvents from './pages/BookedEvents'

axios.defaults.withCredentials=true;

function App() {
  return (
    <UserContextProvider> 
    <Routes>
            
      <Route path='/' element={<Layout />}>
        <Route index element = {<IndexPage />} />
        <Route path='/useraccount' element = {<UserAccountPage />}/>
        <Route path='/createEvent' element = {<AddEvent/>} />
        <Route path='/event/:id' element= {<EventPage/>} />
        <Route path='/calendar' element={<CalendarView />} />

        <Route path='/myevents' element={<MyEvents/>}/>
        <Route path='bookevents' element={<BookedEvents/>}/>
         <Route path="/update-event/:id" element={<UpdateEvent />} />
      </Route>

      <Route path='/register' element={<RegisterPage />}/>
      <Route path='/login' element={<LoginPage />}/>
      
     
      
    
    </Routes>
    </UserContextProvider>  
  )
}

export default App
