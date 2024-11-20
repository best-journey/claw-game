import { ChakraProvider } from '@chakra-ui/react'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Game from './pages/Game'

function App() {
  return (
    <ChakraProvider>
      <Router>
        <Routes>
          <Route path='/' element={<Game />} />
        </Routes>
      </Router>
    </ChakraProvider>
  )
}

export default App
