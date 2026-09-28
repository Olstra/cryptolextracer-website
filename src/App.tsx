import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.sass";
import { Monitoring } from "./components/Monitoring/Monitoring.tsx";
import { Legal } from "./components/Legal/Legal.tsx";
import { Tracing } from "./components/Tracing/Tracing.tsx";
import { Home } from "./components/Home/Home.tsx";
import { Footer } from "./components/Footer.tsx";
import { Header } from "./components/Header/Header.tsx";
import React from "react";

export const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lex" element={<Legal />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/tracer" element={<Tracing />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};
