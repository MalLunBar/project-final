// components/ProfileLayout.jsx
import { ChevronLeft } from "lucide-react"

const ProfileLayout = ({
  title,
  bgUrl,
  showBack = false,
  onBack,
  constrain = true,             // <— NYTT (default: inramad)
  children,
}) => {
  const frameClasses = constrain
    ? "mx-auto sm:min-w-lg md:min-w-xl lg:min-w-3xl xl:min-w-4xl"
    : ""

  return (
    <main className="flex flex-col items-center w-screen min-h-screen">
      <section
        className={`bg-center bg-no-repeat bg-cover bg-white/0 bg-blend-screen min-h-screen p-4 sm:p-6 md:p-8 lg:p-12 ${frameClasses}`}
        style={{ backgroundImage: `url(${bgUrl})` }}
      >
        <div className="mx-auto max-w-3xl">
          {showBack && (
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-sm mb-4 hover:underline"
            >
              <ChevronLeft className="w-4 h-4" />
              Till profil
            </button>
          )}

          {title && (
            <>
              <h1 className="text-2xl font-bold">{title}</h1>
              <hr className="mt-3 mb-4 border-gray-500" />
            </>
          )}

          {children}
        </div>
      </section>
    </main>
  )
}

export default ProfileLayout
