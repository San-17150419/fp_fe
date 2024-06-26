import Sidebar from "./Components/modd/Sidebar";
import { Outlet } from "react-router-dom";
import logo from "./assets/logo_banner5.png";
import Navbar from "./Components/modd/Navbar";
function App() {
  return (
    <>
      <Navbar>
        <Navbar.Logo src={logo} />
        <Navbar.Items>
          <Navbar.Item className="text-2xl">Home </Navbar.Item>
          <Navbar.Item className="text-xl">About</Navbar.Item>
          <Navbar.Item className="text-xl">??</Navbar.Item>
        </Navbar.Items>
      </Navbar>
      <div className="flex flex-grow bg-gray-200">
        <div className="h-full w-1/6 min-w-[200px]">
          <Sidebar />
        </div>
        <div className="mx-10 my-10 w-5/6">
          <Outlet />
        </div>
      </div>
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
