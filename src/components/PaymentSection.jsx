import { useState } from 'react';

const PaymentSection = ({ onPaymentComplete }) => {
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [paymentMade, setPaymentMade] = useState(false);
    
    const generatePaymentURL = (amount, description) => {
        // Replace with your actual UPI ID
        const upiId = 'jeevesh258@okicici';
        return `upi://pay?pa=${upiId}&pn=HealSync&am=${amount}&tn=${description}`;
    };

    const generateQRCode = (paymentURL) => {
        // For demo, using a placeholder QR code service
        // In production, use a proper QR code generation service
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(paymentURL)}`;
    };

    const handlePayment = (amount, description) => {
        const paymentURL = generatePaymentURL(amount, description);
        const qrURL = generateQRCode(paymentURL);
        setSelectedAmount({ amount, qrURL, description });
    };

    const handleConfirmBooking = () => {
        // Here you would typically verify payment with backend
        onPaymentComplete();
    };

    return (
        <div className="payment-section p-6 bg-white rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Select Payment Option</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="payment-card p-6 border rounded-xl">
                    <h3 className="text-xl font-semibold">Consultation</h3>
                    <p className="text-3xl font-bold text-primary my-4">₹300</p>
                    <p className="text-gray-600 mb-4">Video consultation with doctor</p>
                    {selectedAmount?.amount === 300 && (
                        <div className="qr-container text-center mb-4">
                            <img src={selectedAmount.qrURL} alt="Payment QR Code" className="mx-auto mb-2"/>
                            <p className="text-sm text-gray-600">Scan QR code with any UPI app to pay</p>
                        </div>
                    )}
                    <button 
                        onClick={() => handlePayment(300, "Doctor Consultation")}
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90"
                    >
                        Show QR Code
                    </button>
                </div>
            </div>
            
            {selectedAmount && (
                <div className="payment-confirmation mt-6 border-t pt-6">
                    <label className="flex items-center gap-2 mb-4">
                        <input 
                            type="checkbox"
                            checked={paymentMade}
                            onChange={(e) => setPaymentMade(e.target.checked)}
                            className="w-4 h-4 text-primary"
                        /> 
                        <span>I confirm that I have made the payment</span>
                    </label>
                    <button 
                        className="w-full bg-primary text-white py-3 rounded-lg disabled:opacity-50"
                        disabled={!paymentMade}
                        onClick={handleConfirmBooking}
                    >
                        Confirm Booking
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentSection;
