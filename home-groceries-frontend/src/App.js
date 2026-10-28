
import React from "react"; 
import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Login from "./pages/Login"; 
import Signup from "./pages/Signup"; 
import Dashboard from "./pages/Dashboard"; 
import Confirm from "./pages/Confirm"; 
import ForgetPassword from "./pages/ForgetPassword"; 

function App() { 
  return ( 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
      </Routes>
    </BrowserRouter>
  ); 
} 

export default App;