var express = require('express'),
    User = require('../models/User');
var Post = require('../models/Post');
// 유저를 require해서 사용함(위치는 ../models 아래 User라는 js 파일)
var Reservation = require('../models/Reservation');
    //라우팅을 한다.
var router = express.Router();
var mongoose   = require('mongoose');
var paginate = require('paginate')({
  mongoose: mongoose
});

function validateForm(form, options) {
  var checkIn = form.checkIn;
  var checkOut = form.checkOut;
  var person = form.person;
  checkIn = checkIn;
  checkOut = checkOut;
  person = person;

  var checkInDate = new Date(checkIn);
  var checkOutDate = new Date(checkOut);

  
  if (!checkIn) {
    return '체크인 날짜를 입력해주세요';
  }

  if (!checkOut) {
    return '체크아웃 날짜를 입력해주세요.';
  }

  if (checkInDate < new Date()){
    return '체크인 날짜가 현재 날짜보다 작습니다.';
  }

  if(checkInDate > checkOutDate){
    return '체크인 날짜가 체크아웃 날짜보다 큽니다.';
  }
  return null;
}


router.get('/', function(req, res, next) {
  Post.find({}, function(err, docs) {
    if (err) {
      return next(err);
    }
    Reservation.find({}, function(err, docs) {
    if (err) {
      return next(err);
    }
      res.render('posts/index', {posts: docs},{reservations: docs});
    });
  });
});

router.delete('/:id', function(req, res, next) {
  Post.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/posts/index');
  });
});


function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({message: 'Not authorized'});
  }
}

router.get('/', needAuth, function(req, res, next) {
  Reservation.findOne(req.params.id, function(err, reservation) {
    if (err) {
      return res.status(500).json({message: 'internal error', desc: err});
    }
    res.json(reservation);
  });
});


router.get('/index/:id',function(req, res, next) {
  Reservation.findOne({_id: req.params.id}, function(err, reservation) {
    if (err) {
      return res.status(500).json({message: 'internal error', desc: err});
    }
    res.render('reservations/index', {reservation: reservation});
  });
  
});


/* new 페이지 */
router.get('/new/:id', function(req, res, next) {
  res.render('reservations/new', { post_id: req.params.id });
});

router.post('/', function(req, res, next) {
  // 위에 validate로 맞는지 틀린지를 검사한다.
  var err = validateForm(req.body);
  // 오류시 back 처리
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  var reservation = new Reservation({
    user: req.user.id,
    post: req.body.post_id,
    checkIn: new Date(req.body.checkIn),
    checkOut: new Date(req.body.checkOut),
    person: req.body.person,
    willCancel: false,
    email: req.user.email,
  });
  //저장되면 posts(index)페이지로 감
  reservation.save(function(err) {
    if (err) {
      return next(err);
    } else {
      res.redirect('/posts/index');
    }
  });
});




module.exports = router;