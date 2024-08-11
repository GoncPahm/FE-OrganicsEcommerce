import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Paypal({ createOrder, onApprove }) {
    const initialOptions = {
        clientId: "AaH-Ma_yIEXI_ptG8LVPc4qAIven4Ve-Jd4aZq-UTT-GJfSbWVT9SrWiMcN5Ofo_3ZJQWWxmz6fwUEZn",
        currency: "USD",
        intent: "capture",
    };

    return (
        <PayPalScriptProvider options={initialOptions}>
            <PayPalButtons createOrder={createOrder} onApprove={onApprove} style={{ layout: "horizontal" }} />
        </PayPalScriptProvider>
    );
}
