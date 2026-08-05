import { useState } from "react";
import { Link } from "react-router-dom";
import InputField from "../../components/auth/InputField";
import PasswordInput from "../../components/auth/PasswordInput";
import AuthButton from "../../components/auth/AuthButton";

import {
  validateEmail,
  validatePassword
} from "../../utils/validators";


function Register(){

const [username,setUsername] = useState("");

const [email,setEmail] = useState("");

const [password,setPassword] = useState("");

const [confirmPassword,setConfirmPassword] = useState("");

const [error,setError] = useState("");



function handleSubmit(e){

e.preventDefault();


if(!username){

setError("Username is required");
return;

}


if(!validateEmail(email)){

setError("Invalid email");
return;

}


if(!validatePassword(password)){

setError("Password must be 8 characters");
return;

}


if(password !== confirmPassword){

setError("Passwords do not match");
return;

}



console.log({

username,

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
bg-gray-100
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

Create Account

</h1>



{
error &&

<p className="
text-red-500
text-sm
">

{error}

</p>

}



<InputField

type="text"

placeholder="Username"

value={username}

onChange={(e)=>setUsername(e.target.value)}

/>



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



<InputField

type="password"

placeholder="Confirm Password"

value={confirmPassword}

onChange={(e)=>setConfirmPassword(e.target.value)}

/>



<AuthButton>

Register

</AuthButton>
<Link
to="/login"
className="text-blue-600"
>
Already have account?
Login
</Link>


</form>


</div>

)


}


export default Register;