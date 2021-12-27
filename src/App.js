import './App.css';
import Navbar from "./components/Navbar";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Notes from './pages/Notes';
import PYQs from './pages/PYQs';
import Reviews from "./pages/Reviews";

function App() {
  return (
      <Router>
          <Navbar />
              <Routes>
                <Route path='/Notes' element={< Notes />}/>
                <Route path='/PYQs' element={< PYQs />} />
                <Route path='/Reviews' element={< Reviews />} />
              </Routes>
      </Router>

  );
}

export default App;
