import { useRef, useState } from "react";

const letters = ["블", "루", "베", "리", "스", "무", "디"];
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

    const handleNext = () => {
        setUserPositions(initialPositions);
        setShowAnswer(false);
        setScore(0);
    };

    return (
        <div
            onPointerMove={(e) => handlePointerMove(e.clientX)}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className="min-h-screen bg-background px-[60px] pt-[80px] text-wh overflow-hidden font-paper"
        >
            <div className="flex items-start justify-between">
                <div className="text-wh text-2xl">
                    ㅈ ㅏ ㄱ ㅏ ㄴ ㅁ ㅏ ㅈ ㅊ ㅜ ㄱ ㅣ
                </div>

                <div className="text-2xl text-wh underline underline-offset-4">
                    폰트
                </div>
            </div>

            <div className="mx-auto mt-[120px] w-[1260px] border-y border-white/60">
                <div className="relative h-[260px] overflow-hidden">
                    {letters.map((letter, i) => (
                        <span
                            key={`answer-${i}`}
                            className={`pointer-events-none absolute top-1/2 select-none text-[96px] leading-none text-primary-300 transition-opacity ${
                                showAnswer ? "opacity-100" : "opacity-0"
                            }`}
                            style={{
                                left: `${answerPositions[i]}px`,
                                transform: "translateY(-50%)",
                            }}
                        >
              {letter}
            </span>
                    ))}

                    {letters.map((letter, i) => (
                        <span
                            key={`user-${i}`}
                            onPointerDown={(e) => handlePointerDown(i, e.clientX)}
                            className="absolute top-1/2 cursor-ew-resize select-none text-[96px] leading-none text-white"
                            style={{
                                left: `${userPositions[i]}px`,
                                transform: "translateY(-50%)",
                            }}
                        >
              {letter}
            </span>
                    ))}
                </div>
            </div>

            <div className="mx-auto mt-[80px] flex w-[1260px] items-start justify-between">
                <div className="text-3xl leading-none">
                    점수 {String(score).padStart(3, "0")}
                </div>

                <div className="flex flex-col items-end gap-6 text-3xl leading-none">
                    <button onClick={handleGrade} className="hover:opacity-70">
                        채점
                    </button>
                    <button onClick={handleNext} className="hover:opacity-70">
                        다음
                    </button>
                </div>
            </div>
        </div>
    );
}