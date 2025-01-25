
import PropTypes from 'prop-types';

const Home = ({ userName }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    return (
        <div className="home">
            <h1>{`${getGreeting()}, ${userName}!`}</h1>
        </div>
    );
};

Home.propTypes = {
    userName: PropTypes.string.isRequired,
};

export default Home;
