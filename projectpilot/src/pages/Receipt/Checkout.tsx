import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { showError, showSuccess, showWarning } from "../../Helpers/Toast.Helper";


interface CheckoutProps {
    hide: () => void;
    name?: string;
    phone?: string;
}


export const CheckoutPage = ({ hide, name, phone }: CheckoutProps) => {

    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            showError("Payment was not successful, please try again");
        } else if (paymentIntent && paymentIntent.status === "succeeded") {

            showSuccess("Payment has been made. You will recieve its status shortly");
            hide();
        } else {
            showWarning("Payment status: " + paymentIntent?.status);
        }
    };
    return (

        <form onSubmit={handleSubmit}>
            <PaymentElement className="w-full" options={{
                layout: "tabs", // "tabs" | "accordion" | "auto"
                defaultValues: {
                    billingDetails: {
                        name: name,
                        phone: phone,
                    },
                },
            }} />
            <div className='w-full flex justify-center mt-5 gap-2'>
                <button type="submit" className="btn btn-success btn-rounded btn-padding-md"> Pay With Stripe</button>
                <button className="btn btn-danger btn-rounded btn-padding-md" onClick={() => hide()}  > Cancel</button>
            </div>
        </form>
    );
};