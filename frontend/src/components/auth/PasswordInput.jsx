import { useState } from "react";


function PasswordInput({
  value,
  onChange
}) {

  const [show, setShow] = useState(false);


  return (

    <div>

      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder="Password"
        className="
          w-full
          border
          rounded-lg
          p-3
        "
      />


      <button
        type="button"
        onClick={() => setShow(!show)}
        className="
          text-sm
          text-blue-600
        "
      >
        {
          show 
          ? "Hide"
          : "Show"
        }

      </button>

    </div>

  );
}


export default PasswordInput;