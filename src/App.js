import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Booking from "./pages/Booking";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Router>
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/booking/:id" element={<Booking />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
