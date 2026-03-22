import { useMemo, useRef, useState } from "react";
import type { Stage } from "../types/kerning";
import { buildPositions, clamp, isLockedIndex } from "../utils/kerning";

type Props = {
    stage: Stage;
    onNext: () => void;
};

type DragState = {
    index: number;
    startX: number;
    startPositions: number[];
} | null;

const AREA_WIDTH = 1260;
const FALLBACK_WIDTH = 80;
const MIN_GAP = 0;

export default function KerningGame({ stage, onNext }: Props) {
    const letters = useMemo(() => Array.from(stage.text), [stage.text]);

    const [widths, setWidths] = useState<number[]>(letters.map(() => FALLBACK_WIDTH));
    const [showAnswer, setShowAnswer] = useState(false);
    const [score, setScore] = useState(0);

    const measureRefs = useRef<Array<HTMLSpanElement | null>>([]);
    const dragRef = useRef<DragState>(null);

    const setMeasureRef = (index: number, el: HTMLSpanElement | null) => {
        measureRefs.current[index] = el;

        if (!el) return;

        const width = el.getBoundingClientRect().width;

        setWidths((prev) => {
            if (prev[index] === width) return prev;

            const next = [...prev];
            next[index] = width;
            return next;
        });
    };


    const fixedStartX = useMemo(() => {
        const totalWidth =
            widths.reduce((sum, w) => sum + w, 0) +
            stage.answerGaps.reduce((sum, g) => sum + g, 0);

        return (AREA_WIDTH - totalWidth) / 2;
    }, [widths, stage.answerGaps]);

    const answerPositions = useMemo(() => {
        return buildPositions({
            startX: fixedStartX,
            widths,
            gaps: stage.answerGaps,
        });
    }, [fixedStartX, widths, stage.answerGaps]);

    const initialUserPositions = useMemo(() => {
        return buildPositions({
            startX: fixedStartX,
            widths,
            gaps: stage.startGaps,
        });
    }, [fixedStartX, widths, stage.startGaps]);

    const [userPositions, setUserPositions] = useState<number[]>(initialUserPositions);

    const handlePointerDown = (index: number, clientX: number) => {
        if (isLockedIndex(index, letters.length)) return;

        dragRef.current = {
            index,
            startX: clientX,
            startPositions: [...userPositions],
        };
    };

    const handlePointerMove = (clientX: number) => {
        const drag = dragRef.current;
        if (!drag) return;

        const index = drag.index;
        if (index <= 0 || index >= letters.length - 1) return;

        const delta = clientX - drag.startX;

        const prevLeft = drag.startPositions[index - 1];
        const nextLeft = drag.startPositions[index + 1];
        const prevWidth = widths[index - 1] ?? 0;
        const currentWidth = widths[index] ?? 0;

        const minLeft = prevLeft + prevWidth + MIN_GAP;
        const maxLeft = nextLeft - currentWidth - MIN_GAP;

        const nextLeftClamped = clamp(
            drag.startPositions[index] + delta,
            minLeft,
            maxLeft
        );

        setUserPositions((prev) => {
            const next = [...prev];
            next[0] = answerPositions[0];
            next[next.length - 1] = answerPositions[answerPositions.length - 1];
            next[index] = nextLeftClamped;
            return next;
        });
    };

    const handlePointerUp = () => {
        dragRef.current = null;
    };

    const handleReset = () => {
        setUserPositions(initialUserPositions);
        setShowAnswer(false);
        setScore(0);
    };

    const handleGrade = () => {
        let totalDiff = 0;

        for (let i = 1; i < letters.length - 1; i += 1) {
            totalDiff += Math.abs(userPositions[i] - answerPositions[i]);
        }

        const nextScore = Math.max(0, 100 - Math.round(totalDiff / 8));
        setScore(nextScore);
        setShowAnswer(true);
    };

    return (
        <div
            onPointerMove={(e) => handlePointerMove(e.clientX)}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className={`min-h-screen bg-[#2f3441] px-[60px] pt-[80px] text-white ${stage.fontClassName}`}
        >
            <div className="flex items-start justify-between">
                <div className="text-2xl">자간맞추기</div>
                <a
                    href={stage.fontUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-2xl underline underline-offset-4"
                >
                    폰트 {stage.fontLabel}
                </a>
            </div>

            <div className="mx-auto mt-[180px] w-[1260px] border-y border-white/60">
                <div className="relative h-[130px] overflow-hidden">
                    {letters.map((letter, i) => (
                        <span
                            key={`measure-${i}`}
                            ref={(el) => setMeasureRef(i, el)}
                            className="pointer-events-none absolute left-0 top-0 invisible text-[96px] leading-none"
                        >
              {letter}
            </span>
                    ))}

                    {showAnswer &&
                        letters.map((letter, i) => (
                            <span
                                key={`answer-${i}`}
                                className="pointer-events-none absolute top-1/2 -translate-y-1/2 text-[96px] leading-none text-sky-400/60"
                                style={{ left: `${answerPositions[i]}px` }}
                            >
                {letter}
              </span>
                        ))}

                    {userPositions.length === letters.length &&
                        letters.map((letter, i) => {
                            const locked = isLockedIndex(i, letters.length);

                            return (
                                <span
                                    key={`user-${i}`}
                                    onPointerDown={(e) => handlePointerDown(i, e.clientX)}
                                    className={`absolute top-1/2 -translate-y-1/2 select-none text-[96px] leading-none text-white ${
                                        locked ? "cursor-default" : "cursor-ew-resize"
                                    }`}
                                    style={{
                                        left: `${userPositions[i]}px`,
                                        touchAction: "none",
                                    }}
                                >
                  {letter}
                </span>
                            );
                        })}
                </div>
            </div>

            <div className="mx-auto mt-[80px] flex w-[1260px] items-start justify-between">
                <div className="text-3xl">점수 {String(score).padStart(3, "0")}</div>

                <div className="flex flex-col items-end gap-6 text-3xl">
                    <button onClick={handleGrade}>채점</button>
                    <button onClick={handleReset}>리셋</button>
                    <button onClick={onNext}>다음</button>
                </div>
            </div>
        </div>
    );
}