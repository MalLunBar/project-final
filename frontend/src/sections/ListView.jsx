import LoppisCard from "../components/LoppisCard";

const ListView = ({ loppisList }) => {
  return (
    <section className='h-full w-full px-2 sm:px-5 md:p-2 bg-white border-r border-border shadow-sm overflow-y-auto'>
      <h2 className="sr-only">Sökresultat listvy</h2>
      <div className='flex flex-col gap-2 divide-y divide-border py-5 '>
        <div className='flex pb-2 justify-between gap-2 text-sm md:text-base'>

          <p>Antal träffar: {loppisList.length} st</p>

          {/* Sortera på: dropdown med alternativ */}
          <p>Sortera på: --- </p>

        </div>

        <div className='grid gap-4 sm:px-4 lg:px-0 xl:px-4 pb-4' style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))' }}>
          {loppisList.map(loppis => (
            <LoppisCard key={loppis._id} loppis={loppis} />
          ))}
        </div>

        {/* Page selector */}
        <p className='text-center'>Page: 1 </p>

      </div>
    </section>
  )

}

export default ListView;