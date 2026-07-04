import React, { useState, useEffect } from "react";
import { UploadCloudIcon, User } from "lucide-react";
import { InputText } from "primereact/inputtext";

interface FileUploadWidgetProps {
    imageSource: string; // external image source (base64 or URL)
    onFileSelect: (fileString: string | null) => void;
    reset?: boolean;
}

export default function FileUploadWidget({ imageSource, onFileSelect, reset = false }: FileUploadWidgetProps) {
    const [fileName, setFileName] = useState<string>("");
    const [preview, setPreview] = useState<string | null>(null);

    // Sync external imageSource with preview
    useEffect(() => {
        if (imageSource) {
            imageSource = (!imageSource.startsWith("data:image") ? "data:image/png;base64," : "") + imageSource;
        }
        setPreview(imageSource);

    }, [imageSource]);

    useEffect(() => {
        if (reset)
            handleReset();
    }, [reset])


    const handleReset = () => {
        setPreview("");
        setFileName("");
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        // Validate type
        const validTypes = ["image/png", "image/jpeg"];
        if (!validTypes.includes(selectedFile.type)) {
            alert("Only PNG or JPG images are allowed.");
            return;
        }

        // Validate size (max 1MB)
        if (selectedFile.size > 1024 * 1024) {
            alert("File size must be less than 1MB.");
            return;
        }

        setFileName(selectedFile.name);
        setPreview(URL.createObjectURL(selectedFile));

        // Convert to base64 string
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = (reader.result as string).split(",")[1]; // only base64 part
            onFileSelect(base64String);
        };

        reader.readAsDataURL(selectedFile);
    };

    return (
        <div className="w-full">
            <div className="w-full h-[180px] flex items-center justify-center border rounded
             bg-gray-100 dark:bg-gray-800 overflow-hidden dark:border-gray-500 border-gray-900">
                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-full object-fit"
                    />
                ) : (
                    <User className="w-16 h-16 text-gray-400" />
                )}
            </div>
            <input
                type="file"
                accept="image/png,image/jpeg"
                id="fileInput"
                className="hidden"
                onChange={handleFileChange}
            />
            <div className="flex items-center m-0 p-0">
                <InputText
                    type="text"
                    readOnly
                    value={fileName}
                    placeholder="No file selected"
                    className="flex-1 form-control"
                />
                <label
                    htmlFor="fileInput"
                    className="btn btn-info btn-rounded btn-padding-md">
                    <UploadCloudIcon />
                </label>
            </div>
        </div>
    );
}