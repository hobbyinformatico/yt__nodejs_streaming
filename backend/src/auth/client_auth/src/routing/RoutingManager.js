import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import MenuPages from "../routing/MenuPages";
import SessionManager from "../providers/SessionManager";
import LoginPage from "../pages/LoginPage";


/// Interfaccia per gestire il routing delle pagine.
/// La lista delle pagine mostrate sul MENU è
/// in "src/routing/MenuPages.js"
export default class RoutingManager {

    /// rotte di default
    static ROOT = '/';
    static JOLLY = '*';
    static LOGIN_COMPONENT = <LoginPage />;

    // configurazione pagina login
    static LOGIN_OBJ = {
        path: 'login',
        label: 'Login',
        showOnMenu: false,
        element: MenuPages.LOGIN_COMPONENT,
        requiresAuth: true,
    };

    // configurazione pagina home
    static HOME_OBJ = {
        path: 'home',
        label: 'Home',
        showOnMenu: true,
        element: MenuPages.HOME_COMPONENT,
        requiresAuth: true,
    };

    //
    static getMenuPages() {
        let listPages = [];
        for (let r of RoutingManager.ROUTES) {
            if (r.showOnMenu === true) {
                listPages.push(r);
            }
        }
        return listPages;
    }

    // Generatore delle rotte navigabili e gestibili
    static contentManager(authContext) {
        return <RouterProvider router={
            createBrowserRouter(RoutingManager.getRoutes(authContext))
        } />
    }

    // Controlla la navigazione
    static getRoutes() {
        const user = SessionManager.getUser();
        //console.log(user);
        let showLoginPopup = false;

        // Redirect forzato a:
        //     - LOGIN => se è richiesta autenticazione e non è ancora avvenuta
        //     - HOME  => (default) se richiesta pagina:
        //         - di login ma il login è già avvenuto
        //         - non esistente
        return RoutingManager.ROUTES.map((r) => ({
            path: r.path,
            element: (() => {

                // Login richiesto
                if (r.requiresAuth === true && user == null) {
                    // Abilita una popup di login per l'autenticazione invece che
                    // navigare ad una nuova pagina (così l'utente rimarrà sulla
                    // stessa pagina e potrà riautenticarsi senza perdere il lavoro
                    // in corso
                    showLoginPopup = true;
                }
                // Login già effettuato
                else {
                    // l'url punta al login
                    if (r.path === RoutingManager.LOGIN_OBJ.path) {
                        // login non necessario => navigazione a Home
                        return <Navigate to={`/${RoutingManager.HOME_OBJ.path}`} replace />;
                    }
                }
                return MenuPages.getPageWrapper(r.element, showLoginPopup);
            })()
        }));
    }

    // ROUTES totali (visibili nel menu e non)
    static ROUTES = [
        ...[
            // --- default ---
            {
                path: RoutingManager.ROOT,
                element: <Navigate to={`/${RoutingManager.HOME_OBJ.path}`} replace />,
                showOnMenu: false,
                requiresAuth: true,
            },
            RoutingManager.HOME_OBJ,
            RoutingManager.LOGIN_OBJ,
            {
                path: RoutingManager.LOGIN_OBJ.path,
                element: RoutingManager.LOGIN_COMPONENT,
                showOnMenu: false,
                requiresAuth: true,
            }
        ],
        // --- custom utente ---
        ...MenuPages.CUSTOM_PAGES,
        ...[
            // --- nessuna delle precedenti ---
            {
                path: RoutingManager.JOLLY,
                showOnMenu: false,
                element: <Navigate to={`/${RoutingManager.HOME_OBJ.path}`} replace />,
                requiresAuth: true,
            }
        ]
    ];
}