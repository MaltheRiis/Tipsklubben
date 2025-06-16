import { useEffect, useState } from 'react';
import styles from '../styles.module.css';
import Dropdown from '../components/Dropdown';

const sheetUrls = {
  Sæson2: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWIPXh7d5Wrltwa9eraRPoPyyDNstwxA/pub?gid=1329055483&single=true&output=tsv',
  Sæson3: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWIPXh7d5Wrltwa9eraRPoPyyDNstwxA/pub?gid=1721353232&single=true&output=tsv',
  Sæson4: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWIPXh7d5Wrltwa9eraRPoPyyDNstwxA/pub?gid=101621910&single=true&output=tsv'
};

export default function Home() {
  const [selectedSeason, setSelectedSeason] = useState('Sæson2');
  const [headers, setHeaders] = useState([]);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(sheetUrls[selectedSeason]);
      const text = await res.text();
      const lines = text.split('\n');

      // Kolonner C–H = index 2–7
      const cleanedRows = lines
        .slice(1, 8) // Række 2–8 i regnearket
        .map(line => line.split('\t').slice(2, 8)); // Kolonne C–H

      setHeaders(cleanedRows[0]);      // Første række er header
      setRows(cleanedRows.slice(1));   // Resten er data
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
              {headers.map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={row[0]?.trim().toLowerCase() === 'total' ? styles.totalRow : ''}>

              >
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
