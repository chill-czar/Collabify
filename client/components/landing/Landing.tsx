"use client"
import { Navbar } from "./Navbar";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">
            Collabify
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-4 text-balance">
            Real-time collaboration reimagined
          </p>
          <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto text-pretty">
            A unified platform for teams to brainstorm, manage projects, and
            collaborate seamlessly in real-time.
          </p>
          <button className="bg-black text-white px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-800 transition-colors">
            Get Started
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-balance">
            Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-2xl mb-4">📂</div>
              <h3 className="text-xl font-semibold mb-3">File Manager</h3>
              <p className="text-gray-600">
                Upload, organize, and manage files in the cloud.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-2xl mb-4">📝</div>
              <h3 className="text-xl font-semibold mb-3">Notion-style Docs</h3>
              <p className="text-gray-600">
                Create, edit, and collaborate on documents.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-2xl mb-4">🖊️</div>
              <h3 className="text-xl font-semibold mb-3">Whiteboard</h3>
              <p className="text-gray-600">
                Real-time collaborative whiteboard for brainstorming & design.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="text-2xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold mb-3">
                Realtime Backend with Convex
              </h3>
              <p className="text-gray-600">
                Low-latency data sync across all users.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 opacity-75">
              <div className="text-2xl mb-4">🔐</div>
              <h3 className="text-xl font-semibold mb-3">
                Authentication & Role-based Access
              </h3>
              <p className="text-gray-600">
                <em>Coming soon</em>
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200 opacity-75">
              <div className="text-2xl mb-4">💬</div>
              <h3 className="text-xl font-semibold mb-3">Team Collaboration</h3>
              <p className="text-gray-600">
                <em>Coming soon</em>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8 text-balance">
            Why Collabify?
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed text-pretty">
            Built for creators, designers, and developers, Collabify combines
            the best of Notion, Figma, and Dropbox into a single workspace.
            Streamline your workflow and make collaboration effortless.
          </p>
        </div>
      </section>

      {/* Call-to-Action Section */}
      <section id="cta" className="py-20 bg-black text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-8 text-balance">
            Ready to Collaborate Smarter?
          </h2>
          <button className="bg-white text-black px-8 py-4 rounded-md text-lg font-semibold hover:bg-gray-100 transition-colors">
            Get Started for Free
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">
            <p>&copy; Collabify 2025. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
