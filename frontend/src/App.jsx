import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './components/Navbar';
import Register from './components/Register';
import Login from './components/Login';
import CreateAccount from './components/CreateAccount';
import Deposit from './components/Deposit';
import Withdraw from './components/Withdraw';

const App = () => {
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    const showMessage = (message, isError = false) => {
        setMessage(message);
        setIsError(isError);
        setTimeout(() => setMessage(''), 3000);
    };

    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="container">
                    {message && <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`}>{message}</div>}
                    <Routes>
                        <Route path="/register" element={<Register showMessage={showMessage} />} />
                        <Route path="/login" element={<Login showMessage={showMessage} setToken={setToken} />} />
                        <Route path="/create-account" element={<CreateAccount showMessage={showMessage} token={token} />} />
                        <Route path="/deposit" element={<Deposit showMessage={showMessage} token={token} />} />
                        <Route path="/withdraw" element={<Withdraw showMessage={showMessage} token={token} />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
