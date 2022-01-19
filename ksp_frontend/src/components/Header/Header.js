import React, {useState} from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import './Header.css';


const Header = () => {
    const [showNavItems, setShowNavItems] = useState(false);

    return (
        <>
            <nav className="main-nav">
                <div className="logo">
                    <h2><span>K S P</span></h2>
                </div>
                <div className={showNavItems ? "mobile-nav-link" : "nav-links"}>
                    <ul>
                        <li>
                            <a href="/" className="nav-item">Home</a>
                        </li>
                        <li>
                            <a href="/notes" >Notes</a>
                        </li>
                        <li>
                            <a href="/PYQs" >PYQs</a>
                        </li>
                        <li>
                            <a href="/feedbacks">Feedbacks</a>
                        </li>
                    </ul>

                </div>

                <div className="login-signup">
                    <ul className="ls-desktop">
                        <li>
                            <a href="#">
                                LOGIN
                            </a>
                        </li>

                    </ul>
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