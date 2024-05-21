
import './App.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { RouterUrl } from './routes';
import { LandingPage,Signup,Login, AdminDashboard, Accounts, AdminTalk, TravelAdventure, TravelBooking, TravelMaps, TravelPlan, AdminProfile, TravelProfile, TravelDashboard, TravelTalk, BusinessBooking, MyBusiness, BusinessProfile, BusinessDashboard, BusinessTalk, AdminBooking } from './pages';
import { Private, Public } from './layout';
import { Error } from './pages/error/error';
import TouristSelected from './pages/private/TravellerSide/Tourist';
import TouristSelectedBusiness from './pages/private/BusinessSide/Tourist';
function App() {
  const router = createBrowserRouter([
    {
      path: RouterUrl.LANDINGPAGE,
      element: <Public />,
      errorElement: <Error />,
      children:[
        {
          path: RouterUrl.LANDINGPAGE,
          element:<LandingPage />
        },
        {
          path: RouterUrl.SIGNUPPAGE,
          element:<Signup />
        },
        {
          path: RouterUrl.LOGIN,
          element:<Login />
        }
      ]
    },
    {
      path:RouterUrl.LANDINGPAGE,
      element : <Private />,
      children:[
        {path:RouterUrl.ADMINSIDE,element:<AdminDashboard/>},
        {path:RouterUrl.ADMINACCOUNTS,element:<Accounts/>},
        {path:RouterUrl.ADMINPROFILE,element:<AdminProfile/>},
        {path:RouterUrl.ADMINTRAVELTALK,element:<AdminTalk/>},
        {path:RouterUrl.ADMINBOOKING,element:<AdminBooking/>},
        {path:RouterUrl.TRAVELLERADVENTURE,element:<TravelAdventure/>},
        {path:RouterUrl.TRAVELLERBOOKING,element:<TravelBooking/>},
        {path:RouterUrl.TRAVELLERMAPS,element:<TravelMaps/>},
        {path:RouterUrl.TRAVELLERPLAN,element:<TravelPlan/>},
        {path:RouterUrl.TRAVELLERPROFILE,element:<TravelProfile/>},
        {path:RouterUrl.TRAVELLERSIDE,element:<TravelDashboard/>},
        {path:RouterUrl.TRAVELLERTALK,element:<TravelTalk/>},
        {path:RouterUrl.TOURISTSELECTED,element:<TouristSelected/>},
        {path:RouterUrl.BUSINESSBOOKING,element:<BusinessBooking/>},
        {path:RouterUrl.BUSINESSMINE,element:<MyBusiness/>},
        {path:RouterUrl.BUSINESSPROFILE,element:<BusinessProfile/>},
        {path:RouterUrl.BUSINESSSIDE,element:<BusinessDashboard/>},
        {path:RouterUrl.BUSINESSTALK,element:<BusinessTalk/>},
        {path:RouterUrl.TOURISTSELECTEDBUSINESS,element:<TouristSelectedBusiness/>},
      ]
    }
  ])
  return (
    <RouterProvider router={router} fallbackElement={<h6>Loading...</h6>} />
  )
}

export default App
