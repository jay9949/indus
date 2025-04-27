import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import PassengerDetails from "./PassengersForm";
import ViewPassenger from "./ViewPassenger";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PassengerDetails />} />
        <Route path="/view" element={<ViewPassenger />} />
      </Routes>
    </Router>
  );
}

export default App;
