import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        image: null,
        startDate: '',
        endDate: '',
        isActive: ''
    });
    const [loading, setLoading] = useState(false); // Loading state

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === 'file') {
            setFormData({
                ...formData,
                [name]: files[0] 
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading when the API call begins

        const data = new FormData();
        data.append('title', formData.title);
        data.append('content', formData.content);
        data.append('image', formData.image);
        data.append('startDate', formData.startDate);
        data.append('endDate', formData.endDate);
        data.append('isActive', formData.isActive);

        try {
            const response = await fetch('https://backend.gaganahuja.com/api/v1/event/create', {
                method: 'POST',
                body: data
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                toast.success('Event created successfully!'); // Success toast

                // Reset form after successful submission
                setFormData({
                    title: '',
                    content: '',
                    image: null,
                    startDate: '',
                    endDate: '',
                    isActive: ''
                });
            } else {
                const errorData = await response.json();
                toast.error(`Failed to create event: ${errorData.message}`); // Error toast
            }
        }catch (error) {
            toast.error('Error adding event');
            console.error('Error:', error);
        } finally {
            setLoading(false); // Stop loading after the API call completes
        }
    };

    return (
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
            <div className="flex flex-col gap-9">
                <ToastContainer /> {/* Toast container to show the toasts */}
                Add Event
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5.5 p-6.5">
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
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Content
                            </label>
                            <input
                                type="text"
                                name="content"
                                placeholder="Enter Content"
                                value={formData.content}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Sponsor Banner
                            </label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleChange}
                                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Start Date
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                End Date
                            </label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
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
                                {loading ? 'Submitting...' : 'Submit'}
                                </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddEvent;
