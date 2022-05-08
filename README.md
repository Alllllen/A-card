# A card


### 📚Description
Acard is an app made by imitating social media "Dcard"
- [Acard](https://a-card.herokuapp.com/ "link")

### ✨Application
- Register/Login account available
- Account center can change personal information/upload headshots
- You can post/edit/delete your own articles
- You can leave comments and like the article
- On the left side you can view specific categories of articles and current popular articles (most liked in 24 hours)
<!-- - You can use the forgotten password, and a verification mail will be sent to the registered mailbox -->

### 💡Tech
- Use Node.js and express.js as Backend
- Use pug css javascripts and boostrap as Frontend
- Use MongoDB and it's ODM Mongoose as a database
- Use Redis to cache page info to achieve faster loading pages speed(267ms->50ms)(加速首頁載入速度提高SEO分數，不需要實時更新沒關西，因為首頁就算少了幾個讚跟留言也不會有人在乎或發現，所以使用write back to primary database)
- Use jwt to implement authentication
- Use index and compound index to speed up searching
- Dockerized the app
- Deploy this app to Heroku
- Avoid information security issues like SQL injection/XSS/CSRF etc. 
- Implement CORS
- Compress the js file to speed up in frontend part
<!-- - Use stripe串接金流 -->
<!-- - Use SendGrid第三方Email服務 -->

### 🛠️ Set up
- git clone
- npm install
- docker run
- setting config.env file

### 🦶 Roadmap
- [x] System Design
- [x] Implement most of the function
- [ ] Implement tag function
- [ ] Impement 抽卡 system (10.時先將配對好的資訊緩存放入redis，避免了00:00一到，大量需求訪問直接打到後端的資料庫，可能導致mongodb不堪負荷。至於如果狀態有更新(ex:兩人都按了接受，所以雙方成為朋友)，此處選擇直接使用write through，因為我認為此時的瓶頸只有read，一般人不會一抽卡就立刻按下是否同意好友，而是會思考一下，所以此處讀的量能不會在成後端資料庫crash
- [ ] Using redis and socket.io to implement chatting room
- [ ] Using AWS S3 store image datas
