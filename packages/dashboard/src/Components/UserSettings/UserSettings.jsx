import VerticalTabMenu from '../VerticalTabMenu';
import PurchaseHistory from './PurchaseHistory/PurchaseHistory';
import PaymentSettings from './PaymentSettings';

const UsersSettings = () => {
  const labels = ['Purchase History', 'Payment Settings'];
  return(
    <VerticalTabMenu labels={labels} >
      <PurchaseHistory/>
      <PaymentSettings/>
    </VerticalTabMenu>
  );
}
export default UsersSettings