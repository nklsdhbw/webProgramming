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
        "/api/login"
    );


    const onSubmit = formData => {



        // declare login status
        sessionStorage.setItem("loggedIn", JSON.stringify(false))



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
                sessionStorage.setItem("loggedIn", JSON.stringify(true))
                navigate("overview");

            }

        });

        // alert user if password or email is false
        if (!JSON.parse(sessionStorage.getItem("loggedIn"))) {
            window.alert("invalid password or email!")
        }
        // }
    };

    // dont do sth, until data isnt loaded
    if (!isLoading) {
        // return form for submitting data
        // set all input fields to required to prevent user to try login in without credentials

        //check if user is already logged in, if so, automatically redirect to overview
        if ((JSON.parse(sessionStorage.getItem("loggedIn")))) {
            window.location.href = "/overview"

        }
        else {

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
        }
    }
};

export default Login;