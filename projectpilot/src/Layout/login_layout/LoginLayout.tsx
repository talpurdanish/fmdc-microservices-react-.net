import { useEffect, useState, type ReactNode } from "react";
import one from '../../asset/loginbg/1.jpg';
import two from '../../asset/loginbg/2.jpg';
import three from '../../asset/loginbg/3.jpg';
import four from '../../asset/loginbg/4.jpg';
import five from '../../asset/loginbg/5.jpg';
import six from '../../asset/loginbg/6.jpg';
import seven from '../../asset/loginbg/7.jpg';

interface LoginLayoutProps {
    children: ReactNode;
}


export const LoginLayout: React.FC<LoginLayoutProps> = ({ children }) => {
    const [index, setIndex] = useState(0);
    const images = [one, two, three, four, five, six, seven];

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex(() => Math.floor(Math.random() * images.length));

        }, 1000);
        return (() => clearInterval(interval));

    })

    return (
        <div className="relative h-screen w-screen overflow-hidden bg-gray-900" id="maindDiv">
            <div className="absolute inset-0">
                {images.map((src, i) => (
                    <img
                        key={i}
                        src={src}
                        alt="Federal Medical and Dental Clinic"
                        className={`absolute inset-0 w-full h-full object-fit transition-all duration-1000 ease-in-out ${i === index ? "opacity-100" : "opacity-0"
                            }`}
                    />
                ))}
            </div>
            {children}
        </div>
    );
};