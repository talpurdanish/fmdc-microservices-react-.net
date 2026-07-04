// import { DataTable } from "primereact/datatable";
// import { Column } from "primereact/column";
import Logo from '../../asset/fmdclogo.png'
import Rx from '../../asset/rx.png'
import type { PrescriptionModel } from '../../BussinessLogic/Models/Prescription.Model';
import { Trash2Icon } from "lucide-react";
import { calculateAgeString } from '../../Helpers/Constants';


type Props = {
    prescription?: PrescriptionModel;
    deleteMedicine: (index: number) => void;
    deleteTest: (index: number) => void;
};

export const PrescriptionDisplay = ({ prescription, deleteMedicine, deleteTest }: Props) => {
    return (
        <>

            <div className="mx-auto shadow-md rounded-lg p-2 text-black bg-white">
                <div className='flex flex-row auto-rows-min'>
                    <div className=" w-20 h-20 text-center align-middle">
                        <img
                            src={Logo}
                            alt="Federal Medical and Dental Clinic"
                            className=" ml-auto mr-auto mt-1 object-fit h-full"
                        />
                    </div>
                    <div className='flex-1'>
                        <h2 className="text-3xl font-bold text-center mb-2">
                            Federal Medical and Dental Center
                        </h2>
                        <div className='flex-1 flex'>
                            <p className="text-left flex-1 pl-2">123 Main Street, I-14/1, Main Road</p>
                            <p className="text-right justify-end"><span className='font-bold'>Phone:</span> (051)4447654</p>
                        </div>
                    </div>
                </div>
                <div className="w-full p-2 flex items-center justify-center">
                    <div className="border rounded-sm text-center w-50 h-8 flex items-center justify-center">
                        PRESCRIPTION
                    </div>
                </div>

                <div className="mt-2 grid grid-cols-7 grid-flow-row auto-rows-max border-t-2 border-b-2 col-span-5 p-2 border-gray-700 dark:border-gray-400 ">

                    <p className='border border-r-0 border-b-0 p-1 col-span-3 border-gray-500 dark:border-gray-600'><strong>Patient's Name & Number:</strong> </p>
                    <p className='col-span-4 border border-b-0 p-1 border-gray-500 dark:border-gray-600'>{prescription?.PatientName} ({prescription?.PatientNumber})</p>

                    <p className='border border-r-0 border-b-0 p-1 col-span-3 border-gray-500 dark:border-gray-600'><strong>Father's/Husband's Name:</strong></p>
                    <p className='border border-b-0 col-span-4 p-1 border-gray-500 dark:border-gray-600'>{prescription?.FatherName}</p>

                    <p className='border border-r-0 border-b-0 p-1 border-gray-500 dark:border-gray-600'><strong>Gender:</strong></p>
                    <p className='border border-r-0 border-b-0 col-span-2 p-1 border-gray-500 dark:border-gray-600'>{prescription?.Gender}</p>

                    <p className='border border-r-0 border-b-0 p-1 border-gray-500 dark:border-gray-600'><strong>Age:</strong></p>
                    <p className='border border-b-0 col-span-3 p-1 border-gray-500 dark:border-gray-600'>{prescription?.DateOfBirth && calculateAgeString(prescription?.DateOfBirth)}</p>

                    <p className='border border-r-0 p-1 border-gray-500 dark:border-gray-600'><strong>Date:</strong> </p>
                    <p className='border col-span-6 p-1 border-gray-500 dark:border-gray-600'>{prescription?.Date}</p>

                </div>

                <div className='grid grid-cols-[35%_65%] min-h-[600px]'>
                    <div className='border-r-2 border-gray-700 dark:border-gray-400 p-2'>
                        <h2 className='font-bold underline'>Vitals:</h2>
                        <div className='grid grid-cols-[25%_40%_25%_10%] my-4'>

                            <span className='vitals-label'>BP:</span>
                            <span className='vitals-detail'>{prescription?.Bp == "" ? "-" : prescription?.Bp} </span>
                            <span className='vitals-unit'>mm/hg</span>
                            <span></span>

                            <span className='vitals-label'>Pulse:</span>
                            <span className='vitals-detail'>{prescription?.Pulse} </span>
                            <span className='vitals-unit'></span>
                            <span></span>

                            <span className='vitals-label'>Bsr:</span>
                            <span className='vitals-detail'>{prescription?.Bsr.toFixed(2)}  </span>
                            <span className='vitals-unit'>mg/dl</span>
                            <span></span>

                            <span className='vitals-label'>Temp:</span>
                            <span className='vitals-detail'>{prescription?.Temp.toFixed(2)}</span>
                            <span className='vitals-unit'>°C</span>
                            <span></span>

                            <span className='vitals-label'>Wt:</span>
                            <span className='vitals-detail'>{prescription?.Wt.toFixed(2)}</span>
                            <span className='vitals-unit'>kg</span>
                            <span></span>

                            <span className='vitals-label'>Ht:</span>
                            <span className='vitals-detail'>{prescription?.Ht.toFixed(2)}  </span>
                            <span className='vitals-unit'>m</span>
                            <span></span>
                        </div>

                        <h2 className='font-bold underline'>Lab Tests Advised:</h2>
                        <div className='grid'>
                            {prescription?.TestNames && prescription?.TestNames.length > 0 && prescription?.TestNames.map((test, idx) => {

                                return (
                                    <div className='flex py-2'>
                                        <span className='pr-2'>{(idx + 1)}.</span>
                                        <span className='flex-1'>{test}</span>
                                        <button
                                            className="w-[30px] text-red-500"
                                            onClick={() => deleteTest(idx)}>
                                            <Trash2Icon />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <div className='p-2'>
                        <img className='w-[20px] h-[20px] opacity-80 m-5' src={Rx} />
                        <div className="grid grid-rows-[repeat(auto-fill,35px)] min-h-80 content-start">
                            {prescription?.MedicineStrings && prescription?.MedicineStrings.length > 0 &&
                                prescription?.MedicineStrings.map((med, idx) => {

                                    return (
                                        <>
                                            <div
                                                key={idx}
                                                className="flex h-[35px] items-center">
                                                <span className="mr-2 w-5">{idx + 1} .</span>
                                                <span className="flex-1">{med}</span>
                                                <button
                                                    className="w-[50px] text-red-500"
                                                    onClick={() => deleteMedicine(idx)}>
                                                    <Trash2Icon />
                                                </button>
                                            </div>
                                        </>
                                    );
                                })}
                        </div>

                        <div className='justify-end'>
                            <h2 className='font-bold underline'>Diagnosis:</h2>
                            <div className='min-h-40 h-40 italic pt-3 text-justify'>{prescription?.Diagnosis}</div>
                        </div>

                        <div className='justify-end'>
                            <h2 className='font-bold underline'>Clinical Remarks:</h2>
                            <div className='min-h-40 italic pt-3  text-justify'>{prescription?.Remarks}</div>
                        </div>
                    </div>
                </div>

                <div className="border-t-2 border-gray-700 dark:border-gray-400 text-sm text-center content-center p-2">
                    This is computer generated prescription and do not need a signature. Not admissable in court.
                </div>
            </div>
        </>
    );
};