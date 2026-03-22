type Props = {
    fontLabel: string;
    fontUrl: string;
};

export default function KerningHeader({ fontLabel, fontUrl }: Props) {
    return (
        <div className="flex items-start justify-between">
            <div className="text-2xl text-wh">ㅈ ㅏ ㄱ ㅏ ㄴ ㅁ ㅏ ㅈ ㅊ ㅜ ㄱ ㅣ</div>

            <a
                href={fontUrl}
                target="_blank"
                rel="noreferrer"
                className="text-2xl text-wh underline underline-offset-4"
            >
                폰트 {fontLabel}
            </a>
        </div>
    );
}