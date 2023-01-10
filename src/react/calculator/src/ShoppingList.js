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
  const { isLoading, data } = useFetch("https://8080-nklsdhbw-webprogramming-ltpyo05qis6.ws-eu81.gitpod.io/api/shoppingList");
  const { register, handleSubmit, formState } = useForm();
  const handleClick = (shoppingListID) => {
    // only delete, if user confirms
    if (window.confirm('Are you sure you want to press this button?')) {


      deleteEntry(shoppingListID)
    }
  };

  if (isLoading === false) {
    let shoppingListData = data.filter(shoppingListData => shoppingListData.groupID == sessionStorage.getItem('myGroupID'))
    console.log(Object.keys(data))
    console.log("test")

    const onSubmit = addItemData => {
      addEntry(addItemData.shoppingListItem, addItemData.itemAmount)

    }
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
                  {shoppingListData.map(item => (
                    <tr>
                      <td>{item.item}</td>
                      <td>{item.amount}</td>
                      <td><button class="w-100 btn btn-lg btn-primary" onClick={() => handleClick(item.shoppingListID)}>Löschen!</button></td>
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



function deleteEntry(shoppingListID) {
  fetch("https://8080-nklsdhbw-webprogramming-ltpyo05qis6.ws-eu81.gitpod.io/api/shoppingList/" + shoppingListID, {

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "DELETE"
  })
    .then(function (res) { window.location.reload() })
    .catch(function (res) { console.log(res) })
}
function addEntry(shoppingListItem, itemAmount) {
  fetch("https://8080-nklsdhbw-webprogramming-ltpyo05qis6.ws-eu81.gitpod.io/api/shoppingList?" + "item=" + shoppingListItem + "&amount=" + itemAmount + "&shoppingListID=" + uuid() + "&groupID=" + sessionStorage.getItem('myGroupID'), {

    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: "PUT"
  })
    .then(function (res) { window.location.reload() })
    .catch(function (res) { console.log(res) })
}

/// shopping list end ///
export default ShoppingList;