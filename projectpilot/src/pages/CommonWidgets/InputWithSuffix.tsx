
import { type ReactNode } from "react";

interface Props {
    children: ReactNode;
    unit?: string;
}

export const InputWithSuffix: React.FC<Props> = ({ children, unit = "" }) => {

    return (
        <div className="addvitals-input p-inputgroup">
            {children}
            <span className="unit">{unit}</span>
        </div>
    );
};