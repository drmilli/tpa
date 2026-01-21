export default function BlogsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition">
          New Post
        </button>
      </div>
      <div className="bg-white rounded-lg shadow">
        <p className="p-6 text-gray-600">Blog management interface coming soon...</p>
      </div>
    </div>
  );
}
