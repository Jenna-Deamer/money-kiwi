export const formatSubCategory = (subCategory) => {
  if (subCategory === 'gic') return subCategory.toUpperCase();
  else {
    return subCategory
      .split(/_+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };
};
