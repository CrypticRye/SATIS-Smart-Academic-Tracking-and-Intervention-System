import { X } from "lucide-react";
import { useState } from "react";

const AddNewClassModal = ({
    onClose,
    classes,
    setClasses,
    setStudentsData,
    setIsDragging,
}) => {
    const colorOptions = [
        {
            name: "indigo",
            bg: "bg-indigo-100",
            text: "text-indigo-700",
            icon: "text-indigo-500",
        },
        {
            name: "blue",
            bg: "bg-blue-100",
            text: "text-blue-700",
            icon: "text-blue-500",
        },
        {
            name: "red",
            bg: "bg-red-100",
            text: "text-red-700",
            icon: "text-red-500",
        },
        {
            name: "green",
            bg: "bg-green-100",
            text: "text-green-700",
            icon: "text-green-500",
        },
        {
            name: "amber",
            bg: "bg-amber-100",
            text: "text-amber-700",
            icon: "text-amber-500",
        },
        {
            name: "purple",
            bg: "bg-purple-100",
            text: "text-purple-700",
            icon: "text-purple-500",
        },
    ];
    const getColorClasses = (colorName) => {
        return (
            colorOptions.find((c) => c.name === colorName) || colorOptions[0]
        );
    };
    const [newClassInfo, setNewClassInfo] = useState({
        name: "",
        section: "",
        color: "indigo",
        file: null,
    });
    const closeAddClassModal = () => {
        onClose();
        setIsDragging(false);
        setNewClassInfo({ name: "", section: "", color: "indigo", file: null });
    };

    const handleNewClassFormChange = (e) => {
        const { name, value } = e.target;
        setNewClassInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (file) => {
        if (file) {
            setNewClassInfo((prev) => ({ ...prev, file: file }));
        }
    };

    const handleCreateClass = (e) => {
        e.preventDefault();

        // 1. Create new class ID
        const newClassId = Math.max(...classes.map((c) => c.id), 0) + 1;

        // 2. Create new class object
        const newClass = {
            id: newClassId,
            name: newClassInfo.name,
            section: newClassInfo.section,
            subject: "New Subject", // Placeholder
            color: newClassInfo.color,
        };

        // 3. (DEMO) Process file if it exists
        let newStudentsList = [];
        if (newClassInfo.file) {
            console.log(
                "Simulating file processing for:",
                newClassInfo.file.name
            );
            newStudentsList = simulateFileProcess();
        }

        // 4. Update state
        setClasses((prev) => [...prev, newClass]);
        setStudentsData((prevData) => ({
            ...prevData,
            [newClassId]: newStudentsList,
        }));

        console.log("New Class Added:", newClass);
        console.log("New Students Added:", newStudentsList);

        // 5. Close modal
        closeAddClassModal();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <form onSubmit={handleCreateClass}>
                    {/* Modal Header */}
                    <div className="flex justify-between items-center p-6 border-b">
                        <h3 className="text-xl font-bold text-gray-900">
                            Add New Class
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
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Class Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                required
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                value={newClassInfo.name}
                                onChange={handleNewClassFormChange}
                                placeholder="e.g., Grade 12"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="section"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Section
                            </label>
                            <input
                                type="text"
                                name="section"
                                id="section"
                                required
                                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                value={newClassInfo.section}
                                onChange={handleNewClassFormChange}
                                placeholder="e.g., STEM-C"
                            />
                        </div>

                        {/* Color Picker */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Color Theme
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {colorOptions.map((color) => (
                                    <label
                                        key={color.name}
                                        className="flex items-center space-x-2 cursor-pointer"
                                    >
                                        <input
                                            type="radio"
                                            name="color"
                                            value={color.name}
                                            checked={
                                                newClassInfo.color ===
                                                color.name
                                            }
                                            onChange={handleNewClassFormChange}
                                            className={`form-radio ${
                                                color.text
                                            } ${color.icon.replace(
                                                "text-",
                                                "focus:ring-"
                                            )}`}
                                        />
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-sm ${color.bg} ${color.text}`}
                                        >
                                            {color.name}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* File Input */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Upload Classlist (CSV/Excel)
                            </label>
                            {newClassInfo.file ? (
                                <div className="mt-2 flex items-center justify-between p-3 bg-gray-100 rounded-md">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                        <FileText size={18} />
                                        {newClassInfo.file.name}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setNewClassInfo((prev) => ({
                                                ...prev,
                                                file: null,
                                            }))
                                        }
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <X size={18} />
                                    </button>
                                </div>
                            ) : (
                                <input
                                    type="file"
                                    name="file"
                                    id="file"
                                    className="mt-1 block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-full file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-indigo-100 file:text-indigo-700
                                                hover:file:bg-indigo-200"
                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    onChange={(e) =>
                                        handleFileChange(e.target.files[0])
                                    }
                                />
                            )}
                        </div>

                        {/* (REQUIRED) Note */}
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
                            <p className="text-sm text-blue-700">
                                <strong>Note:</strong> Once the class list is
                                added, the system will automatically generate a
                                unique email for each student (e.g.,
                                hz202300349@bshs.edu.ph).
                            </p>
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex items-center justify-end p-6 border-t bg-gray-50">
                        <button
                            type="button"
                            onClick={closeAddClassModal}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="ml-3 bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                            disabled={
                                !newClassInfo.file &&
                                (!newClassInfo.name || !newClassInfo.section)
                            }
                        >
                            Create Class
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddNewClassModal;
