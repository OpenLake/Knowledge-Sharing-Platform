import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faBriefcase,
  faPaperPlane,
  faQuestion,
  faImage,
  faCopy,
} from "@fortawesome/free-solid-svg-icons";
import { NavItem, NavLink, Nav, Menu } from "reactstrap";
import classNames from "classnames";
import { Link } from "react-router-dom";

//import SubMenu from "./SubMenu";

const SideBar = ({ isOpen, toggle }) => (
  <div className={classNames("sidebar", { "is-open": isOpen })}>
    <div className="sidebar-header">
      <span color="info" onClick={toggle} style={{ color: "#fff" }}>
        &times;
      </span>
      <h3>Knowledge Sharing Platform</h3>
    </div>
    <div className="side-menu">
      <Nav vertical className="list-unstyled pb-3">
        
       
        <NavItem>
          <NavLink tag={Link} to={"/Notes"}>
            <FontAwesomeIcon icon={faCopy} className="mr-2" />
            Notes
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink tag={Link} to={"/contact"}>
            <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
            Feedbacks
          </NavLink>
        </NavItem>
      </Nav>
    </div>
  </div>
);



export default SideBar;