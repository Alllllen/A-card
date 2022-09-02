const redis = require('redis');
const client = redis.createClient(6379); // this creates a new client
client.on('connect', () => {
  console.log('Redis client connected');
});

const resolvePromise = (resolve, reject) => {
  return (err, data) => {
    if (err) {
      reject(err);
    }
    resolve(data);
  };
};

module.exports = {
  client,
  loadLuaScript,
  auth: async () => {
    await auth(client);
    await auth(sub);
  },
  del: (key = 'key') =>
    new Promise((a, b) => client.del(key, resolvePromise(a, b))),
  incr: (key = 'key') =>
    new Promise((a, b) => client.incr(key, resolvePromise(a, b))),
  decr: (key = 'key') =>
    new Promise((a, b) => client.decr(key, resolvePromise(a, b))),
  hmset: (key = 'key', values = []) =>
    new Promise((a, b) => client.hmset(key, values, resolvePromise(a, b))),
  exists: (key = 'key') =>
    new Promise((a, b) => client.exists(key, resolvePromise(a, b))),
  hexists: (key = 'key', key2 = '') =>
    new Promise((a, b) => client.hexists(key, key2, resolvePromise(a, b))),
  setex: (key = 'key', expiration, value) =>
    new Promise((a, b) =>
      client.setex(key, expiration, value, resolvePromise(a, b))
    ),
  set: (key = 'key', value) =>
    new Promise((a, b) => client.set(key, value, resolvePromise(a, b))),
  hset: (key = 'key', key2 = '', value) =>
    new Promise((a, b) => client.hset(key, key2, value, resolvePromise(a, b))),
  get: (key = 'key') =>
    new Promise((a, b) => client.get(key, resolvePromise(a, b))),
  hgetall: (key = 'key') =>
    new Promise((a, b) => client.hgetall(key, resolvePromise(a, b))),
  zrangebyscore: (key = 'key', min = 0, max = 1) =>
    new Promise((a, b) =>
      client.zrangebyscore(key, min, max, resolvePromise(a, b))
    ),
  zrevrange: (key = 'key', min = 0, max = 1) =>
    new Promise((a, b) =>
      client.zrevrange(key, min, max, resolvePromise(a, b))
    ),
  zadd: (key = 'key', key2 = '', value) =>
    new Promise((a, b) => client.zadd(key, key2, value, resolvePromise(a, b))),
  sadd: (key = 'key', value) =>
    new Promise((a, b) => client.sadd(key, value, resolvePromise(a, b))),
  hmget: (key = 'key', key2 = '') =>
    new Promise((a, b) => client.hmget(key, key2, resolvePromise(a, b))),
  smembers: (key = 'key') =>
    new Promise((a, b) => client.smembers(key, resolvePromise(a, b))),
};

let agreeRelationLua =
  '\
   local user = ARGV[1] \
   local pair = "user:"..user..":".."pair" \
   local pairInfo = redis.call("hmget", pair, "pairUser", "statement", "status") \
   local pairUser = "user:"..pairInfo[1]..":".."pair"  \
   local status = pairInfo[3] \
   if status=="0" then \
       redis.call("hset",pair, "status","1")\
       redis.call("hset",pairUser, "status","1")\
       status = "1" \
    elseif status=="1" then \
       redis.call("hmset",pair, "status","2","statement","agree")\
       redis.call("hmset",pairUser, "status","2","statement","agree")\
       status = "2" \
    elseif status=="2" then \
       redis.call("hset",pair, "status","2")\
       redis.call("hset",pairUser, "status","2")\
       status = "2" \
    else \
       redis.call("hset",pair, "status","3")\
       redis.call("hset",pairUser, "status","3")\
       status = "3" \
    end \
   return status';

let disagreeRelationLua =
  '\
   local user = ARGV[1] \
   local pair = "user:"..user..":".."pair" \
   local pairInfo = redis.call("hmget", pair, "pairUser", "statement", "status") \
   local pairUser = "user:"..pairInfo[1]..":".."pair"  \
   redis.call("hset",pair, "status","3")\
   redis.call("hset",pairUser, "status","3")\
   local status = "3" \
   return status';
//  let disagreeRelationLua =
//  '\
//   local user = ARGV[1] \
//   local pair = "user:"..user..":".."pair" \
//   local pairInfo = redis.call("hmget", pair, "pairUser", "statement", "status") \
//   local pairUser = "user:"..pairInfo[2]..":".."pair"  \
//   redis.call("hset",pair, "status","3")\
//   redis.call("hset",pairUser, "status","3")\
//   status = "3" \
//   return status';
function loadLuaScript(script, user) {
  if (script === 'agreeRelationLua') {
    client.script('load', agreeRelationLua, function (err, sha) {
      console.log(`Load - agreeRelationLua - sha:` + sha);
      checkLoadScript(sha, user);
    });
  } else {
    client.script('load', disagreeRelationLua, function (err, sha) {
      console.log(`Load - disagreeRelationLua - sha:` + sha);
      checkLoadScript(sha, user);
    });
  }
}
function checkLoadScript(sha, user) {
  client.script('exists', sha, function (err, result) {
    if (err) throw err;
    console.log('checkLoadScript:', result);
    if (result[0] === 1) {
      execLuaScriptSha(sha, user);
    }
  });
}
function execLuaScriptSha(sha, user) {
  client.evalsha(sha, 0, user, function (err, result) {
    if (err) throw err;
    console.log('execLuaScriptSha:', result);
  });
}
