import { createContext, useEffect, useState } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider
} from "react-router-dom";
import "./App.scss";
import { useLoading } from "./common/Hook/useLoading";
import { UserModel } from "./common/Model/user";
import Layout from "./Layout/Layout";
import LazyLoading from "./LazyLoading/LazyLoading";
import Banding from "./Pages/Banding/Banding";
import CheckInCheckOut from "./Pages/CheckInCheckOut/CheckInCheckOut";
import Dom from "./Pages/Dom/Dom";
import DomDetail from "./Pages/Dom/DomDetail/DomDetail";
import DomGender from "./Pages/DomGender/DomGender";
import InfringementDetail from "./Pages/InfringementReport/InfringementDetail/InfringementDetail";
import InfringementReport from "./Pages/InfringementReport/InfringementReport";
import Login from "./Pages/Login/Login";
import MyProfile from "./Pages/MyProfile/MyProfile";
import Prisoner from "./Pages/Prisoner/Prisoner";
import PrisonerDetail from "./Pages/Prisoner/PrisonerDetail/PrisonerDetail";
import Punishment from "./Pages/Punishment/Punishment";
import SignUp from "./Pages/SignUp/SignUp";
import Staff from "./Pages/Staff/Staff";
import StaffDetail from "./Pages/Staff/StaffDetail/StaffDetail";
import Statement from "./Pages/Statement/Statement";
import Visit from "./Pages/Visit/Visit";

export const contextUser = createContext<any>({});

function App() {
  const { isLoading } = useLoading();

  const [data, setData] = useState<any>();

  const storedUserDataString = localStorage.getItem("userData");
  useEffect(() => {
    if (storedUserDataString) {
      const storedUserData = JSON.parse(storedUserDataString ?? "");
      setData(storedUserData);
    }
  }, [storedUserDataString]);



  const router = createBrowserRouter([
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <SignUp />,
    },
    {
      path: "/",
      element: <Navigate to={data !== undefined ? "/prisoner" : "/login"} />,
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
          path: "/infringement/:id",
          element: <InfringementDetail />,
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
        {
          path: "/gender",
          element: <DomGender />,
        },
        {
          path: "gender/dom",
          element: <Dom />,
        },
        {
          path: "gender/dom/:id",
          element: <DomDetail />,
        },

        {
          path: "/banding",
          element: <Banding />,
        },
      ],
    },
  ]);

  const [user, setUser] = useState<UserModel>({});

  return (
    <contextUser.Provider
      value={{
        user,
        setUser,
      }}
    >
      {isLoading && <LazyLoading />}
      <RouterProvider router={router} />
    </contextUser.Provider>
  );
}

export default App;
