import styles from '../styles.module.css';
// pages/index.js

import { useEffect, useState } from 'react';

export default function Home() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWlPXh7d5WrItwa9eraRPoPyyDNstwxA/pub?gid=1721353232&single=true&output=tsv'
      );
      const text = await res.text();
      const lines = text.split('\n');
      const cleaned = lines
        .map(line => line.split('\t'))
        .filter(row => row.length >= 8 && row[2] !== ''); // min 8 kolonner, og spiller er udfyldt

      setRows(cleaned);
    };

    fetchData();
  }, []);

  return (
    <main style={{ padding: 20 }}>
      <h1 className={styles.title}>Tipsklubben – Sæson 3</h1>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Uge</th>
            <th>Navn</th>
            <th>Indskud</th>
            <th>Ekstra</th>
            <th>Gevinst</th>
            <th>Ekstra gevinst</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              <td>{row[1]}</td> {/* Uge */}
              <td>{row[2]}</td> {/* Navn */}
              <td>{row[3]}</td> {/* Indskud */}
              <td>{row[4]}</td> {/* Ekstra indskud */}
              <td>{row[5]}</td> {/* Gevinst */}
              <td>{row[6]}</td> {/* Ekstra gevinst */}
              <td>{row[7]}</td> {/* Balance */}
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
