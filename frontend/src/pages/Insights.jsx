const insightCards = [
  { title: 'Best posting time', body: 'Thursday at 6:30 PM drives the highest engagement for founder-focused content.' },
  { title: 'LinkedIn momentum', body: 'Thought leadership posts gained 22% more commentary when paired with a clear personal POV.' },
  { title: 'AI content lift', body: 'AI-assisted posts are generating 2.1x more saves and shares than manual drafts.' },
];

export default function Insights() {
  return (
    <div className="space-y-6">
      {insightCards.map((card) => (
        <div key={card.title} className="card">
          <h2 className="text-lg font-semibold">{card.title}</h2>
          <p className="mt-3 text-sm leading-6 text-text-2">{card.body}</p>
        </div>
      ))}
    </div>
  );
}
