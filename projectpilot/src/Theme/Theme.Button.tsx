
import { MoonIcon, StarIcon, SunIcon } from 'lucide-react';
import { useTheme } from '../Theme/Theme.Context';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    const allDivClassName = "p-2 flex-1 items-center";
    const rightBorderClassName = "border-r border-gray-300 dark:border-gray-600"
    const selectedClassName = (t: string) => `${theme == t ? "bg-blue-500 hover:bg-blue-700 text-white" : " hover:dark:bg-gray-600 hover:bg-gray-300"}`;


    return (
        <div className='w-full flex gap-0'>
            <a onClick={() => toggleTheme("dark")} className={`${allDivClassName} ${selectedClassName("dark")} ${rightBorderClassName}`}>
                <MoonIcon className='w-10' />
            </a>
            <a onClick={() => toggleTheme("light")} className={`${allDivClassName} ${selectedClassName("light")} ${rightBorderClassName}`}>
                <SunIcon className='w-10' />
            </a>
            <a onClick={() => toggleTheme("system")} className={`${allDivClassName} ${selectedClassName("system")}`}>
                <StarIcon className='w-10' />
            </a>
        </div>
    );
}


