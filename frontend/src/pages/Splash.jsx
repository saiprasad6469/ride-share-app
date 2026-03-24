import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Splash(){

const navigate = useNavigate();

useEffect(()=>{
setTimeout(()=>{
navigate("/login")
},2000)
},[])

return(

<div className="h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-100 to-cyan-100">

<h1 className="text-4xl font-bold text-blue-600">ShareRide</h1>

<p className="mt-4 text-gray-600">Ride Sharing Platform</p>

</div>

)
}

export default Splash   