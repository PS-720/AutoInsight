import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Admin from "./pages/Admin";
import Auth from "./pages/Auth";
import CarDetails from "./pages/CarDetails";
import Cars from "./pages/Cars";
import Compare from "./pages/Compare";
import Community from "./pages/Community";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Recommend from "./pages/Recommend";
import Review from "./pages/Review";
import Tips from "./pages/Tips";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/cars"
        element={
          <Layout>
            <Cars />
          </Layout>
        }
      />
      <Route
        path="/cars/:id"
        element={
          <Layout>
            <CarDetails />
          </Layout>
        }
      />
      <Route
        path="/compare"
        element={
          <Layout>
            <Compare />
          </Layout>
        }
      />
      <Route
        path="/compare/:firstId/:secondId"
        element={
          <Layout>
            <Compare />
          </Layout>
        }
      />
      <Route
        path="/recommend"
        element={
          <Layout>
            <Recommend />
          </Layout>
        }
      />
      <Route
        path="/community"
        element={
          <Layout>
            <Community />
          </Layout>
        }
      />
      <Route
        path="/tips"
        element={
          <Layout>
            <Tips />
          </Layout>
        }
      />
      <Route
        path="/review"
        element={
          <Layout>
            <Review />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route path="/login" element={<Auth />} />
      <Route path="/signup" element={<Auth signup />} />
      <Route path="/admin" element={<Admin />} />
      <Route
        path="*"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
    </Routes>
  );
}
