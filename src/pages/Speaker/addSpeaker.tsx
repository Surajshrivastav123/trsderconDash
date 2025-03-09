import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // Quill editor styling
import { ToastContainer, toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css'; // Toast styles

const AddSpeaker = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        youtubeLink: '',
        instagramLink: '',
        twitterLink: '',
        linkedinLink: '',
        bio: '',
        phoneNumber: '',
        image: null,
        registeredAt: '',
        type: '',
        isActive: '' // Initially empty to handle the radio button
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

    const handleBioChange = (value) => {
        setFormData({
            ...formData,
            bio: value
        });
    };
   

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Start loading when the API call begins

        // Prepare form data to be sent
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('youTubeLink', formData.youtubeLink); // Case sensitivity fixed
        data.append('instagramLink', formData.instagramLink);
        data.append('TwitterLink', formData.twitterLink);
        data.append('LinkedinLink', formData.linkedinLink);
        data.append('BioGraphy', formData.bio);
        data.append('phone', formData.phoneNumber);
        data.append('image', formData.image);
        data.append('type', formData.type);
        data.append('registeredAt', formData.registeredAt);
        data.append('isActive', formData.isActive === 'active' ? 'true' : 'false'); // Convert to 'true'/'false'

        // API call to the local server
        try {
            const response = await fetch('https://backend.gaganahuja.com/api/v1/speakers', {
                method: 'POST',
                body: data
            });
            if (response.ok) {
                const result = await response.json();
                console.log('Success:', result);
                toast.success('Speaker added successfully!'); // Show success toast
                resetForm(); // Clear form
            } else {
                throw new Error('Failed to add speaker');
            }
            // const result = await response.json();
            // console.log('Success:', result);
        } catch (error) {
            toast.error('Error adding speaker');
            console.error('Error:', error);
        } finally {
            setLoading(false); // Stop loading after the API call completes
        }
    };
    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            youtubeLink: '',
            instagramLink: '',
            twitterLink: '',
            linkedinLink: '',
            bio: '',
            phoneNumber: '',
            image: null,
            registeredAt: '',
            type: '',
            isActive: '' // Initially empty to handle the radio button
        });
    }

    return (
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
            <div className="flex flex-col gap-9">
                {/* Input Fields */}
                < ToastContainer />
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5.5 p-6.5">
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Type (mandatory)
                            </label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                            >
                                <option value="" disabled>Select a category</option>
                                <option value="speaker">Speaker</option>
                                <option value="mentor">Mentor</option>
                            </select>
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Name (mandatory)
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Enter Speaker Name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="Enter Speaker Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                YouTube Link
                            </label>
                            <input
                                type="text"
                                name="youtubeLink"
                                placeholder="Enter YouTube Channel URL"
                                value={formData.youtubeLink}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Instagram Link
                            </label>
                            <input
                                type="text"
                                name="instagramLink"
                                placeholder="Enter Instagram Profile URL"
                                value={formData.instagramLink}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Twitter Link
                            </label>
                            <input
                                type="text"
                                name="twitterLink"
                                placeholder="Enter Twitter Profile URL"
                                value={formData.twitterLink}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                LinkedIn Link
                            </label>
                            <input
                                type="text"
                                name="linkedinLink"
                                placeholder="Enter LinkedIn Profile URL"
                                value={formData.linkedinLink}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Biography
                            </label>
                            <ReactQuill
                                theme="snow"
                                value={formData.bio}
                                onChange={handleBioChange}
                                placeholder="Write biography..."
                                className="custom-quill rounded-lg bg-white dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                name="phoneNumber"
                                placeholder="Enter Phone Number"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Image (mandatory)
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
                                Below Title
                            </label>
                            <input
                                type="text"
                                name="registeredAt"
                                value={formData.registeredAt}
                                 placeholder="Enter Below title"
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:bg-form-input dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                IsActive (mandatory)
                            </label>
                            <div className="flex items-center space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="isActive"
                                        value="active"
                                        checked={formData.isActive === 'active'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary dark:bg-form-input dark:text-white"
                                    />
                                    <span>Active</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="isActive"
                                        value="inactive"
                                        checked={formData.isActive === 'inactive'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary dark:bg-form-input dark:text-white"
                                    />
                                    <span>Inactive</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="inline-flex items-center justify-center rounded-md bg-primary py-3 px-5 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
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

export default AddSpeaker;
