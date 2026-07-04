// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
import Logo from '../../asset/fmdclogo.png'
import type { ReceiptModel } from "../../BussinessLogic/Models/Receipt.Model";
import { TrashIcon } from "lucide-react";


type Props = {
    receipt: ReceiptModel;
    deleteDetail: (id: number, type: number) => void;
    type: number;
};

export const RecieptDisplay = ({ receipt: receipt, deleteDetail, type }: Props) => {
    return (
        <>

            <div className="mx-auto shadow-md rounded-md p-4 bg-white text-black">
                <div className='flex flex-row'>
                    <div className=" w-20 h-20 text-center align-middle mr-5">
                        <img
                            src={Logo}
                            alt="Federal Medical and Dental Clinic"
                            className=" ml-auto mr-auto mt-2 object-fit h-full"
                        />
                    </div>
                    <div className='flex-1'>
                        <h2 className="text-3xl font-bold text-center mb-3">
                            Federal Medical and Dental Center
                        </h2>
                        <div className='flex flex-row'>
                            <p className="flex-1 text-left">123 Main Street, I-14/1, Main Road</p>
                            <p className="text-right">Phone: (051)4447654</p></div>
                    </div>
                </div>
                <div className="w-full p-2 flex items-center justify-center">
                    <div className="border rounded-sm text-center w-20 h-8 flex items-center justify-center">
                        RECEIPT
                    </div>
                </div>

                <div className="mt-2 grid grid-cols-6 grid-flow-row auto-rows-max ">
                    <p className='border border-r-0 p-1 border-gray-500 dark:border-gray-600'><strong>Receipt No:</strong></p>
                    <p className='col-span-5 border p-1 border-gray-500 dark:border-gray-600'> {receipt?.ReceiptNumber}</p>

                    <p className='border-l border-b p-1 border-gray-500 dark:border-gray-600'><strong>Patient:</strong> </p>
                    <p className='col-span-2 border border-t-0 p-1 border-gray-500 dark:border-gray-600'>{receipt?.PatientName} ({receipt?.PatientNumber})</p>

                    <p className='border-r border-b p-1 border-gray-500 dark:border-gray-600'><strong>Doctor:</strong></p>
                    <p className='border-b border-r  col-span-2 p-1 border-gray-500 dark:border-gray-600'> {receipt?.Doctor}</p>

                    <p className='border-l border-b p-1 border-gray-500 dark:border-gray-600'><strong>Date:</strong> </p>
                    <p className='border border-t-0 col-span-2 p-1 border-gray-500 dark:border-gray-600'>{receipt?.Date.split('T')[0]}</p>

                    <p className='border-r border-b p-1 border-gray-500 dark:border-gray-600'><strong>Time:</strong></p>
                    <p className='border-b border-r col-span-2  p-1 border-gray-500 dark:border-gray-600'> {receipt?.Date.split('T')[1]}</p>
                </div>

                <table className="w-full mt-2 border-collapse border border-gray-500 dark:border-gray-600">
                    <thead>
                        <tr>
                            <th className="border p-1 w-[10%]">#</th>
                            <th className="border p-1 w-[60%]">Detail</th>
                            <th className="border p-1 w-[20%]">Cost</th>
                            <th className="border p-1 w-[10%]">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(receipt?.Procedures != undefined && receipt?.Procedures.length === 0
                            && receipt?.Tests != undefined && receipt?.Tests.length === 0) && (
                                <tr>
                                    <td className="border p-1 text-center" colSpan={4}>
                                        Add some procedures or tests
                                    </td>
                                </tr>
                            )}

                        {(receipt?.Procedures != undefined && receipt?.Procedures.length > 0
                            || receipt?.Tests != undefined && receipt?.Tests.length > 0) && (
                                <>
                                    {[...receipt?.Procedures ?? [], ...receipt?.Tests ?? []].map((item, index) => (
                                        <tr key={item.id}>
                                            <td className="border p-1 text-center">{index + 1}</td>
                                            <td className="border p-1">{item.name}</td>
                                            <td className="border p-1">PKR {item.cost.toFixed(2)}</td>
                                            <td className="border p-1">
                                                <button
                                                    className="btn btn-danger btn-padding-sm btn-rounded"
                                                    onClick={() => deleteDetail(item.id, type)}
                                                >
                                                    <TrashIcon className="w-3 mx-auto" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </>
                            )}
                    </tbody>
                </table>

                <div className="mt-2 grid grid-cols-6 grid-flow-row auto-rows-max ">
                    <div className='col-span-4 border p-1 border-gray-500 dark:border-gray-600  grid'>
                        {receipt?.AuthorizedBy && <p><strong>Authorized By:</strong> {receipt?.AuthorizedBy}</p>}
                    </div>
                    <div className='col-span-2 grid grid-flow-row grid-cols-2'>
                        <p className='border-t border-r p-1 border-gray-500 dark:border-gray-600'><strong>Total:</strong> </p>
                        <p className='border-t border-r p-1 border-gray-500 dark:border-gray-600'>PKR {receipt?.Total.toFixed(2)}</p>

                        <p className='border-t border-b border-r p-1 border-gray-500 dark:border-gray-600'><strong>Discount:</strong></p>
                        <p className='border-t border-b border-r p-1 border-gray-500 dark:border-gray-600'> {receipt?.Discount}%</p>

                        <p className='border-r border-b p-1 border-gray-500 dark:border-gray-600'><strong>Grand Total:</strong> </p>
                        <p className='border-r border-b p-1 border-gray-500 dark:border-gray-600'>PKR {receipt?.GrandTotal.toFixed(2)}</p>
                    </div>
                </div>
            </div>
        </>
    );
};