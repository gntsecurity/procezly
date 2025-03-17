export default function Sidebar() {
  return (
    <aside className="w-64 h-full bg-gray-800 text-white p-4">
      <nav>
        <ul>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="/settings">Settings</a></li>
        </ul>
      </nav>
    </aside>
  );
}
