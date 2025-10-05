import { useQuery } from "@tanstack/react-query";
import { getPosts, type Post } from "../services/postService";
import { Table, Loader, Center, TextInput, Pagination } from "@mantine/core";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PostsPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const postsPerPage = 10;

  const {
    data: posts,
    isLoading,
    isError,
    error,
  } = useQuery<Post[]>({
    queryKey: ["posts", search],
    queryFn: async () => {
      const data = await getPosts();
      if (!search) return data;
      return data.filter(
        (post) =>
          post.title.toLowerCase().includes(search.toLowerCase()) ||
          post.body.toLowerCase().includes(search.toLowerCase())
      );
    },
  });

  const handleSearch = (value: string) => {
    setSearchParams({ search: value, page: "1" });
  };

  const handlePageChange = (newPage: number) => {
    setSearchParams({ search, page: newPage.toString() });
  };

  if (isLoading)
    return (
      <Center style={{ height: "100vh" }}>
        <Loader />
      </Center>
    );

  if (isError)
    return (
      <Center style={{ height: "100vh" }}>
        <div>
          Ошибка загрузки постов: {error?.message || "Неизвестная ошибка"}
        </div>
      </Center>
    );

  if (!posts?.length)
    return (
      <Center style={{ height: "100vh" }}>
        <div>Посты не найдены</div>
      </Center>
    );

  const paginatedPosts = posts.slice(
    (page - 1) * postsPerPage,
    page * postsPerPage
  );

  return (
    <>
      <TextInput
        placeholder="Поиск по заголовку или содержимому"
        value={search}
        onChange={(e) => handleSearch(e.currentTarget.value)}
        mb="md"
      />
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Заголовок</th>
          </tr>
        </thead>
        <tbody>
          {paginatedPosts.map((post) => (
            <tr
              key={post.id}
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate(`/posts/${post.id}`);
              }}
            >
              <td>{post.id}</td>
              <td>{post.title}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Pagination
        total={Math.ceil(posts.length / postsPerPage)}
        value={page}
        onChange={handlePageChange}
        mt="md"
      />
    </>
  );
}
