import {useState, useEffect} from 'react'
import * as data from './assets/data.json';
import './App.css'

// Import passages, books and chapters

// Add functions to get and set the passage from query params getPassageFromQuery()

const passages = data.passages
const months = data.months
const urlParams = new URLSearchParams(window.location.search);
let initialPassage = urlParams.get('passage')
let initialPassageIndex = 0;

if (initialPassage) {
  console.log(initialPassage, passages.indexOf(initialPassage))
  initialPassageIndex = passages.indexOf(initialPassage)
} else {
  initialPassage = passages[initialPassageIndex]
}

const initialMonth = months[initialPassageIndex]

function App() {
  const [index, setIndex] = useState(initialPassageIndex)
  // const [filter, setFilter] = useState('')
  const [passage, setPassage] = useState(initialPassage)
  const [month, setMonth] = useState(initialMonth)
  const [passageHtml, setPassageHtml] = useState('')

  function handleClick(increment) {
    setIndex(index + increment)
    setPassage(passages[index + increment])
    setMonth(months[index + increment])
  }
  

  useEffect(() => {
    

    // var myHeaders = new Headers();
    // myHeaders.append('Content-Type','text/html; charset=windows-1250');

    
    const loader = setTimeout(() => setPassageHtml('Nalagam odlomek...'), 1000)

    fetch('/.netlify/functions/biblija-net-proxy?passage=' + encodeURIComponent(passage) )
      .then(res => res.text())
      .then(html => {
        // console.log(html)
        clearTimeout(loader)
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
        {passage ? <p className="passage-label"><strong>{passage}</strong><br></br>{month}</p> : '' }
      </div>
      {!passage
        ?<div className="passage">Noben odlomek ni izbran</div>
        :
          <div>
            <div className="passage" dangerouslySetInnerHTML={{__html: passageHtml}}></div>
            <a
              className="bn-link" href={`https://www.biblija.net/biblija.cgi?m=${encodeURI(passage)}&q=&idq=60&id59=1&pos=0&set=26&l=sl3`}
              target="_blank"
            >
                Biblija.net link
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{height: '1.4em', marginLeft: '0.25em', top: '5px', position: 'relative'}}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            </a>
          </div>
      }
      
    </>
  )
}

export default App


// Potential improvement - automatically load the appropriate