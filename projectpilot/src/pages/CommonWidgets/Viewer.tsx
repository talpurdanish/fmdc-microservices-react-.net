
import { useState, useEffect } from 'react';

import { Dialog } from 'primereact/dialog';
import { useGetApi } from '../../BussinessLogic/Hooks/UseGetApi';
import { PdfViewer } from './PdfViewer';



interface ViewerProps {
    id: number;
    visible: boolean;
    hide: () => void;
    title: string;
    serviceFn: (id: number) => Promise<Blob | null>;
    width?: string;
    fullscreen?: boolean
};



export const Viewer = ({ id, visible, hide, title, serviceFn, width = "30%", fullscreen = false }: ViewerProps) => {

    const [path, setPath] = useState<string>("");

    const { data: report, loading, error } = useGetApi<Blob | null, number>(
        (id) => serviceFn(id!),
        { immediate: true, payload: id },
        [id]
    );
    useEffect(() => {
        if (report) {
            const url = URL.createObjectURL(report);
            setPath(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [report]);



    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">{title}</span>
        </div>
    );


    return (
        <>
            <div className="card flex justify-content-center">
                <Dialog visible={visible} modal header={headerElement} maximized={fullscreen} maximizable className={`w-[${width}]`} onHide={() => { hide(); }}>
                    <div style={{ width: "100%", height: "600px" }}>
                        <PdfViewer path={path} loading={loading} error={error} />
                    </div>
                </Dialog>
            </div>

        </>
    )
}
