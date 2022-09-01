# A card


## 📚Description
   Acard is an app made by imitating social media "Dcard"
<!-- - [Acard](https://a-card.herokuapp.com/ "link") -->

## ✨Application
- Register/Login account
- Account center can change personal information/upload headshots
- Post/Edit/Delete articles
- Leave comments and give the article a like
- View specific categories of articles and current popular articles (most liked in 24 hours)
- 抽卡配對機制(每晚12點會隨機配對兩人，如果兩人都按下確認，則成為好友)
- 好友聊天機制
<!-- - You can use the forgotten password, and a verification mail will be sent to the registered mailbox -->

## 💡Technical Stacks
- Frontend - Pug, Boostrap
- Backend - Node.js, express.js, MongoDB, Redis
- Use MongoDB and it's ODM Mongoose to manipulate data
- Use index and compound index to speed up searching
- Use Redis to cache and pre-fetch API to achieve faster loading speed(158ms->50ms)(加速首頁載入速度，首頁是最熱門文章，變更速度不快，不需要實時更新,所以輪尋檢查更新)
- Using redis and socket.io to implement chatting room (聊天過程先使用緩存紀錄聊天紀錄避免流量太大，使用 write back 在聊天結束後或聊天一段時間過後，將聊天資料寫入 primary database)
- Impement 抽卡配對 system (10:00時先將配對好的資訊緩存放入redis，避免了00:00一到，大量需求訪問直接打到後端的資料庫，可能導致mongodb不堪負荷。至於如果狀態有更新(ex:兩人都按了接受，所以雙方成為朋友)，此處選擇直接使用cache aside，因為我認為此時的瓶頸只有read，一般人不會一抽卡就立刻按下是否同意好友，而是會思考一下，所以此處讀的量能不會對成後端資料庫有太大的負擔
- Use Lua script with redis, 使指令有原子性,並且減少了很多指令造成的通訊花費
- Use jwt to implement authentication
- Dockerized the app(開了幾個Docker container: Redis Acard)
- Avoid information security issues like SQL injection/XSS/CSRF etc. 
- Compress the js file to speed up in frontend part
<!-- - Deploy this app to Heroku -->
<!-- - Implement CORS -->
<!-- - Use SendGrid第三方Email服務 -->

## 🛠️System Architecture

## 🛠️ Experiments
### MongoDB indexing
- post numbers :100000
- project : {title:1,board:1,likeNum:1,user:1,createdAt:1}
- sort : {createdAt:-1}
- skip : 60000
- limit : 10

| Index Type    | Execution Time |
| ------------- | -------------  |
| Without Index | 184ms          |
| Index         | 37ms           |
| Covered Index | 51ms           |

- post numbers :100000
- project : {title:1,board:1,likeNum:1,user:1,createdAt:1}
- sort : {likeNum:-1,createdAt: -1}
- skip : 60000
- limit : 10

| Index Type    | Execution Time |
| ------------- | -------------  |
| Without Index | 416ms          |
| Conpound Index| 43ms           |
| Covered Index | 52ms           |

### Redis Caching
- 首頁響應時間
- 已使用indexing

| Caching       | Execution Time |
| ------------- | -------------  |
| w/o caching   | 250ms          |
|  w/ caching   | 60ms           |

### redis with Lua script
## 🛠️ Set up
-     git clone
-     npm install
-     docker run
-     setting config.env file

## 🦶 Roadmap
- [x] System Design
- [x] Implement services: Account Management, Chat, Post, Pair 
- [X] Experiments
- [ ] Unit test, using Jest
- [ ] Implement tag
- [ ] 通知系統
- [ ] Using AWS S3 store image datas
