import React, { createContext, useState } from 'react'

export const userDataContext = createContext();

const userContext = ({children}) => {
    const [user, setuser] = useState({
        userName:'',
        email:''
    })
  
    return (
    <div><userDataContext.Provider value={{user, setuser}}>
        {children}
        </userDataContext.Provider>
    </div>
  )
}

export default userContext