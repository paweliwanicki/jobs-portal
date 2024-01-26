import OfferList from '../OfferList/OfferList';
import classes from './Dashboard.module.scss';
const Dashboard = () => {
  return (
    <div className={classes.dashboard}>
      <OfferList />
    </div>
  );
};

export default Dashboard;
