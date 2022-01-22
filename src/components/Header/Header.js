import React, {useState} from "react";
import {GiHamburgerMenu} from "react-icons/gi";
import './Header.css';
import {useLocation} from "react-router-dom";


const Header = () => {
    const [showNavItems, setShowNavItems] = useState(false);
    const location = useLocation();

    const { pathname } = location;

    const splitLocation = pathname.split("/");
    return (
        <>
            <nav className="main-nav">
                <div className="logo">
                    <h2><span>K S P</span></h2>
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
        </>
    )
}
export default Header;