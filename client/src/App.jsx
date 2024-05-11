import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Hero from "./Hero";
import Create from "./Create";
import View from "./View"; // Assuming you have a View component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/create" element={<Create />} />
        <Route path="/view" element={<View />} />
        {/* Define other routes here */}
      </Routes>
    </Router>
  );
}

export default App;
