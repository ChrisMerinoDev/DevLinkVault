"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import SmartInput from "@/components/ui/smartInput";

export default function ProfilePage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(""); // for preview + final display
  const [avatarFile, setAvatarFile] = useState<File | null>(null); // raw file for upload
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

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

  // ⚠️ prevent memory leaks when previewing multiple images
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
    if (file) {
      setAvatarFile(file);
      const tempUrl = URL.createObjectURL(file);
      setAvatar(tempUrl);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return;

    const formData = new FormData();
    formData.append("username", username);
    formData.append("bio", bio);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

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
      return;
    }

    setAvatar(data.user.avatar); // refresh preview with final URL
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

        <div className="space-y-3 flex-col justify-items-center">
            <label className="block text-sm font-medium text-gray-700">Profile picture</label>

          

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {avatar && (
                <div className="justify-items-center">
              <div className="flex w-20 h-20 mt-2.5">
                <Image
                  src={avatar.startsWith('/')
                    ? `${process.env.NEXT_PUBLIC_BASE_URL}${avatar}`
                    : avatar}
                  alt="User avatar"
                  width={80}
                  height={80}
                  priority={true}
                  className="rounded-full object-cover border border-gray-300 shadow-md"
                />
              </div>
                    {/* <p className="text-md font-medium mt-3">Image Preview</p> */}
            </div>
            )}

            <button
              type="button"
              onClick={handleClickUpload}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Choose File
            </button>
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
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
}
