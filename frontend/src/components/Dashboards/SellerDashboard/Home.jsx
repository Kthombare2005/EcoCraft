
// import PropTypes from 'prop-types';

// const Home = ({ userName }) => {
//     const getGreeting = () => {
//         const hour = new Date().getHours();
//         if (hour < 12) return 'Good Morning';
//         if (hour < 18) return 'Good Afternoon';
//         return 'Good Evening';
//     };

//     return (
//         <div className="home">
//             <h1>{`${getGreeting()}, ${userName}!`}</h1>
//         </div>
//     );
// };

// Home.propTypes = {
//     userName: PropTypes.string.isRequired,
// };

// export default Home;




import PropTypes from "prop-types";
import { Card, CardContent } from "@/components/ui/card";
import { Bar, Line } from "react-chartjs-2";

const Home = ({ userName }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Total Scrap Sold (₹)",
        data: [10000, 12000, 15000, 14000, 16000, 18000],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Environmental Impact (kg)",
        data: [80, 90, 100, 120, 140, 160],
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const cardData = [
    { title: "Total Scrap Sold", value: "₹12,450", description: "↑ 12% from last month", icon: "💵" },
    { title: "Items Transformed", value: "28", description: "↑ 8% from last month", icon: "♻️" },
    { title: "Active Listings", value: "5", description: "Active now", icon: "📋" },
    { title: "Environmental Impact", value: "125 kg", description: "Waste reduced", icon: "🌍" },
  ];

  return (
    <div className="home p-6">
      <h1 className="text-2xl font-bold mb-4">{`${getGreeting()}, ${userName}! 🌙`}</h1>
      <p className="text-lg text-gray-600 mb-8">
        &#34;Sell your scrap, transform it into valuable products, and contribute to a more sustainable world!&#34;
      </p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {cardData.map((card, index) => (
          <Card key={index} className="shadow-md border p-4">
            <CardContent>
              <div className="flex items-center">
                <div className="text-4xl mr-4">{card.icon}</div>
                <div>
                  <h2 className="text-lg font-semibold">{card.title}</h2>
                  <p className="text-xl font-bold">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Performance Overview</h2>
          <Bar data={chartData} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Impact Over Time</h2>
          <Line data={chartData} />
          sjkfdhsjkf
        </div>
      </div>
    </div>
  );
};

Home.propTypes = {
  userName: PropTypes.string.isRequired,
};

export default Home;

