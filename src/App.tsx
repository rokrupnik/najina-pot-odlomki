import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [passageHtml, setPassageHtml] = useState('lalal <button>test</button>')



  useEffect(() => {
    fetch('/.netlify/functions/biblija-net-proxy?passage=Jn+11%2C+45-53')
      .then(res => res.text())
      .then(html => {
        console.log(html)
        setPassageHtml(html)
      })
  }, [])

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div>
      <div id="passage"  dangerouslySetInnerHTML={{__html: passageHtml}}></div>
    </>
  )
}

export default App
