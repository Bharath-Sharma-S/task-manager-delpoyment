import React from "react";
import { IoLogOut } from "react-icons/io5";
const DeleteAlert = ({ value, content, onDelete }) => {
  return (
    <div>
      <p className="text-sm">{content}</p>

      <div className="flex justify-end mt-6">
        <button
          className="flex items-center justify-center gap-1.5 text-xs md:font-sm font-medium text-rose-500 whitespace-nowrap bg-rose-50 border border-rose-100 rounded-lg px-4 py-2 cursor-pointer"
          onClick={onDelete}
        >
          {value || "DELETE"}
          {value=='Logout' ? <IoLogOut className="text-rose-500"/>:''}

        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
