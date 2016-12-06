var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
// 게시판 만들기에서 사용되는 데이터들은
// 제목/이메일/내용/비밀번호/만든시간/조회수 라서 저렇게 데이터 값을 만들었다.
var schema = new Schema({
  title: {type: String, required: true, trim: true},
  user: {type: Schema.Types.ObjectId, index: true, required: true},
  email: {type: String, required: true, trim: true},
  content: {type: String, required: true, trim: true},
  password: {type: String},
  createdAt: {type: Date, default: Date.now},
  read: {type: Number, default: 0},
  person:{type:String,required: true, trim: true},
  nation:{type:String,required: true, trim: true},
  city: {type: String, required: true, trim: true},
  money: {type: String, required: true, trim: true},
  convenience: {type: String, required: true, trim: true},
  rule: {type: String, required: true, trim: true}
  
}, {
  toJSON: { 
    virtuals: true,
    transform: function(post) {
      return {
        id: post._id.toString(),
        email: post.email,
        title: post.title,
        content: post.content,
        password: post.password,
        createdAt: post.createdAt,
        read: post.read,
        person: post.person,
        nation: post.nation,
        city: post.city,
        money: post.money,
        convenience: post.convenience,
        rule: post.rule,
      };
    }
  },
  toObject: {virtuals: true}
});



var Post = mongoose.model('Post', schema);

module.exports = Post;
