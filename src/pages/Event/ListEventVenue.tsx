import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ListEventVenue = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [eventList, setEventList] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        eventMasterItem: '',
        city: '',
        place: '',
        map: '',
        date: '',
        isActive: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        if (type === 'file') {
            setPreviewImage(URL.createObjectURL(files[0]));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const formDataToSend = new FormData();
        formDataToSend.append('eventMasterItem', formData.eventMasterItem);
        formDataToSend.append('city', formData.city);
        formDataToSend.append('place', formData.place);
        formDataToSend.append('map', formData.map);
        formDataToSend.append('date', formData.date);
        formDataToSend.append('isActive', formData.isActive);
    
        // Check and append the image file if it exists
        if (e.target.image?.files[0]) {
            formDataToSend.append('image', e.target.image.files[0]);
        }
    
        try {
            const response = await fetch(`https://backend.gaganahuja.com/api/v1/eventVenue/${selectedEvent._id}`, {
                method: 'PUT',
                body: formDataToSend,
            });
    
            const responseData = await response.json();
            if (response.ok) {
                toast.success('Event venue updated successfully!');
                setIsModalOpen(false);
                fetchEvents(); // Refresh the event list
            } else {
                toast.error(`Failed to update event venue: ${responseData.message}`);
            }
        } catch (error) {
            console.error('Error updating venue:', error);
            toast.error('Failed to update event venue');
        } finally {
            setLoading(false);
        }
    };
    
    

    const fetchEvents = async () => {
        try {
            const response = await fetch('https://backend.gaganahuja.com/api/v1/eventVenue/');
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    const fetchEventList = async () => {
        try {
            const response = await fetch('https://backend.gaganahuja.com/api/v1/event/');
            const data = await response.json();
            setEventList(data);
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    };

    useEffect(() => {
        fetchEvents();
        fetchEventList();
    }, []);

    const handleEdit = (event) => {
        setSelectedEvent(event);
        setFormData({
            eventMasterItem: event.eventMasterItem?._id || '',
            city: event.city || '',
            place: event.place || '',
            map: event.map || '',
            date: event.date ? new Date(event.date).toISOString().split('T')[0] : '',
            isActive: event.isActive || false
        });
        setPreviewImage(event.img);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        setPreviewImage(null);
    };

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`https://backend.gaganahuja.com/api/v1/eventVenue/${id}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                toast.success('Event venue deleted successfully!');
                setEvents(events.filter(event => event._id !== id));
            } else {
                const errorData = await response.json();
                toast.error(`Failed to delete event venue: ${errorData.message}`);
            }
        } catch (error) {
            toast.error('Failed to delete event venue');
        }
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <ToastContainer />
            <div className='flex justify-between'>
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    Event List
                </h4>
            </div>

            <div className="flex flex-col">
                <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Event Title
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5 text-center">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            City
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5 text-center">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Date
                        </h5>
                    </div>
                    <div className="p-2.5 xl:p-5 text-center">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Is Active
                        </h5>
                    </div>
                    <div className="hidden p-2.5 xl:p-5 sm:block">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Action
                        </h5>
                    </div>
                </div>

                {events.map((event, key) => (
                    <div
                        className={`grid grid-cols-5 ${key === events.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
                        key={event._id}
                    >
                        <div className="flex items-center gap-3 p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">
                                {event.eventMasterItem ? event.eventMasterItem.title : 'N/A'}
                            </p>
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">
                                {event.city}
                            </p>
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">
                                {new Date(event.date).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className={`text-meta-3 ${event.isActive ? 'text-green-500' : 'text-red-500'}`}>
                                {event.isActive ? true : false}
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
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Edit Event Venue"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                {selectedEvent && (
                    <div className="p-4">
                        <h2 className="text-lg font-bold">Edit Event Venue</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mt-4">
                                <label className="mb-3 block text-black">
                                    Event
                                </label>
                                <select
                                    name="eventMasterItem"
                                    value={formData.eventMasterItem}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                    required
                                >
                                    <option value="">Select Event</option>
                                    {eventList.map((evt) => (
                                        <option key={evt._id} value={evt._id}>{evt.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="mt-4">
                                <label className="mb-3 block text-black">
                                    City
                                </label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <label className="mb-3 block text-black">
                                    Place
                                </label>
                                <input
                                    type="text"
                                    name="place"
                                    value={formData.place}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <label className="mb-3 block text-black">
                                    Map Link
                                </label>
                                <input
                                    type="text"
                                    name="map"
                                    value={formData.map}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <label className="mb-3 block text-black">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary"
                                    required
                                />
                            </div>
                            <div className="mt-4">
                                <label className="mb-3 block text-black">
                                    Is Active
                                </label>
                                <input
                                    type="checkbox"
                                    name="isActive"
                                    checked={formData.isActive}
                                    onChange={handleChange}
                                    className="form-checkbox h-5 w-5 text-primary"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="mb-3 block text-black">
                                    Upload Image
                                </label>
                                <input
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleChange}
                                    className="w-full"
                                />
                                {previewImage && (
                                    <img src={previewImage} alt="Preview" className="mt-2 h-20" />
                                )}
                            </div>

                            <div className="mt-6 flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="mr-3 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded ${loading ? 'opacity-50' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ListEventVenue;
