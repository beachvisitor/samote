import React, { useState, useRef, useEffect, useContext } from 'react';
import api from '@/api';
import { toast } from 'sonner';
import socket from '@/socket';

const DataContext = React.createContext(null);

function DataProvider({ children }) {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState({});
    const [language, setLanguage] = useState({});
    const languages = useRef({});
    const layouts = useRef({});
    const [theme, setTheme] = useState('');
    const [user, setUser] = useState(null);
    const [state, setState] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                const [
                    settingsResponse,
                    languagesResponse,
                    layoutsResponse
                ] = await Promise.all([
                    api.get('api/settings'),
                    api.get('api/languages'),
                    api.get('api/layouts')
                ]);

                const settingsData = settingsResponse.data;
                const languagesData = languagesResponse.data;
                const layoutsData = layoutsResponse.data;

                setSettings(settingsData);
                languages.current = languagesData;
                layouts.current = layoutsData;
                setTimeout(() => setLoading(false), 0);
            } catch (e) {
                console.error(e);
                toast.error(e.message);
            }
        }
        fetch().then();
    }, []);

    const saveSettings = (data = settings) => {
        return api.post(`api/settings`, data)
            .then(() => {
                toast.success(language?.messages?.save?.success);
                return data;
            })
            .catch(() => toast.error(language?.messages?.save?.error));
    };

    useEffect(() => {
        const theme = settings.theme || localStorage.getItem('theme');
        handleLanguage(settings.language);
        handleTheme(theme);
        const media = window.matchMedia('(prefers-color-scheme: dark)');
        const listener = () => handleTheme(theme);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [settings]);

    const handleLanguage = (id) => {
        setLanguage(languages.current[prepareLanguage(id)]);
    };

    const handleTheme = (id) => {
        const theme = prepareTheme(id);
        localStorage.setItem('theme', theme);
        window.document.documentElement.classList.remove('light', 'dark');
        window.document.documentElement.classList.add(theme);
        setTheme(theme);
    };

    const prepareLanguage = (id) => {
        id = id || 'auto';
        if (id === 'auto') {
            const auto = navigator.language || navigator.languages[0] || 'en';
            return auto in languages.current ? auto : 'en';
        }
        return id;
    };

    const prepareTheme = (id) => {
        id = id || 'auto';
        if (id === 'auto') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        }
        return id;
    };

    useEffect(() => {
        api.post(`/api/user/verify`).catch(() => setUser(null));
        socket.on('user:modify', setUser);
        return () => socket.off('user:modify', setUser);
    }, []);

    const auth = (password) => {
        api.post(`/api/user/auth`, { password })
            .then(() => toast.success(language?.messages?.auth?.success))
            .catch(e => {
                const dict = {
                    400: language?.messages?.auth?.wrong,
                    429: language?.messages?.limit,
                };
                toast.error(dict[e?.response?.status] || language?.messages?.auth?.error);
            });
    };

    useEffect(() => {
        socket.on('stream:update', setState);
        return () => socket.off('stream:update', setState);
    }, []);

    const handleStream = (path) => {
        api.post(`/api/stream/${path}`)
            .then(() => toast.success(language?.messages?.[path].success))
            .catch(() => toast.error(language?.messages?.[path].error));
    };

    const start = () => handleStream('start');
    const stop = () => handleStream('stop');
    const reload = () => handleStream('reload');

    const modify = (id, user) => {
        api.post(`/api/user/${id}/modify`, user)
            .then(() => toast.success(language?.messages?.modify?.success))
            .catch(() => toast.error(language?.messages?.modify?.error));
    };

    return (
        <DataContext.Provider
            value={{
                loading,
                setLoading,
                settings,
                setSettings,
                saveSettings,
                language,
                setLanguage: handleLanguage,
                languages,
                layouts,
                theme,
                setTheme: handleTheme,
                user,
                setUser,
                auth,
                state,
                start,
                stop,
                reload,
                modify
            }}
        >
            {children}
        </DataContext.Provider>
    );
}

function useData() {
    return useContext(DataContext);
}

export { DataProvider, useData };