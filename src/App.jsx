/*
 * This file provides the top-level app component
 */
import { Route, Routes } from 'react-router-dom'
import Home from './Home/Home'
import Login from './Auth/Login/Login'
import Register from './Auth/Register/Register'
import Navbar from './components/Navbar/Navbar'
import RecordList from './RecordList/RecordList'
import { cityFields, stateFields, nationFields, disasterFields } from './RecordList/fields'

function App() {
  return (
    <div className="app">
        <Navbar />
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/cities' element={<RecordList title="Cities" api_path="/cities" fields={cityFields} />} />
            <Route path='/states' element={<RecordList title="States" api_path="/states" fields={stateFields} />} />
            <Route path='/nations' element={<RecordList title="Nations" api_path="/nations" fields={nationFields} />} />
            <Route path='/disasters' element={<RecordList title="Disasters" api_path="/natural_disasters" fields={disasterFields} />} />
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
        </Routes>
    </div>
  )
}

export default App
