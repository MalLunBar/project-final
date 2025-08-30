import LoppisCard from "../components/LoppisCard";

const ListView = ({ loppisList }) => {
  return (
    <section className='h-full w-full px-2 sm:px-5 md:p-2 bg-white border-r border-border shadow-sm overflow-y-auto'>
      <h2 className="sr-only">Sökresultat listvy</h2>
      <div className='flex flex-col gap-2 divide-y divide-border py-5 '>
        <div className='flex pb-2 justify-between gap-2 text-sm md:text-base'>
          <div className='flex flex-col gap-x-1 min-[360px]:flex-row'>
            <p className='font-medium'>Antal träffar:</p>
            <p>{loppisList.length} st</p>
          </div>
          <div className='flex flex-col items-end gap-x-1 min-[360px]:flex-row'>
            <p className='font-medium'>Sortera på:</p>
            {/* TODO: sortering logik och dropdown med alternativ */}
            <p>Senast tillagda</p>
          </div>

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