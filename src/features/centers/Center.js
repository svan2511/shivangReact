import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { deleteAsyncCenter, fetchAsyncAllCenters, getAsyncCenterByName } from './centerSlice';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import ReactPaginate from 'react-paginate';
import useDebounce from '../../comopnents/useDebounce';


const itemsPerPage = 10;


function Center() {  

  const centers = useSelector((state) => state.center.centers);
  const error = useSelector((state) => state.center.error);
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();

  // pagination 
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const startIndex = currentPage * itemsPerPage;
  const currentData = centers.slice(startIndex, startIndex + itemsPerPage);

  const handleSearch = (e) => {
    setQuery(e.target.value);
 
  }

  const handleDelete = (id) => {
  
    Swal.fire({
      title: 'Do You Want To Delete This Center',
      text: 'If you delete this center ,then all data are also be deleted associated with this center .',
      icon: 'warning',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'No',
      cancelButtonColor: '#d33',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Confirmed!', 'You delete center successfully.', 'success');
        dispatch(deleteAsyncCenter(id));

      }
    });
  }

  useEffect(() => {
    error === "loading" ? Swal.showLoading() : Swal.close() ;
   },[error]);


  const debouncedInputValue = useDebounce(query, 300); // Debounce delay in milliseconds

  useEffect(() => {
    if (debouncedInputValue) {
      setCurrentPage(0);
      dispatch(getAsyncCenterByName(query));
    } else {
      dispatch(fetchAsyncAllCenters());
    }
  }, [debouncedInputValue]);
 
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
             <div className="card-body">
             <div className="form-group d-flex align-items-center">
                  <label htmlFor="center_name" class="mr-2 mb-0">Search: </label>
                  <input
                    type="text"
                    name="center_name"
                    className="form-control"
                    id="center_name"
                    value={query}
                    onChange={(e) => handleSearch(e)}
                    placeholder="Enter Center Name"
                    style={{width:"20%"}}
                  />
                  
                </div>
               <table
                 id="example1"
                 className="table table-bordered table-striped"
               >
                 <thead>
                   <tr>
                     <th>Center Name</th>
                     <th>Center Address</th>
                     <th>Total Members</th>
                     <th>Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                 { !centers.length && !error && <tr className='error' style={{textAlign:'center'}}><td colSpan={6}>No data found</td></tr>}
                 { error && <tr className='error' style={{textAlign:'center'}}><td colSpan={6}>{error}</td></tr>}
                  {currentData.map((center)=>(
                  <tr key={center._id}>
                  <td>{center.center_name}</td>
                  <td>{center.center_name}</td>
                  <td>{center.members_count}</td>
                  <td>
                    <Link to={`/dashboard/center/${center._id}`}>
                      <button type="button" className="btn btn-success">
                        <i className="fa fa-eye" aria-hidden="true" />
                        &nbsp;Details
                      </button>
                    </Link> &nbsp;
                    <a href="javascript:void(0)" onClick={() => handleDelete(center._id)}>
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
                     <th>Center Name</th>
                     <th>Center Address</th>
                     <th>Total Members</th>
                     <th>Actions</th>
                   </tr>
                 </tfoot>
               </table><br/>
               <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        pageCount={Math.ceil(centers.length / itemsPerPage)}
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

export default Center;
