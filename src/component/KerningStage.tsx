import KerningLetter from "./KerningLetter";

type Props = {
    letters: string[];
    userPositions: number[];
    answerPositions: number[];
    showAnswer: boolean;
    isLocked: (index: number) => boolean;
    onPointerDown: (index: number, clientX: number) => void;
    setLetterRef: (index: number, el: HTMLSpanElement | null) => void;
};

export default function KerningStage({
                                         letters,
                                         userPositions,
                                         answerPositions,
                                         showAnswer,
                                         isLocked,
                                         onPointerDown,
                                         setLetterRef,
                                     }: Props) {
    return (
        <div className="mx-auto mt-[180px] w-[1260px] border-y border-white/60">
            <div className="relative h-[130px] overflow-hidden">
                {letters.map((letter, i) => (
                    <KerningLetter
                        key={`answer-${i}`}
                        letter={letter}
                        left={answerPositions[i]}
                        locked
                        colorClassName={`pointer-events-none text-primary-300 transition-opacity ${
                            showAnswer ? "opacity-100" : "opacity-0"
                        }`}
                    />
                ))}

                {letters.map((letter, i) => (
                    <KerningLetter
                        key={`user-${i}`}
                        letter={letter}
                        left={userPositions[i]}
                        locked={isLocked(i)}
                        colorClassName="text-white"
                        spanRef={(el) => setLetterRef(i, el)}
                        onPointerDown={(clientX) => onPointerDown(i, clientX)}
                    />
                ))}
            </div>
        </div>
    );
}