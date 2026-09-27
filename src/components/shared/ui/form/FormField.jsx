import { Children, Fragment, cloneElement, isValidElement, useId } from 'react';

/**
 * Recursively walk the field's children and inject the error wiring
 * (aria-describedby / aria-invalid) into any plain DOM element (input, select,
 * textarea). Component children (e.g. react-select/Controller) are left alone
 * because they don't forward these props to the rendered control.
 */
function injectAria(node, { error, errorId }) {
  return Children.map(node, (child) => {
    if (!isValidElement(child)) return child;

    if (child.type === Fragment) {
      return cloneElement(child, {}, injectAria(child.props.children, { error, errorId }));
    }

    if (typeof child.type === 'string') {
      const existing = child.props['aria-describedby'];
      const describedBy = error
        ? [existing, errorId].filter(Boolean).join(' ')
        : existing;

      return cloneElement(child, {
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : child.props['aria-invalid'],
      });
    }

    return child;
  });
}

const FormField = ({ label, error, htmlFor, children }) => {
  const reactId = useId();
  const errorId = `${htmlFor || reactId}-error`;

  return (
    <div className='my-3'>
      {label && (
        <label htmlFor={htmlFor} className='flex flex-col'>
          {label}
        </label>
      )}

      {injectAria(children, { error, errorId })}

      {error && (
        <span className='field-error' id={errorId} role='alert'>
          {error}
        </span>
      )}
    </div>
  );
};

export default FormField;
