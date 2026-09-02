import { FaReddit, FaGithub } from "react-icons/fa";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./App.css";
import { Header, AppOnboarding } from "./components";
import { useGoatCounter } from "./hooks";

import packageJson from "../package.json";
import { About, Home } from "./pages";

const { name: appName } = packageJson;

const AppContent = () => {
  useGoatCounter({ name: appName });

  return (
    <div className="app">
      <Header />
      <AppOnboarding />
      <div className="mainContent">
        <Routes>
          <Route path="/index.html" element={<Home />} />
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
      <div className="footer">
        <span>Developed by Naseem Shawarba</span>
        <a
          target="_blank"
          href="https://github.com/naseem-shawarba/legacy-wear"
          rel="noopener noreferrer"
        >
          <FaGithub className="icon" />
        </a>
        <a
          target="_blank"
          href="https://www.reddit.com/user/shinysn0w/"
          rel="noopener noreferrer"
        >
          <FaReddit className="icon" />
        </a>
      </div>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
