import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../../components/auth/InputField";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";


function Login(){

const [email,setEmail] = useState("");

const [password,setPassword] = useState("");



function handleSubmit(e){

e.preventDefault();

console.log({
email,
password
});

}



return (

<div className="
min-h-screen
flex
items-center
justify-center
">

<form

onSubmit={handleSubmit}

className="
bg-white
p-8
rounded-xl
shadow
w-96
space-y-4
"

>

<h1 className="
text-3xl
font-bold
text-center
">

Login

</h1>



<InputField

type="email"

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

/>



<PasswordInput

value={password}

onChange={(e)=>setPassword(e.target.value)}

/>



<AuthButton>

Login

</AuthButton>
<Link
to="/register"
className="text-blue-600"
>
Create account
</Link>


</form>


</div>

)

}


export default Login;