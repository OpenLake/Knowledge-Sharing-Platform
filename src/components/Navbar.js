import React from 'react'
import {Link} from 'react-router-dom'
import {SideBarData} from "./SideBarData"
import './Navbar.css'

function Navbar() {
    return (
        <div className='nav-bar'>
            <div className='ksp'>
                <h2> K S P </h2>
            </div>

            <div className='nav-toggle'>
                <div className='nav-items'>

                    {SideBarData.map((item, index) => {
                        return (
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    {item.icon}
                                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                    <span className='span-text'>{item.title}</span>
                                </Link>
                            </li>
                        )
                    })}
                </div>
            </div>
        </div>

    );
}

export default Navbar;

