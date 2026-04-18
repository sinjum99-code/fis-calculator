import { useState } from "react";

export default function App() {
  const [discipline, setDiscipline] = useState("GS");

  const F_VALUE = discipline === "GS" ? 1010 : 730;

  const [startPoints, setStartPoints] = useState(Array(5).fill(""));
  const [finishPoints, setFinishPoints] = useState(Array(5).fill(""));
  const [finishTimes, setFinishTimes] = useState(Array(5).fill(""));

  const ranks = ["1st", "2nd", "3rd", "4th", "5th"];

  // 숫자 입력 (소수점 포함 허용)
  const handleInput = (value, list, index, setter) => {
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      const updated = [...list];
      updated[index] = value;
      setter(updated);
    }
  };

  // winner time (그냥 최소값)
  const validTimes = finishTimes
    .map(Number)
    .filter((t) => t > 0);

  const winnerTime = validTimes.length ? Math.min(...validTimes) : 0;

  // ❗ RAW RP (반올림 없음)
  const racePoints = finishTimes.map((t) => {
    if (!t || !winnerTime) return 0;
    return (Number(t) / winnerTime - 1) * F_VALUE;
  });

  // sums (그대로)
  const sumStart = startPoints.reduce((a, b) => a + Number(b || 0), 0);
  const sumFinish = finishPoints.reduce((a, b) => a + Number(b || 0), 0);
  const sumRace = racePoints.reduce((a, b) => a + b, 0);

  // ❗ RAW penalty (반올림 없음)
  const penalty = (sumStart + sumFinish - sumRace) / 10;

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
            type="text"
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

          <div style={{ fontWeight: "bold" }}>{ranks[i]}</div>

          <input
            type="text"
            value={p}
            onChange={(e) =>
              handleInput(e.target.value, finishPoints, i, setFinishPoints)
            }
            placeholder="FIS Points"
            style={{ marginLeft: 10, width: 120 }}
          />

          <input
            type="text"
            value={finishTimes[i]}
            onChange={(e) =>
              handleInput(e.target.value, finishTimes, i, setFinishTimes)
            }
            placeholder="Time"
            style={{ marginLeft: 10, width: 120 }}
          />

          <div style={{ marginLeft: 10, marginTop: 5 }}>
            RP: {racePoints[i]}
          </div>
        </div>
      ))}

      {/* RESULT */}
      <h2 style={{ marginTop: 30 }}>Result</h2>
      <p>Penalty: {penalty}</p>

    </div>
  );
}