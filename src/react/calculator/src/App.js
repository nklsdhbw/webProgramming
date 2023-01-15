// import libraries
import * as React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// import components
import Overview from './Overview.js'
import Splitter from './Splitter.js'
import Login from './Login.js'
import Register from './Register.js'
import ShoppingList from './ShoppingList.js'
import Layout from './Layout.js'

// import required css
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'




const App = () => {

    return (
        <BrowserRouter>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Login />} />
                    <Route path="shoppinglist" element={<ShoppingList />} />
                    <Route path="overview" element={<Overview />} />
                    <Route path="splitter" element={<Splitter />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="*" element={<p>There's nothing here: 404!</p>} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};








export default App;