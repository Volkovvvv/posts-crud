import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPost, updatePost, type Post } from "../services/postService";
import { Container, Button, Loader, Center } from "@mantine/core";
import PostModal from "../components/PostModal";
import { notifications } from "@mantine/notifications";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [opened, setOpened] = useState(false);

  const {
    data: post,
    isLoading,
    isError,
  } = useQuery<Post>({
    queryKey: ["post", id],
    queryFn: () => {
      return getPost(Number(id));
    },
    enabled: !!id,
  });

  const mutation = useMutation({
    mutationFn: (updatedData: Partial<Post>) =>
      updatePost(Number(id), updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      notifications.show({
        title: "Успех",
        message: "Пост успешно обновлен!",
        color: "green",
      });
      setOpened(false);
      navigate("/posts");
    },
    onError: () => {
      notifications.show({
        title: "Ошибка",
        message: "Ошибка при обновлении поста",
        color: "red",
      });
    },
  });

  if (isLoading)
    return (
      <Center style={{ height: "100vh" }}>
        <Loader />
      </Center>
    );

  if (isError || !post)
    return (
      <Center style={{ height: "100vh" }}>
        <div>Ошибка загрузки поста</div>
      </Center>
    );

  return (
    <Container size="sm" pt="xl">
      <div>ID: {post.id}</div>
      <div>Заголовок: {post.title}</div>
      <div>Содержимое: {post.body}</div>
      <Button onClick={() => setOpened(true)} mt="md">
        Редактировать
      </Button>
      <PostModal
        opened={opened}
        onClose={() => setOpened(false)}
        post={post}
        onSubmit={(data) => mutation.mutate(data)}
        loading={mutation.isPending}
      />
    </Container>
  );
}
