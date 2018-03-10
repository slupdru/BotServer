var records = [
  {
    id: 1,
    username: "Slav4ik",
    password: "1488",
    displayName: "Slav4ik_xxx",
    emails: [{ value: "SL@yandex.ru" }]
  },
  {
    id: 2,
    username: "Misha",
    password: "Mishaxyi",
    displayName: "lox",
    emails: [{ value: "lox@example.com" }]
  }
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error("User " + id + " does not exist"));
    }
  });
};

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
};
