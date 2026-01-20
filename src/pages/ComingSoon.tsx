import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Rocket, Clock } from 'lucide-react';
import { useUser } from '@/contexts/UserContext';

const ComingSoon = () => {
    const navigate = useNavigate();
    const { logout } = useUser();

    const handleGoHome = () => {
        // Logout user and navigate to home
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center p-6">
            <div className="max-w-2xl mx-auto text-center">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <img
                        src="/logo-main-no-bg.svg"
                        alt="Diligince AI"
                        className="h-16 w-auto"
                    />
                </div>

                {/* Title */}
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 tracking-tight">
                    Coming Soon
                </h1>

                {/* Subtitle */}
                <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-lg mx-auto leading-relaxed">
                    We're building something amazing. <br />
                    <span className="text-blue-600 font-medium">Diligince AI</span> is launching soon.
                </p>

                {/* Icon Decoration */}
                <div className="flex justify-center gap-6 mb-10">
                    <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
                        <Rocket className="h-7 w-7 text-blue-600" />
                    </div>
                    <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Clock className="h-7 w-7 text-indigo-600" />
                    </div>
                </div>

                {/* Description */}
                <p className="text-gray-500 mb-10 max-w-md mx-auto">
                    Your procurement intelligence platform is under final preparations.
                    Stay tuned for the launch.
                </p>

                {/* Home Button */}
                <Button
                    onClick={handleGoHome}
                    size="lg"
                    className="gap-2 px-8 py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
                >
                    <Home className="h-5 w-5" />
                    Go to Home
                </Button>

                {/* Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                    <p className="text-sm text-gray-400">
                        © 2026 Diligince Technologies Pvt. Ltd. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ComingSoon;
