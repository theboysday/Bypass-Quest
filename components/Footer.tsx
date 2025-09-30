
import React from 'react';

interface FooterProps {
    feedback: string;
    attempts: number;
}

export const Footer: React.FC<FooterProps> = ({ feedback, attempts }) => {
    return (
        <footer className="fixed bottom-0 left-0 right-0 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 p-4 text-center text-gray-300 z-10">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm md:text-base"><span className="font-bold text-gray-100">Feedback:</span> {feedback}</p>
                </div>
                <div className="text-sm md:text-base">
                    <span className="font-bold text-gray-100">Bypass Attempts:</span> <span className="text-cyan-400 font-mono font-bold">{attempts}</span>
                </div>
            </div>
        </footer>
    );
};
