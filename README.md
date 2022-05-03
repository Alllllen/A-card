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
- Use Node.js and express as Backend
- Use pug css javascripts and boostrap as Frontend
- Use MongoDB and it's ODM Mongoose as a database
- Use Redis to cache data to achieve faster search speeds(267ms->50ms)
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
- [ ] Impement 抽卡 system
- [ ] Using redis and socket.io to implement chatting room
- [ ] Using AWS S3 store image datas
