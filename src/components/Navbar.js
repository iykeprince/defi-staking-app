import React from 'react';
import bank from '../bank.png'

const Navbar = ({ account }) => {

    return (
        <nav className="navbar navbar-dark fixed-top shadow p-0" style={{backgroundColor: 'black', height: '50px'}}>
            <a className="navbar-brand col-sm-3 col-md-2 mr-0" style={{color: 'white'}}>
            <img src={bank} width="50" height="30" className="d-inline-block align-top" alt="bank" />
           {` `} DAPP Yield Staking (Decentralized Banking)
            </a>
            <ul className="navbar-nav px-3">
                <li className="text-nowrap d-none nav-item d-sm-none d-sm-block">
                    <small style={{color: 'white'}}>Account Number: {account} </small>
                </li>
            </ul>
        </nav>
    )
}

export default Navbar