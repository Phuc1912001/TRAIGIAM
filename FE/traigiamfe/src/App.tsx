import { useEffect, useState } from "react";
import "./App.scss";
import { createBrowserRouter, Navigate, RouterProvider, useNavigate } from "react-router-dom";
import Login from "./Pages/Login/Login";
import SignUp from "./Pages/SignUp/SignUp";
import Layout from "./Layout/Layout";
import Prisoner from "./Pages/Prisoner/Prisoner";
import Staff from "./Pages/Staff/Staff";
import InfringementReport from "./Pages/InfringementReport/InfringementReport";
import Statement from "./Pages/Statement/Statement";
import PrisonerDetail from "./Pages/Prisoner/PrisonerDetail/PrisonerDetail";
import MyProfile from "./Pages/MyProfile/MyProfile";
import { useLoading } from "./common/Hook/useLoading";
import LazyLoading from "./LazyLoading/LazyLoading";
import StaffDetail from "./Pages/Staff/StaffDetail/StaffDetail";
import Punishment from "./Pages/Punishment/Punishment";
import CheckInCheckOut from "./Pages/CheckInCheckOut/CheckInCheckOut";
import Visit from "./Pages/Visit/Visit";
function App() {
  const { isLoading } = useLoading();


  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/sign",
      element: <SignUp />,
    },
    {
      path: '/',
      element: <Navigate to={true ? '/prisoner' : '/login'} />
    },
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/prisoner",
          element: <Prisoner />,
        },
        {
          path: "/staff",
          element: <Staff />,
        },
        {
          path: "/infringement",
          element: <InfringementReport />,
        },
        {
          path: "/statement",
          element: <Statement />,
        },
        {
          path: "prisoner/:id",
          element: <PrisonerDetail />,
        },
        {
          path: "/myProfile",
          element: <MyProfile />,
        },
        {
          path: "staff/:id",
          element: <StaffDetail />,
        },
        {
          path: "/punishment",
          element: <Punishment />,
        },
        {
          path: "/externalmoment",
          element: <CheckInCheckOut />,
        },
        {
          path: "/visit",
          element: <Visit />,
        },
      ],
    },
  ]);




  return (
    <>
      {isLoading && <LazyLoading />}
      <RouterProvider router={router} />
    </>
  );
}

export default App;
