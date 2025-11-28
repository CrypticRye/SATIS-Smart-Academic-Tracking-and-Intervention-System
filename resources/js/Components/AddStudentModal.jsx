import React from "react";
import { X } from "lucide-react";

const AddStudentModal = ({
    newStudent,
    handleNewStudentChange,
    handleAddStudent,
    onClose,
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <form onSubmit={handleAddStudent}>
                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-6 border-b">
                        <h3 className="text-xl font-bold text-gray-900">
                            Add New Student
                        </h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Modal Body (Form) */}
                    <div className="p-6 space-y-4">
                        <div>
                            <label
                                htmlFor="studentName"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Student Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="studentName"
                                required
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                value={newStudent.name}
                                onChange={handleNewStudentChange}
                                placeholder="e.g., Juan Dela Cruz"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="lrn"
                                className="block text-sm font-medium text-gray-700"
                            >
                                LRN (Learner Reference Number)
                            </label>
                            <input
                                type="text"
                                name="lrn"
                                id="lrn"
                                required
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                value={newStudent.lrn}
                                onChange={handleNewStudentChange}
                                placeholder="e.g., 123456789012"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                readOnly
                                className="mt-1 block w-full border-gray-300 bg-gray-50 rounded-md shadow-sm"
                                value={newStudent.email}
                                placeholder="Auto-generated"
                            />
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-end p-6 border-t bg-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ml-3 bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            disabled={!newStudent.name || !newStudent.lrn}
                        >
                            Add Student
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStudentModal;
