import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Fetch_getapi from './components/fetch_getapi'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Fetch_getapi></Fetch_getapi>
    </>
  )
}

export default App
