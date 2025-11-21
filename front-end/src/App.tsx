
import { Route, Routes } from 'react-router-dom'
import { SignupForm } from './pages/auth/signup'
import { LoginForm } from './pages/auth/Login';
import { HomePage } from './pages/user/Home';
function App() {
  return (
   <Routes>
    <Route path='/signup' element={<SignupForm/>} />
    <Route path='/' element={<LoginForm/>} />
    <Route path='/home' element={<HomePage/>}/>
   </Routes>
  );
}

export default App