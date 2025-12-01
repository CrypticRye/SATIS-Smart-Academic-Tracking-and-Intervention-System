import React, { useMemo } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    CartesianGrid,
} from "recharts";
import {
    FileDown,
    Lightbulb,
    Bot,
    AlertTriangle,
    CheckCircle2,
    Star,
    ThumbsUp,
    Calendar,
    BookOpen,
    Target,
    ChevronRight,
    TrendingUp,
    TrendingDown,
    Clock,
    Award,
} from "lucide-react";

// --- Helper Components ---

// Helper function to calculate expected grade (simple projection)
const calculateExpectedGrade = (currentGrade, assignmentCount) => {
    if (currentGrade === null || assignmentCount === 0) return null;
    // Simple projection - in real scenario this could be more sophisticated
    // Adding a small boost for expected performance
    const expected = Math.min(100, Math.round(currentGrade * 1.02));
    return expected;
};

// Helper function to get grade color
const getGradeColor = (grade) => {
    if (grade === null) return "text-gray-400";
    if (grade >= 90) return "text-green-600";
    if (grade >= 85) return "text-blue-600";
    if (grade >= 80) return "text-blue-500";
    if (grade >= 75) return "text-yellow-600";
    return "text-red-600";
};

// Helper function to get remarks
const getRemarks = (grade) => {
    if (grade === null)
        return { text: "N/A", bg: "bg-gray-100", color: "text-gray-600" };
    if (grade >= 90)
        return {
            text: "Excellent",
            bg: "bg-green-100",
            color: "text-green-700",
        };
    if (grade >= 85)
        return { text: "Very Good", bg: "bg-blue-100", color: "text-blue-700" };
    if (grade >= 80)
        return { text: "Good", bg: "bg-blue-50", color: "text-blue-600" };
    if (grade >= 75)
        return {
            text: "Satisfactory",
            bg: "bg-yellow-100",
            color: "text-yellow-700",
        };
    return {
        text: "Needs Improvement",
        bg: "bg-red-100",
        color: "text-red-700",
    };
};

