import { proceduresService } from "../../BussinessLogic/Index.Service";
import { PlusSquareIcon } from "lucide-react";

import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { type ProcedureModel } from "../../BussinessLogic/Models/Procedure.Model";
import { showSuccess } from "../../Helpers/Toast.Helper";
import { ListBox } from "primereact/listbox";
import type { NameIdPair } from "../../BussinessLogic/Models/Generics/NameIdPair";

interface createReceiptProps {
    addProcedures: (id: number) => void;
}

export const AddProcedures = ({ addProcedures }: createReceiptProps) => {

    const { data: procedures } = useGetApi<NameIdPair[]>(
        async () => {
            const models: ProcedureModel[] = (await proceduresService.GetProcedures(true)).data;
            return models.map(p => ({
                id: p.id,
                name: p.name,
            }));
        },

        { immediate: true },
    );


    const callAddProcedures = (procedureId: number) => {
        addProcedures(procedureId);
        showSuccess("Procedure has been added");
    };


    const itemTemplate = (option: ProcedureModel) => {
        return (
            <button className="flex w-full cursor-pointer" onClick={() => { callAddProcedures(option.id) }}>
                <span className="flex-1 text-left">{option.name}</span>
                <PlusSquareIcon className="w-[20px] flex-none justify-end-safe" />
            </button >
        );
    };
    return (
        <>
            <div className="section">
                <div className="section-header">Add Procedures</div>
                <div className="flex">
                    <ListBox options={procedures!} optionLabel="name"
                        itemTemplate={itemTemplate} className="w-full md:w-14rem" listStyle={{ maxHeight: '400px' }} />
                </div>
            </div>
        </>
    )
}

