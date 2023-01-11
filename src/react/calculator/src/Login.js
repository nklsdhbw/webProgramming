// import libraries
import * as React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import useFetch from "react-fetch-hook";

// import required css
import 'bootstrap/dist/css/bootstrap.min.css';


const Login = () => {
    const navigate = useNavigate();
    const { register, handleSubmit, formState } = useForm();
    let { isLoading, data } = useFetch(
        "https://8080-nklsdhbw-webprogramming-ltpyo05qis6.ws-eu81.gitpod.io/api/login"
    );


    const onSubmit = formData => {

        // dont do sth, until data isnt loaded
        if (isLoading) {
            return;
        }

        // declare login status
        let loginSuccess = false

        // iterate over the data from /api/login and check if the inputs are in the array(=database)
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

        // alert user if password or email is false
        if (!loginSuccess) {
            alert("invalid password or email!")
        }
    };

    // return form for submitting data
    // set all input fields to required to prevent user to try login in without credentials
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <h1>Anmelden</h1>
            <div className="form-group">
                <label htmlFor="email">E-Mail-Adresse</label>
                <input
                    {...register("username", { required: true })}
                    type="email"
                    className="form-control"
                    id="email"
                    aria-describedby="emailHelp"
                />
                <small id="emailHelp" className="form-text text-muted">
                    Wir werden deine E-Mail-Adresse nicht weitergeben.
                </small>
            </div>

            <div className="form-group">
                <label htmlFor="password">Passwort</label>
                <input
                    {...register("password", { required: true })}
                    type="password"
                    className="form-control"
                    id="password"
                />
            </div>

            <div>
                <button type="submit" className="btn btn-primary" disabled={!formState.isValid}>
                    Anmelden
                </button>
            </div>

            <div>
                <span>oder registriere dich <NavLink to="/register">hier</NavLink></span>
            </div>
        </form>
    );
};

export default Login;