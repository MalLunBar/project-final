import LoppisList from "../components/LoppisList";

const ListView = ({ loppisList }) => {
  return (
    <section className='h-full p-2 bg-white border-r border-border shadow-sm overflow-y-auto'>

      {/* Sortera på: dropdown med alternativ */}

      {/* Antal träffar: X st */}

      <LoppisList loppisList={loppisList} />

      {/* Page selector */}

    </section>
  )

}

export default ListView;