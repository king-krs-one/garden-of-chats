function Login() {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-8">
        <div className="col-start-3 col-span-4 mt-4">
          <h2 className="mb-2">Sign In</h2>
          <label for="username">Username</label>
          <input id="username" type="text" className="input-field" />
          <label for="password">Password</label>
          <input id="password" type="password" className="input-field" />
          <button className="btn btn-blue w-1/4 mt-4">Sign In</button>
        </div>
        <div className="col-start-3 col-span-4 mt-4">
          <h2 className="mb-2">Register</h2>
          <label for="username_reg">Username</label>
          <input id="username_reg" type="text" className="input-field" />
          <label for="password_reg">Password</label>
          <input id="password_reg" type="password" className="input-field" />
          <button className="btn btn-blue w-1/4 mt-4">Register</button>
        </div>
      </div>
    </div>
  )
}

export default Login