import React, { useState } from 'react';
import './App.css';

const BACKEND_BASE_URL = process.env.REACT_APP_BACKEND_URL;

export default function App() {
  const [xInput, setXInput] = useState('');
  const [yInput, setYInput] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [sum, setSum] = useState(null);
  const [prod, setProd] = useState(null);
  const [error, setError] = useState(null);

  const isInvalid = (s) => s.trim() === '' || !Number.isFinite(Number(s));

  const calculate = async () => {
    // Same order as the backend: x is checked first
    if (isInvalid(xInput)) {
      setError('x should be a number');
      setSum(null);
      setProd(null);
      return;
    }
    if (isInvalid(yInput)) {
      setError('y should be a number');
      setSum(null);
      setProd(null);
      return;
    }

    setError(null);
    setSum(null);
    setProd(null);

    try {
      const res = await fetch(
        `${BACKEND_BASE_URL}?x=${encodeURIComponent(xInput.trim())}&y=${encodeURIComponent(yInput.trim())}`
      );
      const data = await res.json();

      if (data.type === 'success') {
        setSum(data.sum);
        setProd(data.prod);
        setX(xInput);
        setY(yInput);
      } else if (data.type === 'error') {
        setError(data.message);
      } else {
        setError('Unexpected response from server.');
      }
    } 
    catch (err) {
      console.log('URL =', `${BACKEND_BASE_URL}?x=${xInput}&y=${yInput}`);
      setError('Server error occurred.');
    }
  };

  return (
    <div>
      <h2>Calculate Sum and Product</h2>
      <input
        type="number"
        step="any"
        value={xInput}
        placeholder="Enter x"
        onChange={e => setXInput(e.target.value)}
      />
      <br />
      <input
        type="number"
        step="any"
        value={yInput}
        placeholder="Enter y"
        onChange={e => setYInput(e.target.value)}
      />
      <br />
      <button onClick={calculate}>
        Calculate
      </button>

      <div className="calcResult">
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {sum !== null && <p>{x} + {y} = <strong>{sum}</strong></p>}
        {prod !== null && <p>{x} × {y} = <strong>{prod}</strong></p>}
      </div>
    </div>
  );
}