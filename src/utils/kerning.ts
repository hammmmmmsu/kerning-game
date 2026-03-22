export const clamp = (value: number, min: number, max: number) =>
    Math.max(min, Math.min(max, value));

export const isLockedIndex = (index: number, length: number) =>
    index === 0 || index === length - 1;

export const buildPositions = ({
                                   startX,
                                   widths,
                                   gaps,
                               }: {
    startX: number;
    widths: number[];
    gaps: number[];
}) => {
    const positions: number[] = [startX];

    for (let i = 1; i < widths.length; i += 1) {
        positions[i] = positions[i - 1] + widths[i - 1] + gaps[i - 1];
    }

    return positions;
};