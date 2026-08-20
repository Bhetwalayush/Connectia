function AuthButton({ children, disabled = false }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="
w-full
bg-blue-600
text-white
rounded-lg
p-3
font-semibold
hover:bg-blue-700
disabled:cursor-not-allowed
disabled:opacity-60
"
    >
      {children}
    </button>
  );
}

export default AuthButton;
