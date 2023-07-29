import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login(props) {

  return (
    <div className="flex flex-col w-full min-h-full">
      <div className="container mx-auto">
        <div className="grid grid-cols-8">
          <LoginForm handleLogin={props.handleLogin} />
          <RegisterForm handleRegister={props.handleRegister} />
        </div>
      </div>
    </div>
  )
}


function LoginForm(props) {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/login', {
        username,
        password,
      });

      const { message, token } = response.data;

      props.handleLogin({
        username, password, message: {
          type: "success",
          status: response.status,
          text: message
        }
      });

      // Store the token in local storage or a more secure method like cookies
      localStorage.setItem('token', token);

      navigate('/');
    } catch (error) {
      // setMessage('Login failed');

      props.handleLogin({
        username, password, message: {
          type: "error",
          status: error.response.status,
          text: error.response.data.message
        }
      });

      console.error(error);
    }
  };

  return (
    <div className="col-start-3 col-span-4 mt-4">
      <h2 className="mb-2">Sign In</h2>
      <label htmlFor="username">Username</label>
      <input
        value={username}
        id="username"
        type="text"
        placeholder="Username"
        className="input-field"
        onChange={(e) => setUsername(e.target.value)} />
      <label htmlFor="password">Password</label>
      <input
        value={password}
        id="password"
        type="password"
        placeholder="Password"
        className="input-field"
        onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-blue w-1/4 mt-4" onClick={handleLogin}>Sign In</button>
    </div>
  )
}

function RegisterForm(props) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', {
        "username": username,
        "password": password,
      });
      debugger
      props.handleRegister({
        message: {
          type: "success",
          status: response.status,
          text: response.data.message
        }
      });
    } catch (error) {
      props.handleRegister({
        message: {
          type: "error",
          status: error.response.status,
          text: error.response.data.message,
          // text: 'Registration failed'
        }
      });

      console.error(error);
    }
  };

  return (
    <div className="col-start-3 col-span-4 mt-4">
      <h2 className="mb-2">Register</h2>
      <label htmlFor="username_registration">Username</label>
      <input
        value={username}
        id="username_registration"
        type="text"
        placeholder="Username"
        className="input-field"
        onChange={(e) => setUsername(e.target.value)} />
      <label htmlFor="password_registration">Password</label>
      <input
        value={password}
        id="password_registration"
        type="password"
        placeholder="Password"
        className="input-field"
        onChange={(e) => setPassword(e.target.value)} />
      <button className="btn btn-blue w-1/4 mt-4" onClick={handleRegister}>Register</button>
    </div>
  )
}

export default Login