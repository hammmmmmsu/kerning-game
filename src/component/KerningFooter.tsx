type Props = {
    score: number;
    onGrade: () => void;
    onReset: () => void;
    onNext: () => void;
};

export default function KerningFooter({
                                          score,
                                          onGrade,
                                          onReset,
                                          onNext,
                                      }: Props) {
    return (
        <div className="mx-auto mt-[80px] flex w-[1260px] items-start justify-between">
            <div className="text-3xl leading-none">
                점수 {String(score).padStart(3, "0")}
            </div>

            <div className="flex flex-col items-end gap-6 text-3xl leading-none">
                <button onClick={onGrade} className="hover:opacity-70">
                    채점
                </button>
                <button onClick={onReset} className="hover:opacity-70">
                    리셋
                </button>
                <button onClick={onNext} className="hover:opacity-70">
                    다음
                </button>
            </div>
        </div>
    );
}