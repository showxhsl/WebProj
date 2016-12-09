var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
// 게시판 만들기에서 사용되는 데이터들은
// 제목/이메일/내용/비밀번호/만든시간/조회수 라서 저렇게 데이터 값을 만들었다.
var schema = new Schema({
  user: {type: Schema.Types.ObjectId, index: true, required: true},
  post: {type: Schema.Types.ObjectId, index: true, required: true},
  email: {type: String, required: true, trim: true}, 
  checkIn: {type: Date, required: true, trim: true},
  checkOut: {type: Date, required: true, trim: true},
  person:{type:String,required: true, trim: true},
  willCancel:{type:Boolean}
}, {
  toJSON: {
    virtuals: true,
    transform: function(reservations) {
      return {
        email: reservations.email,
        checkIn: reservations.checkIn,
        checkOut: reservations.checkOut,
        person: reservations.person,
        willCancel: reservations.willCancel,
      };
    }
  },
  toObject: {virtuals: true}
});



var Post = mongoose.model('Reservation', schema);

module.exports = Post;
