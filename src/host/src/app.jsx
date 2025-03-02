import { useState, useEffect} from 'react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuCheckboxItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FaPlay, FaPause, FaRotate, FaMinus } from 'react-icons/fa6';
import { IoSettingsSharp, IoClose } from 'react-icons/io5';
import { HiDotsHorizontal } from "react-icons/hi";
import socket from '@/sockets';
import Loader from '@/loader';
import { useData } from '@/data';

function App() {
    const DEFAULT_SETTINGS = {
        "open": true,
        "start": true,
        "password": "",
        "language": "auto",
        "theme": "auto",
        "arguments": "-nostats -framerate 30 -c:v libx264 -preset ultrafast -tune zerolatency -pix_fmt yuv420p -profile:v baseline -level 3.1 -bf 0 -muxdelay 0.001 -crf 20 -maxrate 3000k -bufsize 6000k -rtbufsize 100M -g 50"
    };
    const [users, setUsers] = useState({});
    const [localSettings, setLocalSettings] = useState({});
    const [url, setUrl] = useState('');
    const [init, setInit] = useState(false);
    const {
        loading,
        settings,
        setSettings,
        saveSettings,
        language,
        languages,
        state,
        start,
        stop,
        reload,
        modify
    } = useData();

    useEffect(() => {
        if (!loading) {
            setLocalSettings(settings);
            if (!init && settings?.start && language) {
                start();
                setInit(true);
            }
        }
    }, [loading, language]);

    useEffect(() => {
        const add = (id, user) => {
            if (user.type === 'host') return;
            setUsers(prev => ({
                ...prev,
                [id]: user
            }));
        };

        const modify = (id, user) => {
            if (user.type === 'host') return;
            setUsers(prev => ({
                ...prev,
                [id]: {
                    ...prev[id],
                    ...user
                }
            }));
        };

        const remove = (id) => {
            setUsers(prev => {
                const obj = { ...prev };
                delete obj[id];
                return obj;
            });
        };

        socket.on('user:add', add);
        socket.on('user:modify', modify);
        socket.on('user:remove', remove);

        return () => {
            socket.off('user:add', add);
            socket.off('user:modify', modify);
            socket.off('user:remove', remove);
        }
    }, []);

    const save = () => saveSettings(localSettings).then(data => setSettings(data));
    const setting = (obj) => setLocalSettings(prev => ({ ...prev, ...obj }));

    useEffect(() => {
        socket.on('url:set', setUrl);
        return () => socket.off('url:set', setUrl);
    }, []);

    return (
        <div className={'flex flex-col p-12 overflow-auto h-screen'} style={{gap: '5%'}}>
            <Loader active={loading}/>
            <div className={'flex items-center justify-between'}>
                <h2 className={'text-4xl font-bold tracking-tight'} style={{'-webkit-app-region': 'drag'}}>Samote</h2>
                <div className={'flex items-center space-x-2'}>
                    <Sheet onOpenChange={(state) => state && setting(settings)}>
                        <SheetTrigger asChild>
                            <Button variant={'ghost'} className={'p-3 rounded-full w-max h-max'}>
                                <IoSettingsSharp className={'!w-6 !h-6'}/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent className={'flex flex-col md:min-w-[30%]'}>
                            <SheetHeader>
                                <SheetTitle className={'text-xl font-bold'}>{language?.app?.settings?.title}</SheetTitle>
                            </SheetHeader>
                            <div className={'grid gap-5 px-1 py-4 overflow-auto'}>
                                <div className={'flex items-center justify-between space-x-2'}>
                                    <Label htmlFor={'open'} className={'text-md flex flex-col space-y-1'}>
                                        <span>{language?.app?.settings?.open?.label}</span>
                                        <span className={'font-normal leading-snug text-muted-foreground'}>
                                            {language?.app?.settings?.open?.description}
                                        </span>
                                    </Label>
                                    <Switch
                                        id={'open'}
                                        onCheckedChange={open => setting({ open })}
                                        checked={localSettings?.open}
                                    />
                                </div>
                                <div className={'flex items-center justify-between space-x-2'}>
                                    <Label htmlFor={'start'} className={'text-md flex flex-col space-y-1'}>
                                        <span>{language?.app?.settings?.start?.label}</span>
                                        <span className={'font-normal leading-snug text-muted-foreground'}>
                                            {language?.app?.settings?.start?.description}
                                        </span>
                                    </Label>
                                    <Switch
                                        id={'start'}
                                        onCheckedChange={start => setting({ start })}
                                        checked={localSettings?.start}
                                    />
                                </div>
                                <div className={'grid gap-3'}>
                                    <Label htmlFor={'password'}
                                           className={'text-md'}>{language?.app?.settings?.password}</Label>
                                    <Input
                                        id={'password'}
                                        onChange={(e) => setting({password: e.target.value})}
                                        value={localSettings?.password}
                                        className={'py-5'}
                                    />
                                </div>
                                <div className={'grid gap-3'}>
                                    <Label htmlFor={'language'}
                                           className={'text-md'}>{language?.app?.settings?.language?.label}</Label>
                                    <Select
                                        onValueChange={language => setting({ language })}
                                        value={localSettings?.language}
                                    >
                                        <SelectTrigger id={'language'} className={'py-5'}>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={'auto'}>{language?.app?.settings?.language?.auto}</SelectItem>
                                            {Object.entries(languages.current || {}).map(([key, value]) => (
                                                <SelectItem key={key} value={key}>{value?.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className={'grid gap-3'}>
                                    <Label htmlFor={'theme'}
                                           className={'text-md'}>{language?.app?.settings?.theme?.label}</Label>
                                    <Select
                                        onValueChange={theme => setting({ theme })}
                                        value={localSettings?.theme}
                                    >
                                        <SelectTrigger id={'theme'} className={'py-5'}>
                                            <SelectValue/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value={'auto'}>
                                                {language?.app?.settings?.theme?.auto}
                                            </SelectItem>
                                            <SelectItem value={'light'}>
                                                {language?.app?.settings?.theme?.light}
                                            </SelectItem>
                                            <SelectItem value={'dark'}>
                                                {language?.app?.settings?.theme?.dark}
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className={'grid gap-3'}>
                                    <Label htmlFor={'arguments'}
                                           className={'text-md'}>{language?.app?.settings?.arguments}</Label>
                                    <Textarea
                                        rows={3}
                                        id={'arguments'}
                                        onChange={(e) => setting({ arguments: e.target.value })}
                                        value={localSettings?.arguments}
                                        className={'md:text-md'}
                                    />
                                </div>
                            </div>
                            <SheetFooter>
                                <Button
                                    onClick={() => setting(DEFAULT_SETTINGS)}
                                    variant={'destructive'}
                                    className={'p-5'}
                                >
                                    {language?.app?.settings?.reset}
                                </Button>
                                <Button
                                    onClick={save}
                                    disabled={JSON.stringify(settings) === JSON.stringify(localSettings)}
                                    className={'p-5 px-8'}
                                >
                                    {language?.app?.settings?.save}
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>
                    <Button onClick={() => window.electronAPI?.minimize?.()} variant={'ghost'} className={'p-3 rounded-full w-max h-max'}>
                        <FaMinus className={'!w-6 !h-6'}/>
                    </Button>
                    <Button onClick={() => window.electronAPI?.close?.()} variant={'ghost'} className={'p-2 rounded-full w-max h-max'}>
                        <IoClose className={'!w-8 !h-8'}/>
                    </Button>
                </div>
            </div>
            <div className={'w-full sm:grid-cols-2 md:grid-cols-7 scrollbar-hide'} style={{height: '70%'}}>
                <Card className={'w-full h-full'}>
                    <CardContent className={'p-0'}>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className={'w-[200px] text-xl pl-5 py-5'}>{language?.app?.users?.ip}</TableHead>
                                    <TableHead className={'w-[225px] text-xl py-5'}>{language?.app?.users?.system}</TableHead>
                                    <TableHead className={'text-xl py-5'}>{language?.app?.users?.browser}</TableHead>
                                    <TableHead className="text-right text-xl pr-5 py-5">{language?.app?.users?.modify?.label}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {Object.entries(users).map(([id, user]) => (
                                    <TableRow key={id}>
                                        <TableCell className={'text-lg pl-5 transition-all //blur-[4px] hover:blur-none'}>{user.ip}</TableCell>
                                        <TableCell className={'text-lg'}>{[user.system?.name, user.system?.version].join(' ')}</TableCell>
                                        <TableCell className={'text-lg'}>{[user.browser?.name, user.browser?.version].join(' ')}</TableCell>
                                        <TableCell className={'text-lg text-right pr-5'}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant={'ghost'} className={'p-2.5 w-max h-max'}>
                                                        <HiDotsHorizontal className={'!w-5 !h-5'}/>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuCheckboxItem
                                                        className={'text-md'}
                                                        onSelect={(e) => e.preventDefault()}
                                                        checked={user.access?.view}
                                                        onCheckedChange={(view) => modify(id, { access: { ...user.access, view } })}
                                                    >
                                                        {language?.app?.users?.modify?.view}
                                                    </DropdownMenuCheckboxItem>
                                                    <DropdownMenuCheckboxItem
                                                        className={'text-md'}
                                                        onSelect={(e) => e.preventDefault()}
                                                        checked={user.access?.touch}
                                                        onCheckedChange={(touch) => modify(id, { access: { ...user.access, touch } })}
                                                    >
                                                        {language?.app?.users?.modify?.touch}
                                                    </DropdownMenuCheckboxItem>
                                                    <DropdownMenuCheckboxItem
                                                        className={'text-md'}
                                                        onSelect={(e) => e.preventDefault()}
                                                        checked={user.access?.keyboard}
                                                        onCheckedChange={(keyboard) => modify(id, { access: { ...user.access, keyboard } })}
                                                    >
                                                        {language?.app?.users?.modify?.keyboard}
                                                    </DropdownMenuCheckboxItem>
                                                    <DropdownMenuCheckboxItem
                                                        className={'text-md text-destructive font-medium'}
                                                        onSelect={(e) => e.preventDefault()}
                                                        checked={user.auth}
                                                        onCheckedChange={(auth) => modify(id, { auth })}
                                                    >
                                                        {language?.app?.users?.modify?.auth}
                                                    </DropdownMenuCheckboxItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
            <div className={'flex items-center gap-5'} style={{height: '15%'}}>
                <Input
                    readOnly
                    onChange={(e) => setting({host: e.target.value})}
                    defaultValue={url}
                    className={'!text-2xl py-7'}
                />
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button
                                onClick={reload}
                                variant={'secondary'}
                                className={'px-5 py-7'}
                            >
                                <FaRotate/>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent className={'text-md'}>{language?.app?.reload}</TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <Button
                    onClick={() => !state ? start() : stop()}
                    className={'text-2xl px-20 py-7'}
                >
                    <div
                        className={cn(
                            'flex items-center gap-2 transition-all',
                            !state ? "scale-100 opacity-100" : "scale-75 opacity-0",
                        )}
                    >
                        <FaPlay className={'!w-4 !h-4'}/>
                        {language?.app?.start}
                    </div>
                    <div
                        className={cn(
                            'absolute flex items-center gap-2 transition-all',
                            state ? "scale-100 opacity-100" : "scale-75 opacity-0",
                        )}
                    >
                        <FaPause className={'!w-5 !h-5'}/>
                        {language?.app?.stop}
                    </div>
                </Button>
            </div>
        </div>
    )
}

export default App
