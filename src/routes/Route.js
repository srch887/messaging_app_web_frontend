import * as React from 'react'
import { RouterProvider } from 'react-router-dom'
import routelist from './routelist'

const Route = () => {
    const routes = routelist[0]?.routes

    console.log(routes)

    return (<RouterProvider router={routes} />);
}

export default Route;