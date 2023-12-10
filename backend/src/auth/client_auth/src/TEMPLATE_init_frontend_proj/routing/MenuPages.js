import PageWrapper from "../components/PageWrapper";
// componenti pagine
import HomePage from '../pages/HomePage';


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
            path: 'home2',
            label: 'Home2',
            showOnMenu: true,
            element: <HomePage />,
            requiresAuth: true,
        },
    ];
}