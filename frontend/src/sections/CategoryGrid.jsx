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
    <section className="w-full max-w-3xl mt-10 px-4 sm:px-8">
      <h2 className="text-xl font-semibold mb-4">Sök efter kategori</h2>
      <div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {categories.map(cat =>
          <CardLink
            key={cat.label}
            icon={cat.icon}
            label={cat.label}
            to={`/search?category=${cat.label}`}
            className='hover:bg-hover hover:shadow-md'
          />)}
        {/* TODO: ändra bakgrundsfärg på korten? */}
      </div>
    </section>
  )
}

export default CategoryGrid