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

    const { isLoading, data } = useFetch("https://8080-nklsdhbw-webprogramming-ltpyo05qis6.ws-eu81.gitpod.io/api/login");
    const { register, handleSubmit, formState } = useForm();
    const navigate = useNavigate();
    if (isLoading === false) {
        console.log(data)
        let groupIDs = data.map(loginData => loginData.groupID);
        let eMails = data.map(loginData => loginData.eMail)
        groupIDs = [...new Set(groupIDs)];
        console.log(groupIDs)
        eMails = [...new Set(eMails)];
        const onSubmit = registerData => {

            if (eMails.includes(registerData.eMail)) {
                alert("User already exists! Login or register with anoter eMail")
            }
            else {

                if (registerData.groupID === "create own group") {
                    registerData.groupID = groupIDs.length + 1
                }

                console.log("registerData:", registerData)
                let personID = uuid()
                fetch("https://8080-nklsdhbw-webprogramming-ltpyo05qis6.ws-eu81.gitpod.io/api/login?" + "eMail=" + registerData.eMail + "&password=" + registerData.password + "&firstname=" + registerData.firstname + "&lastname=" + registerData.lastname + "&personID=" + personID + "&groupID=" + registerData.groupID, {

                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: "PUT"
                })
                    .then(function (res) { window.location.reload() })
                    .catch(function (res) { console.log(res) })

                sessionStorage.setItem("myFirstname", registerData.firstname);
                sessionStorage.setItem("myLastname", registerData.lastname);
                sessionStorage.setItem("myGroupID", registerData.groupID);
                sessionStorage.setItem("myPersonID", personID);
                navigate("/overview")
            }
        }

        return (

            <form novalidate onSubmit={handleSubmit(onSubmit)}>

                <div>
                    <h1>Register</h1>
                </div>

                <div className="form-group">
                    <label>Firstname</label>
                    <input {...register("firstname", { required: true })} className="form-control" id="firstname" />
                </div>

                <div className="form-group">
                    <label >Lastname</label>
                    <input {...register("lastname", { required: true })} className="form-control" id="lastname" />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input {...register("eMail", { required: true })} type="email" className="form-control" id="email" aria-describedby="emailHelp" />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input {...register("password", { required: true })} type="password" className="form-control" id="password" />
                </div>

                <div>
                    <label >Suche dir deine Gruppe aus</label>
                    <Form.Select {...register("groupID", { required: true })} aria-label="Default select example">
                        {groupIDs.map(groupID => (
                            <option value={groupID}>{groupID}</option>
                        ))}
                        <option value="create own group">create own group</option>
                    </Form.Select>
                </div>

                <div id="register">
                    <button type="submit" className="btn btn-primary" disabled={!formState.isValid}>Register</button>
                </div>

            </form >
        );
    }
}

export default Register;