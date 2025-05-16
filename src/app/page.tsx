import Paper from "../components/Paper";
import { paperSections } from "../content/paperContent";

export default function Home() {
  return (
    <div className="flex flex-col items-center mt-12">
      {paperSections.map(({ title, description }) => (
        <Paper key={title}>
          <h2 className="font-cinzel text-3xl mb-4">{title}</h2>
          <p className="font-roboto text-lg">{description}</p>
        </Paper>
      ))}
    </div>
  );
}