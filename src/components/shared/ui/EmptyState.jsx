function EmptyState({ children, className }) {
  return (
    <div className={`card text-center${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}

export default EmptyState;
