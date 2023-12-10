import PageWrapper from "../components/PageWrapper";
// componenti pagine
import HomePage from '../pages/HomePage';
import VideosPage from "../pages/VideosPage";


/// Lista pagine da mostrare nel MENU
export default class MenuPages {

    static HOME_COMPONENT = <VideosPage />; //<HomePage />;

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
            path: 'video',
            label: 'Video',
            showOnMenu: true,
            element: <VideosPage />,
            requiresAuth: true,
        },
    ];
}