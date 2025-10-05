import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export const getPosts = async (): Promise<Post[]> => {
  const res = await api.get("/posts");
  return res.data;
};

export const getPost = async (id: number): Promise<Post> => {
  const res = await api.get(`/posts/${id}`);
  return res.data;
};

export const updatePost = async (
  id: number,
  data: Partial<Post>
): Promise<Post> => {
  const res = await api.put(`/posts/${id}`, data);
  return res.data;
};
