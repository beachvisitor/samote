import React, { useContext, useEffect, useRef, useState } from "react";
import { FaBackspace, FaGlobe } from "react-icons/fa";
import { MdKeyboardTab, MdWindow } from "react-icons/md";
import { PiArrowsDownUpBold } from "react-icons/pi";
import { IoArrowBack } from "react-icons/io5";
import { LuArrowUpToLine } from "react-icons/lu";
import { RiFileListLine } from "react-icons/ri";
import socket from '@/socket';
import { useData } from '@/data';

const KeyboardContext = React.createContext(null);

const Row = ({ children }) => <div className={'flex gap-1 p-0.5'}>{children}</div>;

function Key({ data, size }) {
    const { display, onDown, onUp, onClick } = useContext(KeyboardContext);
    return (
        <div
            key={data}
            className={`flex-grow w-[20px] cursor-pointer touch-none select-none h-10 flex flex-col justify-center items-center bg-muted text-secondary-foreground shadow-sm rounded-[3px]`}
            style={size ? { flex: size } : {}}
            onClick={(e) => onClick && onClick(e, data)}
            onPointerDown={(e) => onDown && onDown(e, data)}
            onPointerUp={(e) => onUp && onUp(e, data)}
            onMouseLeave={(e) => onUp && onUp(e, data)}
        >
            {display[data]}
        </div>
    )
}

