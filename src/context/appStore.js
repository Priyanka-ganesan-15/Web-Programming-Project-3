import {create} from "zustand";

const appStore = create((set) => ({
    //advanced info, just ported from the old one
    advanced: false,
    isLoaded: false,
    load: () => {
        // --- Load feature flags ----
        const storedFlags = localStorage.getItem("featureFlags");
        if (storedFlags) {
            try {
                const flags = JSON.parse(storedFlags);
                set({
                    advanced: !!flags.advanced,
                });
            } catch (err) {
                console.warn("Failed to parse stored feature flags:", err);
            }
        }

        // --- Load logged-in user ----
        const storedUser = localStorage.getItem("loggedInUser");
        if (storedUser) {
            try {
                const user = JSON.parse(storedUser);
                set({loggedInUser: user});
            } catch (err) {
                console.warn("Failed to parse loggedInUser:", err);
            }
        }

        // Mark store as fully loaded
        set({isLoaded: true});
    },

    setAdvanced: (value) => {
        set(() => {
            localStorage.setItem("featureFlags", JSON.stringify({advanced: value}));
            return {advanced: value};
        });
    },

    loggedInUser: null,
    setLoggedInUser: (user) => {
        set(() => {
            if (user) {
                localStorage.setItem("loggedInUser", JSON.stringify(user));
            }
            return {loggedInUser: user};
        });
    },
    logoutUser: () => {
        set(() => {
            console.log('called');
            localStorage.removeItem("loggedInUser");
            return {loggedInUser: null};
        });
    },

    page: 'Users',
    setPage: (value) => {
        set(() => ({
            page: value,
        }));
    },

    photoIndex: -1,
    setPhotoIndex: (value) => {
        set(() => ({
            photoIndex: value,
        }));
    },
}));

export default appStore;
