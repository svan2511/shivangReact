import React, { useEffect } from 'react';
import Login from '../login/Login';
import { createBrowserRouter, Route, RouterProvider, Routes, useRoutes } from 'react-router-dom';
import Dashboard from '../../comopnents/Dashboard';
import Center from '../centers/Center';
import AddCenter from '../centers/AddCenter';
import Single from '../centers/Single';
import AddMember from '../members/Addmember';
import Member from '../members/Member';
import SingleMember from '../members/SingleMember';
import Layout from '../../comopnents/Layout';


function AppRoutes() {
 
  let routes = useRoutes([
    { path: "/", element: <Login /> },
    { path: "dashboard", element: <Layout />,children:[
    { index:true, element: <Dashboard /> },
    { path: "members", element: <Member /> },
    { path: "centers", element: <Center /> },
    { path: "add/center", element: <AddCenter /> },
    { path: "center/:id", element: <Single /> },
    { path: "add/member", element: <AddMember /> },
    { path: "member/:id", element: <SingleMember /> },
    ] },
    
  ]);
  return routes;
}

function App() {

  return (
  <AppRoutes/>
  );
}

export default App;
