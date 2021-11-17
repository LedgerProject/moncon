const CustomSort = (firstItem, secondItem) => {
  let result = secondItem.conversion - firstItem.conversion;
  if (result === 0) {
    result = secondItem.visits - firstItem.visits;
    if (result === 0) {
      result = secondItem.payments - firstItem.payments;
      if(result === 0){
        return secondItem.totalAmount - firstItem.totalAmount
      }
      return result;
    }
    return result;
  }
  return result;
};
export default CustomSort;
