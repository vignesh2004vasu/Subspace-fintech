import React, { useState } from 'react';

const Withdraw = ({ showMessage, token }) => {
    const [accountId, setAccountId] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/withdraw', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ accountId, amount })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Something went wrong');
            showMessage(data.message);
        } catch (error) {
            showMessage(error.message, true);
        }
    };

    return (
        <div className="section">
            <h2>Withdraw</h2>
            <form onSubmit={handleSubmit}>
                <input type="number" value={accountId} onChange={(e) => setAccountId(e.target.value)} placeholder="Account ID" required />
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Amount" step="0.01" required />
                <button type="submit">Withdraw</button>
            </form>
        </div>
    );
};

export default Withdraw;
