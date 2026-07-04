import React, { useEffect, useState } from "react";
import { InputTextarea } from "primereact/inputtextarea";

interface TextAreaWithCountProps {
    value?: string;
    onChange: (val: string) => void;
    maxLength: number;
    placeholder?: string;
    label?: string;
}

export const TextAreaWithCount: React.FC<TextAreaWithCountProps> = ({
    value = "",
    onChange,
    maxLength,
    placeholder = "",
    label = "",
}) => {
    const [text, setText] = useState(value);
    useEffect(() => {
        setText(value);
    }, [value])


    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value;
        if (newValue.length <= maxLength) {
            setText(newValue);
            onChange(newValue);
        }
    };

    return (
        <div className="flex flex-col gap-1">
            {label && <label className="font-medium">{label}</label>}
            <InputTextarea
                value={text}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleChange(e)}
                rows={5}
                cols={30}
                placeholder={placeholder}
                className="form-control"
            />
            <div className="text-sm text-gray-500 text-right">
                {text.length}/{maxLength}
            </div>
        </div>
    );
};