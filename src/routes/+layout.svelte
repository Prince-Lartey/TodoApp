<script>
	import { onMount } from "svelte"; // Svelte lifecycle function that runs when the component is first rendered on the screen.
    import { auth, db } from "../lib/firebase/firebase"
	import { getDoc, setDoc, doc } from "firebase/firestore"; // Firestore functions to interact with the database, fetching and updating documents.
    import { authStore } from "../store/store"
    
    // only the root path ("/") is a non-authenticated route, so the user can visit the homepage without logging in.
    const nonAuthRoutes = ["/"]

    onMount(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            const currentPath = window.location.pathname

            // If the user is not logged in and they are trying to access a page that requires authentication (not in nonAuthRoutes), they are redirected to the login page ("/").
            if (!user && !nonAuthRoutes.includes(currentPath)) {
                window.location.href = "/"
                return
            }

            // If the user is logged in and is on the login page ("/"), they are redirected to the dashboard.
            if (user && currentPath === "/") {
                window.location.href = "/dashboard"
                return
            }

            if (!user) {
                return
            }

            // Creates a reference to the document in the users collection
            let dataToSetToStore;
            const docRef = doc(db, "users", user.uid)
            const docSnap = await getDoc(docRef)

            // If the document does not exist. A new document is created for the user in Firestore using setDoc. A new object is created with the user's email and an empty todos array, indicating that a new user has no todos yet.
            if (!docSnap.exists()) {
                const userRef = doc(db, "users", user.uid)
                dataToSetToStore = {
                    email: user.email,
                    todos: [],
                }
                await setDoc(userRef, dataToSetToStore, { merge: true })
            } else {
                const userData = docSnap.data()
                dataToSetToStore = userData
            }

            // updates the Svelte store with the new state of the user.
            authStore.update((current) => {
                return {
                    ...current,
                    user,
                    data: dataToSetToStore,
                    loading: false,
                }
            })
        })
    })
</script>

<div class="mainContainer">
    <slot />
</div>

<style>
    .mainContainer {
        min-height: 100vh;
        background: linear-gradient(to right, #191654, #191654, #191654 );
        color: white;
        position: relative;
        display: flex;
        flex-direction: column;
    }
</style>