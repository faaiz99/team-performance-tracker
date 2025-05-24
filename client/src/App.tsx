import Header from "./components/Header";
import UserFeature from "./components/User/User";
import ReviewFeature from "./components/Review/Review";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2">
            <UserFeature />
          </div>
          <div className="w-full lg:w-1/2">
            <ReviewFeature />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App