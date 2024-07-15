import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar/Navbar";
import { getCategories } from "./category/services";
import { getNotifications } from "./notifications/services";

interface IRootLayoutProps {
  children: React.ReactNode;
}

// export const metadata = {
//   title: "Jm3eia dot com",
//   verification: {
//     google: "YejFgWHiYkJdIY9hniJYUP1oZAP8PT4ZVZsPkQYBOgc",
//   },
// };

export default async function RootLayout({ children }: IRootLayoutProps) {
  const categories = await getCategories();
  const notifications = await getNotifications();
  console.log("notifications", notifications);
  return (
    <div>
      <Navbar
        categories={categories && categories.data ? categories.data : []}
        notifications={notifications}
      />
      <>{children}</>
      <Footer />
    </div>
  );
}
