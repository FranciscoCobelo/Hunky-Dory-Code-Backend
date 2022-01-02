const { Router } = require('express');
const { check } = require("express-validator");
const { getPostLikes } = require('../controllers/posts/get-post-likes.controller');
const { managePostLike } = require('../controllers/posts/set-post-like.controller');
const { isExistingPost } = require('../helpers/db-validators');
const { validateJWT, fieldValidator } = require('../middlewares/index.middlewares');
const {createNewPost} = require("../controllers/posts/create-new-post-controller");
const {getAllPosts} = require("../controllers/posts/get-all-posts-controller");
const { isAdminRole } = require("../middlewares/role-validator");
const {getPostById} = require("../controllers/posts/get-posts-by-id-controller");
const { isTechnologyExistingById } = require("../helpers/db-validators");
const { deletePostById } = require("../controllers/posts/delete-post-by-id-controller");
const { postAuthorshipValidator } = require("../middlewares/post-authorship-validator");

const router = Router();

// Public routes
router.get('/:id/likes', [
    check('id', 'Id is required.').not().isEmpty(),
    check('id', 'Invalid id').isNumeric(),
    check('id').custom( isExistingPost ),
    fieldValidator
], getPostLikes );

// Private routes
router.post('/:id/likes', [
    validateJWT,
    check('id', 'Answer id is required.').not().isEmpty(),
    check('id', 'Invalid answer id').isNumeric(),
    check('id').custom( isExistingPost ),
    fieldValidator
], managePostLike );

router.get(
    "/",
    [
      validateJWT,
      isAdminRole,
    ],
    getAllPosts
  );

  router.get(
    "/:id",
    validateJWT,
    getPostById
  );

  router.post(
    "/",
    [
      validateJWT,
      check("title", "The title field is required.")
        .not()
        .isEmpty()
        .isLength({ min: 10, max: 120 }),
      check("content", "The content field is required.")
        .not()
        .isEmpty()
        .isLength({ min: 10, max: 2000 }),
      check("tech", "The tech field is required.")
        .not()
        .isEmpty()
        .isLength({ min: 1, max: 15 })
        .custom(isTechnologyExistingById),
      fieldValidator,
    ],
    createNewPost
  );
  
  router.delete(
    "/:id",
    [
      validateJWT,
      postAuthorshipValidator,
    ],
    deletePostById
  );

module.exports = router;
