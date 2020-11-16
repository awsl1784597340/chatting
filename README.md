## 计算机通信网络大作业

### 本平台使用`websocket`实现实时通信

### 采用的框架：React ，Express ，websocket

### 测试方法：

1. 安装node.js

    https://nodejs.org/zh-cn/

2. clone仓库

   ```bash
   https://github.com/awsl1784597340/chatroom
   ```

3. 安装依赖

   ```bash
   npm install
   ```

4. 运行服务端，会开启3000端口用于websocket通信，开启4000端口用于文件传输

    ```bash
    npm run server
    ```

5. 运行客户端，这一步在执行时需要注意：

   1） 如果本项服务只需要运行在本地只需要执行
   
   ```bash
   npm run server
   ```
   
   2)  如果需要将服务运行到局域网内，需要执行下面几步操作
   
   1. 修改文件 `./client/url.jsx` 将下面的IP `127.0.0.1` 修改为局域网下的IP
   
      ```javascript
      const url = '127.0.0.1'
      export default url
      ```
   
   2. 在项目的根目录下执行
   
      ```bash
      npm run server
      ```
