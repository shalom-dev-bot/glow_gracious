import EventList from "./pages/EventList";
import EventDetail from "./pages/EventDetail";
import EventCreate from "./pages/EventCreate";

<Routes>
  {/* Core */}
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/activate/:token" element={<Activate />} />
  
  {/* Events */}
  <Route path="/events" element={<EventList />} />
  <Route path="/events/create" element={<EventCreate />} />
  <Route path="/events/:id" element={<EventDetail />} />
</Routes>
