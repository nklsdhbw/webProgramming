// import libraries
import Navbar from 'react-bootstrap/Navbar'
import { Outlet, NavLink, useLocation } from 'react-router-dom'
const Layout = () => {
    const location = useLocation()
    const style = ({ isActive }) => ({
        fontWeight: isActive ? 'bold' : 'normal',
        color: 'black',
        margin: '0 1rem',
        textDecoration: "none"

    });

    // get the current route from the location object
    const currentRoute = location.pathname;

    // only display navbar when user is logged in and current route is NOT "/"
    // which means login or "/register"
    return (
        <>
            <div>
                <h1 id="title"><strong>Splitmate</strong></h1>
            </div>

            <div>

                {((currentRoute !== '/' && currentRoute !== "/register") && (JSON.parse(sessionStorage.getItem("loggedIn")))) && (
                    <Navbar bg="white" variant="light" className="justify-content-center" hidden={false}>
                        <NavLink to="/shoppinglist" style={style} textDecoration="none">
                            Einkaufsliste
                        </NavLink>
                        <NavLink to="/overview" style={style}>
                            Übersicht
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

export default Layout


