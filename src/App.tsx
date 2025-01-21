import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Game from './pages/Game'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Game />} />
      </Routes>
    </Router>
  )
}

export default App
