import { Suspense, lazy } from "react";
import { UserProvider } from "./contexts/user";
import { Routes, Route } from "react-router-dom";

const Home = lazy(() => import("./pages/Home"));
const Header = lazy(() => import("./components/Header"));
const Search = lazy(() => import("./pages/Search"));
const Upload = lazy(() => import("./pages/Upload"));
const Admin = lazy(() => import("./pages/Admin"));

export default function App() {
  //make the header always at the top
  return (
    <div className="bg-gradient-to-tr from-blue-400 to-purple-400  overflow-y-auto bg-cover min-h-screen">
      <UserProvider>
        <>
          <Suspense
            fallback={
              <div className="flex justify-center items-center main">
                <h5 className="animate-bounce text-5xl">Loading...</h5>
              </div>
            }
          >
            <div className="z-50">
              <Header />
            </div>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Admin" element={<Admin />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/search" element={<Search />} />

              <Route path="*" element={
                <div className="flex items-center justify-center main">
                  <h1 className="text-9xl">404</h1>
                </div>
              } />
            </Routes>
          </Suspense>
        </>
      </UserProvider>
    </div>
  );
}

