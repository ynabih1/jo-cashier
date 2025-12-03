import React,{useState,useEffect}from'react'
import axios from'axios'
const BACKEND='/api'
export default function App(){
 const[q,setQ]=useState('')
 const[products,setProducts]=useState([])
 const[cart,setCart]=useState([])
 async function fetchProducts(t=''){try{
  const r=await axios.get(`${BACKEND}/products`,{params:{q:t}})
  setProducts(r.data||[])
 }catch(e){alert("خطأ السيرفر")}}
 useEffect(()=>{fetchProducts()},[])
 const total=cart.reduce((s,i)=>s+i.price*i.qty,0)
 function add(p){
  setCart(c=>{
   const f=c.find(i=>i.product_id===p.id)
   if(f)return c.map(i=>i.product_id===p.id?{...i,qty:i.qty+1}:i)
   return[...c,{product_id:p.id,name:p.name,price:p.price,qty:1}]
  })
 }
 async function checkout(){
  if(!cart.length)return alert("السلة فارغة")
  try{
   const r=await axios.post(`${BACKEND}/sales`,{items:cart.map(i=>({product_id:i.product_id,qty:i.qty,price:i.price})),paid:total})
   alert("تم:" + r.data.invoice_no);setCart([])
  }catch(e){alert("فشل حفظ الفاتورة")}
 }
 return <div style={{padding:10}}>
  <h2>POS</h2>
  <input value={q} onChange={e=>setQ(e.target.value)}/>
  <button onClick={()=>fetchProducts(q)}>بحث</button>
  <div>{products.map(p=><div key={p.id}>{p.name} - {p.price}<button onClick={()=>add(p)}>أضف</button></div>)}</div>
  <h3>السلة</h3>
  {cart.map((c,i)=><div key={i}>{c.name} x {c.qty}</div>)}
  <div>الإجمالي: {total}</div>
  <button onClick={checkout}>حفظ فاتورة</button>
 </div>
}