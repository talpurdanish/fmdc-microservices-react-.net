import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Dialog } from "primereact/dialog";


interface ImageWidgetProps {
    imageSource: string;
    width: string;
    height: string;

}

export default function Image({ imageSource, width, height }: ImageWidgetProps) {

    const [preview, setPreview] = useState<string | null>(null);
    const [visible, setVisible] = useState<boolean>(false);

    useEffect(() => {
        if (imageSource) {
            imageSource = (!imageSource.startsWith("data:image") ? "data:image/png;base64," : "") + imageSource;
        }
        setPreview(imageSource);

    }, [imageSource]);

    return (
        <>
            {preview ? (
                <img
                    src={preview}
                    alt="Preview"
                    className={`w-[${width}] h-[${height}] object-fit curcor-pointer`} onClick={() => setVisible(true)}
                />
            ) : (
                <User className="w-16 h-16 text-gray-400" />
            )}


            <Dialog visible={visible} modal className="w-[30%]" header="Image Preview" onHide={() => setVisible(false)}>
                <div className='flex' >

                    <img
                        src={preview!}
                        alt="Preview"
                        className={`w-full h-full object-fit`}
                    />
                </div>

            </Dialog></>


    );
}