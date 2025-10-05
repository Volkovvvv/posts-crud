import { Routes, Route, Navigate } from "react-router-dom";
import PostsPage from "./pages/PostsPage";
import PostPage from "./pages/PostPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/posts" replace />} />
      <Route path="/posts" element={<PostsPage />} />
      <Route path="/posts/:id" element={<PostPage />} />
      <Route path="*" element={<Navigate to="/posts" replace />} />
    </Routes>
  );
}
