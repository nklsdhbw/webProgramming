// import libraries
import * as React from 'react';
import { v4 as uuid } from 'uuid';
import { useForm } from "react-hook-form";
import useFetch from "react-fetch-hook";

// import required css
import 'bootstrap/dist/css/bootstrap.min.css';
import './Splitter.css';


const Splitter = () => {
  if (!sessionStorage.getItem("loggedIn")) {
    window.location.href = "./"

  }


  const { isLoading, data } = useFetch("/api/login");
  const { register, handleSubmit, formState } = useForm();

  let loginData;
  // display loading text when data is not fully loaded
  if (isLoading) {
    console.log("...loading")
    return <div>Is loading!</div>
  }
  else {
    loginData = data
  }





  // filter loginData to specific groupID from user
  let loginDataGrouped = data.filter(loginData => loginData.groupID == sessionStorage.getItem('myGroupID'))

  //filter out yourself with your personID. this array is then needed for the tickboxes where you decide with whom you split the bill
  loginDataGrouped = loginDataGrouped.filter(loginDataGrouped => loginDataGrouped.personID != sessionStorage.getItem('myPersonID'))

  const onSubmit = splitterData => {
    // create date and extract date in format yyyy-mm-dd via substring. this date is later added when submitting the entry
    let date = new Date();
    date = date.toISOString()
    date = date.substring(0, 10)

    // get debtorFullname from the input data
    let debtorFullName = splitterData.debtorFullName

    // if the debtorFullName isn't an array, for example it's a string, convert it to an array
    // because the len of the array is the amount of people that pay the bill
    if (!Array.isArray(debtorFullName)) {
      debtorFullName = [debtorFullName]
    }

    // add 1 to the amount of people, because you also pay 
    let amountPeople = debtorFullName.length + 1

    // create for each debtor an entry, so if you share the bill with Simon and Tobias, we create one entry with you as creditor and simon as debtor and another entry with you as creditor and tobias as debtor
    debtorFullName.forEach(element => {
      let debtorPersonID = loginData.find(x => (x.firstname + " " + x.lastname) === element).personID

      fetch("/api/bills?creditorFirstname=" + sessionStorage.getItem('myFirstname') + "&creditorLastname=" + sessionStorage.getItem('myLastname') + "&creditorPersonID=" + sessionStorage.getItem('myPersonID') + "&amount=" + (splitterData.amount / amountPeople) + "&debtorFullName=" + element + "&debtorPersonID=" + debtorPersonID + "&comment=" + splitterData.comment + "&billID=" + uuid() + "&date=" + date + "&groupID=" + sessionStorage.getItem('myGroupID'), {

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

  // return form for splitting the data
  // submit button is disabled until all fields EXCEPT comment is empty, so comment is optional
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

        <div class="row" id="debtors" >
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