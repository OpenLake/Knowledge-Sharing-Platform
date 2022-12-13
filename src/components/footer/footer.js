import React, {useState} from "react";
import './footer.css';
import {FaDiscord} from 'react-icons/fa'
import {BsInstagram} from 'react-icons/bs'
import {FaFacebook} from 'react-icons/fa'
import {BsTwitter} from 'react-icons/bs'

const Footer = () => {
   
    return (
        <>
            <div>
            <footer class="footer"> 
  	 <div class="container">
  	 	<div class="row">
  	 		<div class="footer-col">
  	 			<h4>Knowledge Sharing Platform</h4>
  	 			<ul>
  	 				<li><a href="#">about us</a></li>
  	 				<li><a href="#">our services</a></li>
  	 				<li><a href="#">privacy policy</a></li>
  	 				<li><a href="#">affiliate program</a></li>
  	 			</ul>
  	 		</div>
  	 		<div class="footer-col">
  	 			<h4>get help</h4>
  	 			<ul>
  	 				<li><a href="#">Email</a></li>
  	 				<li><a href="#">Helpline Number</a></li>
  	 				<li><a href="#">Fax</a></li>
  	 				
  	 			</ul>
  	 		</div>
  	 		<div class="footer-col">
  	 			<h4>Courses</h4>
  	 			<ul>
  	 				<li><a href="#">Bsc</a></li>
  	 				<li><a href="#">BTech</a></li>
  	 				<li><a href="#">MTech</a></li>
  	 				<li><a href="#">MBBS</a></li>
  	 			</ul>
  	 		</div>
  	 		<div class="footer-col">
  	 			<h4>follow us</h4>
  	 			<div class="social-links">
                   <a href="#"><FaDiscord/></a>
  	 				<a href="#"><BsInstagram/></a>
  	 				<a href="#"><FaFacebook/></a>
  	 				<a href="#"><BsTwitter/></a>
  	 			</div>
  	 		</div>
  	 	</div>
  	 </div>
  </footer>
            </div>
        </>
    )
}
export default Footer;