import React, { HTMLInputTypeAttribute } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> { };



export default function Input({ type = "text", ...props }: InputProps) {
    return (
        <span style={{ width: "180px"}}>
            <input type={type} className='form-control px-2 fw-bolder ' {...props} />
        </span>
    )
}


