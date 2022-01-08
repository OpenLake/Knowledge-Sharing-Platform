import React from "react";
import './App.css';
import Navbar from "./components/Navbar";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import PYQs from './pages/PYQs';
import Reviews from './pages/Reviews';
import {Helmet} from "react-helmet";
import Notes from "./pages/Notes";
import Home from "./pages/Home";

function App() {
    return (
        <>
            <Helmet>
                <style>{'body { background-color: #f5f5fb; }'}</style>
            </Helmet>
        <Router>
            <Navbar/>
            <Routes>
                <Route path='/' element={<Home />}/>
                <Route path='/Notes' element={< Notes/>}/>
                <Route path='/PYQs' element={< PYQs/>}/>
                <Route path='/Reviews' element={< Reviews/>}/>
            </Routes>
        </Router>
        </>

    );
}

export default App;
