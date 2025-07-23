import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import type { TagType } from "../../types/NoteTag";
import * as Yup from "yup";


interface OrderFormValue {
    title: string,
    content: string,
    tag: TagType}


interface NoteFormProps{
    cancelButton: () => void;
    onSubmit: (values: OrderFormValue)=> void;
}
const validationSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title is too long")
    .required("Title is required"),
  content: Yup.string()
    .max(500, "Content is too long"), // Content не обов'язковий, але з обмеженням довжини
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping", ""], 'Невірний тег') // Додаємо "" до дозволених значень, якщо 'None' або порожній тег можливий
    .required("Tag is required"),
});
export default function NoteForm({cancelButton, onSubmit}:NoteFormProps) {

    const handleSubmit = (
  values: OrderFormValue,
  { setSubmitting, resetForm }: FormikHelpers<OrderFormValue>
) => {
  console.log("Form submitted:", values);
   onSubmit(values);
  setSubmitting(false);
  resetForm(); 
};

    return (
        <Formik initialValues={{
            title: "",
            content: "",
            tag: "Todo"
        }} onSubmit={handleSubmit}
          validationSchema={validationSchema}>
            
        <Form className={css.form}>
            <div className={css.formGroup}>
                <label htmlFor="title">Title</label>
                <Field id="title" type="text" name="title" className={css.input} />
                <ErrorMessage name="title" className={css.error} />
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
                <ErrorMessage name="content" className={css.error} />
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
                <ErrorMessage name="tag" className={css.error} />
            </div>

            <div className={css.actions}>
                <button type="button" className={css.cancelButton} onClick={cancelButton}>
                    Cancel
                </button>
                <button type="submit" className={css.submitButton} disabled={false}>
                    Create note
                </button>
            </div>
        </Form>
        </Formik>
    );
}
