import { ListTodoIcon } from 'lucide-react';
import { useState } from "react";
import { TodoTable } from './Table';

const TodoMenu = () => {
    const [open, setOpen] = useState(false);
    return (
        <div className="relative inline-block text-left" onMouseLeave={() => setOpen(false)} onMouseOver={() => setOpen(true)}>
            {/* Main button */}
            <button className="btn btn-gray btn-rounded btn-padding-sm"  >
                <ListTodoIcon className="w-5 text-blue-700 dark:text-blue-300" />
            </button>

            {/* Submenu */}
            <div
                className={`absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-700 
                    rounded-md shadow-lg transform transition-all duration-300 origin-top z-50
                    ${open ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                    }`}
            >
                <TodoTable />
            </div>
        </div>
    );
};

export default TodoMenu;