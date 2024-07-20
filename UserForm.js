// UserForm.js
import React, { useState } from 'react';

function UserForm({ setUser }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setUser({ firstName, lastName });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="First Name" onChange={(e) => setFirstName(e.target.value)} />
      <input type="text" placeholder="Last Name" onChange={(e) => setLastName(e.target.value)} />
      <button type="submit">Submit</button>
    </form>
  );
}

export default UserForm;

