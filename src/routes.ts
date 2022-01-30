import {Express , Request , Response } from 'express';
import {
    createPostHandler,
    updatePostHandler,
    getPostHandler,
    deletePostHandler,
  } from "./controller/post.controller";
import { createUserHandler } from './controller/user.controller';
import { getUserSessionsHandler, invalidateUserSessionHandler } from './controller/session.controller';
import {createUserSessionHandler} from './controller/session.controller';
import { createUserSchema, createUserSessionSchema } from './schema/user.schema';
import {validateRequest,requiresUser} from './middleware';
import { createPostSchema, deletePostSchema, updatePostSchema } from './schema/post.schema';

export default function(app:Express){
    app.get("/",(req:Request,res:Response)=>res.sendStatus(200));
    app.get("/healthcheck",(req:Request,res:Response)=>res.sendStatus(200));

    // Register user
    app.post("/api/users",validateRequest(createUserSchema),createUserHandler);

    // Get Sessions
    app.get("/api/sessions",requiresUser,getUserSessionsHandler);

    // Login
    app.post("/api/sessions",validateRequest(createUserSessionSchema),createUserSessionHandler);

    // Logout
    app.delete("/api/sessions",requiresUser,invalidateUserSessionHandler);


      // Create a post
  app.post("/api/posts",
    [requiresUser, validateRequest(createPostSchema)],
    createPostHandler
  );

  // Update a post
  app.put(
    "/api/posts/:postId",
    [requiresUser, validateRequest(updatePostSchema)],
    updatePostHandler
  );

  // Get a post
  app.get("/api/posts/:postId", getPostHandler);

  // Delete a post
  app.delete(
    "/api/posts/:postId",
    [requiresUser, validateRequest(deletePostSchema)],
    deletePostHandler
  );
}

