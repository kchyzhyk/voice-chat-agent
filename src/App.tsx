import { useState } from "react";
import "./App.css";
import { Landing } from "./pages/Landing";
import { CallModal } from "./components/CallModal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="App">
      <Landing onStartCall={() => setIsModalOpen(true)} />
      <CallModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}

export default App;
