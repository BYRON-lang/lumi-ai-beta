import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/login.tsx"),
  route("home", "routes/home.tsx"),
  route("signup", "routes/signup.tsx"),
  route("signup-verify", "routes/signup-verify.tsx"),
  route("signup-name", "routes/signup-name.tsx"),
  route("login-verify", "routes/login-verify.tsx"),
  route("verify-email", "routes/verify-email.tsx"),
  route("auth-loading", "routes/auth-loading.tsx"),
  route("auth/callback", "routes/auth/callback.tsx"),
  route("notes", "routes/notes.tsx"),
  route("goals", "routes/goals.tsx"),
  route("reminders", "routes/reminders.tsx"),
  route("chat-history", "routes/chat-history.tsx"),
] satisfies RouteConfig;
