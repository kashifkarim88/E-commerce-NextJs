
import AllProductsList from './components/allProductsList/page'
import Hero from './components/allProductsList/Hero';
import Footer from '../app/components/FooterComponents/page'


export default function Home() {
  return (
    <main className="w-full">
      <Hero />
      <AllProductsList />
      <Footer />
    </main>
  );
}
