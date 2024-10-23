<script>
	import { doc, setDoc } from "firebase/firestore"; //  functions from Firebase Firestore used to create references to documents and set document data in the Firestore database
    import { authHandlers, authStore } from "../../store/store"; // authHandlers and authStore manage user authentication and hold user data.
	import { db } from "../../lib/firebase/firebase";
    import { AddSchema } from '../../lib/yup/index'
    import { writable } from 'svelte/store' // writable is a Svelte store that allows you to create reactive state variables.
    import tippy from '../../lib/actions/tippy'

    let todoList = [] // store the current user's todo items
    let currentTodo = ''
    let error = ''
    let userName = '' // hold the authenticated user's display name
    let errorMessage = writable('') // A writable store for managing error messages from validation.
    let loggingOut = false // track if the user is in the process of logging out.

    // subscribes to changes in the authStore. Whenever the authentication state changes, it updates the todoList with the current user's todos and sets the userName based on the authenticated user
    authStore.subscribe((current) => {
        if (!loggingOut) {
            todoList = current.data.todos;
            userName = current.user?.displayName || 'User';
        }
    })

    async function addTodo() {
        try {
            await AddSchema.validate({ addTodo: currentTodo });
            errorMessage.set(''); // Clear error if validation passes

            todoList = [...todoList, currentTodo]; // it adds currentTodo to todoList
            currentTodo = ''; // clears currentTodo for the next input.
        } catch (validationError) {
            errorMessage.set(validationError.message); // Display validation error
        }
    }

    // allow the user to edit a todo item by setting it to currentTodo.
    function editTodo(index) {
        currentTodo = todoList[index]; // Get the todo item to edit

        // Create a new array without the item at the specified index
        todoList = todoList.filter((_, i) => i !== index);
    }

    // Removes and Creates a new array without the item at the specified index
    function removeTodo(index) {
        const confirmed = confirm("Are you sure you want to delete this todo?");

        if (confirmed) {
            // If the user confirms, proceed with the deletion
            todoList = todoList.filter((_, i) => i !== index);
        }
    }

    async function saveTodos() {
        try {
            const userRef = doc(db, "users", $authStore.user.uid)
            await setDoc(
                userRef,
                {
                    todos: todoList,
                },
                {merge: true} // avoid overwriting existing data
            )
            alert("Todo List Saved!")
        } catch (error) {
            console.log("There was an error saving your information")
        }
    }

    function handleLogout() {
        loggingOut = true;
        authHandlers.logout();
    }
</script>

<!-- The entire interface is only rendered if the authentication store is not loading. -->
{#if !$authStore.loading}
    <div class="mainContainer">
        <div class="headerContainer">
            <h1>{userName}'s Todo List</h1>
            <div class="headerButtons">
                <button on:click={saveTodos}><i class="fa-solid fa-floppy-disk"></i><p>Save</p></button>
                <button on:click={handleLogout}><i class="fa-solid fa-right-from-bracket"></i><p>Logout</p></button>
            </div>
        </div>

        <main>
            {#if todoList.length === 0}
                <p>You have nothing to do!</p>
            {/if}
            {#each todoList as todo, index}
                <div class="todo">
                    <p>
                        {index + 1}. {todo}
                    </p>
                    <div class="actions">
                        <i on:click={() => {editTodo(index)}} on:keydown={() => {}} class="fa-solid fa-pen-to-square"></i>
                        <i on:click={() => {removeTodo(index)}} on:keydown={() => {}} class="fa-solid fa-trash-can"></i>
                    </div>
                </div>
            {/each}
        </main>

        <div class="enterTodo ">
            <input bind:value={currentTodo} type="text" placeholder="Enter Todo"/>
            <button on:click={addTodo} use:tippy={{ content: 'Add Todo', placement: 'top', theme: 'light' }}>Add</button>
        </div>
        {#if $errorMessage}
            <p class="error">{$errorMessage}</p>
        {/if}
    </div>
{/if}

<style>
    .mainContainer {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        gap: 24px;
        padding: 24px;
        width: 100%;
        max-width: 1000px;
        margin: 0 auto;
    }

    .headerContainer {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .headerButtons {
        display: flex;
        align-items: center; 
        gap: 14px;
    }

    .headerContainer button{
        background: #0891b2;
        color: white;
        padding: 6px 10px;
        border: none;
        border-radius: 4px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
    }

    .headerContainer button:hover {
        opacity: 0.7;
    }

    .headerContainer button i {
        font-size: 1.2rem;
    }
    
    main {
        display: flex;
        flex-direction: column;
        gap: 8px;
        flex: 1;
    }

    .todo {
        border-left: 2px solid #0891b2;
        padding: 8px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .actions {
        display: flex;
        align-items: center;
        gap: 14px;
        font-size: 1.3rem;
    }

    .actions i {
        cursor: pointer;
    }

    .actions i:hover {
        color: coral;
    }

    .enterTodo {
        display: flex;
        align-items: stretch;
        border: 1px solid #0891b2;
        border-radius: 4px;
        overflow: hidden;
    }

    .enterTodo input {
        background: transparent;
        border: none;
        padding: 14px;
        color: white;
        flex: 1;
        
    }

    .enterTodo input:focus {
        outline: none;
    }

    .enterTodo button {
        padding: 0 14px;
        background: lightgray;
        border: none;
        color: #0891b2;
        font-weight: 600;
        cursor: pointer;
    }

    .enterTodo button:hover {
        background: transparent;
    }

    .error {
        color: red;
    }
</style>