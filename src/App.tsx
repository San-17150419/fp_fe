// import React from 'react';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Welcome to React</h1>
//       </header>
//     </div>
//   );
// }

// export default App;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MyComponent() {
  const [postData, setPostData] = useState(null);

  useEffect(() => {
    // 定義發送POST請求的函數
    const fetchData = async () => {
      try {
        const response = await axios.post('http://192.168.123.240:9000/api/mr/', {
          // 可以在這裡傳遞POST請求所需的資料
          'key01': 'values01',
          'key02': 'values02',
        });
        // 設定狀態以儲存回傳的資料
        setPostData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // 呼叫發送POST請求的函數
    fetchData();
  }, []); // 空依賴陣列表示僅在組件初次渲染時執行

  return (
    <div>
      {postData ? (
        // 如果postData不為空，則顯示回傳的資料
        <pre>{JSON.stringify(postData, null, 2)}</pre>
      ) : (
        // 如果postData為空，顯示載入中或其他訊息
        <p>Loading...</p>
      )}
    </div>
  );
}

export default MyComponent;
