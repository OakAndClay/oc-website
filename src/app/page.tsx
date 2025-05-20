import Paper from "../components/Paper";
import { paperSections } from "../content/paperContent";
import MarkdownContent from "../components/MarkdownContent";

export default function Home() {
  return (
    <div className="flex flex-col items-center mt-12">
      {paperSections.map(({ title, link, img, description }) => (
        <Paper key={title}>

          <h2 className="font-cinzel text-4xl mb-4">{title}</h2>
          {img && (
            <img
              src={img}
              alt={title}
              className="w-full h-auto shadow-lg mb-10"
            />
          )}
          <MarkdownContent content={description} />
          <div className="flex justify-right">
            <a
              href={link}
              className="mt-4 inline-block px-6 py-2 bg-gray-800 text-white font-semibold rounded shadow hover:bg-gray-700 transition-colors"
            >
              Explore
            </a>
          </div>

        </Paper>
      ))}
    </div>
  );
}