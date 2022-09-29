import { useState, useEffect } from 'react'
import {BiTrashAlt} from 'react-icons/bi'
import './App.css'
export const App = () =>{
  const [total, setTotal] = useState(0)
  const [revenue, setRevenue] = useState(0)
  const [expenses, setExpenses] = useState(0)
  const [register, setRegister] = useState([])
  const [loading, setLoading] = useState(true)
  const [refresh, setRefresh] = useState(true)
  const [name, setName] = useState('')
  const [moneyEntry, setMoneyEntry] = useState(true)
  const [category, setCategory] = useState()
  const [amount, setAmount] = useState()
  const [date, setDate] = useState('')
  useEffect(()=>{
    setLoading(true)
    const loadData = async() =>{
      const resp = await fetch("http://localhost:5000/registers")
      .then((res) => res.json())
      .then((data) => data)
      setLoading(false)
      setRegister(resp)
    }
    loadData()
  },[])
  useEffect(()=>{
    setRevenue(0)
    setExpenses(0)
    register.map((atual) => {
      if(atual.moneyEntry){
        setRevenue((prevCount) => prevCount + atual.amount)
      }
      else{
        setExpenses((prevCount) => prevCount + atual.amount)
      }
    })    
    }, [loading, refresh])
  useEffect(()=>{
    const hello = () =>{
      setTotal(revenue - expenses)}
    hello()
  })
  const submit = async (e) =>{
    setRefresh(true)
    e.preventDefault()
    const newRegister = {
      id: Math.random(),
      name,
      moneyEntry,
      category,
      amount,
      date
    }
    await fetch('http://localhost:5000/registers', {
      method: "POST",
      body: JSON.stringify(newRegister),
      headers: {
        "Content-Type": "application/json",
      }
    })
    setRegister((prevState) => [...prevState, newRegister])
    setName('')
    setCategory()
    setRefresh(false)
  }
  const registerDelete = async (id) => {
    setRefresh(true)
    await fetch('http://localhost:5000/registers/' + id, {
      method: "DELETE",
    })
    setRegister((prevState) => prevState.filter((register) => register.id !== id))
    setRefresh(false)
  }
  if(loading){
    return (
      <div className='container'>
        <h1 className="title-loading">Finance Control</h1>
        <div className='loading-div'>
          <div className="loading-animation">
          <div className="stick1"></div>
          <div className="stick2"></div>
          <div className="stick3"></div>
        </div>
          <p>loading</p>
        </div>
      </div>
    )
  }
  return(
    <div className="container">
      <header>
        <h1 className="title">Finance Control</h1>
        <h2 className='credits'>by <a href="">Salah Developer</a></h2>
      </header>

        <div className="balance">
          <div className="total">
            <p className='total-title'>total:</p>
            <p className="total-value">$ {total}</p>
          </div>
          <div className='revenue'>
            <p className='revenue-title'>revenue:</p>
            <p className='revenue-value'>$ {revenue}</p>
          </div>
          <div className='expenses'>
            <p className="expenses-title">expenses:</p>
            <p className="expenses-value">$ {expenses}</p>
          </div>
        </div>

        <div className="add-menu">
          <form onSubmit={submit}>
            <legend className='add-menu-legend'>add register</legend>
            <div className='name'>
              <label htmlFor="">name:</label>
              <input 
              onChange={(e) => setName(e.target.value)} type="text" 
              value={name || ""}
              required/>
            </div>
            <div className='type'>
              <legend>Type:</legend>
                <div className="money money-entry">
                  <input required
                  defaultChecked
                  onClick={() => setMoneyEntry(true)}
                  id='gain'
                  type="radio"
                  name='type'/>
                  <label htmlFor="gain">money entry</label>
                </div>
                <div className="money money-out">
                  <input onClick={() => setMoneyEntry(false)}id='moneyOut' type="radio" name='type'/>
                  <label htmlFor="moneyOut">money out</label>
                </div>
            </div>
            <div className="category">
              <label htmlFor="select">category:</label>
              {moneyEntry ? 
              <select required onClick={(e) => setCategory(e.target.value)}>
                <option></option>
                <option value='salary'> salary</option>
                <option value='sale'> sale</option>
                <option value='service'> service</option>
                <option value="other">other</option>
                <option value="investiment">investiment</option>
              </select>
              :
              <select required onClick={(e) => setCategory(e.target.value)}>
                <option></option>
                <option value="market">market</option>
                <option value="home">home</option>
                <option value="fun">fun</option>
                <option value="investiment">investiment</option>
                <option value="other">other</option>
              </select>}
            </div>
            <div className="amount">
              <label htmlFor="">amount:</label>
              <input step={0.01} onChange={(e) => setAmount(e.target.valueAsNumber)}
              type="number"
              required/>
            </div>
            <div className='date'>
              <label htmlFor="">date:</label>
              <input
              onChange={(e) => setDate(e.target.value)}  
              type="date"
              value={date || ""}
              required/>
            </div>
            <button type='submit'>add register</button>
          </form>
        </div>

        <div className="register">
          {register.length === 0 && <p className='without-register'>without register</p>}
          {register.map((item) =>( 
          <div className='register-div' key={item.id}> 
            <p className='name-register'>{item.name}</p>
            <p className={`amount-register ${item.moneyEntry && 'positive'}`}>$ {item.moneyEntry !== true && '-'}{item.amount}</p>
            <time className='date-register'>{item.date}</time>
            <p className='category-register'>{item.category}</p>
            <BiTrashAlt className='delete-button' onClick={() => registerDelete(item.id)}/>
          </div> ))}
        </div>
    </div>
  )
  
}