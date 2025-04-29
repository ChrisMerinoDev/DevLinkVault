import { notFound } from 'next/navigation';
import { connectToDatabase } from '@/lib/mongoose';
import User from '@/models/user.model';
import Image from 'next/image';
import Link from 'next/link';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function PublicProfilePage({ params }: any) {
  const { username } = params;

  await connectToDatabase();
  const user = await User.findOne({ username }).select('username avatar bio');

  if (!user) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-indigo-50 px-6 py-10">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-200 space-y-4 text-center">
        {user.avatar && (
          <Image
            src={user.avatar}
            alt={user.username}
            width={80}
            height={80}
            priority
            className="w-24 h-24 mx-auto rounded-full object-cover"
          />
        )}
        <h1 className="text-2xl font-bold text-indigo-700">@{user.username}</h1>
        {user.bio && <p className="text-gray-600">{user.bio}</p>}

        <Link href="/dashboard/profile/edit">
          <button className="font-semibold text-white bg-indigo-600 px-4 py-2 rounded-lg hover:bg-indigo-800 transition hover:cursor-pointer">
            Edit Profile
          </button>
        </Link>
      </div>
    </main>
  );
}
