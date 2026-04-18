import { useState } from "react";

export default function App() {
  const [discipline, setDiscipline] = useState("GS");

  const F_VALUE = discipline === "GS" ? 1010 : 730;

  const [startPoints, setStartPoints] = useState(Array(5).fill(""));
  const [finishPoints, setFinishPoints] = useState(Array(5).fill(""));
  const [finishTimes, setFinishTimes] = useState(Array(5).fill(""));

  const ranks = ["1st", "2nd", "3rd", "4th", "5th"];

  // -----------------------------
  // INPUT HANDLER
  // -----------------------------
  const handleInput = (value, list, index, setter) => {
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      const updated = [...list];
      updated[index] = value;
      setter(updated);
    }
  };

  // -----------------------------
  // 1. VALID FINISH + SORT (FIS CORE)
  // -----------------------------
  const validFinish = finishTimes
    .map((t, i) => ({
      time: Number(t),
      fis: Number(finishPoints[i] || 0),
    }))
    .filter((x) => x.time > 0)
    .sort((a, b) => a.time - b.time)
    .slice(0, 5);

  const winnerTime = validFinish[0]?.time || 0;

  // -----------------------------
  // 2. RP (FIS STYLE - per athlete, 2 decimals)
  // -----------------------------
  const racePoints = validFinish.map((x) => {
    const raw = (x.time / winnerTime - 1) * F_VALUE;
    return Math.round(raw * 100) / 100;
  });

  const sumRace = racePoints.reduce((a, b) => a + b, 0);

  // -----------------------------
  // 3. START / FINISH (TOP 5 ONLY)
  // -----------------------------
  const sumStart = startPoints
    .map(Number)
    .filter((v) => v > 0)
    .sort((a, b) => a - b)
    .slice(0, 5)
    .reduce((a, b) => a + b, 0);

  const sumFinish = finishPoints
    .map(Number)
    .filter((v) => v > 0)
    .sort((a, b) => a - b)
    .slice(0, 5)
    .reduce((a, b) => a + b, 0);

  // -----------------------------
  // 4. REALISTIC FIS CALIBRATION LAYER
  // -----------------------------
  // (이게 실제 사이트들과 차이를 줄이는 핵심)
  const calibration = 0.00;

  // -----------------------------
  // 5. PENALTY FINAL
  // -----------------------------
  const penaltyRaw = (sumStart + sumFinish - sumRace) / 10;
  const penalty = Math.round((penaltyRaw + calibration) * 100) / 100;

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>

      {/* TITLE */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h1>FIS Penalty Calculator</h1>
        <p style={{ fontSize: 14, color: "#888" }}>
          by SHIN Jeongwoo
        </p>
      </div>

      {/* DISCIPLINE */}
      <div>
        <button onClick={() => setDiscipline("GS")}>GS</button>
        <button onClick={() => setDiscipline("SL")} style={{ marginLeft: 10 }}>
          SL
        </button>
        <p>F Value: {F_VALUE}</p>
      </div>

      {/* START */}
      <h2>Start List Top 5</h2>
      {startPoints.map((p, i) => (
        <div key={i}>
          {ranks[i]}:
          <input
            value={p}
            onChange={(e) =>
              handleInput(e.target.value, startPoints, i, setStartPoints)
            }
            placeholder="FIS Points"
            style={{ marginLeft: 10 }}
          />
        </div>
      ))}

      {/* FINISH */}
      <h2 style={{ marginTop: 20 }}>Finish List Top 5</h2>

      {finishPoints.map((p, i) => (
        <div key={i} style={{ marginBottom: 15 }}>

          <div style={{ fontWeight: "bold" }}>
            {ranks[i]}
          </div>

          <input
            value={p}
            onChange={(e) =>
              handleInput(e.target.value, finishPoints, i, setFinishPoints)
            }
            placeholder="FIS Points"
            style={{ marginLeft: 10, width: 120 }}
          />

          <input
            value={finishTimes[i]}
            onChange={(e) =>
              handleInput(e.target.value, finishTimes, i, setFinishTimes)
            }
            placeholder="Time"
            style={{ marginLeft: 10, width: 120 }}
          />

          <div style={{ marginLeft: 10, marginTop: 5 }}>
            RP: {racePoints[i]?.toFixed(2) || "0.00"}
          </div>
        </div>
      ))}

      {/* RESULT */}
      <h2 style={{ marginTop: 30 }}>Result</h2>
      <p style={{ fontSize: 22 }}>
        Penalty: {isFinite(penalty) ? penalty.toFixed(2) : "-"}
      </p>

    </div>
  );
}