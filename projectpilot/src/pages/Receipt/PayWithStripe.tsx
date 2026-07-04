import { useEffect, useState } from 'react';
import { paymentsService } from "../../BussinessLogic/Index.Service";

import { Dialog } from 'primereact/dialog';
import { useMutationApi } from '../../BussinessLogic/Hooks/UseMutationsApi';

import { CheckoutPage } from './Checkout';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import type { PaymentIntentModel } from '../../BussinessLogic/Models/PaymentIntent.Model';


interface PayWithStripeProps {
    id: number;
    visible: boolean;
    hide: () => void;
    name?: string;
    phone?: string;
};

const stripePromise = loadStripe("pk_test_51SnLDMJzs9bkALGj4YmlJAkBDwWZ8h0h7Fj3CV04ne4n21sgbJ7bdKIJuhqyzOvVHwEK3VAjA8bUL4h051GSraYK00CvIyUoXq");

export const PayWithStripe = ({ id, visible, hide, name, phone }: PayWithStripeProps) => {

    const [clientSecret, setClientSecret] = useState("");

    const { mutate: createPaymentIntent } = useMutationApi<PaymentIntentModel | null, number>((id) => paymentsService.CreatePaymentIntent(id!));


    useEffect(() => {
        pay(id);
    }, []);


    const pay = async (id: number) => {
        const result = await createPaymentIntent(id);
        setClientSecret(result!.clientSecret);
    };


    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Pay With Stripe</span>
        </div>
    );
    const options = { clientSecret };
    return (


        <div className="card flex justify-content-center">
            <Dialog visible={visible} modal header={headerElement} className="w-[30%]" onHide={() => { hide(); }}>
                <div className='flex' >
                    {clientSecret && <Elements stripe={stripePromise} options={options}>
                        <CheckoutPage hide={() => hide()} name={name} phone={phone} />
                    </Elements>}
                </div>
            </Dialog>
        </div>


    )
}
