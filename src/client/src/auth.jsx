import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import Loader from '@/loader';
import { FiLogIn } from "react-icons/fi";
import { useData } from '@/data';

function Auth() {
    const [password, setPassword] = useState('');
    const { loading, language, auth } = useData();

    const send = () => auth(password);

    return (
        <div className={'fixed inset-0 flex flex-col items-center justify-center text-center'}>
            <Loader active={loading}/>
            <div className={'flex flex-col gap-5'}>
                <div className={'flex flex-col items-center gap-3'}>
                    <h1 className={'text-4xl font-medium'}>{language?.client?.auth?.title}</h1>
                    <p className={'text-xl text-muted-foreground'}>{language?.client?.auth?.description}</p>
                </div>
                <div className={'flex justify-between gap-1.5'}>
                    <Input
                        autoFocus
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={'!text-lg h-full'}
                        placeholder={language?.client?.auth?.password}
                        onKeyUp={(e) => e.key === 'Enter' && send()}
                    />
                    <Button variant={'default'} className={'p-3 text-lg w-max h-max'} onClick={send}>
                        <FiLogIn className={'!w-6 !h-6'}/>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default Auth;