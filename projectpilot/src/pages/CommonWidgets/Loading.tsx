
import scanning from '../../asset/scanning.gif';

interface LoadingProps {
    width?: number;
    height?: number;
    fullScreen?: boolean;
    isVisible: boolean;
    withText?: boolean;
    loadingText?: string;
}

export const Loading = ({
    isVisible,
    width = 150,
    height = 150,
    fullScreen = true,
    withText = true,
    loadingText = "Loading..." }: LoadingProps) => {

    if (!isVisible) return null;

    const loadingDiv = () => {
        return (<div
            className={`flex
                flex-col
                justify-between
                items-center
                bg-white
                shadow-xl
                rounded-lg
                border-gray-400
                z-1
                w-[${width}px] 
                h-[${height}px]`}>
            <div className="flex-1 min-h-0">
                <img src={scanning} alt="FMDC" className="w-full h-full object-cover" />
            </div>
            {withText && (
                <div className="flex-none w-full text-center mt-2 animate-bounce text-base font-semibold text-black">
                    {loadingText}
                </div>
            )}
        </div>);
    }

    return (

        fullScreen ?
            <div className="min-h-screen bg-black/50  w-full h-full flex items-center justify-center absolute top-0 left-0">
                {/* Crosshatch Art - Light Pattern */}
                <div
                    className="absolute inset-0 z-0 pointer-events-none"
                    style={{
                        backgroundImage: `
        repeating-linear-gradient(22.5deg, transparent, transparent 2px, rgba(75, 85, 99, 0.06) 2px, rgba(75, 85, 99, 0.06) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(67.5deg, transparent, transparent 2px, rgba(107, 114, 128, 0.05) 2px, rgba(107, 114, 128, 0.05) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(112.5deg, transparent, transparent 2px, rgba(55, 65, 81, 0.04) 2px, rgba(55, 65, 81, 0.04) 3px, transparent 3px, transparent 8px),
        repeating-linear-gradient(157.5deg, transparent, transparent 2px, rgba(31, 41, 55, 0.03) 2px, rgba(31, 41, 55, 0.03) 3px, transparent 3px, transparent 8px)
      `,
                    }}
                />
                {loadingDiv()}
            </div>

            // <div className="w-full h-full flex items-center justify-center absolute top-0 left-0 bg-black/40">

            // </div>
            :
            loadingDiv()
    );
}