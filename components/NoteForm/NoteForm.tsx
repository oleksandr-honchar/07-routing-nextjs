// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { createNote } from "@/lib/api";
// import type { CreateNotePayload } from "@/lib/api";
// import type { Note } from "../../types/note";
// import css from "./NoteForm.module.css";

// export interface NoteFormProps {
//   onAdd: (note: Note) => void;
//   onCancel: () => void;
// }

// const NoteSchema = Yup.object().shape({
//   title: Yup.string()
//     .min(3, "Title must be at least 3 characters")
//     .max(50, "Title must be at most 50 characters")
//     .required("Title is required"),
//   content: Yup.string().max(500, "Content must be at most 500 characters"),
//   tag: Yup.string()
//     .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
//     .required("Tag is required"),
// });

// export default function NoteForm({ onAdd, onCancel }: NoteFormProps) {
//   const queryClient = useQueryClient();

//   const mutation = useMutation({
//     mutationFn: (payload: CreateNotePayload) => createNote(payload),
//     onSuccess: (newNote) => {
//       onAdd(newNote);
//       queryClient.invalidateQueries({ queryKey: ["notes"] });
//     },
//     onError: (err) => {
//       console.error("Failed to create note", err);
//     },
//   });

//   return (
//     <Formik
//       initialValues={{
//         title: "",
//         content: "",
//         tag: "Todo" as CreateNotePayload["tag"],
//       }}
//       validationSchema={NoteSchema}
//       onSubmit={(values, { resetForm }) => {
//         mutation.mutate(values, {
//           onSuccess: () => {
//             resetForm();
//           },
//         });
//       }}
//     >
//       {({ isSubmitting }) => (
//         <Form className={css.form}>
//           <div className={css.formGroup}>
//             <label htmlFor="title">
//               Title
//             </label>
//             <Field
//               className={css.input}
//               id="title"
//               type="text"
//               name="title"
//               placeholder="Title"
//             />
//             <ErrorMessage name="title" component="span" className={css.error} />
//           </div>

//           <div className={css.formGroup}>
//             <label htmlFor="content">
//               Content
//             </label>
//             <Field
//               as="textarea"
//               id="content"
//               name="content"
//               rows={8}
//               className={css.textarea}
//               placeholder="Content"
//             />
//             <ErrorMessage
//               name="content"
//               component="span"
//               className={css.error}
//             />
//           </div>

//           <div className={css.formGroup}>
//             <label htmlFor="tag">Tag</label>
//             <Field as="select" id="tag" name="tag" className={css.select}>
//               <option value="Todo">Todo</option>
//               <option value="Work">Work</option>
//               <option value="Personal">Personal</option>
//               <option value="Meeting">Meeting</option>
//               <option value="Shopping">Shopping</option>
//             </Field>
//             <ErrorMessage name="tag" component="span" className={css.error} />
//           </div>

//           <div className={css.actions}>
//             <button
//               type="button"
//               onClick={onCancel}
//               className={css.cancelButton}
//             >
//               Cancel
//             </button>
//             <button
//               className={css.submitButton}
//               type="submit"
//               disabled={isSubmitting || mutation.isPending}
//             >
//               {mutation.isPending ? "Creating..." : "Create note"}
//             </button>
//           </div>
//         </Form>
//       )}
//     </Formik>
//   );
// }

"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { CreateNotePayload } from "@/lib/api";

export interface NoteFormProps {
  onAdd: (payload: CreateNotePayload) => void; 
  onCancel: () => void;
}

const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title must be at most 50 characters")
    .required("Title is required"),
  content: Yup.string().max(500, "Content must be at most 500 characters"),
  tag: Yup.string()
    .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"], "Invalid tag")
    .required("Tag is required"),
});

export default function NoteForm({ onAdd, onCancel }: NoteFormProps) {
  return (
    <Formik
      initialValues={{
        title: "",
        content: "",
        tag: "Todo" as CreateNotePayload["tag"],
      }}
      validationSchema={NoteSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        setSubmitting(true);
        onAdd(values);      
        resetForm();      
        setSubmitting(false);
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field
              id="title"
              name="title"
              type="text"
              placeholder="Title"
              className={css.input}
            />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field
              as="textarea"
              id="content"
              name="content"
              rows={8}
              className={css.textarea}
              placeholder="Content"
            />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              onClick={onCancel}
              className={css.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create note"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
