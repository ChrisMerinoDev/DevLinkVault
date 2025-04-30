"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SmartInput from "@/components/ui/smartInput";

export default function ProfilePage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(""); // URL for preview
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      const res = await fetch("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      const data = await res.json();
      setUsername(data.user.username);
      setAvatar(data.user.avatar || "");
      setBio(data.user.bio || "");
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

  useEffect(() => {
    return () => {
      if (avatarFile) {
        URL.revokeObjectURL(avatar);
      }
    };
  }, [avatarFile, avatar]);

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > 30 * 1024 * 1024) {
      // Optional 30MB soft limit (can raise to 30MB if your backend allows)
      setError("Image file too large (max 30MB).");
      return;
    }

    setError("");
    setAvatarFile(file);
    setAvatar(URL.createObjectURL(file));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);
    if (avatarFile) formData.append("avatar", avatarFile);

    const res = await fetch("/api/user/update", {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      console.error(data.error || "Update failed");
      setError(data.error || "Something went wrong updating your profile.");
      return;
    }

    setAvatar(data.user.avatar); // final URL
    setAvatarFile(null);
    setSuccessMessage("Profile updated successfully!");

    setTimeout(() => {
      setSuccessMessage("");
      router.push("/dashboard");
      router.refresh();
    }, 1000);
  };

  if (loading) return <p className="p-6 text-gray-600">Loading profile...</p>;

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-indigo-50 px-4 py-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-gray-200 space-y-6">
        <h1>Edit Your Profile</h1>

        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Profile picture
          </label>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {avatar && (
            <div className="flex w-20 h-20 mt-2.5">
              <Image
                src={avatar}
                alt={username}
                width={80}
                height={80}
                className="rounded-full object-cover border border-gray-300 shadow-md"
              />

            </div>
          )}

          <button
            type="button"
            onClick={handleClickUpload}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition cursor-pointer"
          >
            Choose File
          </button>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {successMessage && (
          <p className="text-green-600 font-medium">{successMessage}</p>
        )}

        <form onSubmit={handleUpdate} className="space-y-5">
          <div>
            <label>Username</label>
            <SmartInput
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholderText="your username"
            />
          </div>

          <div>
            <label>Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us something about you..."
              className="border border-gray-300 rounded-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 transition h-24"
            />
          </div>

          <button
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 cursor-pointer"
          >
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
}
