import Select from './Components/modd/Select';
import Input from './Components/modd/Input';
import Table from './Components/modd/Table';
import SelectTestVersion from './SelectTestVersion';
import BootStrapTable from './Components/modd/BootStrapTable';
import Sidebar from './Components/modd/Sidebar';
function App() {
  return (
    <>
      <div className='flex'>
        <nav className='navbar navbar-expand-sm navbar-dark nav-custom nav px-3 py-2 position-sticky fixed-top w-full' style={{ minHeight: "78px" }}>
          <div className="container-fluid">
            <a className="navbar-brand" href="#">Navbar</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </nav>
      </div>
      <main className='flex w-full  overflow-hidden border-8 border-violet-800  '>
        <Sidebar />
        <div className='flex flex-col w-full border border-black ' >
          <section className='border-bottom py-3 d-flex'>
            <Select options={["資料庫檢索及更新", "新增模具"]} />
          </section>
          <section className='py-3 flex w-full gap-3 flex-wrap'>
            <Select options={["全部系列", "P系列", "PA系列", "PC系列", "CE系列", "特殊系列", "雙色系列", "配件", "臨時模具"]} />
            <Input placeholder="名版" />
            <Input placeholder='模號' />
            <Select options={["財產歸屬", "國登場", "斗六場", "金筆場"]} />
            <Select options={["GD", "HP", "DL", "D08", "停用"]} />
            {/* <SelectTestVersion /> */}
          </section>
          {/* <section className='table-container'> */}
          <section className='overflow-hidden '>
            <div className=' max-h-[600px] w-[1600px] overflow-scroll'>
              <Table />
            </div>
            {/* <BootStrapTable /> */}
          </section>
        </div>
      </main>
    </>
  );
}

export default App;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// function MyComponent() {
//   const [postData, setPostData] = useState(null);

//   useEffect(() => {
//     // 定義發送POST請求的函數
//     const fetchData = async () => {
//       try {
//         const response = await axios.post('http://192.168.123.240:9000/api/mr/', {
//           // 可以在這裡傳遞POST請求所需的資料
//           'key01': 'values01',
//           'key02': 'values02',
//         });
//         // 設定狀態以儲存回傳的資料
//         setPostData(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     // 呼叫發送POST請求的函數
//     fetchData();
//   }, []); // 空依賴陣列表示僅在組件初次渲染時執行

//   return (
//     <div>
//       {postData ? (
//         // 如果postData不為空，則顯示回傳的資料
//         <pre>{JSON.stringify(postData, null, 2)}</pre>
//       ) : (
//         // 如果postData為空，顯示載入中或其他訊息
//         <p>Loading...</p>
//       )}
//     </div>
//   );
// }

// export default MyComponent;
