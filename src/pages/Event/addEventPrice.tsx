import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddEventPrice = () => {
    const [formData, setFormData] = useState({
        event: '',
        titleTop: '',
        title: '',
        price: '',
        paymentLink: '',
        slots: '',
        isActive: ''
    });
    const [loading, setLoading] = useState(false); // Loading state

    const [events, setEvents] = useState([]);
    const [offerings, setOfferings] = useState([{ description: '' }]);

    // Fetch events from API
    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('https://backend.gaganahuja.com/api/v1/event/');
            const data = await response.json();
            console.log("data", data);
            setEvents(data);
        } catch (error) {
            toast.error('Error adding price');
            console.error('Error:', error);
        } finally {
            setLoading(false); // Stop loading after the API call completes
        }
    };

    // Handle form input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value, // This should correctly update formData.slots
        });
    };
    

    // Handle offering input change
    const handleOfferingChange = (index, e) => {
        const { name, value } = e.target;
        const updatedOfferings = offerings.map((offering, i) =>
            i === index ? { ...offering, [name]: value } : offering
        );
        setOfferings(updatedOfferings);
    };

    const addOffering = () => {
        setOfferings([...offerings, { description: '' }]);
    };

    const removeOffering = (index) => {
        const updatedOfferings = offerings.filter((_, i) => i !== index);
        setOfferings(updatedOfferings);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading when the API call begins

        const payload = {
            eventMasterItem: formData.event,
            titleTop: formData.titleTop,
            title: formData.title,
            offerings: offerings.map(offering => ({ description: offering.description })),
            price: formData.price,
            paymentLink: formData.paymentLink,
            slots: formData.slots,  // Make sure this is included
            isActive: formData.isActive === 'true'
        };

        try {
            const response = await fetch('https://backend.gaganahuja.com/api/v1/eventPricing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success('Event pricing created successfully!');
                setFormData({
                    event: '',
                    titleTop: '',
                    title: '',
                    paymentLink: '',
                    price: '',
                    isActive: ''
                });
                setOfferings([{ description: '' }]);
            } else {
                const errorData = await response.json();
                toast.error(`Failed to create event pricing: ${errorData.message}`);
            }
        } catch (error) {
            toast.error('Failed to create event pricing');
            setLoading(false); // Stop loading after the API call completes

        }
    };

    return (
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
            <div className="flex flex-col gap-9">
                <ToastContainer />
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5.5 p-6.5">
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Event
                            </label>
                            <select
                                name="event"
                                value={formData.event}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white"
                            >
                                <option value="">Select Event</option>
                                {events.map((event, index) => (
                                    <option key={index} value={event._id}>{event.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Title Top
                            </label>
                            <input
                                type="text"
                                name="titleTop"
                                placeholder="Enter Title Top"
                                value={formData.titleTop}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Title
                            </label>
                            <input
                                type="text"
                                name="title"
                                placeholder="Enter Title"
                                value={formData.title}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Offerings
                            </label>
                            {offerings.map((offering, index) => (
                                <div key={index} className="mb-4">
                                    <input
                                        type="text"
                                        name="description"
                                        placeholder="Enter Offering"
                                        value={offering.description}
                                        onChange={(e) => handleOfferingChange(index, e)}
                                        className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeOffering(index)}
                                        className="text-red-500 hover:underline mt-2"
                                    >
                                        Remove Offering
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addOffering}
                                className="bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                            >
                                Add Offering
                            </button>
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Payment Link
                            </label>
                            <input
                                type="text"
                                name="paymentLink"
                                placeholder="Enter payment Link"
                                value={formData.paymentLink}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Slots
                            </label>
                            <input
                                type="text"
                                name="slots"
                                placeholder="Enter Slots"
                                value={formData.slots}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white"
                            />
                        </div>



                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Price
                            </label>
                            <input
                                type="number"
                                name="price"
                                placeholder="Enter Price"
                                value={formData.price}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Is Active
                            </label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="isActive"
                                        value="true"
                                        checked={formData.isActive === 'true'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                                    />
                                    <span className="text-black dark:text-white">Active</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="isActive"
                                        value="false"
                                        checked={formData.isActive === 'false'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                                    />
                                    <span className="text-black dark:text-white">Inactive</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg w-full"
                            >
                                {loading ? 'Submitting...' : 'Submit'}                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEventPrice;
