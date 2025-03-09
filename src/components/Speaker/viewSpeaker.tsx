import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles for Toastify
import '../../css/modal.css';
import Cookies from 'js-cookie'; // Import js-cookie

const ViewSpeaker = () => {
    const [speakers, setSpeakers] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSpeaker, setSelectedSpeaker] = useState(null);
    const [formData, setFormData] = useState({});
    const [imagePreview, setImagePreview] = useState(null); // For image preview
    const [loading, setLoading] = useState(false); // For loading state

    // Fetch data from API
    useEffect(() => {
        fetchSpeakers();
    }, []);

    const fetchSpeakers = async () => {
        try {
            const response = await axios.get('https://backend.gaganahuja.com/api/v1/speakers');
            const transformedData = response.data.data.map(speaker => ({
                id: speaker._id, // Assuming _id is used in the backend
                name: speaker.name,
                phone: speaker.phone,
                email: speaker.email,
                youTubeLink: speaker.youTubeLink,
                instagramLink: speaker.instagramLink,
                twitterLink: speaker.TwitterLink, // Notice the "TwitterLink" field from the response
                linkedinLink: speaker.LinkedinLink, // "LinkedinLink" from the response
                BioGraphy: speaker.BioGraphy, // "BioGraphy" from the response
                registeredAt: speaker.registeredAt, // "registeredAt" from the response
                type: speaker.type, // Speaker type, e.g., "mentor" or "speaker"
                isActive: speaker.isActive ? true : false, // Active status
                image: speaker.img, // Image field from the response
                date: new Date(speaker.createdAt).toLocaleDateString(), // Formatting the createdAt date
                createdAt: speaker.createdAt, // Original createdAt for other uses if needed
            }));
            setSpeakers(transformedData);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const token = Cookies.get('token'); // Get token from cookie

    // Function to handle opening the modal
    const handleEdit = (speaker) => {
        setSelectedSpeaker(speaker); // Set the selected speaker data
        setFormData(speaker); // Set the form data to prefill the form
        setImagePreview(speaker.image); // Set image preview if the image URL exists
        setIsModalOpen(true); // Open the modal
    };

    // Function to close the modal
    const closeModal = () => {
        setIsModalOpen(false);
        setImagePreview(null); // Clear image preview when closing the modal
    };

    // Function to handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // Function to handle image file changes

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prevData => ({
                ...prevData,
                image: file,
            }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            const formDataToSend = new FormData();

            // Append all form fields to FormData
            Object.keys(formData).forEach(key => {
                if (key === 'image' && formData[key] instanceof File) {
                    formDataToSend.append('image', formData[key]);
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await axios.put(`https://backend.gaganahuja.com/api/v1/speakers/${formData.id}`, formDataToSend, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Updated Successfully");
            fetchSpeakers();
            closeModal();
        } catch (error) {
            console.error('Error updating speaker:', error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Function to handle updating speaker details
    // const handleUpdate = async () => {
    //     setLoading(true);
    //     try {

    //         await axios.put(`http://localhost:3002/api/v1/speakers/${formData.id}`, formData, {
    //             headers: {
    //                 'Content-Type': 'multipart/form-data'
    //             }
    //         });
    //         toast.success("Updated Successfully");
    //         fetchSpeakers(); // Refresh the speaker list after update
    //         closeModal(); // Close the modal
    //     } catch (error) {
    //         console.error('Error updating speaker:', error);
    //         toast.error("Something went wrong");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    // Convert data URL to Blob
    const dataURLtoBlob = (dataURL) => {
        const [header, data] = dataURL.split(',');
        const mime = header.split(':')[1].split(';')[0];
        const binary = atob(data);
        let array = [];
        for (let i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
        }
        return new Blob([new Uint8Array(array)], { type: mime });
    };

    // Function to handle delete speaker
    const handleDelete = async (speakerId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this speaker?");
        if (confirmDelete) {
            try {
                await axios.delete(`https://backend.gaganahuja.com/api/v1/speakers/${speakerId}`);
                toast.success("Deleted Successfully");
                fetchSpeakers(); // Refresh the speaker list after deletion
            } catch (error) {
                console.error('Error deleting speaker:', error);
                toast.error("Something went wrong");
            }
        }
    };

    return (
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
                View Speaker
            </h4>
            <ToastContainer />
            <div className="flex flex-col">
                <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
                    <div className="p-2.5 xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Name
                        </h5>
                    </div>
                    <div className="p-2.5 text-center xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Phone
                        </h5>
                    </div>
                    <div className="hidden p-2.5 text-center sm:block xl:p-5">
                        <h5 className="text-sm font-medium uppercase xsm:text-base">
                            Date Added
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

                {speakers.map((speaker, key) => (
                    <div
                        className={`grid grid-cols-3 sm:grid-cols-5 ${key === speakers.length - 1
                            ? ''
                            : 'border-b border-stroke dark:border-strokedark'
                            }`}
                        key={key}
                    >
                        <div className="flex items-center gap-3 p-2.5 xl:p-5">
                            <p className="hidden text-black dark:text-white sm:block">
                                {speaker.name}
                            </p>
                        </div>
                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{speaker.phone}</p>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-black dark:text-white">{speaker.Date}</p>
                        </div>

                        <div className="flex items-center justify-center p-2.5 xl:p-5">
                            <p className="text-meta-3">{speaker.ISACTIVE}</p>
                        </div>
                        <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                            <div className="flex space-x-2">
                                <button
                                    className="btn bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                                    onClick={() => handleEdit(speaker)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="btn bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
                                    onClick={() => handleDelete(speaker.id)} // Trigger delete
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
                contentLabel="Edit Speaker"
                className="modal-content"
                overlayClassName="modal-overlay"
            >
                {console.log("selectedSpeaker", formData)
                }
                {selectedSpeaker && (
                    <div className="p-4">
                        <h2 className="text-lg font-bold">Edit Speaker</h2>

                        {/* Individual form inputs */}
                        <div className="mt-4">
                            <label className="mb-3 block text-black">Type (mandatory)</label>
                            <select
                                name="type"
                                value={formData.type || ''}
                                onChange={handleInputChange} // Handle changes
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                            >
                                <option value="" disabled>Select a category</option>
                                <option value="speaker">Speaker</option>
                                <option value="mentor">Mentor</option>
                            </select>
                        </div>
                        <div className="mt-4">
                            <label className="block mb-2">Name (mandatory)</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name || ''}
                                onChange={handleInputChange} // Handle changes
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block mb-2">Phone</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleInputChange} // Handle changes
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleInputChange} // Handle changes
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="mb-3 block text-black">YouTube Link</label>
                            <input
                                type="text"
                                name="youTubeLink"
                                value={formData.youTubeLink || ''}
                                onChange={handleInputChange} // Handle changes
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="mb-3 block text-black">Instagram Link</label>
                            <input
                                type="text"
                                name="instagramLink"
                                value={formData.instagramLink || ''}
                                onChange={handleInputChange} // Handle changes
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="mb-3 block text-black">Twitter Link</label>
                            <input
                                type="text"
                                name="twitterLink"
                                value={formData.twitterLink || ''}
                                onChange={handleInputChange} // Handle changes
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="mb-3 block text-black">LinkedIn Link</label>
                            <input
                                type="text"
                                name="linkedinLink"
                                value={formData.linkedinLink || ''}
                                onChange={handleInputChange} // Handle changes
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="mb-3 block text-black">Below Title</label>
                            <input
                                type="text"
                                name="registeredAt"
                                value={formData.registeredAt || ''}
                                onChange={handleInputChange} // Handle changes
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="block mb-2">Description</label>
                            <textarea
                                name="BioGraphy"
                                value={formData.BioGraphy || ''}
                                onChange={handleInputChange} // Handle changes
                                className="w-full p-2 border rounded"
                            />
                        </div>
                        {/* Image field with preview */}
                        <div className="mt-4">
                            <label className="block mb-2">Image (mandatory)</label>
                            {imagePreview && (
                                <img
                                    src={`https://backend.gaganahuja.com/uploads/${imagePreview}`}
                                    alt="Speaker"
                                    className="w-32 h-32 object-cover mb-2"
                                />
                            )}
                            <input
                                type="file"
                                name="image"
                                onChange={handleImageChange}
                                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                            />
                        </div>
                        <div className="mt-4">
                            <label className="mb-3 block text-black dark:text-white">IsActive (mandatory)</label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="isActive"
                                        value={true}  // Set value as true for "active"
                                        checked={formData.isActive === true}
                                        onChange={(e) => setFormData({ ...formData, isActive: true })} // Handle change to set true
                                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary dark:bg-form-input dark:text-white"
                                    />
                                    <span>Active</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="isActive"
                                        value={false}  // Set value as false for "inactive"
                                        checked={formData.isActive === false}
                                        onChange={(e) => setFormData({ ...formData, isActive: false })} // Handle change to set false
                                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary dark:bg-form-input dark:text-white"
                                    />
                                    <span>Inactive</span>
                                </label>
                            </div>
                        </div>

                        <button
                            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
                            onClick={handleUpdate} // Trigger update
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? 'Updating...' : 'Update'}
                        </button>
                        <button
                            className="mt-4 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded ml-2"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                )}

            </Modal>
        </div>
    );
};

export default ViewSpeaker;
