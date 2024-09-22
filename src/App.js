import React, { useEffect } from 'react';
import { useRoutes } from 'react-router-dom';
import Login from './features/login/Login';
import Layout from './comopnents/Layout';
import Dashboard from './comopnents/Dashboard';
import Member from './features/members/Member';
import Center from './features/centers/Center';
import AddCenter from './features/centers/AddCenter';
import Single from './features/centers/Single';
import AddMember from './features/members/Addmember';
import SingleMember from './features/members/SingleMember';
import './App.css'

function AppRoutes() {
 
  let routes = useRoutes([
    { path: "/", element: <Login /> },
    { path: "dashboard", element: <Layout />,children:[
    { index:true, element: <Dashboard /> },
    { path: "members", element: < Member/> },
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
