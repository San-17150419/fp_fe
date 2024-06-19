import {type SelectHTMLAttributes } from 'react'

interface SelectProps extends SelectHTMLAttributes < HTMLSelectElement > {
    options: string[]
}


export default function Select({ options, ...props }: SelectProps) {
    return (
        // TODO: Extract width to a variable
        <span style={{ width: "180px" }}>
            <select className="form-select fw-bolder" {...props} >
                {options.map((option, index) => <option className="border-start border-3 border-black fw-bolder" key={index} value={option}>{option}</option>)}
            </select>
        </span>
    )
}
