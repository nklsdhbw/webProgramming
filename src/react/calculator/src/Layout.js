import Navbar from 'react-bootstrap/Navbar'
import { Outlet, NavLink } from 'react-router-dom'
const Layout = () => {
    let loginStatus = sessionStorage.getItem("loggedIn")
    const style = ({ isActive }) => ({
        fontWeight: isActive ? 'bold' : 'normal',
        color: 'black',
        margin: '0 1rem',
        textDecoration: "none"

    });

    // only display navbar when user is logged in, case when "loggedIn" = true
    return (
        <>
            <div>
                <h1 id="title"><strong>Splitmate</strong></h1>
            </div>

            <div>

                {(loginStatus) && (
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
//currentRoute !== '/' && currentRoute !== "/register"//const location = useLocation();
    // get the current route from the location object
    //const currentRoute = location.pathname;
    //console.log(currentRoute)