Create a Chat App

1. Create a React App with create-react-app
2. Clear default App component and unneded files
3. Add Layout/Template to App.js and choose CSS Framework, probably Tailwind
4. Create base folder structure for components/pages
5. Add menu and include and include react-router-dom
6. Create a page for each menu item and implement routing 
7. Probably refine style
8. Add login/register page
9. Implement simple session management, either with or without db 
10. Configure a simple Node.js server for handling the request for login/register
11. Implement a form to chat, this page should show previous messages and all users (online)
12. Users listed aside, messages in the main, the chat window below on the bottom (text field/text area) 
13. Handle requests to update and save messages and get users

TODO 06.08 - How to proceed

- implement a global context for the App component, to provide e.g. user and session states to all components
- implement serverside endpoint to refresh expired token
- remove logged in user from chat users list, instead show profile details on right side of chat
- implement profile page and e.g. allow to add profile images
- use websockets to also show if users are online
- on login, check if user is already logged in 
- validation for username, password, username maybe be replaced by email
- sub menu for chat users on mobile view