const PersonForm = ({submit, newName, name, newNumber, number}) => {
  return (
    <form onSubmit={submit}>
        <div>name: <input value={newName} onChange={name} /></div>
        <div>number: <input value={newNumber} onChange={number}/></div>
        <div><button type="submit">add</button></div>
    </form>
  )
}

export default PersonForm