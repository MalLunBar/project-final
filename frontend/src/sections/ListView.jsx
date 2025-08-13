import LoppisList from "../components/LoppisList";

const ListView = ({ loppisList }) => {
  return (
    <section className='overflow-y-auto h-full p-2'>



      <LoppisList loppisList={loppisList} />

    </section>
  )

}

export default ListView;