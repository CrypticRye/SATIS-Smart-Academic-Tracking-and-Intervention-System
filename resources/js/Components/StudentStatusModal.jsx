import React from "react";
import { X } from "lucide-react";

const StudentStatusModal = ({
    student,
    assignments,
    calculateFinalGrade,
    onClose,
}) => {
    if (!student) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-auto">
                {/* Modal Header */}
                <div className="flex justify-between items-center p-6 border-b">
                    <h3 className="text-xl font-bold text-gray-900">
                        Student Status: {student.name}
                    </h3>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                LRN
                            </p>
                            <p className="text-base text-gray-900">
                                {student.lrn}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Email
                            </p>
                            <p className="text-base text-gray-900">
                                {student.email}
                            </p>
                        </div>
                    </div>

                    <h4 className="text-lg font-bold text-gray-900 mt-6">
                        Grades Overview
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Assignment
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {assignments.map((assign) => (
                                    <tr key={assign.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {assign.label}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {student.grades[assign.id] || 0}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {assign.total}
                                        </td>
                                    </tr>
                                ))}
                                <tr>
                                    <td
                                        className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900"
                                        colSpan="2"
                                    >
                                        Final Grade
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                        {calculateFinalGrade(
                                            student.grades,
                                            assignments
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        {assignments.length === 0 && (
                            <p className="text-center text-gray-500 py-4">
                                No assignments defined for this class.
                            </p>
                        )}
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end p-4 border-t bg-gray-50">
                    <button
                        type="button"
                        onClick={onClose}
                        className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StudentStatusModal;
