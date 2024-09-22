import React from 'react';
import config from '../config';

function Footer() {
 
  return (
    <>
    <footer className="main-footer">
      <div className="float-right d-none d-sm-block">
        <b>Version</b> 3.1.0
      </div>
      <strong>
        Copyright © {new Date().getFullYear()} <a href="https://adminlte.io">{config.APP_NAME}</a> 
      </strong>
      &nbsp; All rights reserved.
    </footer>
    <aside className="control-sidebar control-sidebar-dark"></aside>
  </>
  
  );
}

export default Footer;
