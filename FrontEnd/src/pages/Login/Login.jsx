import React from 'react'
import './Login.css'
import logo from '../../assets/logo.png'
const Login = () => {
  return (
    <div className='login'>
        <img src={logo}  className='login-logo' alt=""/>
      <div className="login-form">
      <h1>Sign Up</h1>
      <form>
        <input type="text" placeholder='your name'/>
        <input type="email" placeholder='email'/>
        <input type="password" placeholder='password'/>
        <button>Sign In</button>
        <div className="form-help">
            <div className='remember'>
                <input type="chechbox"/>
                <label htmlForm="">Remember Me</label>
            </div>
        <p>Need Help?</p>
        </div>
      </form>  
      <div className="form-switch">
        {signState==="Sign In"?
        <p>New to Netflix? <span onClick={()=>{setSignState("Sign Up")}}>Sign Up Now</span></p>
        :<p>Already Have Account? <span onClick={()=>{setSignState("Sign In")}}>Sign In Now</span></p>
        }
      </div>
      </div>
    </div>
  )
}

export default Login
