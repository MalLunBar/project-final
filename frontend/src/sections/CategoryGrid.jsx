import { Baby, Lamp, Flower2, Shirt, Sofa, Book, Cat, Tv, CookingPot, Shapes } from 'lucide-react'
import CardLink from '../components/CardLink'

const CategoryGrid = () => {

  // TODO: fetch categories from api?
  const categories = [
    { label: "Vintage", icon: Lamp },
    { label: "Barn", icon: Baby },
    { label: "Trädgård", icon: Flower2 },
    { label: "Kläder", icon: Shirt },
    { label: "Möbler", icon: Sofa },
    { label: "Böcker", icon: Book },
    { label: "Husdjur", icon: Cat },
    { label: "Elektronik", icon: Tv },
    { label: "Kök", icon: CookingPot },
    { label: "Blandat", icon: Shapes }
  ]

  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 py-10">
      <h2 className="text-2xl font-bold">Sök efter kategori</h2>
      <div
        className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {categories.map(cat =>
          <CardLink
            key={cat.label}
            icon={cat.icon}
            iconColor={'icons'}
            label={cat.label}
            to={`/search?category=${cat.label}`}
            className='hover:bg-hover'
          />)}
        {/* TODO: ändra bakgrundsfärg på korten? */}
      </div>
    </section>
  )
}

export default CategoryGrid