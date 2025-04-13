import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import './index.css';
import Hostel from './pages/Hostel';
import Room from './pages/Room';
import HostelDetail from './pages/HostelDetail';

function App() {
  return (
    <div className="App">
      <Routes>
        {/* During development, making Home accessible without authentication */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/hostel" element={<Hostel />} />
        <Route path="/hostels/:id" element={<HostelDetail />} />
        <Route path="/room" element={<Room />} />
      </Routes>
    </div>
  );
}

export default App;
