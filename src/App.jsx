import { useState } from "react";

export default function App() {
  const [discipline, setDiscipline] = useState("GS");

  const F_VALUE = discipline === "GS" ? 1010 : 730;

  const [startPoints, setStartPoints] = useState(Array(5).fill(""));
  const [finishPoints, setFinishPoints] = useState(Array(5).fill(""));
  const [finishTimes, setFinishTimes] = useState(Array(5).fill(""));

  const handleTextNumber = (value, setter, index) => {
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      const updated = [...setter];
      updated[index] = value;
      return updated;
    }
    return setter;
  };

  const updateStart = (i, val) =>
    setStartPoints(handleTextNumber(val, startPoints, i));

  const updateFinishPoint = (i, val) =>
    setFinishPoints(handleTextNumber(val, finishPoints, i));

  const updateFinishTime = (i, val) =>
    setFinishTimes(handleTextNumber(val, finishTimes, i));

  const times = finishTimes.map(Number).filter((t) => t > 0);
  const winnerTime = Math.min(...times);

  const racePoints = finishTimes.map((t) => {
    if (!t || !winnerTime) return 0;
    return ((Number(t) / winnerTime - 1) * F_VALUE);
  });

  const sumStart = startPoints.reduce((a, b) => a + Number(b || 0), 0);
  const sumFinish = finishPoints.reduce((a, b) => a + Number(b || 0), 0);
  const sumRace = racePoints.reduce((a, b) => a + b, 0);

  const penalty = ((sumStart + sumFinish - sumRace) / 10);

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>FIS Penalty Calculator</h1>

      {/* GS / SL 선택 */}
      <div>
        <button onClick={() => setDiscipline("GS")}>GS</button>
        <button onClick={() => setDiscipline("SL")}>SL</button>
        <p>F Value: {F_VALUE}</p>
      </div>

      {/* Start List */}
      <h2>Start List Top 5 (FIS Points)</h2>
      {startPoints.map((p, i) => (
        <div key={i}>
          {i + 1}위:
          <input
            type="text"
            value={p}
            onChange={(e) => updateStart(i, e.target.value)}
            placeholder="FIS Points"
          />
        </div>
      ))}

      {/* Finish List */}
      <h2>Finish List Top 5</h2>
      {finishPoints.map((p, i) => (
        <div key={i}>
          {i + 1}위:
          <input
            type="text"
            value={p}
            onChange={(e) => updateFinishPoint(i, e.target.value)}
            placeholder="FIS Points"
          />
          <input
            type="text"
            value={finishTimes[i]}
            onChange={(e) => updateFinishTime(i, e.target.value)}
            placeholder="Time (sec)"
          />
          <span>
            {" "}
            → Race Point: {racePoints[i]?.toFixed(2)}
          </span>
        </div>
      ))}

      {/* 결과 */}
      <h2>Result</h2>
      <p>Penalty: {isFinite(penalty) ? penalty.toFixed(2) : "-"}</p>
    </div>
  );
}