import { getStore, nextId, publicUser, saveStore } from "../services/store.js";
import { HttpError, paginate, parsePagination } from "../utils/http.js";
import {
  integer,
  optionalString,
  requiredString,
} from "../utils/validation.js";

function author(store, id) {
  const user = store.users.find((candidate) => candidate.id === id);
  return user
    ? { id: user.id, name: user.name, avatar: user.avatar || null }
    : null;
}

export async function listReviews(request, response) {
  const store = await getStore();
  let reviews = store.reviews.filter(
    (review) =>
      !request.query.carId || review.carId === Number(request.query.carId),
  );
  reviews = reviews
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((review) => ({ ...review, author: author(store, review.userId) }));
  response.json({
    success: true,
    ...paginate(reviews, ...Object.values(parsePagination(request.query))),
  });
}

export async function createReview(request, response) {
  const store = await getStore();
  const carId = integer(
    request.body.carId,
    "carId",
    1,
    Number.MAX_SAFE_INTEGER,
  );
  if (!store.cars.some((car) => car.id === carId))
    throw new HttpError(404, "Car not found.");
  const review = {
    id: nextId("reviews"),
    userId: request.user.id,
    carId,
    rating: integer(request.body.rating, "rating", 1, 5),
    title: requiredString(request.body.title, "title", 200),
    body: requiredString(request.body.body, "body", 10000),
    createdAt: new Date().toISOString(),
  };
  if (review.body.length < 100)
    throw new HttpError(400, "body must be at least 100 characters.");
  store.reviews.push(review);
  await saveStore();
  response.status(201).json({
    success: true,
    review: { ...review, author: author(store, request.user.id) },
  });
}

export async function listPosts(request, response) {
  const store = await getStore();
  const posts = store.posts
    .filter((post) => !request.query.type || post.type === request.query.type)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((post) => ({
      ...post,
      author: author(store, post.userId),
      comments: store.comments.filter((comment) => comment.postId === post.id)
        .length,
    }));
  response.json({
    success: true,
    ...paginate(posts, ...Object.values(parsePagination(request.query))),
  });
}

export async function createPost(request, response) {
  const store = await getStore();
  const type = requiredString(request.body.type || "tip", "type", 20);
  if (!["tip", "problem"].includes(type))
    throw new HttpError(400, "type must be tip or problem.");
  const post = {
    id: nextId("posts"),
    userId: request.user.id,
    type,
    title: requiredString(request.body.title, "title", 250),
    description: requiredString(request.body.description, "description", 10000),
    tags: Array.isArray(request.body.tags)
      ? request.body.tags
          .map((tag) => requiredString(tag, "tag", 40))
          .slice(0, 10)
      : [],
    votes: 0,
    createdAt: new Date().toISOString(),
  };
  store.posts.push(post);
  await saveStore();
  response.status(201).json({
    success: true,
    post: { ...post, author: author(store, request.user.id) },
  });
}

export async function listDiscussions(request, response) {
  const store = await getStore();
  const discussions = store.discussions
    .filter(
      (item) =>
        !request.query.category || item.category === request.query.category,
    )
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((item) => ({
      ...item,
      author: author(store, item.userId),
      replies: store.replies.filter((reply) => reply.discussionId === item.id)
        .length,
    }));
  response.json({
    success: true,
    ...paginate(discussions, ...Object.values(parsePagination(request.query))),
  });
}

export async function createDiscussion(request, response) {
  const store = await getStore();
  const discussion = {
    id: nextId("discussions"),
    userId: request.user.id,
    category:
      optionalString(request.body.category, "category", 80) ||
      "General Discussion",
    title: requiredString(request.body.title, "title", 250),
    body: requiredString(request.body.body, "body", 10000),
    views: 0,
    createdAt: new Date().toISOString(),
  };
  store.discussions.push(discussion);
  await saveStore();
  response.status(201).json({
    success: true,
    discussion: {
      ...discussion,
      author: author(store, request.user.id),
      replies: 0,
    },
  });
}

export async function listPostComments(request, response) {
  const store = await getStore();
  const postId = integer(
    request.params.id,
    "post id",
    1,
    Number.MAX_SAFE_INTEGER,
  );
  if (!store.posts.some((post) => post.id === postId))
    throw new HttpError(404, "Post not found.");
  response.json({
    success: true,
    comments: store.comments
      .filter((comment) => comment.postId === postId)
      .map((comment) => ({
        ...comment,
        author: author(store, comment.userId),
      })),
  });
}

export async function createPostComment(request, response) {
  const store = await getStore();
  const postId = integer(
    request.params.id,
    "post id",
    1,
    Number.MAX_SAFE_INTEGER,
  );
  if (!store.posts.some((post) => post.id === postId))
    throw new HttpError(404, "Post not found.");
  const comment = {
    id: nextId("comments"),
    postId,
    userId: request.user.id,
    text: requiredString(request.body.text, "text", 5000),
    createdAt: new Date().toISOString(),
  };
  store.comments.push(comment);
  await saveStore();
  response.status(201).json({
    success: true,
    comment: { ...comment, author: author(store, request.user.id) },
  });
}

export async function votePost(request, response) {
  const store = await getStore();
  const post = store.posts.find(
    (candidate) => candidate.id === Number(request.params.id),
  );
  if (!post) throw new HttpError(404, "Post not found.");
  const vote = integer(request.body.vote, "vote", -1, 1);
  if (vote === 0) throw new HttpError(400, "vote must be 1 or -1.");
  post.votes += vote;
  await saveStore();
  response.json({ success: true, votes: post.votes });
}

export async function listReplies(request, response) {
  const store = await getStore();
  const discussionId = integer(
    request.params.id,
    "discussion id",
    1,
    Number.MAX_SAFE_INTEGER,
  );
  if (!store.discussions.some((item) => item.id === discussionId))
    throw new HttpError(404, "Discussion not found.");
  response.json({
    success: true,
    replies: store.replies
      .filter((reply) => reply.discussionId === discussionId)
      .map((reply) => ({ ...reply, author: author(store, reply.userId) })),
  });
}

export async function createReply(request, response) {
  const store = await getStore();
  const discussionId = integer(
    request.params.id,
    "discussion id",
    1,
    Number.MAX_SAFE_INTEGER,
  );
  if (!store.discussions.some((item) => item.id === discussionId))
    throw new HttpError(404, "Discussion not found.");
  const reply = {
    id: nextId("replies"),
    discussionId,
    userId: request.user.id,
    text: requiredString(request.body.text, "text", 10000),
    createdAt: new Date().toISOString(),
  };
  store.replies.push(reply);
  await saveStore();
  response.status(201).json({
    success: true,
    reply: { ...reply, author: author(store, request.user.id) },
  });
}
