import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { asyncCreateMember, reSetMemberStates } from './memberSlice';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAsyncAllCenters } from '../centers/centerSlice';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';


// import { Redirect } from 'react-router-dom';


function AddMember() {  
    const { register, handleSubmit,setValue, watch, reset, formState: { errors } } = useForm();
    const [disbAmount , setdisbAmount] = useState(0);
    const [tenor , settenor] = useState("15");
    const [file , setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [lable, setlable] = useState('Select image');

    const creatememberStatus = useSelector((state) => state.member.createmember);
    const memberMsg = useSelector((state) => state.member.creatememberMsg);
    const allCenters = useSelector((state) => state.center.centers);
    const error = useSelector((state) => state.member.error);
    const imgstatus = useSelector((state) => state.member.imgstatus);
    const navigate = useNavigate();

    const dispatch = useDispatch();
    const getSwal = () => {
      let timerInterval;
      Swal.fire({
        title: '<i class="fa fa-thumbs-up"></i> Great!',
        html: memberMsg,
        timer: 5000,
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
             dispatch(reSetMemberStates());
             navigate('/dashboard/members');
        }

      });
    }

    useEffect(() => {
      dispatch(fetchAsyncAllCenters());
    },[]);

    useEffect(() => {
      imgstatus === "loading" ? Swal.showLoading() : Swal.close() ;
      if(creatememberStatus) {
        getSwal();
      }
      
    } ,[imgstatus]);

    const installmentValue = watch("monthly_inst");

    const setFileValue = ( e) => {
        if (e.target.files && e.target.files.length > 0) {
          setlable(e.target.files[0].name);
           setFile(e.target.files[0]);
           const fileUrl = URL.createObjectURL(e.target.files[0]);
           setPreviewUrl(fileUrl);
          } 
    }
    

    const getDisAmount = (e) =>{
        const newVal = parseInt(e.target.value); 
        setdisbAmount(newVal);
        calculateInstallment(newVal,tenor);
    }
    const getTenor = (e) => {
        settenor(e.target.value);
        calculateInstallment(disbAmount,e.target.value);
    }

    const calculateInstallment = (a,b) => {
     
        let principleAmount = (a/b); //Math.ceil(a/b);
        
        let intrstAmount;
        if(a) {
            switch(b) {
                case "15":
                  intrstAmount  = (a)*(.015833); //Math.ceil(a*.0158);
                break;
                case "18":
                  intrstAmount  = (a)*(.016444); //Math.ceil(a*.0165);
                break;
                case "22":
                  if(a===150000) {
                    intrstAmount  = (a)*(.012212);
                  }else {
                    intrstAmount  = (a)*(.016545);
                  }
                   //Math.ceil(a*.0136);
                break;
                case "24":
                  intrstAmount  = (a)*(.01833); //Math.ceil(a*.0184);
                break;

                default:
        
            }
       
        setValue("monthly_inst",Math.ceil(principleAmount+intrstAmount) ); 
        } else {
          //  setinstallmentValue(0);
          setValue("monthly_inst",0);
        }
    }

    const getAllData = (data) => {
      const formData = new FormData();
      formData.append('mem_img',file);
      formData.append('mem_name',data.mem_name);
      formData.append('mem_phone',data.mem_phone);
      formData.append('mem_tenor',data.mem_tenor);
      formData.append('center_id',data.center_id);
      formData.append('disb_amount',data.disb_amount);
      formData.append('monthly_inst',data.monthly_inst);
      formData.append('disb_date',data.disb_date);

       dispatch(asyncCreateMember(formData));
         reset();
      }
 
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
                <h3 className="card-title">Add New Member</h3>
              </div>
              <form method="POST" action="" encType="multipart/form-data" onSubmit={handleSubmit(getAllData)}>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Member Name</label>
                        <input
                          type="text"
                          name="mem_name"
                          className="form-control"
                          id="mem_name"
                          {...register("mem_name" , {required:"Name is required"})}
                          placeholder="Enter Member Name"
                        />
                         { errors.mem_name && <p className="error">{errors.mem_name.message}</p> }
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="row">
                      <div className={previewUrl === "" ? "col-md-12" :"col-md-6"}>
                        <div className="custom-file">
                          <input
                            type="file"
                            name="mem_img"
                            className="custom-file-input"
                            id="mem_img"
                            accept="image/*"
                            {...register("mem_img" , {required:"Image is required"})}
                            onChange={setFileValue}
                          />
                           { errors.mem_img && <p className="error">{errors.mem_img.message}</p> }
                          <label
                            className="custom-file-label"
                            htmlFor="customFile"
                          >
                            {lable}
                          </label>
                        </div>
                      </div>



                      <div className="col-md-6">
                        <div className="">
                        {previewUrl && <img src={previewUrl} width={50}/> }
                        </div>
                      </div>



                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Select Center</label>
                        <select
                          className="custom-select"
                          name="center_id"
                          id="center_id"
                          {...register("center_id" , {required:"Center is required"})}
                        >
                          <option value="">Select...</option>
                          {allCenters && allCenters.map((center) => (
                            <option value={center._id}>{center.center_name}</option>
                          ))}
                          

                        </select>
                        { errors.center_id && <p className="error">{errors.center_id.message}</p> }
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Disbusment date</label>
                        <input type="date" className='form-control datetimepicker-input' id="disb_date" name="disb_date" {...register("disb_date" , {required:"Disbusment date is required"})} />
                        { errors.disb_date && <p className="error">{errors.disb_date.message}</p> }
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Disbursment Amount</label>
                    <input
                      type="text"
                      
                      name="disb_amount"
                      className="form-control"
                      id="disb_amount"
                      placeholder="Enter Disbursment Amount"
                      {...register("disb_amount" , {required:"Disbusment amount is required"})}
                      onChange={getDisAmount}
                      
                    />
                     { errors.disb_amount && <p className="error">{errors.disb_amount.message}</p> }
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label>Select Tenor</label>
                        <select
                          className="custom-select"
                          value={tenor}
                          name="mem_tenor"
                          id="mem_tenor"
                          {...register("mem_tenor" , {required:"Tenour is required"})}
                          onChange={getTenor}
                        >
                          <option value="">Select...</option>
                          <option value={15}>15</option>
                          <option value={18}>18</option>
                          <option value={22}>22</option>
                          <option value={24}>24</option>
                        </select>
                        { errors.mem_tenor && <p className="error">{errors.mem_tenor.message}</p> }
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">
                      Monthly Installment
                    </label>
                    <input
                      type="text"
                      value={installmentValue}
                      name="monthly_inst"
                      className="form-control"
                      id="monthly_inst"
                      {...register("monthly_inst")}
                      placeholder="Enter Monthly Installment"
                      
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Phone Number</label>
                    <input
                      type="text"
                      name="mem_phone"
                      className="form-control"
                      id="mem_phone"
                      placeholder="Enter Phone Number"
                      {...register("mem_phone" , {required:"Phone number is required"})}
                      />
                       { errors.mem_phone && <p className="error">{errors.mem_phone.message}</p> }
                  </div>
                </div>
                <div className="card-footer">
                { error && <p className='error' style={{textAlign:'center'}}>{error}</p>}
                  <button type="submit" className="btn btn-info btn-block btn-lg">
                    Add Member
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

export default AddMember;
