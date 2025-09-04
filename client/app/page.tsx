import { Navbar } from '../components/landing/Navbar';

export default function Home() {
 
  return (
    <>
      <Navbar />
      <section className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-neutral-950">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-snug max-w-3xl">
          🚧 Collabify is still cooking... 🍳 <br />
          We’re currently mixing{" "}
          <span className="text-purple-400 font-extrabold">Notion</span>,{" "}
          <span className="text-blue-400 font-extrabold">Excalidraw</span>,{" "}
          <span className="text-pink-400 font-extrabold">slack</span>, and{" "}
          <span className="text-green-400 font-extrabold">Zoom</span> in one
          giant blender.
        </h1>

        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl">
          Spoiler: it’s a bit messy right now. 🫠 ✨ Soon you’ll be
          collaborating like never before — whiteboards, meetings, tasks, chaos,
          all in one place. Until then… enjoy this{" "}
          <span className="italic text-yellow-400">under-construction</span>{" "}
          masterpiece. 🏗️
        </p>

        {/* Features Section */}
        <div className="mt-10 text-left max-w-xl">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">
            ✨ Features you can explore soon
          </h2>
          <ul className="space-y-4 text-gray-300 text-lg">
            <li className="flex items-center gap-3">
              📂 <span className="text-blue-400 font-medium">File Manager</span>{" "}
              – Upload, organize & share files easily.
            </li>
            <li className="flex items-center gap-3">
              📝{" "}
              <span className="text-purple-400 font-medium">
                Notion-like Docs
              </span>{" "}
              – Write, plan & collaborate in one place.
            </li>
            <li className="flex items-center gap-3">
              🎨{" "}
              <span className="text-pink-400 font-medium">
                Whiteboard + Notes
              </span>{" "}
              – Brainstorm, sketch & drop sticky notes.
            </li>
            <li className="flex items-center gap-3">
              🔔{" "}
              <span className="text-green-400 font-medium">
                Notification System
              </span>{" "}
              – Stay updated without missing a beat.
            </li>
          </ul>
        </div>
      </section>
    </>
  );
}
