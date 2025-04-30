import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import PassengerDetails from "./PassengersForm";
import PassengerView from "./PassengerView";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PassengerDetails />} />
        <Route path="/view" element={<PassengerView />} />
      </Routes>
    </Router>
  );
}

export default App;
