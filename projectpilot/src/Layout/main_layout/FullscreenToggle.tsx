import { ExpandIcon, ShrinkIcon } from "lucide-react";
import { useState } from "react";

function FullscreenToggle() {
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            // Enter fullscreen
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            // Exit fullscreen
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <a onClick={() => toggleFullscreen()} className="flex gap-2 content-center align-middle">
            {isFullscreen ? <ShrinkIcon className="w-5" /> : <ExpandIcon className="w-5" />} <span className="flex-1">Fullscreen</span>
        </a>
    );
}

export default FullscreenToggle;