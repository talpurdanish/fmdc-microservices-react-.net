import { Layout } from "../../../Layout/main_layout/Layout"
import Breadcrumbs from "../../CommonWidgets/Breadcrumbs";

import { useState, useEffect, useRef, type JSX } from 'react';
import { type TestParameterModel } from "../../../BussinessLogic/Models/TestParameter.Model";

import { TestParameterForm } from "./Form";
import { TestParameterTable } from "./Table";
import type { LoginModel } from "../../../BussinessLogic/Models/Login.Model";
import { useAuth } from "../../../BussinessLogic/Security/Auth.Context";
import { Roles } from "../../../Helpers/Constants";

import { useGetApi } from "../../../BussinessLogic/Hooks/UseGetApi";
import { testsService } from "../../../BussinessLogic/Index.Service";
import type { NameIdPair } from "../../../BussinessLogic/Models/Generics/NameIdPair";


const ManageTestParameters = () => {

    const [user, setUser] = useState<LoginModel | null>(null);
    const [isEdit, setIsEdit] = useState(false);

    const [selectedTestParameter, setSelectedTestParameter] = useState<TestParameterModel | undefined>(undefined);
    const testParameterTableRef = useRef<{ loadData: () => void }>(null);

    const { data: tests } = useGetApi<NameIdPair[]>(
        async () => {
            const models = (await testsService.GetTests(true)).data;
            return models.map((m) => {
                return ({
                    id: m.id,
                    name: m.name
                });
            });
        },
        { immediate: true },
    );

    const { getUser } = useAuth();
    const handleEdit = (testParameter: TestParameterModel) => {
        setIsEdit(true);
        setSelectedTestParameter(testParameter);
    };

    const navItems = [
        { name: "Home", link: "/" },
        { name: "TestParameters", link: undefined },
        { name: "Manage", link: undefined }
    ];
    const title = "Manage TestParameters";

    useEffect(() => {
        setUser(getUser());
        setIsEdit(false);

    }, []);

    return (
        <>
            <Breadcrumbs nav={navItems} title={title} />

            <div className="w-full flex">
                {user?.role == Roles.admin.id && <div className="w-[30%] flex-none p-5 mr-1 dark:bg-[#2a323d]">
                    <TestParameterForm
                        isEdit={isEdit}
                        initialValues={selectedTestParameter!}
                        loadData={() => testParameterTableRef.current?.loadData()}
                        tests={tests!}
                    />

                </div>}
                <div className="flex-1 dark:bg-[#2a323d] px-2 pt-2">
                    <TestParameterTable role={user?.role ?? -1}
                        onEdit={(selectedTestParameter) => handleEdit(selectedTestParameter!)}
                        ref={testParameterTableRef}
                        tests={tests!} />
                </div>
            </div>
        </>
    )
};

ManageTestParameters.getLayout = (page: JSX.Element) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default ManageTestParameters