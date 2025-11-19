
import { Route, Routes } from 'react-router-dom'
import { SignupForm } from './pages/auth/signup'
function App() {
  return (
   <Routes>
    <Route path='/' element={<SignupForm/>} />
   </Routes>
  );
}

export default App