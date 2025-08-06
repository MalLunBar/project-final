import LoppisCard from "./LoppisCard"

const LoppisList = ({ loppises }) => {
  return (
    <section>
      {loppises.map((loppis, index) => (
        <LoppisCard
          key={index}
          loppis={loppis} />
      ))}
    </section>
  )
}

export default LoppisList