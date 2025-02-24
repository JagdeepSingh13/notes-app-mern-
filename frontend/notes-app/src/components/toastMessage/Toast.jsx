import React from "react";
import { LuCheck } from "react-icons/lu";

function Toast({ isShown, message, type, onClose }) {
  return (
    <div>
      <div className="flex items-center gap-3 py-2 px-4">
        <div
          className={`w-10 h-10 flex items-center justify-center rounded-full ${
            type === "delete" ? "bg-red-500" : "bg-green-500"
          }`}
        >
          <LuCheck className="text-xl text-white" />
        </div>

        <p className="text-sm text-slate-800">Note Added</p>
      </div>
    </div>
  );
}

export default Toast;
