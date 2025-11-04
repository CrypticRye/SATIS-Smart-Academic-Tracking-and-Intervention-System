import ApplicationLogo from '@/Components/ApplicationLogo';
import Background from '../../assets/background.png';
import { Link } from '@inertiajs/react'

export default function GuestLayout({ children }) {
    return (
        <div 
            className={`flex min-h-screen flex-col items-center bg-[${`Background`}] pt-6 sm:justify-center sm:pt-0`}
            style={{
                backgroundImage: `url(${Background})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >

            <div>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
