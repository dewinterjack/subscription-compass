"use client";

import { useState } from "react";
import { updateUserName } from "@/app/actions/update-profile";
import { toast } from "sonner";

export default function EditableProfile({
  initialName,
  userId,
  email,
}: {
  initialName: string | null;
  userId: string;
  email: string | null;
}) {
  const [name, setName] = useState(initialName ?? "");
  const [isEditing, setIsEditing] = useState(!initialName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Username cannot be empty");
      return;
    }
    try {
      await updateUserName(userId, name);
      setIsEditing(false);
      toast.success("Username updated successfully");
    } catch (error) {
      console.error("Error updating user name:", error);
      toast.error("Error updating user name");
    }
  };

  const renderForm = () => (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="rounded border px-2 py-1"
        placeholder="Enter username"
      />
      <button
        type="submit"
        className="rounded bg-blue-500 px-2 py-1 text-white"
      >
        Save
      </button>
      {initialName && (
        <button
          type="button"
          onClick={() => {
            setIsEditing(false);
            setName(initialName);
          }}
          className="rounded bg-gray-300 px-2 py-1"
        >
          Cancel
        </button>
      )}
    </form>
  );

  return (
    <div className="space-y-2">
      {isEditing ? (
        renderForm()
      ) : (
        <div className="flex items-center space-x-2">
          <span>{name}</span>
          <button onClick={() => setIsEditing(true)} className="text-blue-500">
            Edit
          </button>
        </div>
      )}
      {email && (
        <p className="text-sm text-gray-600 dark:text-gray-400">{email}</p>
      )}
    </div>
  );
}
