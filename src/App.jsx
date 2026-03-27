/*
 * This file provides the top-level app component
 */
import { Route, Routes } from 'react-router-dom'
import Home from './Home/Home'
import Login from './Auth/Login/Login'
import Register from './Auth/Register/Register'
import Navbar from './components/Navbar/Navbar'
import RecordList from './RecordList/RecordList'

function App() {
  return (
    <div className="app">
        <Navbar />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cities' element={<RecordList title="Cities" api_path="/cities" />} />
            <Route path='/states' element={<RecordList title="States" api_path="/states" />} />
            <Route path='/nations' element={<RecordList title="Nations" api_path="/nations" />} />
            <Route path='/disasters' element={<RecordList title="Disasters" api_path="/natural_disasters" />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
        </Routes>
    </div>
  )
}

export default App
