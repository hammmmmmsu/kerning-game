import { useRef, useState } from "react";

const letters = ["볼", "루", "베", "리", "스", "무", "디"];
const answerPositions = [0, 170, 330, 430, 650, 860, 1080];
const initialPositions = [0, 170, 370, 500, 730, 940, 1160];

type DragState = {
  index: number;
  startX: number;
  initialPositions: number[];
} | null;

export default function App() {
  const [userPositions, setUserPositions] = useState(initialPositions);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const dragRef = useRef<DragState>(null);

  const handlePointerDown = (index: number, clientX: number) => {
    dragRef.current = {
      index,
      startX: clientX,
      initialPositions: [...userPositions],
    };
  };

  const handlePointerMove = (clientX: number) => {
    const drag = dragRef.current;
    if (!drag) return;

    const delta = clientX - drag.startX;

    const next = drag.initialPositions.map((pos, i) => {
      if (i >= drag.index) return pos + delta;
      return pos;
    });

    setUserPositions(next);
  };

  const handlePointerUp = () => {
    dragRef.current = null;
  };

  const handleGrade = () => {
    const totalDiff = userPositions.reduce((sum, x, i) => {
      return sum + Math.abs(x - answerPositions[i]);
    }, 0);

    const nextScore = Math.max(0, 100 - Math.round(totalDiff / 10));
    setScore(nextScore);
    setShowAnswer(true);
  };

  return (
      <div
          onPointerMove={(e) => handlePointerMove(e.clientX)}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{
            minHeight: "100vh",
            background: "#3f4658",
            color: "white",
            padding: "80px 60px",
          }}
      >
        <div
            style={{
              position: "relative",
              width: 1260,
              height: 260,
              margin: "120px auto 0",
              borderTop: "1px solid rgba(255,255,255,0.6)",
              borderBottom: "1px solid rgba(255,255,255,0.6)",
            }}
        >
          {letters.map((letter, i) => (
              <span
                  key={`answer-${i}`}
                  style={{
                    position: "absolute",
                    left: answerPositions[i],
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 96,
                    color: "#3b82f6",
                    opacity: showAnswer ? 1 : 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  }}
              >
            {letter}
          </span>
          ))}

          {letters.map((letter, i) => (
              <span
                  key={`user-${i}`}
                  onPointerDown={(e) => handlePointerDown(i, e.clientX)}
                  style={{
                    position: "absolute",
                    left: userPositions[i],
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 96,
                    color: "white",
                    cursor: "ew-resize",
                    userSelect: "none",
                  }}
              >
            {letter}
          </span>
          ))}
        </div>

        <div
            style={{
              width: 1260,
              margin: "80px auto 0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
        >
          <div style={{ fontSize: 42 }}>점수 {String(score).padStart(3, "0")}</div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <button onClick={handleGrade}>채점</button>
            <button
                onClick={() => {
                  setUserPositions(initialPositions);
                  setShowAnswer(false);
                  setScore(0);
                }}
            >
              다음
            </button>
          </div>
        </div>
      </div>
  );
}