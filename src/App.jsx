import React from 'react';
import './App.css';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from './pages/home/home';
import User from './pages/users/users';
function App() {
  const router = createBrowserRouter([
    {path: "/", 
      children:[
        {index : true, element: <Home/>},
        {path: ":userId", element: <User/>}
      ]
    }
  ])
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
