import React from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function PasswordInput({ value, onChange, placeholder }) {
  const [isShowPassword, setIsShowPassword] = React.useState(false);
  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };

  return (
    <div className="flex items-center bg-transparent border-b-2 border-gray-400 mb-4 py-1 outline-none">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder={placeholder || "Password"}
        className="w-full bg-transparent outline-none"
      />
      {isShowPassword ? (
        <FaRegEye
          onClick={() => toggleShowPassword()}
          className="text-blue-500 cursor-pointer"
          size={18}
        />
      ) : (
        <FaRegEyeSlash
          onClick={() => toggleShowPassword()}
          className="text-gray-400 cursor-pointer"
          size={18}
        />
      )}
    </div>
  );
}

export default PasswordInput;
