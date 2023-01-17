// import libraries
import * as React from 'react';
import Table from 'react-bootstrap/Table';
import useFetch from "react-fetch-hook";

// import required css
import './Overview.css';
import 'bootstrap/dist/css/bootstrap.min.css';






const Overview = () => {
  //navigate user to login page if he's not logged in and tries to navigate to this page via url.
  // "/" in this case is the index elements and redirects to login
  if (!JSON.parse(sessionStorage.getItem("loggedIn"))) {
    window.location.href = "/"

  }

  // fetch all bills from /api/bills
  const { isLoading, data } = useFetch("/api/bills");




  // define click handler for "Löschen" buton for deleting bills
  const handleClick = (billID) => {
    // only delete, if user confirms
    if (window.confirm('Möchtest du wirklich die Rechnung löschen?')) {
      deleteBill(billID)
    }
  };

  // continue when data is loaded
  if (!isLoading) {

    // filter /api/bills data to all datasets, that the user is creditor or debtor of
    let overviewData = data.filter(overviewData => (overviewData.debtorPersonID == sessionStorage.getItem('myPersonID') || (overviewData.creditorPersonID == sessionStorage.getItem('myPersonID'))))

    // sort overviewData by Time
    function comp(a, b) {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    overviewData.sort(comp);

    // return table of all entries that affect the logged in user
    // -> user can't see entries of other users in the group that don't affect him
    // create for each entry a delete button
    return (
      <div className="App col">

        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Gläubiger</th>
              <th>Schuldner</th>
              <th>Kommentar</th>
              <th>Datum</th>
              <th>Betrag</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/*create dynamically table content*/}
            {overviewData.map(bill => (
              <tr>
                <td>{bill.creditorFirstname + " " + bill.creditorLastname}</td>
                <td>{bill.debtorFullName}</td>
                <td>{bill.comment}</td>
                <td>{bill.date.substring(0, 10)}</td>
                <td>{bill.amount}</td>
                <td><button class="w-100 btn btn-lg btn-primary" type="submit" onClick={() => handleClick(bill.billID)}>Löschen!</button></td>
              </tr>
            ))}
          </tbody>
        </Table>

      </div>
    );
  }
}


// give useer the possibility to delete bills with delete rest call
function deleteBill(billID) {
  fetch("/api/bills/" + billID, {

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "DELETE"
  })
    .then(function (res) { window.location.reload() })
    .catch(function (res) { console.log(res) })
}

export default Overview;