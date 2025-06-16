// GAMMEL KODE GEMT TILBAGEUP:
// ----------------------------------------
// import { useEffect, useState } from 'react';
// import styles from '../styles.module.css';
// import Dropdown from '../components/Dropdown';
// const sheetUrls = {
//   Sæson2: '...',
//   Sæson3: '...',
//   Sæson4: '...'
// };
// export default function Home() {
//   const [selectedSeason, setSelectedSeason] = useState('Sæson3');
//   const [rows, setRows] = useState([]);
//   useEffect(() => {
//     const fetchData = async () => {
//       const res = await fetch(sheetUrls[selectedSeason]);
//       const text = await res.text();
//       const lines = text.split('\n');
//       const cleaned = lines
//         .map(line => line.split('\t'))
//         .filter((row, index) => index >= 1 && index <= 7)
//         .map(row => row.slice(2, 8));
//       setRows(cleaned);
//     };
//     fetchData();
//   }, [selectedSeason]);
//   return (...)
// }

// NY VERSION MED FILTRERING OG TOTALS:

import { useEffect, useState } from 'react';
import styles from '../styles.module.css';

const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWIPXh7d5Wrltwa9eraRPoPyyDNstwxA/pub?gid=765343490&single=true&output=tsv';

export default function Home() {
  const [data, setData] = useState([]);
  const [selectedSeason, setSelectedSeason] = useState('1');
  const [seasons, setSeasons] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(sheetUrl);
      const text = await res.text();
      const lines = text.split('\n').map(l => l.split('\t'));
      const cleaned = lines.filter(row => row.length >= 10);

      const uniqueSeasons = [...new Set(cleaned.map(row => row[0]))];
      setSeasons(uniqueSeasons);
      setData(cleaned);
    };
    fetchData();
  }, []);

  const parseKr = (text) => parseFloat(text.replace('kr', '').replaceAll('.', '').replace(',', '.')) || 0;
  const formatKr = (val) => val.toLocaleString('da-DK', { style: 'currency', currency: 'DKK' });

  const filtered = data.filter(row => row[0] === selectedSeason);

  const totals = filtered.reduce((acc, row) => {
    acc.indskud += parseKr(row[4]);
    acc.ekstra += parseKr(row[5]);
    acc.ordinær += parseKr(row[6]);
    acc.ekstraGevinst += parseKr(row[7]);
    acc.balance += parseKr(row[8]);
    return acc;
  }, { indskud: 0, ekstra: 0, ordinær: 0, ekstraGevinst: 0, balance: 0 });

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Tipsklubben – Sæson {selectedSeason}</h1>

      <div className={styles.dropdown}>
        <select value={selectedSeason} onChange={e => setSelectedSeason(e.target.value)}>
          {seasons.map(season => (
            <option key={season} value={season}>Sæson {season}</option>
          ))}
        </select>
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
            {filtered.map((row, i) => (
              <tr key={i}>
                <td>{row[3]}</td>
                <td>{row[4]}</td>
                <td>{row[5]}</td>
                <td>{row[6]}</td>
                <td>{row[7]}</td>
                <td>{row[8]}</td>
              </tr>
            ))}
            <tr className={styles.totalRow}>
              <td><strong>Total</strong></td>
              <td><strong>{formatKr(totals.indskud)}</strong></td>
              <td><strong>{formatKr(totals.ekstra)}</strong></td>
              <td><strong>{formatKr(totals.ordinær)}</strong></td>
              <td><strong>{formatKr(totals.ekstraGevinst)}</strong></td>
              <td><strong>{formatKr(totals.balance)}</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>
  );
}
