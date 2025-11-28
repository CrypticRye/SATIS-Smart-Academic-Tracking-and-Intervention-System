import { useState } from "react";
import { UploadCloud } from "lucide-react";
const GradeUploader = () => {
    const [isDragging, setIsDragging] = useState(false);
    const [file, setFile] = useState(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    const handleDragLeave = () => setIsDragging(false);
    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };
    const handleUpload = () => {
        console.log("Uploading file:", file.name);
        // Example: router.post('/teacher/upload-grades', { file });
        alert(`Uploading ${file.name}... (This is a demo)`);
    };

    return (
        <div className="bg-white rounded-xl shadow-lg border-2 border-dashed border-gray-300 p-8">
            <div
                className={`relative flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg transition-all
                    ${
                        isDragging
                            ? "border-indigo-600 bg-indigo-50"
                            : "border-gray-300"
                    }
                    ${file ? "bg-green-50 border-green-400" : ""}`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                {file ? (
                    <>
                        <CheckCircle2 className="w-16 h-16 text-green-600 mb-4" />
                        <p className="text-xl font-semibold text-gray-800">
                            {file.name}
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                            ({(file.size / 1024).toFixed(1)} KB)
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setFile(null)}
                                className="text-sm font-medium text-red-600 hover:text-red-800"
                            >
                                Clear File
                            </button>
                            <button
                                onClick={handleUpload}
                                className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700"
                            >
                                Upload & Process File
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <UploadCloud className="w-16 h-16 text-gray-400 mb-4" />
                        <p className="text-xl font-semibold text-gray-800 mb-2">
                            Drag & drop your Excel/CSV file here
                        </p>
                        <p className="text-gray-500 mb-4">or</p>
                        <label className="bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg cursor-pointer hover:bg-gray-300 transition-colors">
                            <span>Browse File</span>
                            <input
                                type="file"
                                className="hidden"
                                onChange={handleFileChange}
                                accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            />
                        </label>
                    </>
                )}
            </div>
            <p className="text-center text-gray-500 text-sm mt-6">
                Uploading a new grade sheet will automatically update all
                student dashboards and re-calculate at-risk predictions.
            </p>
        </div>
    );
};

export default GradeUploader;
