import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome/Welcome';
import Home from './pages/Home/Home';
import AddBook from './pages/AddBook/AddBook';
import Profile from './pages/Profile/Profile';
import BookInfo from './pages/BookInfo/BookInfo';
import Wishlist from './pages/Wishlist/Wishlist';
import EditProfile from './pages/EditProfile/EditProfile';
import Chat from './pages/Chat/Chat';
import Conversations from './pages/Conversations/Conversations';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Welcome mode="signin" />} />
        <Route path="/signup" element={<Welcome mode="signup" />} />
        <Route element={<AppLayout />}>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/book/:id" element={<BookInfo />} />
          <Route path="/profile/:userId" element={<Profile />} />
          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/add-book/:id?" element={<AddBook />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/chat/:bookId/:userId" element={<Chat />} />
            <Route path="/conversations" element={<Conversations />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
