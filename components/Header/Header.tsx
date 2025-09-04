// import Link from "next/link";
// import css from "./Header.module.css";

// export default function Header() {
//   return (
//   <header className={css.header}>
//     <Link href="/" aria-label="Home">
//       NoteHub
//     </Link>
//     <nav aria-label="Main Navigation">
//       <ul className={css.navigation}>
//         <li>
//           <Link href="/">Home</Link>
//         </li>
//         <li>
//           <Link href="/notes">Notes</Link>
//         </li>
//       </ul>
//     </nav>
      
//   </header>
//   );
// }

import Link from "next/link";
import TagsMenu from "@/components/TagsMenu/TagsMenu";
import css from "./Header.module.css";

const tags = [
  { name: "All notes", slug: "all" },
  { name: "Todo", slug: "todo" },
  { name: "Work", slug: "work" },
  { name: "Personal", slug: "personal" },
  { name: "Meeting", slug: "meeting" },
  { name: "Shopping", slug: "shopping" },
];

export default function Header() {
  return (
    <header className={css.header}>
      <Link href="/" aria-label="Home">
        NoteHub
      </Link>

      <nav aria-label="Main Navigation">
        <ul className={css.navigation}>
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <TagsMenu tags={tags} />
          </li>
        </ul>
      </nav>
    </header>
  );
}
