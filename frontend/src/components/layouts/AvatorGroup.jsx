import React from "react";

const AvatorGroup = ({ avators, maxVisible = 3 }) => {
  return (
    <div className="flex items-center">
      {avators.slice(0, maxVisible).map((avator, index) => {
        return (
          <img
            key={index}
            src={avator}
            alt={`Avator ${index}`}
            className="w-9 h-9 rounded-full border-2 border-white -ml-3 first:ml-0 object-cover"
          />
        );
      })}
      {avators.length > maxVisible && (
        <div className="w-9 h-9 items-center justify-center bg-blue-50 text-sm font-medium rounded-full border-2 border-white -ml-3">
          +{avators.length - maxVisible}
        </div>
      )}
    </div>
  );
};

export default AvatorGroup;
