import React, { useEffect, useState } from 'react';

import Header from '../../comopnents/Header';
import Sidebar from '../../comopnents/Sidebar';
import Footer from '../../comopnents/Footer';
import { useDispatch, useSelector } from 'react-redux';
import { asyncUpdateInstallment, fetchAsyncSingleMember, reSetInstallment, reSetMemberStates } from './memberSlice';
import { useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';

function SingleMember() {  

  const { register, handleSubmit,setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues:{
      "remain_amount_single":0,
      "paid_amount_single":0,
      "inst_id":1
    }
  });
  const [isOpenIDiv,setisOpenIDiv] = useState(false);
  const [openIDivId,setopenIDivId] = useState(null);

  const [isOpenIneerDiv,setisOpenIneerDiv] = useState(false);
  const [OpenIneerDivId,setOpenIneerDivId] = useState(null);


  const member = useSelector((state)=> state.member.singleMember);
  const updateStatus = useSelector((state)=> state.member.updateStatus);
  const imgstatus = useSelector((state)=> state.member.imgstatus);
  const error = useSelector((state)=> state.member.error);
  const dispatch = useDispatch();
  const params = useParams();

  const remainAmount = watch('remain_amount_single');
  const paidAmount = watch('paid_amount_single');
  const instId = watch('inst_id');

  const handleClickButton = (divId)=>{
    setisOpenIDiv(()=>!isOpenIDiv);
    setopenIDivId(() => divId);
    setValue('inst_id' , divId);
    
  }

  const changeDateFormat = (date) => {
    return new Date(date).toLocaleDateString('en-GB',{
      // weekday: 'long', // "Monday"
       year: 'numeric', // "2024"
       month: 'short', // "August"
       day: 'numeric' // "28"
     })  
    
    }

  const handleOdChange = (innerDivId)=> {
    setisOpenIneerDiv(!isOpenIneerDiv);
    setOpenIneerDivId(() => innerDivId);
    setValue('paid_amount_single' ,0 );
    setValue('remain_amount_single' , 0);
  }

  const calculateRemainAmount = (instAmount , paidAmount)=>{
    if(paidAmount > instAmount || !paidAmount) {
      setValue('paid_amount_single' ,instAmount );
      setValue('remain_amount_single' , 0);
    } else {
      setValue('remain_amount_single' , ( parseInt(instAmount) - parseInt(paidAmount) ) );
    }
  }

  const getAllData = (data)=>{
    // console.log(data);
    // console.log(data.remain_amount_single === +data.insst_amnt);
   dispatch(asyncUpdateInstallment(data));
  }

  useEffect(() => {
    if(updateStatus) {
      setisOpenIDiv(() => !isOpenIDiv);
     // dispatch(reSetInstallment());
    }
    dispatch(fetchAsyncSingleMember(params.id));

  } ,[updateStatus]);

  useEffect(() => {
    imgstatus === "loading" ? Swal.showLoading() : Swal.close() ;
  } ,[imgstatus]);
 
  return (
  <>
   
   { error && <p className='error' style={{textAlign:'center'}}>{error}</p>}
{member &&  <div className="content-wrapper" id="test">

  {/* <div className="card-footer">
        
        <div className="row">

        <div className="col-md-12" style={{ marginTop: 20 }}  >
   
        <VideoRecorder/>
   </div>
        
        </div>
      </div>  */}
  <section className="content-header">
    <div className="container-fluid">
      <div className="row mb-2">
        <div className="col-sm-6">
          <h1>Member Record <button
            
            className="btn btn-info"
            style={{ borderRadius: 20, width: "20%" }}
            type="button"
            onClick={()=> window.print()}
            
            > Print Info 
            
            </button></h1>
          
        </div>
        <div className="col-sm-6"></div>
      </div>
    </div>
  </section>
  <section className="content">
  <div className="row">
  
  <div className="col-md-12">
    <div className="card card-widget widget-user shadow" style={{ marginLeft: "6%" }}>
      
      <div className="widget-user-header bg-info">
        <h2 className="widget-user-username">{member.mem_name}</h2>
        <p className="widget-user-desc">{member.center.center_name} , {member.center.center_address} ,  +91-{member.mem_phone}</p>
        
      </div>
      <div className="widget-user-image">
        <img
        
          className="img-circle elevation-2"
          src={member.mem_img}
          alt="User Avatar"
          width={100}
        />
      </div>
      <div className="card-footer">
        <div className="row">
          <div className="col-sm-4 border-right">
            <div className="description-block">
              <h5 className="description-header">Disb Amount </h5>
              <span className="description-text">
                         
                      {'₹ ' + member.disb_amount}</span>
            </div>
          </div>
          <div className="col-sm-4 border-right">
            <div className="description-block">
              <h5 className="description-header">Monthly Installment</h5>
              <span className="description-text">{"₹ "+member.monthly_inst}</span>
            </div>
          </div>
          <div className="col-sm-4 border-right">
            <div className="description-block">
              <h5 className="description-header">Date of disbursment</h5>
              <span className="description-text">{ new Date(member.disb_date).toLocaleDateString('en-GB',{
 // weekday: 'long', // "Monday"
  year: 'numeric', // "2024"
  month: 'short', // "August"
  day: 'numeric' // "28"
})}</span>
            </div>
          </div>
        
        </div>
      </div>
    </div>
  </div>
  
</div>
  </section>

  <div className="card-footer">
        <h5 className="mb-2">All Installments History </h5>
        <div className="row">

{member.installments && member.installments.map((installment , index)=>(
  
  <div className="col-md-4" style={{ marginTop: 20 }}  key={installment._id} >
   
            <button
            
              className="btn btn-info"
              style={{ borderRadius: 20, width: "100%" }}
              type="button"
              aria-expanded="false"
              aria-controls="collapseExample"
              onClick={() => handleClickButton(installment._id)}
              disabled={ new Date() < new Date(installment.due_date)  ||  installment.status === 1 }
            >
           <span style={{float: "inline-start"}}>( {index + 1} )</span>  
          { 
          ( (openIDivId === installment._id && installment.status===1 )  || installment.status === 1 ) 
           
          ? "Payment Completed":

          ( (openIDivId === installment._id && installment.status===2 )  || installment.status === 2 )

          ? "Partially complete" :
           
           " Pay on "+changeDateFormat(installment.due_date)   }
          
            </button>
          { isOpenIDiv && openIDivId === installment._id && <div className="mycollasp" style={{ marginTop: 10,marginLeft: 0,width: "100%" }}>
             <form method="POST" onSubmit={handleSubmit(getAllData)}><div className="card card-body" >
              <input type="hidden" name="inst_id" id="inst_id" value={instId}  {...register("inst_id")}/>
              {installment.status === 2 && <input type="hidden" value={installment.inst_amount} name="partialy_update" id="partialy_update" {...register("partialy_update")}/>}
                <div className="form-group">
                  <label htmlFor="exampleInputEmail1">{installment.status === 0 ? "Installment Amount" : "Remaining Amount" }</label>
                  <input
                    type="text"
                    value={ installment.status === 0  ? installment.inst_amount : installment.remain_amount }
                    className="form-control"
                    id="insst_amnt"
                    name="insst_amnt"
                    {...register("insst_amnt")}
                    readOnly
                  />
                </div>


               
                      <div className="form-group">
                        <label>Collection date</label>
                        <input type="date" className='form-control datetimepicker-input' id="disb_date" name="disb_date" {...register("disb_date")} />
    
                      </div>
                  

                
            { installment.status!=2 && isOpenIneerDiv && OpenIneerDivId === installment._id &&  <div className="form-group">
                  <label htmlFor="exampleInputEmail1">Paid Amount</label>
                  <input
                    type="text"
                    id="paid_amount_single"
                    name="paid_amount_single"
                    className="form-control"
                    value={paidAmount}
                   {...register("paid_amount_single")}
                   onKeyUp={(e) => calculateRemainAmount(installment.inst_amount ,e.target.value)}
                  />
                </div> }

             {installment.status!=2 && isOpenIneerDiv && OpenIneerDivId === installment._id && 
                <div className="form-group" >
                <label htmlFor="exampleInputEmail1">Remain Amount</label>
                <input type="text" id="remain_amount_single" value={remainAmount} name="remain_amount_single" className="form-control"
                 {...register("remain_amount_single")}
                readOnly />
              </div> 
             }

              { installment.status != 2 &&
                 <div className="form-check">
                 <input type="checkbox" className="form-check-input" onChange={() => handleOdChange(installment._id)}/>
                 <label className="form-check-label" htmlFor="exampleCheck1">
                   HAS OD
                 </label>
               </div>
              }

               <br/>
                <button className="btn btn-info" type="submit" >
                  Update
                </button>
              </div></form>
            </div> }
          </div>
))}

        
        </div>
      </div> 

     
</div>}

 </>
  
  );
}

export default SingleMember;
