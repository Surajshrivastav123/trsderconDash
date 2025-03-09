import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Agenda = () => {
    const [formData, setFormData] = useState({ content: '' });
    const [agenda, setAgenda] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);  // State for modal

    const handleChange = (e) => {
        setFormData({ ...formData, content: e.target.value });
    };

    const fetchAgenda = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://backend.gaganahuja.com/api/v1/agenda/');
            if (!response.ok) throw new Error('Failed to fetch agenda');
            const data = await response.json();
            if (data.length > 0) {
                setAgenda(data[0]);
                setFormData({ content: data[0].agenda });
            } else {
                toast.info('No agenda found.');
            }
        } catch (error) {
            console.error('Error fetching agenda:', error);
            toast.error('Error fetching agenda');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`https://backend.gaganahuja.com/api/v1/agenda/${agenda._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ agenda: formData.content })
            });

            if (response.ok) {
                const result = await response.json();
                toast.success('Agenda updated successfully!');
                fetchAgenda();
            } else {
                const errorData = await response.json();
                toast.error(`Failed to update agenda: ${errorData.message}`);
            }
        } catch (error) {
            toast.error('Error updating agenda');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        fetchAgenda();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
            <div className="flex flex-col gap-9">
                <ToastContainer />
                <h2>Agenda</h2>
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <form className="flex flex-col gap-5.5 p-6.5" onSubmit={handleUpdate}>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Content
                            </label>
                            <textarea
                                name="content"
                                rows={12}
                                cols={10}
                                placeholder="Enter Content"
                                value={formData.content}
                                onClick={openModal}  // Open modal on click
                                readOnly  // Make it readonly to force modal editing
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg w-full mt-4"
                            disabled={!agenda || loading}
                        >
                            {loading ? 'Updating...' : 'Update Agenda'}
                        </button>
                    </form>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div
                        className="fixed inset-0 z-[1001] flex items-center justify-center bg-black bg-opacity-50"
                        style={{ zIndex: 1000 }} // Ensure the modal is on top
                    >
                        <div className="bg-white rounded-lg p-8 w-1/2 max-w-4xl relative">
                            <h3 className="text-lg font-semibold mb-4">Edit Content</h3>
                            <textarea
                                value={formData.content}
                                onChange={handleChange}
                                rows={10}
                                className="w-full border border-gray-300 rounded-lg p-3"
                            />
                            <div className="flex justify-end gap-4 mt-4">
                                <button
                                    onClick={closeModal}
                                    className="bg-gray-500 text-white py-2 px-4 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={closeModal}
                                    className="bg-primary text-white py-2 px-4 rounded-lg"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Agenda;
