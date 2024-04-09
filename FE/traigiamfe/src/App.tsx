import { useState } from 'react'
import './App.scss'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Login from './Pages/Login/Login'
import SignUp from './Pages/SignUp/SignUp'
import Layout from './Layout/Layout'
import Prisoner from './Pages/Prisoner/Prisoner'
import Staff from './Pages/Staff/Staff'
import InfringementReport from './Pages/InfringementReport/InfringementReport'
import Statement from './Pages/Statement/Statement'
import PrisonerDetail from './Pages/Prisoner/PrisonerDetail/PrisonerDetail'
import MyProfile from './Pages/MyProfile/MyProfile'
function App() {

  const router = createBrowserRouter(
    [
      {
        path: "/login",
        element: <Login />
      },
      {
        path: "/sign",
        element: <SignUp />
      },
      {
        path: '/',
        element: <Layout />,
        children: [
          {
            path: "",
            element: <Prisoner />
          },
          {
            path: "/staff",
            element: <Staff />
          },
          {
            path: "/infringement",
            element: <InfringementReport />
          },
          {
            path: "/statement",
            element: <Statement />
          },
          {
            path: "/:id",
            element: <PrisonerDetail />
          },
          {
            path: "/myProfile",
            element: <MyProfile />
          },
        ]
      }
    ]
  )


  return (
    <RouterProvider router={router} />
  )
}

export default App
