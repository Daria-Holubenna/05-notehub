import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import type { TagType } from "../../types/NoteTag";
import * as Yup from "yup";
import type NoteTag from "../../types/NoteTag";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/noteService";
import toast from "react-hot-toast";

interface OrderFormValue {
  title: string;
  content: string;
  tag: TagType;
}
interface NoteFormProps {
  onCancel: () => void;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
  content: Yup.string().max(500, "Content is too long"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
    .required("Tag is required"),
});

export default function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newNoteData: NoteTag) => createNote(newNoteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes"] });
      onCancel();
      toast.success("The note was created successfully!");
    },
    onError: (error) => {
      console.error("Ошибка создания заметки:", error);
      toast.error(
        "An error occurred while creating a note. No note was created!"
      );
    },
  });

  const handleSubmit = (
    values: OrderFormValue,
    { setSubmitting, resetForm }: FormikHelpers<OrderFormValue>
  ) => {
    //   console.log("Form submitted:", values);
    createMutation.mutate(values);
    setSubmitting(false);
    resetForm();
  };

  return (
    <Formik
      initialValues={{
        title: "",
        content: "",
        tag: "Todo",
      }}
      onSubmit={handleSubmit}
      validationSchema={validationSchema}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" className={css.error} component="div" />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
              as="textarea"
            />
            <ErrorMessage
              name="content"
              className={css.error}
              component="div"
            />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field id="tag" name="tag" className={css.select} as="select">
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" className={css.error} component="div" />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting || createMutation.isPending}
            >
              Create note
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
