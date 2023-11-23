import React from "react";

const CategoryForm = ({ handleSubmit, value, setValue }) => {
  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter new category"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <button
          type="submit"
          className="font-semibold bg-gradient-to-r from-blue-600 via-indigo-700 to-indigo-900 
                        text-gray-100 rounded-full ring-2 ring-blue-200 px-6 py-2 
                        hover:bg-white hover:text-gray-400 hover:ring-slate-300"
        >
          Submit
        </button>
      </form>
    </>
  );
};

export default CategoryForm;
