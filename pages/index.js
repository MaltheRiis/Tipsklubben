// pages/index.js

import { useEffect, useState } from 'react';
import styles from '../styles.module.css';
import Dropdown from '../components/Dropdown';

// Sheet-URLs til public TSV-data for hver sæson
const sheetUrls = {
  Sæson2: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWIPXh7d5Wrltwa9eraRPoPyyDNstwxA/pub?gid=1329055483&single=true&output=tsv',
  Sæson3: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWIPXh7d5Wrltwa9eraRPoPyyDNstwxA/pub?gid=1721353232&single=true&output=tsv',
  Sæson4: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWIPXh7d5Wrltwa9eraRPoPyyDNstwxA/pub?gid=101621910&single=true&output=tsv',
};

export default function Home() {
  const [selectedSeason, setSelectedSeason] = useState('Sæson3');
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);

useEffect(() => {
  const fetchData = async () => {
    const res = await fetch(sheetUrls[selectedSeason]);
    const text = await res.text();
    const lines = text.split('\n');

    const parsed = lines
      .map(line => line.split('\t'))
      .map(row => row.slice(2, 8)); // kolonne C–H

    const headers = parsed[0]; // række 2 – overskrifter
    const dataRows = parsed
      .slice(1) // alle rækker efter række 2
      .filter(row => row[0] !== '' && row[0] !== headers[0]); // filtrér tomme og gentagede overskrifter

    setHeaders(headers);
    setRows(dataRows);
  };

  fetchData();
}, [selectedSeason]);


  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Tipsklubben – {selectedSeason}</h1>

      <div className={styles.dropdown}>
        <Dropdown selectedSeason={selectedSeason} onChange={setSelectedSeason} />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {headers.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={row[0].toLowerCase() === 'total' ? styles.totalRow : ''}>
                {row.map((cell, j) => (
                  <td key={j}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
