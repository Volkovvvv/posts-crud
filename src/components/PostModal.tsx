import { useEffect } from "react";
import { Modal, Button, Group, TextInput, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import type { Post } from "../services/postService";

interface PostModalProps {
  opened: boolean;
  onClose: () => void;
  post: Post;
  onSubmit: (data: Partial<Post>) => void;
  loading: boolean;
}

export default function PostModal({
  opened,
  onClose,
  post,
  onSubmit,
  loading,
}: PostModalProps) {
  const form = useForm({
    initialValues: {
      title: post.title,
      body: post.body,
    },
    validate: {
      title: (value) =>
        value.trim().length === 0
          ? "Обязательное поле"
          : value.trim().length < 3
          ? "Заголовок должен содержать минимум 3 символа"
          : null,
      body: (value) =>
        value.trim().length === 0
          ? "Обязательное поле"
          : value.trim().length < 10
          ? "Текст должен содержать минимум 10 символов"
          : null,
    },
  });

  useEffect(() => {
    form.setValues({
      title: post.title,
      body: post.body,
    });
    form.reset();
  }, [post, opened]);

  const handleSubmit = (values: typeof form.values) => {
    onSubmit(values);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Редактировать пост"
      centered
      size="sm"
    >
      <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
        <TextInput
          label="Заголовок"
          placeholder="Введите заголовок"
          {...form.getInputProps("title")}
          mb="sm"
          required
        />
        <Textarea
          label="Текст"
          placeholder="Введите текст поста"
          {...form.getInputProps("body")}
          mb="sm"
          required
          minRows={6}
        />
        <Group justify="right" mt="md">
          {" "}
          {/* Исправлено: position → justify */}
          <Button type="submit" loading={loading}>
            Сохранить
          </Button>
          <Button variant="outline" color="gray" onClick={onClose}>
            Отмена
          </Button>
        </Group>
      </form>
    </Modal>
  );
}
