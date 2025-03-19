import { useState, useEffect } from 'react'
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

  function handleClick(increment: number) {
    setIndex(index + increment)
    setPassage(passages[index + increment])
    setMonth(months[index + increment])
  }

  function getSecondFriday(year: number, month: number): Date {
    const date = new Date(year, month, 1);
    let fridayCount = 0;
    
    while (fridayCount < 2) {
      if (date.getDay() === 5) { // 5 represents Friday
        fridayCount++;
      }
      if (fridayCount < 2) {
        date.setDate(date.getDate() + 1);
      }
    }
    
    return date;
  }

  function getCurrentPassageIndex(): number {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();
    
    const secondFriday = getSecondFriday(currentYear, currentMonth);
    
    // Format for comparison with months array (e.g., "marec 2023")
    const monthNames = [
      'januar', 'februar', 'marec', 'april', 'maj', 'junij',
      'julij', 'avgust', 'september', 'oktober', 'november', 'december'
    ];
    
    let targetMonth: string;
    if (today.getDate() > secondFriday.getDate()) {
      // Use next month
      const nextMonth = currentMonth + 1;
      const nextMonthDate = new Date(currentYear, nextMonth, 1);
      targetMonth = `${monthNames[nextMonthDate.getMonth()]} ${nextMonthDate.getFullYear()}`;
    } else {
      // Use current month
      targetMonth = `${monthNames[currentMonth]} ${currentYear}`;
    }
    
    const monthIndex = months.indexOf(targetMonth);
    return monthIndex >= 0 ? monthIndex : 0;
  }

  function handleCurrentMonth() {
    const newIndex = getCurrentPassageIndex();
    setIndex(newIndex);
    setPassage(passages[newIndex]);
    setMonth(months[newIndex]);
  }

  useEffect(() => {

    if (passage === null) {
      return
    }

    const loader = setTimeout(() => setPassageHtml('Nalagam odlomek...'), 300)

    fetch('/.netlify/functions/biblija-net-proxy?passage=' + encodeURIComponent(passage))
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
      const updatedParamValue = url.searchParams.get('passage');
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
      {/* TODO: If no passage is selected, filter down by book and chapters (useState?) */}
      <h1 className="main-title">Odlomki najina pot</h1>
      {/* <h3>{ passage }</h3> */}
      <div className="card">
        <div className="nav-buttons">
          <button onClick={() => handleClick(-1)} disabled={index === 0}>
            <svg width="16px" height="16px" viewBox="0 0 512 512" data-name="Layer 1" id="Layer_1" stroke="currentColor" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M197.4,129.3c-4.4,0-8.5,1.7-11.6,4.8L64,254.4l121.7,123.2c3.1,3.2,7.3,5,11.8,5c9.2,0.1,16.7-7.3,16.8-16.5  c0,0,0-0.1,0-0.1v-61.5c0,0,21.4-10.7,57.4-10.7c42.1,0,104.4,14.5,176.3,77.5c0,0-33.4-166.9-233.7-166.9v-58.3  c0-9.2-7.4-16.7-16.6-16.7C197.6,129.3,197.5,129.3,197.4,129.3 M197.4,99.3L197.4,99.3c11.9,0,23.4,4.5,32.1,12.7  c9.5,8.8,14.8,21.1,14.7,34.1v29.5c38.5,3.2,73.5,12.6,104.5,28c31.5,15.7,59.1,38,81,65.5c37.5,46.9,47.3,94.4,47.7,96.4  c3.3,16.2-7.3,32.1-23.5,35.3c-9.2,1.8-18.6-0.7-25.7-6.8c-66.1-57.9-121.6-70-156.5-70c-9.2,0-18.4,0.9-27.5,2.7V366  c0.1,12.9-5.3,25.2-14.7,34c-8.7,8.1-20.2,12.7-32.1,12.6c-12.5,0-24.4-5-33.1-13.9L42.6,275.5c-11.6-11.8-11.5-30.8,0.3-42.4  c0,0,0,0,0,0l121.8-120.3C173.4,104.2,185.2,99.3,197.4,99.3z"/></svg>
          </button>

          <button onClick={handleCurrentMonth}>
            Ta mesec
          </button>
          
          <button onClick={() => handleClick(1)} disabled={index === passages.length - 1}>
            <svg width="16px" height="16px" viewBox="0 0 512 512" data-name="Layer 1" id="Layer_1" stroke="currentColor" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M314.55,129.32a16.41,16.41,0,0,1,11.62,4.84L448,254.45,326.32,377.68a16.33,16.33,0,0,1-11.76,5A16.68,16.68,0,0,1,297.74,366V304.54s-21.35-10.67-57.45-10.67c-42.13,0-104.36,14.52-176.29,77.45,0,0,33.39-166.95,233.74-166.95V146.05a16.68,16.68,0,0,1,16.81-16.73m0-30h0A46.85,46.85,0,0,0,282.45,112a46.09,46.09,0,0,0-14.71,34.06v29.53c-38.47,3.17-73.51,12.56-104.46,28a240.94,240.94,0,0,0-81,65.48C44.79,316,35,363.44,34.58,365.44A30,30,0,0,0,83.76,393.9c66.15-57.89,121.63-70,156.53-70a137.81,137.81,0,0,1,27.45,2.67V366A46.12,46.12,0,0,0,282.46,400a46.92,46.92,0,0,0,32.1,12.65,46.21,46.21,0,0,0,33.1-13.92L469.35,275.53a30,30,0,0,0-.27-42.43L347.24,112.82a46.27,46.27,0,0,0-32.69-13.5Z"/></svg>
          </button>
        </div>

        {passage ? <p className="passage-label"><strong>{passage}</strong><br></br>{month}</p> : ''}
      </div>
      {!passage
        ? <div className="passage">Noben odlomek ni izbran</div>
        :
        <div>
          <div className="passage" dangerouslySetInnerHTML={{ __html: passageHtml }}></div>
          <a
            className="bn-link" href={`https://www.biblija.net/biblija.cgi?m=${encodeURI(passage)}&q=&idq=60&id59=1&pos=0&set=26&l=sl3`}
            target="_blank"
          >
            Biblija.net link
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" style={{ height: '1.4em', marginLeft: '0.25em', top: '5px', position: 'relative' }}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
          </a>
        </div>
      }

    </>
  )
}

export default App


// Potential improvement - automatically load the appropriate passage