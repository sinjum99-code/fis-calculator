import { useState } from "react";

export default function App() {
  const [discipline, setDiscipline] = useState("GS");

  const F_VALUE = discipline === "GS" ? 1010 : 730;

  const [startPoints, setStartPoints] = useState(Array(5).fill(""));
  const [finishPoints, setFinishPoints] = useState(Array(5).fill(""));
  const [finishTimes, setFinishTimes] = useState(Array(5).fill(""));

  const handleInput = (value, list, index, setter) => {
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      const updated = [...list];
      updated[index] = value;
      setter(updated);
    }
  };

  const times = finishTimes.map(Number).filter((t) => t > 0);
  const winnerTime = times.length ? Math.min(...times) : 0;

  const racePoints = finishTimes.map((t) => {
    if (!t || !winnerTime) return 0;
    return (Number(t) / winnerTime - 1) * F_VALUE;
  });

  const sumStart = startPoints.reduce((a, b) => a + Number(b || 0), 0);
  const sumFinish = finishPoints.reduce((a, b) => a + Number(b || 0), 0);
  const sumRace = racePoints.reduce((a, b) => a + b, 0);

  const penalty = (sumStart + sumFinish - sumRace) / 10;

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      
      {/* 제목 + 이름 */}
      <div style={{ textAlign: "center", marginBottom: 30 }}>
        <h1 style={{ marginBottom: 5 }}>FIS Penalty Calculator</h1>
        <p style={{ fontSize: 14, color: "#888" }}>
          by SHIN Jeongwoo
        </p>
      </div>

      {/* GS / SL 선택 */}
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setDiscipline("GS")}>GS</button>
        <button onClick={() => setDiscipline("SL")} style={{ marginLeft: 10 }}>
          SL
        </button>
        <p>F Value: {F_VALUE}</p>
      </div>

      {/* Start List */}
      <h2>Start List Top 5 (FIS Points)</h2>
      {startPoints.map((p, i) => (
        <div key={i} style={{ marginBottom: 5 }}>
          {i + 1}위:
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

      {/* Finish List */}
      <h2 style={{ marginTop: 20 }}>Finish List Top 5</h2>
      {finishPoints.map((p, i) => (
        <div key={i} style={{ marginBottom: 5 }}>
          {i + 1}위:
          
          {/* FIS Points */}
          <input
            type="text"
            value={p}
            onChange={(e) =>
              handleInput(e.target.value, finishPoints, i, setFinishPoints)
            }
            placeholder="FIS Points"
            style={{ marginLeft: 10, width: 120 }}
          />

          {/* Time */}
          <input
            type="text"
            value={finishTimes[i]}
            onChange={(e) =>
              handleInput(e.target.value, finishTimes, i, setFinishTimes)
            }
            placeholder="Time (sec)"
            style={{ marginLeft: 10, width: 120 }}
          />

          {/* Race Point */}
          <span style={{ marginLeft: 10 }}>
            RP: {racePoints[i]?.toFixed(2)}
          </span>
        </div>
      ))}

      {/* 결과 */}
      <h2 style={{ marginTop: 30 }}>Result</h2>
      <p style={{ fontSize: 20 }}>
        Penalty: {isFinite(penalty) ? penalty.toFixed(2) : "-"}
      </p>
    </div>
  );
}