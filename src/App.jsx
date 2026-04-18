import { useState } from "react";

export default function App() {
  const [discipline, setDiscipline] = useState("GS");

  // START: FIS points only
  const [start, setStart] = useState(Array(5).fill(0));

  // FINISH: name / time / fis
  const [finish, setFinish] = useState(
    Array(5).fill().map(() => ({
      name: "",
      time: 0,
      fis: 0,
    }))
  );

  const F = discipline === "GS" ? 1010 : 730;

  const ranks = [1, 2, 3, 4, 5];

  // winner time
  const winnerTime = Math.min(
    ...finish.map((f) => Number(f.time) || Infinity)
  );

  // Race Points (FIS formula)
  const calcRacePoints = (time) => {
    if (!time || !winnerTime || winnerTime === Infinity) return 0;
    return ((Number(time) / winnerTime) - 1) * F;
  };

  // START update
  const updateStart = (i, value) => {
    const arr = [...start];
    arr[i] = Number(value);
    setStart(arr);
  };

  // FINISH update
  const updateFinish = (i, field, value) => {
    const arr = [...finish];

    arr[i][field] =
      field === "name" ? value : Number(value);

    setFinish(arr);
  };

  // sums
  const sumStart = start.reduce((a, b) => a + Number(b || 0), 0);
  const sumFinish = finish.reduce((a, b) => a + Number(b.fis || 0), 0);

  const sumRacePoints = finish.reduce(
    (a, b) => a + calcRacePoints(b.time),
    0
  );

  // PENALTY (your structure)
  const penalty =
    (sumStart + sumFinish - sumRacePoints) / 10;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>🎿 FIS Penalty Calculator</h1>

      {/* DISCIPLINE */}
      <h3>Discipline</h3>
      <select
        value={discipline}
        onChange={(e) => setDiscipline(e.target.value)}
      >
        <option value="GS">GS</option>
        <option value="SL">SL</option>
      </select>

      <hr />

      {/* START */}
      <h2>Start List (Rank 1–5)</h2>

      {ranks.map((r, i) => (
        <div key={i} style={{ marginBottom: 8 }}>
          <span style={{ marginRight: 10 }}>
            🏁 Rank {r}
          </span>

          <input
            type="text"
            inputMode="decimal"
            placeholder="FIS Points"
            value={start[i]}
            onChange={(e) =>
              updateStart(i, e.target.value)
            }
            style={{ width: 140 }}
          />
        </div>
      ))}

      <hr />

      {/* FINISH */}
      <h2>Finish List (Rank 1–5)</h2>

      {finish.map((a, i) => (
        <div
          key={i}
          style={{
            marginBottom: 14,
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 8,
            backgroundColor: "#fafafa",
          }}
        >
          {/* Rank */}
          <div style={{ fontWeight: "bold", marginBottom: 8 }}>
            🏁 Rank {ranks[i]}
          </div>

          {/* Name */}
          <div style={{ marginBottom: 6 }}>
            <label style={{ marginRight: 8 }}>👤 Name</label>
            <input
              type="text"
              value={a.name}
              onChange={(e) =>
                updateFinish(i, "name", e.target.value)
              }
              style={{ width: 140 }}
            />
          </div>

          {/* TIME */}
          <div style={{ marginBottom: 6 }}>
            <label
              style={{
                marginRight: 8,
                color: "blue",
                fontWeight: "bold",
              }}
            >
              ⏱ TIME (sec)
            </label>

            <input
              type="text"
              inputMode="decimal"
              value={a.time}
              onChange={(e) =>
                updateFinish(i, "time", e.target.value)
              }
              style={{
                width: 120,
                border: "2px solid blue",
              }}
            />
          </div>

          {/* FIS POINTS */}
          <div style={{ marginBottom: 6 }}>
            <label
              style={{
                marginRight: 8,
                color: "green",
                fontWeight: "bold",
              }}
            >
              📊 FIS POINTS
            </label>

            <input
              type="text"
              inputMode="decimal"
              value={a.fis}
              onChange={(e) =>
                updateFinish(i, "fis", e.target.value)
              }
              style={{
                width: 120,
                border: "2px solid green",
              }}
            />
          </div>

          {/* RACE POINTS */}
          <div style={{ fontWeight: "bold" }}>
            🏁 Race Points:{" "}
            {calcRacePoints(a.time).toFixed(2)}
          </div>
        </div>
      ))}

      <hr />

      {/* RESULT */}
      <h2>📊 Results</h2>

      <p>Start Sum: {sumStart.toFixed(2)}</p>
      <p>Finish Sum: {sumFinish.toFixed(2)}</p>
      <p>Race Points Sum: {sumRacePoints.toFixed(2)}</p>

      <h2>🎯 Penalty: {penalty.toFixed(2)}</h2>
    </div>
  );
}