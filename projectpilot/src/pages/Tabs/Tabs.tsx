import React, { useState } from "react";

export const Tabs = ({ children }: any) => {
    const [activeIndex, setActiveIndex] = useState(0);

    // Render headers
    const headers = React.Children.map(children, (child, index) => {
        const { header } = child.props;
        return (
            <button
                onClick={() => setActiveIndex(index)}
                className={`px-4 py-2 -mb-px border-b-2 ${activeIndex === index
                    ? " bg-blue-500 border-blue-500 text-white"
                    : "bg-transparent border-transparent text-gray-500"
                    }`}
            >
                {header}
            </button>
        );
    });

    // Render active content
    const activeContent = React.Children.toArray(children)[activeIndex];

    return (
        <div>
            <div className="flex border-b transition-colors">{headers}</div>
            <div className="p-4">{activeContent}</div>
        </div>
    );
};