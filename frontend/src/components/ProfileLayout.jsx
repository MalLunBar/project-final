// components/ProfileLayout.jsx
import { ChevronLeft } from "lucide-react"

const ProfileLayout = ({
  title,
  bgUrl,
  showBack = false,
  onBack,
  children,
}) => {

  return (
    <main
      className="min-h-[calc(100vh-64px)] md:min-h-[calc(100vh-72px)] bg-center bg-no-repeat bg-cover "
      style={{ backgroundImage: `url(${bgUrl})` }}>

      <section
        className='mx-auto max-w-9xl px-6 py-8 md:py-12 md:px-8 md:mx-12'

      >
        <div className="mx-auto">
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
