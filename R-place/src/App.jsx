import { BrowserRouter, Routes, Route } from "react-router-dom";
import Questions from "./components/Questions/Questions";
import ResultPage from "./pages/resultPage";
import Header from "./components/Header/Header";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Questions />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
