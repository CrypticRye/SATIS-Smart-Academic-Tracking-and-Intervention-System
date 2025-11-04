import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    const Sidebar = () => {
        return (
            <div className="w-64 h-full bg-gray-800 text-white">
                <div className="p-4 font-bold text-lg border-b border-gray-700">
                    Sidebar
                </div>
                <ul className="mt-4">
                    <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        Dashboard
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        Profile
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">
                        Settings
                    </li>
                </ul>
            </div>
        );
    }
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Sidebar />
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
