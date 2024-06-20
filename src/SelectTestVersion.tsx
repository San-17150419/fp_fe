import { Select } from '@headlessui/react';
import { Menu, Transition, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { PiCaretDownBold } from "react-icons/pi";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react'
import { useState } from 'react'
import { RxCaretDown } from "react-icons/rx";

const people = [
    { id: 1, name: 'Durward Reynolds' },
    { id: 2, name: 'Kenton Towne' },
    { id: 3, name: 'Therese Wunsch' },
    { id: 4, name: 'Benedict Kessler' },
    { id: 5, name: 'Katelyn Rohan' },
]
export default function SelectTestVersion() {
    const [selectedPerson, setSelectedPerson] = useState(people[0])
    return (
        // <Select name="status" className="border border-gray-300 min-w-[180px] rounded" aria-label="Project status">
        //     <option value="active">Active</option>
        //     <option value="paused">Paused</option>
        //     <option value="delayed">Delayed</option>
        //     <option value="canceled">Canceled</option>
        // </Select>

        <Listbox value={selectedPerson} onChange={setSelectedPerson} >
            <ListboxButton className="border border-gray-300 min-w-[180px] rounded flex gap-2 justify-center items-center font-bold px-2">
                資料庫檢索及更新
                <PiCaretDownBold className='font-bold' />
            </ListboxButton>
            <ListboxOptions anchor="bottom" className={"z-40"}>
                {people.map((person) => (
                    <ListboxOption key={person.id} value={person} className="data-[focus]:bg-blue-100 z-50">
                        {person.name}
                    </ListboxOption>
                ))}
            </ListboxOptions>
        </Listbox>
    )
}
