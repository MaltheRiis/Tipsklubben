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
      const rækker =
