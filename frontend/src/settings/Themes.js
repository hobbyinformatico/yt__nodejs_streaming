export default class Themes {

    static current() {
        return Themes.theme1;
    }

    ///
    static theme1 = {
        TOP_BAR: {
            SIZE: '40px',
            COLOR: '#222222',
            TEXT_SIZE: 13,
            TEXT_COLOR: '#EEEEEE',
            ICONS_SIZE: 30,
            ICONS_COLOR: '#773333',
            POPOVER: {
                TEXT_SIZE: 11,
                TEXT_COLOR: '#555555',
                ICONS_SIZE: 20,
                ICONS_COLOR: '#AAAAAA',
            }
        },
        MENU: {
            SIZE: '300px',
            COLOR: '#333333',
            BUTTONS_COLOR: '#555555',
            ITEM: {
                TEXT_SIZE: 16,
                TEXT_COLOR: {
                    DEF: '#FFFFFF',
                    HOVER: '#FFFFFF',
                },
                COLOR: {
                    DEF: '#AA6666',
                    HOVER: '#773333',
                },
                // divisori
                DIV: {
                    COLOR: '#444444'
                }
            }
        },
        FORMS: {
            LABELS: {
                TEXT_SIZE: 14,
            },
            BUTTONS: {
                COLOR: {
                    DEF: '#154C79',
                    HOVER: '#1E81B0',
                },
                TEXT_SIZE: 13,
                TEXT_COLOR: {
                    DEF: '#FFFFFF',
                    HOVER: '#FFFFFF',
                }
            }
        },
        PAGES: {
            LOGIN: {
                backgroundColor: '#000000',
            }
        }
    }

    ///
    static theme2 = {
        TOP_BAR: {
            SIZE: '40px',
            COLOR: '#EEEEEE',
            TEXT_SIZE: 13,
            TEXT_COLOR: '#333333',
            ICONS_SIZE: 30,
            ICONS_COLOR: '#888888',
            POPOVER: {
                TEXT_SIZE: 11,
                TEXT_COLOR: '#555555',
                ICONS_SIZE: 20,
                ICONS_COLOR: '#AAAAAA',
            }
        },
        MENU: {
            SIZE: '300px',
            COLOR: '#8E9DA3DD',
            BUTTONS_COLOR: '#555555',
            ITEM: {
                TEXT_SIZE: 16,
                TEXT_COLOR: {
                    DEF: '#FFFFFF',
                    HOVER: '#FFFFFF',
                },
                COLOR: {
                    DEF: '#7c8d94',
                    HOVER: '#496470',
                },
                DIV: {
                    COLOR: '#637075'
                }
            }
        },
        FORMS: {
            LABELS: {
                TEXT_SIZE: 14,
            },
            BUTTONS: {
                COLOR: {
                    DEF: '#154C79',
                    HOVER: '#1E81B0',
                },
                TEXT_SIZE: 13,
                TEXT_COLOR: {
                    DEF: '#FFFFFF',
                    HOVER: '#FFFFFF',
                }
            }
        },
        PAGES: {
            LOGIN: {
                backgroundColor: '#000000',
            }
        }
    }
}