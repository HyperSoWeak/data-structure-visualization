export default function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-center text-md text-gray-500 pb-12">
      <p className="text-md text-gray-400">
        Built with 💙 using Next.js, React, and Tailwind CSS.
        <br />
        &copy; {new Date().getFullYear()}{" "}
        <a
          href="https://github.com/HyperSoWeak"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline"
        >
          HyperSoWeak
        </a>
        . All rights reserved.
      </p>
    </footer>
  );
}
