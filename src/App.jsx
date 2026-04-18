import { useMemo, useState } from "react";

export default function App() {
  const [discipline, setDiscipline] = useState("SL");

  const F_VALUE = discipline === "GS" ? 1010 : 730;

  const [startPoints, setStartPoints] = useState(["", "", "", "", ""]);
  const [finishPoints, setFinishPoints] = useState(["", "", "", "", ""]);
  const [finishTimes, setFinishTimes] = useState(["", "", "", "", ""]);

  const ranks = ["1st", "2nd", "3rd", "4th", "5th"];

  const handleInput = (value, list, index, setter) => {
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      const updated = [...list];
      updated[index] = value;
      setter(updated);
    }
  };

  const toNumber = (value) => {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  };

  const format2 = (value) => {
    if (!Number.isFinite(value)) return "-";
    return value.toFixed(2);
  };

  const validTimesSorted = useMemo(() => {
    return finishTimes
      .map(toNumber)
      .filter((t) => t > 0)
      .sort((a, b) => a - b);
  }, [finishTimes]);

  const winnerTime = validTimesSorted.length > 0 ? validTimesSorted[0] : 0;

  // RAW RP 계산: 내부 계산에서는 반올림 없음
  const racePointsRaw = useMemo(() => {
    return finishTimes.map((time) => {
      const t = toNumber(time);
      if (t <= 0 || winnerTime <= 0) return 0;
      return ((t / winnerTime) - 1) * F_VALUE;
    });
  }, [finishTimes, winnerTime, F_VALUE]);

  const sumStartRaw = useMemo(() => {
    return startPoints.reduce((sum, v) => sum + toNumber(v), 0);
  }, [startPoints]);

  const sumFinishRaw = useMemo(() => {
    return finishPoints.reduce((sum, v) => sum + toNumber(v), 0);
  }, [finishPoints]);

  const sumRaceRaw = useMemo(() => {
    return racePointsRaw.reduce((sum, v) => sum + v, 0);
  }, [racePointsRaw]);

  // 내부 계산은 raw 그대로
  const penaltyRaw = useMemo(() => {
    return (sumStartRaw + sumFinishRaw - sumRaceRaw) / 10;
  }, [sumStartRaw, sumFinishRaw, sumRaceRaw]);

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial, sans-serif",
        maxWidth: 760,
        margin: "0 auto",
        lineHeight: 1.5,
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1 style={{ marginBottom: 6 }}>FIS Penalty Calculator</h1>
        <div style={{ color: "#666", fontSize: 14 }}>by SHIN Jeongwoo</div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setDiscipline("GS")}
          style={{
            marginRight: 8,
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: discipline === "GS" ? "bold" : "normal",
          }}
        >
          GS
        </button>
        <button
          onClick={() => setDiscipline("SL")}
          style={{
            padding: "8px 14px",
            cursor: "pointer",
            fontWeight: discipline === "SL" ? "bold" : "normal",
          }}
        >
          SL
        </button>

        <div style={{ marginTop: 10 }}>
          <strong>F Value:</strong> {F_VALUE}
        </div>
        <div style={{ marginTop: 4 }}>
          <strong>Winner Time:</strong> {winnerTime > 0 ? format2(winnerTime) : "-"}
        </div>
      </div>

      <h2>Start List Top 5</h2>
      {startPoints.map((value, i) => (
        <div key={`start-${i}`} style={{ marginBottom: 8 }}>
          <span style={{ display: "inline-block", width: 48 }}>{ranks[i]}:</span>
          <input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) =>
              handleInput(e.target.value, startPoints, i, setStartPoints)
            }
            placeholder="FIS Points"
            style={{
              width: 140,
              padding: "6px 8px",
              border: "1px solid #ccc",
              borderRadius: 4,
            }}
          />
        </div>
      ))}

      <h2 style={{ marginTop: 24 }}>Finish List Top 5</h2>
      {finishPoints.map((value, i) => (
        <div
          key={`finish-${i}`}
          style={{
            marginBottom: 14,
            padding: 10,
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fafafa",
          }}
        >
          <div style={{ fontWeight: "bold", marginBottom: 8 }}>{ranks[i]}</div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "inline-block", width: 90 }}>FIS Points</label>
            <input
              type="text"
              inputMode="decimal"
              value={value}
              onChange={(e) =>
                handleInput(e.target.value, finishPoints, i, setFinishPoints)
              }
              placeholder="FIS Points"
              style={{
                width: 140,
                padding: "6px 8px",
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
            />
          </div>

          <div style={{ marginBottom: 8 }}>
            <label style={{ display: "inline-block", width: 90 }}>Time</label>
            <input
              type="text"
              inputMode="decimal"
              value={finishTimes[i]}
              onChange={(e) =>
                handleInput(e.target.value, finishTimes, i, setFinishTimes)
              }
              placeholder="Time"
              style={{
                width: 140,
                padding: "6px 8px",
                border: "1px solid #ccc",
                borderRadius: 4,
              }}
            />
          </div>

          <div style={{ color: "#333" }}>
            RP: {format2(racePointsRaw[i])}
          </div>
        </div>
      ))}

      <h2 style={{ marginTop: 24 }}>Result</h2>
      <div><strong>Start Sum:</strong> {format2(sumStartRaw)}</div>
      <div><strong>Finish Sum:</strong> {format2(sumFinishRaw)}</div>
      <div><strong>Race Point Sum:</strong> {format2(sumRaceRaw)}</div>
      <div style={{ marginTop: 10, fontSize: 22, fontWeight: "bold" }}>
        Penalty: {format2(penaltyRaw)}
      </div>
    </div>
  );
}