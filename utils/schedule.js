const schedule = require('node-schedule');
const relationController = require('./../controllers/relationController');
const { del } = require('./../utils/redis');
// pair action 22:00配對
module.exports.makePair = () => {
  let rule = new schedule.RecurrenceRule();
  rule.minute = new schedule.Range(0, 59, 15);
  schedule.scheduleJob(rule, () => {
    console.log(
      'Making pair...',
      new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    );
    relationController.clearPair();
    relationController.makePair();
  });
};

//每五分鐘清空首頁cache
module.exports.clearCache = () => {
  let rule = new schedule.RecurrenceRule();
  rule.minute = new schedule.Range(0, 59, 5);
  schedule.scheduleJob(rule, async () => {
    console.log(
      'Clearing Overview Cache...',
      new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })
    );
    await del('post:overview');
    await del('post:count');
  });
};
