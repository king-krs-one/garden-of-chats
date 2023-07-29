import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ onLogout }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Call handle logout function passed from App component
    onLogout({
      message: {
        type: "warning",
        // status: response.status,
        text: "Logged out succesfully"
      }
    });
    // Redirect the user to the login page after logout
    navigate('/login');
  }, [onLogout, navigate]);

  return null; // Render nothing
};

export default Logout;






/************************************************************** 
 CODE BELOW CAN BE USED TO RENDER A CONFIRM LOGOUT
***************************************************************/


// const Logout = (props) => {
//   const navigate = useNavigate();

//   const handleLogoutClick = () => {
//     // Perform logout logic in the handleLogout function
//     props.onLogout({
//       message: {
//         type: "warining",
//         // status: response.status,
//         text: "Logged out succesfully"
//       }
//     });
//     // Redirect the user to the login page after logout
//     navigate('/login');
//   };

//   return (
//     <div className="grid grid-cols-8">
//       <div className="col-start-3 col-span-4 mt-4">
//         <h2>Are you sure you want to logout?</h2>
//         <button className="btn btn-blue mt-4 w-48" onClick={handleLogoutClick}>Logout</button>
//       </div>
//     </div>
//   );
// };

// export default Logout;