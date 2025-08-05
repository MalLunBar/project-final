
const LoppisCard = ({ loppis }) => {
  return (
    <article>
      <h3>{loppis.tile}</h3>
      <p>{loppis.startDate} - {loppis.endDate}</p>
      <p>{loppis.location}</p>
      {/* Additional loppis details can be added here */}
    </article>
  )
}

export default LoppisCard