// Quarter Grade Card Component
const QuarterGradeCard = ({
    quarter,
    quarterNum,
    grade,
    expectedGrade,
    attendance,
    assignmentCount,
    hasStarted = true,
}) => {
    const remarks = getRemarks(grade);
    const gradeColor = getGradeColor(grade);
    const expectedColor = getGradeColor(expectedGrade);

    // Card for quarters that haven't started - NO expected grade, just message
    if (!hasStarted) {
        return (
            <div className="bg-white rounded-2xl shadow-md p-5 border border-dashed border-gray-200">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-lg font-bold text-gray-400">
                                Q{quarterNum}
                            </span>
                        </div>
                        <h3 className="text-base font-semibold text-gray-700">
                            Quarter {quarterNum}
                        </h3>
                    </div>
                    <Clock size={20} className="text-gray-300" />
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-4xl font-bold text-gray-300 mb-2">--</p>
                    <p className="text-sm text-gray-500">
                        Quarter {quarterNum} has not started yet.
                    </p>
                </div>
            </div>
        );
    }

    // Card for active quarters with actual data
    return (
        <div className="bg-white rounded-2xl shadow-md p-5 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            grade !== null && grade >= 75
                                ? "bg-green-100"
                                : grade !== null
                                ? "bg-red-100"
                                : "bg-gray-100"
                        }`}
                    >
                        <span
                            className={`text-lg font-bold ${
                                grade !== null && grade >= 75
                                    ? "text-green-600"
                                    : grade !== null
                                    ? "text-red-600"
                                    : "text-gray-400"
                            }`}
                        >
                            Q{quarterNum}
                        </span>
                    </div>
                    <div>
                        <h3 className="text-base font-semibold text-gray-800">
                            Quarter {quarterNum}
                        </h3>
                        <span
                            className={`px-2 py-0.5 rounded-full text-xs font-medium ${remarks.bg} ${remarks.color}`}
                        >
                            {remarks.text}
                        </span>
                    </div>
                </div>
                {grade !== null && grade >= 90 && (
                    <Award size={20} className="text-yellow-500" />
                )}
            </div>

            {/* Current Grade */}
            <div className="bg-gray-50 rounded-lg p-3 text-center mb-3">
                <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Current Grade
                </p>
                <p className={`text-4xl font-bold ${gradeColor}`}>
                    {grade !== null ? grade : "--"}
                </p>
            </div>

            {/* Expected Grade - only show if quarter has started */}
            <div className="bg-blue-50 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <TrendingUp size={14} className="text-blue-600" />
                        <span className="text-xs font-medium text-blue-700">
                            Expected
                        </span>
                    </div>
                    <span className={`text-xl font-bold ${expectedColor}`}>
                        {expectedGrade !== null ? expectedGrade : "--"}
                    </span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-green-600">
                        {attendance}
                    </p>
                    <p className="text-xs text-gray-500">Attendance</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-2 text-center">
                    <p className="text-sm font-bold text-purple-600">
                        {assignmentCount}
                    </p>
                    <p className="text-xs text-gray-500">Items</p>
                </div>
            </div>
        </div>
    );
};

// Quarterly Grades Cards Section
const QuarterlyGradesCards = ({ data }) => {
    // Find Q1 and Q2 data
    const q1Data = data.find((q) => q.quarterNum === 1);
    const q2Data = data.find((q) => q.quarterNum === 2);
    const q3Data = data.find((q) => q.quarterNum === 3);
    const q4Data = data.find((q) => q.quarterNum === 4);

    // Determine if quarters have started (based on whether there are assignments)
    const q1HasStarted = q1Data && q1Data.assignmentCount > 0;
    const q2HasStarted = q2Data && q2Data.assignmentCount > 0;
    const q3HasStarted = q3Data && q3Data.assignmentCount > 0;
    const q4HasStarted = q4Data && q4Data.assignmentCount > 0;

    // Calculate expected grades
    const q1Expected = q1HasStarted
        ? calculateExpectedGrade(q1Data.grade, q1Data.assignmentCount)
        : null;
    const q2Expected = q1HasStarted
        ? q2HasStarted
            ? calculateExpectedGrade(q2Data.grade, q2Data.assignmentCount)
            : calculateExpectedGrade(q1Data.grade, q1Data.assignmentCount)
        : null;

    // If no data at all
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar size={22} className="text-pink-600" />
                    Quarterly Grades
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <QuarterGradeCard
                        quarter="Q1"
                        quarterNum={1}
                        grade={null}
                        expectedGrade={null}
                        attendance="--"
                        assignmentCount={0}
                        hasStarted={false}
                    />
                    <QuarterGradeCard
                        quarter="Q2"
                        quarterNum={2}
                        grade={null}
                        expectedGrade={null}
                        attendance="--"
                        assignmentCount={0}
                        hasStarted={false}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                <Calendar size={22} className="text-pink-600" />
                Quarterly Grades
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* First Quarter Card */}
                <QuarterGradeCard
                    quarter="Q1"
                    quarterNum={1}
                    grade={q1HasStarted ? q1Data.grade : null}
                    expectedGrade={q1Expected}
                    attendance={q1HasStarted ? q1Data.attendance : "--"}
                    assignmentCount={q1HasStarted ? q1Data.assignmentCount : 0}
                    hasStarted={q1HasStarted}
                />

                {/* Second Quarter Card */}
                <QuarterGradeCard
                    quarter="Q2"
                    quarterNum={2}
                    grade={q2HasStarted ? q2Data.grade : null}
                    expectedGrade={q2Expected}
                    attendance={q2HasStarted ? q2Data.attendance : "--"}
                    assignmentCount={q2HasStarted ? q2Data.assignmentCount : 0}
                    hasStarted={q2HasStarted}
                />
            </div>

            {/* Show Q3 and Q4 if they exist */}
            {(q3Data || q4Data) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q3Data && (
                        <QuarterGradeCard
                            quarter="Q3"
                            quarterNum={3}
                            grade={q3HasStarted ? q3Data.grade : null}
                            expectedGrade={
                                q3HasStarted
                                    ? calculateExpectedGrade(
                                          q3Data.grade,
                                          q3Data.assignmentCount
                                      )
                                    : q2Expected
                            }
                            attendance={q3HasStarted ? q3Data.attendance : "--"}
                            assignmentCount={
                                q3HasStarted ? q3Data.assignmentCount : 0
                            }
                            hasStarted={q3HasStarted}
                        />
                    )}
                    {q4Data && (
                        <QuarterGradeCard
                            quarter="Q4"
                            quarterNum={4}
                            grade={q4HasStarted ? q4Data.grade : null}
                            expectedGrade={
                                q4HasStarted
                                    ? calculateExpectedGrade(
                                          q4Data.grade,
                                          q4Data.assignmentCount
                                      )
                                    : q3HasStarted
                                    ? calculateExpectedGrade(
                                          q3Data?.grade,
                                          q3Data?.assignmentCount
                                      )
                                    : q2Expected
                            }
                            attendance={q4HasStarted ? q4Data.attendance : "--"}
                            assignmentCount={
                                q4HasStarted ? q4Data.assignmentCount : 0
                            }
                            hasStarted={q4HasStarted}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

// Grade Breakdown Table
const GradeBreakdown = ({ data }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Grade Breakdown
                </h3>
                <div className="text-center py-8">
                    <BookOpen
                        size={40}
                        className="mx-auto text-gray-300 mb-3"
                    />
                    <p className="text-gray-500">No assignments graded yet.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Grade Breakdown
            </h3>
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {data.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-800 truncate">
                                {item.name}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span>Q{item.quarter}</span>
                                <span>•</span>
                                <span>{item.createdAt}</span>
                            </div>
                        </div>
                        <div className="text-right ml-4">
                            <p
                                className={`text-lg font-bold ${
                                    item.percentage >= 90
                                        ? "text-green-600"
                                        : item.percentage >= 80
                                        ? "text-blue-600"
                                        : item.percentage >= 75
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                }`}
                            >
                                {item.score}/{item.totalScore}
                            </p>
                            <p className="text-sm text-gray-500">
                                {item.percentage}%
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Bar Chart Component - Compact and optimized
const GradeChart = ({ data }) => {
    // Filter only quarters that have grades
    const activeQuarters =
        data?.filter((q) => q.grade !== null && q.assignmentCount > 0) || [];

    if (activeQuarters.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-md p-4">
                <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <TrendingUp size={16} className="text-pink-600" />
                    Grade Trend
                </h3>
                <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
                    <p className="text-gray-400 text-sm">No data yet</p>
                </div>
            </div>
        );
    }

    const chartData = activeQuarters.map((q) => ({
        name: q.quarter,
        Grade: q.grade || 0,
    }));

    return (
        <div className="bg-white rounded-2xl shadow-md p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <TrendingUp size={16} className="text-pink-600" />
                Grade Trend
            </h3>
            <div className="h-40">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                    >
                        <XAxis
                            dataKey="name"
                            stroke="#9ca3af"
                            fontSize={11}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#9ca3af"
                            fontSize={10}
                            domain={[0, 100]}
                            tickLine={false}
                            axisLine={false}
                            ticks={[0, 50, 75, 100]}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "8px",
                                border: "none",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                                fontSize: "12px",
                                padding: "8px 12px",
                            }}
                            formatter={(value) => [`${value}%`, "Grade"]}
                        />
                        <Bar
                            dataKey="Grade"
                            fill="#ec4899"
                            radius={[4, 4, 0, 0]}
                            maxBarSize={40}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

// Attendance Summary Card - Compact
const AttendanceSummary = ({ attendance }) => {
    if (!attendance) return null;

    return (
        <div className="bg-white rounded-2xl shadow-md p-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-pink-600" />
                Attendance
            </h3>
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-xl font-bold text-green-600">
                        {attendance.rate}%
                    </p>
                    <p className="text-xs text-gray-500">Rate</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-2 text-center">
                    <p className="text-xl font-bold text-blue-600">
                        {attendance.presentDays}
                    </p>
                    <p className="text-xs text-gray-500">Present</p>
                </div>
                <div className="bg-red-50 rounded-lg p-2 text-center">
                    <p className="text-xl font-bold text-red-600">
                        {attendance.absentDays}
                    </p>
                    <p className="text-xs text-gray-500">Absent</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-2 text-center">
                    <p className="text-xl font-bold text-yellow-600">
                        {attendance.lateDays}
                    </p>
                    <p className="text-xs text-gray-500">Late</p>
                </div>
            </div>
        </div>
    );
};

// Intervention Card - Compact
const InterventionCard = ({ intervention }) => {
    if (!intervention) return null;

    const progressPercent =
        intervention.totalTasks > 0
            ? Math.round(
                  (intervention.completedTasks / intervention.totalTasks) * 100
              )
            : 0;

    return (
        <div className="bg-white rounded-2xl shadow-md p-4 border border-orange-200">
            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-orange-100 rounded-lg">
                    <Target size={16} className="text-orange-600" />
                </div>
                <div>
                    <h3 className="text-sm font-semibold text-gray-800">
                        Intervention
                    </h3>
                    <p className="text-xs text-orange-600">
                        {intervention.typeLabel}
                    </p>
                </div>
            </div>

            {intervention.notes && (
                <p className="text-gray-600 text-xs mb-3 bg-orange-50 p-2 rounded-lg line-clamp-2">
                    {intervention.notes}
                </p>
            )}

            {intervention.totalTasks > 0 && (
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Progress</span>
                        <span className="font-medium text-gray-700">
                            {intervention.completedTasks}/
                            {intervention.totalTasks}
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                            className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

// Suggestions Component
const SuggestionsCard = ({ suggestions }) => {
    if (!suggestions || suggestions.length === 0) return null;

    const getIcon = (type, iconName) => {
        if (iconName === "star") return <Star size={20} />;
        if (iconName === "thumbs-up") return <ThumbsUp size={20} />;
        if (iconName === "lightbulb") return <Lightbulb size={20} />;
        if (iconName === "alert") return <AlertTriangle size={20} />;
        if (iconName === "alert-triangle") return <AlertTriangle size={20} />;
        if (iconName === "calendar") return <Calendar size={20} />;
        if (iconName === "book") return <BookOpen size={20} />;
        return <Lightbulb size={20} />;
    };

    const getColors = (type) => {
        switch (type) {
            case "success":
                return {
                    bg: "bg-green-50",
                    border: "border-green-200",
                    text: "text-green-800",
                    icon: "text-green-600",
                };
            case "warning":
                return {
                    bg: "bg-yellow-50",
                    border: "border-yellow-200",
                    text: "text-yellow-800",
                    icon: "text-yellow-600",
                };
            case "danger":
                return {
                    bg: "bg-red-50",
                    border: "border-red-200",
                    text: "text-red-800",
                    icon: "text-red-600",
                };
            default:
                return {
                    bg: "bg-blue-50",
                    border: "border-blue-200",
                    text: "text-blue-800",
                    icon: "text-blue-600",
                };
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Lightbulb size={22} className="text-pink-600" />
                Suggestions & Tips
            </h3>
            <div className="space-y-3">
                {suggestions.map((suggestion, index) => {
                    const colors = getColors(suggestion.type);
                    return (
                        <div
                            key={index}
                            className={`${colors.bg} border ${colors.border} rounded-xl p-4`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`flex-shrink-0 ${colors.icon}`}>
                                    {getIcon(suggestion.type, suggestion.icon)}
                                </div>
                                <div>
                                    <h4
                                        className={`font-semibold ${colors.text}`}
                                    >
                                        {suggestion.title}
                                    </h4>
                                    <p
                                        className={`text-sm ${colors.text} opacity-90 mt-1`}
                                    >
                                        {suggestion.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// Study Aids Component
const StudyAids = () => (
    <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-pink-200">
        <div className="flex items-center gap-3 mb-2">
            <Bot className="w-6 h-6 text-pink-600" />
            <h3 className="text-xl font-semibold text-gray-800">
                Personalized Study Aids
            </h3>
        </div>
        <p className="text-gray-700 mb-4">
            Struggling in certain areas? Let A.I. create a custom reviewer to
            help you catch up!
        </p>
        <button className="w-full bg-pink-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-pink-700 transition-colors flex items-center justify-center gap-2">
            <Bot size={18} />
            Generate Personalized Quiz
        </button>
    </div>
);

// --- Main Page Component ---
const AnalyticsShow = ({
    enrollment = {},
    subject = {},
    performance = {},
    attendance = {},
    intervention = null,
    suggestions = [],
}) => {
    const {
        overallGrade,
        quarterlyGrades = [],
        gradeBreakdown = [],
    } = performance;

    // Determine grade status
    const gradeStatus = useMemo(() => {
        if (overallGrade === null)
            return { color: "text-gray-400", label: "No data" };
        if (overallGrade >= 90)
            return { color: "text-green-600", label: "Excellent" };
        if (overallGrade >= 85)
            return { color: "text-blue-600", label: "Very Good" };
        if (overallGrade >= 80)
            return { color: "text-blue-500", label: "Good" };
        if (overallGrade >= 75)
            return { color: "text-yellow-600", label: "Satisfactory" };
        return { color: "text-red-600", label: "Needs Improvement" };
    }, [overallGrade]);

    return (
        <AuthenticatedLayout>
            <Head title={subject.name || "Subject Analytics"} />

            <div className="max-w-7xl mx-auto space-y-6">
                {/* Breadcrumbs */}
                <div className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <Link
                        href={route("analytics.index")}
                        className="hover:text-pink-600 transition-colors"
                    >
                        Performance Analytics
                    </Link>
                    <ChevronRight size={16} />
                    <span className="text-gray-900">{subject.name}</span>
                </div>

                {/* Header */}
                <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            {subject.name}
                        </h1>
                        <p className="text-lg text-gray-600">
                            {subject.teacher} • {subject.schoolYear}
                            {subject.section && ` • ${subject.section}`}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="flex items-center gap-2 bg-pink-600 text-white font-semibold py-2 px-4 rounded-xl hover:bg-pink-700 transition-colors">
                            <FileDown size={18} />
                            Export PDF
                        </button>
                        <div className="text-right">
                            <p className="text-sm font-medium text-gray-500">
                                CURRENT GRADE
                            </p>
                            <div className="flex items-end gap-2">
                                <p
                                    className={`text-6xl font-bold ${gradeStatus.color}`}
                                >
                                    {overallGrade !== null ? overallGrade : "—"}
                                </p>
                                {overallGrade !== null && (
                                    <span
                                        className={`text-sm font-medium ${gradeStatus.color} mb-2`}
                                    >
                                        {gradeStatus.label}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <QuarterlyGradesCards data={quarterlyGrades} />
                        <GradeBreakdown data={gradeBreakdown} />
                        <SuggestionsCard suggestions={suggestions} />
                        <StudyAids />
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        <GradeChart data={quarterlyGrades} />
                        <AttendanceSummary attendance={attendance} />
                        {intervention && (
                            <InterventionCard intervention={intervention} />
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default AnalyticsShow;
