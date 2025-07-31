/* eslint-disable react/prop-types */
import {createContext, useEffect, useState} from "react";
import axios from 'axios';


export const UserContext = createContext({});

export function UserContextProvider({children}){
  const [user, setUser ] = useState(null);
  useEffect(() => {
    if (!user) {
      axios.get('http://localhost:5000/api/users/profile').then(({data}) =>{
        setUser(data);
        console.log(data);
        
      })
    }
  },[]);
  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  )
}