import Paper from "../components/Paper";
import { paperSections } from "../content/paperContent";
import MarkdownContent from "../components/MarkdownContent";

export default function Home() {
  return (
    <div className="flex flex-col items-center mt-12">
      {paperSections.map(({ title, description }) => (
        <Paper key={title}>
          <h2 className="font-cinzel text-4xl mb-4">{title}</h2>
          <MarkdownContent content={description} />
        </Paper>
      ))}
    </div>
  );
}