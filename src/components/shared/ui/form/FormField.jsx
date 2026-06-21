const FormField = ({ label, error, htmlFor, children }) => {
  return (
    <div className="my-3">
      {label && (
      <label htmlFor={htmlFor} className='flex flex-col'>
        {label}
      </label>
    )}

      {children}

      {error && (
        <span className='text-xs flex flex-col mt-1 italic text-red-700'>
          *{error}
        </span>
      )}
    </div>
  );
};

export default FormField;
