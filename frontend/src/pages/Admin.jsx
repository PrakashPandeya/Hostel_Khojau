import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import "./Admin.css";
import AdminHeader from "../components/AdminHeader";
import AdminHome from "../components/AdminHome";
import AdminSidebar from "../components/AdminSidebar";
function Admin() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  useEffect(() => {
    // Get the token from local storage
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    // If token is not present, redirect to login
    if (!token) {
      navigate("/Login");
      return;
    }

    // Decode the token to get user information
    const decodedToken = jwtDecode(token);

    // Check if the role is 'user'
    if (decodedToken.role !== "user") {
      // Redirect to the login page if the user is not a user
      navigate("/Admin");
      return;
    }

    // Fetch data from the protected route
    axios
      .get("http://localhost:3001/protected", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        console.error(error);
        // Redirect to the login page if there is an authorization error
        navigate("/Login");
      });
  }, [navigate]);

  return (
    <>
      <div className="grid-container">
        <AdminHeader OpenSidebar={OpenSidebar} />
        <AdminHome />
        <AdminSidebar
          openSidebarToggle={openSidebarToggle}
          OpenSidebar={OpenSidebar}
        />
      </div>
    </>
  );
}

export default Admin;
