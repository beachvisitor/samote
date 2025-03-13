import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import App from '@/app';
import { Toaster as SonnerToaster } from '@/components/ui/sonner';
import { DataProvider, useData } from '@/data';

function Toaster() {
    const { theme } = useData();
    return <SonnerToaster
        richColors
        theme={theme}
        expand
        position={'top-right'}
        toastOptions={{
            classNames: {
                title: '!text-lg'
            }
        }}/>
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <DataProvider>
            <App/>
            <Toaster/>
        </DataProvider>
    </StrictMode>,
)