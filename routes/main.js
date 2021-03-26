const conn = require("../mysql");
const cors = require("cors");

module.exports = function (app) {
  app.use(cors());
  app.get("/", (req, res) => {
    conn.query("select * from review", (err, result) => {
      res.send(result);
    });
  });
  app.get("/re", (req, res) => {
    conn.query("select * from reviewData", (err, result) => {
      res.send(result);
    });
  });
  app.get("/co", (req, res) => {
    conn.query("select * from commentData", (err, result) => {
      res.send(result);
    });
  });
  //
  //
  app.get("/review/json", (req, res) => {
    conn.query("select * from reviewData ", (err, result) => {
      res.json(result);
    });
  });
  app.post("/review/new", (req, res) => {
    const title = req.body.title;
    const category = req.body.category;
    const subTitle = req.body.sub_title;
    const content = req.body.content;
    const userId = req.body.userId;
    const image = req.body.image;
    const addSql =
      "insert into reviewData (title,content,category,sub_title,userId,image) values(?,?,?,?,?,?)";
    conn.query(
      addSql,
      [title, content, category, subTitle, userId, [image]],
      (error, result) => {
        res.json(result);
        if (error) {
          console.log(error);
        }
      }
    );
  });

  app.get("/review/update/:id/json", (req, res) => {
    let index = req.params.id;
    if (index) {
      conn.query(
        "select * from reviewData where id=?",
        [index],
        (err, result) => {
          if (err) {
            console.log(err);
            throw new Error();
          }
          res.send(result);
        }
      );
    }
  });

  app.post("/review/update/:id/json/comment", (req, res) => {
    const commentId = req.body.comment_id;
    const commentContent = req.body.comment_content;
    const boardNum = req.params.id;
    const createTime = req.body.create_time;
    const updateTime = req.body.update_time;

    let commentQuery =
      "insert into commentData (comment_id,comment_content,board_num,create_time,update_time) values(?,?,?,?,?)";
    conn.query(
      commentQuery,
      [commentId, commentContent, boardNum, createTime, updateTime],
      (err, results) => {
        if (err) {
          console.log(err);
          throw new Error();
        } else {
          conn.query("select * from commentData", (errs, result) => {
            if (errs) {
              console.log(errs);
              throw new Error();
            } else {
              res.send(result);
            }
          });
        }
      }
    );
  });
  app.get("/review/update/:id/json/comment", (req, res) => {
    let commentIndex = req.params.id;
    let commentQuery = "select * from commentData where board_num=?";
    conn.query(commentQuery, [commentIndex], (err, result) => {
      if (err) {
        console.log(err);
        throw new Error();
      } else {
        res.send(result);
      }
    });
  });

  app.post("/review/update/:id/json/comment/delete", (req, res) => {
    let commentNum = req.body.list_num.commentNum;
    const commentDeleteSql = "delete from commentData where comment_num=?";
    conn.query(commentDeleteSql, [commentNum], (err, result) => {
      if (err) {
        console.log(err);
        throw new Error();
      } else {
        console.log("Delete");
      }
    });
  });
  app.post("/review/update/:id/json/comment/edit", (req, res) => {
    let editContent = req.body.editContent;
    let editTime = req.body.editTime;
    let editNum = req.body.editDataset;
    const editSql =
      "update commentData set comment_content=?,update_time=? where comment_num=?";
    conn.query(editSql, [editContent, editTime, editNum], (err, result) => {
      if (err) {
        console.log(err);
        throw new Error();
      } else {
        console.log("Edit!!");
      }
    });
  });
  app.post("/review/update/:id/json/delete", (req, res) => {
    let content_id = req.body.contentId;
    let contentDeleteSql = "delete from reviewData where id=?";
    conn.query(contentDeleteSql, [content_id], (err, result) => {
      if (err) {
        console.log(err);
        throw new Error();
      }
      console.log("Delete !!");
    });
  });
  app.get("/review/update/:id/edit/json", (req, res) => {
    const reviewEditId = req.params.id;
    const reviewEditSql = "select * from reviewData where id=?";
    conn.query(reviewEditSql, [reviewEditId], (err, result) => {
      if (err) {
        console.log(err);
        throw new Error();
      }
      res.send(result);
    });
  });
  app.post("/review/update/:id/edit/json", (req, res) => {
    const editId = req.params.id;
    const title = req.body.title;
    const sub_title = req.body;
    const category = req.body;
    const content = req.body;
    const image = req.body;
    const editQuery =
      "update reviewData set title=?,sub_title=?,category=?,content=?,image=? where id=?";
    conn.query(
      editQuery,
      [title, sub_title, category, content, image, editId],
      (err, result) => {
        if (err) {
          console.log(err);
          throw new Error();
        }
      }
    );
  });

  app.post("/review/profile/json", (req, res) => {
    const userId = req.body.userId;
    const profileSql = "select * from reviewData where userId=?";

    conn.query(profileSql, [userId], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  });

  app.post("/review/search/json", (req, res) => {
    const search = req.body.query;
    const searchQquery = `select * from reviewData where concat(title,content,sub_title) like '%${search}%'`;
    conn.query(searchQquery, (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    });
  });

  app.get("/review/movie/json", (req, res) => {
    const movieSql = "select * from reviewData where category='영화'";
    conn.query(movieSql, (err, result) => {
      if (err) {
        console.log(err);
        throw new Error();
      }
      res.send(result);
    });
  });

  app.get("/review/book/json", (req, res) => {
    const bookSql = "select * from reviewData where category='도서'";
    conn.query(bookSql, (err, result) => {
      if (err) {
        console.log(err);
        throw new Error();
      }
      res.send(result);
    });
  });
  app.get("/review/album/json", (req, res) => {
    const albumSql = "select * from reviewData where category='앨범'";
    conn.query(albumSql, (err, result) => {
      if (err) {
        console.log(err);
        throw new Error();
      }
      res.send(result);
    });
  });
};
