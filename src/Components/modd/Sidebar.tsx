import React, { useState, useEffect } from 'react';
import { Menu, MenuButton, MenuItems, MenuItem, Transition } from '@headlessui/react';
import { IoCaretDownSharp } from 'react-icons/io5';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    // Automatically open the menu when the component mounts
    useEffect(() => {
        setIsOpen(true);
    }, []);

    return (
        <aside className='h-screen w-4/6 border border-black p-4'>
            <Menu as="div" className="relative inline-block text-left" >
                <div>
                    <MenuButton onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-4 font-semibold hover:font-bold hover:text-blue-500">
                        <IoCaretDownSharp size={21} />
                        元件展示
                    </MenuButton>
                </div>
                <Transition
                    show={isOpen}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-100"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                >
                    <MenuItems className="origin-top-right absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <MenuItem>
                                {({ focus }) => (
                                    <a className={`block px-4 py-2 text-sm text-gray-700 ${focus ? 'bg-gray-100' : ''}`} href="/input">
                                        Input Element
                                    </a>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ focus }) => (
                                    <a className={`block px-4 py-2 text-sm text-gray-700 ${focus ? 'bg-gray-100' : ''}`} href="/select">
                                        Select Element
                                    </a>
                                )}
                            </MenuItem>
                            <MenuItem>
                                {({ focus }) => (
                                    <a className={`block px-4 py-2 text-sm text-gray-700 ${focus ? 'bg-gray-100' : ''}`} href="/dataTable">
                                        Data Table
                                    </a>
                                )}
                            </MenuItem>
                        </div>
                    </MenuItems>
                </Transition>
            </Menu>
        </aside>
    );
}
