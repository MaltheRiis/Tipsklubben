// pages/index.js

import { useEffect, useState } from 'react';
import styles from '../styles.module.css';
import Dropdown from '../components/Dropdown';

// URLs til de forskellige sæsoner – offentliggjorte som TSV (tekst-separeret)
const sheetUrls = {
  Sæson2: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWlPXh7d5WrItwa9eraRPoPyyDNstwxA/pub?gid=1329055483&single=true&output=tsv',
  Sæson3: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWlPXh7d5WrItwa9eraRPoPyyDNstwxA/pub?gid=1721353232&single=true&output=tsv',
  Sæson4: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWlPXh7d5WrItwa9eraRPoPyyDNstwxA/pub?gid=101621910&single=true&output=tsv'
};

export default function Home() {
  const [selectedSeason, setSelectedSeason] = useState('Sæson3');
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = sheetUrls[selectedSeason];
      const res = await fetch(url);
      const text = await res.text();
      const lines = text.split('\n');
      const cleaned = lines
        .map(line => line.split('\t'))
        .filter(row => row.length >= 6 && row[0] !== ''); // Mindst 6 kolonner og ikke tom

      setRows(cleaned);
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
              <th>Navn</th>
              <th>Indskud</th>
              <th>Ekstra Indskud</th>
              <th>Ordinær gevinst</th>
              <th>Ekstra gevinst</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(1).map((row, i) => (
              <tr key={i}>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
                <td>{row[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
