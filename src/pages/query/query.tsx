import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Query = () => {
    const [brandData, setBrandData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('https://backend.gaganahuja.com/api/v1/queries');
                setBrandData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="rounded-lg border border-gray-700 bg-gray-900 p-6 shadow-md">
            <h4 className="mb-6 text-xl font-semibold text-white">View Queries</h4>

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                    <thead className="bg-gray-800">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Email Address</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Name</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Designation</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Contact</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Company Website</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Company Name</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-300">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brandData.length > 0 ? (
                            brandData.map((brand, key) => (
                                <tr
                                    key={key}
                                    className={`${
                                        key % 2 === 0 ? 'bg-gray-700' : 'bg-gray-600'
                                    } hover:bg-gray-500`}
                                >
                                    <td className="px-4 py-3 text-sm text-gray-100">{brand.email}</td>
                                    <td className="px-4 py-3 text-sm text-gray-100">{brand.name}</td>
                                    <td className="px-4 py-3 text-sm text-gray-100">{brand.Designation}</td>
                                    <td className="px-4 py-3 text-sm text-gray-100">{brand.Contact}</td>
                                    <td className="px-4 py-3 text-sm">
                                        <a
                                            href={brand.website}
                                            className="text-yellow-400 hover:underline"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {brand.website}
                                        </a>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-100">{brand.companyName}</td>
                                    <td className="px-4 py-3 text-sm text-gray-100">{brand.Date}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-4 py-3 text-center text-gray-400">No queries available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Query;
