import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';

import { getAsyncCenterById } from './centerSlice';
import Swal from 'sweetalert2';
import { deleteAsyncMember, fetchAsyncSingleMemberByName } from '../members/memberSlice';
import useDebounce from '../../comopnents/useDebounce';


import ReactPaginate from 'react-paginate';

// import { Redirect } from 'react-router-dom';
const itemsPerPage = 10;

function Single() {  

   const singleCenter = useSelector((state) => state.center.singleCenter);
   const error = useSelector((state) => state.center.error);
   const imgstatus = useSelector((state) => state.center.status);
   const deleteMember = useSelector((state) => state.member.deleteMember);
   const [query, setQuery] = useState('');
   
  const dispatch = useDispatch();
  const params = useParams();

   // pagination 
   const [currentPage, setCurrentPage] = useState(0);
   const handlePageClick = (event) => {
     setCurrentPage(event.selected);
   };
 
   const startIndex = currentPage * itemsPerPage;
   const currentData = singleCenter && singleCenter.members.length ? singleCenter.members.slice(startIndex, startIndex + itemsPerPage) : [];
   const lengthMem = singleCenter && singleCenter.members.length ? singleCenter.members.length : 0;
  
  console.log(singleCenter, error , lengthMem , 'sinle center');
  
   const handleDelete = (id) => {
    Swal.fire({
      title: 'Do You Want To Delete This Member',
      text: 'If you delete this member ,then all data also be deleted associated with this member .',
      icon: 'warning',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'No',
      cancelButtonColor: '#d33',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Confirmed!', 'You delete member successfully.', 'success');
        dispatch(deleteAsyncMember({id:id}));
      }
    });

  }
  const handleSearch = (e) => {
    setQuery(e.target.value);
 
  }

  const debouncedInputValue = useDebounce(query, 300); // Debounce delay in milliseconds

  useEffect(() => {
      setCurrentPage(0);
    if (debouncedInputValue) {
      
      dispatch(getAsyncCenterById({name:query , id:params.id}));
    } else {
      dispatch(getAsyncCenterById({name:null , id:params.id}));
    }
  }, [debouncedInputValue , deleteMember]);


  // useEffect(() => {
  //   setCurrentPage(0);
  //   dispatch(getAsyncCenterById(params.id));
  // },[deleteMember]);

  useEffect(() => {
    imgstatus === "loading" ? Swal.showLoading() : Swal.close() ;
  },[imgstatus]);
 
  return (
  <>
 
   <div className="content-wrapper">
    
   <section className="content-header">
     <div className="container-flucenter_id">
       <div className="row mb-2">
         <div className="col-sm-6">
           <div className="col-sm-6">
             <h3></h3>
           </div><Link to="/dashboard/add/center" className="btn btn-info btn-sm">
  Add New Center
</Link>

         </div>
       </div>
     </div>
   </section>
   <section className="content">
     <div className="container-flucenter_id">
       <div className="row">
         <div className="col-12">
           <div className="card">
             <div className="card-header">
               <h3 className="card-title" />
             </div>
             <div className="card-body"><div className="form-group d-flex align-items-center">
                  <label htmlFor="mem_name" class="mr-2 mb-0">Search: </label>
                  <input
                    type="text"
                    name="mem_name"
                    className="form-control"
                    id="mem_name"
                    value={query}
                    onChange={(e) => handleSearch(e)}
                    placeholder="Enter Member Name"
                    style={{width:"20%"}}
                  />
                  
                </div>
               <table
                 id="example1"
                 className="table table-bordered table-striped"
               >
                 <thead>
                   <tr>
                     <th>Image</th>
                     <th>Name</th>
                     <th>Center</th>
                     <th>Disb Amount</th>
                     <th>Disb Date</th>
                     <th>Actions</th>
                   </tr>
                 </thead>
                 <tbody>

                 { singleCenter && !lengthMem && !error && <tr className='error' style={{textAlign:'center'}}><td colSpan={6}>No data found</td></tr>}
                 {error && <tr className='error' style={{textAlign:'center'}}><td colSpan={6}>{error}</td></tr>}
                  {singleCenter && currentData.map((member)=>(
                  <tr key={member._id}>
                  <td><img src={member.mem_img} width={50} /></td>
                  <td>{member.mem_name}</td>
                  <td>{singleCenter.center_name}</td>
                  <td>{"₹ "+member.disb_amount}</td>
                  <td>{ new Date(member.disb_date).toLocaleDateString('en-GB',{
 // weekday: 'long', // "Monday"
  year: 'numeric', // "2024"
  month: 'short', // "August"
  day: 'numeric' // "28"
})}</td>
                
                
                  <td>
                    <Link to= {`/dashboard/member/${member._id}`} >
                      <button type="button" className="btn btn-success">
                        <i className="fa fa-eye" aria-hidden="true" />
                        &nbsp;Details
                      </button>
                    </Link> &nbsp;
                    <a href="javascript:void(0)" onClick={() => handleDelete(member._id)}>
                      <button type="button" className="btn btn-danger">
                        <i className="fas fa-trash-alt" /> &nbsp;Delete
                      </button>
                    </a>
                  </td>
                </tr>
                   ))} 

                 </tbody>
                 <tfoot>
                 <tr>
                     <th>Image</th>
                     <th>Name</th>
                     <th>Center</th>
                     <th>Disb Amount</th>
                     <th>Disb Date</th>
                     <th>Actions</th>
                   </tr>
                 </tfoot>
               </table><br/>
               <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        pageCount={Math.ceil(lengthMem / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        pageClassName={'page-item'}
        pageLinkClassName={'page-link'}
        previousClassName={'page-item'}
        previousLinkClassName={'page-link'}
        nextClassName={'page-item'}
        nextLinkClassName={'page-link'}
        breakClassName={'page-item'}
        breakLinkClassName={'page-link'}
        activeClassName={'active'}
      />
             </div>
           </div>
         </div>
       </div>
     </div>
   </section>
 </div>
 </>
  
  );
}

export default Single;
