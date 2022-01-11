import React from 'react';
import '../App.css';
import Popup from "../components/Popup";

function Reviews() {
    return (
        <>
            <Popup type='REVIEW'/>
            <div className='reviews'>
                <h1> Reviews </h1>
            </div>
        </>

    );
}

export default Reviews;