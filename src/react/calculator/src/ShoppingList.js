// import libraries
import * as React from 'react';
import useFetch from "react-fetch-hook";
import Table from 'react-bootstrap/Table';
import { v4 as uuid } from 'uuid';
import { useForm } from "react-hook-form";

// import required css
import './ShoppingList.css';
import 'bootstrap/dist/css/bootstrap.min.css';





const ShoppingList = () => {

  // if user is not logged in, navigate him to "/" which in this case is the login page
  if (!JSON.parse(sessionStorage.getItem("loggedIn"))) {
    window.location.href = "/"

  }

  // get shoppingListData from /api/shoppingList
  const { isLoading, data } = useFetch("/api/shoppingList");

  // create form
  const { register, handleSubmit, formState } = useForm();

  // click handler of delete button for deleting shopping list entries
  const handleClick = (shoppingListID) => {

    // only delete, if user confirms
    if (window.confirm('Möchtest du wirklich den Gegenstand von der Einkaufliste löschen?')) {
      deleteEntry(shoppingListID)
    }
  };


  // continue if data from api/shoppingList is completely loaded
  if (!isLoading) {

    // filter the data from /api/shoppingList on groupID
    let shoppingListData = data.filter(shoppingListData => shoppingListData.groupID == sessionStorage.getItem('myGroupID'))

    // handles the submit of the "Eintrag hinzufügen" button, in this case it adds the new entry
    const onSubmit = addItemData => {
      addEntry(addItemData.shoppingListItem, addItemData.itemAmount)
    }

    // return form for adding a new entry to the shopping list
    // disable the "Eintrag hinzufügen" button when the input fields are empty
    // input fields are all text-type, so that the user can type "1 Packung" or "1 Dose" ->so he's not restricted in package size
    // return also a table that displays the shopping list of the group(=WG) and display buttons to delete entries
    return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div id="wrapper">
            <div id="shoppingListTable" className="App">

              <Table striped bordered hover className="table mx-auto">
                <thead>
                  <tr>
                    <th class="col">Gegenstand</th>
                    <th class="col">Menge</th>
                    <th class="col"></th>
                  </tr>
                </thead>
                <tbody>
                  {shoppingListData.map(entry => (
                    <tr>
                      <td>{entry.item}</td>
                      <td>{entry.amount}</td>
                      <td><button class="w-100 btn btn-lg btn-primary" onClick={() => handleClick(entry.shoppingListID)}>Löschen!</button></td>
                    </tr>
                  ))}
                </tbody>
              </Table>

            </div>

            <div id="addShoppingListEntry">
              <div class="input-group mb-3">
                <span class="input-group-text">Gegenstand</span>
                <input {...register("shoppingListItem", { required: true })} id="shoppingListItem" type="text" class="form-control"></input>
              </div>
              <div class="input-group mb-3">
                <span class="input-group-text">Menge</span>
                <input {...register("itemAmount", { required: true })} id="itemAmount" type="text" class="form-control"></input>
              </div>
              <div>
                <button class="w-100 btn btn-lg btn-primary" disabled={!formState.isValid} type="submit">Hinzufügen zur Einkaufsliste</button>
              </div>
            </div>

          </div>
        </form>
      </>
    );
  };
}


// delete entry from shoppingListID
function deleteEntry(shoppingListID) {
  fetch("/api/shoppingList/" + shoppingListID, {

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "DELETE"
  })
    .then(function (res) { window.location.reload() })
    .catch(function (res) { console.log(res) })
}

// add entry to the shoppinglist
function addEntry(shoppingListItem, itemAmount) {
  fetch("/api/shoppingList?" + "item=" + shoppingListItem + "&amount=" + itemAmount + "&shoppingListID=" + uuid() + "&groupID=" + sessionStorage.getItem('myGroupID'), {

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "PUT"
  })
    .then(function (res) { window.location.reload() })
    .catch(function (res) { console.log(res) })
}

export default ShoppingList;