function Keyboard(props) {
    const { layouts } = useData();
    const [display, setDisplay] = useState({});
    const [config, setConfig] = useState({
        'backquote': { default: '`', caps: '`', shift: '`' },
        '1': { default: '1', shift: '!' },
        '2': { default: '2', shift: '@' },
        '3': { default: '3', shift: '#' },
        '4': { default: '4', shift: '$' },
        '5': { default: '5', shift: '%' },
        '6': { default: '6', shift: '^' },
        '7': { default: '7', shift: '&' },
        '8': { default: '8', shift: '*' },
        '9': { default: '9', shift: '(' },
        '0': { default: '0', shift: ')' },
        '-': { default: '-', shift: '_' },
        '=': { default: '=', shift: '+' },
        'backspace': { default: <FaBackspace/> },

        'tab': { default: <MdKeyboardTab/> },
        'q': { default: 'q', caps: 'Q', shift: 'Q' },
        'w': { default: 'w', caps: 'W', shift: 'W' },
        'e': { default: 'e', caps: 'E', shift: 'E' },
        'r': { default: 'r', caps: 'R', shift: 'R' },
        't': { default: 't', caps: 'T', shift: 'T' },
        'y': { default: 'y', caps: 'Y', shift: 'Y' },
        'u': { default: 'u', caps: 'U', shift: 'U' },
        'i': { default: 'i', caps: 'I', shift: 'I' },
        'o': { default: 'o', caps: 'O', shift: 'O' },
        'p': { default: 'p', caps: 'P', shift: 'P' },
        '[': { default: '[', shift: '{' },
        ']': { default: ']', shift: '}' },
        '\\': { default: '\\', shift: '|' },

        'capslock': { default: <PiArrowsDownUpBold/> },
        'a': { default: 'a', caps: 'A', shift: 'A' },
        's': { default: 's', caps: 'S', shift: 'S' },
        'd': { default: 'd', caps: 'D', shift: 'D' },
        'f': { default: 'f', caps: 'F', shift: 'F' },
        'g': { default: 'g', caps: 'G', shift: 'G' },
        'h': { default: 'h', caps: 'H', shift: 'H' },
        'j': { default: 'j', caps: 'J', shift: 'J' },
        'k': { default: 'k', caps: 'K', shift: 'K' },
        'l': { default: 'l', caps: 'L', shift: 'L' },
        ';': { default: ';', shift: ':' },
        '\'': { default: '\'', shift: '"' },
        'enter': { default: <IoArrowBack/> },

        'left-shift': { default: <LuArrowUpToLine/> },
        'z': { default: 'z', caps: 'Z', shift: 'Z' },
        'x': { default: 'x', caps: 'X', shift: 'X' },
        'c': { default: 'c', caps: 'C', shift: 'C' },
        'v': { default: 'v', caps: 'V', shift: 'V' },
        'b': { default: 'b', caps: 'B', shift: 'B' },
        'n': { default: 'n', caps: 'N', shift: 'N' },
        'm': { default: 'm', caps: 'M', shift: 'M' },
        ',': { default: ',', shift: '<' },
        '.': { default: '.', shift: '>' },
        '/': { default: '/', shift: '?' },
        'right-shift': { default: <LuArrowUpToLine/> },

        'left-ctrl': { default: 'Ctrl' },
        'layout': { default: <FaGlobe className={'!w-3.5 !h-3.5'}/> },
        'left-win': { default: <MdWindow/> },
        'left-alt': { default: 'Alt' },
        'space': { default: '' },
        'right-alt': { default: 'Alt' },
        'apps': { default: <RiFileListLine/> },
        'right-ctrl': { default: 'Ctrl' },
    });
    const [active, setActive] = useState([]);

    useEffect(() => {
        setDisplay(Object.fromEntries(
            Object.entries(config).map(([key, value]) => {
                let result = value?.default;
                for (const key in value) {
                    if (value.hasOwnProperty(key) && active.some(i => i.includes(key))) {
                        result = value[key];
                    }
                }
                return [key, result];
            })
        ));
    }, [config, active]);

    const onlyOnDown = ['capslock'];
    const layout = useRef(0);

    const onClick = (e, key) => {
        if (key === 'layout') {
            const entries = Object.entries(layouts.current);
            let obj = entries[++layout.current];
            if (!obj) {
                obj = entries[0];
                layout.current = 0;
            }
            setConfig(prev => ({ ...prev, ...obj[1] }));
        }
    }

    const send = (action, key) => socket.emit(`keyboard:${action}`, key);

    const onDown = (e, key) => {
        send('down', key);
        setActive(prev => {
            if (onlyOnDown.includes(key) && prev.includes(key)) return prev.filter(item => item !== key);
            return [...prev, key];
        });
        const target = e.currentTarget || e.target;
        target.classList.add('bg-muted/75');
    }

    const onUp = (e, key) => {
        send('up', key);
        if (!onlyOnDown.includes(key)) setActive(prev => prev.filter(item => item !== key));
        const target = e.currentTarget || e.target;
        target.classList.remove('bg-muted/75');
    }

    useEffect(() => {
        const updateKey = (key) => {
            key = key.toLowerCase();
            if (key.startsWith('key')) key = key.slice(3);
            const keys = {
                'controlleft': 'ctrlleft',
                'controlright': 'ctrlright',
                'metaleft': 'winleft',
                'metaright': 'winright',
                'contextmenu': 'apps'
            }
            return key in keys ? keys[key] : key;
        }

        const onDown = (e) => send('down', updateKey(e.code));
        const onUp = (e) => send('up', updateKey(e.code));

        window.addEventListener('keydown', onDown);
        window.addEventListener('keyup', onUp);

        return () => {
            window.removeEventListener('keydown', onDown);
            window.removeEventListener('keyup', onUp);
        }
    }, []);

    return (
        <KeyboardContext.Provider value={{display, onClick, onDown, onUp}}>
            <div {...props}>
                <Row>
                    <Key data={'backquote'}/>
                    <Key data={'1'}/>
                    <Key data={'2'}/>
                    <Key data={'3'}/>
                    <Key data={'4'}/>
                    <Key data={'5'}/>
                    <Key data={'6'}/>
                    <Key data={'7'}/>
                    <Key data={'8'}/>
                    <Key data={'9'}/>
                    <Key data={'0'}/>
                    <Key data={'-'}/>
                    <Key data={'='}/>
                    <Key data={'backspace'}/>
                </Row>
                <Row>
                    <Key data={'tab'}/>
                    <Key data={'q'}/>
                    <Key data={'w'}/>
                    <Key data={'e'}/>
                    <Key data={'r'}/>
                    <Key data={'t'}/>
                    <Key data={'y'}/>
                    <Key data={'u'}/>
                    <Key data={'i'}/>
                    <Key data={'o'}/>
                    <Key data={'p'}/>
                    <Key data={'['}/>
                    <Key data={']'}/>
                    <Key data={'\\'}/>
                </Row>
                <Row>
                    <Key data={'capslock'}/>
                    <Key data={'a'}/>
                    <Key data={'s'}/>
                    <Key data={'d'}/>
                    <Key data={'f'}/>
                    <Key data={'g'}/>
                    <Key data={'h'}/>
                    <Key data={'j'}/>
                    <Key data={'k'}/>
                    <Key data={'l'}/>
                    <Key data={';'}/>
                    <Key data={'\''}/>
                    <Key data={'enter'}/>
                </Row>
                <Row>
                    <Key data={'left-shift'}/>
                    <Key data={'z'}/>
                    <Key data={'x'}/>
                    <Key data={'c'}/>
                    <Key data={'v'}/>
                    <Key data={'b'}/>
                    <Key data={'n'}/>
                    <Key data={'m'}/>
                    <Key data={','}/>
                    <Key data={'.'}/>
                    <Key data={'/'}/>
                    <Key data={'right-shift'}/>
                </Row>
                <Row>
                    <Key data={'left-ctrl'}/>
                    <Key data={'layout'}/>
                    <Key data={'left-win'}/>
                    <Key data={'left-alt'}/>
                    <Key data={'space'} size={10}/>
                    <Key data={'right-alt'}/>
                    <Key data={'apps'}/>
                    <Key data={'right-ctrl'}/>
                </Row>
            </div>
        </KeyboardContext.Provider>
    )
}

export { Key, Row, Keyboard };