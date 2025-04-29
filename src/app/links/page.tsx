'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

type Link = {
  _id: string;
  title: string;
  url: string;
};

export default function LinksPage() {
  const { token } = useAuth();

  const [links, setLinks] = useState<Link[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return; // Wait until token is available
  
    let didFetch = false; // Prevent double fetches
  
    const fetchLinks = async () => {
      if (didFetch) return;
      didFetch = true;
  
      const toastId = toast.loading('Fetching your links...');
  
      try {
        const res = await fetch('/api/links', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          console.error("Failed to fetch links:", data.error);
          toast.error(data.error || 'Failed to fetch links', { id: toastId });
          return;
        }
  
        setLinks(data.links);
        toast.success('Links loaded!', { id: toastId });
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error('Fetch error. Please try again.', { id: toastId });
      } finally {
        setLoading(false);
      }
    };
  
    fetchLinks();
  }, [token]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingId ? 'PUT' : 'POST';
    const endpoint = editingId ? `/api/links/${editingId}` : '/api/links';
  
    const toastMessage = editingId ? 'Updating link...' : 'Adding link...';
  
    const promise = fetch(endpoint, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title, url }),
    }).then(async (res) => {
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
  
      if (editingId) {
        setLinks((prev) =>
          prev.map((link) => (link._id === editingId ? data.link : link))
        );
        setEditingId(null);
      } else {
        setLinks((prev) => [...prev, data.link]);
      }
  
      setTitle('');
      setUrl('');
      return editingId ? 'Link updated!' : 'Link added!';
    });
  
    toast.promise(promise, {
      loading: toastMessage,
      success: (msg) => msg,
      error: (err) => err.message || 'Failed to save link',
    });
  };

  const handleEdit = (link: Link) => {
    setEditingId(link._id);
    setTitle(link.title);
    setUrl(link.url);
  };

  const handleDelete = async (id: string) => {
    if (editingId === id) {
      setEditingId(null);
      setTitle('');
      setUrl('');
    }
  
    setLinks((prev) => prev.filter((link) => link._id !== id));
  
    const res = await fetch(`/api/links/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (res.ok) {
      toast.success('Link deleted successfully!');
    } else {
      toast.error('Failed to delete link');
      try {
        const newRes = await fetch('/api/links', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await newRes.json();
        setLinks(data.links);
      } catch (err) {
        console.error('Failed to restore links:', err);
      }
    }
  };
  

  if (loading) {
    return <p className="flex w-screen h-screen justify-center items-center font-semibold">Loading your links...</p>
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-white to-indigo-50 px-6 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h1 className="text-2xl font-bold mb-4">My Links</h1>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <input
            type="text"
            placeholder="Link Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
          <input
            type="url"
            placeholder="https://your-link.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2"
            required
          />
          <button
            type="submit"
            className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 mr-3"
          >
            {editingId ? 'Update Link' : 'Add Link'}
          </button>
          
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setTitle('');
                setUrl('');
              }}
              className="cursor-pointer flex-row text-white border-2 px-4 py-2 bg-red-600 rounded-md hover:bg-red-700"
            >
              Cancel
            </button>
          )}
        <div>
          </div>
        </form>

        <ul className="space-y-4">
          {links.map((link) => (
            <li
              key={link._id}
              className="flex justify-between items-center bg-indigo-50 px-4 py-2 rounded shadow-sm"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-700 hover:underline"
              >
                {link.title}
              </a>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(link)}
                  className="cursor-pointer text-sm px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(link._id)}
                  className="cursor-pointer text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}