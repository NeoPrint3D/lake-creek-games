import { Suspense, lazy } from "react";
import { UserProvider } from "./contexts/user";
import { Routes, Route } from "react-router-dom";

const Header = lazy(() => import("./components/Header"));
const Home = lazy(() => import("./pages/Home"));
const Upload = lazy(() => import("./pages/Upload"));
const Admin = lazy(() => import("./pages/Admin"));

function App() {
  //make the header always at the top

  return (
    <div className="bg-gradient-to-tr from-blue-400 to-purple-400  overflow-y-auto bg-cover ">
      <UserProvider>
        <>
          <Suspense
            fallback={
              <main>
                <h5 className="animate-bounce text-5xl">Loading...</h5>
              </main>
            }
          >
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/Admin" element={<Admin />} />
              <Route path="/upload" element={<Upload />} />
            </Routes>
          </Suspense>
        </>
      </UserProvider>
    </div>
  );
}

export default App;
