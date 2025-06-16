// pages/index.js
import { useEffect, useState } from 'react';
import styles from '../styles.module.css';
import Dropdown from '../components/Dropdown';

const sheetUrls = {
  Sæson2: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWlPXh7d5WrItwa9eraRPoPyyDNstwxA/pub?gid=1088194024&single=true&output=tsv',
  Sæson3: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWlPXh7d5WrItwa9eraRPoPyyDNstwxA/pub?gid=1721353232&single=true&output=tsv',
  Sæson4: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWlPXh7d5WrItwa9eraRPoPyyDNstwxA/pub?gid=1048192527&single=true&output=tsv',
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
        .filter(row => row.length >= 8 && row[2] !== '');
      setRows(cleaned);
    };

    fetchData();
  }, [selectedSeason]); // Henter ny data hver gang dropdown ændres

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Tipsklubben – {selectedSeason}</h1>

      <Dropdown selectedSeason={selectedSeason} onChange={setSelectedSeason} />

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
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
                <td>{row[1]}</td>
                <td>{row[2]}</td>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
                <td>{row[5]}</td>
                <td>{row[6]}</td>
                <td>{row[7]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
