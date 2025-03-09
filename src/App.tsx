import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ProtectedRoute } from './protectedRoute';

import Loader from './common/Loader';
import DefaultLayout from './layout/DefaultLayout';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Calendar from './pages/Calendar';
import Chart from './pages/Chart';
import ECommerce from './pages/Dashboard/ECommerce';
import FormElements from './pages/Form/FormElements';
import FormLayout from './pages/Form/FormLayout';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Tables from './pages/Tables';
import Alerts from './pages/UiElements/Alerts';
import Buttons from './pages/UiElements/Buttons';
import ViewSpeaker from './pages/Speaker/viewSpeaker';
import AddSpeaker from './pages/Speaker/addSpeaker';
import AddSponser from './pages/Sponser/addSponser';
import ViewSponser from './pages/Sponser/viewSponser';
import AddGalery from './pages/gallery/addGalery';
import ViewGalery from './pages/gallery/viewGalery';
import Query from './pages/query/query';
import AddEvent from './pages/Event/addEvent';
import EventList from './pages/Event/eventList';
import EventPrice from './pages/Event/addEventPrice';
import EventRegistration from './pages/Event/eventRegistration';
import EventAdd from './pages/Event/addEvent';
import EventPricList from './pages/Event/listEventPrice';
import AddEventPrice from './pages/Event/addEventPrice';
import ListEventVenue from './pages/Event/ListEventVenue';
import AddEventVenue from './pages/Event/addEventVenue';
import Agenda from "./pages/agenda"
import Home from './pages/home';
import About from './pages/about';
import NavigationSettings from './pages/navigation';
function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <AuthProvider>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/auth/signin" element={<SignIn />} />
        
        <Route path="/" element={<ProtectedRoute><DefaultLayout /></ProtectedRoute>}>
          <Route index element={<ECommerce />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="profile" element={<Profile />} />
          <Route path="forms/form-elements" element={<FormElements />} />
          <Route path="forms/form-layout" element={<FormLayout />} />
          <Route path="tables" element={<Tables />} />
          <Route path="settings" element={<Settings />} />
          <Route path="chart" element={<Chart />} />
          <Route path="ui/alerts" element={<Alerts />} />
          <Route path="ui/buttons" element={<Buttons />} />
          <Route path="speaker/add-speaker" element={<AddSpeaker />} />
          <Route path="speaker/view-speaker" element={<ViewSpeaker />} />
          <Route path="sponser/add-sponser" element={<AddSponser />} />
          <Route path="sponser/view-sponser" element={<ViewSponser />} />
          <Route path="gallery/add-gallery" element={<AddGalery />} />
          <Route path="gallery/view-gallery" element={<ViewGalery />} />
          <Route path="query/view-query" element={<Query />} />
          <Route path="event/event-list" element={<EventList />} />
          <Route path="add-event" element={<EventAdd />} />
          <Route path="event/event-price" element={<EventPricList />} />
          <Route path="add-event-price" element={<AddEventPrice />} />
          <Route path="event/event-venue-list" element={<ListEventVenue />} />
          <Route path="event-venue-add" element={<AddEventVenue />} />
          <Route path="event/event-registration" element={<EventRegistration />} />
          <Route path="page/home" element={<Home />} />
          <Route path="page/about" element={<About />} />
          <Route path="page/navigation" element={<EventRegistration />} />
          <Route path="agenda/" element={<Agenda />} />
          <Route path="nav/" element={<NavigationSettings />} />

        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;