import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import HomePage from "../src/pages/HomePage";
import SignIn from "../src/pages/SignIn";
// import { useAppContext } from "./contexts/AppContext";

const AppRoutes = () => {
  // const { isLoggedIn } = useAppContext();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout showSmallHeader={false} showBigHeader={true}>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/sign-in"
        element={
          <Layout showSmallHeader={true} showBigHeader={false}>
            <SignIn />
          </Layout>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
