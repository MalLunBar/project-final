import LoppisCard from "./LoppisCard"

const LoppisList = ({ loppisList }) => {


  return (
    <section className='font-primary flex p-2 flex-col gap-2'>
      {loppisList.map((loppis, index) => (
        <LoppisCard
          key={index}
          loppis={loppis} />
      ))}

    </section>
  )
}

export default LoppisList