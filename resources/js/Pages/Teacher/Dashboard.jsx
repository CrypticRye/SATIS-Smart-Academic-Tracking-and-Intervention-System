import React from "react";
import TeacherLayout from "@/Layouts/TeacherLayout";
import { Head, Link } from "@inertiajs/react";
import {
    Users,
    AlertTriangle,
    ClipboardList,
    TrendingDown,
    FileUp,
    CheckCircle2,
    BarChart,
} from "lucide-react";

import StudentRiskCard from "@/Components/StudentRiskCard";
import StatCard from "@/Components/StatCard";
import ActivityFeedItem from "@/Components/ActivityFeedItem";
import GradeUploader from "@/Components/GradeUploader";
import PrimaryButton from "@/Components/PrimaryButton";

// --- Main Dashboard Page Component ---
export default function Dashboard({
    auth,
    stats,
    priorityStudents,
    gradeDistribution,
    recentActivity,
}) {
    const currentDate = new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
    });

    const statCards = [
        {
            title: "Students at Risk",
            value: stats.studentsAtRisk,
            icon: AlertTriangle,
            iconBgColor: "bg-red-500",
            label: "grade < 75",
        },
        {
            title: "Average Grade",
            value: `${stats.averageGrade}%`,
            icon: Users,
            iconBgColor: "bg-indigo-500",
            label: "class avg",
        },
        {
            title: "Needs Attention",
            value: stats.needsAttention,
            icon: ClipboardList,
            iconBgColor: "bg-yellow-500",
            label: "missing work",
        },
        {
            title: "Recent Declines",
            value: stats.recentDeclines,
            icon: TrendingDown,
            iconBgColor: "bg-blue-500",
            label: "dropped 10+",
        },
    ];

    const totalStudentsInDistribution = Object.values(gradeDistribution).reduce((a, b) => a + b, 0);

    return (
        <TeacherLayout>
            <Head title="Teacher Dashboard" />

            {/* 1. Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">
                    Welcome Back, {auth.user.name}!
                </h1>
                <p className="text-lg text-gray-600">
                    Here's your overview for {currentDate}.
                </p>
            </div>

            {/* 2. Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat) => (
                    <StatCard
                        key={stat.title}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        iconBgColor={stat.iconBgColor}
                        label={stat.label}
                    />
                ))}
            </div>

            {/* 3. Main Content (2-col) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                {/* 3a. Left Column (Priority Students) */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Critical Students */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <AlertTriangle className="text-red-500" />
                            Critical (Grade &lt; 70)
                        </h2>
                        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                            {priorityStudents.critical.length > 0 ? (
                                priorityStudents.critical.map((student) => (
                                    <StudentRiskCard
                                        key={student.id}
                                        student={student}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    No students in critical condition.
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Warning Students */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <TrendingDown className="text-yellow-500" />
                            Warning (Grade 70-74)
                        </h2>
                        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                            {priorityStudents.warning.length > 0 ? (
                                priorityStudents.warning.map((student) => (
                                    <StudentRiskCard
                                        key={student.id}
                                        student={student}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    No students in the warning category.
                                </p>
                            )}
                        </div>
                    </div>

                     {/* Watch List Students */}
                     <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <ClipboardList className="text-blue-500" />
                            Watch List (Grade 75-79, but declining)
                        </h2>
                        <div className="bg-white rounded-xl shadow-lg p-6 space-y-4">
                            {priorityStudents.watchList.length > 0 ? (
                                priorityStudents.watchList.map((student) => (
                                    <StudentRiskCard
                                        key={student.id}
                                        student={student}
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    No students on the watch list.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* 3b. Right Column (Quick Actions, Activity) */}
                <div className="space-y-8">
                    {/* Quick Actions */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Quick Actions
                        </h2>
                        <div className="bg-white rounded-xl shadow-lg p-6 space-y-3">
                            <PrimaryButton className="w-full justify-center">
                                📤 Upload Grades
                            </PrimaryButton>
                            <Link href={route('teacher.classes.index')} className="w-full inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                📊 View Full Class List
                            </Link>
                             <Link href={route('teacher.interventions.index')} className="w-full inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                📝 Create Intervention
                            </Link>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Recent Activity
                        </h2>
                        <div className="bg-white rounded-xl shadow-lg p-6 space-y-5">
                            {recentActivity.length > 0 ? (
                                recentActivity.map((item) => (
                                    <ActivityFeedItem
                                        key={item.id}
                                        icon={ClipboardList}
                                        text={`Intervention for <strong>${item.enrollment.user.name}</strong> was created.`}
                                        time={new Date(item.created_at).toLocaleDateString()}
                                        iconBgColor="bg-yellow-500"
                                    />
                                ))
                            ) : (
                                <p className="text-gray-500">No recent activity.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Grade Distribution */}
            <div className="mt-12">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    Grade Distribution
                </h2>
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex w-full h-6 bg-gray-200 rounded-full overflow-hidden">
                        <div className="bg-red-600" style={{ width: `${(gradeDistribution['<70'] / totalStudentsInDistribution) * 100}%` }}></div>
                        <div className="bg-yellow-400" style={{ width: `${(gradeDistribution['70-74'] / totalStudentsInDistribution) * 100}%` }}></div>
                        <div className="bg-blue-400" style={{ width: `${(gradeDistribution['75-79'] / totalStudentsInDistribution) * 100}%` }}></div>
                        <div className="bg-indigo-500" style={{ width: `${(gradeDistribution['80-89'] / totalStudentsInDistribution) * 100}%` }}></div>
                        <div className="bg-green-500" style={{ width: `${(gradeDistribution['90-100'] / totalStudentsInDistribution) * 100}%` }}></div>
                    </div>
                    <div className="flex justify-around text-sm text-gray-800 mt-2">
                        <div>&lt;70 ({gradeDistribution['<70']})</div>
                        <div>70-74 ({gradeDistribution['70-74']})</div>
                        <div>75-79 ({gradeDistribution['75-79']})</div>
                        <div>80-89 ({gradeDistribution['80-89']})</div>
                        <div>90-100 ({gradeDistribution['90-100']})</div>
                    </div>
                </div>
            </div>
        </TeacherLayout>
    );
}