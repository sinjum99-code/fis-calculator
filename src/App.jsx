import { useMemo, useState } from "react";

export default function App() {
  const [discipline, setDiscipline] = useState("SL");

  const F_VALUE = discipline === "GS" ? 1010 : 730;

  const [startPoints, setStartPoints] = useState(["", "", "", "", ""]);
  const [finishPoints, setFinishPoints] = useState(["", "", "", "", ""]);
  const [finishTimes, setFinishTimes] = useState(["", "", "", "", ""]);
  const [myTime, setMyTime] = useState("");

  const ranks = ["1st", "2nd", "3rd", "4th", "5th"];

  const handleInput = (value, list, index, setter) => {
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      const updated = [...list];
      updated[index] = value;
      setter(updated);
    }
  };

  const handleSingleInput = (value, setter) => {
    if (/^[0-9]*\.?[0-9]*$/.test(value)) {
      setter(value);
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

  const penaltyRaw = useMemo(() => {
    return (sumStartRaw + sumFinishRaw - sumRaceRaw) / 10;
  }, [sumStartRaw, sumFinishRaw, sumRaceRaw]);

  const myRacePointRaw = useMemo(() => {
    const t = toNumber(myTime);
    if (t <= 0 || winnerTime <= 0) return 0;
    return ((t / winnerTime) - 1) * F_VALUE;
  }, [myTime, winnerTime, F_VALUE]);

  const myFisPointsRaw = useMemo(() => {
    return penaltyRaw + myRacePointRaw;
  }, [penaltyRaw, myRacePointRaw]);

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif", maxWidth: 760, margin: "0 auto" }}>

      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h1>FIS Penalty Calculator</h1>
        <div style={{ color: "#666", fontSize: 14 }}>by SHIN Jeongwoo</div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setDiscipline("GS")}>GS</button>
        <button onClick={() => setDiscipline("SL")} style={{ marginLeft: 10 }}>SL</button>

        <div style={{ marginTop: 10 }}>
          <strong>F Value:</strong> {F_VALUE}
        </div>
        <div>
          <strong>Winner Time:</strong> {winnerTime > 0 ? format2(winnerTime) : "-"}
        </div>
      </div>

      <h2>Start List Top 5</h2>
      {startPoints.map((value, i) => (
        <div key={i}>
          {ranks[i]}:
          <input
            value={value}
            onChange={(e) => handleInput(e.target.value, startPoints, i, setStartPoints)}
            style={{ marginLeft: 10 }}
          />
        </div>
      ))}

      <h2 style={{ marginTop: 24 }}>Finish List Top 5</h2>
      {finishPoints.map((value, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ fontWeight: "bold" }}>{ranks[i]}</div>

          <input
            value={value}
            onChange={(e) => handleInput(e.target.value, finishPoints, i, setFinishPoints)}
            placeholder="FIS Points"
            style={{ marginRight: 10 }}
          />

          <input
            value={finishTimes[i]}
            onChange={(e) => handleInput(e.target.value, finishTimes, i, setFinishTimes)}
            placeholder="Time"
          />

          <div style={{ marginTop: 4 }}>
            Race Points : {format2(racePointsRaw[i])}
          </div>
        </div>
      ))}

      <div style={{ marginTop: 30, padding: 20, border: "2px solid black", textAlign: "center" }}>
        <div>Penalty</div>
        <div style={{ fontSize: 28, fontWeight: "bold" }}>
          {format2(penaltyRaw)}
        </div>
      </div>

      <div style={{ marginTop: 20, padding: 20, border: "1px solid gray" }}>
        <div style={{ fontWeight: "bold", marginBottom: 10 }}>
          My fis points
        </div>

        <input
          value={myTime}
          onChange={(e) => handleSingleInput(e.target.value, setMyTime)}
          placeholder="My Time"
        />

        <div style={{ marginTop: 10, fontSize: 20 }}>
          {format2(myFisPointsRaw)}
        </div>
      </div>
    </div>
  );
}