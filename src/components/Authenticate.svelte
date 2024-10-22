<script>
	import { authHandlers } from "../store/store";
    import { RegisterSchema, LoginSchema } from '../lib/yup/index';

    let name = ''
    let email = ''
    let password = ''
    let confirmPassword = ''
    let error = false
    let register = false
    let authenticating = false
    let formErrors = {}
    let errorMessage = ''

    async function handleAuthentication () {
        if (authenticating) {
            return
        }
        authenticating = true;
        error = false;
        formErrors = {}
        errorMessage = ''
        
        // if (!email || !password || (register && !confirmPassword)) {
        //     error = true
        //     return;
        // }
        //authenticating = true

        try {
            if (register) {
                await RegisterSchema.validate(
                    { name, email, password, confirmPassword },
                    { abortEarly: false }
                );
                await authHandlers.signup(email, password, name);
            } else {
                await LoginSchema.validate(
                    { email, password },
                    { abortEarly: false }
                );
                await authHandlers.login(email, password);
            }
        } catch (validationError) {
            if (validationError.name === 'ValidationError') {
                validationError.inner.forEach(err => {
                    formErrors[err.path] = err.message;
                });
                error = true;
            } else {
                errorMessage = 'Wrong Email or Password';
                error = true;
            }
            authenticating = false;
            return;
        }
        authenticating = false;
    }

    function handleRegister () {
        register = !register
        name = '';
        email = '';
        password = '';
        confirmPassword = '';
        error = false;
        formErrors = {};
        errorMessage = '';
    }
</script>


<div class="authContainer">
    <form>
        <h1>{register ? 'Register' : 'Login'}</h1>
        {#if error}
            <p class="error">{errorMessage}</p>
        {/if}
        {#if register}
            <label>
                <p class={name ? "above" : "center"}>Name</p>
                <input bind:value={name} type="name" placeholder="Name"/>
            </label>
            {#if formErrors.name}
                <p class="error">{formErrors.name}</p>
            {/if}
        {/if}

        <label>
            <p class={email ? "above" : "center"}>Email</p>
            <input bind:value={email} type="email" placeholder="Email"/>
        </label>
        {#if formErrors.email}
            <p class="error">{formErrors.email}</p>
        {/if}

        <label>
            <p class={password ? "above" : "center"}>Password</p>
            <input bind:value={password} type="password" placeholder="Password"/>
        </label>
        {#if formErrors.password}
            <p class="error">{formErrors.password}</p>
        {/if}
        
        {#if register}
            <label>
                <p class={confirmPassword ? "above" : "center"}>Confirm Password</p>
                <input bind:value={confirmPassword} type="password" placeholder="Confirm Password"/>
            </label>
            {#if formErrors.confirmPassword}
                <p class="error">{formErrors.confirmPassword}</p> <!-- Show confirm password error -->
            {/if}
        {/if}

        <button type="button" class="submitButton" on:click={handleAuthentication}>
            {#if authenticating}
                <i class="fa-solid fa-spinner spin"></i>
            {:else}
                Submit
            {/if}
        </button>
    </form>

    <div class="options">
        <p>Or</p>
        {#if register}
            <div>
                <p>Already have an account?</p>
                <p on:click={handleRegister} on:keydown={() => {}}>Login</p>
            </div>
        {:else}
            <div>
                <p>Don't have an account?</p>
                <p on:click={handleRegister} on:keydown={() => {}}>Register</p>
            </div>
        {/if}
    </div>
</div>

<style>
    .authContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        padding: 24px;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 14px;
    }

    form,
    .options {
        width: 400px;
        max-width: 100%;
        margin: 0 auto;
    }

    form input {
        width: 100%;
        border: none;
        background: transparent;
        color: white;
        padding: 14px;
    }

    form input:focus {
        border: none;
        outline: none;
    }

    form label {
        position: relative;
        border: 1px solid navy;
        border-radius: 5px;
    }

    form label:focus-within {
        border-color: lightgray;
    }

    h1 {
        text-align: center;
        font-size: 2.7rem;
    }

    button {
        background: white;
        color: navy;
        border: none;
        padding: 10px 0;
        border-radius: 5px;
        cursor: pointer;
        font-size: 1.2rem;
        display: grid;
        place-items: center;
    }

    button:hover {
        background: lightgray;
    }

    .above,
    .center {
        position: absolute;
        transform: translateY(-50%);
        pointer-events: none;
        color: white;
        border-radius: 4px;
        padding: 0 6px;
        font-size: 0.8rem
    }

    .above {
        top: 0;
        left: 24px;
        background: navy;
        border: 1px solid blue;
        font-size: 0.8rem
    }

    .center {
        top: 50%;
        left: 6px;
        border: 1px solid transparent;
        opacity: 0;
    }

    .error {
        color: coral;
        font-size: 0.9rem;
    }

    .options {
        padding: 14px 0;
        overflow: hidden;
        font-size: 0.9rem;
        display: flex;
        flex-direction: column;
        gap: 4px;
    }

    .options > p {
        position: relative;
        text-align: center;
        width: fit-content;
        margin: 0 auto;
        padding: 0 8px;
    }

    .options > p::after,
    .options > p::before {
        position: absolute;
        content: "";
        top: 50%;
        transform: translateY(-50%);
        width: 100vw;
        height: 1.5px;
        background: white;
    }

    .options > p::after {
        right: 100%;
    }

    .options > p::before {
        left: 100%;
    }

    .options div {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }

    .options div p:last-of-type {
        color: cyan;
        cursor: pointer;
    }

    .spin {
        animation: spin 2s infinite;
    }

    @keyframes spin {
        from {
            transform: rotate(0deg)
        }
        to {
            transform: rotate(360deg)
        }
    }
</style>