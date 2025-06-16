export default function Home({ headers, data }) {
  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial, sans-serif' }}>
      <h1>Tipsklubben</h1>
      <p><em>Forbundne, forpligtet, for Tipsklubben</em></p>
      <h2>Sæson 3</h2>

      <table style={{ borderCollapse: 'collapse', width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} style={{
                border: '1px solid #ccc',
                padding: '0.5rem',
                background: '#ddd',
                textAlign: 'left'
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {headers.map(h => (
                <td key={h} style={{
                  border: '1px solid #ccc',
                  padding: '0.5rem'
                }}>{row[h]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export async function getStaticProps() {
  const sheetId = '2PACX-1vRLuzIhpLhkGGSJSVBJfIIT1WTJkKT4mmFYQlwJTvUeE9AekWIPXh7d5Wrltwa9eraRPoPyyDNstwxA';
  const sheetName = 'Sæson3';
  const url = `https://docs.google.com/spreadsheets/d/e/${sheetId}/gviz/tq?sheet=${encodeURIComponent(sheetName)}&tqx=out:json`;

  const res = await fetch(url);
  const text = await res.text();

  const json = JSON.parse(
    text.match(/google\.visualization\.Query\.setResponse\((.*)\)/s)[1]
  );

  const { cols, rows } = json.table;
  const headers = cols.map(c => c.label);
  const data = rows.map(r => {
    const obj = {};
    r.c.forEach((cell, i) => {
      obj[headers[i]] = cell && cell.v !== null ? cell.v : '';
    });
    return obj;
  });

  return {
    props: { headers, data },
    revalidate: 60, // Opdater hver 60. sekund
  };
}
