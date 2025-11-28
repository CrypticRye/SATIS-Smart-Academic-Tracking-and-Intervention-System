import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

const WelcomeScreen = ({ title, description, screenNumber, totalScreens }) => (
    <div className="flex flex-col items-center justify-center text-center p-6 sm:p-10">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {title}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mb-8">
            {description}
        </p>
        <div className="text-sm text-gray-500 dark:text-gray-400">
            {screenNumber} / {totalScreens}
        </div>
    </div>
);

export default function Welcome() {
    const [screen, setScreen] = useState(1);
    const totalScreens = 3;

    const nextScreen = () => {
        if (screen < totalScreens) {
            setScreen(screen + 1);
        } else {
            router.visit(route('login'));
        }
    };

    const prevScreen = () => {
        if (screen > 1) {
            setScreen(screen - 1);
        }
    };

    const handleLoginClick = () => {
        router.visit(route('login'));
    };

    return (
        <>
            <Head title={`Welcome - Screen ${screen}`} />

            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100 dark:bg-gray-900">
                <div className="flex justify-center mb-8">
                    <ApplicationLogo className="w-32 h-32 fill-current text-gray-500" />
                </div>

                <div className="w-full sm:max-w-3xl mt-6 px-6 py-8 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                    {screen === 1 && (
                        <WelcomeScreen
                            title="Welcome to SATIS"
                            description="Smart Academic Tracking and Intervention System (SATIS) is designed to empower educators and support students effectively. We provide comprehensive tools to monitor academic progress, identify at-risk students, and implement timely interventions."
                            screenNumber={1}
                            totalScreens={totalScreens}
                        />
                    )}
                    {screen === 2 && (
                        <WelcomeScreen
                            title="Unlock Student Potential"
                            description="With SATIS, you can gain insights into student performance through intuitive dashboards and analytics. Proactively address learning gaps and foster an environment where every student has the opportunity to succeed."
                            screenNumber={2}
                            totalScreens={totalScreens}
                        />
                    )}
                    {screen === 3 && (
                        <WelcomeScreen
                            title="Streamline Interventions"
                            description="Our system simplifies the process of creating, tracking, and managing intervention plans. Collaborate with ease, assign tasks, and monitor the effectiveness of support strategies, all in one place."
                            screenNumber={3}
                            totalScreens={totalScreens}
                        />
                    )}

                    <div className="flex justify-between mt-8 p-4">
                        {screen > 1 && (
                            <button
                                onClick={prevScreen}
                                className="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 border border-transparent rounded-md font-semibold text-xs text-gray-700 dark:text-gray-200 uppercase tracking-widest hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition ease-in-out duration-150"
                            >
                                Back
                            </button>
                        )}
                        {screen < totalScreens && (
                            <button
                                onClick={nextScreen}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ml-auto"
                            >
                                Next
                            </button>
                        )}
                        {screen === totalScreens && (
                            <button
                                onClick={handleLoginClick}
                                className="inline-flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition ease-in-out duration-150 ml-auto"
                            >
                                Get Started (Login)
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

