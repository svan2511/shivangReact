import React, { useEffect, useState } from 'react';

import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Login from '../features/login/Login';

import { useDispatch, useSelector } from 'react-redux';
import { fetchDashBoardAsync } from '../features/counter/counterSlice';
import MyChart from './MyChart';
import { getAsyncCenterById, resetSingle } from '../features/centers/centerSlice';


function Dashboard() {

  const currentYear = new Date().getFullYear();

  const dispatch = useDispatch();

  const centers = useSelector((state) => state.counter.centers);
  const members = useSelector((state) => state.counter.members);
  const mapData = useSelector((state) => state.counter.mapData);
  const [member ,setMember] = useState("ALL");
  const [center ,setCenter] = useState("ALL");
  const [year ,setYear] = useState(currentYear);

  const handleChangeCenter = (centerVal) => {
    if(centerVal) {
      setCenter(()=>centerVal);
      if(centerVal!="ALL"){
        dispatch(getAsyncCenterById({id:centerVal , name:null}));
      }
      
    }
  }

  const handleChangeMember = (memberVal) => {
    if(memberVal) {
      setMember(()=>memberVal);
    }
  }

  const handleChangeYear = (yearVal) => {
    if(yearVal) {
      setYear(()=>yearVal);
    }
  }

  useEffect(() => {
    if(center === "ALL") {
      dispatch(resetSingle());
      dispatch(fetchDashBoardAsync({center:"ALL" , member:"ALL" ,year:year}));
    }else {
      dispatch(fetchDashBoardAsync({center:center , member:member,year:year}));
    }
    
  },[center,member,year]);
 
  return (
<>  
<div className="content-wrapper">
  <div className="content-header">
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-6 col-6">
          <div className="small-box bg-info">
            <div className="inner">
              <h3>Total Centers</h3>
              <h2><b> {centers.length}</b></h2>
            </div>
            <div className="icon">
            <i class="nav-icon fas fa-solid fa-building"></i> </div>
            <Link to="/dashboard/centers" className="small-box-footer">
              Visit Centers <i className="fas fa-arrow-circle-right" />
            </Link>
          </div>
        </div>
        <div className="col-lg-6 col-6">
          <div className="small-box bg-info">
            <div className="inner">
              <h3>Members</h3>
              <h2><b> {members.length}</b></h2>
            </div>
            <div className="icon">
              <i className="ion ion-person-add" />
            </div>
            <Link to="/dashboard/members" className="small-box-footer">
              Visit Members <i className="fas fa-arrow-circle-right" />
            </Link>
          </div>
        </div>
        {/* <div className="col-lg-3 col-6">
          <div className="small-box bg-danger">
            <div className="inner">
              <h3>65</h3>
              <p>Unique Visitors</p>
            </div>
            <div className="icon">
              <i className="ion ion-pie-graph" />
            </div>
            <a href="#" className="small-box-footer">
              More info <i className="fas fa-arrow-circle-right" />
            </a>
          </div>
        </div> */}
      </div>
      <div className="row mb-2">
        <div className="col-sm-6"></div>
        <div className="col-sm-6"></div>
      </div>
    </div>
  </div>
  <div className="content">
    <div className="container-fluid">
     
          <div className="card">
            <div className="card-header border-0">
              <div className="d-flex justify-content-between">
                <h3 className="card-title">Collection / Disbursment Report</h3>
                {/* <a href="javascript:void(0);">View Report</a> */}
              </div>
            </div>
            <div className="card-body">
            
       
    
            <MyChart handleChangeCenter={handleChangeCenter} handleChangeMember={handleChangeMember} handleChangeYear={handleChangeYear} />
           
         
          </div></div>


         
      
    </div>
  </div>
</div>

</>
  );
}

export default Dashboard;
