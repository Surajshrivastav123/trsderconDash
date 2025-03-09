import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewEventPrice = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [eventPrices, setEventPrices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        titleTop: '',
        title: '',
        price: '',
        offerings: [],
        isActive: false,
        paymentLink: '',
        slots: '',
        event: '',
    });
    const [events, setEvents] = useState([]);

    useEffect(() => {
        const fetchEventPrices = async () => {
            try {
                const response = await fetch('https://backend.gaganahuja.com/api/v1/eventPricing/');
                const data = await response.json();
                setEventPrices(data);
            } catch (error) {
                console.error('Error fetching event prices:', error);
            }
        };

        fetchEventPrices();
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('https://backend.gaganahuja.com/api/v1/event/');
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const handleEdit = (event) => {
        setSelectedEvent(event);
        setFormData({
            titleTop: event.titleTop,
            title: event.title,
            price: event.price,
            offerings: event.offerings,
            isActive: event.isActive,
            paymentLink: event.paymentLink,
            slots: event.slots,
            event: event.eventMasterItem ? event.eventMasterItem._id : '',
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        setFormData({
            titleTop: '',
            title: '',
            price: '',
            offerings: [],
            isActive: false,
            paymentLink: '',
            slots: '',
            event: '',
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this event price?')) {
            setLoading(true);
            try {
                const response = await fetch(`https://backend.gaganahuja.com/api/v1/eventPricing/${id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    setEventPrices(prevPrices => prevPrices.filter(price => price._id !== id));
                    toast.success('Event price deleted successfully!');
                } else {
                    toast.error('Failed to delete event price');
                }
            } catch (error) {
                console.error('Error deleting event price:', error);
                toast.error('Failed to delete event price');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'checkbox' ? checked : 
                    name === 'isActive' ? value === 'true' : 
                    value
        }));
    };

    const handleOfferingChange = (index, value) => {
        const newOfferings = [...formData.offerings];
        newOfferings[index] = { ...newOfferings[index], description: value };
        setFormData(prevState => ({
            ...prevState,
            offerings: newOfferings
        }));
    };

    const addOffering = () => {
        setFormData(prevState => ({
            ...prevState,
            offerings: [...prevState.offerings, { description: '' }]
        }));
    };

    const removeOffering = (index) => {
        setFormData(prevState => ({
            ...prevState,
            offerings: prevState.offerings.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`https://backend.gaganahuja.com/api/v1/eventPricing/${selectedEvent._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    eventMasterItem: formData.event,
                    isActive: formData.isActive // Now this is already a boolean
                }),
            });

            if (response.ok) {
                const updatedEvent = await response.json();
                setEventPrices(prevPrices => 
                    prevPrices.map(price => 
                        price._id === updatedEvent._id ? updatedEvent : price
                    )
                );
                toast.success('Event price updated successfully!');
                closeModal();
            } else {
                toast.error('Failed to update event price');
            }
        } catch (error) {
            console.error('Error updating event price:', error);
            toast.error('Failed to update event price');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className='flex justify-between'>
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    Event Price List
                </h4>
            </div>

            <div className="flex flex-col">
                {/* Table header */}
                <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Event Title
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Title Top
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5 text-center">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Price
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5 text-center">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Created At
                        </h5>
                    </div>
                    <div className="hidden p-2.5 xl:p-5 sm:block text-center">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Action
                        </h5>
                    </div>
                </div>

                {/* Table body */}
                {eventPrices.map((event, key) => (
                    <div
                        className={`grid grid-cols-5 ${key === eventPrices.length - 1
                                ? ''
                                : 'border-b border-stroke dark:border-strokedark'
                            }`}
                        key={event._id}
                    >
                        <div className="flex items-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">
                                {event.eventMasterItem ? event.eventMasterItem.title : 'N/A'}
                            </p>
                        </div>
                        <div className="flex items-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">
                                {event.titleTop}
                            </p>
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">
                                {event.price}
                            </p>
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">
                                {new Date(event.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                            <div className="flex space-x-2">
                              <button
                                    className="btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                    onClick={() => handleEdit(event)}
                                >
                                    Edit
                                </button> 
                               <button
                                    className="btn bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                                    onClick={() => handleDelete(event._id)}
                                    disabled={loading}
                                >
                                    {loading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
    isOpen={isModalOpen}
    onRequestClose={closeModal}
    contentLabel="Edit Event Price"
    className="modal-content"
    overlayClassName="modal-overlay"
>
    {selectedEvent && (
        <div className="p-4">
            <h2 className="text-lg font-bold">Edit Event Price</h2>
            <form onSubmit={handleSubmit}>
                <div className="mt-4">
                    <label className="block mb-2">Event</label>
                    <select
                        name="event"
                        value={formData.event}
                        onChange={handleChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    >
                        <option value="">Select Event</option>
                        {events.map((event) => (
                            <option key={event._id} value={event._id}>{event.title}</option>
                        ))}
                    </select>
                </div>
                <div className="mt-4">
                    <label className="block mb-2">Title Top</label>
                    <input
                        type="text"
                        name="titleTop"
                        value={formData.titleTop}
                        onChange={handleChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="mt-4">
                    <label className="block mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="mt-4">
                    <label className="block mb-2">Price</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="mt-4">
                    <label className="block mb-2">Payment Link</label>
                    <input
                        type="text"
                        name="paymentLink"
                        value={formData.paymentLink}
                        onChange={handleChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="mt-4">
                    <label className="block mb-2">Slots</label>
                    <input
                        type="text"
                        name="slots"
                        value={formData.slots}
                        onChange={handleChange}
                        className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="mt-4">
                    <label className="block mb-2">Offerings</label>
                    {formData.offerings.map((offering, index) => (
                        <div key={index} className="flex items-center mb-2">
                            <input
                                type="text"
                                value={offering.description}
                                onChange={(e) => handleOfferingChange(index, e.target.value)}
                                className="flex-grow rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                            <button
                                type="button"
                                onClick={() => removeOffering(index)}
                                className="ml-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addOffering}
                        className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                    >
                        Add Offering
                    </button>
                </div>
                <div className="mt-4">
                    <label className="block mb-2">Is Active</label>
                    <div className="flex items-center space-x-4">
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="isActive"
                                value="true"
                                checked={formData.isActive === true}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <span>Active</span>
                        </label>
                        <label className="flex items-center space-x-2">
                            <input
                                type="radio"
                                name="isActive"
                                value="false"
                                checked={formData.isActive === false}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                            />
                            <span>Inactive</span>
                        </label>
                    </div>
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                        disabled={loading}
                    >
                        {loading ? 'Updating...' : 'Update'}
                    </button>
                    <button
                        type="button"
                        onClick={closeModal}
                        className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
                    >
                        Close
                    </button>
                </div>
            </form>
        </div>
    )}
</Modal>

            <ToastContainer />
        </div>
    );
};

export default ViewEventPrice;