const FormField = ({ label, error, htmlFor, children }) => {
  return (
    <div className='my-3'>
      {label && (
      <label htmlFor={htmlFor} className='flex flex-col'>
        {label}
      </label>
    )}

      {children}

      {error && (
        <span className='field-error'>
          *{error}
        </span>
      )}
    </div>
  );
};

export default FormField;
