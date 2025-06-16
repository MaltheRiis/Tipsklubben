// IMPORTER STYLES & REACT
import styles from '../styles.module.css';
import { useEffect, useState } from 'react';


// START KOMPONENT – Forsiden af din hjemmeside
export default function Home() {
  // STATE: Her gemmes rækkerne fra Google Sheet
  const [rows, setRows] = useState([]);

  // HENT DATA FRA GOOGLE SHEET
  useEffect(() => {
    const fetchData = async () => {
      // Hent TSV-data fra offentlig Google Sheet (fanen Sæson3)
      const res = await fetch(
        'https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWlPXh7d5WrItwa9eraRPoPyyDNstwxA/pub?gid=1721353232&single=true&output=tsv'
      );

      // Læs svaret som tekst og split det i linjer
      const text = await res.text();
      const lines = text.split('\n');

      // Del hver linje op i celler og filtrer tomme eller ugyldige rækker fra
      const cleaned = lines
        .map(line => line.split('\t'))
        .filter(row => row.length >= 8 && row[2] !== '');

      // Gem data i state
      setRows(cleaned);
    };

    fetchData();
  }, []);


  // HTML-STRUKTUR: Visning af siden
  return (
    <main style={{ padding: 20 }}>
      {/* Titel */}
      <h1 className={styles.title}>Tipsklubben – Sæson 3</h1>

      {/* TABEL – vis data fra Google Sheet */}
      <table border="1" cellPadding="8" className={styles.table}>
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
          {/* Gennemgå rækkerne og vis dem i tabellen */}
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
