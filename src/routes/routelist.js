import { createBrowserRouter } from "react-router-dom";
import Messenger from "../messenger/Messenger";
import Login from "../login/Login";
import Signup from "../signup/Signup";

const routelist = [
    {
        role: 'User',
        routes: createBrowserRouter([
            {
                path: '/messenger',
                element: <Messenger />
            },
            {
                path: '/',
                element: <Login />
            },
            {
                path: '/signup',
                element: <Signup />
            }
        ])
    }
]

export default routelist