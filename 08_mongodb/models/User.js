var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
// data 타입
var schema = new Schema({
  name: {type: String, required: true, trim: true},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  password: {type: String},
  createdAt: {type: Date, default: Date.now}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});
// mongodb로 보낸다.
var User = mongoose.model('User', schema);
// 유저라는 모듈을 만들고 나중에 require해서 사용한다.
module.exports = User;
