import React, { useState, useMemo } from "react";
import TeacherLayout from "../../Layouts/TeacherLayout";
import { Head, Link } from "@inertiajs/react";
import AttendanceLog from "./AttendanceLog";
import {
    LayoutGrid,
    List,
    CalendarDays,
    Check,
    XIcon,
    Clock,
    History,
} from "lucide-react";
import NavLink from "@/Components/NavLink";

// --- Mock Data Generation (Unchanged) ---

const createAvatar = (name) => {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("");
    const colors = [
        "E9D5FF/4C1D95",
        "DBEAFE/1E3A8A",
        "FEE2E2/991B1B",
        "E0F2FE/0C4A6E",
        "FEF9C3/854D0E",
        "FCE7F3/9D174D",
        "D1FAE5/065F46",
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    return `https://placehold.co/40x40/${color}?text=${initials}`;
};

const mockNames = [
    "Sheena De Guzman",
    "John Smith",
    "Maria Clara",
    "Crisostomo Ibarra",
    "Juan Dela Cruz",
    "Sisa Alagasi",
    "Elias Magsalin",
    "Pedro Penduko",
    "Basilio Ocampo",
    "Crispin Ocampo",
    "Isagani Flores",
    "Paulita Gomez",
    "Juli Sandoval",
    "Tandang Sora",
    "Andres Bonifacio",
    "Emilio Aguinaldo",
    "Jose Rizal",
    "Gabriela Silang",
    "Lapu-Lapu",
    "Leonor Rivera",
    "Antonio Luna",
    "Heneral Goyo",
    "Melchora Aquino",
    "Diego Silang",
    "Rhea Santos",
    "Mike Enriquez",
    "Noli De Castro",
    "Korina Sanchez",
    "Ted Failon",
    "Lito Atienza",
    "Isko Moreno",
    "Vico Sotto",
    "Manny Pacquiao",
    "Hidilyn Diaz",
    "Catriona Gray",
    "Pia Wurtzbach",
    "Gloria Diaz",
    "Margarita Moran",
    "Kylie Versoza",
    "Megan Young",
];

const generateClassroomData = () => {
    const totalRows = 5;
    const totalCols = 10;
    const numSeats = totalRows * totalCols;
    const numStudents = 40;

    const studentList = mockNames.slice(0, numStudents).map((name, index) => ({
        id: 101 + index,
        name: name,
        avatar: createAvatar(name),
        status: "present",
    }));

    let seatFillers = studentList.map((s) => s.id);
    for (let i = 0; i < numSeats - numStudents; i++) {
        seatFillers.push(null);
    }

    for (let i = seatFillers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [seatFillers[i], seatFillers[j]] = [seatFillers[j], seatFillers[i]];
    }

    const seatLayout = [];
    for (let r = 1; r <= totalRows; r++) {
        for (let c = 1; c <= totalCols; c++) {
            seatLayout.push({
                row: r,
                col: c,
                studentId: seatFillers.pop(),
            });
        }
    }

    return {
        students: studentList,
        seatLayout: seatLayout,
    };
};

const mockClasses = [
    { id: 1, name: "Grade 12 - STEM (Physics)" },
    { id: 2, name: "Grade 10 - ABM (Economics)" },
    { id: 3, name: "Grade 11 - HUMSS (History)" },
];

// --- 1. The Main Attendance Page Component ---

const Attendance = () => {
    const [viewMode, setViewMode] = useState("grid");
    const [selectedClassId, setSelectedClassId] = useState(mockClasses[0].id);
    const [currentDate, setCurrentDate] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [isDraggingEnabled, setIsDraggingEnabled] = useState(false);

    const classData = useMemo(() => {
        return generateClassroomData();
    }, [selectedClassId]);

    const [students, setStudents] = useState(classData.students);
    const [seatLayout, setSeatLayout] = useState(classData.seatLayout); // Make seatLayout stateful

    // --- Logic for changing student status ---
    const handleGridClick = (studentId) => {
        if (isDraggingEnabled) return; // Prevent status change if dragging is enabled

        setStudents((currentStudents) =>
            currentStudents.map((student) => {
                if (student.id === studentId) {
                    let newStatus;
                    if (student.status === "present") newStatus = "absent";
                    else if (student.status === "absent") newStatus = "late";
                    else newStatus = "present";
                    return { ...student, status: newStatus };
                }
                return student;
            })
        );
    };

    const handleListClick = (studentId, newStatus) => {
        setStudents((currentStudents) =>
            currentStudents.map((student) =>
                student.id === studentId
                    ? { ...student, status: newStatus }
                    : student
            )
        );
    };

    // --- Drag and Drop Logic ---
    const handleSeatDrop = (draggedSeatInfo, targetCoords) => {
        setSeatLayout((prevLayout) => {
            const newLayout = [...prevLayout];

            // Find the source seat using its coordinates (row, col) from draggedSeatInfo
            const sourceSeatIndex = newLayout.findIndex(
                (seat) => seat.row === draggedSeatInfo.row && seat.col === draggedSeatInfo.col
            );
            // Find the target seat using its coordinates (row, col)
            const targetSeatIndex = newLayout.findIndex(
                (seat) => seat.row === targetCoords.row && seat.col === targetCoords.col
            );

            // Crucial checks: ensure both source and target seats are found
            if (sourceSeatIndex === -1) {
                console.error("Dragged student's original seat not found in layout.");
                return prevLayout;
            }
            if (targetSeatIndex === -1) {
                console.error("Target seat not found in layout.");
                return prevLayout;
            }

            const sourceSeat = newLayout[sourceSeatIndex];
            const targetSeat = newLayout[targetSeatIndex];

            // Create new seat objects with swapped student IDs
            // The studentId from the *dragged* item goes to the *target* seat
            // The studentId from the *target* item goes to the *source* seat
            const updatedSourceSeat = { ...sourceSeat, studentId: targetSeat.studentId };
            const updatedTargetSeat = { ...targetSeat, studentId: draggedSeatInfo.studentId };

            // Update the new layout array
            newLayout[sourceSeatIndex] = updatedSourceSeat;
            newLayout[targetSeatIndex] = updatedTargetSeat;

            return newLayout;
        });
    };

    // --- Statistics for the Summary Bar ---
    const stats = useMemo(() => {
        const present = students.filter((s) => s.status === "present").length;
        const absent = students.filter((s) => s.status === "absent").length;
        const late = students.filter((s) => s.status === "late").length;
        return { present, absent, late, total: students.length };
    }, [students]);

    const handleSubmit = () => {
        console.log("Submitting Attendance:", {
            classId: selectedClassId,
            date: currentDate,
            students,
            seatLayout, // Include seatLayout in submission
            stats,
        });
        alert(`Attendance submitted for ${stats.total} students!`);
    };

    return (
        <TeacherLayout>
            <div className="teacher-layout-placeholder bg-gray-100 min-h-screen p-6">
                {/* <Head title="Attendance" />  */}
                <title>Attendance</title>

                {/* --- Page Header --- */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Take Attendance
                    </h1>
                    <p className="text-lg text-gray-600">
                        Select a class and choose your preferred method.
                    </p>
                </div>

                {/* --- Control Bar --- */}
                <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4 mb-8 sticky top-20 z-40">
                    {/* Left Side: Class & Date Pickers (Unchanged) */}
                    <div className="flex items-center gap-4">
                        <div>
                            <label
                                htmlFor="classSelect"
                                className="block text-sm font-medium text-gray-500 mb-1"
                            >
                                Class
                            </label>
                            <select
                                id="classSelect"
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={selectedClassId}
                                onChange={(e) =>
                                    setSelectedClassId(Number(e.target.value))
                                }
                            >
                                {mockClasses.map((cls) => (
                                    <option key={cls.id} value={cls.id}>
                                        {cls.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label
                                htmlFor="dateSelect"
                                className="block text-sm font-medium text-gray-500 mb-1"
                            >
                                Date
                            </label>
                            <input
                                type="date"
                                id="dateSelect"
                                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                value={currentDate}
                                onChange={(e) => setCurrentDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Right Side: View Mode Toggle & Log Button */}
                    <div className="flex items-center gap-2">
                        {/* Dragging Toggle Button */}
                        <button
                            onClick={() => setIsDraggingEnabled(!isDraggingEnabled)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm transition-colors
                                ${
                                    isDraggingEnabled
                                        ? "bg-red-500 text-white hover:bg-red-600"
                                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                                }`}
                        >
                            {isDraggingEnabled ? "Disable Dragging" : "Enable Dragging"}
                        </button>
                        {/* Log Button as a standard <a> tag */}
                        <NavLink
                            href="/teacher/attendance/log"
                            className="flex items-center gap-2 px-3 py-2 rounded-md font-medium text-sm text-gray-600 hover:text-indigo-700 hover:bg-indigo-50 transition-colors"
                        >
                            <History size={18} />
                            View Log
                        </NavLink>

                        {/* View Mode Toggle */}
                        <div className="flex items-center p-1 bg-gray-200 rounded-lg">
                            <button
                                onClick={() => setViewMode("grid")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm
                                ${
                                    viewMode === "grid"
                                        ? "bg-white text-indigo-700 shadow-sm"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                            >
                                <LayoutGrid size={18} />
                                Grid View
                            </button>
                            <button
                                onClick={() => setViewMode("list")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm
                                ${
                                    viewMode === "list"
                                        ? "bg-white text-indigo-700 shadow-sm"
                                        : "text-gray-600 hover:text-gray-800"
                                }`}
                            >
                                <List size={18} />
                                List View
                            </button>
                        </div>
                    </div>
                </div>

                {/* --- Main Content Area --- */}
                <div className="pb-24">
                    {viewMode === "grid" ? (
                        <SeatingGrid
                            className="active:cursor-grab"
                            students={students}
                            seatLayout={seatLayout}
                            onClick={handleGridClick}
                            isDraggingEnabled={isDraggingEnabled}
                            onSeatDrop={handleSeatDrop}
                        />
                    ) : (
                        <StudentList
                            students={students}
                            onClick={handleListClick}
                        />
                    )}
                </div>

                {/* --- Summary & Submit Bar --- */}
                <div className="fixed bottom-0 left-0 right-0 w-full bg-white border-t border-gray-200 shadow-lg-top z-40">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-20">
                            <div className="flex items-center space-x-6">
                                <h3 className="text-lg font-medium text-gray-800 hidden sm:block">
                                    Summary:
                                </h3>
                                <div className="flex items-center gap-2 text-green-600">
                                    <Check size={20} />
                                    <span className="font-bold text-lg">
                                        {stats.present}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Present
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-red-600">
                                    <XIcon size={20} />
                                    <span className="font-bold text-lg">
                                        {stats.absent}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Absent
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-yellow-600">
                                    <Clock size={20} />
                                    <span className="font-bold text-lg">
                                        {stats.late}
                                    </span>
                                    <span className="text-sm text-gray-600">
                                        Late
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={handleSubmit}
                                className="bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition-colors"
                            >
                                Save Attendance
                            </button>
                        </div>
                    </div>
                </div>

                {/* AttendanceLog component instance */}
            </div>
        </TeacherLayout>
    );
};

export default Attendance;

// --- 2. Grid View Component---

const SeatingGrid = ({
    students,
    seatLayout,
    onClick,
    isDraggingEnabled,
    onSeatDrop,
}) => {
    const handleDragOver = (e) => {
        e.preventDefault(); // Necessary to allow dropping
    };

    const handleDrop = (e, targetRow, targetCol) => {
        e.preventDefault();
        const seatDataString = e.dataTransfer.getData("seat-data");
        if (seatDataString && isDraggingEnabled) {
            const draggedSeatInfo = JSON.parse(seatDataString);
            onSeatDrop(draggedSeatInfo, { row: targetRow, col: targetCol });
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center text-sm font-medium text-gray-500 bg-gray-100 border border-gray-300 rounded-lg py-3 mb-8">
                Teacher's Desk / Front of Classroom
            </div>
            <div
                className="grid gap-x-2 gap-y-4"
                style={{ gridTemplateColumns: "repeat(11, 1fr)" }}
                onDragOver={isDraggingEnabled ? handleDragOver : null}
            >
                {seatLayout.map((seat) => {
                    const student = seat.studentId
                        ? students.find((s) => s.id === seat.studentId)
                        : null;
                    // Adjust column for visual spacing in grid, assuming 10 cols + 1 for middle aisle
                    const gridCol = seat.col > 5 ? seat.col + 1 : seat.col;

                    if (student) {
                        return (
                            <SeatCard
                                key={student.id}
                                student={student}
                                onClick={() => onClick(student.id)}
                                seatRow={seat.row}
                                seatCol={gridCol}
                                isDraggingEnabled={isDraggingEnabled}
                                onDrop={handleDrop}
                            />
                        );
                    } else {
                        return (
                            <EmptySeatCard
                                key={`empty-${seat.row}-${seat.col}`}
                                seatRow={seat.row}
                                seatCol={gridCol}
                                isDraggingEnabled={isDraggingEnabled}
                                onDrop={handleDrop}
                            />
                        );
                    }
                })}
            </div>
        </div>
    );
};

const SeatCard = ({ student, onClick, seatRow, seatCol, isDraggingEnabled, onDrop }) => {
    const statusStyles = {
        present: "bg-green-100 border-green-400 text-green-800",
        absent: "bg-red-100 border-red-400 text-red-800 opacity-60",
        late: "bg-yellow-100 border-yellow-400 text-yellow-800",
    };

    const handleDragStart = (e) => {
        if (!isDraggingEnabled) return;

        const payload = {
            studentId: student.id,
            row: seatRow,
            col: seatCol > 5 ? seatCol - 1 : seatCol, // fix aisle offset when reversing
        };

        e.dataTransfer.setData("seat-data", JSON.stringify(payload));
        e.dataTransfer.effectAllowed = "move";
    };

    return (
        <div
            draggable={isDraggingEnabled}
            onDragStart={handleDragStart}
            onDrop={(e) => onDrop(e, seatRow, seatCol > 5 ? seatCol - 1 : seatCol)}
            onDragOver={(e) => isDraggingEnabled && e.preventDefault()}
            className={`
                relative rounded-lg border p-3 flex flex-col items-center justify-center cursor-pointer
                transition-transform hover:scale-105 select-none
                ${statusStyles[student.status]}
            `}
            style={{
                gridColumn: seatCol,
            }}
            onClick={() => {
                if (!isDraggingEnabled) onClick(student.id);
            }}
        >
            <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 rounded-full mb-2"
            />
            <p className="text-sm font-semibold">{student.name}</p>
            <p className="text-xs opacity-80 capitalize">{student.status}</p>
        </div>
    );
};


const EmptySeatCard = ({ seatRow, seatCol, isDraggingEnabled, onDrop }) => {
    return (
        <div
            onDrop={(e) => onDrop(e, seatRow, seatCol > 5 ? seatCol - 1 : seatCol)}
            onDragOver={(e) => isDraggingEnabled && e.preventDefault()}
            style={{
                gridColumn: seatCol,
            }}
            className="border border-dashed border-gray-400 rounded-lg h-20 flex items-center justify-center text-gray-400"
        >
            Empty
        </div>
    );
};

// --- 3. List View Component ---

const StudentList = ({ students, onClick }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <ul className="divide-y divide-gray-200">
            {students
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((student) => (
                    <StudentListItem
                        key={student.id}
                        student={student}
                        onClick={onClick}
                    />
                ))}
        </ul>
    </div>
);

const StudentListItem = ({ student, onClick }) => (
    <li className="p-4 flex flex-col sm:flex-row items-center justify-between">
        {/* Student Info */}
        <div className="flex items-center gap-4 mb-4 sm:mb-0">
            <img
                src={student.avatar}
                alt={student.name}
                className="w-12 h-12 rounded-full"
            />
            <div>
                <p className="text-lg font-semibold text-gray-900">
                    {student.name}
                </p>
                <p
                    className={`text-sm font-medium ${
                        student.status === "present"
                            ? "text-green-600"
                            : student.status === "absent"
                            ? "text-red-600"
                            : "text-yellow-600"
                    }`}
                >
                    Status: <span className="uppercase">{student.status}</span>
                </p>
            </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
            <StatusButton
                label="Present"
                icon={<Check size={16} />}
                isActive={student.status === "present"}
                onClick={() => onClick(student.id, "present")}
                className="bg-green-100 text-green-700 hover:bg-green-200 active:bg-green-600 active:text-white"
                activeClassName="bg-green-600 text-white"
            />
            <StatusButton
                label="Absent"
                icon={<XIcon size={16} />}
                isActive={student.status === "absent"}
                onClick={() => onClick(student.id, "absent")}
                className="bg-red-100 text-red-700 hover:bg-red-200 active:bg-red-600 active:text-white"
                activeClassName="bg-red-600 text-white"
            />
            <StatusButton
                label="Late"
                icon={<Clock size={16} />}
                isActive={student.status === "late"}
                onClick={() => onClick(student.id, "late")}
                className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 active:bg-yellow-600 active:text-white"
                activeClassName="bg-yellow-600 text-white"
            />
        </div>
    </li>
);

const StatusButton = ({
    label,
    icon,
    isActive,
    onClick,
    className,
    activeClassName,
}) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 py-2 px-3 rounded-full font-medium text-sm transition-all
            ${isActive ? activeClassName : className}
        `}
    >
        {icon}
        <span className="hidden md:inline">{label}</span>
    </button>
);
