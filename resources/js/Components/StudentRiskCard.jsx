import { TrendingDown } from "lucide-react";
import { Link } from "@inertiajs/react";

const StudentRiskCard = ({ student }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex items-center justify-between transition-all hover:shadow-md">
        <div className="flex items-center space-x-3">
            <img
                src={student.avatar}
                alt={`${student.first_name} ${student.last_name}`}
                className="w-10 h-10 rounded-full"
            />
            <div>
                <p className="font-semibold text-gray-800">{`${student.first_name} ${student.last_name}`}</p>
                <p className="text-sm text-gray-500">{student.subject}</p>
            </div>
        </div>
        <div className="flex items-center space-x-4">
            <div className="text-right">
                <p className="font-bold text-red-600 text-lg">
                    {student.grade}%
                </p>
                <p className="text-xs text-red-500 flex items-center gap-1">
                    <TrendingDown size={14} /> {student.trend}
                </p>
            </div>
            <Link
                href="#" // Replace with actual intervention URL
                className="bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
            >
                Start Intervention
            </Link>
        </div>
    </div>
);

export default StudentRiskCard;
