// pages/index.js

import { useEffect, useState } from "react";
import styles from "../styles.module.css";

// Link til Dataark som TSV (output=tsv!)
const SHEET_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWIPXh7d5Wrltwa9eraRPoPyyDNstwxA/pub?gid=1506638003&single=true&output=tsv";

// Funktion til at parse TSV til et array af objekter
function parseData(tsv) {
  const lines = tsv.trim().split("\n");
  // Starter fra række 13 = index 12 (0-baseret)
  const dataLines = lines.slice(12);
  if (dataLines.length < 2) return [];
  const headers = dataLines[0].split("\t");
  return dataLines.slice(1).map((line) => {
    const row = line.split("\t");
    // Brug headers til at lave key/value-par
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] || "";
    });
    return obj;
  });
}

// Funktion til at rense og konvertere penge-beløb til tal
function parseDKK(val) {
  if (!val) return 0;
  // Fjerner "kr", ".", mellemrum osv.
  return (
    parseFloat(
      val
        .replace(/\s*kr\.?/gi, "")
        .replace(/\./g, "")
        .replace(",", ".")
        .replace(/\s/g, "")
    ) || 0
  );
}

export default function Home() {
  const [data, setData] = useState([]);
  const [selectedSæson, setSelectedSæson] = useState("Alle");
  const [selectedAnsvarlig, setSelectedAnsvarlig] = useState("Alle");

  useEffect(() => {
    fetch(SHEET_URL)
      .then((res) => res.text())
      .then((tsv) => setData(parseData(tsv)));
  }, []);

  // Udtræk unikke sæsoner/ansvarlige til dropdowns
  const sæsoner = Array.from(new Set(data.map((d) => d.Sæson))).filter(Boolean);
  const ansvarlige = Array.from(new Set(data.map((d) => d.Ansvarlig))).filter(Boolean);

  // Filtrér data på valg
  const filtered = data.filter(
    (row) =>
      (selectedSæson === "Alle" || row.Sæson === selectedSæson) &&
      (selectedAnsvarlig === "Alle" || row.Ansvarlig === selectedAnsvarlig)
  );

  // Summeringer til overblik
  function sum(field) {
    return filtered.reduce((acc, row) => acc + parseDKK(row[field]), 0).toLocaleString("da-DK", {
      style: "currency",
      currency: "DKK",
      minimumFractionDigits: 2,
    });
  }

  // Overblik pr. ansvarlig (til total-oversigten)
  function getOverblik() {
    const navne = Array.from(new Set(filtered.map((r) => r.Ansvarlig))).filter(Boolean);
    return navne.map((navn) => {
      const rækker = filtered.filter((r) => r.Ansvarlig === navn);
      return {
        Ansvarlig: navn,
        Indskud: rækker.reduce((a, r) => a + parseDKK(r["Indskud"]), 0),
        EkstraIndskud: rækker.reduce((a, r) => a + parseDKK(r["Ekstra Indskud"]), 0),
        OrdinærGevinst: rækker.reduce((a, r) => a + parseDKK(r["Ordinær gevinst"]), 0),
        EkstraGevinst: rækker.reduce((a, r) => a + parseDKK(r["Ekstra gevinst"]), 0),
        Balance: rækker.reduce((a, r) => a + parseDKK(r["Balance"]), 0),
      };
    });
  }

  const overblik = getOverblik();

  return (
    <main className={styles.container}>
      <h1 className={styles.title}>Tipsklubben – Overblik</h1>

      <div className={styles.filters} style={{ display: "flex", gap: 20, marginBottom: 32 }}>
        <label>
          Sæson:{" "}
          <select value={selectedSæson} onChange={(e) => setSelectedSæson(e.target.value)}>
            <option value="Alle">Alle</option>
            {sæsoner.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label>
          Ansvarlig:{" "}
          <select value={selectedAnsvarlig} onChange={(e) => setSelectedAnsvarlig(e.target.value)}>
            <option value="Alle">Alle</option>
            {ansvarlige.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </label>
      </div>

      <h2>Opsummering pr. ansvarlig</h2>
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
            {overblik.map((row) => (
              <tr key={row.Ansvarlig}>
                <td>{row.Ansvarlig}</td>
                <td>{row.Indskud.toLocaleString("da-DK", { style: "currency", currency: "DKK" })}</td>
                <td>{row.EkstraIndskud.toLocaleString("da-DK", { style: "currency", currency: "DKK" })}</td>
                <td>{row.OrdinærGevinst.toLocaleString("da-DK", { style: "currency", currency: "DKK" })}</td>
                <td>{row.EkstraGevinst.toLocaleString("da-DK", { style: "currency", currency: "DKK" })}</td>
                <td>{row.Balance.toLocaleString("da-DK", { style: "currency", currency: "DKK" })}</td>
              </tr>
            ))}
            {overblik.length > 0 && (
              <tr className={styles.totalRow}>
                <td style={{ fontWeight: "bold" }}>Total</td>
                <td>{sum("Indskud")}</td>
                <td>{sum("Ekstra Indskud")}</td>
                <td>{sum("Ordinær gevinst")}</td>
                <td>{sum("Ekstra gevinst")}</td>
                <td>{sum("Balance")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <h2 style={{ marginTop: 48 }}>Alle registreringer</h2>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Sæson</th>
              <th>Dato</th>
              <th>Uge</th>
              <th>Ansvarlig</th>
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
                <td>{row.Sæson}</td>
                <td>{row.Dato}</td>
                <td>{row.Uge}</td>
                <td>{row.Ansvarlig}</td>
                <td>{row["Indskud"]}</td>
                <td>{row["Ekstra Indskud"]}</td>
                <td>{row["Ordinær gevinst"]}</td>
                <td>{row["Ekstra gevinst"]}</td>
                <td>{row["Balance"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
