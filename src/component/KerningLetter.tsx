type Props = {
    letter: string;
    left: number;
    locked: boolean;
    colorClassName: string;
    onPointerDown?: (clientX: number) => void;
    spanRef?: (el: HTMLSpanElement | null) => void;
};

export default function KerningLetter({
                                          letter,
                                          left,
                                          locked,
                                          colorClassName,
                                          onPointerDown,
                                          spanRef,
                                      }: Props) {
    return (
        <span
            ref={spanRef}
            onPointerDown={(e) => onPointerDown?.(e.clientX)}
            className={`absolute top-1/2 select-none text-[96px] leading-none ${colorClassName} ${
                locked ? "cursor-default" : "cursor-ew-resize"
            }`}
            style={{
                left: `${left}px`,
                transform: "translateY(-50%)",
                touchAction: "none",
            }}
        >
      {letter}
    </span>
    );
}