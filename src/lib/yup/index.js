import * as yup from "yup"

// Minimum eight characters, at least one uppercase letter, one lowercase letter and one number
const passwordRules = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/

export const RegisterSchema = yup.object().shape({
    name: yup.string().min(2).required('Name is Required!'),
    email: yup.string().email("Please enter a valid email").required("Email is Required!"),
    password: yup.string().min(8, "Password must be at least 8 characters long").matches(passwordRules, { message: "Password requires a minimum of eight characters, at least one uppercase letter, one lowercase letter, and one number",}).required("Password is Required!"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Confirm Password is Required!"),
})

export const LoginSchema = yup.object().shape({
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    password: yup.string().required('Password is required'),
});

export const AddSchema = yup.object().shape({
    addTodo: yup.string().min(3, "Todo must be at least 3 characters").required('Field is Required!')
});
