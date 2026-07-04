import { useEffect, useState } from "react";
import DOMPurify from "dompurify";



export default function HtmlRenderer({ message }: { message: string }) {
    const [htmlString, setHtmlString] = useState<string>("")



    useEffect(() => {


        setHtmlString(message);


    }, []);


    return (

        <div
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(htmlString) }} >
        </div>

    );
};