import { useState, useEffect, useRef } from 'react';
import { FS } from './fs/fs';



const Terminal = () => {
    const [currentPath, setCurrentPath] = useState(['home', 'root']);
    const [history, setHistory] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [showNamePrompt, setShowNamePrompt] = useState(true);
    const [username, setUsername] = useState('');
    const [nameInputValue, setNameInputValue] = useState('');
    const terminalRef = useRef(null);
    const inputRef = useRef(null);

    const banner2 = `
  Hi ${username}, I am,
  

 ░██████╗██╗░░██╗░█████╗░████████╗░█████╗░██████╗░██████╗░██╗░░░██╗        ,
 ██╔════╝██║░░██║██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██║░░░██║      0/
 ╚█████╗░███████║███████║░░░██║░░░███████║██║░░██║██████╔╝██║░░░██║     /7,
 ░╚═══██╗██╔══██║██╔══██║░░░██║░░░██╔══██║██║░░██║██╔══██╗██║░░░██║   .'(
 ██████╔╝██║░░██║██║░░██║░░░██║░░░██║░░██║██████╔╝██║░░██║╚██████╔╝ '^ / >  
 ╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░╚═╝╚═════╝░╚═╝░░╚═╝░╚═════╝░   / <  
 Welcome to my terminal-like portfolio experience! Type 'help' to see the available commands available.
 p.s If you are a recruiter, please dont mind the ultra casual tone in this site
        `;
    /* useEffect(() => {
        if (!showNamePrompt) {
            // This welcome message will appear once after the user enters their name.
            // Since it doesn't have a 'command' property, the path string will not be rendered for it.
            setHistory([
                { output: `Hi ${username}, I am a web developer. Let's connect!` }
            ]);
            // Focus the main command input after the transition
            setTimeout(() => inputRef.current?.focus(), 0);
        }
    }, [showNamePrompt, username]);*/

    // Get the current directory object from the VFS
    const getCurrentDirectory = () => {
        let currentDir = FS;
        currentPath.forEach(dir => {
            // Ensure the path exists before trying to access it
            if (currentDir && typeof currentDir === 'object' && currentDir[dir]) {
                currentDir = currentDir[dir];
            }
        });
        return currentDir;
    };

    const handleNameInput = (e) => {
        if (e.key === 'Enter' && nameInputValue.trim()) {
            setUsername(nameInputValue.trim());
            setShowNamePrompt(false);
        }
    };


    const handleCommand = (e) => {
        if (e.key === 'Enter') {
            const fullCommand = inputValue.trim();
            if (!fullCommand) return; // Ignore empty commands

            const [cmd, ...args] = fullCommand.split(' ');
            let output = '';

            // Using a static banner here to avoid issues with template literals
            const banner = `
 ░██████╗██╗░░██╗░█████╗░████████╗░█████╗░██████╗░██████╗░██╗░░░██╗            ,       
 ██╔════╝██║░░██║██╔══██╗╚══██╔══╝██╔══██╗██╔══██╗██╔══██╗██║░░░██║          0/
 ╚█████╗░███████║███████║░░░██║░░░███████║██║░░██║██████╔╝██║░░░██║         /7,
 ░╚═══██╗██╔══██║██╔══██║░░░██║░░░██╔══██║██║░░██║██╔══██╗██║░░░██║       .'(
 ██████╔╝██║░░██║██║░░██║░░░██║░░░██║░░██║██████╔╝██║░░██║╚██████╔╝     '^ / >  
 ╚═════╝░╚═╝░░╚═╝╚═╝░░╚═╝░░░╚═╝░░░╚═╝░░╚═╝╚═════╝░╚═╝░░╚═╝░╚═════╝░       / <  
 Welcome to my terminal-like portfolio experience! Type 'help' to see the available commands available.
            `;

            switch (cmd) {
                case 'ls':
                    output = Object.keys(getCurrentDirectory()).join('   ');
                    break;
                case 'dir':
                    const currentDir = getCurrentDirectory();
                    const directories = Object.keys(currentDir).filter(key => {
                        const item = currentDir[key];
                        return typeof item === 'object' && !Array.isArray(item) && item !== null;
                    });
                    output = directories.join('   ');
                    if (!output) {
                        output = 'No directories found in the current location.';
                    }
                    break;
                case 'cd':
                    if (!args[0]) {
                        // No argument, do nothing or go home
                    } else if (args[0] === '..') {
                        if (currentPath.length > 2) { // Can't go above 'portfolio'
                            setCurrentPath(prevPath => prevPath.slice(0, -1));
                        }
                    } else if (args[0] in getCurrentDirectory()) {
                        const targetDir = getCurrentDirectory()[args[0]];
                        if (typeof targetDir === 'object' && !Array.isArray(targetDir) && targetDir !== null) {
                            setCurrentPath(prevPath => [...prevPath, args[0]]);
                        } else {
                            output = `cd: ${args[0]}: Not a directory`;
                        }
                    } else {
                        output = `cd: ${args[0]}: No such file or directory`;
                    }
                    break;
                case 'cat':
                    const fileName = args[0];
                    if (!fileName) {
                        output = `cat: Missing file operand`;
                    } else {
                        const fileContent = getCurrentDirectory()[fileName];
                        if (fileContent && typeof fileContent === 'string') {
                            output = fileContent;
                        } else {
                            output = `cat: ${fileName}: No such file or it is a directory`;
                        }
                    }
                    break;
                case 'clear':
                    setHistory([]);
                    setInputValue('');
                    return; // Return early to prevent 'clear' command from being added to history
                case 'help':
                    output = `Available commands:
ls             to show the available files,
dir            to show the available directories,
cd             to change directories,
cat            to show the content of any file,
clear          to clear the terminal,
help           to show available commands,
neofetch       to show the banner again`;
                    break;
                case 'neofetch':
                    output = banner;
                    break;
                default:
                    output = `Command not found: ${cmd}`;
            }

            setHistory(prevHistory => [...prevHistory, { command: fullCommand, output, path: pathString }]);
            setInputValue('');
        }
    };

    // Auto-scroll to the bottom on new input
    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history]);

    // Format the current path for display, now including the username
    const pathString = username ? `${username}@${currentPath.slice(1).join('/')}~` : '';

    if (showNamePrompt) {
    return (
        <div className="bg-gray-900 text-green-400 font-mono text-xl p-4 h-screen flex flex-col">
       <style jsx>{`
                .terminal-input {
                    caret-color: #10b981;
                }
                .terminal-input:focus {
                    caret-color: #10b981;
                }
                /* Try to make caret thicker in supporting browsers */
                @supports (caret-shape: block) {
                    .terminal-input {
                        caret-shape: block;
                    }
                }
            `}</style>
            <div className="flex flex-col whitespace-nowrap">
                <span>&gt; Enter your name</span>
                <input
                    type="text"
                    className="bg-transparent text-green-400 border-none outline-none ml-2 w-40 terminal-input"
                    value={nameInputValue}
                    onChange={(e) => setNameInputValue(e.target.value)}
                    onKeyDown={handleNameInput}
                    autoFocus
                />
            </div>
        </div>
    );
}

return (
    <div
        className="bg-gray-900 text-green-400 font-mono text-xl p-4 overflow-y-scroll h-screen"
        ref={terminalRef}
        onClick={() => inputRef.current?.focus()}
    >
        <pre>{banner2}</pre>
        {history.map((entry, index) => (
            <div key={index}>
                {entry.command !== undefined && (
                    <p className="flex">
                        <span className="text-blue-400">{entry.path}</span>
                        <span className="text-green-400 mr-2">$</span>
                        <span className="flex-1">{entry.command}</span>
                    </p>
                )}
                <pre className="whitespace-pre-wrap">{entry.output}</pre>
            </div>
        ))}

        <div className="flex items-center">
            <span className="text-blue-400">{pathString}</span>
            <span className="text-green-400">$ </span>
            <input
                ref={inputRef}
                type="text"
                className="flex-grow bg-transparent text-green-400 border-none outline-none ml-2 cursor-blink"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleCommand}
            />
        </div>
    </div>
);
};


export default Terminal;



