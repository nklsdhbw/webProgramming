// import libraries
import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import useFetch from "react-fetch-hook";

// import required css
import 'bootstrap/dist/css/bootstrap.min.css';


const Login = () => {
    const navigate = useNavigate();
    let { isLoading, data } = useFetch(
        "https://8080-nklsdhbw-webprogramming-ltpyo05qis6.ws-eu81.gitpod.io/api/login"
    );
    //const alert = useAlert();

    const onSubmit = formData => {
        if (!data) {
            return;
        }

        console.log(formData);
        let loginSuccess = false
        data.forEach(element => {
            if (
                formData.username === element.eMail &&
                formData.password === element.password
            ) {
                // set user specific variables and store them in session storage of browser
                sessionStorage.setItem("myFirstname", element.firstname);
                sessionStorage.setItem("myLastname", element.lastname);
                sessionStorage.setItem("myGroupID", element.groupID);
                sessionStorage.setItem("myPersonID", element.personID);

                // after successfull login navigate to overview page
                navigate("overview");
                loginSuccess = true
            }

        });
        if (!loginSuccess) {
            alert("invalid password or email!")
        }

        //alert.error('This is an error message!')
        //alert.show("This is an alert message!", { offset: 0 });
    };
    const { register, handleSubmit, formState } = useForm();

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Login</h1>
            <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                    {...register("username", { required: true })}
                    type="email"
                    className="form-control"
                    id="email"
                    aria-describedby="emailHelp"
                />
                <small id="emailHelp" className="form-text text-muted">
                    We'll never share your email with anyone else.
                </small>
            </div>

            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    {...register("password", { required: true })}
                    type="password"
                    className="form-control"
                    id="password"
                />
            </div>

            <div>
                <button type="submit" className="btn btn-primary" disabled={!formState.isValid}>
                    Submit
                </button>
            </div>

            <div>
                <NavLink to="/register">or register here</NavLink>
            </div>
        </form>
    );
};

export default Login;