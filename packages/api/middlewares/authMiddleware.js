import admin from "../services/firebaseService.js";

const getTokenFromRequest = (req) => {
  let token = null;
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    throw new Error("Request has no token");
  }
  return token;
};

const getUserFromToken = async (token) => {
  return await admin.auth().verifyIdToken(token);
};

export const checkIfAuthenticated = async (req, res, next) => {
  try {
    const token = getTokenFromRequest(req);
    await getUserFromToken(token);
    return next();
  } catch (err) {
    return res
      .status(401)
      .send({ error: "You are not authorized to make this request" });
  }
};

export const checkIfPublisher = async (req, res, next) => {
  let user;
  try {
    const token = getTokenFromRequest(req);
    user = await getUserFromToken(token);
    if (!user.publisher) {
      throw new Error(`User ${user.email} tried to make a publisher request`);
    }
    res.locals.userId = user.user_id;
    return next();
  } catch (err) {
    console.error(err.message);
    return res
      .status(401)
      .send({ error: "You are not authorized to make this request" });
  }
};

export const checkIfUser = async (req, res, next) => {
  let user;
  try {
    const token = getTokenFromRequest(req);
    user = await getUserFromToken(token);
    if (!user.user) {
      throw new Error(`User ${user.email} tried to make a user request`);
    }
    res.locals.userId = user.user_id;
    return next();
  } catch (err) {
    console.error(err.message);
    return res
      .status(401)
      .send({ error: "You are not authorized to make this request" });
  }
};

export const checkIfAdmin = async (req, res, next) => {
  let user;
  try {
    const token = getTokenFromRequest(req);
    user = await getUserFromToken(token);
    if (!user.admin) {
      throw new Error(`User ${user.email} tried to make an admin request`);
    }
    res.locals.userId = user.user_id;
    return next();
  } catch (err) {
    console.error(err.message);
    return res
      .status(401)
      .send({ error: "You are not authorized to make this request" });
  }
};

export const checkIfIssuer = async (req, res, next) => {
  let user;
  try {
    const token = getTokenFromRequest(req);
    user = await getUserFromToken(token);
    if (!user.issuer) {
      throw new Error(`User ${user.email} tried to make a user request`);
    }
    res.locals.userId = user.user_id;
    return next();
  } catch (err) {
    console.error(err.message);
    return res
      .status(401)
      .send({ error: "You are not authorized to make this request" });
  }
};