const schedule = require('node-schedule');
const relationController = require('./../controllers/relationController');

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
