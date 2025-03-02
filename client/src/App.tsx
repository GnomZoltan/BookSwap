import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/signIn/SignIn";
import SignUp from "./pages/signUp/SignUp";
import Welcome from "./pages/welcome/Welcome";
import Home from "./pages/home/Home";
import './App.css'
import AddBook from "./pages/addBook/AddBook";
import Profile from "./pages/profile/Profile";
import BookInfo from "./pages/book/BookInfo";
import Wishlist from "./pages/wishlist/Wishlist";
import EditProfile from "./pages/editProfile/EditProfile";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
          <Route path="/book/:id" element={<BookInfo />} />
          <Route path="/add-book/:id?" element={<AddBook />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App
