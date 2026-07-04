import { PlusIcon, MinusIcon, RefreshCcwIcon } from "lucide-react";
import React, { useEffect, useState, type CSSProperties, type ReactNode } from "react";


interface PanelProps {
    children: ReactNode;
    disabled?: boolean;
    title: string;
    icon: any;

    alertMessage?: string;

    refresh?: () => void;
    fullToggle?: boolean;
}

export const Panel: React.FC<PanelProps> = ({
    children,
    disabled = false,
    title,
    icon,
    alertMessage = "",
    refresh,
    fullToggle = true
}) => {
    const [visible, setVisible] = useState<boolean>(false);

    const toggle = () => {
        const v = !visible && !disabled;
        setVisible(v);
    };

    useEffect(() => {
        setVisible(!disabled);
    }, [disabled])

    const getBlinkStyle = (disabled: boolean, blinkStyle: string = "blink"): CSSProperties => {
        {
            return !disabled ? {
                animationName: blinkStyle,
                animationDuration: "1s",
                animationIterationCount: "infinite",
            } : {}
        }
    }

    const titleBody = () => {
        return (
            <>
                <span className="flex-2">{title}</span>
                {!disabled && alertMessage != "" &&
                    <span className="px-2 flex-1 justify-end text-right">{`(${alertMessage})`}</span>}
            </>
        );
    }

    const fullHeaderToggle = () => {
        return (<a className={`rounded-tr-md 
            rounded-tl-md
            cursor-pointer  
            p-2
            flex
            transition-all duration-600 ease-in-out
            ${!disabled ?
                "animate-[blink_1s_infinite] dark:bg-blue-700 bg-blue-400 dark:hover:bg-blue-800 hover:bg-blue-600 border-b dark:border-blue-600 border-blue-600" :
                "bg-gray-400  border-gray-600"} 
            ${visible ? "" : "rounded-bl-md rounded-br-md"}`}
            style={getBlinkStyle(disabled)} onClick={() => toggle()}>
            {icon}
            <h2 className="flex font-bold flex-1 select-none px-2">
                {titleBody()}
            </h2>
            {/* {!visible ? <PlusIcon className="ml-auto w-5 mr-1" /> : <MinusIcon className="ml-auto w-5 mr-1" />} */}
        </a>);

    };
    const buttonToggle = () => {

        return (<div className={`
            rounded-tr-md
            rounded-tl-md
            cursor-pointer
            p-2
            flex
             transition-all duration-600 ease-in-out
             max-h-10
            ${!disabled ?
                "animate-[blink_1s_infinite] dark:bg-blue-700 bg-blue-400 dark:hover:bg-blue-800 hover:bg-blue-600 border-b dark:border-blue-600 border-blue-600" :
                "bg-gray-400  border-gray-600"} 
            ${visible ? "" : "rounded-bl-md rounded-br-md"}`}
            style={getBlinkStyle(disabled)}>
            <a onClick={() => toggle()} className="flex flex-1 px-1">
                {icon}
                <h2 className={`font-bold flex-1 select-none px-2 transition-all duration-1000 ease-linear overflow-hidden flex`}>
                    {titleBody()}
                </h2>

                {!visible ? <PlusIcon className="ml-auto w-5 mr-1" /> : <MinusIcon className="ml-auto w-5 mr-1" />}
            </a>
            {refresh && <a className="px-2" onClick={() => refresh()}><RefreshCcwIcon className="ml-auto w-5 mr-1" /></a>}
        </div>);
    };


    return (
        <>
            <div>
                {fullToggle ? fullHeaderToggle() : buttonToggle()}
                <div className={`${!disabled ? "" : "opacity-50"} border-gray-600 transition-all duration-600 ease-in-out  relative overflow-hidden ${visible ? "max-h-full p-2 rounded-br rounded-bl border border-t-0 dark:bg-[#2a323d] " : 'max-h-0 h-0'}`}>
                    <div className={`${disabled ? "opacity-50" : ''}`}>{children}</div>
                    {disabled && <div className="left-0 top-0 bg-transparent absolute rounded z-100 w-full h-full"></div>}
                </div>
            </div>
        </>
    );
};