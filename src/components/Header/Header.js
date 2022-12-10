import React, {useState} from "react";
import {GiHamburgerMenu} from "react-icons/gi";
import './Header.css';
import {useLocation} from "react-router-dom";
import {GrFormClose} from "react-icons/gr"


const Header = () => {
    const [showNavItems, setShowNavItems] = useState(false);
    const [showTagLine, setShowTagLine] = useState(true)
    const location = useLocation();

    const { pathname } = location;

    const splitLocation = pathname.split("/");
    return (
        <div className="nav-header">
            {showTagLine ? <div className="tagline"> <div className="content">Are you tired of looking for notes and previous year papers to pratice? <span>We have got you cover!</span> </div> <GrFormClose className="close-btn" onClick={() => {setShowTagLine(false)}}/></div> : ""}
            <nav className="main-nav">
                <div className="logo">
                    <h2> <span className="logo-design"><span className="circle-1"></span> <span className="circle-2"></span> </span> <span style={{marginLeft: '3rem', fontWeight: '700'}}>KSP</span></h2>
                </div>
                <div className={showNavItems ? "mobile-nav-link" : "nav-links"}>
                    <ul>
                        <li>
                            <a href="/" className={splitLocation[1] === "" ? "active" : " "}>Home</a>
                        </li>
                        <li>
                            <a href="/notes" className={splitLocation[1] === "notes" ? "active" : " "}>Notes</a>
                        </li>
                        <li>
                            <a href="/PYQs" className={splitLocation[1] === "PYQs" ? "active" : " "}>PYQs</a>
                        </li>
                        <li>
                            <a href="/feedbacks" className={splitLocation[1] === "feedbacks" ? "active" : " "}>Feedbacks</a>
                        </li>
                    </ul>

                </div>

                <div className="drop-down-nav">
                    <div className="hamburger-menu">
                        <a href="#" onClick={() => setShowNavItems(!showNavItems)}>
                            <GiHamburgerMenu style={{color: "white"}}/>
                        </a>
                    </div>
                </div>
            </nav>
        </div>
    )
}
export default Header;