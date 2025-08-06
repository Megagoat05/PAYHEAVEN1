import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import ChangePassword from "./ChangePassword";

const timezones = [
    'UTC', 'GMT', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'Europe/London', 'Europe/Berlin', 'Europe/Moscow', 'Asia/Tokyo', 'Australia/Sydney'
];

const languages = [
    { code: 'en-US', name: 'English (US)' },
    { code: 'en-GB', name: 'English (UK)' },
    { code: 'es-ES', name: 'Español' },
    { code: 'fr-FR', name: 'Français' },
    { code: 'de-DE', name: 'Deutsch' },
];

const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="glass-card p-6 rounded-lg">
        <h3 className="font-orbitron text-xl font-bold mb-4 border-b border-white/10 pb-2 text-glow-blue">{title}</h3>
        {children}
    </div>
);

export const AccountPage = () => {
    const { user, updateUser, updatePassword } = useAuth();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState({ type: '', message: '' });

    const handleSettingsSave = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const formData = new FormData(form);
        const language = formData.get('language') as string;
        const timezone = formData.get('timezone') as string;
        const is2FAEnabled = (formData.get('2fa') as string) === 'on';

        updateUser({ language, timezone, is2FAEnabled });
        setStatus({ type: 'success', message: 'Preferences saved successfully!' });
        setTimeout(() => setStatus({ type: '', message: '' }), 3000);
    };

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        try {
            await updatePassword(currentPassword, newPassword);
            setStatus({ type: 'success', message: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
        } catch (error: any) {
            setStatus({ type: 'error', message: error.message || 'Failed to update password.' });
        } finally {
            setTimeout(() => setStatus({ type: '', message: '' }), 3000);
        }
    };
    
    if (!user) return null;

    return (
        <div>
            <h1 className="font-orbitron text-4xl font-bold mb-8 text-glow-pink">Account Settings</h1>
            <div className="space-y-8">
                <FormSection title="User Profile">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-400">Username</label>
                            <p className="text-lg">{user.username}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-400">Email</label>
                            <p className="text-lg">{user.email}</p>
                        </div>
                    </div>
                </FormSection>

                <FormSection title="Change Password">
                    <form onSubmit={handlePasswordChange} className="space-y-4">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Current Password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                         <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-slate-400">
                                {showPassword ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                            </button>
                        </div>
                        <button type="submit" className="bg-fuchsia-500 text-white font-bold py-2 px-4 rounded-md hover:bg-fuchsia-600 transition-colors neon-pink-shadow">Update Password</button>
                    </form>
                </FormSection>
                
                <FormSection title="Preferences & Security">
                    <form onSubmit={handleSettingsSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                                <label htmlFor="language" className="block text-sm font-bold text-slate-400 mb-1">Language</label>
                                <select name="language" id="language" defaultValue={user.language} className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                    {languages.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                                </select>
                           </div>
                           <div>
                                <label htmlFor="timezone" className="block text-sm font-bold text-slate-400 mb-1">Timezone</label>
                                <select name="timezone" id="timezone" defaultValue={user.timezone} className="w-full bg-slate-900/50 border border-slate-700 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-400">
                                    {timezones.map(tz => <option key={tz} value={tz}>{tz}</option>)}
                                </select>
                           </div>
                        </div>
                         <div>
                            <label className="flex items-center space-x-3 cursor-pointer">
                                <span className="text-sm font-bold text-slate-400">Enable 2FA</span>
                                <div className="relative">
                                    <input type="checkbox" name="2fa" defaultChecked={user.is2FAEnabled} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                                </div>
                                <span className="text-xs text-slate-500">(Recommended)</span>
                            </label>
                        </div>
                        <button type="submit" className="bg-cyan-400 text-black font-bold py-2 px-4 rounded-md hover:bg-cyan-300 transition-colors neon-blue-shadow">Save Preferences</button>
                    </form>
                </FormSection>
                 {status.message && (
                    <div className={`p-3 rounded-md text-center ${status.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        {status.message}
                    </div>
                )}
            </div>
        </div>
    );
};
<section>
  <h2 className="text-xl font-bold mb-4">Change Password</h2>
  <ChangePassword />
</section>
