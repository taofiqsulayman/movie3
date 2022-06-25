import { Route, Routes } from 'react-router-dom';
import './App.css'

import Home from "./components/Home";
import MovieDetails from './components/MovieDetails';

function App() {



  return (
    <>
        <Routes>
          <Route path='/' exact element={<Home />} />
          <Route path='/movie/:id' exact element={<MovieDetails />} />
          <Route>404 Not Found</Route>
        </Routes> 
    </>
  );
}

export default App;