import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { insertAsyncCenter, reSetStates } from './centerSlice';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';


function AddCenter() {  

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
    const addStatus = useSelector((state) => state.center.addCenter);
    const addStatusMsg = useSelector((state) => state.center.addStatusMsg);
    const imgStatus = useSelector((state) => state.center.status);
    const error = useSelector((state) => state.center.error);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [openSwal , setopenSwal] = useState(false);


    const getAllData = (data) => {
        dispatch(insertAsyncCenter(data));
        reset();
      }

      const getSwal = () => {
        let timerInterval;
        Swal.fire({
          title: '<i class="fa fa-thumbs-up"></i> Great!',
          html: addStatusMsg,
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading();
          },
          willClose: () => {
            clearInterval(timerInterval);
          }
        }).then((result) => {
          /* Read more about handling dismissals below */
          if (result.dismiss === Swal.DismissReason.timer) {
                dispatch(reSetStates());
                navigate('/dashboard/centers');
          }

        });
      }

      useEffect(() => {
        imgStatus === "loading" ? Swal.showLoading() : Swal.close() ;
        if(addStatus) {
          getSwal();
        }
      
      },[imgStatus]);

  return (
  <>

   <div className="content-wrapper">
   
   
  <section className="content-header">
    <div className="container-fluid">
      <div className="row mb-2">
        <div className="col-sm-6">
          <h1 />
        </div>
        <div className="col-sm-6"></div>
      </div>
    </div>
  </section>
  <section className="content">
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-12">
          <div className="card card-primary">
          
            <div className="card-header">
              <h3 className="card-title">Add New Center</h3>
            </div>
            <form method="POST" action="" id="centerForm" onSubmit={handleSubmit(getAllData)}>
         
              <div className="card-body">
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Center Name</label>
                  <input
                    type="text"
                    name="center_name"
                    className="form-control"
                    id="center_name"
                    {...register("center_name" , {required:"Center is required"})}
                    placeholder="Enter Center Name"
                  />
                    { errors.center_name && <p className="error">{errors.center_name.message}</p> }
                </div>
                <div className="form-group">
                  <label>Center Address</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    name="center_address"
                    id="center_address"
                    placeholder="Enter Address"
                    {...register("center_address" , {required:"Center address is required"})}
                  />
                  { errors.center_address && <p className="error">{errors.center_address.message}</p> }
                </div>
              </div>
              <div className="card-footer">  
              {error && <p className='error'>{error}</p>}
                <button type="submit" className="btn btn-primary">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-6"></div>
      </div>
    </div>
  </section>
</div>

 </>
  
  );
}

export default AddCenter;
