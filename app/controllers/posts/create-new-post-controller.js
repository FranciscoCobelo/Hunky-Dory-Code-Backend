const { createNewPostDB } = require("../../repositories/posts.repository");
const { response, request } = require("express");
const createJsonError = require("../../errors/create-json-error");

async function createNewPost(req = request, res = response) {
  try {
    const { title, content, tech:technology } = req.body;
    const { id: postedBy } = req.auth;

    const post = {
      title,
      content,
      technology,
      postedBy,
    };

    const postId = await createNewPostDB(post);

    res.status(201).json({
      id: postId,
      msg: "Post created successfully",
    });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = { createNewPost };
