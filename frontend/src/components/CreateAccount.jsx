import React from 'react';

const CreateAccount = ({ showMessage, token }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/accounts', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Something went wrong');
            showMessage(`Account created with ID: ${data.accountId}`);
        } catch (error) {
            showMessage(error.message, true);
        }
    };

    return (
        <div className="section">
            <h2>Create Account</h2>
            <form onSubmit={handleSubmit}>
                <button type="submit">Create Account</button>
            </form>
        </div>
    );
};

export default CreateAccount;
