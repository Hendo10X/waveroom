import { Logout } from "./logout";

export function Navbar() {
  return (
    <div className="flex justify-end items-center p-4">
      <Logout />
    </div>
  );
}
