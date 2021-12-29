import React from 'react';
import * as CgIcons from 'react-icons/cg';
import * as GiIcons from 'react-icons/gi';
import * as MdIcons from 'react-icons/md';

let iconStyle = {color: 'blueviolet'}

export const SideBarData = [
    {
        title: 'Notes',
        path: '/Notes',
        icon: <CgIcons.CgNotes style={iconStyle}/>,
        cName: 'nav-text'
    },
    {
        title: 'PYQs',
        path: '/PYQs',
        icon: <GiIcons.GiPapers style={iconStyle}/>,
        cName: 'nav-text'
    },
    {
        title: 'Reviews',
        path: '/Reviews',
        icon: <MdIcons.MdRateReview style={iconStyle}/>,
        cName: 'nav-text'
    },

]
