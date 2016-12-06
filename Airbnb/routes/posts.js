var express = require('express'),

    User = require('../models/User'),
// 유저를 require해서 사용함(위치는 ../models 아래 User라는 js 파일)
    Post = require('../models/Post');
    //라우팅을 한다.
var router = express.Router();
var mongoose   = require('mongoose');
var paginate = require('paginate')({
  mongoose: mongoose
});


function needAuth(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({message: 'Not authorized'});
  }
}

router.get('/', needAuth, function(req, res, next) {
  Post.find(function(err, posts) {
    if (err) {
      return res.status(500).json({message: 'internal error', desc: err});
    }
    res.json(posts);
  });
});

// validating 검사작업
function validateForm(form, options) {
  var title = form.title || "";
  var person = form.person||"";
  var content = form.content;
  var nation = form.nation;
  var city = form.city;
  var money = form.money;
  var convenience = form.convenience;
  var rule = form.rule;
  title = title.trim();
  person = person.trim();
  nation = nation.trim();
  city = city.trim();
  money = money.trim();
  convenience = convenience.trim();
  rule = rule.trim();

  if (!title) {
    return '제목을 입력해주세요.';
  }

  if (!form.password && options.needPassword) {
    return '비밀번호를 입력해주세요.';
  }
  if(!content){
    return '내용을 입력해 주세요';
  }

  if (form.password !== form.password_confirmation) {
    return '비밀번호가 일치하지 않습니다.';
  }

  if (form.password.length < 6) {
    return '비밀번호는 6글자 이상이어야 합니다.';
  }
  if(!city){
    return '도시를 입력해 주세요';
  }
  if(!money){
    return '이용 금액을 입력해 주세요';
  }
  if(!convenience){
    return '편의 시설을 입력해 주세요(없을 경우 : None)';
  }
  if(!rule){
    return '이용 규칙을 입력해 주세요(없을 경우 : None)';
  }

  return null;
}

/* index 페이지*/
router.get('/index',function(req, res, next) {

  var search_keyword = req.query.search_keyword;
  
  // 검색어가 있으면
  if(search_keyword){
    Post.find({nation: search_keyword}).sort({createdAt: -1}).paginate({page:req.query.page}, function(err,posts){
      if (err) {
        return next(err);
      }
      res.render('posts/index',{
        posts:posts
      });
    });
  } else {
  // 검색어가 없으면
    Post.find().sort({createdAt: -1}).paginate({page:req.query.page}, function(err,posts){
      if (err) {
        return next(err);
      }
      res.render('posts/index',{
        posts:posts
      });
    });
  }




});

/* new 페이지 */
router.get('/new', function(req, res, next) {
  res.render('posts/new');
});

/* edit 페이지 */
router.get('/:id/edit', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: post});
  });
});

// 글수정
router.put('/:id', function(req, res, next) {
// Post 데이터 id를 찾아서 실행
Post.findById({_id: req.params.id}, function(err, post) {
  if (err) {
    return next(err);
  }
  // 비밀번호 확인 오류 -> back 처리가 된다
  if (post.password !== req.body.password) {
    return res.redirect('back');
  }

  post.title = req.body.title;
  post.content = req.body.content;
  post.person = req.body.person;
  post.nation = req.body.nation;
  post.city = req.body.city;
  post.money = req.body.money;
  post.convenience = req.body.convenience;
  post.rule = req.body.rule;
  if (req.body.password) {
    post.password = req.body.password;
  }
  // 저장이 완료 되면 posts(index)페이지로 돌아간다.
  post.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/posts/index');
    });
  });
});
// 삭제 부분(글수정 부분과 비슷)
router.delete('/:id', function(req, res, next) {
  Post.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/posts/index');
  });
});

// 조회수를 받아서 클릭 할 경우 조회수를 1씩 늘려주는 부분
router.get('/:id', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    post.read++;
    post.save();
    res.render('posts/show', {post:post});
  });
});

// 글쓰기
router.post('/', function(req, res, next) {
  // 위에 validate로 맞는지 틀린지를 검사한다.
  var err = validateForm(req.body,{needPassword: true});
  // 오류시 back 처리
  if (err) {
    req.flash('danger', err);
    return res.redirect('back');
  }
  var newPost = new Post({
    user: req.user.id,
    email: req.user.email,
    title: req.body.title,
    content: req.body.content,
    person: req.body.person,
    nation: req.body.nation,
    city: req.body.city,
    money: req.body.money,
    convenience: req.body.convenience,
    rule: req.body.rule,
    
  });
  newPost.password = req.body.password;
  //저장되면 posts(index)페이지로 감
  newPost.save(function(err) {
    if (err) {
      return next(err);
    } else {
      res.redirect('/posts/index');
    }
  });
});

module.exports = router;
