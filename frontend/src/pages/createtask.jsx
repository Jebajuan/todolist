import React from 'react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'

function createtask() {
    const [taskName,setTN]=useState("");
    const [inputValue,setIV]=useState("");
    const [items,setItems]=useState([]);
    const navigate=useNavigate();

    const handleCreation=async (e)=>{
        e.preventDefault();
        const req=await axios.post("http://localhost:3001/create",{
            taskName:taskName,
            tasks:items
        });
        const message=req.data.message
        const isCreate=req.data.isCreate
        if(!isCreate){
            alert(message)
        }else{
            navigate("/dashboard")
        }
    }

    const add=(e)=>{
        e.preventDefault();
        if(inputValue.trim()!== ''){
            setItems([...items,inputValue]);
            setIV('');
        }
    };

    const removeItem=(indexToRemove)=>{
        setItems(items.filter((_,index)=>index!==indexToRemove));
    };

  return (
    <div>
        <h1>Create a Task</h1>
        <form onSubmit={handleCreation}>
            <div>
                <label htmlFor="">Enter the task name:</label>
                <input type="text" value={taskName} onChange={(e)=>setTN(e.target.value)} required />
            </div>
            <div>
                <label htmlFor="">Enter the todo things:</label>
                <input type="text" value={inputValue} onChange={(e)=>setIV(e.target.value)}/>
                <button onClick={add}>Add</button>
            </div>
            {items.length>0 &&(
                <div>
                    <h3>Todo items</h3>
                    <ul>
                        {items.map((item,index)=>(
                            <li key={index}>{item}
                            <button type="button" onClick={()=>removeItem(index)} style={{marginLeft:'10px'}}>Remove</button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <button type='submit'>Add task</button>
        </form>
    </div>
  )
}

export default createtask;