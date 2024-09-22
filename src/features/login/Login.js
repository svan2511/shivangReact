import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserLogin } from './loginSlice';
import { Navigate} from 'react-router-dom';
import Swal from 'sweetalert2';
import config from '../../config';


function Login() {  
  
  const { register, handleSubmit, formState: { errors } } = useForm();

  const loggedStatus =  useSelector((state) => state.login.loggedIn);
  const loadingStatus =  useSelector((state) => state.login.status);
  const loggedmsg =  useSelector((state) => state.login.loggedInmsg);
  const error =  useSelector((state) => state.login.error);
  const authToken  =  useSelector((state) => state.login.token);
 
  
  const dispatch = useDispatch();

  const getAllData = (data) => {
    dispatch(fetchUserLogin(data));
  }


  useEffect(() => {
    loadingStatus === "loading" ? Swal.showLoading() : Swal.close() ;
    if(loggedStatus && authToken){
      localStorage.setItem('auth_token',authToken);
    }
   
  },[loadingStatus]);

  return (
    <>
   {loggedStatus && <Navigate to="/dashboard" replace={true}></Navigate> }
    <div className="content-wrapper" style={{marginRight: '250px'}}>
    <section className="content-header">
      <div className="container-fluid">
        <div className="row mb-2">
          <div className="col-sm-6">
            
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
                <h3 className="card-title"> {config.APP_NAME} </h3>
              </div>
              <form method="POST" action="" id="quickForm" onSubmit={handleSubmit(getAllData)}>
                <div className="card-body">
                  <div className="form-group">
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      id="email"
                      {...register("email" , {required:"Email is required"})}
                      placeholder="Enter email"
                    />
                    { errors.email && <p className="error">{errors.email.message}</p> }
                  </div>
                  <div className="form-group">
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="form-control"
                      
                      id="password"
                      {...register("password" , {required:"Password is required"})}
                      placeholder="Password"
                    />
                    { errors.password && <p className="error">{errors.password.message}</p> }
                  </div>
                </div>
                <div className="card-footer"> 
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                 
                  {error && <p className='error'>{error}</p>}
                  {!loggedStatus && <p className='error'>{loggedmsg}</p>}
                 
                  
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

export default Login;
