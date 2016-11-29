var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
// 게시판 만들기에서 사용되는 데이터들은
// 제목/이메일/내용/비밀번호/만든시간/조회수 라서 저렇게 데이터 값을 만들었다.
var schema = new Schema({
  title: {type: String, required: true, trim: true},
  email: {type: String, required: true, index: true, unique: true, trim: true},
  content: {type: String, required: true, trim: true},
  password: {type: String},
  createdAt: {type: Date, default: Date.now},
  read: {type: Number, default: 0},
  content: {type: String, required: true, trim: true},
  person:{type:String,required: true, trim: true}
}, {
  toJSON: { virtuals: true},
  toObject: {virtuals: true}
});

var Post = mongoose.model('Post', schema);

module.exports = Post;
