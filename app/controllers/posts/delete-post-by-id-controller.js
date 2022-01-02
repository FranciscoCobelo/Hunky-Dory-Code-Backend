"use strict";
const createJsonError = require("../../errors/create-json-error");
const throwJsonError = require("../../errors/throw-json-error");
const { response, request } = require("express");
const { deletePost } = require("../../repositories/posts.repository");

async function deletePostById(req = request, res = response) {
  try {
    const { id } = req.params;
    const affectedColumns = await deletePost(id);
    if (!affectedColumns) {
      throwJsonError(400, `Invalid specified post id: ${id} `);
    }

    res.status(201).json({ affectedColumns });
  } catch (error) {
    createJsonError(error, res);
  }
}

module.exports = {
  deletePostById,
};
