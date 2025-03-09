import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ViewSponsor = () => {
    const [sponsors, setSponsors] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false); // Loading state
    const [selectedSponsor, setSelectedSponsor] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        link: '',
        image: null,
        category: '',
        isActive: ''
    });

    useEffect(() => {
        fetchSponsors();
    }, []);

    const fetchSponsors = async () => {
        try {
            const response = await fetch('https://backend.gaganahuja.com/api/v1/sponser/get');
            const data = await response.json();
            setSponsors(data);
        } catch (error) {
            console.error('Error fetching sponsors:', error);
        }
    };

    const handleEdit = (sponsor) => {
        setSelectedSponsor(sponsor);
        setFormData({
            title: sponsor.title,
            link: sponsor.link,
            image: null,
            category: sponsor.category,
            isActive: sponsor.isActive.toString()
        });
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading when the API call begins
        if (!selectedSponsor) return;

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'image' && formData[key]) {
                data.append(key, formData[key]);
            } else if (key !== 'image') {
                data.append(key, formData[key]);
            }
        });

        try {
            await axios.put(`https://backend.gaganahuja.com/api/v1/sponser/${selectedSponsor._id}`, data);
            toast.success("Sponsor updated successfully");
            closeModal();
            fetchSponsors();
        } catch (error) {
            toast.error('Error updating sponsor');
            console.error('Error:', error);
        } finally {
            setLoading(false); // Stop loading after the API call completes
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this sponsor?")) {
            try {
                await axios.delete(`https://backend.gaganahuja.com/api/v1/sponser/${id}`);
                toast.success("Deleted Successfully");
                fetchSponsors();
            } catch (error) {
                console.error('Error deleting sponsor:', error);
                toast.error("Something went wrong");
            }
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedSponsor(null);
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                View Sponsor
            </h4>
            <ToastContainer />
            <div className="flex flex-col">
                {/* Table header */}
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Title
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Link
                        </h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Image
                        </h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            ISACTIVE
                        </h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Action
                        </h5>
                    </div>
                </div>

                {/* Table body */}
                {sponsors.map((sponsor, key) => (
                    <div
                        className={`grid grid-cols-3 sm:grid-cols-5 ${key === sponsors.length - 1
                            ? ''
                            : 'border-b border-stroke dark:border-strokedark'
                            }`}
                        key={sponsor._id}
                    >
                        <div className="flex items-center gap-3 p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">
                                {sponsor.title}
                            </p>
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{sponsor.link}</p>
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <img
                                src={`https://backend.gaganahuja.com/${sponsor.image}`}
                                alt={sponsor.title}
                                className="w-16 h-16 object-cover"
                            />
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className={`text-meta-3 ${sponsor.isActive ? 'text-green-500' : 'text-red-500'}`}>
                                {sponsor.isActive ? 'Active' : 'Inactive'}
                            </p>
                        </div>
                        <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                            <div className="flex space-x-2">
                                <button
                                    className="btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                    onClick={() => handleEdit(sponsor)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                                    onClick={() => handleDelete(sponsor._id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal for editing */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Edit Sponsor"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                {selectedSponsor && (
                    <div className="p-4">
                        <h2 className="text-lg font-bold">Edit Sponsor</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mt-4">
                                <label className="block mb-2">Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block mb-2">Link</label>
                                <input
                                    type="text"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block mb-2">Image</label>
                                <img
                                    src={`https://backend.gaganahuja.com/${selectedSponsor.image}`}
                                    alt=""
                                    className="w-32 h-32 object-cover mb-2"
                                />
                                <input
                                    type="file"
                                    name="image"
                                    onChange={handleChange}
                                    className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                                />
                            </div>
                            <div className="mt-4">
                                <label className="block mb-2">Category</label>
                                
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value="">Select Category</option>
                                    <option value="section 1">Section 1</option>
                                    <option value="section 2">Section 2</option>

                                  
                                </select>
                            </div>
                            <div className="mt-4">
                                <label className="block mb-2">Is Active</label>
                                <div>
                                    <label className="inline-flex items-center">
                                        <input
                                            type="radio"
                                            name="isActive"
                                            value="true"
                                            checked={formData.isActive === 'true'}
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Active</span>
                                    </label>
                                    <label className="inline-flex items-center ml-4">
                                        <input
                                            type="radio"
                                            name="isActive"
                                            value="false"
                                            checked={formData.isActive === 'false'}
                                            onChange={handleChange}
                                        />
                                        <span className="ml-2">Inactive</span>
                                    </label>
                                </div>
                            </div>
                            <div className="mt-6">
                                <button
                                    type="submit"
                                    className="btn bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                                    disabled={loading}
                                >
                                    {loading ? "Updating..." : "Update Sponsor"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ViewSponsor;
