import SidebarNotes from "./@sidebar/default";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <SidebarNotes />
      <main style={{ flex: 1 }}>{children}</main>
    </div>
  );
}
