# A card


### 📚Description
Acard is an app that made by imitating social media "Dcard"
- [Acard](https://a-card.herokuapp.com/ "link")

### ✨Application
- 可註冊/登入帳號
- 帳號中心可以變更個人資料/上傳大頭照
- 可以使用忘記密碼，會寄送驗證郵寄至註冊的信箱
- 可發表/編輯/刪除自己的文章
- 可對文章進行留言跟按讚
- 左側可以觀看特定類別文章和當前熱門文章(24小時內最多讚的)

### 💡Tech
- Use Node.js and express as Backend
- Use pug css javascripts and boostrap as Frontend
- Use MVC architecture
- Use MongoDB and it's ODM Mongoose as database
- Use Redis to cache data 來達到更快的搜尋速度
- Use jwt to implement authentication
- Use index and compound index to speed up searching
- Dockerized the app
- Deploy this app to Heroku
- Use stripe串接金流
- Use SendGrid第三方Email服務
- Avoid SQL-injection/XSS/CSRF等資安問題
- Implement CORS
- Compress js file to speed up in frontend part

### 🛠️ Set up
- git clone
- npm install
- setting config.env file
