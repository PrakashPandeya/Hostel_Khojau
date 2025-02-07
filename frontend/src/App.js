import { Route, Routes } from 'react-router-dom';
import './App.css';
//import Login from './pages/Login';
//import Signup from './pages/Signup';
import Home from './pages/Home';
import './index.css';
import Hostel from './pages/Hostel';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* During development, making Home accessible without authentication */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/hostel" element={<Hostel />} />
        
      </Routes>
    </div>
  );
}

export default App;
