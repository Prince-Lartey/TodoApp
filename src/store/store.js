// Handling user authentication in a Svelte application using Firebase.

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { writable } from "svelte/store"; // To create a reactive store that can hold and update data.
import { auth } from "../lib/firebase/firebase";

// defines a Svelte writable store
export const authStore = writable({
    user: null,
    loading: true,
    data: {}
})

// methods for user authentication
export const authHandlers = {
    signup: async (email, password, name) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;

        // Set the display name after user creation
        await updateProfile(user, {
            displayName: name
        });

        authStore.set({
            user: user,
            loading: false,
            data: {}
        });
    },
    login: async (email, password) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update the store with the logged-in user data
        authStore.set({
            user: user,
            loading: false,
            data: {}
        });
    },
    logout: async () => {
        await signOut(auth)
        authStore.set({
            user: null,
            loading: false,
            data: {}
        });
    },
}