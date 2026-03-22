import { useState } from "react";
import { stages } from "./data/stages";
import KerningGame from "./component/KerningGame";

export default function App() {
    const [stageIndex, setStageIndex] = useState(0);

    const handleNext = () => {
        setStageIndex((prev) => (prev + 1) % stages.length);
    };

    return (
        <KerningGame
            key={stages[stageIndex].id}
            stage={stages[stageIndex]}
            onNext={handleNext}
        />
    );
}