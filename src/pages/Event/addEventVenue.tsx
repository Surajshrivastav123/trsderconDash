import { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddEventVenue = () => {
    const [formData, setFormData] = useState({
        eventMasterItem: '',
        city: '',
        place: '',
        map: '',
        date: '',
        isactive: '',
        image: null
    });
    const [loading, setLoading] = useState(false);
    const [events, setEvents] = useState([]);
    const [offerings, setOfferings] = useState([{ startDate: '', endDate: '', price: '' }]);

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
        }
    };

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleOfferingChange = (index, e) => {
        const { name, value } = e.target;
        const updatedOfferings = offerings.map((offering, i) => 
            i === index ? { ...offering, [name]: value } : offering
        );
        setOfferings(updatedOfferings);
    };

    const addOffering = () => {
        setOfferings([...offerings, { startDate: '', endDate: '', price: '' }]);
    };

    const removeOffering = (index) => {
        setOfferings(offerings.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        const data = new FormData();
        for (const key in formData) {
            if (key === 'image') {
                data.append('img', formData.image); // Changed 'image' to 'img' to match backend expectation
            } else {
                data.append(key, formData[key]);
            }
        }
        data.append('offerings', JSON.stringify(offerings));
    
        try {
            const response = await fetch('https://backend.gaganahuja.com/api/v1/eventVenue/', {
                method: 'POST',
                body: data
            });
    
            if (response.ok) {
                const result = await response.json();
                toast.success('Event venue created successfully!');
                // Reset form
                setFormData({
                    eventMasterItem: '',
                    city: '',
                    place: '',
                    map: '',
                    date: '',
                    isactive: '',
                    image: null
                });
                setOfferings([{ startDate: '', endDate: '', price: '' }]);
            } else {
                const errorData = await response.json();
                toast.error(`Failed to create event venue: ${errorData.message}`);
            }
        } catch (error) {
            toast.error('Failed to create event venue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
            <div className="flex flex-col gap-9">
                <ToastContainer />
                <h1>Add Event Venue</h1>
                <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5.5 p-6.5">
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Event
                            </label>
                            <select
                                name="eventMasterItem"
                                value={formData.eventMasterItem}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white"
                            >
                                <option value="">Select Event</option>
                                {events.map((event, index) => (
                                    <option key={index} value={event._id}>{event.title}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                City
                            </label>
                            <input
                                type="text"
                                name="city"
                                placeholder="Enter City"
                                value={formData.city}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Place
                            </label>
                            <input
                                type="text"
                                name="place"
                                placeholder="Enter Place"
                                value={formData.place}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Map
                            </label>
                            <input
                                type="text"
                                name="map"
                                placeholder="Enter Map URL"
                                value={formData.map}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Date
                            </label>
                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                className="w-full rounded-lg border-[1.5px] border-primary bg-transparent py-3 px-5 text-black outline-none transition focus:border-primary active:border-primary dark:bg-form-input dark:text-white"
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
                                        name="isactive"
                                        value="true"
                                        checked={formData.isactive === 'true'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                                    />
                                    <span className="text-black dark:text-white">Active</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        name="isactive"
                                        value="false"
                                        checked={formData.isactive === 'false'}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                                    />
                                    <span className="text-black dark:text-white">Inactive</span>
                                </label>
                            </div>
                        </div>
                        <div>
                            <label className="mb-3 block text-black dark:text-white">
                                Banner
                            </label>
                            <input
                                type="file"
                                name="image"
                                onChange={handleChange}
                                className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:py-3 file:px-5 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                            />
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

export default AddEventVenue;
