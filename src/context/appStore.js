import {create} from "zustand";

const appStore = create((set) => ({
    //advanced info, just ported from the old one
    advanced: false,
    isLoaded: false,
    load: () => {
        const stored = localStorage.getItem("featureFlags");
        if (stored) {
            try {
                const flags = JSON.parse(stored);
                set({advanced: !!flags.advanced, isLoaded: true});
                return;
            } catch (err) {
                console.warn("Failed to parse stored feature flags:", err);
            }
        }
        set({isLoaded: true});
    },

    setAdvanced: (value) => {
        set(() => {
            localStorage.setItem("featureFlags", JSON.stringify({advanced: value}));
            return {advanced: value};
        });
    },

    userName: 'Pariyanker Ganeseeley',
    setUserName: (value) => { // well use this later
        set(() => ({
            userName: value,
        }));
    },

    page:'Users',
    setPage: (value) => {
        set(() => ({
            page: value,
        }));
    },

    photoIndex:-1,
    setPhotoIndex: (value) => {
        set(() => ({
            photoIndex: value,
        }));
    },
}));

export default appStore;
