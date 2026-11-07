import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Commodities from './pages/Commodities';



function App() {
  return (  
    <Router>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/commodities' element={<Commodities />} />
      </Routes>
    </Router>
  )
}

export default App