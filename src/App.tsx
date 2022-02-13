import { Suspense, lazy } from "react";
import { UserProvider } from "./contexts/user";
import { Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Home from "./pages/Home";
import Upload from "./pages/Upoad";

const Admin = lazy(() => import("./pages/Admin"));

function App() {
  return (
    <div className="bg-gradient-to-tr from-blue-500 to-purple-400 h-screen  overflow-y-auto ">
      <UserProvider>
        <>
          <Header />
          <Suspense
            fallback={
              <main>
                <h5 className="animate-bounce text-5xl">Loading...</h5>
              </main>
            }
          >
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
