import Input from "../components/Input"

const AddLoppis = () => {

  return (
    <section>
      <h2>Lägg till en loppis</h2>
      {/*här ska man kunna upload images*/}

      <form action="">
        <Input
          label='Rubrik'
          type='text' />
        <Input label='Adress' type='text' />
        <Input label='Datum/Tider' type='text' />
        <Input label='Beskrivning' type='text' />
        <Input label='Telefonnummer' type='text' />

        <Input label='E-post' type='email' />
        <Input label='Länk till hemsida' type='url' />

      </form>
    </section>
  )
}

export default AddLoppis