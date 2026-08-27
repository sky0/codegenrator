import Postcard from './Postcard';

export default function PostcardGrid({ postcards, filter }) {
  const filtered = filter === 'all'
    ? postcards
    : postcards.filter((c) => c.difficulty === filter);

  if (!filtered.length) {
    return (
      <p className="text-center text-ink-400 py-12">No postcards match this filter.</p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filtered.map((card, i) => (
        <Postcard key={card.id} card={card} index={i} />
      ))}
    </div>
  );
}
