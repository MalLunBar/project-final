import LoppisCard from "./LoppisCard"

const LoppisList = ({ loppisList }) => {
  return (
    <section>
      {loppisList.map((loppis, index) => (
        <LoppisCard
          key={index}
          loppis={loppis} />
      ))}
    </section>
  )
}

export default LoppisList