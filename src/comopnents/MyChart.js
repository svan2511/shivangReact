// src/components/DoubleBarChart.js
import { current } from '@reduxjs/toolkit';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

const CustomizedLabel = ({ x, y, value }) => (
  
  <text x={x} y={y} dy={-10} dx={20} fill="#666" textAnchor="middle">
    {value == 0 ? null : '₹'+value}
  </text>
);

const currentYear = new Date().getFullYear();
const years = [];
for (let i = 0; i < 3; i++) {
    years.push(currentYear - i);
}

const MyChart = ({handleChangeCenter , handleChangeMember,handleChangeYear}) => {

  const mapData = useSelector((state) => state.counter.mapData);
  const demandData = useSelector((state) => state.counter.demandData);
  
  const centers = useSelector((state) => state.counter.centers);
  const members = useSelector((state) => state.counter.members);
  const singleCenter = useSelector((state) => state.center.singleCenter);

  // Adjust padding as needed
  const yAxisMax = Math.max(...mapData.map(d => d.disbursment)) ;

   // Adjust padding as needed
  const yAxisMaxDemand = Math.max(...demandData.map(d => d.demand)) ;

  
  
const handleCenter = (e) => {
  handleChangeCenter(e.target.value);
}
const handleMember = (e) => {
  handleChangeMember(e.target.value);
}

const handleYear = (e) => {
  handleChangeYear(e.target.value);
}



// useEffect(() => {
// console.log(singleCenter , 'chart');
// },[singleCenter]);


  return (
  <> 
   <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                       
                        <select
                          className="custom-select"
                          name="year_filter"
                          id="year_filter"
                          onChange={handleYear}
                          
                        >
                        
                      {years && years.length && years.map((y) =>(
                          <option key={y} value={y} >{y}</option>

                      ))

                      }

                        </select>
                
                      </div>
                    </div>


                    <div className="col-md-4">
                      <div className="form-group">
                       
                        <select
                          className="custom-select"
                          name="center_id"
                          id="center_id"
                          onChange={handleCenter}
                          
                        >
                          <option value="ALL">All Center</option>
                          {centers && centers.map((center) => (
                            <option key={center._id} value={center._id}>{center.center_name}</option>
                          ))}
                          

                        </select>
                
                      </div>
                    </div>
                    
                    <div className="col-md-4">
                      <div className="form-group">
                       
                        <select
                          className="custom-select"
                          name="member_id"
                          id="member_id"
                          onChange={handleMember}
                        >
                          <option value="ALL">All member</option>
                          {singleCenter && singleCenter.members.length && singleCenter.members.map((member) => (
                            <option key={member._id} value={member._id}>{member.mem_name}</option>
                          ))}
                          

                        </select>
                
                      </div>
                    </div>
                    
                    </div>
                    <br/>
  
   <div className='row'>
   <ResponsiveContainer width="100%" height={400}>
  <BarChart
    data={mapData}
    margin={{
      top: 50,
      right: 30,
      left: 20,
      bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis  domain={[0, yAxisMax]} tickFormatter={(value) => `₹${value}`}/>
    <Tooltip formatter={(value) => `₹${value}`} />
    <Legend />
    <Bar dataKey="disbursment" fill="#8884d8"  barSize={60} >
    <LabelList dataKey="disbursment" content={CustomizedLabel} />
    </Bar>

    <Bar dataKey="collection" fill="#82ca9d"  barSize={60} >
    <LabelList dataKey="collection" content={CustomizedLabel} />

    </Bar>
  </BarChart>
</ResponsiveContainer>

<br/><br/><h3 className="card-title">Demands / OD Report</h3><br/><hr/>
<ResponsiveContainer width="100%" height={400}>
  <BarChart
    data={demandData}
    margin={{
      top: 50,
      right: 30,
      left: 20,
      bottom: 5,
    }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <Bar dataKey="demand" fill="#34ebba"  barSize={60} >
    <LabelList dataKey="demand" content={CustomizedLabel} />
    </Bar>
    <Bar dataKey="od" fill="#eb3437"  barSize={60} >
    <LabelList dataKey="od" content={CustomizedLabel} />
    </Bar>
    <XAxis dataKey="name" />
    <YAxis domain={[0, yAxisMaxDemand]} tickFormatter={(value) => `₹${value}`}/>
    <Tooltip formatter={(value) => `₹${value}`} />
    <Legend />
    
  </BarChart>
</ResponsiveContainer>
   </div>


</>
  );
};

export default MyChart;
