// Layout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';

import Sidebar from './Sidebar';
import Protected from './Protected';
import { Outlet } from 'react-router-dom';


const Layout = () => {
  return (
    <>
      <Header /><Sidebar/>
    
      <main>
        <Protected>
        <Outlet />{/* This is where the routed components will be rendered */}
        </Protected> 
      </main>
      <Footer />
    </>
  );
};

export default Layout;
