import { useState } from 'react';
import PaymentSection from './PaymentSection';
import VideoCall from './VideoCall';

const AppointmentBooking = ({ onComplete }) => {
    const [bookingStep, setBookingStep] = useState('form'); // form, payment, video
    const [bookingDetails, setBookingDetails] = useState({
        name: '',
        age: '',
        gender: '',
        symptoms: '',
        preferredDate: '',
        preferredTime: ''
    });

    const handleInputChange = (e) => {
        setBookingDetails({
            ...bookingDetails,
            [e.target.name]: e.target.value
        });
    };

    const handleBookingSubmit = (e) => {
        e.preventDefault();
        setBookingStep('payment');
    };

    const handlePaymentComplete = () => {
        setBookingStep('video');
        onComplete?.(); // Call the completion callback
    };

    if (bookingStep === 'video') {
        return null; // Don't render VideoCall component here anymore
    }

    if (bookingStep === 'payment') {
        return <PaymentSection onPaymentComplete={handlePaymentComplete} />;
    }

    return (
        <div className="booking-form max-w-2xl mx-auto">
            <form onSubmit={handleBookingSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            className="input-field"
                            placeholder="Enter your full name"
                            value={bookingDetails.name}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <input
                            type="number"
                            name="age"
                            className="input-field"
                            placeholder="Enter your age"
                            value={bookingDetails.age}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                        name="gender"
                        className="input-field"
                        value={bookingDetails.gender}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className="form-group">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
                    <textarea
                        name="symptoms"
                        className="input-field min-h-[120px]"
                        placeholder="Please describe your symptoms"
                        value={bookingDetails.symptoms}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Date</label>
                        <input
                            type="date"
                            name="preferredDate"
                            className="input-field"
                            value={bookingDetails.preferredDate}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                        <input
                            type="time"
                            name="preferredTime"
                            className="input-field"
                            value={bookingDetails.preferredTime}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                >
                    Proceed to Payment
                </button>
            </form>
        </div>
    );
};

export default AppointmentBooking;
