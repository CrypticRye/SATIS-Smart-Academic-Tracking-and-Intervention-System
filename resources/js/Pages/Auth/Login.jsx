import ApplicationLogo from '@/Components/ApplicationLogo';
import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import Spacer from '@/Components/util/Spacer';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Eye, EyeClosed } from 'lucide-react';
import { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const submit = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <Spacer height={30} />
                <Link href='/' className='w-full flex justify-center'>
                    <ApplicationLogo className="h-[172px] w-[172px] fill-current text-gray-500" />
                </Link>
                <div className="w-[85%] flex flex-col mx-auto">
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full border-primary"
                        autoComplete="username"
                        isFocused={true}
                        placeholder="Enter your email"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="relative mt-4">
                    <InputLabel htmlFor="password" value="Password" />
                    <TextInput
                        id="password"
                        type={showPassword? 'text' : 'password'}
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full border-primary"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />
                    <button type='button' onClick={() => setShowPassword(!showPassword)} className='absolute right-3 top-8'>
                        {showPassword ? (<Eye className='fill-primary' />) : 
                        (<EyeClosed className='' />)}
                    </button>
                    
                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 relative flex items-center flex-col justify-between">
                    <PrimaryButton className="w-full bg-primary flex justify-center" disabled={processing}>
                        Sign in
                    </PrimaryButton>
                    <Spacer />
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                        )}     
                </div>
                </div>
            </form>
        </GuestLayout>
    );
}
