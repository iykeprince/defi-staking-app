import React, { useState } from 'react'
import './App.css'
import Navbar from './Navbar';

const App = () => {
    const [account, setAccount] = useState('0x0')
    return (
        <div>
            <Navbar account={account} />
            <div className="text-center">
            <h2>Hello World</h2>
        </div>
        </div>
    )
}

export default App