import './App.css';
import React, { useState, useContext, useEffect } from 'react';
import SessionManager from './providers/SessionManager';
import Ui, { UiContext } from './components/Ui';
import RoutingManager from './routing/RoutingManager';


const GlobalContextInstance = React.createContext({});
export const useGlobalContext = () => useContext(GlobalContextInstance);


export default function App() {

    /// Dati globali visibili e modificabili da tutti i componenti
    const [globalContext, setGlobalContext] = useState({
        stayLogged: null,
        spin: null,
        showMenu: false
    });

    /// Attiva\disattiva loading spinner
    function setSpin(active, msg = "") {
        setGlobalContext((prevState) => ({
            ...prevState,
            spin: UiContext.loadingSpin(active, msg)
        }));
    }

    /// Init sessione
    useEffect(() => {
        // carico vecchia sessione con eventuale autenticazione ancora valida
        SessionManager.restoreOldSession(globalContext, setGlobalContext);
    }, []);

    return (
        <GlobalContextInstance.Provider value={{ globalContext, setGlobalContext, setSpin }}>

            {/* spinner */}
            <Ui context={globalContext.spin} />

            {/* Gestisce la navigazione delle rotte e il componente di entrata di ciascuna pagina */}
            {RoutingManager.contentManager()}

        </GlobalContextInstance.Provider>
    );
}
