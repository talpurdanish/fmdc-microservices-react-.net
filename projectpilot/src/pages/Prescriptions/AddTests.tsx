import { PlusIcon, RotateCcwIcon } from "lucide-react";

import { useState } from "react";
import { testsService } from "../../BussinessLogic/Index.Service";

import { FormErrors } from "../CommonWidgets/FormErrors";

import { useGetApi } from "../../BussinessLogic/Hooks/UseGetApi";
import { showSuccess } from "../../Helpers/Toast.Helper";
import type { NameIdPair } from "../../BussinessLogic/Models/Generics/NameIdPair";
import type { TestModel } from "../../BussinessLogic/Models/Test.Model";

interface Props {
    addTests: (
        tests: number[], testNames: string[]
    ) => void;
}

export const TestsForm = ({ addTests }: Props) => {
    const [errors, setErrors] = useState<any>({});
    const [selectedTests, setSelectedTests] = useState<number[]>([]);
    const [selectedTestNames, setSelectedTestNames] = useState<string[]>([]);

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


    const addTestCall = () => {

        if (validate()) {
            addTests(selectedTests, selectedTestNames);
            handleReset();
            showSuccess("Tests have been added");
        }
    };


    const onTestClick = (id: number, name: string) => {

        setSelectedTests((prev: number[]) => {
            return prev.includes(id) ?
                prev.filter(o => o !== id) : [...prev, id];
        });

        setSelectedTestNames((prev: string[]) => {
            return prev.length == 0 ? [name] : prev.includes(name) ?
                prev.filter(o => o !== name) : [...prev, name];
        });
    }

    const isChecked = (id: number): boolean => {
        return selectedTests.includes(id);
    }


    const validate = (): boolean => {
        if (selectedTests.length == 0 || selectedTests == undefined) {
            const newErrors: any = {};
            newErrors.tests = { message: "Select atleast 1 test" };
            setErrors(newErrors);
            return false;
        }

        return true;
    }


    const handleReset = () => {
        setErrors({});
        setSelectedTests([]);
    };



    return (


        <div className="section">
            <h2 className="section-header">Add Tests</h2>
            <label className="form-label">Select Test(s):</label>

            <ul className="p-2 border dark:border-gray-400 border-gray-950 mb-4 m-h-64 overflow-y-auto scrollbars-hide">
                {tests && tests.map((test) => {
                    return (
                        <li key={test.id} onClick={() => onTestClick(test.id, test.name)} className={`mb-1 select-none cursor-pointer p-0 text-sm ${isChecked(test.id) ? "bg-blue-400 dark:bg-blue-300 text-black" : "bg-transparent"}`}>
                            <div className="flex align-items-center">
                                <input type="checkbox" readOnly={true} checked={selectedTests.some(o => o == test.id)} className="mx-2" />
                                <span className="text-sm">{test.name} </span>
                            </div>
                        </li>
                    )
                })}
            </ul>

            {selectedTestNames.length > 0 && <label className="form-label mt-3">Selected Test(s):</label>}
            {selectedTestNames.length > 0 && <ul className="p-2">{selectedTestNames.map((test, idx) => {
                return (
                    <li key={idx} className="p-0 text-sm">{idx + 1}. {test}</li>
                )
            })}</ul>}
            <FormErrors errors={errors} />
            <div className="flex mr-auto ml-auto justify-center items-center gap-1  mt-2">
                <button
                    type="button"
                    className="btn btn-success btn-rounded btn-padding-md" onClick={() => addTestCall()}>
                    <PlusIcon className="w-[25px]" />
                    <span className="w-[85%]">Add</span>
                </button>
                <button
                    type="button" onClick={() => handleReset()}
                    className="btn btn-danger m-1 btn-rounded btn-padding-md">
                    <RotateCcwIcon />
                </button>
            </div>
        </div>
    );
};


