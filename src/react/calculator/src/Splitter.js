// import libraries
import * as React from 'react';
import { v4 as uuid } from 'uuid';
import { useForm } from "react-hook-form";
import useFetch from "react-fetch-hook";

// import required css
import 'bootstrap/dist/css/bootstrap.min.css';
import './Splitter.css';


const Splitter = () => {
  const contributor = sessionStorage.getItem('myFirstname');
  const { isLoading, data } = useFetch("https://8080-nklsdhbw-webprogramming-ltpyo05qis6.ws-eu81.gitpod.io/api/login");
  const { register, handleSubmit, formState } = useForm();


  if (isLoading) {
    console.log("...loading")
    return <div>Is loading!</div>
  }

  let loginData = data;

  // filter loginData to specific groupID from user
  let loginDataGrouped = loginData.filter(loginData => loginData.groupID == sessionStorage.getItem('myGroupID'))

  //filter out yourself with your personID
  loginDataGrouped = loginDataGrouped.filter(loginDataGrouped => loginDataGrouped.personID != sessionStorage.getItem('myPersonID'))

  const onSubmit = splitterData => {
    let date = new Date();
    date = date.toISOString()
    date = date.substring(0, 10)


    let debtorFullName = splitterData.debtorFullName

    if (!Array.isArray(debtorFullName)) {
      debtorFullName = [debtorFullName]
    }
    let amountPeople = debtorFullName.length + 1
    debtorFullName.forEach(element => {
      let debtorPersonID = loginData.find(x => (x.firstname + " " + x.lastname) === element).personID

      fetch("https://8080-nklsdhbw-webprogramming-ltpyo05qis6.ws-eu81.gitpod.io/api/bills?creditorFirstname=" + sessionStorage.getItem('myFirstname') + "&creditorLastname=" + sessionStorage.getItem('myLastname') + "&creditorPersonID=" + sessionStorage.getItem('myPersonID') + "&amount=" + (splitterData.amount / amountPeople) + "&debtorFullName=" + element + "&debtorPersonID=" + debtorPersonID + "&comment=" + splitterData.comment + "&billID=" + uuid() + "&date=" + date + "&groupID=" + sessionStorage.getItem('myGroupID'), {

        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "PUT"
      })
        .then(function (res) { window.location.reload() })
        .catch(function (res) { console.log(res) })
    });
  }

  return (

    <main class="form-signin w-100 m-auto">

      <form onSubmit={handleSubmit(onSubmit)}>

        <div class="row">
          <div class="col">
            <div class="input-group mb-3">
              <span class="input-group-text">Betrag €</span>
              <input {...register("amount", { required: true })} type="text" class="form-control" aria-label="Amount (to the nearest dollar)"></input>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col checkbox mb-3">
            {loginDataGrouped.map(item => (
              <div>
                <input {...register("debtorFullName", { required: true })} type="checkbox" value={item.firstname + " " + item.lastname} />
                <label for={item.firstname + " " + item.lastname}>{item.firstname + " " + item.lastname}</label>
              </div>
            ))}
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="input-group mb-3" id="Kommentar">
              <span class="input-group-text">Kommentar</span>
              <textarea {...register("comment")} class="form-control" aria-label="Kommentar"></textarea>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div>
              <button id="create" class="w-100 btn btn-lg btn-primary" type="submit" disabled={!formState.isValid}>
                splitten
              </button>
            </div>
          </div>
        </div>

      </form>

    </main >
  );
}
export default Splitter;