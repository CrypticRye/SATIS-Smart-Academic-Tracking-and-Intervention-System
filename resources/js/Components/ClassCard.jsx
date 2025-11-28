import { Users, Book } from "lucide-react";

const ClassCard = ({ handleClassSelect, cls, colors, studentsData }) => {
    console.log(colors);
    console.log(cls);
    return (
        <button
            onClick={() => handleClassSelect(cls)}
            className="bg-white rounded-xl shadow-lg p-6 text-left transition-all hover:shadow-xl hover:scale-105"
        >
            <div className="flex items-center justify-between mb-4">
                <span
                    className={`${colors.bg} ${colors.text} px-3 py-1 rounded-full text-sm font-medium`}
                >
                    {cls.name}
                </span>
                <Book className={colors.icon} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{cls.section}</h2>
            <p className="text-gray-600 text-lg">{cls.subject}</p>
            <div className="flex items-center text-gray-500 mt-6">
                <Users size={16} className="mr-2" />
                <span className="text-sm font-medium">
                    {studentsData[cls.id]?.length || 0} Students
                </span>
            </div>
        </button>
    );
};

export default ClassCard;
