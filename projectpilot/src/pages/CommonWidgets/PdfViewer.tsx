import { Loading } from "./Loading";

export const PdfViewer = ({ path, loading, error }: { path?: string, loading: boolean, error?: any }) => {
    if (!path || path.length == 0) {


    }

    return (
        <div style={{ width: "100%", height: "100%" }} className="w-full h-full">
            <Loading isVisible={loading} loadingText="Loading PDF..." />
            {error && <p>Some Error occured in displaying PDF, please try again</p>}
            {path &&
                <embed
                    src={path}
                    type="application/pdf"
                    width="100%"
                    height="100%"
                />
            }
            {(!loading && !error && (!path || path.length == 0)) &&
                <p className="font-bold text-md text-gray-200"> Sorry the pdf could not be rendered!!</p>
            }

        </div>
    );
};