import { testsService } from "../../BussinessLogic/Index.Service";
import { PlusSquareIcon } from "lucide-react";

import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { showSuccess } from "../../Helpers/Toast.Helper";
import type { TestModel } from "../../BussinessLogic/Models/Test.Model";
import { ListBox } from "primereact/listbox";
import type { NameIdPair } from "../../BussinessLogic/Models/Generics/NameIdPair";

interface createReceiptProps {
    addTests: (id: number) => void;

}

export const AddTests = ({ addTests }: createReceiptProps) => {

    const { data: tests } = useGetApi<NameIdPair[]>(
        async () => {
            const models: TestModel[] = (await testsService.GetTests(true)).data;
            return models.map(p => ({
                id: p.id,
                name: p.name,
            }));
        },

        { immediate: true },
    );

    const callAddTest = (testId: number) => {
        addTests(testId);
        showSuccess("Test has been added");
    }

    const itemTemplate = (option: TestModel) => {
        return (
            <button className="flex w-full cursor-pointer" onClick={() => { callAddTest(option.id) }}>
                <span className="flex-1 text-left">{option.name}</span>
                <PlusSquareIcon className="w-[20px] flex-none justify-end-safe" />
            </button >
        );
    };
    return (
        <>
            <div className="section">
                <div className="section-header">Add Tests</div>
                <div className="flex">
                    <ListBox options={tests!} optionLabel="name"
                        itemTemplate={itemTemplate} className="w-full md:w-14rem" listStyle={{ maxHeight: '400px' }} />
                </div>
            </div>
        </>
    )
}


