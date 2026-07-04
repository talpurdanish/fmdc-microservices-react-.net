
import type { JSX } from "react";
import { Layout } from "./main_layout/Layout";
const UnAuthorized = () => {

    return (
        <>
            <div className="flex items-center justify-center h-full bg-gray-100 text-center dark:bg-gray-900">
                <div className="flex w-[40%] h-[40%] rounded-xl items-center justify-center border dark:border-gray-600 shadow-xl border-black ">
                    <div>
                        <h1 className="w-full text-4xl font-bold text-red-600 mb-4">403 - Unauthorized</h1>
                        <p className="w-full text-lg text-gray-700 dark:text-gray-400 mb-6">
                            You do not have permission to view this page.
                        </p>
                    </div>
                </div>
            </div>

        </>
    )
};

UnAuthorized.getLayout = (page: JSX.Element) => {
    return (
        <Layout>{page}</Layout>
    )
}
export default UnAuthorized 