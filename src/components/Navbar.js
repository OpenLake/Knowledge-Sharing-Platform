import React from 'react'
import {Link} from 'react-router-dom'
import {Helmet} from 'react-helmet'
import {SideBarData} from "./SideBarData"
import './Navbar.css'

function Navbar() {

    return (
        <div>
            <Helmet>
                <style>{'body { background-color: #f5f5fb; }'}</style>
            </Helmet>

            <div>
                <div className='ksp'>
                    <h3> K S P </h3>
                </div>

                <div className='nav-bar'>
                    <div className='nav-items'>

                        {SideBarData.map((item, index) => {
                            return (
                                <li key={index} className={item.cName}>
                                    <Link to={item.path}>
                                        {item.icon}
                                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                        <span>{item.title}</span>
                                    </Link>
                                </li>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Navbar