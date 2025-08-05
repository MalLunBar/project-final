import { useState } from 'react'

import Input from '../components/Input'
import Button from '../components/Button'
//Type adress fixas senare med google maps?

const AddLoppis = () => {

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Formulär skickat!')
  }

  return (
    <section>
      <h2>Lägg till en loppis</h2>
      {/*här ska man kunna upload images*/}

      <form onSubmit={handleSubmit}>
        <Input
          label='Rubrik'
          type='text'
          showLabel={false}
          required={true} />
        <Input
          label='Adress'
          type='text'
          showLabel={false}
          required={true} />
        <Input
          label='Datum/Tider'
          type='text'
          showLabel={false}
          required={true} />
        <Input
          label='Beskrivning'
          type='text'
          showLabel={false} />

        <select defaultValue='category'>
          <option value='category'>Kategori</option>
          <option value='someOption'>Some option</option>
          <option value='otherOption'>Other option</option>
        </select>

        <Button
          text='Lägg till loppis'
          type='submit'
          ariaLabel='Skapa loppis' />

      </form>
    </section>
  )
}

export default AddLoppis