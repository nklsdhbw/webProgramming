// import libraries
import * as React from 'react';
import Table from 'react-bootstrap/Table';
import useFetch from "react-fetch-hook";

// import required css
import './Overview.css';
import 'bootstrap/dist/css/bootstrap.min.css';








const Overview = () => {
  const { isLoading, data } = useFetch("https://8080-nklsdhbw-webprogramming-ltpyo05qis6.ws-eu81.gitpod.io/api/bills");

  const handleClick = (billID) => {
    // only delete, if user confirms
    if (window.confirm('Are you sure you want to press this button?')) {


      deleteBill(billID)
    }
  };

  if (isLoading === false) {
    let overviewData = data.filter(overviewData => (overviewData.debtorPersonID == sessionStorage.getItem('myPersonID') || (overviewData.creditorPersonID == sessionStorage.getItem('myPersonID'))))
    console.log(overviewData)
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
            {overviewData.map(item => (
              <tr>
                <td>{item.creditorFirstname + " " + item.creditorLastname}</td>
                <td>{item.debtorFullName}</td>
                <td>{item.comment}</td>
                <td>{item.date}</td>
                <td>{item.amount}</td>
                <td><button class="w-100 btn btn-lg btn-primary" type="submit" onClick={() => handleClick(item.billID)}>Löschen!</button></td>
              </tr>
            ))}
          </tbody>
        </Table>

      </div>
    );
  }
}



function deleteBill(billID) {
  fetch("https://8080-nklsdhbw-webprogramming-ltpyo05qis6.ws-eu81.gitpod.io/api/bills/" + billID, {

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