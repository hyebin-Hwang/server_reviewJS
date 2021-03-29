const conn = require("../mysql");
const cors = require("cors");
const express = require("express");

module.exports = function (app) {
  app.use(cors());
  app.use(express.json());

  app.get("/review/reviewData", (req, res) => {
    conn.query("select * from reviewData order by id desc", (err, result) => {
      res.send(result);
    });
  });
  app.post("/review/user/id", (req, res) => {
    const userId = req.body.user.id;
    conn.query("select * from userData", (err, result) => {
      const DB_userId = result.map((user) => user.user_id);
      DB_userId.map((user) => {
        if (user === userId) {
          return res.send(true);
        }
      });
      if (err) {
        console.log(err);
      }
    });
  });
  app.post("/review/user/nickname", (req, res) => {
    const nickname = req.body.user.nickname;
    conn.query("select * from userData", (err, result) => {
      const DB_nickname = result.map((user) => user.user_nickname);
      DB_nickname.map((user) => {
        if (user === nickname) return res.json(true);
      });
    });
  });
  app.post("/review/user", (req, res) => {
    const { id, password, nickname } = req.body;
    const user_add_sql =
      "insert into userData (user_id,user_password,user_nickname) values(?,?,?)";
    conn.query(user_add_sql, [id, password, nickname], (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    });
  });

  app.post("/review/login", (req, res) => {
    const { id, password } = req.body;
    conn.query("select * from userData", (err, result) => {
      const currentUser = result.find(
        (userData) =>
          userData.user_id === id && userData.user_password === password
      );
      res.json(currentUser.user_nickname);
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

  app.get("/review/updateData/:id", (req, res) => {
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
  app.post("/review/updateData/:id/comment", (req, res) => {
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
  app.get("/review/updateData/:id/comment", (req, res) => {
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
  app.post("/review/updateData/:id/comment/delete", (req, res) => {
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
  app.post("/review/updateData/:id/comment/edit", (req, res) => {
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

  app.get("/review/updateData/:id/edit", (req, res) => {
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
  app.post("/review/updateData/:id/edit/click", (req, res) => {
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
  app.post("/review/updateData/:id/delete", (req, res) => {
    let content_id = req.body.contentId;
    let contentDeleteSql = "delete from reviewData where id=?";
    conn.query(contentDeleteSql, [content_id], (err, result) => {
      if (err) {
        console.log(err);
        throw new Error();
      }
    });
  });

  app.post("/review/profile", (req, res) => {
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

  app.post("/review/search", (req, res) => {
    const search = req.body.query;
    const searchQquery = `select * from reviewData where concat(title,content,sub_title) like '%${search}%'`;
    conn.query(searchQquery, (err, result) => {
      if (err) {
        console.log(err);
      }
      res.send(result);
    });
  });

  app.get("/review/category/movie", (req, res) => {
    const movieSql = "select * from reviewData where category='영화'";
    conn.query(movieSql, (err, result) => {
      if (err) {
        console.log(err);
        throw new Error();
      }
      res.send(result);
    });
  });
  app.get("/review/category/book", (req, res) => {
    const bookSql = "select * from reviewData where category='도서'";
    conn.query(bookSql, (err, result) => {
      if (err) {
        console.log(err);
        throw new Error();
      }
      res.send(result);
    });
  });
  app.get("/review/category/album", (req, res) => {
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
