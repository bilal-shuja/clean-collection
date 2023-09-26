import React from 'react';
import logo from './download.svg';

const Navbar = () => {
  return (
    <>
<nav className="navbar navbar-expand-lg navbar-light  p-4" style={{backgroundColor:"white"}}>
  <div className="container-fluid" style={{backgroundColor:"white"}}>
    <a className="navbar-brand text-bold" href="#" style={{backgroundColor:"white"}}>Clean Collection</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon" />
    </button>
    <div className="collapse navbar-collapse " id="navbarNavDropdown" style={{backgroundColor:"white"}}>
      <ul className="navbar-nav ms-auto" style={{backgroundColor:"white"}}>
    <h5 className='d-flex align-items-center text-bold' style={{backgroundColor:"white",marginRight:"14em", fontWeight:"700"}}> <img className='img-fluid' src={logo} alt="" />&nbsp;&nbsp;&nbsp;Clean Collection </h5>
        <li className="nav-item" style={{marginRight:"3em"}} >
          <a className="nav-link active" style={{backgroundColor:"white"}} aria-current="page" href="#">Sign In</a>
        </li>
        <li className="nav-item" style={{marginRight:"3em"}}>
          <a className="nav-link active" style={{backgroundColor:"white"}} href="#">Sign Up</a>
        </li>
  

      </ul>
    </div>
  </div>
</nav>

    </>
  )
}

export default Navbar