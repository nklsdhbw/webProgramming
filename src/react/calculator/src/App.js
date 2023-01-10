// import libraries
import * as React from 'react'
import { BrowserRouter, Routes, Route, Outlet, NavLink, useLocation } from 'react-router-dom'

// import components
import Navbar from 'react-bootstrap/Navbar'
import './App.css'
import Overview from './Overview.js'
import Splitter from './Splitter.js'
import Login from './Login.js'
import Register from './Register.js'
import ShoppingList from './ShoppingList.js'


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

const Layout = () => {
    const style = ({ isActive }) => ({
        fontWeight: isActive ? 'bold' : 'normal',
        color: 'black',
        margin: '0 1rem',
        textDecoration: "none"

    });
    const location = useLocation();
    // get the current route from the location object
    const currentRoute = location.pathname;
    console.log(currentRoute)
    return (
        <>
            <div>
                <h1 id="title"><strong>Splitmate</strong></h1>
            </div>

            <div>

                {(currentRoute !== '/' && currentRoute !== "/register") && (
                    <Navbar bg="white" variant="light" className="justify-content-center" hidden={false}>
                        <NavLink to="/shoppinglist" style={style} textDecoration="none">
                            ShoppingList
                        </NavLink>
                        <NavLink to="/overview" style={style}>
                            Overview
                        </NavLink>
                        <NavLink to="/splitter" style={style}>
                            Splitter
                        </NavLink>
                    </Navbar>)}

            </div>

            <main style={{ padding: '1rem 0' }}>
                <Outlet />
            </main>
        </>
    );
};





/// overview start ///


/// overview end ///

/// splitter start ///

/// splitter end ///


/// login start ///


/// login end ///


/// register start /// 


export default App;