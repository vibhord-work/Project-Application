import { createContext, useState } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const [patientId, setPatientId] = useState(0)
    const [token, setToken] = useState(false);

    const value = {
        patientId,
        setPatientId,
        token,
        setToken
    }

    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider