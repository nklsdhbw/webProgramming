// import libraries
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import { useForm } from "react-hook-form";
import useFetch from "react-fetch-hook";
import { v4 as uuid } from 'uuid';

// import required css
import './Register.css'
import 'bootstrap/dist/css/bootstrap.min.css';




const Register = () => {


    const { isLoading, data } = useFetch("/api/login");
    const { register, handleSubmit, formState } = useForm();
    const navigate = useNavigate();

    // continue when data is fully loaded
    if (!isLoading) {

        // get groupIDs from the /api/login data and keep only distinct groupIDs
        let groupIDs = data.map(loginData => loginData.groupID);
        groupIDs = [...new Set(groupIDs)];

        // get eMails from the /api/login data and keep only distinct eMails
        let eMails = data.map(loginData => loginData.eMail)
        eMails = [...new Set(eMails)];

        // get personIDs from the /api/login data and keep only distinct personIDs
        // needed to check if a new generated user id already exists 
        let personIDs = data.map(loginData => loginData.personID)
        personIDs = [...new Set(personIDs)];


        const onSubmit = registerData => {

            // check if user already has an account with the email given in the input field
            if (eMails.includes(registerData.eMail)) {
                alert("User already exists! Login or register with anoter eMail")
            }
            else {

                // creat new group number if the user want's to create an own group instead of joining an existing
                if (registerData.groupID === "create own group") {
                    registerData.groupID = groupIDs.length + 1
                }

                // create unique personID and check if it's already exists. If it exists already, generate a new unique id and check again
                let personID = uuid()
                while (personID in personIDs) {
                    personID = uuid()
                }

                // add new user with eMail, password, firstname, lastname, personID and groupID to api/database
                fetch("/api/login?" + "eMail=" + registerData.eMail + "&password=" + registerData.password + "&firstname=" + registerData.firstname + "&lastname=" + registerData.lastname + "&personID=" + personID + "&groupID=" + registerData.groupID, {

                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "PUT"
                })
                    .then(function (res) { window.location.reload() })
                    .catch(function (res) { console.log(res) })

                // store the needed user data in sessionStorage
                sessionStorage.setItem("myFirstname", registerData.firstname);
                sessionStorage.setItem("myLastname", registerData.lastname);
                sessionStorage.setItem("myGroupID", registerData.groupID);
                sessionStorage.setItem("myPersonID", personID);
                navigate("/overview")
            }
        }

        // return form with input fields for registrating a new user
        // disable the "register" button if inputValidation is false, for example empty input fields or not an input with eMail format in email input field
        return (

            <form novalidate onSubmit={handleSubmit(onSubmit)}>

                <div>
                    <h1>Registrieren</h1>
                </div>

                <div className="form-group">
                    <label>Vorname</label>
                    <input {...register("firstname", { required: true })} className="form-control" id="firstname" />
                </div>

                <div className="form-group">
                    <label >Nachname</label>
                    <input {...register("lastname", { required: true })} className="form-control" id="lastname" />
                </div>

                <div className="form-group">
                    <label htmlFor="email">E-Mail-Adresse</label>
                    <input {...register("eMail", { required: true })} type="email" className="form-control" id="email" aria-describedby="emailHelp" />
                    <small id="emailHelp" className="form-text text-muted">Wir werden deine E-Mail-Adresse nicht weitergeben.</small>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Passwort</label>
                    <input {...register("password", { required: true })} type="password" className="form-control" id="password" />
                </div>

                <div>
                    <label >Suche dir deine Gruppe aus</label>
                    <Form.Select {...register("groupID", { required: true })} aria-label="Default select example">
                        {groupIDs.map(groupID => (
                            <option value={groupID}>{groupID}</option>
                        ))}
                        <option value="create own group">erstelle deine eigene Gruppe</option>
                    </Form.Select>
                </div>

                <div id="register">
                    <button type="submit" className="btn btn-primary" disabled={!formState.isValid}>Registrieren</button>
                </div>

            </form >
        );
    }
}

export default Register;