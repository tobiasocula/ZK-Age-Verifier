import './App.css'
import { useState } from 'react';

import { generateProof, verify, downloadProofJson } from "../../logic.mjs";



const range = (begin, end) => [...Array(end - begin).keys()].map(idx => idx + begin);

function App() {

  const proof = async () => {
    const today = new Date().valueOf();
    const given = new Date(year, possibleMonths.indexOf(month), day).valueOf();
    if (today < given) {
      throw new Error("Date must be after date of birth!");
    }

    console.log(today); console.log(given);
    const inp = {"dob": given, "date": today};
    console.log(inp);
    console.log(today - given >= 18 * 365 * 3600 * 24 * 1000);

    const {proof, publicSignals} = await generateProof(inp);
    //downloadProofJson(proof, publicSignals);
    console.log('proof:', proof);
    console.log(publicSignals); // <-- Add this!
    addLog("Proof generated");
    const res = await verify(proof, publicSignals);
    addLog(res ? "Proof verified!" : "Proof falsified!");
    setProofOkay(publicSignals[0] === "1" ? true : false);
  }

  const [log, setLog] = useState([""]);
  const addLog = (msg) => setLog(prev => [...prev, msg]);

  const [proofOkay, setProofOkay] = useState("Proof not yet generated");

  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const possibleYears = range(1900, 2026);
  const possibleDays = range(1, 32);
  const possibleMonths = [
    "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
  ];

  return (
    <>
      <h1 className='title'>Welcome to my first ever ZK-proof project</h1>
      <div className='center'>
        <div className='input-section'>
          <h3 className='text'>Enter date of birth:</h3>
          <form className='form' onSubmit={(e) => {e.preventDefault(); proof();}}>
            <div className='input-row'>
              <h4 className='text'>Enter year:</h4>
              <select className='select' value={year} onChange={(e) => setYear(e.target.value)}>
                {possibleYears.map(yr => <option key={yr} value={yr}>{yr}</option>)}
              </select>
            </div>
            <div className='input-row'>
              <h4 className='text'>Enter month:</h4>
              <select className='select' value={month} onChange={(e) => setMonth(e.target.value)}>
                {possibleMonths.map(mo => <option key={mo} value={mo}>{mo}</option>)}
              </select>
            </div>
            <div className='input-row'>
              <h4 className='text'>Enter day:</h4>
              <select className='select' value={day} onChange={(e) => setDay(e.target.value)}>
                {possibleDays.map(da => <option key={da} value={da}>{da}</option>)}
              </select>
            </div>
            <button type="submit" className='submit-button'>Submit</button>
          </form>
        </div>
        <div className='output-section'>
          <h3 className='text'>The result will show here</h3>
          <div className='output-content'>
            <div className='log-section'>
              <div className='bold-text'>Logs will appear here</div>
              <div className='log-content'>
                {log.map(msg => <div className='text'>{msg}</div>)}
              </div>
            </div>
              <div className='actual-output'>
                <div className='bold-text'>Output</div>
                <div className='proof-output'>{`Proof status: ${proofOkay ? "Age verified!" : "Not old enough!"}`}</div>
                {proofOkay ? <div className='text'>Proof result:</div> : <></>}
              </div>
            </div>
          </div>
        </div>
    </>
  )
}

export default App
