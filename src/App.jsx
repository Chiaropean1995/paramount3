import HomePage from './pages/HomePage'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/AuthProvider";

function App() {


  return (
    <>
      <AuthProvider>
        <BrowserRouter>

          <Routes>
            <Route path="*" element={<HomePage />} />



          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
