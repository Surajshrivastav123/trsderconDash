import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewGallery = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGallery, setSelectedGallery] = useState(null);
    const [galleryData, setGalleryData] = useState([]);
    const [formData, setFormData] = useState({
        image: null,
        category: '',
        isActive: false
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchGalleryData();
    }, []);

    const fetchGalleryData = async () => {
        try {
            const response = await axios.get('https://backend.gaganahuja.com/api/v1/gallery/');
            setGalleryData(response.data);
        } catch (error) {
            console.error('Error fetching gallery data:', error);
            toast.error('Failed to fetch gallery data');
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : type === 'checkbox' ? checked : value
        }));
    };

    const handleEdit = (gallery) => {
        setSelectedGallery(gallery);
        setFormData({
            image: null,
            category: gallery.category,
            isActive: gallery.isActive
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedGallery) return;

        setLoading(true);
        const data = new FormData();
        if (formData.image) {
            data.append('image', formData.image);
        }
        data.append('category', formData.category);
        data.append('isActive', formData.isActive);

        try {
            const response = await axios.put(
                `https://backend.gaganahuja.com/api/v1/gallery/${selectedGallery._id}`,
                data,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            toast.success("Gallery updated successfully");
            fetchGalleryData(); // Refresh the gallery data
            closeModal();
        } catch (error) {
            console.error('Error updating gallery:', error);
            toast.error('Error updating gallery');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this gallery item?")) {
            try {
                await axios.delete(`https://backend.gaganahuja.com/api/v1/gallery/${id}`);
                toast.success("Deleted Successfully");
                fetchGalleryData();
            } catch (error) {
                console.error('Error deleting gallery:', error);
                toast.error("Something went wrong");
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedGallery(null);
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                View Gallery
            </h4>
            <ToastContainer />
            <div className="flex flex-col">
                <div className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Image
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Published At
                        </h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Category
                        </h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            ISACTIVE
                        </h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Actions
                        </h5>
                    </div>
                </div>

                {galleryData.map((gallery, key) => (
                    <div
                        className={`grid grid-cols-5 ${key === galleryData.length - 1 ? '' : 'border-b border-stroke dark:border-strokedark'}`}
                        key={gallery._id}
                    >
                        <div className="flex items-center gap-3 p-2.5 xl:p-5">
                            <img
                                src={`https://backend.gaganahuja.com/uploads/${gallery.image}`}
                                alt={gallery.category}
                                className="w-16 h-16 object-cover"
                            />
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{new Date(gallery.publishedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{gallery.category}</p>
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className={`text-meta-3 ${gallery.isActive ? 'text-green-500' : 'text-red-500'}`}>
                                {gallery.isActive ? 'Active' : 'Inactive'}
                            </p>
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <div className="flex space-x-2">
                                <button
                                    className="btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                    onClick={() => handleEdit(gallery)}
                                >
                                    Edit
                                </button>
                                <button 
                                    className="btn bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                                    onClick={() => handleDelete(gallery._id)}
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
                contentLabel="Edit Gallery"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                {selectedGallery && (
                    <div className="p-4">
                        <h2 className="text-lg font-bold">Edit Gallery Item</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mt-4">
                                <label className="block mb-2">Image</label>
                                <img
                                    src={`https://backend.gaganahuja.com/uploads/${selectedGallery.image}`}
                                    alt=""
                                    className="w-32 h-32 object-cover mb-2"
                                />
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleChange}
                                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block mb-2">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                                >
                                    <option value="" disabled>Select a category</option>
                                    <option value="section 1">Section 1</option>
                                    <option value="section 2">Section 2</option>
                                    <option value="section 3">Section 3</option>
                                </select>
                            </div>
                            <div>
                                <label className="mb-3 mt-2 block text-black">
                                    IsActive
                                </label>
                                <div className="flex items-center space-x-4">
                                    <label className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            name="isActive"
                                            checked={formData.isActive}
                                            onChange={handleChange}
                                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                                        />
                                        <span className="text-black dark:text-white">Active</span>
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
        </div>
    );
};

export default ViewGallery;