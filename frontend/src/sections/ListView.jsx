import LoppisList from "../components/LoppisList";

const ListView = ({ loppisList }) => {
  return (
    <section className='h-full p-2 bg-white border-r border-border shadow-sm overflow-y-auto'>
      <div className='flex flex-col gap-2 divide-y divide-border'>
        <div className='flex pb-2 justify-between gap-2 text-sm'>
          <p>Antal Loppisar: {loppisList.length} st</p>

          {/* Sortera på: dropdown med alternativ */}
          <p>Sortera på: [dropdown v]</p>

        </div>

        <LoppisList loppisList={loppisList} />

        {/* Page selector */}
        <p>Page: 1 </p>

      </div>
    </section>
  )

}

export default ListView;