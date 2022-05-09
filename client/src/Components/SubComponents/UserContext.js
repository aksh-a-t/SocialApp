import { createContext, useState } from "react";


export const UserContext = createContext(null);

export const ContextData =()=> {
    const [user,setUser] =useState(null);

    const signIn=()=>setUser(true);

    const signOut=()=>setUser(null);

    return {
        user,signIn,signOut
    }
}