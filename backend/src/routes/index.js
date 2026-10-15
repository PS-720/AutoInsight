import { Router } from "express";
import { authenticate, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/http.js";
import { login, me, register, updateProfile } from "../controllers/auth.js";
import {
  createCar,
  deleteCar,
  getCar,
  listCars,
  updateCar,
} from "../controllers/cars.js";
import {
  createDiscussion,
  createPost,
  createPostComment,
  createReply,
  createReview,
  deleteReview,
  listDiscussions,
  listPostComments,
  listPosts,
  listReplies,
  listReviews,
  updateReview,
  votePost,
} from "../controllers/content.js";
import { getStore, publicUser } from "../services/store.js";

const router = Router();
const post = (handler) => [asyncHandler(handler)];

router.get("/health", (_request, response) =>
  response.json({
    success: true,
    service: "autoinsight-api",
    time: new Date().toISOString(),
  }),
);
router.post("/auth/register", ...post(register));
router.post("/auth/login", ...post(login));
router.get("/auth/me", authenticate, ...post(me));
router.put("/auth/profile", authenticate, ...post(updateProfile));
router.get("/cars", ...post(listCars));
router.get("/cars/:id", ...post(getCar));
router.post("/cars", authenticate, requireAdmin, ...post(createCar));
router.put("/cars/:id", authenticate, requireAdmin, ...post(updateCar));
router.delete("/cars/:id", authenticate, requireAdmin, ...post(deleteCar));
router.get("/reviews", ...post(listReviews));
router.post("/reviews", authenticate, ...post(createReview));
router.put("/reviews/:id", authenticate, ...post(updateReview));
router.delete("/reviews/:id", authenticate, ...post(deleteReview));
router.get("/posts", ...post(listPosts));
router.post("/posts", authenticate, ...post(createPost));
router.get("/posts/:id/comments", ...post(listPostComments));
router.post("/posts/:id/comments", authenticate, ...post(createPostComment));
router.post("/posts/:id/vote", authenticate, ...post(votePost));
router.get("/discussions", ...post(listDiscussions));
router.post("/discussions", authenticate, ...post(createDiscussion));
router.get("/discussions/:id/replies", ...post(listReplies));
router.post("/discussions/:id/replies", authenticate, ...post(createReply));
router.get(
  "/profile",
  authenticate,
  ...post(async (request, response) => {
    const store = await getStore();
    response.json({
      success: true,
      user: publicUser(request.user),
      reviews: store.reviews.filter((item) => item.userId === request.user.id),
      posts: store.posts.filter((item) => item.userId === request.user.id),
      discussions: store.discussions.filter(
        (item) => item.userId === request.user.id,
      ),
    });
  }),
);
router.get(
  "/admin/stats",
  authenticate,
  requireAdmin,
  ...post(async (_request, response) => {
    const store = await getStore();
    response.json({
      success: true,
      stats: {
        users: store.users.length,
        cars: store.cars.length,
        reviews: store.reviews.length,
        posts: store.posts.length,
        discussions: store.discussions.length,
      },
    });
  }),
);

export default router;
