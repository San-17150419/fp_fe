import React from 'react'
import Select from '../Components/modd/Select'
import Input from '../Components/modd/Input'
import Table from '../Components/modd/Table'
export default function DefaultPage() {
    return (
        <>
            <section className='border-bottom py-3 d-flex'>
                <Select options={["資料庫檢索及更新", "新增模具"]} />
            </section>
            <section className='py-3 flex w-full gap-3 flex-wrap'>
                <Select options={["全部系列", "P系列", "PA系列", "PC系列", "CE系列", "特殊系列", "雙色系列", "配件", "臨時模具"]} />
                <Input name='名版' placeholder="名版" />
                <Input name="模號" placeholder='模號' />
                <Select options={["財產歸屬", "國登場", "斗六場", "金筆場"]} />
                <Select options={["GD", "HP", "DL", "D08", "停用"]} />
                {/* <SelectTestVersion /> */}
            </section>
            {/* <section className='table-container'> */}
            <section className='overflow-hidden '>
                <div className=' max-h-[600px] w-[1400px] overflow-scroll'>
                    <Table />
                </div>
                {/* <BootStrapTable /> */}
            </section>
        </>
    )
}
