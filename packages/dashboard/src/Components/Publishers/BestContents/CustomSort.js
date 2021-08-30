const CustomSort = (firstItem,secondItem) => {
    let result = secondItem.totalAmount - firstItem.totalAmount
    if(result === 0){
        result = secondItem.visits - firstItem.visits
        if(result === 0){
            return secondItem.payments - firstItem.payments
        }
        return result
    }
    return result
}
export default CustomSort