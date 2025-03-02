import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import App from '@/app';
import { Toaster } from '@/components/ui/sonner';
import { DataProvider } from "@/data";

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <DataProvider>
            <App/>
            <Toaster richColors expand position={'top-right'} toastOptions={{
                classNames: {
                    title: '!text-lg'
                }
            }}/>
        </DataProvider>
    </StrictMode>,
)