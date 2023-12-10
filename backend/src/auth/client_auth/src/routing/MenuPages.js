import PageWrapper from "../components/PageWrapper";
// componenti pagine
import HomePage from '../pages/HomePage';
import Applications from "../pages/Applications";
import Users from "../pages/Users";


/// Lista pagine da mostrare nel MENU
export default class MenuPages {

    static HOME_COMPONENT = <HomePage />

    // wrapper per contenuto delle pagine
    static getPageWrapper(content, showLoginPopup) {
        return <PageWrapper content={content} showLoginPopup={showLoginPopup} />
    }

    /// nuove pagine utente
    static CUSTOM_PAGES = [
        /*
        {
            path: Pages.PAGES.TEST_API.key,
            element: <TestApiPage />,
            requiresAuth: true,
        },
        */
        {
            path: 'applications',
            label: 'Applicazioni',
            showOnMenu: true,
            element: <Applications />,
            requiresAuth: true,
        },
        {
            path: 'users',
            label: 'Utenti',
            showOnMenu: true,
            element: <Users />,
            requiresAuth: true,
        },
    ];
}