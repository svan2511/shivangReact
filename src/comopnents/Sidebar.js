import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserLogout } from '../features/login/loginSlice';
import Swal from 'sweetalert2';

function Sidebar() {

  const[isActive , setisActive] = useState('dash');
   const tokenLogout = useSelector((state) => state.login.token);
  const token = localStorage.getItem("auth_token");
  const imgStatus = useSelector((state) => state.login.status);
  

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleStyle = (val) => {
    setisActive(val);
  }

  const handleLogout = () => {
    Swal.fire({
      title: 'Do You Want To Logout from the system',
      text: 'Are You sure?',
      icon: 'success',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'No',
      cancelButtonColor: '#d33',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Confirmed!', 'You have successfully Loged out.', 'success');
        dispatch(fetchUserLogout(token));
      }
    });
 

  }

  useEffect(() => {
    imgStatus === "loading" ? Swal.showLoading() : Swal.close() ;
   
    if(tokenLogout === "logout") {
      localStorage.clear('auth_token');
      navigate('/');
    }

  },[imgStatus]);
 
 
  return ( 
    <aside className="main-sidebar sidebar-dark-primary elevation-4">
    <div className="sidebar">
      <div className="user-panel mt-3 pb-3 mb-3 d-flex">
        <div className="info">
          <a href="#" className="d-block">
            Welcome Admin
          </a>
          <a href="javascript:void(0)" onClick={handleLogout} className="btn btn-block btn-success btn-sm">
            LOGOUT
          </a>
        </div>
      </div>
      <nav className="mt-2">
        <ul
          className="nav nav-pills nav-sidebar flex-column"
          data-widget="treeview"
          role="menu"
          data-accordion="false"
        >
          <li className="nav-item">
            <Link to="/dashboard" className={ isActive === 'dash' ? 'nav-link active' : 'nav-link' }   onClick={()=>handleStyle('dash')} >
              <i className="nav-icon fas fa-tachometer-alt" />
              <p> 
                Dashboard
                <span className="right badge badge-danger" />
              </p>
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/dashboard/centers" className={isActive === 'center' ? 'nav-link active' : 'nav-link'} onClick={()=>handleStyle('center')} >
              <i className="nav-icon fas fa-solid fa-building" />
              <p>
                Manage Center
                <span className="right badge badge-danger" />
              </p>
            </Link>
          </li>

          <li className="nav-item">
            <Link to="/dashboard/members" className={isActive === 'member' ? 'nav-link active' : 'nav-link'} onClick={()=>handleStyle('member')}>
              <i className="nav-icon fas fa-solid fa-users" />
              <p>
                Manage Members
                <span className="right badge badge-danger" />
              </p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  </aside>
  
  );
}

export default Sidebar;
