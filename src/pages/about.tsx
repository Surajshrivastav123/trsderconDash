import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const About = () => {
    const [formData, setFormData] = useState({ content: '', image: null });
    const [aboutData, setAboutData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, content: e.target.value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, image: file });
        }
    };

    const fetchAbout = async () => {
        setLoading(true);
        try {
            const response = await fetch('https://backend.gaganahuja.com/api/v1/about/');
            if (!response.ok) throw new Error('Failed to fetch about data');
            const data = await response.json();
            if (data.success && data.data.length > 0) {
                const about = data.data[0];
                setAboutData(about);
                setFormData({ content: about.about, image: about.image }); // Set initial content and image
            } else {
                toast.info('No about data found.');
            }
        } catch (error) {
            console.error('Error fetching about data:', error);
            toast.error('Error fetching about data');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formDataToSend = new FormData();
        formDataToSend.append('about', formData.content);
        if (formData.image) {
            formDataToSend.append('image', formData.image);
        }

        try {
            const response = await fetch(`https://backend.gaganahuja.com/api/v1/about/${aboutData._id}`, {
                method: 'PUT',
                body: formDataToSend
            });

            if (response.ok) {
                const result = await response.json();
                toast.success('About section updated successfully!');
                fetchAbout();
            } else {
                const errorData = await response.json();
                toast.error(`Failed to update about section: ${errorData.message}`);
            }
        } catch (error) {
            toast.error('Error updating about section');
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

    const openImageModal = () => {
        setIsImageModalOpen(true);
    };

    const closeImageModal = () => {
        setIsImageModalOpen(false);
    };

    useEffect(() => {
        fetchAbout();
    }, []);

    return (
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
            <div className="flex flex-col gap-9">
                <ToastContainer />
                <h2>About</h2>
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <form className="flex flex-col gap-5.5 p-6.5" onSubmit={handleUpdate}>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">Content</label>
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
                            type="button"
                            onClick={openImageModal}
                            className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg w-full mt-4"
                        >
                            {formData.image ? 'Change Image' : 'Upload Image'}
                        </button>

                        <button
                            type="submit"
                            className="bg-primary hover:bg-primary-dark text-white py-3 px-6 rounded-lg w-full mt-4"
                            disabled={!aboutData || loading}
                        >
                            {loading ? 'Updating...' : 'Update About'}
                        </button>
                    </form>
                </div>

                {/* Content Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 1000 }}>
                        <div className="bg-white rounded-lg p-8 w-1/2 max-w-4xl relative">
                            <h3 className="text-lg font-semibold mb-4">Edit Content</h3>
                            <textarea
                                value={formData.content}
                                onChange={handleChange}
                                rows={10}
                                className="w-full border border-gray-300 rounded-lg p-3"
                            />
                            <div className="flex justify-end gap-4 mt-4">
                                <button onClick={closeModal} className="bg-gray-500 text-white py-2 px-4 rounded-lg">Cancel</button>
                                <button onClick={closeModal} className="bg-primary text-white py-2 px-4 rounded-lg">Save</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Modal */}
                {isImageModalOpen && (
                    <div className="fixed inset-0 z-[1001] flex items-center justify-center bg-black bg-opacity-50" style={{ zIndex: 1000 }}>
                        <div className="bg-white rounded-lg p-8 w-1/2 max-w-4xl relative">
                            <h3 className="text-lg font-semibold mb-4">Upload Image</h3>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="mb-4"
                            />
                            <div className="flex justify-end gap-4 mt-4">
                                <button onClick={closeImageModal} className="bg-gray-500 text-white py-2 px-4 rounded-lg">Cancel</button>
                                <button onClick={closeImageModal} className="bg-primary text-white py-2 px-4 rounded-lg">Save</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default About;
