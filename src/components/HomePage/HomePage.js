import React from "react";
import "./HomePage.css";
import { IoBook } from "react-icons/io5"

export default function HomePage() {
  return (
    <div>
      <section className="main">
        <h1>
          Let's Learn, <span>Share</span> and Grow.
        </h1>
        <p>
          Let's discover new knowledge and friends and have a learning <br />{" "}
          experience better than ever.
        </p>
        <div className="CTA_container">
          <a href="http://" className="btn_1">
            Get Started
          </a>
          <a href="/notes" className="btn_2">
            <div className="play_btn"> <IoBook className="icon" /> </div>
            Read Notes
          </a>
        </div>

        <div className="image_container">
            <img src="https://images.unsplash.com/photo-1593698054469-2bb6fdf4b512?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" alt="" />
            <img src="https://images.unsplash.com/photo-1535982330050-f1c2fb79ff78?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80" alt="" />
            <img src="https://images.unsplash.com/photo-1592188657297-c6473609e988?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80" alt="" />
            <img src="https://images.unsplash.com/photo-1599687351724-dfa3c4ff81b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" alt="" />
        </div>
        {/* <p>Welcome to</p>
                <h1> Knowledge Sharing Platform</h1>
                <br/> <br/> <br/>
                <h4> Knowledge sharing platform application aims to get the students acquainted with the courses, professors, evaluation schemes. This webapp does the said things i.e. gathering notes, PYQs, course feedback, professor feedback, and previous year grading schemes. Here people can share their honest reviews without being scrutinized much. Getting reviews from mass makes it easy for one to choose the particular course and get the right information about that course. Moreover, students can also get relevant course resources from the students who already opted for the course. This platform might also act as a general guidance portal.</h4> */}
      </section>
      <section className="about">
        <div className="section_title">
            <h4>What are we</h4>
            <h2>About Us</h2>
        </div>
      </section>
    </div>
  );
}
