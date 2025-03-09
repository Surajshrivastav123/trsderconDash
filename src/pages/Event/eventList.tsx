import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewEvent = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [editedEvent, setEditedEvent] = useState(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const response = await fetch('https://backend.gaganahuja.com/api/v1/event/');
            const data = await response.json();
            setEvents(data);
        } catch (error) {
            console.error('Error fetching events:', error);
            toast.error("Failed to fetch events");
        }
    };

    const handleEdit = (event) => {
        setSelectedEvent(event);
        setEditedEvent({ ...event });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        setLoading(true);
        try {
            const response = await fetch(`https://backend.gaganahuja.com/api/v1/event/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to delete event with ID: ${id}`);
            }

            await fetchEvents();
            toast.success("Deleted Successfully");
        } catch (err) {
            console.error('Error deleting the event:', err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://backend.gaganahuja.com/api/v1/event/${editedEvent._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editedEvent),
            });

            if (!response.ok) {
                throw new Error(`Failed to update event with ID: ${editedEvent._id}`);
            }

            await fetchEvents();
            toast.success("Updated Successfully");
            closeModal();
        } catch (err) {
            console.error('Error updating the event:', err);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedEvent(null);
        setEditedEvent(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedEvent(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <div className='flex justify-between'>
                <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                    Event List
                </h4>
                <ToastContainer />
            </div>

            {loading && (
                <div className="text-center py-4">
                    <p className="text-gray-500">Loading, please wait...</p>
                </div>
            )}

            <div className="flex flex-col">
                {/* Table headers */}
                <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Title</h5>
                    </div>
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Content</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Is Active</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Created At</h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">Action</h5>
                    </div>
                </div>

                {/* Event rows */}
                {events.map((event) => (
                    <div className="grid grid-cols-5 border-b border-stroke dark:border-strokedark" key={event._id}>
                        <div className="flex items-center gap-3 p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{event.title}</p>
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{event.content}</p>
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className={`text-meta-3 ${event.isActive ? 'text-green-500' : 'text-red-500'}`}>
                                {event.isActive ? 'Active' : 'Inactive'}
                            </p>
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">
                                {new Date(event.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
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

            {/* Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Edit Event"
                className="bg-white p-6 rounded-lg max-w-md mx-auto mt-20 relative"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
            >
                {editedEvent && (
                    <div className="p-4">
                        <h2 className="text-lg font-bold">Edit Event</h2>
                        <div className="mt-4">
                            <label className="block mb-2">Title</label>
                            <input
                                type="text"
                                name="title"
                                value={editedEvent.title}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block mb-2">Content</label>
                            <input
                                type="text"
                                name="content"
                                value={editedEvent.content}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block mb-2">Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={editedEvent.startDate.split('T')[0]}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block mb-2">End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={editedEvent.endDate.split('T')[0]}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block mb-2">Status</label>
                            <select
                                name="isActive"
                                value={editedEvent.isActive}
                                onChange={handleInputChange}
                                className="w-full p-2 border rounded"
                            >
                                <option value={true}>Active</option>
                                <option value={false}>Inactive</option>
                            </select>
                        </div>
                        <div className="mt-4 flex justify-end">
                            <button
                                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mr-3"
                                onClick={handleUpdate}
                                disabled={loading}
                            >
                                {loading ? 'Updating...' : 'Update'}
                            </button>
                            <button
                                className="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded"
                                onClick={closeModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ViewEvent;