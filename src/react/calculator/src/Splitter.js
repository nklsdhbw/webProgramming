// import libraries
import * as React from 'react';
import { v4 as uuid } from 'uuid';
import { useForm } from "react-hook-form";
import useFetch from "react-fetch-hook";

// import required css
import 'bootstrap/dist/css/bootstrap.min.css';
import './Splitter.css';


const Splitter = () => {

  // if user isn't logged in, redirect him to "/" which in this case is "/login"
  if (!JSON.parse(sessionStorage.getItem("loggedIn"))) {
    window.location.href = "/"

  }

  // get loginData from /api/login
  const { isLoading, data } = useFetch("/api/login");
  const { register, handleSubmit, formState } = useForm();


  // display loading text when data is not fully loaded
  if (isLoading) {
    console.log("...loading")
    return <div>Is loading!</div>
  }
  else {
    // keep loginData non filtered for later
    let loginData = data

    // filter loginData to specific groupID from user
    let loginDataGrouped = loginData.filter(loginData => loginData.groupID == sessionStorage.getItem('myGroupID'))

    //filter out yourself with your personID. this array is then needed for the tickboxes where you decide with whom you split the bill
    loginDataGrouped = loginDataGrouped.filter(loginDataGrouped => loginDataGrouped.personID != sessionStorage.getItem('myPersonID'))

    // billIDs: needs for checking if a billID already exists while adding new bill
    let billIDs = loginData.map(loginData => loginData.billID)

    const onSubmit = splitterData => {
      // create date stamp
      let date = new Date();
      date = date.toISOString()


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

        // create uniqe billID
        let billID = uuid()
        while (billID in billIDs) {
          billID = uuid()
        }

        fetch("/api/bills?creditorFirstname=" + sessionStorage.getItem('myFirstname') + "&creditorLastname=" + sessionStorage.getItem('myLastname') + "&creditorPersonID=" + sessionStorage.getItem('myPersonID') + "&amount=" + (splitterData.amount / amountPeople).toFixed(2) + "&debtorFullName=" + element + "&debtorPersonID=" + debtorPersonID + "&comment=" + splitterData.comment + "&billID=" + billID + "&date=" + date + "&groupID=" + sessionStorage.getItem('myGroupID'), {

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
    // prohibit negative values and give th user a hint
    // submit button is disabled until all fields EXCEPT comment is empty, so comment is optional
    return (

      <main className="form-signin w-100 m-auto">

        <form onSubmit={handleSubmit(onSubmit)}>

          {(loginDataGrouped.length === 0) && (
            <div className="row" id="debtors" >
              <p><strong>Aktuell kannst du den Splitter nicht benutzen, da du alleine in der Gruppe bist. Du kannst aber schon einmal die Funktionsweise testen</strong></p>
            </div>)}

          <div className="row">
            <div className="col">
              <div className="input-group mb-3">
                <span className="input-group-text">Betrag €</span>
                <input {...register("amount", { required: true })} type="number" min="0" step="0.01" className="form-control" aria-label="Amount (to the nearest dollar)"></input>
              </div>
            </div>
          </div>

          {(loginDataGrouped.length != 0) && (<div className="row" id="debtors" >
            <div className="col checkbox mb-3">
              {loginDataGrouped.map(user => (
                <div>
                  <input {...register("debtorFullName", { required: true })} type="checkbox" value={user.firstname + " " + user.lastname} />
                  <label htmlFor={user.firstname + " " + user.lastname}>{user.firstname + " " + user.lastname}</label>
                </div>
              ))}
            </div>
          </div>)}

          {(loginDataGrouped.length === 0) && (<div className="row" id="debtors" >
            <div className="col checkbox mb-3">
              <div>
                <input type="checkbox" value="Max Mustermann" />
                <label htmlFor="Max Mustermann">Max Mustermann</label>
              </div>
            </div>
          </div>)}






          <div className="row">
            <div className="col">
              <div className="input-group mb-3" id="Kommentar">
                <span className="input-group-text">Kommentar</span>
                <textarea {...register("comment")} className="form-control" aria-label="Kommentar"></textarea>
              </div>
            </div>
          </div>

          {(loginDataGrouped.length != 0) && (<div className="row">
            <div className="col">
              <div>
                <button id="create" className="w-100 btn btn-lg btn-primary" type="submit" disabled={!formState.isValid}>
                  splitten
                </button>
              </div>
            </div>
          </div>)}
          {(loginDataGrouped.length === 0) && (<div className="row">
            <div className="col">
              <div>
                <button id="create" className="w-100 btn btn-lg btn-primary" type="submit" disabled={true}>
                  splitten
                </button>
              </div>
            </div>
          </div>)}




        </form>

      </main >
    );
  }
}
export default Splitter;