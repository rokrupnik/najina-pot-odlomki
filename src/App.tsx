import {useState, useEffect} from 'react'
import * as data from './assets/data.json';
import './App.css'

// Import passages, books and chapters

// Add functions to get and set the passage from query params getPassageFromQuery()

const passages = data.default
const urlParams = new URLSearchParams(window.location.search);
let initialPassage = urlParams.get('passage')
let initialPassageIndex = 0;

if (initialPassage) {
  console.log(initialPassage, passages.indexOf(initialPassage))
  initialPassageIndex = passages.indexOf(initialPassage)
} else {
  initialPassage = passages[initialPassageIndex]
}

function App() {
  const [index, setIndex] = useState(initialPassageIndex)
  // const [filter, setFilter] = useState('')
  const [passage, setPassage] = useState(initialPassage)
  const [passageHtml, setPassageHtml] = useState('')

  function handleClick(increment) {
    setIndex(index + increment)
    setPassage(passages[index + increment])
  }
  

  useEffect(() => {
    

    // var myHeaders = new Headers();
    // myHeaders.append('Content-Type','text/html; charset=windows-1250');

    fetch('/.netlify/functions/biblija-net-proxy?passage=' + encodeURIComponent(passage) )
      .then(res => res.text())
      .then(html => {
        // console.log(html)
        setPassageHtml(html)
      })

    

    const url = new URL(window.location.href);
    url.searchParams.set('passage', passage);
    
    // Push the updated URL to the history stack
    window.history.pushState({ path: url.href }, '', url.href);
    
    // Listen for the 'popstate' event to handle back/forward navigation
    const handlePopstate = () => {
      // Do something when the URL changes
      // For example, fetch data based on the new parameter value
      const updatedParamValue = url.searchParams.get('paramName');
      console.log(updatedParamValue); // Output: "example"
    };
    window.addEventListener('popstate', handlePopstate);
    
    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [passage, index])
  
  return (
    <>
      {/* If no passage is selected, filter down by book and chapters (useState?) */}
      <h1>Odlomki najina pot</h1>
      {/* <h3>{ passage }</h3> */}
      <div className="card">
        <button onClick={() => handleClick(-1)} disabled={index === 0}>
          Nazaj
        </button>
        <button onClick={() => handleClick(1)} disabled={index === passages.length - 1}>
          Naprej
        </button>
      </div>
      {passage
        ?<div className="passage" dangerouslySetInnerHTML={{__html: passageHtml}}></div>
        :<div className="passage">No passage selected</div>
      }
      
    </>
  )
}

export default App


// Potential improvement - automatically load the appropriate